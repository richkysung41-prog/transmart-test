# ⚡ BACKEND SETUP - 5 MENIT

## 1️⃣ Setup Database (1 menit)

```bash
# Import database
mysql -u root -p < database.sql
```

## 2️⃣ Update Config (1 menit)

Edit `config/database.php`:
```php
private $host = "127.0.0.1";
private $db_name = "transmart_db";
private $username = "root";
private $password = "";  // Isi password MySQL Anda jika ada
```

## 3️⃣ Start Server (1 menit)

```bash
cd /home/dobot/dobot-project/transmart-test

# Make executable
chmod +x start_backend.sh

# Start
./start_backend.sh
```

**Server jalan di:** `http://localhost:8000`

## 4️⃣ Test Database (1 menit)

```bash
php test_database.php
```

Harus ada output:
```
✅ Connection SUCCESS
✅ Table: users
✅ Table: products
✅ Table: categories
...
```

## 5️⃣ Test API (1 menit)

```bash
./test_api.sh
```

Atau buka Postman dan import: `Transmart_API.postman_collection.json`

---

## 🎯 Demo Accounts

| Email | Password |
|-------|----------|
| admin@transmart.com | admin123 |
| budi@example.com | password123 |

---

## 🔗 Quick Links

- 📖 **Full Setup Guide:** [BACKEND_SETUP.md](./BACKEND_SETUP.md)
- ⚡ **Developer Cheatsheet:** [BACKEND_QUICK_REFERENCE.md](./BACKEND_QUICK_REFERENCE.md)
- 🔗 **Frontend Integration:** [FRONTEND_BACKEND_INTEGRATION.md](./FRONTEND_BACKEND_INTEGRATION.md)
- 📋 **Troubleshooting:** [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)

---

## 🔌 API Base URL

```
http://localhost:8000/api
```

### Example API Calls

**Login:**
```bash
curl -X POST http://localhost:8000/api/auth.php?action=login \
  -H "Content-Type: application/json" \
  -d '{"email":"budi@example.com","password":"password123"}'
```

**Get Products:**
```bash
curl http://localhost:8000/api/products.php?action=get_all
```

**Search:**
```bash
curl "http://localhost:8000/api/products.php?action=search&keyword=headphone"
```

---

## ✅ Checklist

- [ ] Database imported: `mysql < database.sql`
- [ ] Config updated: `config/database.php`
- [ ] Server running: `./start_backend.sh`
- [ ] DB test passed: `php test_database.php`
- [ ] API test passed: `./test_api.sh`
- [ ] Login works with demo account

---

## 🆘 Masalah Umum

**❌ Database connection failed**
- Pastikan MySQL running
- Check credentials di `config/database.php`
- Run: `php test_database.php`

**❌ API return 404**
- Pastikan files ada di `api/` folder
- Check `.htaccess` atau server config
- Try: `curl http://localhost:8000/api/products.php`

**❌ Port 8000 sudah dipakai**
```bash
# Gunakan port lain
php -S localhost:8001
```

---

## 📚 Dokumentasi Lengkap

| File | Untuk |
|------|-------|
| BACKEND_DOCUMENTATION.md | Overview lengkap |
| BACKEND_SETUP.md | Setup detail |
| BACKEND_QUICK_REFERENCE.md | Developer cheatsheet |
| FRONTEND_BACKEND_INTEGRATION.md | Integrate dengan frontend |
| DEPLOYMENT_CHECKLIST.md | Deploy & troubleshooting |

---

**🎉 Backend Ready!**

Selanjutnya: Integrate dengan frontend atau baca documentasi lengkap di atas.
