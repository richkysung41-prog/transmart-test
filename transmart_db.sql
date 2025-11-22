-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Waktu pembuatan: 22 Nov 2025 pada 02.51
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `transmart_db`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `banners`
--

CREATE TABLE `banners` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `subtitle` text DEFAULT NULL,
  `button_text` varchar(100) DEFAULT NULL,
  `button_url` varchar(255) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `background_color` varchar(20) DEFAULT '#ff6b6b',
  `is_active` tinyint(1) DEFAULT 1,
  `sort_order` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `banners`
--

INSERT INTO `banners` (`id`, `title`, `subtitle`, `button_text`, `button_url`, `image_url`, `background_color`, `is_active`, `sort_order`, `created_at`) VALUES
(1, 'Diskon Hingga 50%', 'Untuk semua produk makanan segar dan kebutuhan harian', 'Belanja Sekarang', '/pages/products/catalog.html', NULL, '#ff6b6b', 1, 1, '2025-11-22 01:10:57'),
(2, 'Gratis Ongkir', 'Untuk pembelian minimal Rp 100.000', 'Lihat Produk', '/pages/products/catalog.html', NULL, '#4ecdc4', 1, 2, '2025-11-22 01:10:57'),
(3, 'Produk Organik', 'Buah dan sayur segar langsung dari petani', 'Jelajahi', '/pages/products/catalog.html?category=1', NULL, '#45b7d1', 1, 3, '2025-11-22 01:10:57'),
(4, 'Diskon Hingga 50%', 'Untuk semua produk makanan segar dan kebutuhan harian', 'Belanja Sekarang', '/pages/products/catalog.html', NULL, '#ff6b6b', 1, 1, '2025-11-22 01:14:59'),
(5, 'Gratis Ongkir', 'Untuk pembelian minimal Rp 100.000', 'Lihat Produk', '/pages/products/catalog.html', NULL, '#4ecdc4', 1, 2, '2025-11-22 01:14:59'),
(6, 'Produk Organik', 'Buah dan sayur segar langsung dari petani', 'Jelajahi', '/pages/products/catalog.html?category=1', NULL, '#45b7d1', 1, 3, '2025-11-22 01:14:59');

-- --------------------------------------------------------

--
-- Struktur dari tabel `cart`
--

CREATE TABLE `cart` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `added_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `cart`
--

INSERT INTO `cart` (`id`, `user_id`, `product_id`, `quantity`, `added_at`) VALUES
(11, 1, 3, 2, '2025-11-19 01:17:47'),
(13, 38, 11, 10, '2025-11-20 03:47:37'),
(16, 40, 11, 1, '2025-11-20 05:34:54'),
(17, 40, 12, 1, '2025-11-20 05:34:55'),
(18, 39, 14, 1, '2025-11-21 18:08:18'),
(19, 39, 26, 1, '2025-11-21 18:13:48');

-- --------------------------------------------------------

--
-- Struktur dari tabel `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `categories`
--

INSERT INTO `categories` (`id`, `name`, `description`, `created_at`) VALUES
(1, 'Buah & Sayur', 'Buah dan sayuran segar berkualitas tinggi', '2025-11-18 05:02:14'),
(2, 'Makanan', 'Makanan siap saji dan bahan makanan', '2025-11-18 05:02:14'),
(3, 'Minuman', 'Minuman berbagai jenis dan brand', '2025-11-18 05:02:14'),
(4, 'Rumah Tangga', 'Kebutuhan rumah tangga sehari-hari', '2025-11-18 05:02:14'),
(5, 'Elektronik', 'Peralatan elektronik dan gadget', '2025-11-18 05:02:14'),
(6, 'Kesehatan', 'Produk kesehatan dan vitamin', '2025-11-18 05:02:14'),
(8, 'Kategori Test Updated', 'Deskripsi updated', '2025-11-19 03:37:55');

-- --------------------------------------------------------

--
-- Struktur dari tabel `discounts`
--

CREATE TABLE `discounts` (
  `id` int(11) NOT NULL,
  `code` varchar(50) NOT NULL,
  `discount_percent` int(11) NOT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `min_purchase` decimal(12,2) DEFAULT 0.00,
  `max_uses` int(11) DEFAULT NULL,
  `uses_count` int(11) DEFAULT 0,
  `valid_until` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `discounts`
--

INSERT INTO `discounts` (`id`, `code`, `discount_percent`, `status`, `min_purchase`, `max_uses`, `uses_count`, `valid_until`, `created_at`) VALUES
(1, 'WELCOME10', 10, 'active', 500000.00, NULL, 0, '2024-12-31 16:59:59', '2025-11-18 05:02:14'),
(2, 'GRATISONGKIR', 0, 'active', 1000000.00, NULL, 0, '2024-12-31 16:59:59', '2025-11-18 05:02:14');

-- --------------------------------------------------------

--
-- Struktur dari tabel `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `order_number` varchar(50) NOT NULL,
  `total_price` decimal(12,2) NOT NULL,
  `status` enum('pending','processing','shipped','delivered','cancelled') DEFAULT 'pending',
  `shipping_address` text NOT NULL,
  `payment_method` varchar(50) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `order_number`, `total_price`, `status`, `shipping_address`, `payment_method`, `notes`, `created_at`, `updated_at`) VALUES
(1, 2, 'ORD202411180001', 1599000.00, 'delivered', 'Jl. Budi No. 123, Jakarta', 'credit_card', NULL, '2025-11-18 05:02:14', '2025-11-18 05:02:14'),
(2, 3, 'ORD202411180002', 2299000.00, 'processing', 'Jl. Siti No. 456, Bandung', 'transfer_bank', NULL, '2025-11-18 05:02:14', '2025-11-18 05:02:14');

-- --------------------------------------------------------

--
-- Struktur dari tabel `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(12,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `price`) VALUES
(1, 1, 4, 2, 679000.00),
(2, 1, 1, 1, 899000.00),
(3, 2, 2, 1, 2499000.00),
(4, 1, 4, 2, 679000.00),
(5, 1, 1, 1, 899000.00),
(6, 2, 2, 1, 2499000.00),
(7, 1, 4, 2, 679000.00),
(8, 1, 1, 1, 899000.00),
(9, 2, 2, 1, 2499000.00),
(10, 1, 4, 2, 679000.00),
(11, 1, 1, 1, 899000.00),
(12, 2, 2, 1, 2499000.00);

-- --------------------------------------------------------

--
-- Struktur dari tabel `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(12,2) NOT NULL,
  `stock` int(11) DEFAULT 0,
  `image` varchar(255) DEFAULT NULL,
  `rating` decimal(3,2) DEFAULT 0.00,
  `total_sold` int(11) DEFAULT 0,
  `discount` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `products`
--

INSERT INTO `products` (`id`, `category_id`, `name`, `description`, `price`, `stock`, `image`, `rating`, `total_sold`, `discount`, `created_at`) VALUES
(1, 5, 'Wireless Headphone Premium', 'Headphone nirkabel berkualitas tinggi dengan noise cancellation', 899000.00, 15, 'headphone.jpg', 4.90, 234, 25, '2025-11-18 05:02:14'),
(2, 5, 'Smart Watch Series 8', 'Jam tangan pintar dengan fitur kesehatan lengkap', 2499000.00, 8, 'smartwatch.jpg', 4.70, 189, 0, '2025-11-18 05:02:14'),
(3, 5, 'Kacamata Hitam Fashion', 'Kacamata dengan desain trendy dan perlindungan UV', 349000.00, 22, 'sunglasses.jpg', 4.20, 156, 0, '2025-11-18 05:02:14'),
(4, 5, 'Sepatu Sneakers Sport', 'Sepatu olahraga nyaman untuk aktivitas sehari-hari', 679000.00, 18, 'sneakers.jpg', 5.00, 412, 15, '2025-11-18 05:02:14'),
(5, 5, 'Tas Ransel Travel Premium', 'Tas ransel multifungsi dengan kapasitas besar', 549000.00, 12, 'backpack.jpg', 4.60, 298, 0, '2025-11-18 05:02:14'),
(6, 5, 'Kamera Digital Mirrorless', 'Kamera profesional untuk fotografi berkualitas tinggi', 8999000.00, 5, 'camera.jpg', 4.80, 167, 30, '2025-11-18 05:02:14'),
(7, 5, 'Laptop Gaming Pro 15\"', 'Laptop gaming dengan performa tinggi dan GPU terkuat', 15999000.00, 3, 'laptop.jpg', 4.70, 89, 0, '2025-11-18 05:02:14'),
(8, 5, 'Parfum Luxury Edition', 'Parfum premium dengan aroma tahan lama', 1299000.00, 20, 'perfume.jpg', 4.90, 345, 0, '2025-11-18 05:02:14'),
(9, 5, 'Bluetooth Speaker Portable', 'Speaker portabel dengan kualitas suara premium', 399000.00, 25, 'speaker.jpg', 4.30, 278, 20, '2025-11-18 05:02:14'),
(10, 1, 'Apel Fuji Segar', 'Apel fuji berkualitas import dengan rasa manis', 45000.00, 100, 'apel.jpg', 4.50, 412, 0, '2025-11-18 05:02:14'),
(11, 5, 'Wireless Headphone Premium', 'Headphone nirkabel berkualitas tinggi dengan noise cancellation', 899000.00, 15, 'headphone.jpg', 4.90, 234, 25, '2025-11-18 06:24:12'),
(12, 5, 'Smart Watch Series 8', 'Jam tangan pintar dengan fitur kesehatan lengkap', 2499000.00, 8, 'smartwatch.jpg', 4.70, 189, 0, '2025-11-18 06:24:12'),
(13, 5, 'Kacamata Hitam Fashion', 'Kacamata dengan desain trendy dan perlindungan UV', 349000.00, 22, 'sunglasses.jpg', 4.20, 156, 0, '2025-11-18 06:24:12'),
(14, 5, 'Sepatu Sneakers Sport', 'Sepatu olahraga nyaman untuk aktivitas sehari-hari', 679000.00, 18, 'sneakers.jpg', 5.00, 412, 15, '2025-11-18 06:24:12'),
(15, 5, 'Tas Ransel Travel Premium', 'Tas ransel multifungsi dengan kapasitas besar', 549000.00, 12, 'backpack.jpg', 4.60, 298, 0, '2025-11-18 06:24:12'),
(16, 5, 'Kamera Digital Mirrorless', 'Kamera profesional untuk fotografi berkualitas tinggi', 8999000.00, 5, 'camera.jpg', 4.80, 167, 30, '2025-11-18 06:24:12'),
(17, 5, 'Laptop Gaming Pro 15\"', 'Laptop gaming dengan performa tinggi dan GPU terkuat', 15999000.00, 3, 'laptop.jpg', 4.70, 89, 0, '2025-11-18 06:24:12'),
(18, 5, 'Parfum Luxury Edition', 'Parfum premium dengan aroma tahan lama', 1299000.00, 20, 'perfume.jpg', 4.90, 345, 0, '2025-11-18 06:24:12'),
(19, 5, 'Bluetooth Speaker Portable', 'Speaker portabel dengan kualitas suara premium', 399000.00, 25, 'speaker.jpg', 4.30, 278, 20, '2025-11-18 06:24:12'),
(20, 1, 'Apel Fuji Segar', 'Apel fuji berkualitas import dengan rasa manis', 45000.00, 100, 'apel.jpg', 4.50, 412, 0, '2025-11-18 06:24:12'),
(22, 5, 'Wireless Headphone Premium', 'Headphone nirkabel berkualitas tinggi dengan noise cancellation', 899000.00, 15, 'headphone.jpg', 4.90, 234, 25, '2025-11-22 01:10:57'),
(23, 5, 'Smart Watch Series 8', 'Jam tangan pintar dengan fitur kesehatan lengkap', 2499000.00, 8, 'smartwatch.jpg', 4.70, 189, 0, '2025-11-22 01:10:57'),
(24, 5, 'Kacamata Hitam Fashion', 'Kacamata dengan desain trendy dan perlindungan UV', 349000.00, 22, 'sunglasses.jpg', 4.20, 156, 0, '2025-11-22 01:10:57'),
(25, 5, 'Sepatu Sneakers Sport', 'Sepatu olahraga nyaman untuk aktivitas sehari-hari', 679000.00, 18, 'sneakers.jpg', 5.00, 412, 15, '2025-11-22 01:10:57'),
(26, 5, 'Tas Ransel Travel Premium', 'Tas ransel multifungsi dengan kapasitas besar', 549000.00, 12, 'backpack.jpg', 4.60, 298, 0, '2025-11-22 01:10:57'),
(27, 5, 'Kamera Digital Mirrorless', 'Kamera profesional untuk fotografi berkualitas tinggi', 8999000.00, 5, 'camera.jpg', 4.80, 167, 30, '2025-11-22 01:10:57'),
(28, 5, 'Laptop Gaming Pro 15\"', 'Laptop gaming dengan performa tinggi dan GPU terkuat', 15999000.00, 3, 'laptop.jpg', 4.70, 89, 0, '2025-11-22 01:10:57'),
(29, 5, 'Parfum Luxury Edition', 'Parfum premium dengan aroma tahan lama', 1299000.00, 20, 'perfume.jpg', 4.90, 345, 0, '2025-11-22 01:10:57'),
(30, 5, 'Bluetooth Speaker Portable', 'Speaker portabel dengan kualitas suara premium', 399000.00, 25, 'speaker.jpg', 4.30, 278, 20, '2025-11-22 01:10:57'),
(31, 1, 'Apel Fuji Segar', 'Apel fuji berkualitas import dengan rasa manis', 45000.00, 100, 'apel.jpg', 4.50, 412, 0, '2025-11-22 01:10:57'),
(32, 5, 'Wireless Headphone Premium', 'Headphone nirkabel berkualitas tinggi dengan noise cancellation', 899000.00, 15, 'headphone.jpg', 4.90, 234, 25, '2025-11-22 01:14:59'),
(33, 5, 'Smart Watch Series 8', 'Jam tangan pintar dengan fitur kesehatan lengkap', 2499000.00, 8, 'smartwatch.jpg', 4.70, 189, 0, '2025-11-22 01:14:59'),
(34, 5, 'Kacamata Hitam Fashion', 'Kacamata dengan desain trendy dan perlindungan UV', 349000.00, 22, 'sunglasses.jpg', 4.20, 156, 0, '2025-11-22 01:14:59'),
(35, 5, 'Sepatu Sneakers Sport', 'Sepatu olahraga nyaman untuk aktivitas sehari-hari', 679000.00, 18, 'sneakers.jpg', 5.00, 412, 15, '2025-11-22 01:14:59'),
(36, 5, 'Tas Ransel Travel Premium', 'Tas ransel multifungsi dengan kapasitas besar', 549000.00, 12, 'backpack.jpg', 4.60, 298, 0, '2025-11-22 01:14:59'),
(37, 5, 'Kamera Digital Mirrorless', 'Kamera profesional untuk fotografi berkualitas tinggi', 8999000.00, 5, 'camera.jpg', 4.80, 167, 30, '2025-11-22 01:14:59'),
(38, 5, 'Laptop Gaming Pro 15\"', 'Laptop gaming dengan performa tinggi dan GPU terkuat', 15999000.00, 3, 'laptop.jpg', 4.70, 89, 0, '2025-11-22 01:14:59'),
(39, 5, 'Parfum Luxury Edition', 'Parfum premium dengan aroma tahan lama', 1299000.00, 20, 'perfume.jpg', 4.90, 345, 0, '2025-11-22 01:14:59'),
(40, 5, 'Bluetooth Speaker Portable', 'Speaker portabel dengan kualitas suara premium', 399000.00, 25, 'speaker.jpg', 4.30, 278, 20, '2025-11-22 01:14:59'),
(41, 1, 'Apel Fuji Segar', 'Apel fuji berkualitas import dengan rasa manis', 45000.00, 100, 'apel.jpg', 4.50, 412, 0, '2025-11-22 01:14:59');

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `address` text DEFAULT NULL,
  `role` enum('customer','admin','seller') DEFAULT 'customer',
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `last_login` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `phone`, `address`, `role`, `status`, `created_at`, `last_login`) VALUES
(1, 'Admin Transmart', 'admin@transmart.com', '$2y$10$crDgax7jgAZAvdZTvg05SO9HEmxqf7pC7Kdj9EhX6uMBWoOtP8tHK', '081234567890', 'Jl. Admin No. 1', 'admin', 'active', '2025-11-18 05:02:14', NULL),
(2, 'Budi Santoso', 'budi@example.com', '$2y$10$P9pKTUpvLh.YdOJnV5eR1utcZvHwiPTwyZkH24caPNFrli3DF9pzG', '082345678901', 'Jl. Budi No. 123', 'customer', 'active', '2025-11-18 05:02:14', NULL),
(3, 'Siti Nurhaliza', 'siti@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '083456789012', 'Jl. Siti No. 456', 'customer', 'active', '2025-11-18 05:02:14', NULL),
(4, 'Joko Widodo', 'joko@example.com', '$2y$10$4AXbDYaBmr97WI0K1bkoAuyrcdBYWUTAdwrnEUN7HO/qu1V/qTeTa', '089876543210', '', 'customer', 'active', '2025-11-17 22:04:02', NULL),
(5, 'Ahmad Prayitno', 'ahmad@example.com', '$2y$10$IEf4lkhj/IUsA/vdY2U6w.wThMsmgaf00D68KlVKHgSA6t2C9l5E6', '085123456789', '', 'customer', 'active', '2025-11-17 22:04:21', NULL),
(6, 'Suharto Merdeka', 'suharto@example.com', '$2y$10$lRZoC9IwqVM1ElQ6TkkFEesysFpKZnbNTL73XF5CpADo8gGiig87q', '082987654321', '', 'customer', 'active', '2025-11-17 22:04:32', NULL),
(7, 'Test User', 'testuser@example.com', '$2y$10$oTdCSTnjLaYB2HBVnIdOhOeQ1Vah.KEgG2jiZN3TShrow0lCzCzKC', '081234567890', '', 'customer', 'active', '2025-11-17 22:11:55', NULL),
(8, 'Bambang Kardo Test', 'bambang2025@example.com', '$2y$10$OFGVrhpt75o1zyT5y7HwHuZi/GfVRlD1Ae.MbDWzANaAfclihspbi', '0812345679', '', 'customer', 'active', '2025-11-17 22:12:23', NULL),
(9, 'Cucu Lestari', 'cucu2025@example.com', '$2y$10$FhY1A8iSRb1KfpBjqICb4.w2Ir7UNTt4FC.TAbMQvcq/Tjw8zuU.y', '0813333333', '', 'customer', 'active', '2025-11-17 22:12:31', NULL),
(10, 'Dedi Santoso', 'dedi2025@example.com', '$2y$10$o8xxNOzfAjiE2i.mVSqf4efwe61.eGy9TVjF6C.l80.49TOjbVjG2', '0814444444', '', 'customer', 'active', '2025-11-17 22:12:43', NULL),
(11, 'Endra Wijaya', 'endra2025@example.com', '$2y$10$/YKDUkxQXjwtZeeOUmmW2.Kp4zy3g8V4QA1cG5gFDV3D3bxRePOgq', '0815555555', '', 'customer', 'active', '2025-11-17 22:12:51', NULL),
(12, 'Farah Adela', 'farah2025@example.com', '$2y$10$zymUMe5irADeVD5N9mE3kezEqvvgJF2Ee5WwQ7rzopv2v2/x9q7dW', '0816666666', '', 'customer', 'active', '2025-11-17 22:12:59', NULL),
(13, 'Test Curl', 'testcurl2025@example.com', '$2y$10$HAVOXSjT7hcHlb1N93LVb.lciz5grkVfNMBLZyh/xNUDPv1SBZlXG', '0817777777', '', 'customer', 'active', '2025-11-17 22:15:12', NULL),
(14, 'Browser Test', 'browsertest@example.com', '$2y$10$a94tDPVS9CqB0xg1AyzQducs2gMc46dPlshIjm3GTzvU9NhpVyNAK', '0818888888', '', 'customer', 'active', '2025-11-17 22:15:35', NULL),
(15, 'Test User', 'testform@example.com', '$2y$10$xuZ35e1cLdV8fnCLfk4fHeLIstGNzK7CreyO9i4lTXurjAKVm19/G', '081234567890', '', 'customer', 'active', '2025-11-17 22:16:11', NULL),
(16, 'Log Test', 'logtest@example.com', '$2y$10$w5.CJowObOCiFRw99z4NKOaEdLLfngMLEe2SzgRRyC/MPlk3xd0mu', '0819999999', '', 'customer', 'active', '2025-11-17 22:16:46', NULL),
(17, 'Direct Test', 'directtest@example.com', '$2y$10$UncmufKxEhX7Y1cfcdv8..avJxPZECeDrCoBxNG34Vd5dVEMHpwbi', '0820000000', '', 'customer', 'active', '2025-11-17 22:17:23', NULL),
(18, 'Cutest Test', 'cutesttest@example.com', '$2y$10$.L5cMCPQlqcLCdcX5b.ftOpwhg9dshgL3hmvZTaMJcfq4L2Ubfrb6', '0821111111', '', 'customer', 'active', '2025-11-17 22:20:22', NULL),
(19, 'Pure Test', 'puretest@example.com', '$2y$10$z1XxRLtQMDrxrhbEUtOtDu7aB3YWtMjPEiijWZORn46jOhocmi3Wa', '0822222222', '', 'customer', 'active', '2025-11-17 22:20:37', NULL),
(20, 'Final Test', 'finaltest@example.com', '$2y$10$tTyIYo0L4E6Nh0Zrw.m2iO3VUtCK6ZNJYJDlYXrWoPklCM9hVZSgi', '0823333333', '', 'customer', 'active', '2025-11-17 22:21:19', NULL),
(21, 'Browser Register Test', 'browserregtest@example.com', '$2y$10$OpsP4UkMbG4GDM0SSEfCEu0cUzH0qrvXWvpIGJR.0QtE165b4VuiG', '0824444444', '', 'customer', 'active', '2025-11-17 22:21:37', NULL),
(22, 'Jq Test', 'jqtest@example.com', '$2y$10$qJ4GnzU17.LkEkKp8FPQD.WcOu5wZjz5iKiIf3R8eMYNIP6l2Ic/e', '0825555555', '', 'customer', 'active', '2025-11-17 22:21:44', NULL),
(23, 'Hex Test', 'hextest@example.com', '$2y$10$KPRZSA0vwtOWu4GitZA6lOuALBWbo8TIM48MZHMdjxBJEJd/RjMVa', '0826666666', '', 'customer', 'active', '2025-11-17 22:22:02', NULL),
(24, 'Response Test', 'resptest@example.com', '$2y$10$/2vxnB3pcUQqRZSO/ec35e7YQJNmo8nBW.W/GyoI9QLkjWeyFv8/i', '0827777777', '', 'customer', 'active', '2025-11-17 22:22:28', NULL),
(25, 'Simple', 'simple@example.com', '$2y$10$.BbGG2ITiKqPpmtPldCBwumhmqo.3uFGfk9XG9QVbJsrvoklTiYHa', '0828888888', '', 'customer', 'active', '2025-11-17 22:22:34', NULL),
(26, 'ErrorLog', 'err@err.com', '$2y$10$ASI71txxbx/vp4LLkV4/eOuhbBk3EBHAk1FhD/GXqOA4t0w734Gv2', '081234567890', '', 'customer', 'active', '2025-11-17 22:23:39', NULL),
(27, 'RawCheck', 'raw@raw.com', '$2y$10$avmmJoECpX7tKihcbKbJpeCa5L3/FSwlQg6etwvLjs/LCovH1XfHu', '081234567890', '', 'customer', 'active', '2025-11-17 22:23:47', NULL),
(28, 'PyTest', 'py@py.com', '$2y$10$Ymht168gHdP4sLLWGOxXMeOI0oUWm3fQzLqJZXkCxKMQLsGJa6c1i', '081234567890', '', 'customer', 'active', '2025-11-17 22:24:06', NULL),
(29, 'Verification Test User', 'veriftest@example.com', '$2y$10$Q3VMhcYDxe2iGllQLrJKbeGswcppt/h/t9SiHew/hZIjJDjwN.6ua', '082999999999', '', 'customer', 'active', '2025-11-17 22:24:45', NULL),
(30, 'Test Verify', 'testverify@example.com', '$2y$10$468i8YqEEu2ynQYXfauN3e6vm8pbTZXOY2Xx0g55a0hJBjkZhJ64.', '082123456789', '', 'customer', 'active', '2025-11-17 22:24:54', NULL),
(31, 'FinalVerify', 'final@test.com', '$2y$10$rjQo8pnS3JZ1VjqoV18wwesMAO.RN0ETvszE7.bJRHUvZdwppZgAa', '082987654321', '', 'customer', 'active', '2025-11-17 22:25:01', NULL),
(37, 'Rizki Pratama', 'rizki@example.com', '$2y$10$bm379SeGxPV8Qx8Cm7E3j.Cbwqm.goW8i.6brqK6.Ped/dTRwA8zm', '08123456789', '', 'customer', 'active', '2025-11-17 23:28:41', NULL),
(38, 'Richky Sung', 'richky@gmail.com', '$2y$10$ZCG.Y6BRYEX2ZdGGRa5gUeu.rUizYxv9fD4vz1BwiR8zrg6FhF6K.', '0895395031834', '', 'customer', 'active', '2025-11-17 23:28:58', NULL),
(39, 'Richky Sung', 'richky61@gmail.com', '$2y$10$XRnqx.FTQIAOd.tKokZUqOb6VHLGG6bYKbM9qJKGQLKjaUoXRVRWK', '0895395031834', '', 'customer', 'active', '2025-11-20 05:29:32', NULL),
(40, 'livia sung', 'lliviasung@gmail.com', '$2y$10$pT5xHhQBwfWIdwNPb.SE8OXnip/FJAgwVpZDJF1TTBqMbMjJcfex6', '089689300875', '', 'customer', 'active', '2025-11-20 05:34:01', NULL);

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `banners`
--
ALTER TABLE `banners`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_active` (`is_active`),
  ADD KEY `idx_sort` (`sort_order`);

--
-- Indeks untuk tabel `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_cart_item` (`user_id`,`product_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `idx_user` (`user_id`);

--
-- Indeks untuk tabel `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD KEY `idx_name` (`name`);

--
-- Indeks untuk tabel `discounts`
--
ALTER TABLE `discounts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`),
  ADD KEY `idx_code` (`code`),
  ADD KEY `idx_status` (`status`);

--
-- Indeks untuk tabel `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `order_number` (`order_number`),
  ADD KEY `idx_user` (`user_id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_date` (`created_at`);

--
-- Indeks untuk tabel `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `idx_order` (`order_id`);

--
-- Indeks untuk tabel `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_category` (`category_id`),
  ADD KEY `idx_name` (`name`),
  ADD KEY `idx_price` (`price`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_role` (`role`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `banners`
--
ALTER TABLE `banners`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT untuk tabel `cart`
--
ALTER TABLE `cart`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT untuk tabel `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT untuk tabel `discounts`
--
ALTER TABLE `discounts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT untuk tabel `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT untuk tabel `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT untuk tabel `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Ketidakleluasaan untuk tabel `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Ketidakleluasaan untuk tabel `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Ketidakleluasaan untuk tabel `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
