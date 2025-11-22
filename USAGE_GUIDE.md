# 📖 Step-by-Step Guide - Menggunakan Transmart

## ✅ Verifikasi Sistem Sudah Berfungsi

Sebelum mulai, pastikan:
- [ ] Server PHP running di `localhost:8000`
- [ ] Database sudah terkoneksi
- [ ] Tidak ada error di console browser

---

## 🎯 STEP 1: Mulai Server

### Command:
```bash
cd /home/rahao/transmart-project
php -S localhost:8000
```

### Expected Output:
```
[Day Month Date Time Year] PHP Version X.X.X Development Server
Listening on http://localhost:8000
```

---

## 🎯 STEP 2: Buka Browser

Akses halaman utama:
```
http://localhost:8000/index.html
```

Anda akan melihat homepage Transmart dengan:
- Header dengan logo
- Navigation menu
- Featured products
- Footer

---

## 🎯 STEP 3: Login

### Metode 1: Klik tombol Login
- Klik tombol "Login" di header
- Akan redirect ke: `http://localhost:8000/pages/auth/login.html`

### Metode 2: Direct Access
```
http://localhost:8000/pages/auth/login.html
```

### Masukkan Credentials:
```
Email:    admin@transmart.com
Password: admin123
```

### Expected Result:
```
✅ Login berhasil
Redirect ke dashboard atau halaman sebelumnya
Session cookie tersimpan
```

---

## 🎯 STEP 4: Buka Katalog Produk

### Via Navigation Menu:
- Klik menu "Produk" di header
- Atau klik tombol "Lihat Semua Produk"

### Direct Access:
```
http://localhost:8000/pages/products/catalog.html
```

### Anda akan melihat:
- Sidebar dengan filter
- Grid produk di tengah
- Pagination di bawah

---

## 🎯 STEP 5: Filter & Search Produk

### Filter by Category (Sidebar):
1. Di sidebar kiri, lihat "Kategori"
2. Klik salah satu kategori (mis: "Buah & Sayur")
3. Produk akan ter-filter sesuai kategori

### Search Produk (Sidebar):
1. Di sidebar kiri, lihat "Cari Produk"
2. Ketik nama produk (mis: "apel")
3. Produk akan ter-filter sesuai search term

### Filter Harga (Sidebar):
1. Masukkan min price dan max price
2. Klik tombol "Terapkan"
3. Produk akan ter-filter sesuai range harga

### Sort Produk (Sidebar):
1. Pilih opsi di dropdown "Urutkan"
2. Pilihan: Terbaru, Harga Terendah, Harga Tertinggi, Rating, Terpopuler

---

## 🎯 STEP 6: Tambahkan Produk ke Keranjang ⭐

### SEKARANG INI BERFUNGSI ✅

**Cara:**
1. Di halaman katalog, cari produk
2. Klik tombol **"🛒 Tambahkan"** pada produk

**Expected Result:**
```
✅ Notifikasi hijau: "Produk ditambahkan ke keranjang"
✅ Angka di icon keranjang bertambah
✅ Produk sudah tersimpan di database
```

### Jika Ada Error:
1. Refresh halaman (Ctrl+F5)
2. Login ulang
3. Coba lagi tombol "Tambahkan"

---

## 🎯 STEP 7: Lihat Product Detail

### Cara 1: Klik tombol "Lihat Detail"
1. Di halaman katalog, klik "Lihat Detail" pada produk
2. Akan membuka halaman detail produk

### Cara 2: Direct URL
```
http://localhost:8000/pages/products/detail.html?id=20
```

### Di Halaman Detail:
- Foto produk (large view)
- Nama produk
- Harga
- Rating & reviews
- Quantity selector
- **Tombol "🛒 + Keranjang"** ← SEKARANG BERFUNGSI ✅
- **Tombol "Beli Sekarang"**
- Wishlist button

### Tambahkan dari Detail Page:
1. Ubah quantity dengan tombol +/-
2. Klik **"🛒 + Keranjang"**
3. Produk ditambahkan dengan quantity yang dipilih

---

## 🎯 STEP 8: Lihat Keranjang

### Via Header:
- Klik icon "🛒" di header (ada angka jumlah items)
- Akan membuka halaman: `/pages/cart.html`

### Direct Access:
```
http://localhost:8000/pages/cart.html
```

### Di Halaman Cart:
Anda akan melihat:
- [ ] Daftar produk yang ditambahkan
- [ ] Quantity setiap produk
- [ ] Unit price
- [ ] Total price
- [ ] Tombol untuk update quantity
- [ ] Tombol untuk hapus item
- [ ] Tombol "Lanjut ke Checkout"

---

## 🎯 STEP 9: Update Cart

### Ubah Quantity:
1. Temukan produk di cart
2. Klik tombol "+" untuk tambah quantity
3. Klik tombol "-" untuk kurangi quantity
4. Total price akan ter-update otomatis

### Hapus Item:
1. Klik icon "🗑️ Hapus" pada item
2. Item akan dihapus dari cart
3. Total price akan ter-update

---

## 🎯 STEP 10: Checkout (Optional)

### Dari Halaman Cart:
1. Lihat ringkasan order
2. Klik tombol "Lanjut ke Checkout"
3. Masukkan alamat pengiriman
4. Pilih metode pembayaran
5. Review order
6. Klik "Confirm Order"

---

## 🎯 STEP 11: Admin Dashboard (Optional)

### Buka Dashboard:
```
http://localhost:8000/pages/admin/dashboard.html
```

### Menu Admin Sidebar:
- 📊 Dashboard - Statistik & overview
- 📦 Produk - Manage products (add/edit/delete)
- 🏷️ Kategori - Manage categories
- 📋 Pesanan - View & manage orders
- 👥 Pelanggan - View customer list
- 🎁 Promo - Create discount codes
- ⚙️ Pengaturan - System settings

### Fitur Admin:
- ✅ Tambah produk baru
- ✅ Edit produk
- ✅ Hapus produk
- ✅ Search products
- ✅ Buat kategori
- ✅ Edit kategori
- ✅ Lihat orders
- ✅ Update order status
- ✅ Lihat customers
- ✅ Create promo codes

---

## ✅ Checklist Lengkap

Setelah mengikuti semua steps, verifikasi:

- [ ] Server berjalan di localhost:8000
- [ ] Homepage bisa diakses
- [ ] Login berhasil
- [ ] Katalog bisa diakses
- [ ] Filter kategori berfungsi
- [ ] Search berfungsi
- [ ] **Tombol Tambahkan berfungsi** ✅
- [ ] Produk ditambahkan ke cart
- [ ] Halaman cart bisa diakses
- [ ] Cart menampilkan produk yang ditambahkan
- [ ] Update quantity berfungsi
- [ ] Delete item berfungsi
- [ ] Admin dashboard bisa diakses
- [ ] Admin bisa menambah produk
- [ ] Admin bisa manage categories

---

## 🐛 Troubleshooting

### Error: "Terjadi kesalahan"
**Solusi:**
1. Refresh halaman (Ctrl+F5)
2. Login ulang
3. Coba lagi

### Error: "Unauthorized"
**Solusi:**
1. Hapus cookies browser
2. Login ulang
3. Cek console untuk detail error

### Cart kosong padahal sudah tambah produk
**Solusi:**
1. Refresh halaman cart
2. Cek console untuk error
3. Verify session aktif (login ulang)

### Halaman tidak bisa diakses
**Solusi:**
1. Cek apakah server PHP running
2. Cek URL (case-sensitive)
3. Restart server PHP

---

## 📞 Support

Jika masih ada masalah:
1. Buka DevTools (F12)
2. Lihat console untuk error messages
3. Lihat Network tab untuk API responses
4. Screenshot error dan review dokumentasi

---

## 🎉 Selesai!

Anda sekarang sudah bisa menggunakan Transmart E-Commerce System dengan lengkap!

**Status: ✅ READY TO USE**

---

**Last Updated**: 2025-11-19
