<?php
// config/config.php

// Start session FIRST before anything else
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Development mode
define('DEVELOPMENT', true);

// Site configuration
define('SITE_NAME', 'Transmart');
define('SITE_URL', 'http://localhost/transmart-project');
define('SITE_EMAIL', 'support@transmart.com');

// Database configuration
define('DB_HOST', '127.0.0.1');
define('DB_PORT', 3306);
define('DB_NAME', 'transmart_db');
define('DB_USER', 'root');
define('DB_PASS', '');

// File upload configuration
define('UPLOAD_DIR', 'assets/uploads/');
define('MAX_FILE_SIZE', 5242880); // 5MB
define('ALLOWED_IMAGE_TYPES', ['jpg', 'jpeg', 'png', 'gif']);

// Security configuration
define('ENCRYPTION_KEY', 'your-secret-key-here');
define('JWT_SECRET', 'your-jwt-secret-here');

// Email configuration
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);
define('SMTP_USER', 'your-email@gmail.com');
define('SMTP_PASS', 'your-email-password');

// Payment configuration
define('MIDTRANS_SERVER_KEY', 'your-midtrans-server-key');
define('MIDTRANS_CLIENT_KEY', 'your-midtrans-client-key');
define('MIDTRANS_IS_PRODUCTION', false);

// Error reporting
if (defined('DEVELOPMENT') && DEVELOPMENT) {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
    ini_set('log_errors', 1);
    ini_set('error_log', dirname(__DIR__) . '/logs/error.log');
} else {
    error_reporting(0);
    ini_set('display_errors', 0);
}

// Include required files
require_once 'database.php';

// Global functions
function sanitizeInput($data) {
    if (is_array($data)) {
        return array_map('sanitizeInput', $data);
    }
    return htmlspecialchars(strip_tags(trim($data)));
}

function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

function validatePhone($phone) {
    // Accept Indonesian phone format: 08xxxxxxxxxx (9-13 digits total)
    // Or international format with +62
    return preg_match('/^(08|\\+628)[0-9]{7,11}$/', $phone) || preg_match('/^08\d{7,11}$/', $phone);
}

function generateToken($length = 32) {
    return bin2hex(random_bytes($length));
}

function formatPrice($price) {
    return 'Rp ' . number_format($price, 0, ',', '.');
}

function redirect($url) {
    header("Location: $url");
    exit();
}

function jsonResponse($data, $status = 200) {
    http_response_code($status);
    header('Content-Type: application/json');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    
    echo json_encode($data);
    exit();
}

function checkAuth() {
    if (!isset($_SESSION['user_id'])) {
        if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && $_SERVER['HTTP_X_REQUESTED_WITH'] == 'XMLHttpRequest') {
            jsonResponse(['error' => 'Unauthorized'], 401);
        } else {
            redirect('pages/auth/login.html');
        }
    }
    return $_SESSION['user_id'];
}

function isAdmin() {
    return isset($_SESSION['user_role']) && $_SESSION['user_role'] === 'admin';
}

function uploadFile($file, $directory = '') {
    $target_dir = UPLOAD_DIR . $directory;
    
    // Create directory if not exists
    if (!file_exists($target_dir)) {
        mkdir($target_dir, 0777, true);
    }
    
    $file_extension = strtolower(pathinfo($file["name"], PATHINFO_EXTENSION));
    $file_name = uniqid() . '_' . time() . '.' . $file_extension;
    $target_file = $target_dir . $file_name;
    
    // Check file size
    if ($file["size"] > MAX_FILE_SIZE) {
        return ['error' => 'File terlalu besar. Maksimal 5MB.'];
    }
    
    // Check file type
    if (!in_array($file_extension, ALLOWED_IMAGE_TYPES)) {
        return ['error' => 'Hanya file JPG, JPEG, PNG, dan GIF yang diizinkan.'];
    }
    
    // Upload file
    if (move_uploaded_file($file["tmp_name"], $target_file)) {
        return ['success' => true, 'file_path' => $target_file, 'file_name' => $file_name];
    } else {
        return ['error' => 'Terjadi kesalahan saat mengupload file.'];
    }
}
?>