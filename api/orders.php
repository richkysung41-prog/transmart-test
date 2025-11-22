<?php
// api/orders.php

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
            handleGetOrders($user_id);
            break;
            
        case 'POST':
            // Check if this is admin updating order status
            $action = $_POST['action'] ?? $_GET['action'] ?? null;
            
            if ($action === 'update_status' && isAdmin()) {
                handleUpdateOrderStatus();
            } else {
                handleCreateOrder($user_id);
            }
            break;
            
        case 'PUT':
            handleUpdateOrder($user_id);
            break;
            
        case 'DELETE':
            handleCancelOrder($user_id);
            break;
            
        default:
            jsonResponse(['error' => 'Method not allowed'], 405);
    }
} catch (Exception $e) {
    jsonResponse(['error' => $e->getMessage()], 500);
}

function handleGetOrders($user_id) {
    // Get single order by ID if specified
    if (!empty($_GET['id'])) {
        handleGetOrderDetail($user_id, (int)$_GET['id']);
        return;
    }
    
    // Get user's orders with pagination
    $page = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
    $limit = isset($_GET['limit']) ? min((int)$_GET['limit'], 100) : 10;
    $offset = ($page - 1) * $limit;
    
    $is_admin = isAdmin();
    
    // Admin can see all orders, users see only their own
    if ($is_admin && isset($_GET['user_id'])) {
        $filter_user_id = (int)$_GET['user_id'];
    } else {
        $filter_user_id = $user_id;
    }
    
    $orders = getAllResults(
        "SELECT o.id, o.user_id, o.order_number, o.total_price, o.status, 
                o.shipping_address, o.payment_method, o.created_at,
                u.name as user_name, u.email as user_email
         FROM orders o
         LEFT JOIN users u ON o.user_id = u.id
         WHERE o.user_id = :user_id
         ORDER BY o.created_at DESC
         LIMIT :limit OFFSET :offset",
        ['user_id' => $filter_user_id, 'limit' => $limit, 'offset' => $offset]
    );
    
    $total_result = getSingleResult(
        "SELECT COUNT(*) as total FROM orders WHERE user_id = :user_id",
        ['user_id' => $filter_user_id]
    );
    
    $total = $total_result['total'] ?? 0;
    $total_pages = ceil($total / $limit);
    
    jsonResponse([
        'success' => true,
        'data' => $orders,
        'pagination' => [
            'page' => $page,
            'limit' => $limit,
            'total' => $total,
            'total_pages' => $total_pages
        ]
    ]);
}

function handleGetOrderDetail($user_id, $order_id) {
    $order = getSingleResult(
        "SELECT o.id, o.user_id, o.order_number, o.total_price, o.status,
                o.shipping_address, o.payment_method, o.notes, o.created_at
         FROM orders o
         WHERE o.id = :id",
        ['id' => $order_id]
    );
    
    if (!$order) {
        jsonResponse(['error' => 'Order tidak ditemukan'], 404);
    }
    
    // Verify user owns this order or is admin
    if ($order['user_id'] != $user_id && !isAdmin()) {
        jsonResponse(['error' => 'Tidak diizinkan'], 403);
    }
    
    // Get order items
    $items = getAllResults(
        "SELECT oi.id, oi.product_id, oi.quantity, oi.price, p.name, p.image
         FROM order_items oi
         JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = :order_id",
        ['order_id' => $order_id]
    );
    
    $order['items'] = $items;
    
    jsonResponse([
        'success' => true,
        'data' => $order
    ]);
}

function handleCreateOrder($user_id) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (empty($input['shipping_address']) || empty($input['payment_method'])) {
        jsonResponse(['error' => 'Alamat pengiriman dan metode pembayaran diperlukan'], 400);
    }
    
    // Get user's cart
    $cart_items = TransmartFunctions::getCart($user_id);
    
    if (empty($cart_items)) {
        jsonResponse(['error' => 'Keranjang Anda kosong'], 400);
    }
    
    // Calculate total
    $total_price = 0;
    foreach ($cart_items as $item) {
        $total_price += ($item['price'] * $item['quantity']);
    }
    
    // Apply discount if provided
    $discount_id = $input['discount_id'] ?? null;
    $discount_amount = 0;
    
    if ($discount_id) {
        $discount = getSingleResult(
            "SELECT discount_percent FROM discounts WHERE id = :id AND status = 'active'",
            ['id' => $discount_id]
        );
        
        if ($discount) {
            $discount_amount = ($total_price * $discount['discount_percent']) / 100;
            $total_price = $total_price - $discount_amount;
        }
    }
    
    // Ensure total is not negative
    $total_price = max(0, $total_price);
    
    // Generate order number
    $order_number = 'ORD' . date('YmdHis') . rand(1000, 9999);
    
    // Create order
    $db = new Database();
    $conn = $db->getConnection();
    $conn->beginTransaction();
    
    try {
        $stmt = $conn->prepare(
            "INSERT INTO orders (user_id, order_number, total_price, status, shipping_address, payment_method, notes)
             VALUES (:user_id, :order_number, :total_price, 'pending', :shipping_address, :payment_method, :notes)"
        );
        
        $stmt->execute([
            'user_id' => $user_id,
            'order_number' => $order_number,
            'total_price' => $total_price,
            'shipping_address' => sanitizeInput($input['shipping_address']),
            'payment_method' => sanitizeInput($input['payment_method']),
            'notes' => sanitizeInput($input['notes'] ?? '')
        ]);
        
        $order_id = $conn->lastInsertId();
        
        // Insert order items
        foreach ($cart_items as $item) {
            $stmt = $conn->prepare(
                "INSERT INTO order_items (order_id, product_id, quantity, price)
                 VALUES (:order_id, :product_id, :quantity, :price)"
            );
            
            $stmt->execute([
                'order_id' => $order_id,
                'product_id' => $item['product_id'],
                'quantity' => $item['quantity'],
                'price' => $item['price']
            ]);
            
            // Update product stock
            $conn->prepare(
                "UPDATE products SET stock = stock - :quantity WHERE id = :product_id"
            )->execute([
                'quantity' => $item['quantity'],
                'product_id' => $item['product_id']
            ]);
        }
        
        // Clear cart
        $conn->prepare("DELETE FROM cart WHERE user_id = :user_id")
            ->execute(['user_id' => $user_id]);
        
        $conn->commit();
        
        jsonResponse([
            'success' => true,
            'message' => 'Pesanan berhasil dibuat',
            'data' => [
                'order_id' => $order_id,
                'order_number' => $order_number,
                'total_price' => $total_price
            ]
        ], 201);
        
    } catch (Exception $e) {
        $conn->rollBack();
        jsonResponse(['error' => 'Gagal membuat pesanan: ' . $e->getMessage()], 500);
    }
}

function handleUpdateOrder($user_id) {
    if (empty($_GET['id'])) {
        jsonResponse(['error' => 'Order ID diperlukan'], 400);
    }
    
    // Only admin can update order status
    if (!isAdmin()) {
        jsonResponse(['error' => 'Hanya admin yang dapat update pesanan'], 403);
    }
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (empty($input['status'])) {
        jsonResponse(['error' => 'Status diperlukan'], 400);
    }
    
    $valid_statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!in_array($input['status'], $valid_statuses)) {
        jsonResponse(['error' => 'Status tidak valid'], 400);
    }
    
    $result = executeQuery(
        "UPDATE orders SET status = :status WHERE id = :id",
        ['status' => $input['status'], 'id' => (int)$_GET['id']]
    );
    
    jsonResponse([
        'success' => true,
        'message' => 'Status pesanan berhasil diupdate'
    ]);
}

function handleCancelOrder($user_id) {
    if (empty($_GET['id'])) {
        jsonResponse(['error' => 'Order ID diperlukan'], 400);
    }
    
    $order_id = (int)$_GET['id'];
    
    $order = getSingleResult(
        "SELECT user_id, status FROM orders WHERE id = :id",
        ['id' => $order_id]
    );
    
    if (!$order) {
        jsonResponse(['error' => 'Pesanan tidak ditemukan'], 404);
    }
    
    // User can only cancel own pending orders, admin can cancel any non-delivered order
    if ($order['user_id'] != $user_id && !isAdmin()) {
        jsonResponse(['error' => 'Tidak diizinkan'], 403);
    }
    
    if ($order['status'] == 'delivered') {
        jsonResponse(['error' => 'Pesanan sudah dikirim, tidak dapat dibatalkan'], 400);
    }
    
    if ($order['status'] == 'cancelled') {
        jsonResponse(['error' => 'Pesanan sudah dibatalkan sebelumnya'], 400);
    }
    
    // Restore stock
    $items = getAllResults(
        "SELECT product_id, quantity FROM order_items WHERE order_id = :order_id",
        ['order_id' => $order_id]
    );
    
    $db = new Database();
    $conn = $db->getConnection();
    
    try {
        foreach ($items as $item) {
            $conn->prepare(
                "UPDATE products SET stock = stock + :quantity WHERE id = :product_id"
            )->execute([
                'quantity' => $item['quantity'],
                'product_id' => $item['product_id']
            ]);
        }
        
        executeQuery(
            "UPDATE orders SET status = 'cancelled' WHERE id = :id",
            ['id' => $order_id]
        );
        
        jsonResponse([
            'success' => true,
            'message' => 'Pesanan berhasil dibatalkan, stok produk telah dipulihkan'
        ]);
        
    } catch (Exception $e) {
        jsonResponse(['error' => 'Gagal membatalkan pesanan: ' . $e->getMessage()], 500);
    }
}

function handleUpdateOrderStatus() {
    $order_id = (int)($_POST['order_id'] ?? 0);
    $status = sanitizeInput($_POST['status'] ?? '');
    
    if ($order_id <= 0 || empty($status)) {
        jsonResponse(['success' => false, 'message' => 'ID pesanan dan status harus diisi'], 400);
        return;
    }
    
    $valid_statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!in_array($status, $valid_statuses)) {
        jsonResponse(['success' => false, 'message' => 'Status tidak valid'], 400);
        return;
    }
    
    try {
        $db = new Database();
        $conn = $db->getConnection();
        
        $stmt = $conn->prepare("UPDATE orders SET status = :status, updated_at = NOW() WHERE id = :id");
        $stmt->execute([
            ':status' => $status,
            ':id' => $order_id
        ]);
        
        jsonResponse([
            'success' => true,
            'message' => 'Status pesanan berhasil diperbarui'
        ]);
    } catch (Exception $e) {
        jsonResponse(['success' => false, 'message' => 'Gagal memperbarui status: ' . $e->getMessage()], 500);
    }
}
?>
