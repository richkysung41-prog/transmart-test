<?php
// Test register directly
require_once 'config/config.php';
require_once 'config/functions.php';

$input = [
    'name' => 'Test User',
    'email' => 'testuser@example.com',
    'phone' => '081234567890',
    'password' => 'Test123'
];

echo "Starting test...\n";

try {
    $result = TransmartFunctions::registerUser($input);
    echo json_encode($result, JSON_PRETTY_PRINT);
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . "\n";
    echo "Line: " . $e->getLine() . "\n";
}
?>
