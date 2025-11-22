#!/bin/bash

# ============================================
# 🚀 CARA MASUK KE WEB TRANSMART - PANDUAN LENGKAP
# ============================================

cat << 'EOF'

╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║         🚀 CARA AKSES TRANSMART WEB - PANDUAN LENGKAP         ║
║                                                                ║
║  Ikuti langkah ini untuk setup dan membuka aplikasi Transmart ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝


📋 DAFTAR ISI:
═════════════════════════════════════════════════════════════════

1. ✅ SETUP DATABASE (Pertama kali saja)
2. ✅ START PHP SERVER 
3. ✅ BUKA APLIKASI DI BROWSER
4. ✅ TESTING LOGIN
5. ✅ TROUBLESHOOTING


═════════════════════════════════════════════════════════════════
STEP 1: SETUP DATABASE (PERTAMA KALI SAJA)
═════════════════════════════════════════════════════════════════

Langkah 1a: Buka Terminal/Command Prompt

  Windows:
    - Klik Start → Command Prompt (atau CMD)
    
  Mac/Linux:
    - Tekan Ctrl+Alt+T (atau buka Terminal)

Langkah 1b: Masuk ke folder project

  cd /home/rahao/transmart-project

Langkah 1c: Pastikan MySQL running

  Windows:
    - Cek taskbar → MySQL harus running
    - Atau buka Services dan start MySQL
    
  Mac:
    - mysql.server start
    
  Linux:
    - sudo systemctl start mysql

Langkah 1d: Import database

  mysql -u root -p < database.sql

  Lalu tekan Enter.
  Jika diminta password MySQL, masukkan password Anda (atau tekan Enter jika tidak ada).

  Tunggu sampai selesai (2-3 detik).

Langkah 1e: Verifikasi database berhasil

  mysql -u root -p transmart_db

  Lalu masukkan password jika ada.

  Kemudian jalankan:
    SHOW TABLES;

  Harusnya muncul:
    +------------------------+
    | Tables_in_transmart_db |
    +------------------------+
    | cart                   |
    | categories             |
    | discounts              |
    | order_items            |
    | orders                 |
    | products               |
    | users                  |
    +------------------------+

  Jika berhasil → EXIT dengan:
    exit

✅ DATABASE SETUP SELESAI!


═════════════════════════════════════════════════════════════════
STEP 2: START PHP SERVER
═════════════════════════════════════════════════════════════════

Langkah 2a: Buka Terminal BARU (jangan tutup terminal database)

  - Buka terminal/command prompt baru
  
Langkah 2b: Masuk ke folder project

  cd /home/rahao/transmart-project

Langkah 2c: Start PHP server

  php -S localhost:8000

  Harusnya muncul:
    Development Server (http://localhost:8000)
    Listening on http://localhost:8000
    Press Ctrl-C to quit

  ✅ SERVER RUNNING!

  PENTING: Jangan tutup terminal ini selama development!


═════════════════════════════════════════════════════════════════
STEP 3: BUKA APLIKASI DI BROWSER
═════════════════════════════════════════════════════════════════

Langkah 3a: Buka browser (Chrome, Firefox, Safari, Edge)

Langkah 3b: Ketik URL berikut di address bar:

  http://localhost:8000

  Lalu tekan ENTER

Langkah 3c: Anda akan melihat:

  ✅ Homepage Transmart
  ✅ Logo Transmart
  ✅ Search bar
  ✅ Kategori produk
  ✅ Flash sale section
  ✅ Recommended products

  Jika tidak muncul, cek di TROUBLESHOOTING di bawah.

Langkah 3d: Klik tombol LOGIN atau MASUK

  - Di header ada tombol "Masuk"
  - Atau link "Masuk" di bagian atas kanan
  - Atau buka langsung: http://localhost:8000/pages/auth/login.html


═════════════════════════════════════════════════════════════════
STEP 4: TESTING LOGIN
═════════════════════════════════════════════════════════════════

Anda sekarang di halaman login.

OPSI A: Quick Login dengan Demo Account (PALING MUDAH)
────────────────────────────────────────────────────

Scroll ke bawah halaman login dan lihat "Demo Account" section.

Ada 2 tombol:
  1. Admin: admin@transmart.com / admin123
  2. Customer: budi@example.com / password123

Klik salah satu tombol → Form otomatis terisi → Otomatis login!

Tunggu 2-3 detik...

✅ BERHASIL LOGIN! Anda akan diredirect ke homepage.

Status login bisa dilihat di:
  - URL berubah ke homepage
  - localStorage tersimpan (cek di F12 → Application → localStorage)


OPSI B: Manual Login
──────────────────

1. Isi email:        admin@transmart.com
2. Isi password:     admin123
3. Klik tombol "Masuk"
4. Tunggu loading state selesai

✅ Berhasil login!


OPSI C: Register User Baru
──────────────────────────

1. Di halaman login → Klik "Daftar di sini"
2. Atau buka: http://localhost:8000/pages/auth/register.html

3. Isi form:
   - Nama: Budi Santoso
   - Email: budi123@example.com (HARUS UNIK!)
   - Telepon: 081234567890
   - Password: Password123 (min 6 karakter)
   - Confirm: Password123

4. Check "Saya menyetujui Syarat & Ketentuan"

5. Klik "Daftar Sekarang"

6. Tunggu response...

✅ Berhasil! Akan redirect ke halaman login.

7. Login dengan email dan password yang baru dibuat.


═════════════════════════════════════════════════════════════════
TROUBLESHOOTING
═════════════════════════════════════════════════════════════════

❌ MASALAH: "Cannot connect to server" atau "Connection refused"

SOLUSI:
  1. Pastikan PHP server running (check terminal dengan "php -S localhost:8000")
  2. Pastikan menggunakan URL yang benar: http://localhost:8000
  3. Coba refresh browser: Ctrl+R atau Cmd+R
  4. Coba buka URL: http://127.0.0.1:8000 (IP loopback)


❌ MASALAH: Homepage loading tapi tidak ada styling (warna-warni)

SOLUSI:
  1. Buka F12 (Developer Tools)
  2. Cek Console → Apakah ada error merah?
  3. Cek Network → Apakah CSS & JS files loaded?
  4. Tunggu 2-3 detik (mungkin CDN Tailwind masih loading)
  5. Refresh browser: Ctrl+Shift+R (hard refresh)


❌ MASALAH: Login page loading tapi tombol Demo tidak bekerja

SOLUSI:
  1. Buka F12 → Console
  2. Cek apakah ada error merah
  3. Pastikan auth.js loaded
  4. Coba manual login (ketik email & password)
  5. Cek Network tab → POST ke /api/auth.php


❌ MASALAH: "Email atau password salah" padahal sudah benar

SOLUSI:
  1. Pastikan database sudah diimport: mysql -u root transmart_db -e "SELECT * FROM users;"
  2. Verifikasi email di database: 
     SELECT email FROM users;
  3. Pastikan MySQL running
  4. Coba restart PHP server
  5. Buka F12 → Network → Lihat response dari API


❌ MASALAH: Database import error / "database.sql: command not found"

SOLUSI:
  1. Pastikan berada di folder yang benar:
     cd /home/rahao/transmart-project
  
  2. Verifikasi file ada:
     ls database.sql
  
  3. Coba cara lain (open database.sql manually):
     mysql -u root -p
     CREATE DATABASE transmart_db;
     USE transmart_db;
     source /home/rahao/transmart-project/database.sql;


❌ MASALAH: "Access denied for user 'root'@'localhost'"

SOLUSI:
  1. Cek password MySQL:
     mysql -u root -p
     (masukkan password yang Anda tahu)
  
  2. Jika lupa password, reset:
     MySQL service stop → Edit config → Restart → Set password baru
  
  3. Atau gunakan user lain yang sudah ada


❌ MASALAH: "Port 8000 already in use"

SOLUSI:
  1. Ganti port:
     php -S localhost:8001
     (kemudian akses http://localhost:8001)
  
  2. Atau find process yang pakai port 8000:
     lsof -i :8000  (Mac/Linux)
     netstat -ano | findstr :8000  (Windows)
     
     Lalu kill process tersebut


═════════════════════════════════════════════════════════════════
CHECKLIST SEBELUM TESTING
═════════════════════════════════════════════════════════════════

Sebelum mulai testing, pastikan checklist ini OK:

  □ MySQL sudah running
  □ Database sudah diimport (transmart_db)
  □ PHP server sudah start (php -S localhost:8000)
  □ Terminal dengan PHP server TIDAK ditutup
  □ Browser sudah buka http://localhost:8000
  □ Homepage Transmart tampil dengan styling
  □ Browser developer tools sudah ready (F12)


═════════════════════════════════════════════════════════════════
RINGKASAN COMMAND
═════════════════════════════════════════════════════════════════

Terminal 1 (Database):
  cd /home/rahao/transmart-project
  mysql -u root -p < database.sql

Terminal 2 (PHP Server):
  cd /home/rahao/transmart-project
  php -S localhost:8000

Browser:
  http://localhost:8000


═════════════════════════════════════════════════════════════════
SELESAI!
═════════════════════════════════════════════════════════════════

Sekarang Anda sudah bisa:

  ✅ Mengakses homepage Transmart
  ✅ Masuk ke halaman login
  ✅ Testing login dengan demo account
  ✅ Register user baru
  ✅ Testing seluruh flow authentication

Selamat mencoba! 🎉

Jika ada masalah, cek terminal untuk error message atau buka
F12 → Console untuk JavaScript error.


═════════════════════════════════════════════════════════════════

For detailed documentation, see:
  - README.md (Setup guide)
  - TESTING.md (15 test cases)
  - INTEGRATION.md (Integration report)

═════════════════════════════════════════════════════════════════

EOF

echo ""
echo "✨ Setup complete! Ikuti panduan di atas untuk mulai testing."
echo ""
