<?php
// setup_database.php - Initialize database and insert test users

require_once 'config/config.php';
require_once 'config/database.php';

try {
    echo "Checking database connection...\n";
    
    // Create database instance
    $database = new Database();
    $conn = $database->getConnection();
    
    if ($conn === null) {
        throw new Exception("Database connection failed. Make sure XAMPP MySQL is running.");
    }
    
    echo "✓ Database connected successfully\n\n";
    
    // Create tables from database.sql
    echo "Setting up database tables...\n";
    $sql_file = file_get_contents('database.sql');
    
    // Split by semicolon and execute
    $queries = array_filter(array_map('trim', explode(';', $sql_file)));
    
    foreach ($queries as $query) {
        if (!empty($query)) {
            try {
                $conn->exec($query);
                echo "✓ " . substr($query, 0, 50) . "...\n";
            } catch (PDOException $e) {
                // Table might already exist, continue
                echo "ℹ " . substr($query, 0, 40) . "... (table exists or skipped)\n";
            }
        }
    }
    
    echo "\n";
    
    // Insert test users
    echo "Inserting test users...\n";
    
    // Admin user
    $admin_password = password_hash('admin123', PASSWORD_DEFAULT);
    try {
        $admin_query = "INSERT INTO users (name, email, password, phone, role) 
                        VALUES ('Admin User', 'admin@transmart.com', '$admin_password', '081234567890', 'admin')
                        ON DUPLICATE KEY UPDATE email='admin@transmart.com'";
        $conn->exec($admin_query);
        echo "✓ Admin user ready (admin@transmart.com / admin123)\n";
    } catch (PDOException $e) {
        // Update existing user
        $update_query = "UPDATE users SET password = '$admin_password' WHERE email = 'admin@transmart.com'";
        $conn->exec($update_query);
        echo "✓ Admin user updated (admin@transmart.com / admin123)\n";
    }
    
    // Customer user
    $customer_password = password_hash('password123', PASSWORD_DEFAULT);
    try {
        $customer_query = "INSERT INTO users (name, email, password, phone, role) 
                          VALUES ('Budi Santoso', 'budi@example.com', '$customer_password', '081987654321', 'customer')
                          ON DUPLICATE KEY UPDATE email='budi@example.com'";
        $conn->exec($customer_query);
        echo "✓ Customer user ready (budi@example.com / password123)\n";
    } catch (PDOException $e) {
        // Update existing user
        $update_query = "UPDATE users SET password = '$customer_password' WHERE email = 'budi@example.com'";
        $conn->exec($update_query);
        echo "✓ Customer user updated (budi@example.com / password123)\n";
    }
    
    echo "\n";
    echo "✓ Database setup completed successfully!\n";
    echo "\nYou can now login with:\n";
    echo "  Admin: admin@transmart.com / admin123\n";
    echo "  Customer: budi@example.com / password123\n";
    
} catch (Exception $e) {
    echo "✗ Error: " . $e->getMessage() . "\n";
    echo "\nMake sure:\n";
    echo "1. XAMPP is running (Apache & MySQL)\n";
    echo "2. Database 'transmart_db' exists in phpMyAdmin\n";
    echo "3. Database credentials in config/config.php are correct\n";
}
?>

