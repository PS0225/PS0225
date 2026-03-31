# 🔧 Common Issues & Solutions - Platinum Network

## Issue 1: "Already claimed" but balance not updating

### Problem:
- Daily check-in claim kar liya
- "Already checked in today" message aa raha hai
- But wallet mein PNRP add nahi ho raha

### Solution:

**Method 1: Hard Refresh Browser**
```
Chrome/Edge: Ctrl + Shift + R (Windows) या Cmd + Shift + R (Mac)
Firefox: Ctrl + F5
Safari: Cmd + Option + R
```

**Method 2: Clear Browser Cache**
1. Chrome: Settings > Privacy > Clear browsing data
2. Select "Cached images and files"
3. Click "Clear data"
4. Refresh page

**Method 3: Check Actual Balance**
1. Logout
2. Login again
3. Check wallet page directly
4. Balance should be updated

### Root Cause:
- Browser cache storing old data
- Page not fully reloading
- Frontend state not updating

---

## Issue 2: Mining not starting

### Problem:
- Click "Start Mining" button
- Nothing happens या error message

### Solution:

**Check 1: Already have active session?**
```bash
# Open browser console (F12) and check
```
If you see "already have active mining session", then:
1. Check mining timer on dashboard
2. If timer shows 0:00, try claiming first
3. Then start new session

**Check 2: Backend connectivity**
1. Open browser console (F12)
2. Look for red errors
3. If "Failed to fetch" या "Network error" → Backend down
4. Wait a minute and try again

**Check 3: Session stuck**
1. Contact admin to reset your mining session
2. Or wait for current session to expire

---

## Issue 3: Mining rewards (50 PNRP) not added to wallet

### Problem:
- Mining session complete
- Clicked "Claim Rewards"
- But 50 PNRP not showing in wallet

### Solution:

**Step 1: Check Mining Status**
```
Dashboard → Check if mining timer shows "Complete"
If not complete, wait for timer to reach 0
```

**Step 2: Claim Properly**
1. Make sure "Claim Rewards" button is GREEN
2. Click it
3. Alert message should show: "Claimed XX PNRP"
4. Page will reload automatically

**Step 3: Verify in Wallet**
1. Go to Wallet page
2. Check transaction history
3. Should see "Mining reward" entry
4. Check total balance at top

**Step 4: Hard Refresh**
```
Ctrl + Shift + R (Windows)
Cmd + Shift + R (Mac)
```

**Step 5: Logout & Login**
1. Logout completely
2. Login again
3. Check wallet
4. Balance should be correct now

---

## Issue 4: Daily check-in not working

### Symptoms:
- Watch ad button not working
- Claim button disabled
- Shows wrong day number

### Solution:

**Check 1: Already claimed today?**
- Daily check-in is once per 24 hours
- If claimed, come back tomorrow
- Day resets at midnight UTC

**Check 2: Ad watching stuck**
- Refresh page
- Try again
- Wait for 5 seconds after clicking

**Check 3: Network issues**
- Check internet connection
- Try different browser
- Clear cache and retry

---

## Issue 5: Balance showing wrong amount

### Problem:
- Balance not matching transactions
- Shows 0 PNRP but should have more
- Balance decreasing instead of increasing

### Solution:

**Step 1: Check Wallet Page**
```
Dashboard → Wallet → Transaction History
```
See all transactions:
- Mining rewards
- Daily check-ins
- Social tasks
- Referral earnings

**Step 2: Calculate Manual**
Add up all transaction amounts
Should match total balance

**Step 3: Database Sync Issue**
If mismatch found:
1. Logout
2. Clear browser cache
3. Login again
4. Check /api/wallet endpoint directly

**Step 4: Contact Admin**
If still wrong, provide:
- Username
- Expected balance
- List of completed activities
- Screenshots

---

## Issue 6: Referral bonus not working

### Problem:
- Referred someone
- They are mining
- But you're not getting 10%

### Solution:

**Check 1: Did they use your code?**
```
Referrals page → Check "Total Referrals"
Should show your referred users
```

**Check 2: Have they claimed mining?**
- Referral bonus is given when:
  - Your referral CLAIMS mining rewards
  - Not just when they start mining

**Check 3: Check Transaction History**
```
Wallet → Look for "Referral bonus from [username]"
```

**Math:**
- Your referral mines: 50 PNRP
- You get: 5 PNRP (10%)
- This happens every time they claim

---

## Issue 7: Social tasks not giving rewards

### Problem:
- Completed social task
- Clicked "Complete" button
- No 30 PNRP received

### Solution:

**Step 1: Verify Completion**
```
Social Tasks page → Check if task shows "✓ Completed"
```

**Step 2: Check Wallet**
```
Wallet → Transaction History → Look for "Social task completed: [Platform Name]"
```

**Step 3: Refresh & Retry**
If not showing:
1. Refresh page
2. Check if task is actually marked complete
3. If not, click Complete again

**Step 4: One-Time Only**
- Each social task can only be completed ONCE
- Can't claim same task multiple times

---

## Issue 8: Can't login / "Invalid credentials"

### Problem:
- Correct email & password
- But login fails

### Solution:

**Check 1: Email spelling**
- No spaces before/after email
- Correct domain (.com, not .co)

**Check 2: Password**
- Case sensitive
- Check Caps Lock
- No extra spaces

**Check 3: Reset Password**
(Feature not implemented yet, contact admin)

**Check 4: Register New Account**
If completely stuck, register with different email

---

## Issue 9: Page loading slow / Not loading

### Problem:
- Pages taking too long to load
- Stuck on loading screen
- White/blank page

### Solution:

**Check 1: Backend Status**
```
Railway backend might be sleeping
Wait 10-20 seconds for it to wake up
Then refresh page
```

**Check 2: Clear Cache**
```
Ctrl + Shift + Delete
Clear cached images and files
```

**Check 3: Try Different Browser**
- Chrome
- Firefox
- Safari
- Edge

**Check 4: Check Internet**
- Run speed test
- Try different WiFi/data
- Disable VPN if using

---

## Issue 10: Mobile app not working

### Note:
- This is a web app (PWA)
- Not a native Android/iOS app
- Works in mobile browser

### Solution:

**Open in Browser:**
```
Chrome Mobile → Visit yourdomain.com
Safari Mobile → Visit yourdomain.com
```

**Install as PWA:**
1. Chrome: Menu → "Add to Home screen"
2. Safari: Share → "Add to Home Screen"
3. Works like an app!

**Mobile Issues:**
- If buttons not working → Try landscape mode
- If layout broken → Clear browser cache
- If slow → Check mobile data speed

---

## 🆘 Debug Checklist

When something doesn't work:

1. ☐ Hard refresh page (Ctrl + Shift + R)
2. ☐ Check browser console for errors (F12)
3. ☐ Clear browser cache
4. ☐ Logout and login again
5. ☐ Try different browser
6. ☐ Check internet connection
7. ☐ Wait 30 seconds (backend might be waking up)
8. ☐ Check wallet for actual balance
9. ☐ Take screenshot of error
10. ☐ Contact admin with details

---

## 📊 How to Check Backend Status

### Method 1: Browser Console
```
1. Press F12 (Developer Tools)
2. Go to "Network" tab
3. Try the action again
4. Look for red errors
5. Check response codes (200 = OK, 400/500 = Error)
```

### Method 2: Direct API Test
```
Visit: https://yourdomain.com/api/
Should show: {"message": "Hello World"}
If not loading → Backend is down
```

### Method 3: Railway Dashboard
```
Login to Railway.app
Check deployment status
View logs for errors
```

---

## 🔍 Common Error Messages & Meaning

| Error Message | Meaning | Solution |
|---------------|---------|----------|
| "Already checked in today" | You claimed daily reward today | Come back tomorrow |
| "Already have active mining session" | Mining is ongoing | Wait or claim current session |
| "No completed mining session" | Mining not done yet | Wait for timer to complete |
| "Please watch the ad first" | Didn't watch ad | Click watch ad button |
| "Invalid email or password" | Wrong credentials | Check email/password spelling |
| "Username already exists" | Username taken | Try different username |
| "Email already exists" | Email already registered | Login or use different email |
| "Invalid referral code" | Wrong code | Check code spelling |
| "Network Error" | Backend down or no internet | Check connection, wait & retry |
| "Failed to fetch" | Can't reach backend | Check if backend is running |

---

## 💡 Pro Tips for Smooth Experience

1. **Daily Routine:**
   - Check in every 24 hours
   - Claim mining every 12/24 hours
   - Complete social tasks once

2. **Maximize Earnings:**
   - Watch ads for 2x speed (100 PNRP)
   - Refer friends (10% lifetime bonus)
   - Never miss daily check-in (50 PNRP on day 7)

3. **Avoid Issues:**
   - Don't spam click buttons
   - Wait for page to fully load
   - Don't refresh during claim process
   - Keep browser updated

4. **Best Practices:**
   - Use Chrome or Firefox
   - Clear cache weekly
   - Bookmark the site
   - Enable notifications (coming soon)

---

## 📞 Still Not Working?

**Report Bug:**
```
Provide these details:
1. What were you trying to do?
2. What error message did you see?
3. Screenshot of the error
4. Browser & device you're using
5. Your username (not password!)
6. Time when error occurred
```

**Contact:**
- Email admin
- Check announcement page
- Wait for fixes

---

## ✅ Quick Fix Flowchart

```
Issue occurred
    ↓
Hard refresh (Ctrl+Shift+R)
    ↓
Still broken?
    ↓
Clear cache
    ↓
Still broken?
    ↓
Logout & Login
    ↓
Still broken?
    ↓
Try different browser
    ↓
Still broken?
    ↓
Contact admin with details
```

---

**Most issues are fixed by: Hard Refresh + Clear Cache + Re-login** 🔄

Keep this guide handy! Bookmark it! 📖
