<?php
// functions.php

require_once __DIR__ . '/config.php';

class TransmartFunctions {
    
    // User functions
    public static function registerUser($data) {
        $sanitized_data = sanitizeInput($data);
        
        // Validation
        if (empty($sanitized_data['name']) || empty($sanitized_data['email']) || 
            empty($sanitized_data['password']) || empty($sanitized_data['phone'])) {
            return ['error' => 'Semua field harus diisi'];
        }
        
        if (!validateEmail($sanitized_data['email'])) {
            return ['error' => 'Format email tidak valid'];
        }
        
        if (!validatePhone($sanitized_data['phone'])) {
            return ['error' => 'Format nomor telepon tidak valid'];
        }
        
        if (strlen($sanitized_data['password']) < 6) {
            return ['error' => 'Password minimal 6 karakter'];
        }
        
        // Check if email already exists
        $existing_user = getSingleResult(
            "SELECT id FROM users WHERE email = :email", 
            ['email' => $sanitized_data['email']]
        );
        
        if ($existing_user) {
            return ['error' => 'Email sudah terdaftar'];
        }
        
        // Hash password
        $hashed_password = password_hash($sanitized_data['password'], PASSWORD_DEFAULT);
        
        // Insert user
        $user_data = [
            'name' => $sanitized_data['name'],
            'email' => $sanitized_data['email'],
            'password' => $hashed_password,
            'phone' => $sanitized_data['phone'],
            'address' => $sanitized_data['address'] ?? '',
            'created_at' => date('Y-m-d H:i:s')
        ];
        
        $user_id = insertRecord('users', $user_data);
        
        if (is_array($user_id) && isset($user_id['error'])) {
            return ['error' => 'Terjadi kesalahan saat mendaftar'];
        }
        
        return ['success' => true, 'user_id' => $user_id];
    }
    
    public static function loginUser($email, $password) {
        $user = getSingleResult(
            "SELECT * FROM users WHERE email = :email", 
            ['email' => $email]
        );
        
        if (!$user || !password_verify($password, $user['password'])) {
            return ['error' => 'Email atau password salah'];
        }
        
        // Set session
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_name'] = $user['name'];
        $_SESSION['user_email'] = $user['email'];
        $_SESSION['user_role'] = $user['role'] ?? 'customer';
        
        // Update last login
        updateRecord(
            'users', 
            ['last_login' => date('Y-m-d H:i:s')], 
            'id = :id', 
            ['id' => $user['id']]
        );
        
        return ['success' => true, 'user' => $user];
    }
    
    public static function getUserProfile($user_id) {
        return getSingleResult(
            "SELECT id, name, email, phone, address, created_at, last_login 
             FROM users WHERE id = :id", 
            ['id' => $user_id]
        );
    }
    
    // Product functions
    public static function getProducts($filters = []) {
        $sql = "SELECT p.*, c.name as category_name 
                FROM products p 
                LEFT JOIN categories c ON p.category_id = c.id 
                WHERE 1=1";
        $params = [];
        
        if (!empty($filters['category_id'])) {
            $sql .= " AND p.category_id = :category_id";
            $params['category_id'] = $filters['category_id'];
        }
        
        if (!empty($filters['search'])) {
            $sql .= " AND (p.name LIKE :search OR p.description LIKE :search)";
            $params['search'] = "%{$filters['search']}%";
        }
        
        if (!empty($filters['min_price'])) {
            $sql .= " AND p.price >= :min_price";
            $params['min_price'] = $filters['min_price'];
        }
        
        if (!empty($filters['max_price'])) {
            $sql .= " AND p.price <= :max_price";
            $params['max_price'] = $filters['max_price'];
        }
        
        // Add sorting
        $sort = $filters['sort'] ?? 'created_at';
        $order = $filters['order'] ?? 'DESC';
        $sql .= " ORDER BY p.$sort $order";
        
        // Add pagination
        if (!empty($filters['limit'])) {
            $limit = (int)$filters['limit'];
            $sql .= " LIMIT $limit";
            
            if (!empty($filters['offset'])) {
                $offset = (int)$filters['offset'];
                $sql .= " OFFSET $offset";
            }
        }
        
        return getAllResults($sql, $params);
    }
    
    public static function getProduct($product_id) {
        return getSingleResult(
            "SELECT p.*, c.name as category_name 
             FROM products p 
             LEFT JOIN categories c ON p.category_id = c.id 
             WHERE p.id = :id", 
            ['id' => $product_id]
        );
    }
    
    public static function getCategories() {
        return getAllResults("SELECT * FROM categories ORDER BY name");
    }
    
    public static function getProductCount($filters = []) {
        $sql = "SELECT COUNT(*) as count FROM products p WHERE 1=1";
        $params = [];
        
        if (!empty($filters['category_id'])) {
            $sql .= " AND p.category_id = :category_id";
            $params['category_id'] = $filters['category_id'];
        }
        
        if (!empty($filters['search'])) {
            $sql .= " AND (p.name LIKE :search OR p.description LIKE :search)";
            $params['search'] = "%{$filters['search']}%";
        }
        
        if (!empty($filters['min_price'])) {
            $sql .= " AND p.price >= :min_price";
            $params['min_price'] = $filters['min_price'];
        }
        
        if (!empty($filters['max_price'])) {
            $sql .= " AND p.price <= :max_price";
            $params['max_price'] = $filters['max_price'];
        }
        
        $result = getSingleResult($sql, $params);
        return $result['count'] ?? 0;
    }
    
    // Cart functions
    public static function addToCart($user_id, $product_id, $quantity = 1) {
        // Check if product exists and has stock
        $product = getSingleResult(
            "SELECT id, name, price, stock FROM products WHERE id = :id",
            ['id' => $product_id]
        );
        
        if (!$product) {
            return ['error' => 'Produk tidak ditemukan'];
        }
        
        if ($product['stock'] < $quantity) {
            return ['error' => 'Stok produk tidak mencukupi'];
        }
        
        // Check if item already in cart
        $existing_item = getSingleResult(
            "SELECT id, quantity FROM cart WHERE user_id = :user_id AND product_id = :product_id",
            ['user_id' => $user_id, 'product_id' => $product_id]
        );
        
        if ($existing_item) {
            // Update quantity
            $new_quantity = $existing_item['quantity'] + $quantity;
            updateRecord(
                'cart',
                ['quantity' => $new_quantity],
                'id = ' . $existing_item['id']
            );
        } else {
            // Add new item
            insertRecord('cart', [
                'user_id' => $user_id,
                'product_id' => $product_id,
                'quantity' => $quantity,
                'added_at' => date('Y-m-d H:i:s')
            ]);
        }
        
        return ['success' => true];
    }
    
    public static function getCart($user_id) {
        return getAllResults(
            "SELECT c.*, p.name, p.price, p.image, p.stock 
             FROM cart c 
             JOIN products p ON c.product_id = p.id 
             WHERE c.user_id = :user_id",
            ['user_id' => $user_id]
        );
    }
    
    public static function updateCartQuantity($cart_id, $quantity) {
        if ($quantity <= 0) {
            return self::removeFromCart($cart_id);
        }
        
        $result = updateRecord(
            'cart',
            ['quantity' => $quantity],
            'id = :id',
            ['id' => $cart_id]
        );
        
        return ['success' => $result > 0];
    }
    
    public static function removeFromCart($cart_id) {
        $result = deleteRecord('cart', 'id = :id', ['id' => $cart_id]);
        return ['success' => $result > 0];
    }
    
    // Order functions
    public static function createOrder($user_id, $order_data) {
        $database = new Database();
        $db = $database->getConnection();
        
        try {
            $db->beginTransaction();
            
            // Get cart items
            $cart_items = self::getCart($user_id);
            if (empty($cart_items)) {
                return ['error' => 'Keranjang belanja kosong'];
            }
            
            // Calculate total
            $total_amount = 0;
            foreach ($cart_items as $item) {
                $total_amount += $item['price'] * $item['quantity'];
                
                // Check stock
                if ($item['stock'] < $item['quantity']) {
                    throw new Exception("Stok {$item['name']} tidak mencukupi");
                }
            }
            
            // Apply discount if any
            if (!empty($order_data['discount_code'])) {
                $discount = self::applyDiscount($order_data['discount_code'], $total_amount);
                if ($discount['success']) {
                    $total_amount -= $discount['discount_amount'];
                }
            }
            
            // Add shipping cost
            $shipping_cost = $order_data['shipping_cost'] ?? 0;
            $total_amount += $shipping_cost;
            
            // Create order
            $order_id = insertRecord('orders', [
                'user_id' => $user_id,
                'total_amount' => $total_amount,
                'status' => 'pending',
                'shipping_address' => $order_data['shipping_address'],
                'payment_method' => $order_data['payment_method'],
                'notes' => $order_data['notes'] ?? '',
                'created_at' => date('Y-m-d H:i:s')
            ]);
            
            // Create order items and update stock
            foreach ($cart_items as $item) {
                insertRecord('order_items', [
                    'order_id' => $order_id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price']
                ]);
                
                // Update product stock
                updateRecord(
                    'products',
                    ['stock' => $item['stock'] - $item['quantity']],
                    'id = :id',
                    ['id' => $item['product_id']]
                );
            }
            
            // Clear cart
            deleteRecord('cart', 'user_id = :user_id', ['user_id' => $user_id]);
            
            $db->commit();
            
            return ['success' => true, 'order_id' => $order_id, 'total_amount' => $total_amount];
            
        } catch (Exception $e) {
            $db->rollBack();
            return ['error' => $e->getMessage()];
        }
    }
    
    public static function getOrders($user_id) {
        return getAllResults(
            "SELECT o.*, COUNT(oi.id) as item_count 
             FROM orders o 
             LEFT JOIN order_items oi ON o.id = oi.order_id 
             WHERE o.user_id = :user_id 
             GROUP BY o.id 
             ORDER BY o.created_at DESC",
            ['user_id' => $user_id]
        );
    }
    
    public static function getOrderDetails($order_id, $user_id = null) {
        $sql = "SELECT o.*, oi.*, p.name as product_name, p.image_url 
                FROM orders o 
                JOIN order_items oi ON o.id = oi.order_id 
                JOIN products p ON oi.product_id = p.id 
                WHERE o.id = :order_id";
        $params = ['order_id' => $order_id];
        
        if ($user_id) {
            $sql .= " AND o.user_id = :user_id";
            $params['user_id'] = $user_id;
        }
        
        return getAllResults($sql, $params);
    }
    
    // Discount functions
    public static function applyDiscount($code, $total_amount) {
        $discount = getSingleResult(
            "SELECT * FROM discounts WHERE code = :code AND start_date <= NOW() AND end_date >= NOW() AND is_active = 1",
            ['code' => $code]
        );
        
        if (!$discount) {
            return ['error' => 'Kode promo tidak valid atau sudah kadaluarsa'];
        }
        
        if ($total_amount < $discount['min_purchase']) {
            return ['error' => "Minimum pembelian " . formatPrice($discount['min_purchase'])];
        }
        
        $discount_amount = 0;
        if ($discount['type'] == 'percentage') {
            $discount_amount = $total_amount * ($discount['value'] / 100);
        } else {
            $discount_amount = $discount['value'];
        }
        
        // Cap discount if max_discount is set
        if ($discount['max_discount'] > 0 && $discount_amount > $discount['max_discount']) {
            $discount_amount = $discount['max_discount'];
        }
        
        return [
            'success' => true,
            'discount_amount' => $discount_amount,
            'discount_name' => $discount['name']
        ];
    }
    
    // Admin functions
    public static function getDashboardStats() {
        $stats = [];
        
        // Total users
        $stats['total_users'] = getSingleResult("SELECT COUNT(*) as count FROM users")['count'];
        
        // Total products
        $stats['total_products'] = getSingleResult("SELECT COUNT(*) as count FROM products")['count'];
        
        // Total orders
        $stats['total_orders'] = getSingleResult("SELECT COUNT(*) as count FROM orders")['count'];
        
        // Total revenue
        $stats['total_revenue'] = getSingleResult("SELECT SUM(total_amount) as total FROM orders WHERE status = 'completed'")['total'] ?? 0;
        
        // Recent orders
        $stats['recent_orders'] = getAllResults(
            "SELECT o.*, u.name as customer_name 
             FROM orders o 
             JOIN users u ON o.user_id = u.id 
             ORDER BY o.created_at DESC 
             LIMIT 5"
        );
        
        return $stats;
    }
}
?>