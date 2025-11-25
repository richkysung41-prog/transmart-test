<?php
// create_admin.php - Membuat akun admin untuk testing

require_once 'config/database.php';
require_once 'config/functions.php';

try {
    $db = new Database();
    $conn = $db->getConnection();
    
    if (!$conn) {
        die("❌ Database connection failed!\n");
    }
    
    echo "✓ Database connected\n\n";
    
    // Data admin
    $admin_data = [
        'name' => 'Admin User',
        'email' => 'admin@transmart.com',
        'phone' => '08123456789',
        'password' => 'admin123',
        'role' => 'admin'
    ];
    
    // Check if admin exists
    $query = "SELECT id FROM users WHERE email = ? AND role = 'admin'";
    $stmt = $conn->prepare($query);
    $stmt->execute([$admin_data['email']]);
    
    if ($stmt->rowCount() > 0) {
        echo "✓ Admin user already exists!\n";
        echo "  Email: " . $admin_data['email'] . "\n";
        echo "  Password: " . $admin_data['password'] . "\n\n";
    } else {
        // Hash password
        $hashed_password = password_hash($admin_data['password'], PASSWORD_BCRYPT);
        
        // Insert admin
        $query = "INSERT INTO users (name, email, phone, password, role, created_at) 
                  VALUES (?, ?, ?, ?, ?, NOW())";
        $stmt = $conn->prepare($query);
        $stmt->execute([
            $admin_data['name'],
            $admin_data['email'],
            $admin_data['phone'],
            $hashed_password,
            $admin_data['role']
        ]);
        
        echo "✓ Admin user created successfully!\n";
        echo "  Email: " . $admin_data['email'] . "\n";
        echo "  Password: " . $admin_data['password'] . "\n";
        echo "  Role: " . $admin_data['role'] . "\n\n";
    }
    
    // List all admin users
    $query = "SELECT id, name, email, role FROM users WHERE role = 'admin'";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    
    echo "📋 All admin users in database:\n";
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        echo "  - ID: " . $row['id'] . " | " . $row['name'] . " (" . $row['email'] . ")\n";
    }
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
?>
