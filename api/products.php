<?php
// api/products.php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:8000');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/config.php';
require_once '../config/functions.php';

$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($method) {
        case 'GET':
            handleGetProducts();
            break;
            
        case 'POST':
            $action = $_POST['action'] ?? 'read';
            
            if ($action !== 'read') {
                checkAuth();
                if (!isAdmin()) {
                    jsonResponse(['error' => 'Unauthorized'], 403);
                }
            }
            
            switch ($action) {
                case 'create':
                    handleCreateProduct();
                    break;
                case 'update':
                    handleUpdateProduct();
                    break;
                case 'delete':
                    handleDeleteProduct();
                    break;
                default:
                    handleGetProducts();
            }
            break;
            
        default:
            jsonResponse(['error' => 'Method not allowed'], 405);
    }
} catch (Exception $e) {
    jsonResponse(['error' => $e->getMessage()], 500);
}

function handleGetProducts() {
    // Get query parameters
    $category_id = $_GET['category_id'] ?? '';
    $search = $_GET['search'] ?? '';
    $page = max(1, (int)($_GET['page'] ?? 1));
    $limit = min(50, max(1, (int)($_GET['limit'] ?? 12)));
    $sort = $_GET['sort'] ?? 'created_at';
    $order = strtoupper($_GET['order'] ?? 'DESC');
    $min_price = $_GET['min_price'] ?? '';
    $max_price = $_GET['max_price'] ?? '';
    
    // Validate sort and order
    $allowed_sorts = ['id', 'name', 'price', 'rating', 'total_sold', 'created_at'];
    if (!in_array($sort, $allowed_sorts)) {
        $sort = 'created_at';
    }
    if (!in_array($order, ['ASC', 'DESC'])) {
        $order = 'DESC';
    }
    
    // Build filters array
    $filters = [
        'search' => $search,
        'sort' => $sort,
        'order' => $order,
        'page' => $page,
        'limit' => $limit
    ];
    
    if (!empty($category_id)) {
        $filters['category_id'] = (int)$category_id;
    }
    
    if (!empty($min_price)) {
        $filters['min_price'] = (float)$min_price;
    }
    
    if (!empty($max_price)) {
        $filters['max_price'] = (float)$max_price;
    }
    
    // Get total count
    $total = TransmartFunctions::getProductCount($filters);
    
    // Get products
    $products = TransmartFunctions::getProducts($filters);
    
    // Calculate pagination
    $total_pages = ceil($total / $limit);
    $offset = ($page - 1) * $limit;
    
    jsonResponse([
        'success' => true,
        'data' => $products,
        'pagination' => [
            'current_page' => $page,
            'per_page' => $limit,
            'total' => $total,
            'total_pages' => $total_pages,
            'has_next' => $page < $total_pages,
            'has_prev' => $page > 1
        ],
        'filters' => [
            'category_id' => $category_id,
            'search' => $search,
            'sort' => $sort,
            'order' => $order,
            'min_price' => $min_price,
            'max_price' => $max_price
        ]
    ]);
}

function handleAddProduct() {
    // Admin only
    if (!isAdmin()) {
        jsonResponse(['error' => 'Unauthorized'], 403);
    }
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Validation
    $required = ['category_id', 'name', 'price'];
    foreach ($required as $field) {
        if (empty($input[$field])) {
            jsonResponse(['error' => "Field $field diperlukan"], 400);
        }
    }
    
    $product_data = [
        'category_id' => (int)$input['category_id'],
        'name' => sanitizeInput($input['name']),
        'description' => sanitizeInput($input['description'] ?? ''),
        'price' => (float)$input['price'],
        'discount_price' => isset($input['discount_price']) ? (float)$input['discount_price'] : null,
        'stock' => (int)($input['stock'] ?? 0),
        'image_url' => sanitizeInput($input['image_url'] ?? ''),
        'is_active' => $input['is_active'] ?? true,
        'created_at' => date('Y-m-d H:i:s')
    ];
    
    $product_id = insertRecord('products', $product_data);
    
    jsonResponse([
        'success' => true,
        'product_id' => $product_id,
        'message' => 'Produk berhasil ditambahkan'
    ], 201);
}

function handleCreateProduct() {
    global $db;
    
    // Validation
    $name = sanitizeInput($_POST['name'] ?? '');
    $category_id = (int)($_POST['category_id'] ?? 0);
    $price = (float)($_POST['price'] ?? 0);
    $stock = (int)($_POST['stock'] ?? 0);
    $description = sanitizeInput($_POST['description'] ?? '');
    $image = sanitizeInput($_POST['image'] ?? '');
    
    if (empty($name) || $category_id <= 0 || $price <= 0) {
        jsonResponse(['success' => false, 'message' => 'Data produk tidak valid'], 400);
        return;
    }
    
    try {
        $db = new Database();
        $conn = $db->getConnection();
        
        $sql = "INSERT INTO products (name, category_id, price, stock, description, image, created_at) 
                VALUES (:name, :category_id, :price, :stock, :description, :image, NOW())";
        
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            ':name' => $name,
            ':category_id' => $category_id,
            ':price' => $price,
            ':stock' => $stock,
            ':description' => $description,
            ':image' => $image
        ]);
        
        $product_id = $conn->lastInsertId();
        
        jsonResponse([
            'success' => true,
            'product_id' => $product_id,
            'message' => 'Produk berhasil ditambahkan'
        ]);
    } catch (Exception $e) {
        jsonResponse(['success' => false, 'message' => 'Gagal menambahkan produk: ' . $e->getMessage()], 500);
    }
}

function handleUpdateProduct() {
    global $db;
    
    $id = (int)($_POST['id'] ?? 0);
    
    if ($id <= 0) {
        jsonResponse(['success' => false, 'message' => 'ID produk tidak valid'], 400);
        return;
    }
    
    // Validation
    $name = sanitizeInput($_POST['name'] ?? '');
    $category_id = (int)($_POST['category_id'] ?? 0);
    $price = (float)($_POST['price'] ?? 0);
    $stock = (int)($_POST['stock'] ?? 0);
    $description = sanitizeInput($_POST['description'] ?? '');
    $image = sanitizeInput($_POST['image'] ?? '');
    
    if (empty($name) || $category_id <= 0 || $price <= 0) {
        jsonResponse(['success' => false, 'message' => 'Data produk tidak valid'], 400);
        return;
    }
    
    try {
        $db = new Database();
        $conn = $db->getConnection();
        
        $sql = "UPDATE products 
                SET name = :name, category_id = :category_id, price = :price, 
                    stock = :stock, description = :description, image = :image
                WHERE id = :id";
        
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            ':name' => $name,
            ':category_id' => $category_id,
            ':price' => $price,
            ':stock' => $stock,
            ':description' => $description,
            ':image' => $image,
            ':id' => $id
        ]);
        
        jsonResponse([
            'success' => true,
            'message' => 'Produk berhasil diperbarui'
        ]);
    } catch (Exception $e) {
        jsonResponse(['success' => false, 'message' => 'Gagal memperbarui produk: ' . $e->getMessage()], 500);
    }
}

function handleDeleteProduct() {
    global $db;
    
    $id = (int)($_POST['id'] ?? 0);
    
    if ($id <= 0) {
        jsonResponse(['success' => false, 'message' => 'ID produk tidak valid'], 400);
        return;
    }
    
    try {
        $db = new Database();
        $conn = $db->getConnection();
        
        // Delete from cart items first
        $conn->prepare("DELETE FROM cart WHERE product_id = :id")->execute([':id' => $id]);
        
        // Delete from order items
        $conn->prepare("DELETE FROM order_items WHERE product_id = :id")->execute([':id' => $id]);
        
        // Delete product
        $conn->prepare("DELETE FROM products WHERE id = :id")->execute([':id' => $id]);
        
        jsonResponse([
            'success' => true,
            'message' => 'Produk berhasil dihapus'
        ]);
    } catch (Exception $e) {
        jsonResponse(['success' => false, 'message' => 'Gagal menghapus produk: ' . $e->getMessage()], 500);
    }
}
