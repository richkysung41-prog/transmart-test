<?php
// api/users.php

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
$user_id = checkAuth();

try {
    switch ($method) {
        case 'GET':
            handleGetUser($user_id);
            break;
            
        case 'PUT':
            handleUpdateUser($user_id);
            break;
            
        case 'DELETE':
            handleDeleteAccount($user_id);
            break;
            
        default:
            jsonResponse(['error' => 'Method not allowed'], 405);
    }
} catch (Exception $e) {
    jsonResponse(['error' => $e->getMessage()], 500);
}

function handleGetUser($user_id) {
    // Get specific user (admin only, or own profile)
    if (!empty($_GET['id'])) {
        $requested_id = (int)$_GET['id'];
        
        // Non-admin users can only access their own profile
        if ($requested_id != $user_id && !isAdmin()) {
            jsonResponse(['error' => 'Tidak diizinkan mengakses profil pengguna lain'], 403);
        }
        
        $user = getSingleResult(
            "SELECT id, name, email, phone, address, role, status, created_at
             FROM users WHERE id = :id",
            ['id' => $requested_id]
        );
    } else {
        // Get current user profile
        $user = getSingleResult(
            "SELECT id, name, email, phone, address, role, status, created_at
             FROM users WHERE id = :id",
            ['id' => $user_id]
        );
    }
    
    if (!$user) {
        jsonResponse(['error' => 'Pengguna tidak ditemukan'], 404);
    }
    
    jsonResponse([
        'success' => true,
        'data' => $user
    ]);
}

function handleUpdateUser($user_id) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Validate input
    $updates = [];
    $bindings = [];
    
    if (!empty($input['name'])) {
        $input['name'] = trim($input['name']);
        if (strlen($input['name']) < 3) {
            jsonResponse(['error' => 'Nama harus minimal 3 karakter'], 400);
        }
        $updates[] = "name = :name";
        $bindings['name'] = sanitizeInput($input['name']);
    }
    
    if (!empty($input['phone'])) {
        if (!validatePhone($input['phone'])) {
            jsonResponse(['error' => 'Nomor telepon tidak valid'], 400);
        }
        $updates[] = "phone = :phone";
        $bindings['phone'] = sanitizeInput($input['phone']);
    }
    
    if (!empty($input['address'])) {
        if (strlen($input['address']) < 5) {
            jsonResponse(['error' => 'Alamat harus minimal 5 karakter'], 400);
        }
        $updates[] = "address = :address";
        $bindings['address'] = sanitizeInput($input['address']);
    }
    
    // Update password if provided
    if (!empty($input['new_password'])) {
        // Verify current password
        if (empty($input['current_password'])) {
            jsonResponse(['error' => 'Password saat ini diperlukan untuk mengubah password'], 400);
        }
        
        $user = getSingleResult(
            "SELECT password FROM users WHERE id = :id",
            ['id' => $user_id]
        );
        
        if (!password_verify($input['current_password'], $user['password'])) {
            jsonResponse(['error' => 'Password saat ini salah'], 400);
        }
        
        if (strlen($input['new_password']) < 6) {
            jsonResponse(['error' => 'Password baru harus minimal 6 karakter'], 400);
        }
        
        $updates[] = "password = :password";
        $bindings['password'] = password_hash($input['new_password'], PASSWORD_BCRYPT);
    }
    
    if (empty($updates)) {
        jsonResponse(['error' => 'Tidak ada data yang diubah'], 400);
    }
    
    $bindings['id'] = $user_id;
    
    $query = "UPDATE users SET " . implode(", ", $updates) . " WHERE id = :id";
    executeQuery($query, $bindings);
    
    jsonResponse([
        'success' => true,
        'message' => 'Profil berhasil diupdate'
    ]);
}

function handleDeleteAccount($user_id) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Require password confirmation
    if (empty($input['password'])) {
        jsonResponse(['error' => 'Password diperlukan untuk menghapus akun'], 400);
    }
    
    $user = getSingleResult(
        "SELECT password FROM users WHERE id = :id",
        ['id' => $user_id]
    );
    
    if (!password_verify($input['password'], $user['password'])) {
        jsonResponse(['error' => 'Password salah'], 401);
    }
    
    $db = new Database();
    $conn = $db->getConnection();
    $conn->beginTransaction();
    
    try {
        // Delete or mark user data
        // Option 1: Soft delete - mark as inactive
        $conn->prepare("UPDATE users SET status = 'inactive' WHERE id = :id")
            ->execute(['id' => $user_id]);
        
        // Option 2: Keep data but clear sensitive info
        // Could also anonymize order history, etc.
        
        // Clear sessions
        session_destroy();
        
        $conn->commit();
        
        jsonResponse([
            'success' => true,
            'message' => 'Akun berhasil dihapus'
        ]);
        
    } catch (Exception $e) {
        $conn->rollBack();
        jsonResponse(['error' => 'Gagal menghapus akun: ' . $e->getMessage()], 500);
    }
}
?>
