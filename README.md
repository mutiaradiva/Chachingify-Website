# ChaChingify - Smart Finance Tracker
> Aplikasi web untuk mengelola keuangan pribadi dengan mudah dan efisien. Catat pemasukan, pengeluaran, dan pantau tujuan keuangan Anda dalam satu tempat.

![ChaChingify Banner](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)
![Version](https://img.shields.io/badge/Version-1.0.0-blue?style=for-the-badge)

---

## 📋 Daftar Isi

- [Masalah yang Diselesaikan](#-masalah-yang-diselesaikan)
- [Solusi yang Dibuat](#-solusi-yang-dibuat)
- [Tech Stack](#-tech-stack)
- [Fitur Utama](#-fitur-utama)
- [Cara Menjalankan Project](#-cara-menjalankan-project)
- [Struktur Project](#-struktur-project)
- [API Endpoints](#-api-endpoints)

---

## 🎯 Masalah yang Diselesaikan

### Problem Statement

Banyak orang kesulitan untuk:
- **Melacak pengeluaran harian** - Tidak tahu uang habis untuk apa
- **Merencanakan keuangan** - Sulit membuat budget dan menabung
- **Mencapai tujuan finansial** - Tidak ada sistem tracking untuk goals
- **Analisis keuangan** - Tidak ada visualisasi spending pattern
- **Manajemen multi-akun** - Sulit track saldo di berbagai rekening

Aplikasi finance tracker yang ada sering kali:
- Terlalu kompleks untuk pengguna awam
- Berbayar dengan fitur basic yang terbatas
- Tidak user-friendly
- Data tersimpan di cloud pihak ketiga (privacy concern)

---

## ✨ Solusi yang Dibuat

**ChaChingify** adalah aplikasi web finance tracker yang:

### 🎨 User-Friendly
- Interface modern dan intuitif dengan design teal/emerald yang fresh
- Mobile responsive - bisa diakses dari smartphone
- Real-time updates tanpa reload halaman

### 💡 Fitur Lengkap
- **Dashboard Analytics** - Visualisasi keuangan dengan chart dan statistik
- **Transaction Management** - CRUD transaksi dengan kategori custom
- **Goals Tracking** - Set dan monitor tujuan keuangan (liburan, dana darurat, dll)
- **Multi-Category System** - 10+ kategori default + bisa custom
- **Monthly Reports** - Laporan pengeluaran 6 bulan terakhir

### 🔒 Secure & Private
- Data disimpan di MongoDB dengan enkripsi
- JWT authentication untuk keamanan
- Setiap user punya data terpisah

### 🆓 Free & Open Source
- Gratis digunakan selamanya
- Bisa di-host sendiri (self-hosted)
- Kode terbuka untuk customization

---

## 🛠 Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Styling dengan utility-first approach
- **Lucide React** - Icon library
- **React Hooks** - State management

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM untuk MongoDB
- **JWT** - Authentication & authorization
- **bcrypt.js** - Password hashing

### DevOps
- **Nodemon** - Auto-restart backend saat development
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables management

---

## ⚡ Fitur Utama

### 1. 📊 Dashboard Interaktif
- **Saldo Tersisa** dengan breakdown Kas & Bank
- **Total Pemasukan & Pengeluaran** bulan ini
- **Chart Pengeluaran 6 Bulan** terakhir
- **Breakdown per Kategori** dengan progress bar
- **Transaksi Terakhir** dengan quick action
- **Quick Stats**: Rata-rata/hari, Kategori Aktif, Saving Rate

### 2. 💸 Manajemen Transaksi
- **Tambah Transaksi** - Pemasukan atau Pengeluaran
- **Kategori Custom** - 10 kategori default + bisa tambah sendiri
- **Upload Bukti** - Attach foto struk/bukti transaksi
- **Filter & Search** - Cari transaksi by date, kategori, atau keyword
- **Edit & Delete** - Update atau hapus transaksi kapan saja

### 3. 🎯 Tujuan Keuangan (Goals)
- **Set Target** - Tentukan nama, jumlah, dan deadline
- **Track Progress** - Lihat progress bar dan persentase
- **Custom Icon** - Pilih emoji untuk setiap goal (🏖️🏠🚗💍)
- **Hitung Otomatis** - Sisa waktu dan jumlah yang kurang
- **CRUD Goals** - Tambah, edit, delete tujuan

### 4. 📈 Analytics & Reports
- **Monthly Trend** - Grafik pengeluaran 6 bulan
- **Category Breakdown** - Spending pattern per kategori
- **Saving Rate** - Persentase uang yang tersimpan
- **Daily Average** - Rata-rata pengeluaran per hari

### 5. 🔐 Authentication
- **Register** - Buat akun baru dengan email & password
- **Login** - Secure authentication dengan JWT
- **Auto-Logout** - Token expiry untuk keamanan
- **Protected Routes** - Only logged-in users can access

---

## 🚀 Cara Menjalankan Project

### Prerequisites

Pastikan sudah terinstall:
- **Node.js** v16+ ([Download](https://nodejs.org/))
- **MongoDB** ([Download](https://www.mongodb.com/try/download/community)) atau gunakan MongoDB Atlas
- **Git** ([Download](https://git-scm.com/))

### 1️⃣ Clone Repository

```bash
git clone https://github.com/mutiaradiva/Chachingify-Website
cd Chachingify-Website
```

### 2️⃣ Setup Backend

```bash
# Masuk ke folder backend
cd backend

# Install dependencies
npm install

# Buat file .env
# Copy .env.example ke .env atau buat manual
```

**Isi file `.env`:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/chachingify
JWT_SECRET=your-super-secret-key-change-this
```

**Jalankan seeder (opsional - untuk default categories):**
```bash
node seedDefaultCategories.js
```

**Start backend server:**
```bash
npm start
# atau untuk development dengan auto-reload:
npm run dev
```

Backend akan running di `http://localhost:5000`

### 3️⃣ Setup Frontend

Buka terminal baru:

```bash
# Masuk ke folder frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend akan running di `http://localhost:5173`

### 4️⃣ Akses Aplikasi

1. Buka browser ke `http://localhost:5173`
2. **Register** akun baru
3. **Login** dengan kredensial yang dibuat
4. Mulai catat transaksi! 🎉

---

## 📁 Struktur Project

```
chachingify/
├── backend/
│   ├── middleware/
│   │   └── auth.js              # JWT authentication middleware
│   ├── models/
│   │   ├── User.js              # User schema
│   │   ├── Transaction.js       # Transaction schema
│   │   ├── Category.js          # Category schema
│   │   ├── Account.js           # Account schema
│   │   └── Goal.js              # Goal schema
│   ├── routes/
│   │   ├── auth.js              # Login & Register
│   │   ├── transactions.js      # CRUD Transactions
│   │   ├── categories.js        # CRUD Categories
│   │   ├── accounts.js          # CRUD Accounts
│   │   ├── goals.js             # CRUD Goals
│   │   └── analytics.js         # Summary & Reports
│   ├── uploads/                 # Receipt images
│   ├── seedDefaultCategories.js # Seeder script
│   ├── server.js                # Entry point
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── authForm.jsx           # Login/Register form
│   │   │   ├── Header.jsx             # Top navigation
│   │   │   ├── dashboard.jsx          # Dashboard component
│   │   │   ├── TransactionList.jsx    # Transaction list
│   │   │   ├── AddTransactionModal.jsx
│   │   │   ├── editTransactionModal.jsx
│   │   │   ├── goals.jsx              # Goals component
│   │   │   └── budget.jsx             # Budget (deprecated)
│   │   ├── pages/
│   │   │   └── dashboardPage.jsx      # Main dashboard page
│   │   ├── utils/
│   │   │   ├── api.js                 # API service layer
│   │   │   └── helpers.js             # Utility functions
│   │   ├── App.jsx                    # Root component
│   │   ├── main.jsx                   # Entry point
│   │   └── index.css                  # Global styles
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register    # Register user baru
POST   /api/auth/login       # Login user
```

### Transactions
```
GET    /api/transactions           # Get all transactions
POST   /api/transactions           # Create transaction
GET    /api/transactions/:id       # Get single transaction
PUT    /api/transactions/:id       # Update transaction
DELETE /api/transactions/:id       # Delete transaction
```

### Categories
```
GET    /api/categories       # Get all categories
POST   /api/categories       # Create category
DELETE /api/categories/:id   # Delete category
```

### Goals
```
GET    /api/goals            # Get all goals
POST   /api/goals            # Create goal
GET    /api/goals/:id        # Get single goal
PUT    /api/goals/:id        # Update goal
DELETE /api/goals/:id        # Delete goal
POST   /api/goals/:id/contribute  # Add contribution
```

### Analytics
```
GET    /api/analytics/summary       # Get summary statistics
GET    /api/analytics/by-category   # Get spending by category
GET    /api/analytics/trend         # Get monthly trend
```

### Accounts
```
GET    /api/accounts         # Get all accounts
POST   /api/accounts         # Create account
PUT    /api/accounts/:id     # Update account
DELETE /api/accounts/:id     # Delete account
```

---

## 🎨 Screenshots

### Dashboard
![Dashboard Preview](https://via.placeholder.com/800x450?text=Dashboard+Preview)

### Transaksi
![Transactions Preview](https://via.placeholder.com/800x450?text=Transactions+Preview)

### Goals
![Goals Preview](https://via.placeholder.com/800x450?text=Goals+Preview)

---

## 🤝 Contributing

Contributions are welcome! Jika ingin contribute:

1. Fork repository ini
2. Buat branch baru (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📝 License

This project is licensed under the MIT License - lihat file [LICENSE](LICENSE) untuk detail.

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- Icons by [Lucide](https://lucide.dev/)
- Design inspiration from modern fintech apps
- Built with ❤️ using React & Node.js

---

## 📞 Support

Jika ada pertanyaan atau masalah:
- Open an [Issue](https://github.com/yourusername/chachingify/issues)
- Email: support@chachingify.com

---

**⭐ Jangan lupa beri star jika project ini membantu! ⭐**
