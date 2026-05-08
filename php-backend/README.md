# Platinum Network - cPanel Deployment Guide

Pure PHP backend for Platinum Network. Works on any cPanel shared hosting with PHP 7.4+ and MySQL/MariaDB.
**No Composer / no Python / no Node** required on the server.

---

## What's inside this zip

```
platinum-network-cpanel/
├── frontend-build/          ← React production build (upload to public_html)
├── php-backend/             ← PHP API (upload to public_html/api/)
├── MYSQL_TABLE_SCHEMAS.sql  ← Run this in phpMyAdmin
└── README.md                ← This file
```

---

## Step-by-step deployment

### 1) Create MySQL database

1. Go to **cPanel → MySQL® Databases**
2. Create a new database, e.g. `cpaneluser_platinum`
3. Create a new database user with a strong password
4. Add the user to the database with **ALL PRIVILEGES**

### 2) Import schema

1. Go to **cPanel → phpMyAdmin** and select the database you just created
2. Click the **SQL** tab
3. Open `MYSQL_TABLE_SCHEMAS.sql`, copy everything, paste into the SQL tab and click **Go**

### 3) Configure PHP backend

1. Open `php-backend/config.php` in any text editor
2. Update the constants at the top:

```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'cpaneluser_platinum');
define('DB_USER', 'cpaneluser_admin');
define('DB_PASS', 'your-strong-password');
define('JWT_SECRET_KEY', 'change-this-to-a-long-random-string');
define('CORS_ORIGINS', 'https://yourdomain.com');
```

### 4) Upload the files

Using **cPanel → File Manager** (or FTP / FileZilla):

| Source folder | Upload to |
|---|---|
| Everything inside `frontend-build/` | `public_html/` |
| The whole `php-backend/` folder | `public_html/api/` |

### 5) Frontend → Backend URL

The React build inside `frontend-build/` was compiled with `REACT_APP_BACKEND_URL=""` (relative paths).
That means it will call `/api/*` on the same domain — no extra config needed.

### 6) Test it

Open in browser:

- `https://yourdomain.com/`              → React landing page
- `https://yourdomain.com/api/`          → `{"message":"Platinum Network API - PHP Version","status":"active"}`
- `https://yourdomain.com/api/health`    → `{"status":"healthy","database":"mysql"}`

---

## Admin user

After registering through the UI, run this in phpMyAdmin:

```sql
UPDATE users SET is_admin = 1 WHERE email = 'your-email@example.com';
```

---

## Google AdSense Setup

After your AdSense application is approved, replace `ca-pub-XXXXXXXXXXXXXXXX` in **two places**:

1. **`frontend-build/index.html`** — search for `ca-pub-XXXXXXXXXXXXXXXX` and replace
2. The `data-ad-client` attribute is rendered by the React component, so for full integration also rebuild the frontend after editing `/src/components/AdSense.js` (set `ADSENSE_CLIENT`)

Already-placed ad slots (you create slot IDs in the AdSense dashboard):
- `dashboard-middle` — Dashboard between mining and tasks
- `blog-list-bottom` — Blog list footer
- `blog-incontent` — Inside each blog post

---

## Security checklist before going live

- [ ] Change `JWT_SECRET_KEY` in `config.php` to a long random string
- [ ] Set `CORS_ORIGINS` to your exact domain
- [ ] Set `DEBUG_MODE` to `false`
- [ ] Enable HTTPS (free Let's Encrypt cert in cPanel)
- [ ] Use strong DB user password

---

## Troubleshooting

**`{"detail":"Database connection failed"}`**
→ Check DB credentials in `config.php`. cPanel usernames are usually `cpaneluser_dbname`.

**`{"detail":"Could not validate credentials"}` even after login**
→ Authorization header is being stripped. The `.htaccess` should fix this; if not, ask your host to enable `mod_rewrite` and `mod_headers`.

**404 on `/api/auth/login`**
→ `mod_rewrite` not enabled, or `.htaccess` not uploaded inside `api/`.

---

## Tech notes

- PHP **PDO** with prepared statements (SQL-injection safe)
- **JWT HS256** hand-rolled (no Composer needed)
- **bcrypt** passwords compatible with passlib (`$2b$` and `$2y$` both supported)
- All datetimes stored & returned in **UTC**
- Same JSON shape as the FastAPI server, so the React frontend needs **zero** changes.

Made with care for cPanel hosting.
