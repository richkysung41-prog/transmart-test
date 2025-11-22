// assets/js/admin-settings.js

document.addEventListener('DOMContentLoaded', function() {
    checkAdminAuth();
    setupTabSwitching();
});

function setupTabSwitching() {
    const tabs = document.querySelectorAll('.settings-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.dataset.tab;
            switchTab(tabName);
        });
    });
}

async function checkAdminAuth() {
    const currentUser = JSON.parse(localStorage.getItem('transmart_current_user') || '{}');
    
    if (!currentUser.id || currentUser.role !== 'admin') {
        window.location.href = '../../pages/auth/login.html';
        return;
    }
    
    document.getElementById('adminName').textContent = currentUser.name;
}

function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.settings-content').forEach(tab => {
        tab.classList.add('hidden');
    });
    
    // Remove active state from all tab buttons
    document.querySelectorAll('.settings-tab').forEach(tab => {
        tab.classList.remove('border-transmart-red');
        tab.classList.add('border-transparent');
    });
    
    // Show selected tab
    const selectedTab = document.getElementById(`${tabName}-tab`);
    if (selectedTab) {
        selectedTab.classList.remove('hidden');
    }
    
    // Add active state to clicked tab button
    event.target.closest('.settings-tab').classList.remove('border-transparent');
    event.target.closest('.settings-tab').classList.add('border-transmart-red');
}

function saveSettings(type) {
    showNotification(`Pengaturan ${type === 'general' ? 'umum' : type === 'store' ? 'toko' : type === 'payment' ? 'pembayaran' : 'email'} berhasil disimpan`, 'success');
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 transform transition-transform duration-300 ${
        type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
    }`;
    notification.innerHTML = `
        <div class="flex items-center space-x-2">
            <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function logout() {
    localStorage.removeItem('transmart_current_user');
    window.location.href = '../../pages/auth/login.html';
}
