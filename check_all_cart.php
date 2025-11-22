<?php
require_once 'config/config.php';
require_once 'config/functions.php';

echo "ALL CART ITEMS IN DATABASE:\n";
echo "============================\n\n";

$all_cart = getAllResults(
    "SELECT c.*, p.name, p.price 
     FROM cart c 
     JOIN products p ON c.product_id = p.id 
     ORDER BY c.user_id, c.id"
);

foreach ($all_cart as $item) {
    echo "ID={$item['id']}, User={$item['user_id']}, Product={$item['name']}, Qty={$item['quantity']}\n";
}

echo "\n\nCOUNT BY USER:\n";
$counts = getAllResults(
    "SELECT user_id, COUNT(*) as count, SUM(quantity) as total_qty 
     FROM cart 
     GROUP BY user_id"
);

foreach ($counts as $row) {
    echo "User {$row['user_id']}: {$row['count']} items, {$row['total_qty']} qty\n";
}
?>
