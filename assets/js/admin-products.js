// assets/js/admin-products.js

let currentPage = 1;
const itemsPerPage = 10;
let allProducts = [];
let filteredProducts = [];
let editingProductId = null;

document.addEventListener('DOMContentLoaded', function() {
    checkAdminAuth();
    loadCategories();
    loadProducts();
    setupEventListeners();
});

function setupEventListeners() {
    document.getElementById('searchInput').addEventListener('input', filterProducts);
    document.getElementById('categoryFilter').addEventListener('change', filterProducts);
    document.getElementById('productForm').addEventListener('submit', saveProduct);
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
        const categories = data.success ? data.data : [];
        
        const selects = [
            document.getElementById('productCategory'),
            document.getElementById('categoryFilter')
        ];
        
        selects.forEach(select => {
            const options = select.innerHTML;
            select.innerHTML = options;
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                select.appendChild(option);
            });
        });
    } catch (error) {
        console.error('Error loading categories:', error);
        showNotification('Gagal memuat kategori', 'error');
    }
}

async function loadProducts(page = 1) {
    try {
        const response = await fetch(`/api/products.php?limit=${itemsPerPage}&offset=${(page - 1) * itemsPerPage}`);
        if (!response.ok) throw new Error('Failed to fetch products');
        
        const data = await response.json();
        allProducts = data.data || [];
        
        filteredProducts = [...allProducts];
        currentPage = page;
        
        displayProducts();
        updatePagination();
    } catch (error) {
        console.error('Error loading products:', error);
        showNotification('Gagal memuat produk', 'error');
    }
}

function filterProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const categoryId = document.getElementById('categoryFilter').value;
    
    filteredProducts = allProducts.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) || 
                            product.description.toLowerCase().includes(searchTerm);
        const matchesCategory = !categoryId || product.category_id == categoryId;
        
        return matchesSearch && matchesCategory;
    });
    
    currentPage = 1;
    displayProducts();
    updatePagination();
}

function displayProducts() {
    const tbody = document.getElementById('productsTableBody');
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageProducts = filteredProducts.slice(start, end);
    
    if (pageProducts.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="px-6 py-4 text-center text-gray-500">Tidak ada produk ditemukan</td></tr>';
        return;
    }
    
    tbody.innerHTML = pageProducts.map(product => `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 text-sm font-medium text-gray-900">${product.name}</td>
            <td class="px-6 py-4 text-sm text-gray-700">${product.category_name || '-'}</td>
            <td class="px-6 py-4 text-sm font-medium text-transmart-red">Rp ${formatPrice(product.price)}</td>
            <td class="px-6 py-4 text-sm text-gray-700">
                <span class="px-2 py-1 rounded-full text-xs font-semibold ${
                    product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }">
                    ${product.stock} ${product.stock == 1 ? 'unit' : 'unit'}
                </span>
            </td>
            <td class="px-6 py-4 text-sm">
                <span class="px-2 py-1 rounded-full text-xs font-semibold ${
                    product.stock > 0 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                }">
                    ${product.stock > 0 ? 'Tersedia' : 'Habis'}
                </span>
            </td>
            <td class="px-6 py-4 text-sm space-x-2">
                <button onclick="editProduct(${product.id})" 
                    class="text-blue-600 hover:text-blue-900">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteProduct(${product.id})" 
                    class="text-red-600 hover:text-red-900">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
    
    const totalShowing = filteredProducts.length;
    document.getElementById('showingCount').textContent = Math.min(end, totalShowing);
    document.getElementById('totalCount').textContent = totalShowing;
}

function updatePagination() {
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    document.getElementById('prevBtn').disabled = currentPage === 1;
    document.getElementById('nextBtn').disabled = currentPage === totalPages;
}

function nextPage() {
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        displayProducts();
        updatePagination();
        window.scrollTo(0, 0);
    }
}

function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        displayProducts();
        updatePagination();
        window.scrollTo(0, 0);
    }
}

function openAddProductModal() {
    editingProductId = null;
    document.getElementById('modalTitle').textContent = 'Tambah Produk Baru';
    document.getElementById('productForm').reset();
    document.getElementById('productModal').classList.remove('hidden');
}

async function editProduct(id) {
    try {
        const product = allProducts.find(p => p.id === id);
        if (!product) {
            showNotification('Produk tidak ditemukan', 'error');
            return;
        }
        
        editingProductId = id;
        document.getElementById('modalTitle').textContent = 'Edit Produk';
        document.getElementById('productName').value = product.name;
        document.getElementById('productCategory').value = product.category_id;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productStock').value = product.stock;
        document.getElementById('productDescription').value = product.description || '';
        document.getElementById('productImage').value = product.image || '';
        
        document.getElementById('productModal').classList.remove('hidden');
    } catch (error) {
        console.error('Error editing product:', error);
        showNotification('Gagal membuka form edit produk', 'error');
    }
}

async function deleteProduct(id) {
    if (!confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
        return;
    }
    
    try {
        const formData = new FormData();
        formData.append('action', 'delete');
        formData.append('id', id);
        
        const response = await fetch('/api/products.php', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification('Produk berhasil dihapus', 'success');
            loadProducts(currentPage);
        } else {
            showNotification(data.message || 'Gagal menghapus produk', 'error');
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        showNotification('Gagal menghapus produk', 'error');
    }
}

async function saveProduct(e) {
    e.preventDefault();
    
    try {
        const formData = new FormData();
        formData.append('action', editingProductId ? 'update' : 'create');
        formData.append('name', document.getElementById('productName').value);
        formData.append('category_id', document.getElementById('productCategory').value);
        formData.append('price', document.getElementById('productPrice').value);
        formData.append('stock', document.getElementById('productStock').value);
        formData.append('description', document.getElementById('productDescription').value);
        formData.append('image', document.getElementById('productImage').value);
        
        if (editingProductId) {
            formData.append('id', editingProductId);
        }
        
        const response = await fetch('/api/products.php', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification(editingProductId ? 'Produk berhasil diperbarui' : 'Produk berhasil ditambahkan', 'success');
            closeProductModal();
            loadProducts(1);
        } else {
            showNotification(data.message || 'Gagal menyimpan produk', 'error');
        }
    } catch (error) {
        console.error('Error saving product:', error);
        showNotification('Gagal menyimpan produk', 'error');
    }
}

function closeProductModal() {
    document.getElementById('productModal').classList.add('hidden');
    document.getElementById('productForm').reset();
    editingProductId = null;
}

function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
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
