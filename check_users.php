<?php
require_once 'config/config.php';
require_once 'config/functions.php';

// Check user 38
$user38_cart = getAllResults(
    "SELECT c.*, p.name, p.price 
     FROM cart c 
     JOIN products p ON c.product_id = p.id 
     WHERE c.user_id = 38"
);

echo "User 38 Cart:\n";
if (empty($user38_cart)) {
    echo "Empty\n";
} else {
    foreach ($user38_cart as $item) {
        echo "- {$item['name']}: {$item['quantity']}x @ Rp{$item['price']}\n";
    }
}

// Check all users
echo "\n\nAll Users:\n";
$users = getAllResults("SELECT id, name, email FROM users ORDER BY id");
foreach ($users as $user) {
    echo "- ID {$user['id']}: {$user['name']} ({$user['email']})\n";
}
?>
