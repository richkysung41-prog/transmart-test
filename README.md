# Transmart - Platform E-Commerce

Platform belanja online untuk kebutuhan sehari-hari (makanan, minuman, kebutuhan rumah tangga, dll).

## 🚀 Quick Start

### Prasyarat
- PHP 7.4+
- MySQL/MariaDB 5.7+
- Apache dengan mod_rewrite
- Browser modern

### Installation

#### 1. Clone/Download Proyek
```bash
cd /home/rahao/transmart-project
```

#### 2. Setup Database

**Option A: MySQL Command Line**
```bash
mysql -u root -p < database.sql
```

**Option B: PhpMyAdmin**
- Buka PhpMyAdmin
- Buat database baru: `transmart_db`
- Import file `database.sql`

**Option C: Manual Create Database**
Jalankan semua query yang ada di `database.sql` satu per satu

#### 3. Konfigurasi Database

Edit file `config/database.php` sesuaikan dengan setting MySQL Anda:
```php
private $host = "localhost";        // Host MySQL
private $db_name = "transmart_db";  // Nama database
private $username = "root";         // Username MySQL
private $password = "";             // Password MySQL
```

#### 4. Setup Web Server

**Apache (Recommended)**
- Pastikan mod_rewrite aktif: `a2enmod rewrite`
- Taruh folder proyek di `/var/www/html/transmart-project`
- Atau edit VirtualHost sesuai kebutuhan

**Atau gunakan PHP Built-in Server:**
```bash
cd /home/rahao/transmart-project
php -S localhost:8000
```

#### 5. Akses Aplikasi

Buka browser dan akses:
```
http://localhost/transmart-project
```

Atau jika menggunakan PHP Server:
```
http://localhost:8000
```

---

## 📝 Demo Account

### Admin
- Email: `admin@transmart.com`
- Password: `admin123`

### Customer
- Email: `budi@example.com`
- Password: `password123`

---

## 🗂️ Struktur Folder

```
transmart-project/
├── config/                    # Konfigurasi aplikasi
│   ├── config.php            # Setting aplikasi
│   ├── database.php          # Database connection
│   └── functions.php         # Business logic (TransmartFunctions class)
│
├── api/                       # REST API Endpoints
│   ├── auth.php              # Login, Register, Logout
│   ├── products.php          # Get products, filter
│   ├── categories.php        # Get categories
│   ├── cart.php              # Cart operations
│   ├── orders.php            # Order operations
│   └── users.php             # User profile
│
├── pages/                     # Frontend Pages
│   ├── auth/
│   │   ├── login.html        # Login page
│   │   └── register.html     # Register page
│   ├── products/
│   │   ├── catalog.html      # Product listing
│   │   └── detail.html       # Product detail
│   ├── cart.html             # Cart page
│   ├── checkout.html         # Checkout page
│   └── admin/
│       └── dashboard.html    # Admin dashboard
│
├── assets/                    # Frontend Resources
│   ├── css/
│   │   ├── style.css         # Custom CSS
│   │   └── responsive.css    # Mobile responsive
│   ├── js/
│   │   ├── auth.js           # Auth logic
│   │   ├── main.js           # Main script
│   │   ├── products.js       # Product page logic
│   │   ├── cart.js           # Cart logic
│   │   └── checkout.js       # Checkout logic
│   └── images/               # Image assets
│
├── database.sql              # Database schema & sample data
└── index.html                # Homepage
```

---

## 🔑 Key Features

### Authentication
- ✅ Login dengan email & password
- ✅ Register user baru
- ✅ Session management
- ✅ Password hashing (bcrypt)
- ✅ Remember me functionality

### Products
- Tampilkan daftar produk
- Filter by category & price
- Search products
- Product detail page
- Rating & reviews

### Shopping Cart
- Add/remove items
- Update quantity
- Calculate total

### Orders
- Create order
- Order history
- Order tracking
- Payment integration (Midtrans)

### Admin
- Dashboard stats
- User management
- Product management
- Order management

---

## 📚 API Documentation

### Authentication

#### Login
```
POST /api/auth.php?action=login
Content-Type: application/json

{
    "email": "user@example.com",
    "password": "password"
}

Response:
{
    "success": true,
    "user": {
        "id": 1,
        "name": "User Name",
        "email": "user@example.com",
        "phone": "+6281234567890",
        "role": "customer"
    },
    "message": "Login berhasil"
}
```

#### Register
```
POST /api/auth.php?action=register
Content-Type: application/json

{
    "name": "Full Name",
    "email": "user@example.com",
    "phone": "+6281234567890",
    "password": "password123"
}

Response:
{
    "success": true,
    "message": "Pendaftaran berhasil. Silakan login."
}
```

#### Logout
```
POST /api/auth.php?action=logout

Response:
{
    "success": true,
    "message": "Logout berhasil"
}
```

---

## 🛠️ Development

### Adding New Features

1. **Backend (PHP)**
   - Edit method di `config/functions.php` (TransmartFunctions class)
   - Buat endpoint baru di `api/[resource].php`
   - Test dengan Postman atau curl

2. **Frontend (HTML/CSS/JS)**
   - Buat page baru di `pages/[category]/`
   - Tambahkan styling di `assets/css/`
   - Tambahkan logic di `assets/js/[page].js`

### Database

Untuk menambah table atau field:
1. Edit `database.sql`
2. Run ulang query di MySQL
3. Update functions di `config/functions.php`

---

## 🐛 Troubleshooting

### Database Connection Error
```
Solusi:
1. Pastikan MySQL running
2. Check config/database.php settings
3. Verifikasi database `transmart_db` sudah dibuat
4. Verifikasi user MySQL punya akses
```

### "Cannot access API" Error
```
Solusi:
1. Pastikan mod_rewrite aktif di Apache
2. Check .htaccess file exists
3. Pastikan folder permissions benar (755)
```

### Login tidak bekerja
```
Solusi:
1. Pastikan database sudah diimport (ada table `users`)
2. Check demo account ada: admin@transmart.com / budi@example.com
3. Check browser console untuk API errors
4. Verifikasi API URL di auth.js sesuai
```

---

## 📖 Next Steps

- [ ] Implementasi Products API & Pages
- [ ] Implementasi Cart API & Pages
- [ ] Implementasi Checkout & Payment
- [ ] Admin Dashboard
- [ ] Email notifications
- [ ] Search & Filter
- [ ] Reviews & Ratings
- [ ] Order Tracking

---

## 📞 Support

Jika ada pertanyaan atau issue, silakan cek:
- Browser console (F12) untuk error messages
- Network tab untuk API responses
- Server error logs

---

## 📄 License

© 2024 Transmart. All rights reserved.
