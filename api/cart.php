<?php
// api/cart.php

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

// For GET requests without authentication, don't redirect
if ($method === 'GET') {
    $user_id = $_SESSION['user_id'] ?? null;
    if (!$user_id) {
        jsonResponse(['success' => true, 'data' => [], 'summary' => ['total_items' => 0, 'total_price' => 0]]);
    }
} else {
    // For POST, PUT, DELETE - require auth
    if (!isset($_SESSION['user_id'])) {
        jsonResponse(['error' => 'Unauthorized'], 401);
    }
    $user_id = $_SESSION['user_id'];
}

try {
    switch ($method) {
        case 'GET':
            handleGetCart($user_id);
            break;
            
        case 'POST':
            handleAddToCart($user_id);
            break;
            
        case 'PUT':
            handleUpdateCart($user_id);
            break;
            
        case 'DELETE':
            handleRemoveFromCart($user_id);
            break;
            
        default:
            jsonResponse(['error' => 'Method not allowed'], 405);
    }
} catch (Exception $e) {
    jsonResponse(['error' => $e->getMessage()], 500);
}

function handleGetCart($user_id) {
    error_log("handleGetCart called with user_id: $user_id");
    error_log("Session ID: " . session_id());
    
    $cart_items = TransmartFunctions::getCart($user_id);
    error_log("Cart items returned: " . json_encode($cart_items));
    
    $total_items = 0;
    $total_price = 0;
    
    foreach ($cart_items as $item) {
        $total_items += $item['quantity'];
        $total_price += ($item['price'] * $item['quantity']);
    }
    
    jsonResponse([
        'success' => true,
        'data' => $cart_items,
        'summary' => [
            'total_items' => $total_items,
            'total_price' => $total_price
        ]
    ]);
}

function handleAddToCart($user_id) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (empty($input['product_id']) || empty($input['quantity'])) {
        jsonResponse(['error' => 'Product ID dan quantity diperlukan'], 400);
    }
    
    $result = TransmartFunctions::addToCart($user_id, (int)$input['product_id'], (int)$input['quantity']);
    
    if (isset($result['error'])) {
        jsonResponse(['error' => $result['error']], 400);
    }
    
    jsonResponse([
        'success' => true,
        'message' => 'Produk ditambahkan ke keranjang'
    ], 201);
}

function handleUpdateCart($user_id) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (empty($input['cart_id']) || empty($input['quantity'])) {
        jsonResponse(['error' => 'Cart ID dan quantity diperlukan'], 400);
    }
    
    // Verify cart item belongs to user
    $cart_item = getSingleResult(
        "SELECT id FROM cart WHERE id = :id AND user_id = :user_id",
        ['id' => (int)$input['cart_id'], 'user_id' => $user_id]
    );
    
    if (!$cart_item) {
        jsonResponse(['error' => 'Item not found'], 404);
    }
    
    $result = TransmartFunctions::updateCartQuantity((int)$input['cart_id'], (int)$input['quantity']);
    
    if (!$result['success']) {
        jsonResponse(['error' => 'Gagal update cart'], 400);
    }
    
    jsonResponse([
        'success' => true,
        'message' => 'Keranjang berhasil diupdate'
    ]);
}

function handleRemoveFromCart($user_id) {
    if (empty($_GET['cart_id'])) {
        jsonResponse(['error' => 'Cart ID diperlukan'], 400);
    }
    
    // Verify cart item belongs to user
    $cart_item = getSingleResult(
        "SELECT id FROM cart WHERE id = :id AND user_id = :user_id",
        ['id' => (int)$_GET['cart_id'], 'user_id' => $user_id]
    );
    
    if (!$cart_item) {
        jsonResponse(['error' => 'Item not found'], 404);
    }
    
    $result = TransmartFunctions::removeFromCart((int)$_GET['cart_id']);
    
    if (!$result['success']) {
        jsonResponse(['error' => 'Gagal hapus item'], 400);
    }
    
    jsonResponse([
        'success' => true,
        'message' => 'Item berhasil dihapus dari keranjang'
    ]);
}
?>