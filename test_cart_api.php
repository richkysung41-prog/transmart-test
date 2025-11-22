<?php
// Test cart API
session_start();
$_SESSION['user_id'] = 1;

require_once 'config/config.php';
require_once 'config/functions.php';

// Simulate API call
$user_id = $_SESSION['user_id'];

echo "Testing TransmartFunctions::getCart($user_id)\n";
echo "============================================================\n\n";

$cart_items = TransmartFunctions::getCart($user_id);

echo "Number of items: " . count($cart_items) . "\n";
echo "\nItems:\n";

foreach ($cart_items as $index => $item) {
    echo "[$index] " . $item['name'] . " - Qty: " . $item['quantity'] . " - Price: " . $item['price'] . "\n";
}

echo "\n\nCalculating totals:\n";
$total_items = 0;
$total_price = 0;

foreach ($cart_items as $item) {
    $total_items += $item['quantity'];
    $total_price += ($item['price'] * $item['quantity']);
}

echo "Total Items: $total_items\n";
echo "Total Price: $total_price\n";

echo "\n\nJSON Output:\n";
echo json_encode([
    'success' => true,
    'data' => $cart_items,
    'summary' => [
        'total_items' => $total_items,
        'total_price' => $total_price
    ]
], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
?>
