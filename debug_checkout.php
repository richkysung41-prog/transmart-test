<?php
session_start();
$_SESSION['user_id'] = 1;

require_once 'config/config.php';
require_once 'config/functions.php';

// Get cart
$cart = TransmartFunctions::getCart(1);

echo "Cart Items:\n";
echo json_encode($cart, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "\n\n";

// Calculate totals
$total_items = 0;
$total_price = 0;

foreach ($cart as $item) {
    $total_items += $item['quantity'];
    $total_price += ($item['price'] * $item['quantity']);
}

echo "Summary:\n";
echo "Total Items: $total_items\n";
echo "Total Price: $total_price\n";
?>
