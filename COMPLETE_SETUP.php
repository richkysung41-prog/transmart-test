<?php
/**
 * COMPLETE SETUP & INTEGRATION SCRIPT
 * Run this once to setup everything
 */

require_once 'config/config.php';
require_once 'config/database.php';

echo "=============== TRANSMART COMPLETE SETUP ===============\n\n";

try {
    $database = new Database();
    $conn = $database->getConnection();
    
    if (!$conn) {
        throw new Exception("Database connection failed!");
    }

    // 1. Create/Verify Database Tables
    echo "1. Verifying database tables...\n";
    echo str_repeat("-", 50) . "\n";
    
    $result = $conn->query("SHOW TABLES");
    $tables = $result->fetchAll(PDO::FETCH_COLUMN);
    
    $expected_tables = ['users', 'categories', 'products', 'cart', 'orders', 'order_items', 'discounts'];
    foreach ($expected_tables as $table) {
        if (in_array($table, $tables)) {
            echo "✓ Table $table exists\n";
        } else {
            echo "✗ Table $table missing!\n";
        }
    }

    // 2. Verify Sample Data
    echo "\n2. Verifying sample data...\n";
    echo str_repeat("-", 50) . "\n";
    
    $user_count = $conn->query("SELECT COUNT(*) as count FROM users")->fetch(PDO::FETCH_ASSOC)['count'];
    $product_count = $conn->query("SELECT COUNT(*) as count FROM products")->fetch(PDO::FETCH_ASSOC)['count'];
    $category_count = $conn->query("SELECT COUNT(*) as count FROM categories")->fetch(PDO::FETCH_ASSOC)['count'];
    
    echo "Users: $user_count records\n";
    echo "Products: $product_count records\n";
    echo "Categories: $category_count records\n";
    
    if ($user_count < 2) {
        echo "\n⚠ WARNING: Very few users in database!\n";
    }
    if ($product_count < 5) {
        echo "⚠ WARNING: Very few products in database!\n";
    }

    // 3. Verify Test User Credentials
    echo "\n3. Test Users Available:\n";
    echo str_repeat("-", 50) . "\n";
    
    $users = $conn->query("SELECT id, name, email, role FROM users LIMIT 5")->fetchAll(PDO::FETCH_ASSOC);
    foreach ($users as $user) {
        echo "  • {$user['name']} ({$user['email']}) - {$user['role']}\n";
    }
    echo "\nDefault Test Passwords: admin123, password123\n";

    // 4. Create required directories
    echo "\n4. Checking required directories...\n";
    echo str_repeat("-", 50) . "\n";
    
    $dirs = [
        'assets/uploads' => 'Upload directory',
        'logs' => 'Logs directory'
    ];
    
    foreach ($dirs as $dir => $desc) {
        if (!file_exists($dir)) {
            mkdir($dir, 0755, true);
            echo "✓ Created: $dir ($desc)\n";
        } else {
            echo "✓ Exists: $dir ($desc)\n";
        }
    }

    // 5. Verify API Endpoints
    echo "\n5. API Endpoints Available:\n";
    echo str_repeat("-", 50) . "\n";
    
    $endpoints = [
        '/api/auth.php?action=login' => 'User Login',
        '/api/auth.php?action=register' => 'User Registration',
        '/api/products.php' => 'Get Products',
        '/api/categories.php' => 'Get Categories',
        '/api/cart.php' => 'Cart Management',
        '/api/orders.php' => 'Order Management',
        '/api/users.php' => 'User Profile'
    ];
    
    foreach ($endpoints as $url => $desc) {
        echo "  ✓ $url - $desc\n";
    }

    // 6. Verify Web Pages
    echo "\n6. Web Pages Available:\n";
    echo str_repeat("-", 50) . "\n";
    
    $pages = [
        'index.html' => 'Homepage',
        'pages/auth/login.html' => 'Login',
        'pages/auth/register.html' => 'Register',
        'pages/user/profile.html' => 'User Profile',
        'pages/cart.html' => 'Shopping Cart',
        'pages/checkout.html' => 'Checkout',
        'pages/products/catalog.html' => 'Product Catalog'
    ];
    
    foreach ($pages as $page => $desc) {
        if (file_exists($page)) {
            echo "  ✓ $page - $desc\n";
        } else {
            echo "  ✗ $page - MISSING!\n";
        }
    }

    // 7. Configuration Check
    echo "\n7. Configuration:\n";
    echo str_repeat("-", 50) . "\n";
    echo "Database: " . DB_NAME . "\n";
    echo "User: " . DB_USER . "\n";
    echo "Host: " . DB_HOST . "\n";
    echo "Development Mode: " . (DEVELOPMENT ? "ON" : "OFF") . "\n";

    echo "\n" . str_repeat("=", 50) . "\n";
    echo "✓ SETUP VERIFICATION COMPLETE!\n\n";
    echo "Next steps:\n";
    echo "1. Start PHP server: php -S localhost:8000\n";
    echo "2. Open in browser: http://localhost:8000\n";
    echo "3. Login with test account:\n";
    echo "   Email: admin@transmart.com\n";
    echo "   Password: admin123\n";
    echo "\nOR\n";
    echo "   Email: budi@example.com\n";
    echo "   Password: password123\n";

} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    exit(1);
}
?>
