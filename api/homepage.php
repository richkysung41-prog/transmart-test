<?php
/**
 * Homepage Data API
 * Fetch categories, featured products, etc for homepage
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/config.php';
require_once '../config/functions.php';

try {
    $section = $_GET['section'] ?? 'all';
    
    switch ($section) {
        case 'featured':
            getFeaturedProducts();
            break;
            
        case 'categories':
            getCategories();
            break;
            
        case 'latest':
            getLatestProducts();
            break;
            
        case 'all':
        default:
            getHomepageData();
    }
    
} catch (Exception $e) {
    jsonResponse(['error' => $e->getMessage()], 500);
}

function getFeaturedProducts() {
    $products = getAllResults(
        "SELECT id, name, price, image, discount, rating, total_sold, category_id 
         FROM products 
         WHERE stock > 0 
         ORDER BY rating DESC, total_sold DESC 
         LIMIT 8"
    );
    
    jsonResponse([
        'success' => true,
        'data' => $products
    ]);
}

function getLatestProducts() {
    $products = getAllResults(
        "SELECT id, name, price, image, discount, rating, total_sold, category_id 
         FROM products 
         WHERE stock > 0 
         ORDER BY created_at DESC 
         LIMIT 12"
    );
    
    jsonResponse([
        'success' => true,
        'data' => $products
    ]);
}

function getCategories() {
    $categories = getAllResults(
        "SELECT id, name, description FROM categories ORDER BY name"
    );
    
    jsonResponse([
        'success' => true,
        'data' => $categories
    ]);
}

function getHomepageData() {
    $featured = getAllResults(
        "SELECT id, name, price, image, discount, rating, total_sold, category_id
         FROM products
         WHERE stock > 0
         ORDER BY rating DESC, total_sold DESC
         LIMIT 8"
    );

    $categories = getAllResults(
        "SELECT id, name, description FROM categories ORDER BY name LIMIT 6"
    );

    $banners = getAllResults(
        "SELECT id, title, subtitle, button_text, button_url, image_url, background_color
         FROM banners
         WHERE is_active = 1
         ORDER BY sort_order ASC, created_at DESC"
    );

    $stats = getSingleResult(
        "SELECT
            (SELECT COUNT(*) FROM users) as total_users,
            (SELECT COUNT(*) FROM products) as total_products,
            (SELECT COUNT(*) FROM orders) as total_orders,
            (SELECT SUM(total_price) FROM orders WHERE status='delivered') as total_revenue"
    );

    jsonResponse([
        'success' => true,
        'featured_products' => $featured,
        'categories' => $categories,
        'banners' => $banners,
        'stats' => $stats
    ]);
}
?>
