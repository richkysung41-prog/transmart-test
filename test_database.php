<?php
/**
 * Test Database Connection
 * 
 * Run: php test_database.php
 */

require_once 'config/config.php';
require_once 'config/database.php';

echo "=== Database Connection Test ===\n";
echo "Database: " . DB_NAME . "\n";
echo "Host: " . DB_HOST . ":" . DB_PORT . "\n";
echo "User: " . DB_USER . "\n\n";

$database = new Database();
$conn = $database->getConnection();

if ($conn === null) {
    echo "❌ Connection FAILED\n";
    echo "Error: Check your database configuration\n";
    exit(1);
}

echo "✅ Connection SUCCESS\n\n";

// Test query
echo "=== Database Tables ===\n";
$tables = $conn->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);

if (empty($tables)) {
    echo "❌ No tables found. Please import database.sql\n";
    exit(1);
}

foreach ($tables as $table) {
    echo "✅ Table: $table\n";
}

echo "\n=== Sample Data ===\n";

// Check users
$users = $conn->query("SELECT COUNT(*) as count FROM users")->fetch(PDO::FETCH_ASSOC);
echo "✅ Users: " . $users['count'] . "\n";

// Check products
$products = $conn->query("SELECT COUNT(*) as count FROM products")->fetch(PDO::FETCH_ASSOC);
echo "✅ Products: " . $products['count'] . "\n";

// Check categories
$categories = $conn->query("SELECT COUNT(*) as count FROM categories")->fetch(PDO::FETCH_ASSOC);
echo "✅ Categories: " . $categories['count'] . "\n";

echo "\n✅ Database is ready!\n";
?>
