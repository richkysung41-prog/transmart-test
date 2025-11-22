<?php
/**
 * Database Diagnostic Tool
 * Script untuk mengecek struktur dan data database Transmart
 */

require_once 'config/config.php';
require_once 'config/database.php';

try {
    $database = new Database();
    $conn = $database->getConnection();
    
    if (!$conn) {
        throw new Exception("Koneksi database gagal!");
    }

    echo "=== DATABASE DIAGNOSTIC ===\n\n";

    // 1. Get all tables
    echo "1. TABEL YANG ADA DI DATABASE:\n";
    echo str_repeat("-", 50) . "\n";
    
    $result = $conn->query("SHOW TABLES");
    $tables = $result->fetchAll(PDO::FETCH_COLUMN);
    
    foreach ($tables as $table) {
        $countResult = $conn->query("SELECT COUNT(*) as count FROM $table");
        $count = $countResult->fetch(PDO::FETCH_ASSOC)['count'];
        echo "  ✓ $table ($count records)\n";
    }

    echo "\n2. STRUKTUR SETIAP TABEL:\n";
    echo str_repeat("-", 50) . "\n";

    foreach ($tables as $table) {
        echo "\nTable: $table\n";
        $result = $conn->query("DESCRIBE $table");
        $columns = $result->fetchAll(PDO::FETCH_ASSOC);
        
        foreach ($columns as $col) {
            $type = $col['Type'];
            $key = $col['Key'] ? " [" . $col['Key'] . "]" : "";
            $null = $col['Null'] == 'NO' ? " NOT NULL" : " (nullable)";
            echo "  - {$col['Field']}: {$type}{$key}{$null}\n";
        }
    }

    echo "\n3. DATA PREVIEW:\n";
    echo str_repeat("-", 50) . "\n";

    // Users
    echo "\nUSERS:\n";
    $result = $conn->query("SELECT id, name, email, phone, role, created_at FROM users LIMIT 5");
    $users = $result->fetchAll(PDO::FETCH_ASSOC);
    foreach ($users as $user) {
        echo "  ID:{$user['id']} | {$user['name']} | {$user['email']} | {$user['phone']} | {$user['role']}\n";
    }

    // Categories
    if (in_array('categories', $tables)) {
        echo "\nCATEGORIES:\n";
        $result = $conn->query("SELECT id, name FROM categories LIMIT 5");
        $categories = $result->fetchAll(PDO::FETCH_ASSOC);
        foreach ($categories as $cat) {
            echo "  ID:{$cat['id']} | {$cat['name']}\n";
        }
    }

    // Products
    if (in_array('products', $tables)) {
        echo "\nPRODUCTS:\n";
        $result = $conn->query("SELECT id, name, price, stock, category_id FROM products LIMIT 5");
        $products = $result->fetchAll(PDO::FETCH_ASSOC);
        foreach ($products as $prod) {
            echo "  ID:{$prod['id']} | {$prod['name']} | Rp{$prod['price']} | Stock:{$prod['stock']} | Cat:{$prod['category_id']}\n";
        }
    }

    // Orders
    if (in_array('orders', $tables)) {
        echo "\nORDERS:\n";
        $result = $conn->query("SELECT id, user_id, total_price, status, created_at FROM orders LIMIT 5");
        $orders = $result->fetchAll(PDO::FETCH_ASSOC);
        foreach ($orders as $order) {
            echo "  ID:{$order['id']} | User:{$order['user_id']} | Rp{$order['total_price']} | {$order['status']} | {$order['created_at']}\n";
        }
    }

    echo "\n" . str_repeat("=", 50) . "\n";
    echo "✓ Database diagnostic selesai!\n";

} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
?>
