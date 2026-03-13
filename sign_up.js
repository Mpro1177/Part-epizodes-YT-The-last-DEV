// Get elements
const signupForm = document.getElementById('signup-form');
const title = document.getElementById('title');
const usernameInput = document.getElementById('new-username');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('new-password');
const confirmPasswordInput = document.getElementById('confirm-password');
const captchaInput = document.getElementById('captcha');

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

// Signup logic
async function handleSignup() {
    const user = sanitizeInput(usernameInput.value.trim());
    const email = sanitizeInput(emailInput.value.trim());
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    // Ensure users are loaded
    if (!localStorage.getItem('users')) {
        await loadUsers();
    }

    if (!user || user.length < 1) {
        title.textContent = "Username cannot be empty!";
        title.style.color = "red";
        return;
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        title.textContent = "Please enter a valid email!";
        title.style.color = "red";
        return;
    }

    if (password.length < 1) {
        title.textContent = "Password cannot be empty!";
        title.style.color = "red";
        return;
    }

    if (password !== confirmPassword) {
        title.textContent = "Passwords do not match!";
        title.style.color = "red";
        return;
    }

    const users = JSON.parse(localStorage.getItem('users'));
    const existingUser = users.find(u => u.username === user || u.email === email);
    if (existingUser) {
        title.textContent = "Username or email already exists!";
        title.style.color = "red";
        return;
    }

    // Hash password
    const hashedPassword = CryptoJS.SHA256(password).toString();

    // Add new user with role 'user'
    users.push({username: user, password: hashedPassword, role: 'user', email: email});
    localStorage.setItem('users', JSON.stringify(users));

    // Success
    title.textContent = "Account created successfully! Redirecting to login...";
    title.style.color = "green";
    setTimeout(() => {
        window.location.href = "index.html";
    }, 2000);
}

// Handle form submission
signupForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    await handleSignup();
});