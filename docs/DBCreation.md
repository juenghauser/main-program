# Database Creation & Migration Guide

This guide explains how to create and update the MySQL databases for all microservices in this project.

---

## 1. Prerequisites
- MySQL Server and MySQL Workbench installed
- Python 3.x installed
- Each service has its own virtual environment (`venv`)

---

## 2. Create Databases and User

1. Open MySQL Workbench and connect as `root` (or another admin user).
2. Run the following SQL:

```sql
CREATE DATABASE auth_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE media_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE collection_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER 'media_app'@'localhost' IDENTIFIED BY 'YOUR_PASSWORD_HERE';
GRANT ALL PRIVILEGES ON auth_db.* TO 'media_app'@'localhost';
GRANT ALL PRIVILEGES ON media_db.* TO 'media_app'@'localhost';
GRANT ALL PRIVILEGES ON collection_db.* TO 'media_app'@'localhost';
FLUSH PRIVILEGES;
```

---

## 3. Configure Environment Variables

- if '.env' doesn't exist, copy `.env.example` to `.env` in each service directory.
- Update the password in each `.env` to match your MySQL user.
---

## 4. Set Up Each Service (Repeat for Each Service)

### a. Create the Virtual Environment
```cmd
python -m venv venv
```

### b. Activate the Virtual Environment
```cmd
venv\Scripts\activate
```

### c. Install Dependencies
```cmd
pip install -r requirements.txt
```

### d. Install Migration Tools (if not already installed)
```cmd
pip install Flask-Migrate python-dotenv pymysql cryptography
```

### e. Set FLASK_APP Environment Variable
```cmd
set FLASK_APP=app.py
```

### f. Initialize Migrations (first time only)
```cmd
flask db init
```

### g. Generate Migration Script
```cmd
flask db migrate -m "Initial migration"
```

### h. Apply Migration (Create/Update Tables)
```cmd
flask db upgrade
```

---

## 5. Updating the Database Schema
- Make changes to your models in `models.py`.
- Repeat steps **g** and **h** above to generate and apply a new migration.

---

## 6. Troubleshooting
- If you see `No changes in schema detected`, ensure your models are imported in `app.py`.
- If you get access errors, check your MySQL user privileges.
- If you get a reserved word error (e.g., `metadata`), rename the field in your model.

---

## 7. Verifying Tables
- Use MySQL Workbench or run:
```sql
USE <db_name>;
SHOW TABLES;
```
- You should see your service's tables (e.g., `user`, `media`, `catalog_item`).

---

For more details, see the main `README.md` or ask your team lead.
