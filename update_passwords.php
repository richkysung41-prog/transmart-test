<?php
require_once 'config/config.php';
require_once 'config/database.php';

$database = new Database();
$conn = $database->getConnection();

$admin_password = password_hash('admin123', PASSWORD_DEFAULT);
$budi_password = password_hash('password123', PASSWORD_DEFAULT);

$conn->exec("UPDATE users SET password = '$admin_password' WHERE email = 'admin@transmart.com'");
$conn->exec("UPDATE users SET password = '$budi_password' WHERE email = 'budi@example.com'");

echo "✓ Passwords updated successfully!\n";
?>
