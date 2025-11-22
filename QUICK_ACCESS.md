# 📱 CARA MASUK KE WEB TRANSMART - PANDUAN SINGKAT

## 🎯 3 LANGKAH UTAMA

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  LANGKAH 1: SETUP DATABASE (PERTAMA KALI SAJA)        │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                         │
│  Terminal 1 → Run ini (1 kali):                       │
│                                                         │
│  $ cd /home/rahao/transmart-project                   │
│  $ mysql -u root -p < database.sql                   │
│                                                         │
│  Tekan Enter, masukkan password MySQL (atau Enter)    │
│                                                         │
│  ✅ Database setup complete!                           │
│                                                         │
└─────────────────────────────────────────────────────────┘

        ↓

┌─────────────────────────────────────────────────────────┐
│                                                         │
│  LANGKAH 2: START PHP SERVER                          │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                         │
│  Terminal 2 → Run ini (setiap development):          │
│                                                         │
│  $ cd /home/rahao/transmart-project                   │
│  $ php -S localhost:8000                             │
│                                                         │
│  Akan muncul:                                          │
│  Listening on http://localhost:8000                  │
│  Press Ctrl-C to quit                                │
│                                                         │
│  ✅ Server running!                                    │
│  ⚠️  JANGAN TUTUP TERMINAL INI                         │
│                                                         │
└─────────────────────────────────────────────────────────┘

        ↓

┌─────────────────────────────────────────────────────────┐
│                                                         │
│  LANGKAH 3: BUKA DI BROWSER                           │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                         │
│  Browser address bar → Ketik:                         │
│                                                         │
│  http://localhost:8000                               │
│                                                         │
│  Tekan ENTER                                           │
│                                                         │
│  ✅ Homepage Transmart tampil!                         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🔑 CARA LOGIN

### Opsi A: Quick Login (PALING MUDAH) ⚡

```
1. Di halaman login, scroll ke bawah
   
2. Lihat section "Demo Account"

3. Ada 2 tombol:
   
   📍 Admin Button:
      admin@transmart.com / admin123
      
   📍 Customer Button:
      budi@example.com / password123

4. KLIK TOMBOL → Form auto-fill → Auto-login!

5. Tunggu 2-3 detik...

✅ SELESAI! Anda sudah login!
```

### Opsi B: Manual Login

```
1. Buka: http://localhost:8000/pages/auth/login.html

2. Isi form:
   Email:    admin@transmart.com
   Password: admin123

3. Klik "Masuk"

4. Tunggu loading...

✅ Login berhasil!
```

### Opsi C: Register User Baru

```
1. Di login page → Klik "Daftar di sini"

2. Atau buka: http://localhost:8000/pages/auth/register.html

3. Isi form:
   Nama:              Rizki Pratama
   Email:             rizki@example.com (HARUS UNIK!)
   Telepon:           081234567890
   Password:          Rizki@123 (min 6 karakter)
   Konfirmasi:        Rizki@123

4. Check ✓ Saya menyetujui Syarat & Ketentuan

5. Klik "Daftar Sekarang"

6. Tunggu...

✅ Berhasil! Redirect ke login page

7. Login dengan user baru Anda
```

---

## 🧪 DEMO ACCOUNT (SUDAH READY)

```
┌─────────────────────────────────────────────────────────┐
│  ADMIN ACCOUNT                                          │
├─────────────────────────────────────────────────────────┤
│  Email:    admin@transmart.com                          │
│  Password: admin123                                     │
│  Role:     Admin                                        │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  CUSTOMER ACCOUNT 1                                     │
├─────────────────────────────────────────────────────────┤
│  Email:    budi@example.com                             │
│  Password: password123                                  │
│  Role:     Customer                                     │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  CUSTOMER ACCOUNT 2                                     │
├─────────────────────────────────────────────────────────┤
│  Email:    siti@example.com                             │
│  Password: password123                                  │
│  Role:     Customer                                     │
└─────────────────────────────────────────────────────────┘
```

---

## 📍 URLS PENTING

```
Homepage:
  http://localhost:8000

Login Page:
  http://localhost:8000/pages/auth/login.html

Register Page:
  http://localhost:8000/pages/auth/register.html

API Base:
  http://localhost:8000/api/auth.php
```

---

## ⚙️ TROUBLESHOOTING CEPAT

| Masalah | Solusi |
|---------|--------|
| **"Cannot connect"** | Pastikan PHP server running (check terminal) |
| **"No styling"** | Refresh hard: Ctrl+Shift+R |
| **"Login gagal"** | Database sudah diimport? Cek: `mysql -u root transmart_db` |
| **"Port 8000 in use"** | Ganti port: `php -S localhost:8001` |
| **"MySQL error"** | Pastikan MySQL running: `mysql -u root -p` |

---

## ✅ CHECKLIST

Sebelum testing, pastikan:

- [ ] MySQL running
- [ ] Database diimport (transmart_db ada)
- [ ] PHP server running (php -S localhost:8000)
- [ ] Terminal dengan PHP server TIDAK ditutup
- [ ] Browser buka: http://localhost:8000
- [ ] Homepage tampil dengan warna-warni
- [ ] Developer tools ready (F12)

---

## 🎉 SELESAI!

Sekarang Anda bisa:
- ✅ Akses homepage
- ✅ Login dengan demo account
- ✅ Register user baru
- ✅ Test seluruh flow login

**Selamat mencoba!** 🚀

---

## 📖 DOKUMENTASI LENGKAP

Untuk info lebih detail, baca:
- `README.md` - Setup guide lengkap
- `TESTING.md` - 15 test cases
- `QUICK_START.sh` - Panduan step-by-step
