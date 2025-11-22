<?php
// api/auth.php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:8000');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

require_once '../config/config.php';
require_once '../config/functions.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

if ($method !== 'POST') {
    jsonResponse(['error' => 'Method not allowed'], 405);
}

try {
    $input = json_decode(file_get_contents('php://input'), true);
    
    switch ($action) {
        case 'login':
            handleLogin($input);
            break;
            
        case 'register':
            handleRegister($input);
            break;
            
        case 'logout':
            handleLogout();
            break;
            
        default:
            jsonResponse(['error' => 'Invalid action'], 400);
    }
} catch (Exception $e) {
    jsonResponse(['error' => $e->getMessage()], 500);
}

function handleLogin($input) {
    // Validation
    if (empty($input['email']) || empty($input['password'])) {
        jsonResponse(['error' => 'Email dan password harus diisi'], 400);
    }
    
    $result = TransmartFunctions::loginUser($input['email'], $input['password']);
    
    if (isset($result['error'])) {
        jsonResponse(['error' => $result['error']], 401);
    }
    
    jsonResponse([
        'success' => true,
        'user' => [
            'id' => $result['user']['id'],
            'name' => $result['user']['name'],
            'email' => $result['user']['email'],
            'phone' => $result['user']['phone'],
            'role' => $result['user']['role'] ?? 'customer'
        ],
        'message' => 'Login berhasil'
    ]);
}

function handleRegister($input) {
    // Validation
    $required_fields = ['name', 'email', 'password', 'phone'];
    foreach ($required_fields as $field) {
        if (empty($input[$field])) {
            jsonResponse(['error' => "Field $field diperlukan"], 400);
        }
    }
    
    $result = TransmartFunctions::registerUser($input);
    
    if (isset($result['error'])) {
        jsonResponse(['error' => $result['error']], 400);
    }
    
    jsonResponse([
        'success' => true,
        'message' => 'Pendaftaran berhasil. Silakan login.'
    ], 201);
}

function handleLogout() {
    session_destroy();
    jsonResponse(['success' => true, 'message' => 'Logout successful']);
}
?>