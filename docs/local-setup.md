# GrowPak Store - Native Local Setup Guide (Windows / Native MySQL)

This project runs **100% natively without Docker** using Node.js npm workspaces and a local MySQL 8 database instance.

---

## 1. Prerequisites

- **Node.js**: v24.19.0 (LTS line)
- **NPM**: v11.x
- **Git**: Installed locally (Git 2.48+ in `AppData/Local/Programs/Git` or Program Files)
- **MySQL**: Oracle MySQL 8.4 Community Server (installed natively in `C:\Program Files\MySQL\MySQL Server 8.4`)

---

## 2. MySQL Management Commands

### Start MySQL Server
To start the native MySQL server on port 3306 using our configured data directory:
```powershell
Start-Process -FilePath "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysqld.exe" -ArgumentList "--defaults-file=C:\Users\s4sha\mysql-data\my.ini" -WindowStyle Hidden
```

### Check MySQL Process Status
```powershell
Get-Process mysqld
```

### Stop MySQL Server
```powershell
& "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysqladmin.exe" -u root shutdown
```

### Connect to MySQL via CLI
```powershell
& "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe" -h 127.0.0.1 -P 3306 -u growpak_user -pGrowPakApp_2026_SecurePass!9x growpak_store
```

---

## 3. Database Credentials & Configuration

- **Host**: `127.0.0.1`
- **Port**: `3306`
- **User**: `growpak_user`
- **Password**: `GrowPakApp_2026_SecurePass!9x`
- **Primary Database**: `growpak_store` (Charset: `utf8mb4`, Collation: `utf8mb4_unicode_ci`)
- **Testing Database**: `growpak_store_test`

---

## 4. Database Reset, Backup & Restore

### Reset Database
```powershell
npm run db:reset
```

### Backup (mysqldump)
```powershell
& "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysqldump.exe" -h 127.0.0.1 -u growpak_user -pGrowPakApp_2026_SecurePass!9x --routines --triggers growpak_store > "backup_$(Get-Date -Format 'yyyyMMdd_HHmmss').sql"
```

### Restore Backup
```powershell
& "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe" -h 127.0.0.1 -u growpak_user -pGrowPakApp_2026_SecurePass!9x growpak_store < backup_file.sql
```

---

## 5. Running the Application

From the repository root:

- **Install all dependencies (single root node_modules)**:
  ```powershell
  npm install
  ```
- **Run migrations & seed data**:
  ```powershell
  npm run db:migrate
  npm run db:seed
  ```
- **Start all services concurrently (API, Web Storefront, Admin Portal)**:
  ```powershell
  npm run dev
  ```
- **Start individually**:
  - API: `npm run dev:api` (Runs on http://localhost:5000, Swagger at http://localhost:5000/api/docs)
  - Web Storefront: `npm run dev:web` (Runs on http://localhost:4200)
  - Admin Portal: `npm run dev:admin` (Runs on http://localhost:4300)
