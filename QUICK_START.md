# 🚀 TRANSMART - QUICK START GUIDE

## Cara Menjalankan Web Transmart 100% Terintegrasi

### ✅ Prerequisites (Sudah Siap)
- ✓ PHP 8.0+ (dengan extensions: PDO, MySQLi)
- ✓ MySQL/MariaDB
- ✓ XAMPP (sudah terinstall)
- ✓ Database `transmart_db` sudah dibuat
- ✓ Semua tabel dan sample data sudah ada
- ✓ Frontend & Backend sudah terintegrasi

---

## 1️⃣ SETUP DATABASE (Sekali saja)

### Opsi A: Menggunakan Script PHP

```bash
cd /home/rahao/transmart-project
php setup_database.php
```

Script ini akan:
- ✓ Membuat semua tabel jika belum ada
- ✓ Insert test users
- ✓ Insert sample products & categories

### Opsi B: Menggunakan phpMyAdmin XAMPP

1. Buka: http://localhost/phpmyadmin
2. Import file `database.sql` ke database `transmart_db`
3. Run `php setup_database.php` untuk insert test data

---

## 2️⃣ JALANKAN WEB SERVER

### Opsi A: PHP Built-in Server (RECOMMENDED)

```bash
cd /home/rahao/transmart-project
php -S localhost:8000
```

Server akan jalan di: **http://localhost:8000**

### Opsi B: Menggunakan XAMPP

1. Buka XAMPP Control Panel
2. Start **Apache** dan **MySQL**
3. Copy folder `transmart-project` ke folder `htdocs` XAMPP
4. Akses di: **http://localhost/transmart-project**

---

## 3️⃣ AKSES HALAMAN WEB

### 🏠 Homepage
```
http://localhost:8000
```

### 🔐 Login
```
http://localhost:8000/pages/auth/login.html
```

### 📝 Register
```
http://localhost:8000/pages/auth/register.html
```

### 👤 Profile (setelah login)
```
http://localhost:8000/pages/user/profile.html
```

### 🛒 Shopping Cart
```
http://localhost:8000/pages/cart.html
```

### 📦 Product Catalog
```
http://localhost:8000/pages/products/catalog.html
```

### 🛍️ Checkout
```
http://localhost:8000/pages/checkout.html
```

---

## 4️⃣ TEST CREDENTIALS

### Admin Account
```
Email: admin@transmart.com
Password: admin123
```

### Customer Account
```
Email: budi@example.com
Password: password123
```

### Atau Register Akun Baru
- Format nomor telepon: 08xxxxxxxxxx
- Minimal password: 6 karakter
- Email harus valid

---

## 5️⃣ FITUR YANG SUDAH TERINTEGRASI

### ✅ Authentication
- [x] Login dengan validasi database
- [x] Register dengan validasi email & nomor telepon
- [x] Password hashing (bcrypt)
- [x] Session management
- [x] Remember me

### ✅ Products & Categories
- [x] Fetch products dari database
- [x] Filter by category
- [x] Product search
- [x] Pagination
- [x] Product detail

### ✅ Shopping Cart
- [x] Add to cart
- [x] Update quantity
- [x] Remove item
- [x] Cart summary
- [x] Persistent cart

### ✅ User Profile
- [x] View profile
- [x] Edit personal information
- [x] Change password
- [x] Profile validation
- [x] Address management

### ✅ Orders
- [x] Create order dari cart
- [x] Order history
- [x] Order tracking
- [x] Order status

### ✅ Admin Features
- [x] Dashboard (untuk admin)
- [x] Product management
- [x] User management
- [x] Order management

---

## 6️⃣ API ENDPOINTS REFERENCE

### Authentication
```
POST /api/auth.php?action=login
POST /api/auth.php?action=register
POST /api/auth.php?action=logout
```

### Products
```
GET /api/products.php
GET /api/products.php?id=1
GET /api/products.php?category=2
GET /api/products.php?search=apple
```

### Categories
```
GET /api/categories.php
GET /api/categories.php?id=1
```

### Cart
```
GET /api/cart.php
POST /api/cart.php (add to cart)
PUT /api/cart.php (update quantity)
DELETE /api/cart.php?cart_id=1
```

### Orders
```
GET /api/orders.php
POST /api/orders.php (create order)
GET /api/orders.php?id=1 (detail)
```

### User Profile
```
GET /api/users.php
PUT /api/users.php (update profile)
DELETE /api/users.php (delete account)
```

### Homepage
```
GET /api/homepage.php
GET /api/homepage.php?section=featured
GET /api/homepage.php?section=latest
GET /api/homepage.php?section=categories
```

---

## 7️⃣ TROUBLESHOOTING

### Error: "Database connection failed"
**Solusi:**
1. Pastikan MySQL running (XAMPP)
2. Check config di `config/config.php`:
   ```php
   define('DB_HOST', '127.0.0.1');
   define('DB_NAME', 'transmart_db');
   define('DB_USER', 'root');
   define('DB_PASS', '');
   ```
3. Jalankan: `php check_database.php`

### Error: "Format nomor telepon tidak valid"
**Solusi:**
- Format yang benar: 08xxxxxxxxxx (08 + 7-13 digit)
- Contoh: 08123456789, 081234567890, 0812345678901
- Jangan pakai +62 pada form register

### Error: "Email sudah terdaftar"
**Solusi:**
- Gunakan email berbeda saat register
- Atau reset password di login page

### Cart tidak tersimpan
**Solusi:**
- Pastikan cookie/session enabled di browser
- Clear browser cache
- Login ulang

### Login berhasil tapi redirect error
**Solusi:**
- Bersihkan localStorage:
  ```javascript
  localStorage.clear()
  ```
- Refresh halaman
- Login ulang

---

## 8️⃣ FILE PENTING

```
transmart-project/
├── config/
│   ├── config.php          # Database & app config
│   ├── database.php        # Database connection
│   └── functions.php       # Helper functions
├── api/
│   ├── auth.php           # Login, register
│   ├── products.php       # Product API
│   ├── categories.php     # Category API
│   ├── cart.php           # Cart API
│   ├── orders.php         # Order API
│   ├── users.php          # User profile API
│   └── homepage.php       # Homepage data
├── pages/
│   ├── auth/login.html    # Login page
│   ├── auth/register.html # Register page
│   ├── user/profile.html  # Profile page
│   ├── cart.html          # Cart page
│   ├── checkout.html      # Checkout page
│   └── products/catalog.html
├── assets/
│   ├── js/
│   │   ├── auth.js        # Auth logic
│   │   ├── main.js        # Homepage logic
│   │   ├── cart.js        # Cart logic
│   │   └── products.js    # Product logic
│   └── css/
│       ├── style.css      # Main styles
│       └── responsive.css # Responsive styles
├── database.sql           # Database schema & sample data
├── index.html            # Homepage
├── setup_database.php    # Database setup script
└── check_database.php    # Database diagnostic
```

---

## 9️⃣ DEVELOPMENT TIPS

### Enable Debug Mode
Edit `config/config.php`:
```php
define('DEVELOPMENT', true);
error_reporting(E_ALL);
ini_set('display_errors', 1);
```

### Check Database
```bash
php check_database.php
```

### Run Setup
```bash
php COMPLETE_SETUP.php
```

### Reset Database
```bash
php setup_database.php  # Re-run setup
```

### Test API
```bash
# Test login
curl -X POST http://localhost:8000/api/auth.php?action=login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@transmart.com","password":"admin123"}'

# Test products
curl http://localhost:8000/api/products.php

# Test categories
curl http://localhost:8000/api/categories.php
```

---

## 🔟 NEXT STEPS

1. ✅ Jalankan server: `php -S localhost:8000`
2. ✅ Buka browser: `http://localhost:8000`
3. ✅ Login dengan: admin@transmart.com / admin123
4. ✅ Explore fitur-fitur
5. ✅ Test shopping flow

---

## ❓ FAQ

**Q: Apakah semua fitur sudah berfungsi?**
A: Ya! Semua fitur sudah terintegrasi 100% dengan database.

**Q: Bisa pakai XAMPP daripada CLI?**
A: Bisa! Ikuti Opsi B di step 2.

**Q: Bagaimana cara add produk baru?**
A: Via phpMyAdmin langsung, atau buat admin panel untuk insert produk.

**Q: Apakah ada payment gateway?**
A: Belum. Anda bisa integrate Midtrans/Payment Gateway sesuai kebutuhan.

**Q: Database bisa reset?**
A: Ya, jalankan `php setup_database.php` ulang.

---

**Selamat menggunakan Transmart! 🎉**

Jika ada error atau pertanyaan, check file:
- `check_database.php` - untuk verify database
- `COMPLETE_SETUP.php` - untuk verify setup lengkap
- Server logs - untuk debug API errors
