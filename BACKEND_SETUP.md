# Backend Setup Guide - Transmart E-Commerce

## 📋 Daftar Isi
1. [Prasyarat](#prasyarat)
2. [Installation](#installation)
3. [Konfigurasi Database](#konfigurasi-database)
4. [Struktur Backend](#struktur-backend)
5. [API Endpoints](#api-endpoints)
6. [Testing](#testing)

---

## Prasyarat

- **PHP 7.4+** (Rekomendasi 8.0+)
- **MySQL 5.7+** atau **MariaDB 10.3+**
- **Apache** dengan mod_rewrite aktif
- **Composer** (opsional, untuk package management)
- **Postman** atau **cURL** untuk testing API

### Periksa Versi PHP
```bash
php -v
```

### Periksa MySQL
```bash
mysql -u root -p
# Ketik password, jika ada
```

---

## Installation

### 1. Setup Database

#### Menggunakan MySQL Command Line:
```bash
mysql -u root -p < database.sql
```

#### Atau Manual:
```bash
mysql -u root -p
mysql> CREATE DATABASE transmart_db;
mysql> USE transmart_db;
mysql> source database.sql;
mysql> exit
```

### 2. Konfigurasi Koneksi Database

Edit file `config/database.php`:

```php
private $host = "127.0.0.1";    // Host MySQL
private $port = 3306;            // Port MySQL
private $db_name = "transmart_db"; // Nama database
private $username = "root";      // Username MySQL
private $password = "";          // Password MySQL (kosong jika tidak ada)
```

### 3. Konfigurasi Environment

Edit file `config/config.php`:

```php
// Site URL (sesuaikan dengan environment Anda)
define('SITE_URL', 'http://localhost/transmart-project');

// Email SMTP (opsional)
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);

// Security Keys
define('ENCRYPTION_KEY', 'your-secret-key-here');
define('JWT_SECRET', 'your-jwt-secret-here');
```

### 4. Jalankan Aplikasi

#### Menggunakan PHP Built-in Server:
```bash
cd /home/dobot/dobot-project/transmart-test
php -S localhost:8000
```

Buka browser: `http://localhost:8000`

#### Atau Menggunakan Apache:
Pastikan folder proyek berada di `/var/www/html/transmart-project` atau sesuaikan VirtualHost.

---

## Konfigurasi Database

### Sample Data yang Sudah Tersedia:

**Admin Account:**
- Email: `admin@transmart.com`
- Password: `admin123` (hashed)

**Customer Accounts:**
- Email: `budi@example.com`
- Email: `siti@example.com`
- Password: `password123` (hashed)

### Tabel Utama:

1. **users** - Menyimpan data pengguna
2. **categories** - Kategori produk
3. **products** - Data produk
4. **cart** - Keranjang belanja
5. **orders** - Pesanan pelanggan
6. **order_items** - Item dalam pesanan
7. **banners** - Banner homepage
8. **discounts** - Kode diskon

---

## Struktur Backend

```
api/
├── api_helper.php           # Helper functions & response handler
├── auth.php                 # Authentication (Login, Register, Logout)
├── cart.php                 # Shopping cart operations
├── categories.php           # Category management
├── homepage.php             # Homepage data (banners, featured products)
├── orders.php               # Order management
├── products.php             # Product listing & filtering
├── users.php                # User profile management
└── admin/
    └── dashboard.php        # Admin dashboard data

config/
├── config.php              # Global configuration
├── database.php            # Database connection class
└── functions.php           # Business logic (TransmartFunctions class)

assets/
└── uploads/               # Folder untuk upload file (create if not exists)
```

---

## API Endpoints

### 1. Authentication

#### Register
```
POST /api/auth.php?action=register
Content-Type: application/json

{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "081234567890"
}

Response (201):
{
    "success": true,
    "message": "Pendaftaran berhasil. Silakan login."
}
```

#### Login
```
POST /api/auth.php?action=login
Content-Type: application/json

{
    "email": "budi@example.com",
    "password": "password123"
}

Response (200):
{
    "success": true,
    "user": {
        "id": 2,
        "name": "Budi Santoso",
        "email": "budi@example.com",
        "phone": "082345678901",
        "role": "customer"
    },
    "message": "Login berhasil"
}
```

#### Logout
```
POST /api/auth.php?action=logout
Response:
{
    "success": true,
    "message": "Logout successful"
}
```

### 2. Products

#### Get All Products
```
GET /api/products.php?action=get_all&limit=12&page=1

Response:
{
    "success": true,
    "data": [
        {
            "id": 1,
            "name": "Wireless Headphone Premium",
            "price": 899000,
            "discount": 25,
            "rating": 4.9,
            "image": "headphone.jpg",
            "category_name": "Elektronik"
        },
        ...
    ],
    "total": 45,
    "page": 1,
    "limit": 12
}
```

#### Get Product by Category
```
GET /api/products.php?action=by_category&category_id=5&limit=12

Response: (sama seperti get_all)
```

#### Search Products
```
GET /api/products.php?action=search&keyword=headphone

Response: (sama seperti get_all)
```

#### Get Product Detail
```
GET /api/products.php?action=detail&id=1

Response:
{
    "success": true,
    "data": {
        "id": 1,
        "name": "Wireless Headphone Premium",
        "description": "Headphone nirkabel berkualitas tinggi...",
        "price": 899000,
        "discount": 25,
        "stock": 15,
        "rating": 4.9,
        "total_sold": 234,
        "image": "headphone.jpg",
        "category_id": 5,
        "category_name": "Elektronik"
    }
}
```

### 3. Categories

#### Get All Categories
```
GET /api/categories.php?action=get_all

Response:
{
    "success": true,
    "data": [
        {
            "id": 1,
            "name": "Buah & Sayur",
            "description": "Buah dan sayuran segar..."
        },
        ...
    ]
}
```

### 4. Cart

#### Add to Cart
```
POST /api/cart.php?action=add
Content-Type: application/json

{
    "user_id": 2,
    "product_id": 1,
    "quantity": 2
}

Response:
{
    "success": true,
    "message": "Produk ditambahkan ke keranjang"
}
```

#### Get Cart
```
GET /api/cart.php?action=get&user_id=2

Response:
{
    "success": true,
    "data": [
        {
            "id": 1,
            "product_id": 1,
            "name": "Wireless Headphone Premium",
            "price": 899000,
            "quantity": 2,
            "subtotal": 1798000
        },
        ...
    ],
    "total": 1798000
}
```

#### Update Cart Item Quantity
```
POST /api/cart.php?action=update
Content-Type: application/json

{
    "cart_id": 1,
    "quantity": 3
}

Response:
{
    "success": true,
    "message": "Keranjang diperbarui"
}
```

#### Remove from Cart
```
POST /api/cart.php?action=remove
Content-Type: application/json

{
    "cart_id": 1
}

Response:
{
    "success": true,
    "message": "Item dihapus dari keranjang"
}
```

### 5. Orders

#### Create Order
```
POST /api/orders.php?action=create
Content-Type: application/json

{
    "user_id": 2,
    "shipping_address": "Jl. Budi No. 123, Jakarta",
    "payment_method": "bank_transfer",
    "items": [
        {
            "product_id": 1,
            "quantity": 2
        },
        {
            "product_id": 2,
            "quantity": 1
        }
    ]
}

Response (201):
{
    "success": true,
    "order_id": 15,
    "order_number": "ORD-20231125-001",
    "total_price": 5397000,
    "message": "Pesanan berhasil dibuat"
}
```

#### Get User Orders
```
GET /api/orders.php?action=get_user_orders&user_id=2

Response:
{
    "success": true,
    "data": [
        {
            "id": 15,
            "order_number": "ORD-20231125-001",
            "total_price": 5397000,
            "status": "pending",
            "created_at": "2023-11-25 10:30:00"
        },
        ...
    ]
}
```

#### Get Order Detail
```
GET /api/orders.php?action=detail&order_id=15&user_id=2

Response:
{
    "success": true,
    "data": {
        "id": 15,
        "order_number": "ORD-20231125-001",
        "total_price": 5397000,
        "status": "pending",
        "shipping_address": "Jl. Budi No. 123, Jakarta",
        "payment_method": "bank_transfer",
        "items": [
            {
                "product_id": 1,
                "name": "Wireless Headphone Premium",
                "quantity": 2,
                "price": 899000
            },
            ...
        ],
        "created_at": "2023-11-25 10:30:00"
    }
}
```

### 6. Homepage

#### Get Homepage Data
```
GET /api/homepage.php?action=get_data

Response:
{
    "success": true,
    "banners": [
        {
            "id": 1,
            "title": "Sale Promo 75%",
            "subtitle": "Diskon besar-besaran untuk produk pilihan",
            "button_text": "Shop Now",
            "image_url": "banner1.jpg",
            "background_color": "#ff6b6b"
        }
    ],
    "featured_products": [...],
    "categories": [...]
}
```

---

## Testing

### Menggunakan cURL

#### Test Login:
```bash
curl -X POST http://localhost:8000/api/auth.php?action=login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "budi@example.com",
    "password": "password123"
  }'
```

#### Test Get Products:
```bash
curl http://localhost:8000/api/products.php?action=get_all
```

#### Test Get Categories:
```bash
curl http://localhost:8000/api/categories.php?action=get_all
```

### Menggunakan Postman

1. **Import Collection:**
   - Buka Postman
   - File > Import > URL
   - Paste URL atau file collection JSON
   - Atau buat manual setiap endpoint

2. **Set Base URL:**
   - Di Postman, buat variable `baseUrl = http://localhost:8000`

3. **Test Each Endpoint:**
   - Sesuaikan method (GET/POST)
   - Masukkan parameters
   - Send dan lihat response

---

## Troubleshooting

### 1. Error: "Database connection failed"
**Solusi:**
- Periksa MySQL sudah berjalan
- Verifikasi config/database.php sudah benar
- Cek username dan password MySQL

### 2. Error: "Undefined index: email"
**Solusi:**
- Pastikan header Content-Type: application/json
- Pastikan data dikirim dalam format JSON yang benar

### 3. Error: "CORS error"
**Solusi:**
- Headers CORS sudah di-set di api_helper.php
- Untuk production, update `Access-Control-Allow-Origin`

### 4. File upload tidak bekerja
**Solusi:**
- Buat folder `assets/uploads/`
- Set permission folder ke 755
```bash
mkdir -p assets/uploads
chmod 755 assets/uploads
```

---

## Security Notes

1. **Environment Variables**: Jangan hardcode credentials
2. **Hashing Password**: Selalu gunakan `password_hash()` dan `password_verify()`
3. **Input Validation**: Sanitasi semua input user
4. **SQL Injection Prevention**: Gunakan prepared statements (sudah diimplementasikan)
5. **CORS Configuration**: Update untuk production environment
6. **HTTPS**: Gunakan HTTPS di production

---

## Next Steps

1. ✅ Setup database dan konfigurasi
2. ✅ Test semua API endpoints
3. ✅ Integrate dengan frontend (JavaScript)
4. ✅ Setup payment gateway (Midtrans, Stripe, dll)
5. ✅ Deploy ke production

---

## Support

Untuk pertanyaan atau masalah, silakan buat issue di repository atau hubungi tim support.

**Terakhir diupdate:** 25 November 2024
