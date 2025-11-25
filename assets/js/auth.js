// assets/js/auth.js

// API configuration
const API_URL = '/api/auth.php';

document.addEventListener('DOMContentLoaded', function() {
    initializeAuth();
    setupAuthEventListeners();
});

function initializeAuth() {
    // Check if user is already logged in
    const currentUser = localStorage.getItem('user_id');
    
    // Redirect logged in users away from login/register pages
    const currentPath = window.location.pathname;
    if (currentUser && (currentPath.includes('login.html') || currentPath.includes('register.html'))) {
        window.location.href = '../../index.html';
    }

    // Initialize password visibility toggles
    initializePasswordToggles();
    
    // Load pre-filled email if "Remember me" was checked
    if (localStorage.getItem('remember_email')) {
        const emailInput = document.getElementById('email');
        if (emailInput) {
            emailInput.value = localStorage.getItem('remember_email');
        }
    }
}

function setupAuthEventListeners() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
        
        // Demo login buttons
        document.querySelectorAll('.demo-login').forEach(btn => {
            btn.addEventListener('click', handleDemoLogin);
        });
    }

    // Register.html has its own inline form handler - don't conflict
    // The inline script in register.html will handle the form submission

    // Social login/register buttons (optional)
    document.querySelectorAll('.social-login, .social-register').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Social login belum tersedia');
        });
    });
}

function initializePasswordToggles() {
    // Handle toggle password buttons by ID or class
    const toggleButtons = document.querySelectorAll('#togglePassword, .toggle-password');
    toggleButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
}

function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const email = formData.get('email').trim();
    const password = formData.get('password');
    const remember = formData.get('remember') === 'on';

    // Reset errors
    clearErrors();

    // Validation
    let isValid = true;

    if (!validateEmail(email)) {
        showError('email', 'Format email tidak valid');
        isValid = false;
    }

    if (password.length < 1) {
        showError('password', 'Password harus diisi');
        isValid = false;
    }

    if (!isValid) return;

    // Call API
    submitLogin(email, password, remember);
}

async function submitLogin(email, password, remember) {
    const submitBtn = document.querySelector('#loginForm button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Memproses...';
    submitBtn.disabled = true;

    try {
        const response = await fetch(`${API_URL}?action=login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        // Get response text first to debug
        const responseText = await response.text();
        
        // Try to parse JSON
        let data;
        try {
            data = JSON.parse(responseText);
        } catch (parseError) {
            console.error('Response text:', responseText);
            throw new Error('Server response tidak valid: ' + responseText.substring(0, 100));
        }

        if (!response.ok) {
            throw new Error(data.error || 'Login gagal');
        }

        // Success - simpan user data dengan format konsisten untuk admin dan customer
        const userData = {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            phone: data.user.phone,
            role: data.user.role || 'customer'
        };
        
        // Simpan untuk keperluan umum
        localStorage.setItem('transmart_current_user', JSON.stringify(userData));
        localStorage.setItem('user_id', data.user.id);
        localStorage.setItem('user_name', data.user.name);
        localStorage.setItem('user_email', data.user.email);
        localStorage.setItem('user_phone', data.user.phone);
        localStorage.setItem('user_role', data.user.role || 'customer');
        
        if (remember) {
            localStorage.setItem('remember_email', email);
        }

        showNotification('Login berhasil! Mengalihkan...', 'success');
        
        // Redirect ke dashboard jika admin, ke homepage jika customer
        setTimeout(() => {
            if (userData.role === 'admin') {
                window.location.href = '../../pages/admin/dashboard.html';
            } else {
                window.location.href = '../../index.html';
            }
        }, 1500);

    } catch (error) {
        console.error('Login error:', error);
        showError('password', error.message);
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

function handleDemoLogin(e) {
    e.preventDefault();
    const email = this.dataset.email;
    const password = this.dataset.password;
    
    // Fill form and submit
    document.getElementById('email').value = email;
    document.getElementById('password').value = password;
    
    submitLogin(email, password, false);
}

function handleRegister(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const fullName = formData.get('fullName').trim();
    const email = formData.get('email').trim();
    const phone = formData.get('phone').trim();
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    const terms = formData.get('terms') === 'on';

    // Reset errors
    clearErrors();

    // Validation
    let isValid = true;

    if (fullName.length < 3) {
        showError('fullName', 'Nama minimal 3 karakter');
        isValid = false;
    }

    if (!validateEmail(email)) {
        showError('email', 'Format email tidak valid');
        isValid = false;
    }

    if (!validatePhone(phone)) {
        showError('phone', 'Format nomor telepon tidak valid');
        isValid = false;
    }

    if (password.length < 6) {
        showError('password', 'Kata sandi minimal 6 karakter');
        isValid = false;
    }

    if (password !== confirmPassword) {
        showError('confirmPassword', 'Konfirmasi kata sandi tidak cocok');
        isValid = false;
    }

    if (!terms) {
        showNotification('Harap setujui syarat dan ketentuan', 'error');
        isValid = false;
    }

    if (!isValid) return;

    // Submit
    submitRegister(fullName, email, phone, password);
}

async function submitRegister(name, email, phone, password) {
    const submitBtn = document.querySelector('#registerForm button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Mendaftarkan...';
    submitBtn.disabled = true;

    try {
        const response = await fetch(`${API_URL}?action=register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                email: email,
                phone: phone,
                password: password
            })
        });

        // Get response text first to debug
        const responseText = await response.text();
        
        // Try to parse JSON
        let data;
        try {
            data = JSON.parse(responseText);
        } catch (parseError) {
            console.error('Response text:', responseText);
            throw new Error('Server response tidak valid: ' + responseText.substring(0, 100));
        }

        if (!response.ok) {
            throw new Error(data.error || 'Registrasi gagal');
        }

        // Success
        showNotification('Pendaftaran berhasil! Silakan login.', 'success');
        
        // Redirect to login
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);

    } catch (error) {
        console.error('Register error:', error);
        showError('email', error.message);
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

function validatePassword(password) {
    // Just check minimum length - let backend validate further
    return password.length >= 6;
}

function validatePasswordStrength() {
    const password = this.value;
    const requirements = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        number: /\d/.test(password),
        special: /[@$!%*?&]/.test(password)
    };

    // Update requirement indicators
    Object.keys(requirements).forEach(req => {
        const element = document.getElementById(req);
        if (element) {
            if (requirements[req]) {
                element.classList.remove('text-red-500');
                element.classList.add('text-green-500');
            } else {
                element.classList.remove('text-green-500');
                element.classList.add('text-red-500');
            }
        }
    });
}

function showError(field, message) {
    const errorElement = document.getElementById(field + 'Error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');
        
        // Add error styling to input
        const input = document.getElementById(field);
        if (input) {
            input.classList.add('border-red-500');
        }
    }
}

function clearErrors() {
    // Clear all error messages
    document.querySelectorAll('[id$="Error"]').forEach(element => {
        element.classList.add('hidden');
        element.textContent = '';
    });

    // Remove error styling from inputs
    document.querySelectorAll('input').forEach(input => {
        input.classList.remove('border-red-500');
    });
}

function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    const bgColor = type === 'error' ? 'bg-red-500' : 'bg-green-500';
    notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${bgColor} text-white`;
    notification.innerHTML = `
        <div class="flex items-center space-x-2">
            <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Utility functions
function isUserLoggedIn() {
    return localStorage.getItem('user_id') !== null;
}

function getCurrentUser() {
    return {
        id: localStorage.getItem('user_id'),
        name: localStorage.getItem('user_name'),
        email: localStorage.getItem('user_email'),
        phone: localStorage.getItem('user_phone'),
        role: localStorage.getItem('user_role') || 'customer'
    };
}

function logout() {
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_phone');
    localStorage.removeItem('user_role');
    localStorage.removeItem('remember_email');
    window.location.href = '../../pages/auth/login.html';
}

// Make functions available globally
window.auth = {
    isUserLoggedIn,
    getCurrentUser,
    logout
};