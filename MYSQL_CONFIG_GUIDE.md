# =====================================================
# MySQL DATABASE CONFIGURATION GUIDE
# =====================================================

## आपके Namecheap Database Details यहाँ डालें:

1. `/app/backend/.env` file खोलें
2. ये values अपने Namecheap cPanel से ले कर update करें:

```
MYSQL_HOST="66.29.132.163"           # आपका Namecheap DB host IP
MYSQL_PORT="3306"                     # Port (usually 3306)
MYSQL_USER="platbqct_admin"          # आपका database username
MYSQL_PASSWORD="your_password_here"   # आपका database password
MYSQL_DB="platbqct_PNRP26"           # आपका database name
```

## Important Notes:

1. **Remote MySQL Access**: Namecheap cPanel में "Remote MySQL" section में जाकर container की IP को whitelist करें, या `%` (wildcard) add करें सभी IPs के लिए।

2. **Security**: Production में `.env` file को कभी git में commit न करें।

3. **Testing Locally**: अगर Namecheap remote access काम नहीं कर रहा, तो local MySQL use करें testing के लिए:
   ```
   MYSQL_HOST="localhost"
   MYSQL_USER="root"
   MYSQL_PASSWORD=""
   MYSQL_DB="platinum_network"
   ```

## अगर Connection Error आए:

1. Namecheap cPanel → Databases → Remote MySQL
2. Add Access Host: `%` (या specific IP)
3. Save
4. Backend restart करें: `sudo supervisorctl restart backend`
