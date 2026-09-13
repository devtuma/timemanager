// Main App Controller

let currentView = 'projects';
let currentProject = null;
let projects = [];
let deleteProjectId = null;

// ==================== INITIALIZATION ====================

async function initApp() {
    // Check authentication
    if (!storage.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }

    // Load user info
    loadUserInfo();

    // Setup event listeners
    setupEventListeners();

    // Load projects
    await loadProjects();

    // Initialize i18n
    initI18n();
}

function loadUserInfo() {
    const user = storage.getCurrentUser();
    const userName = document.getElementById('userName');

    if (storage.isDemoMode()) {
        userName.textContent = translate('demo-mode') || 'Demo Mode';
    } else if (user) {
        userName.textContent = user.name;
    }
}

function setupEventListeners() {
    // Navigation
    document.getElementById('newProjectBtn').addEventListener('click', () => {
        currentProject = null;
        showEditView();
    });

    document.getElementById('backToProjects').addEventListener('click', () => {
        showProjectsView();
    });

    document.getElementById('logoutBtn').addEventListener('click', () => {
        storage.logout();
        window.location.href = 'login.html';
    });

    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // Language toggle
    document.getElementById('langToggle').addEventListener('click', () => {
        const currentLang = localStorage.getItem('language') || 'pt';
        const newLang = currentLang === 'pt' ? 'en' : 'pt';
        localStorage.setItem('language', newLang);
        location.reload();
    });

    // Search
    document.getElementById('searchProjects').addEventListener('input', (e) => {
        filterProjects(e.target.value);
    });

    // Project actions
    document.getElementById('saveProjectBtn').addEventListener('click', saveProject);
    document.getElementById('addPointBtn').addEventListener('click', addPoint);
    document.getElementById('exportBtn').addEventListener('click', exportCurrentProject);
    document.getElementById('importBtn').addEventListener('click', () => {
        document.getElementById('importFile').click();
    });

    document.getElementById('importFile').addEventListener('change', async (e) => {
        if (e.target.files.length > 0) {
            try {
                await storage.importProject(e.target.files[0]);
                await loadProjects();
                alert(translate('success-imported') || 'Project imported successfully!');
            } catch (error) {
                alert(error.message);
            }
            e.target.value = '';
        }
    });

    // Project time inputs
    document.getElementById('projectHours').addEventListener('change', updateProjectTime);
    document.getElementById('projectMinutes').addEventListener('change', updateProjectTime);
    document.getElementById('projectSeconds').addEventListener('change', updateProjectTime);

    // Apply saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.setAttribute('data-theme', savedTheme);
    }
}

// ==================== VIEW MANAGEMENT ====================

function showView(viewName) {
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });

    const targetView = document.getElementById(`${viewName}View`);
    if (targetView) {
        targetView.classList.add('active');
    }

    currentView = viewName;
}

function showProjectsView() {
    showView('projects');
    loadProjects();
}

function showEditView(project = null) {
    currentProject = project;
    showView('edit');

    if (project) {
        document.getElementById('editTitle').textContent = translate('edit-title');
        loadProjectIntoForm(project);
    } else {
        document.getElementById('editTitle').textContent = translate('btn-new-project');
        resetProjectForm();
    }
}

// ==================== PROJECTS LIST ====================

async function loadProjects() {
    try {
        projects = await storage.getProjects();
        renderProjects(projects);
    } catch (error) {
        console.error('Error loading projects:', error);
        alert(error.message);
    }
}

function renderProjects(projectsToRender) {
    const projectsList = document.getElementById('projectsList');
    const emptyState = document.getElementById('emptyState');

    if (projectsToRender.length === 0) {
        projectsList.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }

    projectsList.style.display = 'grid';
    emptyState.style.display = 'none';

    projectsList.innerHTML = projectsToRender.map(project => {
        const totalTime = formatTime(calculateProjectTotalTime(project));
        const pointsCount = project.points?.length || 0;

        return `
            <div class="project-card">
                <div class="project-card-header">
                    <div>
                        <div class="project-card-title">${escapeHtml(project.name)}</div>
                        <div class="project-card-meta">${pointsCount} ${translate('points-count')}</div>
                    </div>
                    <div class="project-card-time">${totalTime}</div>
                </div>
                <div class="project-card-actions">
                    <button class="btn-secondary" onclick="editProject('${project.id}')">${translate('btn-edit')}</button>
                    <button class="btn-primary" onclick="startProject('${project.id}')">${translate('btn-start')}</button>
                    <button class="btn-danger" onclick="deleteProjectConfirm('${project.id}')">🗑️</button>
                </div>
            </div>
        `;
    }).join('');
}

function filterProjects(searchTerm) {
    const filtered = projects.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    renderProjects(filtered);
}

// ==================== PROJECT EDITING ====================

function resetProjectForm() {
    document.getElementById('projectName').value = '';
    document.getElementById('projectHours').value = 0;
    document.getElementById('projectMinutes').value = 30;
    document.getElementById('projectSeconds').value = 0;
    document.getElementById('pointsList').innerHTML = '';
    updateProjectTime();
}

function loadProjectIntoForm(project) {
    document.getElementById('projectName').value = project.name;

    const totalSeconds = project.totalTime || 0;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    document.getElementById('projectHours').value = hours;
    document.getElementById('projectMinutes').value = minutes;
    document.getElementById('projectSeconds').value = seconds;

    renderPoints(project.points || []);
    updateProjectTime();
}

function renderPoints(points) {
    const pointsList = document.getElementById('pointsList');

    if (points.length === 0) {
        pointsList.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No points yet. Add your first point!</p>';
        return;
    }

    pointsList.innerHTML = points.map((point, index) => `
        <div class="point-item" data-index="${index}">
            <div class="point-header">
                <div class="point-number">${index + 1}</div>
                <div class="point-actions">
                    <button class="btn-secondary" onclick="movePoint(${index}, -1)">↑</button>
                    <button class="btn-secondary" onclick="movePoint(${index}, 1)">↓</button>
                    <button class="btn-danger" onclick="removePoint(${index})">🗑️</button>
                </div>
            </div>
            <div class="form-group">
                <label>${translate('point-placeholder')}</label>
                <input type="text" class="input-text point-title" value="${escapeHtml(point.title)}"
                       placeholder="${translate('point-placeholder')}" onchange="updatePoint(${index})">
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>${translate('label-hours')}</label>
                    <input type="number" class="input-number point-hours" min="0" max="23"
                           value="${Math.floor((point.duration || 0) / 3600)}" onchange="updatePoint(${index})">
                </div>
                <div class="form-group">
                    <label>${translate('label-minutes')}</label>
                    <input type="number" class="input-number point-minutes" min="0" max="59"
                           value="${Math.floor(((point.duration || 0) % 3600) / 60)}" onchange="updatePoint(${index})">
                </div>
                <div class="form-group">
                    <label>${translate('label-seconds')}</label>
                    <input type="number" class="input-number point-seconds" min="0" max="59"
                           value="${(point.duration || 0) % 60}" onchange="updatePoint(${index})">
                </div>
            </div>
            <div class="keywords-input">
                <label>${translate('keywords-title')}</label>
                <textarea class="input-text point-keywords" rows="3"
                          placeholder="${translate('keywords-placeholder')}"
                          onchange="updatePoint(${index})">${(point.keywords || []).join('\n')}</textarea>
            </div>
        </div>
    `).join('');

    updateProjectTime();
}

function addPoint() {
    const pointsList = document.getElementById('pointsList');
    const currentPoints = getCurrentPoints();

    currentPoints.push({
        title: '',
        duration: 0,
        keywords: []
    });

    renderPoints(currentPoints);
}

function removePoint(index) {
    const points = getCurrentPoints();
    points.splice(index, 1);
    renderPoints(points);
}

function movePoint(index, direction) {
    const points = getCurrentPoints();
    const newIndex = index + direction;

    if (newIndex < 0 || newIndex >= points.length) return;

    [points[index], points[newIndex]] = [points[newIndex], points[index]];
    renderPoints(points);
}

function updatePoint(index) {
    updateProjectTime();
}

function getCurrentPoints() {
    const pointItems = document.querySelectorAll('.point-item');
    const points = [];

    pointItems.forEach(item => {
        const title = item.querySelector('.point-title').value;
        const hours = parseInt(item.querySelector('.point-hours').value) || 0;
        const minutes = parseInt(item.querySelector('.point-minutes').value) || 0;
        const seconds = parseInt(item.querySelector('.point-seconds').value) || 0;
        const keywordsText = item.querySelector('.point-keywords').value;

        const duration = hours * 3600 + minutes * 60 + seconds;
        const keywords = keywordsText.split('\n')
            .map(k => k.trim())
            .filter(k => k.length > 0);

        points.push({ title, duration, keywords });
    });

    return points;
}

function updateProjectTime() {
    const hours = parseInt(document.getElementById('projectHours').value) || 0;
    const minutes = parseInt(document.getElementById('projectMinutes').value) || 0;
    const seconds = parseInt(document.getElementById('projectSeconds').value) || 0;

    const totalTime = hours * 3600 + minutes * 60 + seconds;
    const allocatedTime = getCurrentPoints().reduce((sum, p) => sum + p.duration, 0);
    const remainingTime = totalTime - allocatedTime;

    document.getElementById('totalTime').textContent = formatTime(totalTime);
    document.getElementById('allocatedTime').textContent = formatTime(allocatedTime);
    document.getElementById('remainingTime').textContent = formatTime(remainingTime);

    if (remainingTime < 0) {
        document.getElementById('remainingTime').style.color = 'var(--danger-color)';
    } else {
        document.getElementById('remainingTime').style.color = 'var(--success-color)';
    }
}

async function saveProject() {
    const name = document.getElementById('projectName').value.trim();

    if (!name) {
        alert(translate('error-project-name') || 'Please enter a project name');
        return;
    }

    const hours = parseInt(document.getElementById('projectHours').value) || 0;
    const minutes = parseInt(document.getElementById('projectMinutes').value) || 0;
    const seconds = parseInt(document.getElementById('projectSeconds').value) || 0;
    const totalTime = hours * 3600 + minutes * 60 + seconds;

    if (totalTime === 0) {
        alert(translate('error-project-time') || 'Please set a total time for the project');
        return;
    }

    const points = getCurrentPoints();

    const project = {
        name,
        totalTime,
        points
    };

    if (currentProject) {
        project.id = currentProject.id;
    }

    try {
        const submitBtn = document.getElementById('saveProjectBtn');
        submitBtn.disabled = true;
        submitBtn.textContent = translate('saving') || 'Saving...';

        await storage.saveProject(project);

        submitBtn.disabled = false;
        submitBtn.textContent = translate('btn-save');

        showProjectsView();
    } catch (error) {
        alert(error.message);
    }
}

function exportCurrentProject() {
    const name = document.getElementById('projectName').value.trim();

    if (!name) {
        alert(translate('error-project-name') || 'Please enter a project name');
        return;
    }

    const hours = parseInt(document.getElementById('projectHours').value) || 0;
    const minutes = parseInt(document.getElementById('projectMinutes').value) || 0;
    const seconds = parseInt(document.getElementById('projectSeconds').value) || 0;
    const totalTime = hours * 3600 + minutes * 60 + seconds;
    const points = getCurrentPoints();

    const project = { name, totalTime, points };
    storage.exportProject(project);
}

// ==================== PROJECT ACTIONS ====================

async function editProject(id) {
    const project = await storage.getProject(id);
    if (project) {
        showEditView(project);
    }
}

async function startProject(id) {
    const project = await storage.getProject(id);
    if (project) {
        initTimer(project);
        showView('timer');
    }
}

function deleteProjectConfirm(id) {
    deleteProjectId = id;
    document.getElementById('deleteModal').classList.add('active');
}

function closeDeleteModal() {
    deleteProjectId = null;
    document.getElementById('deleteModal').classList.remove('active');
}

async function confirmDelete() {
    if (deleteProjectId) {
        try {
            await storage.deleteProject(deleteProjectId);
            closeDeleteModal();
            await loadProjects();
        } catch (error) {
            alert(error.message);
        }
    }
}

// ==================== UTILITIES ====================

function calculateProjectTotalTime(project) {
    return project.totalTime || 0;
}

function formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ==================== INITIALIZE ====================

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
