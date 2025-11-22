// assets/js/admin-categories.js

let allCategories = [];
let editingCategoryId = null;

document.addEventListener('DOMContentLoaded', function() {
    checkAdminAuth();
    loadCategories();
    setupEventListeners();
});

function setupEventListeners() {
    document.getElementById('categoryForm').addEventListener('submit', saveCategory);
}

async function checkAdminAuth() {
    const currentUser = JSON.parse(localStorage.getItem('transmart_current_user') || '{}');
    
    if (!currentUser.id || currentUser.role !== 'admin') {
        window.location.href = '../../pages/auth/login.html';
        return;
    }
    
    document.getElementById('adminName').textContent = currentUser.name;
}

async function loadCategories() {
    try {
        const response = await fetch('/api/categories.php');
        if (!response.ok) throw new Error('Failed to fetch categories');
        
        const data = await response.json();
        allCategories = data.success ? data.data : [];
        
        displayCategories();
    } catch (error) {
        console.error('Error loading categories:', error);
        showNotification('Gagal memuat kategori', 'error');
    }
}

function displayCategories() {
    const grid = document.getElementById('categoriesGrid');
    
    if (allCategories.length === 0) {
        grid.innerHTML = '<div class="col-span-full text-center py-12"><p class="text-gray-500">Tidak ada kategori ditemukan</p></div>';
        return;
    }
    
    grid.innerHTML = allCategories.map(category => `
        <div class="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition">
            <div class="flex items-start justify-between mb-3">
                <div class="w-12 h-12 bg-transmart-red text-white rounded-lg flex items-center justify-center text-xl">
                    <i class="fas ${category.icon || 'fa-box'}"></i>
                </div>
                <div class="flex space-x-2">
                    <button onclick="editCategory(${category.id})" class="text-blue-600 hover:text-blue-900">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteCategory(${category.id})" class="text-red-600 hover:text-red-900">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            
            <h3 class="text-lg font-semibold text-gray-900 mb-2">${category.name}</h3>
            <p class="text-sm text-gray-600 mb-3">${category.description || '-'}</p>
            
            <div class="flex items-center justify-between pt-3 border-t">
                <span class="text-xs text-gray-500">
                    <i class="fas fa-box mr-1"></i>${category.product_count || 0} produk
                </span>
            </div>
        </div>
    `).join('');
}

function openAddCategoryModal() {
    editingCategoryId = null;
    document.getElementById('modalTitle').textContent = 'Tambah Kategori Baru';
    document.getElementById('categoryForm').reset();
    document.getElementById('categoryModal').classList.remove('hidden');
}

async function editCategory(id) {
    try {
        const category = allCategories.find(c => c.id === id);
        if (!category) {
            showNotification('Kategori tidak ditemukan', 'error');
            return;
        }
        
        editingCategoryId = id;
        document.getElementById('modalTitle').textContent = 'Edit Kategori';
        document.getElementById('categoryName').value = category.name;
        document.getElementById('categoryDescription').value = category.description || '';
        document.getElementById('categoryIcon').value = category.icon || '';
        
        document.getElementById('categoryModal').classList.remove('hidden');
    } catch (error) {
        console.error('Error editing category:', error);
        showNotification('Gagal membuka form edit kategori', 'error');
    }
}

async function deleteCategory(id) {
    if (!confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
        return;
    }
    
    try {
        const formData = new FormData();
        formData.append('action', 'delete');
        formData.append('id', id);
        
        const response = await fetch('/api/categories.php', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification('Kategori berhasil dihapus', 'success');
            loadCategories();
        } else {
            showNotification(data.message || 'Gagal menghapus kategori', 'error');
        }
    } catch (error) {
        console.error('Error deleting category:', error);
        showNotification('Gagal menghapus kategori', 'error');
    }
}

async function saveCategory(e) {
    e.preventDefault();
    
    try {
        const formData = new FormData();
        formData.append('action', editingCategoryId ? 'update' : 'create');
        formData.append('name', document.getElementById('categoryName').value);
        formData.append('description', document.getElementById('categoryDescription').value);
        
        if (editingCategoryId) {
            formData.append('id', editingCategoryId);
        }
        
        const response = await fetch('/api/categories.php', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification(editingCategoryId ? 'Kategori berhasil diperbarui' : 'Kategori berhasil ditambahkan', 'success');
            closeCategoryModal();
            loadCategories();
        } else {
            showNotification(data.message || 'Gagal menyimpan kategori', 'error');
        }
    } catch (error) {
        console.error('Error saving category:', error);
        showNotification('Gagal menyimpan kategori', 'error');
    }
}

function closeCategoryModal() {
    document.getElementById('categoryModal').classList.add('hidden');
    document.getElementById('categoryForm').reset();
    editingCategoryId = null;
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
