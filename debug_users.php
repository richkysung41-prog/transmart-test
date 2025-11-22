<?php
require_once 'config/config.php';
require_once 'config/database.php';

try {
    $database = new Database();
    $conn = $database->getConnection();
    
    // Check users
    echo "Checking users in database:\n";
    $result = $conn->query("SELECT id, name, email, password FROM users LIMIT 5");
    $users = $result->fetchAll(PDO::FETCH_ASSOC);
    
    if (count($users) == 0) {
        echo "No users found!\n";
    } else {
        foreach ($users as $user) {
            echo "\nUser ID: " . $user['id'] . "\n";
            echo "  Name: " . $user['name'] . "\n";
            echo "  Email: " . $user['email'] . "\n";
            echo "  Password Hash: " . substr($user['password'], 0, 30) . "...\n";
            
            // Test password verification
            if ($user['email'] == 'admin@transmart.com') {
                $test_pass = 'admin123';
                $verify = password_verify($test_pass, $user['password']);
                echo "  Testing password '$test_pass': " . ($verify ? "PASS" : "FAIL") . "\n";
            }
        }
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
