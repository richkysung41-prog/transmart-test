<?php
// api/api_helper.php

/**
 * JSON Response Helper
 * Mengirim response JSON dengan format yang konsisten
 */
function jsonResponse($data, $status = 200) {
    http_response_code($status);
    echo json_encode($data);
    exit();
}

/**
 * Check if user is authenticated
 */
function checkAuth() {
    if (!isset($_SESSION['user_id'])) {
        jsonResponse(['error' => 'Unauthorized - Please login'], 401);
    }
}

/**
 * Check if user is admin
 */
function isAdmin() {
    return isset($_SESSION['user_role']) && $_SESSION['user_role'] === 'admin';
}

/**
 * Get current user ID
 */
function getCurrentUserId() {
    return $_SESSION['user_id'] ?? null;
}

/**
 * Get current user role
 */
function getCurrentUserRole() {
    return $_SESSION['user_role'] ?? 'guest';
}

/**
 * Sanitize input array
 */
function sanitizeInput($input) {
    if (is_array($input)) {
        return array_map('sanitizeInput', $input);
    }
    return htmlspecialchars(strip_tags($input), ENT_QUOTES, 'UTF-8');
}

/**
 * Validate email format
 */
function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

/**
 * Validate phone number format (Indonesian)
 */
function validatePhone($phone) {
    // Accept 10-15 digit phone numbers, with or without + or -
    return preg_match('/^(\+|0|62)?[0-9\-\s]{8,14}$/', $phone);
}

/**
 * Format currency (Indonesian Rupiah)
 */
function formatCurrency($value) {
    return number_format($value, 0, ',', '.');
}

/**
 * Generate order number
 */
function generateOrderNumber() {
    return 'ORD-' . date('YmdHis') . '-' . rand(1000, 9999);
}

/**
 * Upload image file
 */
function uploadImage($file_input_name) {
    if (!isset($_FILES[$file_input_name])) {
        return ['error' => 'File tidak ditemukan'];
    }
    
    $file = $_FILES[$file_input_name];
    
    // Validate file
    $allowed_extensions = ['jpg', 'jpeg', 'png', 'gif'];
    $file_ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    
    if (!in_array($file_ext, $allowed_extensions)) {
        return ['error' => 'Tipe file tidak diizinkan'];
    }
    
    if ($file['size'] > 5242880) { // 5MB
        return ['error' => 'Ukuran file terlalu besar (max 5MB)'];
    }
    
    // Create upload directory if not exists
    $upload_dir = dirname(__DIR__) . '/assets/uploads/';
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0755, true);
    }
    
    // Generate unique filename
    $filename = uniqid() . '_' . time() . '.' . $file_ext;
    $filepath = $upload_dir . $filename;
    
    // Move uploaded file
    if (move_uploaded_file($file['tmp_name'], $filepath)) {
        return ['success' => true, 'filename' => $filename];
    }
    
    return ['error' => 'Gagal mengupload file'];
}

/**
 * Get pagination data
 */
function getPaginationData($total, $limit, $page) {
    $total_pages = ceil($total / $limit);
    
    return [
        'total' => $total,
        'limit' => $limit,
        'page' => $page,
        'total_pages' => $total_pages,
        'has_next' => $page < $total_pages,
        'has_prev' => $page > 1
    ];
}

/**
 * Log activity
 */
function logActivity($action, $description, $user_id = null) {
    $user_id = $user_id ?? getCurrentUserId() ?? 'system';
    $timestamp = date('Y-m-d H:i:s');
    $log_message = "[$timestamp] User: $user_id | Action: $action | Description: $description";
    
    $log_file = dirname(__DIR__) . '/logs/activity.log';
    
    // Create logs directory if not exists
    if (!is_dir(dirname($log_file))) {
        mkdir(dirname($log_file), 0755, true);
    }
    
    file_put_contents($log_file, $log_message . "\n", FILE_APPEND);
}

/**
 * Send email (using PHPMailer or simple mail)
 */
function sendEmail($to, $subject, $message, $is_html = true) {
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= $is_html ? "Content-type: text/html; charset=UTF-8" . "\r\n" : "Content-type: text/plain; charset=UTF-8" . "\r\n";
    $headers .= "From: " . SITE_EMAIL . "\r\n";
    
    return mail($to, $subject, $message, $headers);
}

/**
 * Check API request validity
 */
function validateApiRequest() {
    // Check request method
    if (!in_array($_SERVER['REQUEST_METHOD'], ['GET', 'POST', 'PUT', 'DELETE'])) {
        jsonResponse(['error' => 'Method not allowed'], 405);
    }
    
    // Check content type for POST/PUT
    if (in_array($_SERVER['REQUEST_METHOD'], ['POST', 'PUT'])) {
        $content_type = $_SERVER['CONTENT_TYPE'] ?? '';
        if (strpos($content_type, 'application/json') === false && 
            strpos($content_type, 'application/x-www-form-urlencoded') === false &&
            strpos($content_type, 'multipart/form-data') === false) {
            // jsonResponse(['error' => 'Invalid Content-Type'], 400);
        }
    }
}

/**
 * Get request data (POST/PUT)
 */
function getRequestData() {
    $content_type = $_SERVER['CONTENT_TYPE'] ?? '';
    
    if (strpos($content_type, 'application/json') !== false) {
        return json_decode(file_get_contents('php://input'), true) ?? [];
    } elseif (strpos($content_type, 'multipart/form-data') !== false) {
        return $_POST;
    }
    
    return $_REQUEST;
}

/**
 * Format response success
 */
function responseSuccess($data = [], $message = 'Success', $status = 200) {
    return [
        'success' => true,
        'message' => $message,
        'data' => $data
    ];
}

/**
 * Format response error
 */
function responseError($message = 'Error', $status = 400, $details = []) {
    return [
        'success' => false,
        'error' => $message,
        'details' => $details
    ];
}

/**
 * Calculate discount price
 */
function calculateDiscountPrice($original_price, $discount_percent) {
    $discount_amount = ($original_price * $discount_percent) / 100;
    return $original_price - $discount_amount;
}

/**
 * Get file from API
 */
function getJsonInput() {
    $content = file_get_contents('php://input');
    return json_decode($content, true);
}
?>
