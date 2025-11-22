# Admin Panel - Panduan Lengkap

## 🚀 Memulai Admin Panel

### Login Admin
1. Buka: `http://localhost/transmart-project/index.html`
2. Klik "Login" atau login langsung di: `http://localhost/transmart-project/pages/auth/login.html`
3. Gunakan credentials:
   - **Email**: admin@transmart.com
   - **Password**: admin123
4. Anda akan diarahkan ke Dashboard Admin

### Akses Admin Panel
Setelah login, buka: `http://localhost/transmart-project/pages/admin/dashboard.html`

---

## 📊 Fitur Admin Panel

### 1. **Dashboard**
   - Lihat ringkasan penjualan dan performa toko
   - Grafik pendapatan dan pesanan bulanan
   - Produk terlaris
   - Pesanan terbaru

### 2. **Manajemen Produk** (`/pages/admin/products.html`)
   
   **Fitur yang Tersedia:**
   - ✅ Tambah Produk Baru
   - ✅ Edit Produk Existing
   - ✅ Hapus Produk
   - ✅ Cari Produk
   - ✅ Filter berdasarkan Kategori
   - ✅ Lihat Stok Produk
   
   **Cara Menambah Produk:**
   1. Klik tombol "Tambah Produk"
   2. Isi form:
      - Nama Produk
      - Kategori
      - Harga (Rp)
      - Stok
      - Deskripsi
      - URL Gambar
   3. Klik "Simpan Produk"
   
   **Cara Edit/Hapus:**
   - Klik ikon edit untuk mengubah
   - Klik ikon trash untuk menghapus

### 3. **Manajemen Kategori** (`/pages/admin/categories.html`)
   
   **Fitur yang Tersedia:**
   - ✅ Tambah Kategori Baru
   - ✅ Edit Kategori
   - ✅ Hapus Kategori
   - ✅ Tampilan Grid Kategori
   - ✅ Lihat Jumlah Produk per Kategori
   
   **Cara Menambah Kategori:**
   1. Klik tombol "Tambah Kategori"
   2. Isi form:
      - Nama Kategori
      - Deskripsi
      - Icon (Font Awesome class, optional)
   3. Klik "Simpan Kategori"

### 4. **Manajemen Pesanan** (`/pages/admin/orders.html`)
   
   **Fitur yang Tersedia:**
   - ✅ Lihat Semua Pesanan
   - ✅ Filter by Status
   - ✅ Lihat Detail Pesanan
   - ✅ Update Status Pesanan
   
   **Status Pesanan:**
   - Menunggu (Pending)
   - Diproses (Processing)
   - Dikirim (Shipped)
   - Sampai (Delivered)
   - Dibatalkan (Cancelled)
   
   **Cara Update Status:**
   1. Klik "Lihat" pada pesanan
   2. Pilih status baru dari dropdown
   3. Klik "Update Status"

### 5. **Manajemen Pelanggan** (`/pages/admin/customers.html`)
   
   **Fitur yang Tersedia:**
   - ✅ Lihat Semua Pelanggan
   - ✅ Cari Pelanggan
   - ✅ Lihat Total Belanja Pelanggan
   - ✅ Lihat Jumlah Pesanan
   - ✅ Lihat Tanggal Bergabung
   
   **Informasi Pelanggan:**
   - Nama
   - Email
   - Telepon
   - Total Belanja
   - Jumlah Pesanan
   - Tanggal Bergabung

### 6. **Manajemen Promo** (`/pages/admin/promo.html`)
   
   **Fitur yang Tersedia:**
   - ✅ Tambah Promo/Diskon Baru
   - ✅ Edit Promo
   - ✅ Hapus Promo
   - ✅ 2 Jenis Diskon: Persentase (%) dan Nominal (Rp)
   
   **Cara Membuat Promo:**
   1. Klik tombol "Tambah Promo"
   2. Isi form:
      - Kode Promo (cth: SELAMAT10)
      - Jenis Diskon (Persentase atau Nominal)
      - Nilai Diskon
      - Min. Pembelian (optional)
      - Berlaku Dari (tanggal)
      - Berlaku Sampai (tanggal)
      - Deskripsi
   3. Klik "Simpan Promo"

### 7. **Pengaturan Sistem** (`/pages/admin/settings.html`)
   
   **Tab Pengaturan:**
   
   **a) Umum**
   - Nama Toko
   - Deskripsi Toko
   - Email Toko
   
   **b) Toko**
   - Alamat Toko
   - Telepon Toko
   - Jam Operasional
   
   **c) Pembayaran**
   - Aktifkan Transfer Bank
   - Aktifkan E-Wallet
   - Aktifkan Cicilan
   
   **d) Email**
   - Konfigurasi SMTP Server
   - Port SMTP
   - Username Email
   - Password Email

---

## 📱 Responsif Design

Semua halaman admin sudah dioptimalkan untuk:
- ✅ Desktop
- ✅ Tablet
- ✅ Mobile

Sidebar akan collapse otomatis di perangkat kecil.

---

## 🔐 Fitur Keamanan

- ✅ Authentication check di setiap halaman
- ✅ Role-based access (admin only)
- ✅ Session management
- ✅ Input sanitization
- ✅ SQL injection prevention (prepared statements)
- ✅ CSRF protection via session

---

## 📡 API Endpoints yang Digunakan

### Produk
- `GET /api/products.php` - Ambil daftar produk
- `POST /api/products.php?action=create` - Tambah produk
- `POST /api/products.php?action=update` - Edit produk
- `POST /api/products.php?action=delete` - Hapus produk

### Kategori
- `GET /api/categories.php` - Ambil daftar kategori
- `POST /api/categories.php?action=create` - Tambah kategori
- `POST /api/categories.php?action=update` - Edit kategori
- `POST /api/categories.php?action=delete` - Hapus kategori

### Pesanan
- `GET /api/orders.php` - Ambil daftar pesanan
- `POST /api/orders.php?action=update_status` - Update status pesanan

### Pelanggan
- `GET /api/users.php` - Ambil daftar pelanggan

---

## 🎨 Styling

Menggunakan Tailwind CSS dengan custom colors:
- **Primary Red**: `#EE4040` (Transmart Red)
- **Font**: Inter (Google Fonts)
- **Icons**: Font Awesome 6.5.1

---

## 🔧 Troubleshooting

### Admin Panel tidak bisa diakses
- Pastikan sudah login sebagai admin
- Cek localStorage di browser (console: `localStorage.getItem('transmart_current_user')`)
- Clear cache dan reload page

### Form tidak bisa submit
- Pastikan semua field required terisi
- Cek console browser untuk error messages
- Pastikan API endpoint accessible

### Data tidak ter-load
- Cek network di DevTools (F12)
- Pastikan database connection OK
- Cek PHP error logs di XAMPP

---

## 📚 File-file Admin

```
pages/admin/
├── dashboard.html          ✅ Dashboard
├── products.html           ✅ Manajemen Produk
├── categories.html         ✅ Manajemen Kategori
├── orders.html             ✅ Manajemen Pesanan
├── customers.html          ✅ Manajemen Pelanggan
├── promo.html              ✅ Manajemen Promo
└── settings.html           ✅ Pengaturan

assets/js/
├── admin.js               - Dashboard logic
├── admin-products.js      - Products logic
├── admin-categories.js    - Categories logic
├── admin-orders.js        - Orders logic
├── admin-customers.js     - Customers logic
├── admin-promo.js         - Promo logic
└── admin-settings.js      - Settings logic

api/
├── products.php           - Products API
├── categories.php         - Categories API
├── orders.php             - Orders API
└── users.php              - Users/Customers API
```

---

## ✨ Fitur Unggulan

1. **Real-time Data Loading** - Data langsung ter-update dari database
2. **Search & Filter** - Cari dan filter produk dengan mudah
3. **Pagination** - Navigasi data dengan mudah
4. **Modal Forms** - Interface yang clean dan modern
5. **Status Indicators** - Visual indicators untuk status produk dan pesanan
6. **Notifications** - Toast notifications untuk feedback user
7. **Responsive Layout** - Sidebar yang bisa di-collapse
8. **Data Validation** - Validasi input di client dan server

---

## 🚀 Next Steps

### Untuk Pengembangan Lebih Lanjut:

1. **Payment Gateway Integration**
   - Integrasikan Midtrans atau Stripe
   - Setup payment callback handling

2. **Email Notifications**
   - Kirim email otomatis untuk pesanan baru
   - Kirim notifikasi perubahan status pesanan
   - Kirim promo codes ke pelanggan

3. **Inventory Management**
   - Tracking stok real-time
   - Low stock alerts
   - Auto reorder suggestions

4. **Analytics & Reports**
   - Laporan penjualan bulanan/tahunan
   - Customer analytics
   - Product performance metrics

5. **Marketing Tools**
   - Email campaign management
   - SMS notifications
   - Push notifications

---

## 📞 Support

Jika ada masalah atau pertanyaan:
1. Check documentation files
2. Check browser console (F12 → Console)
3. Check XAMPP PHP error logs
4. Check phpMyAdmin database

---

**Last Updated**: November 19, 2025
**Status**: ✅ All Features Working
