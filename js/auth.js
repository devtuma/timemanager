// Authentication Handler

// Check if user is already logged in
function checkAuth() {
    if (storage.isAuthenticated()) {
        window.location.href = 'app.html';
    }
}

// Show error message
function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }
}

// Show success message
function showSuccess(message) {
    const successDiv = document.getElementById('successMessage');
    if (successDiv) {
        successDiv.textContent = message;
        successDiv.style.display = 'block';
    }
}

// Hide messages
function hideMessages() {
    const errorDiv = document.getElementById('errorMessage');
    const successDiv = document.getElementById('successMessage');

    if (errorDiv) errorDiv.style.display = 'none';
    if (successDiv) successDiv.style.display = 'none';
}

// Handle login form
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    checkAuth(); // Redirect if already logged in

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideMessages();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        if (!email || !password) {
            showError(translate('error-fill-fields') || 'Please fill in all fields');
            return;
        }

        try {
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = translate('loading') || 'Loading...';

            await storage.login(email, password);

            // Redirect to app
            window.location.href = 'app.html';
        } catch (error) {
            showError(error.message);
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            submitBtn.disabled = false;
            submitBtn.textContent = translate('btn-login');
        }
    });
}

// Handle register form
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    checkAuth(); // Redirect if already logged in

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideMessages();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Validation
        if (!name || !email || !password || !confirmPassword) {
            showError(translate('error-fill-fields') || 'Please fill in all fields');
            return;
        }

        if (password.length < 6) {
            showError(translate('error-password-short') || 'Password must be at least 6 characters');
            return;
        }

        if (password !== confirmPassword) {
            showError(translate('error-password-mismatch') || 'Passwords do not match');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showError(translate('error-invalid-email') || 'Please enter a valid email');
            return;
        }

        try {
            const submitBtn = registerForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = translate('loading') || 'Loading...';

            await storage.register(name, email, password);

            showSuccess(translate('success-registered') || 'Account created successfully! You can now login.');

            // Clear form
            registerForm.reset();

            // Redirect to login after 2 seconds
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } catch (error) {
            showError(error.message);
            const submitBtn = registerForm.querySelector('button[type="submit"]');
            submitBtn.disabled = false;
            submitBtn.textContent = translate('btn-create-account');
        }
    });
}
