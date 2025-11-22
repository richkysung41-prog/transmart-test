<?php
// api/categories.php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:8000');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
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
            handleGetCategories();
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
                    handleCreateCategory();
                    break;
                case 'update':
                    handleUpdateCategory();
                    break;
                case 'delete':
                    handleDeleteCategory();
                    break;
                default:
                    handleGetCategories();
            }
            break;
            
        default:
            jsonResponse(['error' => 'Method not allowed'], 405);
    }
} catch (Exception $e) {
    jsonResponse(['error' => $e->getMessage()], 500);
}

function handleGetCategories() {
    $categories = TransmartFunctions::getCategories();
    
    // Get product count per category
    $categories_with_count = [];
    foreach ($categories as $category) {
        $product_count = getSingleResult(
            "SELECT COUNT(*) as count FROM products WHERE category_id = :category_id AND is_active = 1",
            ['category_id' => $category['id']]
        );
        $category['product_count'] = $product_count['count'] ?? 0;
        $categories_with_count[] = $category;
    }
    
    jsonResponse([
        'success' => true,
        'data' => $categories_with_count
    ]);
}

function handleAddCategory() {
    // Admin only
    if (!isAdmin()) {
        jsonResponse(['error' => 'Unauthorized'], 403);
    }
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Validation
    if (empty($input['name'])) {
        jsonResponse(['error' => 'Nama kategori diperlukan'], 400);
    }
    
    // Check duplicate
    $existing = getSingleResult(
        "SELECT id FROM categories WHERE name = :name",
        ['name' => $input['name']]
    );
    
    if ($existing) {
        jsonResponse(['error' => 'Kategori sudah ada'], 400);
    }
    
    // Create slug
    $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $input['name']), '-'));
    
    $category_data = [
        'name' => sanitizeInput($input['name']),
        'description' => sanitizeInput($input['description'] ?? ''),
        'image_url' => sanitizeInput($input['image_url'] ?? ''),
        'slug' => $slug,
        'is_active' => $input['is_active'] ?? true,
        'created_at' => date('Y-m-d H:i:s')
    ];
    
    $category_id = insertRecord('categories', $category_data);
    
    jsonResponse([
        'success' => true,
        'category_id' => $category_id,
        'message' => 'Kategori berhasil ditambahkan'
    ], 201);
}

function handleCreateCategory() {
    global $db;
    
    $name = sanitizeInput($_POST['name'] ?? '');
    $description = sanitizeInput($_POST['description'] ?? '');
    $icon = sanitizeInput($_POST['icon'] ?? '');
    
    if (empty($name)) {
        jsonResponse(['success' => false, 'message' => 'Nama kategori tidak boleh kosong'], 400);
        return;
    }
    
    try {
        $db = new Database();
        $conn = $db->getConnection();
        
        // Check duplicate
        $existing = $conn->prepare("SELECT id FROM categories WHERE name = :name");
        $existing->execute([':name' => $name]);
        
        if ($existing->fetch()) {
            jsonResponse(['success' => false, 'message' => 'Kategori sudah ada'], 400);
            return;
        }
        
        // Create slug
        $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $name), '-'));
        
        $sql = "INSERT INTO categories (name, description, created_at) 
                VALUES (:name, :description, NOW())";
        
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            ':name' => $name,
            ':description' => $description
        ]);
        
        $category_id = $conn->lastInsertId();
        
        jsonResponse([
            'success' => true,
            'category_id' => $category_id,
            'message' => 'Kategori berhasil ditambahkan'
        ]);
    } catch (Exception $e) {
        jsonResponse(['success' => false, 'message' => 'Gagal menambahkan kategori: ' . $e->getMessage()], 500);
    }
}

function handleUpdateCategory() {
    global $db;
    
    $id = (int)($_POST['id'] ?? 0);
    
    if ($id <= 0) {
        jsonResponse(['success' => false, 'message' => 'ID kategori tidak valid'], 400);
        return;
    }
    
    $name = sanitizeInput($_POST['name'] ?? '');
    $description = sanitizeInput($_POST['description'] ?? '');
    $icon = sanitizeInput($_POST['icon'] ?? '');
    
    if (empty($name)) {
        jsonResponse(['success' => false, 'message' => 'Nama kategori tidak boleh kosong'], 400);
        return;
    }
    
    try {
        $db = new Database();
        $conn = $db->getConnection();
        
        $sql = "UPDATE categories 
                SET name = :name, description = :description
                WHERE id = :id";
        
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            ':name' => $name,
            ':description' => $description,
            ':id' => $id
        ]);
        
        jsonResponse([
            'success' => true,
            'message' => 'Kategori berhasil diperbarui'
        ]);
    } catch (Exception $e) {
        jsonResponse(['success' => false, 'message' => 'Gagal memperbarui kategori: ' . $e->getMessage()], 500);
    }
}

function handleDeleteCategory() {
    global $db;
    
    $id = (int)($_POST['id'] ?? 0);
    
    if ($id <= 0) {
        jsonResponse(['success' => false, 'message' => 'ID kategori tidak valid'], 400);
        return;
    }
    
    try {
        $db = new Database();
        $conn = $db->getConnection();
        
        // Check if category has products
        $check = $conn->prepare("SELECT COUNT(*) as count FROM products WHERE category_id = :id");
        $check->execute([':id' => $id]);
        $result = $check->fetch(PDO::FETCH_ASSOC);
        
        if ($result['count'] > 0) {
            jsonResponse(['success' => false, 'message' => 'Tidak bisa menghapus kategori yang masih memiliki produk'], 400);
            return;
        }
        
        // Delete category
        $conn->prepare("DELETE FROM categories WHERE id = :id")->execute([':id' => $id]);
        
        jsonResponse([
            'success' => true,
            'message' => 'Kategori berhasil dihapus'
        ]);
    } catch (Exception $e) {
        jsonResponse(['success' => false, 'message' => 'Gagal menghapus kategori: ' . $e->getMessage()], 500);
    }
}
