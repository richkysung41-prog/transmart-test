-- Transmart Database Schema
-- Created: 2024

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    address TEXT,
    role ENUM('customer', 'admin', 'seller') DEFAULT 'customer',
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(12, 2) NOT NULL,
    stock INT DEFAULT 0,
    image VARCHAR(255),
    rating DECIMAL(3, 2) DEFAULT 0,
    total_sold INT DEFAULT 0,
    discount INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    INDEX idx_category (category_id),
    INDEX idx_name (name),
    INDEX idx_price (price)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Cart table
CREATE TABLE IF NOT EXISTS cart (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id),
    UNIQUE KEY unique_cart_item (user_id, product_id),
    INDEX idx_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    total_price DECIMAL(12, 2) NOT NULL,
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    shipping_address TEXT NOT NULL,
    payment_method VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_user (user_id),
    INDEX idx_status (status),
    INDEX idx_date (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Order Items table
CREATE TABLE IF NOT EXISTS order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(12, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id),
    INDEX idx_order (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Banners table
CREATE TABLE IF NOT EXISTS banners (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    subtitle TEXT,
    button_text VARCHAR(100),
    button_url VARCHAR(255),
    image_url VARCHAR(255),
    background_color VARCHAR(20) DEFAULT '#ff6b6b',
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_active (is_active),
    INDEX idx_sort (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Discounts table
CREATE TABLE IF NOT EXISTS discounts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_percent INT NOT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',
    min_purchase DECIMAL(12, 2) DEFAULT 0,
    max_uses INT DEFAULT NULL,
    uses_count INT DEFAULT 0,
    valid_until TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_code (code),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============= SAMPLE DATA =============

-- Insert demo users
INSERT INTO users (name, email, password, phone, address, role) VALUES
('Admin Transmart', 'admin@transmart.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '081234567890', 'Jl. Admin No. 1', 'admin'),
('Budi Santoso', 'budi@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '082345678901', 'Jl. Budi No. 123', 'customer'),
('Siti Nurhaliza', 'siti@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '083456789012', 'Jl. Siti No. 456', 'customer');

-- Insert categories
INSERT INTO categories (name, description) VALUES
('Buah & Sayur', 'Buah dan sayuran segar berkualitas tinggi'),
('Makanan', 'Makanan siap saji dan bahan makanan'),
('Minuman', 'Minuman berbagai jenis dan brand'),
('Rumah Tangga', 'Kebutuhan rumah tangga sehari-hari'),
('Elektronik', 'Peralatan elektronik dan gadget'),
('Kesehatan', 'Produk kesehatan dan vitamin');

-- Insert products
INSERT INTO products (category_id, name, description, price, stock, image, rating, total_sold, discount) VALUES
(5, 'Wireless Headphone Premium', 'Headphone nirkabel berkualitas tinggi dengan noise cancellation', 899000, 15, 'headphone.jpg', 4.9, 234, 25),
(5, 'Smart Watch Series 8', 'Jam tangan pintar dengan fitur kesehatan lengkap', 2499000, 8, 'smartwatch.jpg', 4.7, 189, 0),
(5, 'Kacamata Hitam Fashion', 'Kacamata dengan desain trendy dan perlindungan UV', 349000, 22, 'sunglasses.jpg', 4.2, 156, 0),
(5, 'Sepatu Sneakers Sport', 'Sepatu olahraga nyaman untuk aktivitas sehari-hari', 679000, 18, 'sneakers.jpg', 5.0, 412, 15),
(5, 'Tas Ransel Travel Premium', 'Tas ransel multifungsi dengan kapasitas besar', 549000, 12, 'backpack.jpg', 4.6, 298, 0),
(5, 'Kamera Digital Mirrorless', 'Kamera profesional untuk fotografi berkualitas tinggi', 8999000, 5, 'camera.jpg', 4.8, 167, 30),
(5, 'Laptop Gaming Pro 15"', 'Laptop gaming dengan performa tinggi dan GPU terkuat', 15999000, 3, 'laptop.jpg', 4.7, 89, 0),
(5, 'Parfum Luxury Edition', 'Parfum premium dengan aroma tahan lama', 1299000, 20, 'perfume.jpg', 4.9, 345, 0),
(5, 'Bluetooth Speaker Portable', 'Speaker portabel dengan kualitas suara premium', 399000, 25, 'speaker.jpg', 4.3, 278, 20),
(1, 'Apel Fuji Segar', 'Apel fuji berkualitas import dengan rasa manis', 45000, 100, 'apel.jpg', 4.5, 412, 0);

-- Insert sample orders (optional)
INSERT INTO orders (user_id, order_number, total_price, status, shipping_address, payment_method) VALUES
(2, 'ORD202411180001', 1599000, 'delivered', 'Jl. Budi No. 123, Jakarta', 'credit_card'),
(3, 'ORD202411180002', 2299000, 'processing', 'Jl. Siti No. 456, Bandung', 'transfer_bank');

-- Insert sample order items
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
(1, 4, 2, 679000),
(1, 1, 1, 899000),
(2, 2, 1, 2499000);

-- Insert sample banners
INSERT INTO banners (title, subtitle, button_text, button_url, image_url, background_color, sort_order) VALUES
('Diskon Hingga 50%', 'Untuk semua produk makanan segar dan kebutuhan harian', 'Belanja Sekarang', '/pages/products/catalog.html', NULL, '#ff6b6b', 1),
('Gratis Ongkir', 'Untuk pembelian minimal Rp 100.000', 'Lihat Produk', '/pages/products/catalog.html', NULL, '#4ecdc4', 2),
('Produk Organik', 'Buah dan sayur segar langsung dari petani', 'Jelajahi', '/pages/products/catalog.html?category=1', NULL, '#45b7d1', 3);

-- Insert sample discounts
INSERT INTO discounts (code, discount_percent, status, min_purchase, valid_until) VALUES
('WELCOME10', 10, 'active', 500000, '2024-12-31 23:59:59'),
('GRATISONGKIR', 0, 'active', 1000000, '2024-12-31 23:59:59');
