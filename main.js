// Get elements
const loginForm = document.getElementById('login-form');
const title = document.getElementById('title');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

// Load users from file if not in localStorage
async function loadUsers() {
    if (!localStorage.getItem('users')) {
        try {
            const response = await fetch('users.json');
            const users = await response.json();
            localStorage.setItem('users', JSON.stringify(users));
        } catch (error) {
            console.error('Failed to load users from file, using default');
            localStorage.setItem('users', JSON.stringify([{username: 'admin', password: CryptoJS.SHA256('password').toString(), role: 'admin', email: 'admin@example.com'}]));
        }
    }
}

// Initialize users
loadUsers();

// Sanitize input
function sanitizeInput(input) {
    return input.replace(/[<>]/g, '');
}

// Login logic
async function handleLogin() {
    const user = sanitizeInput(usernameInput.value.trim());
    const password = passwordInput.value;

    // Ensure users are loaded
    if (!localStorage.getItem('users')) {
        await loadUsers();
    }

    const hashedPassword = CryptoJS.SHA256(password).toString();
    const users = JSON.parse(localStorage.getItem('users'));
    const foundUser = users.find(u => u.username === user && u.password === hashedPassword);

    if (foundUser) {
        // Successful login: set session API key and redirect based on role
        const apiKey = CryptoJS.lib.WordArray.random(16).toString();
        localStorage.setItem('apiKey', apiKey);
        localStorage.setItem('currentUser', user);
        if (foundUser.role === 'admin') {
            window.location.href = "dashboard.html";
        } else {
            // redirect non-admin users to an external site
            window.location.href = "loggedin.html";
        }
    } else {
        title.textContent = "Invalid username or password!";
        title.style.color = "red";
    }
}

// Handle form submission
loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    await handleLogin();
});