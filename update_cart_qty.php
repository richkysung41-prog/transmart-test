<?php
require_once 'config/config.php';
require_once 'config/functions.php';

// Update user 38's wireless to qty 10
$result = updateRecord(
    'cart',
    ['quantity' => 10],
    'id = 13',
    []
);

echo "Updated cart ID 13 to qty 10\n";

// Check result
$cart38 = getAllResults(
    "SELECT c.*, p.name, p.price 
     FROM cart c 
     JOIN products p ON c.product_id = p.id 
     WHERE c.user_id = 38"
);

echo "\nUser 38 Cart After Update:\n";
foreach ($cart38 as $item) {
    echo "- {$item['name']}: {$item['quantity']}x @ Rp{$item['price']}\n";
}
?>
