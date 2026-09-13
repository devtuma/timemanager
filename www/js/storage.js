// Storage Abstraction Layer
// Works with both localStorage (GitHub Pages) and PHP API (Hostinger)

class StorageManager {
    constructor() {
        // Try to detect if API is available
        this.API_URL = this.detectApiUrl();
        this.useAPI = false;
        this.checkApiAvailability();
    }

    detectApiUrl() {
        // If hosted on a PHP server, API will be in /api/
        // For GitHub Pages, API won't be available
        const currentDomain = window.location.origin;
        return `${currentDomain}/api`;
    }

    async checkApiAvailability() {
        try {
            const response = await fetch(`${this.API_URL}/ping.php`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            this.useAPI = response.ok;
        } catch (error) {
            this.useAPI = false;
            console.log('API not available, using localStorage');
        }
    }

    getToken() {
        return localStorage.getItem('auth_token');
    }

    setToken(token) {
        localStorage.setItem('auth_token', token);
    }

    removeToken() {
        localStorage.removeItem('auth_token');
    }

    async apiRequest(endpoint, method = 'GET', data = null) {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        const token = this.getToken();
        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        if (data && method !== 'GET') {
            options.body = JSON.stringify(data);
        }

        const url = `${this.API_URL}/${endpoint}`;
        const response = await fetch(url, options);

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Request failed');
        }

        return await response.json();
    }

    // ==================== AUTH METHODS ====================

    async register(name, email, password) {
        if (this.useAPI) {
            return await this.apiRequest('auth.php?action=register', 'POST', {
                name, email, password
            });
        } else {
            // Local storage simulation
            const users = JSON.parse(localStorage.getItem('users') || '[]');

            // Check if email already exists
            if (users.find(u => u.email === email)) {
                throw new Error('Email already registered');
            }

            const user = {
                id: Date.now().toString(),
                name,
                email,
                password: btoa(password), // Simple encoding (NOT secure for production!)
                created_at: new Date().toISOString()
            };

            users.push(user);
            localStorage.setItem('users', JSON.stringify(users));

            return { success: true, message: 'User registered successfully' };
        }
    }

    async login(email, password) {
        if (this.useAPI) {
            const result = await this.apiRequest('auth.php?action=login', 'POST', {
                email, password
            });

            if (result.token) {
                this.setToken(result.token);
                localStorage.setItem('user', JSON.stringify(result.user));
            }

            return result;
        } else {
            // Local storage simulation
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.email === email && u.password === btoa(password));

            if (!user) {
                throw new Error('Invalid email or password');
            }

            // Create a fake token
            const token = btoa(JSON.stringify({ userId: user.id, email: user.email }));
            this.setToken(token);
            localStorage.setItem('user', JSON.stringify(user));

            return {
                success: true,
                user: { id: user.id, name: user.name, email: user.email },
                token
            };
        }
    }

    logout() {
        this.removeToken();
        localStorage.removeItem('user');
        localStorage.removeItem('demo_mode');
    }

    getCurrentUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    isAuthenticated() {
        return !!this.getToken() || localStorage.getItem('demo_mode') === 'true';
    }

    isDemoMode() {
        return localStorage.getItem('demo_mode') === 'true';
    }

    // ==================== PROJECT METHODS ====================

    async getProjects() {
        if (this.useAPI && !this.isDemoMode()) {
            return await this.apiRequest('projects.php?action=list', 'GET');
        } else {
            // Local storage
            const userId = this.isDemoMode() ? 'demo' : this.getCurrentUser()?.id;
            const key = `projects_${userId}`;
            const projects = localStorage.getItem(key);
            return projects ? JSON.parse(projects) : [];
        }
    }

    async getProject(id) {
        if (this.useAPI && !this.isDemoMode()) {
            return await this.apiRequest(`projects.php?action=get&id=${id}`, 'GET');
        } else {
            const projects = await this.getProjects();
            return projects.find(p => p.id === id);
        }
    }

    async saveProject(project) {
        if (this.useAPI && !this.isDemoMode()) {
            const action = project.id ? 'update' : 'create';
            return await this.apiRequest(`projects.php?action=${action}`, 'POST', project);
        } else {
            // Local storage
            const userId = this.isDemoMode() ? 'demo' : this.getCurrentUser()?.id;
            const key = `projects_${userId}`;
            const projects = await this.getProjects();

            if (project.id) {
                // Update existing
                const index = projects.findIndex(p => p.id === project.id);
                if (index !== -1) {
                    project.updated_at = new Date().toISOString();
                    projects[index] = project;
                }
            } else {
                // Create new
                project.id = Date.now().toString();
                project.created_at = new Date().toISOString();
                project.updated_at = new Date().toISOString();
                projects.push(project);
            }

            localStorage.setItem(key, JSON.stringify(projects));
            return { success: true, project };
        }
    }

    async deleteProject(id) {
        if (this.useAPI && !this.isDemoMode()) {
            return await this.apiRequest(`projects.php?action=delete&id=${id}`, 'DELETE');
        } else {
            // Local storage
            const userId = this.isDemoMode() ? 'demo' : this.getCurrentUser()?.id;
            const key = `projects_${userId}`;
            const projects = await this.getProjects();
            const filtered = projects.filter(p => p.id !== id);
            localStorage.setItem(key, JSON.stringify(filtered));
            return { success: true };
        }
    }

    // ==================== EXPORT/IMPORT ====================

    exportProject(project) {
        const dataStr = JSON.stringify(project, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `${project.name.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.json`;
        link.click();

        URL.revokeObjectURL(url);
    }

    async importProject(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = async (e) => {
                try {
                    const project = JSON.parse(e.target.result);

                    // Remove ID to create a new project
                    delete project.id;
                    delete project.created_at;
                    delete project.updated_at;

                    project.name = `${project.name} (Imported)`;

                    const result = await this.saveProject(project);
                    resolve(result);
                } catch (error) {
                    reject(new Error('Invalid project file'));
                }
            };

            reader.onerror = () => reject(new Error('Error reading file'));
            reader.readAsText(file);
        });
    }
}

// Create global instance
const storage = new StorageManager();
