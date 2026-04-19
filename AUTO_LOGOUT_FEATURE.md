# Auto Logout Feature - Inactivity Based

## Overview
Users are automatically logged out after 7 days of mining inactivity to keep the platform active and engaged.

## How It Works

### Activity Tracking
- **Last Mining Timestamp**: Stored in `localStorage.lastMiningTime`
- **Updated When**: User clicks "Start Mining" button
- **Format**: Unix timestamp in milliseconds

### Auto Logout Logic
```javascript
const daysSinceLastMining = (Date.now() - lastMiningTime) / (1000 * 60 * 60 * 24);
if (daysSinceLastMining > 7) {
  // Auto logout
}
```

### Rules
1. ✅ **User mines daily** → Stays logged in
2. ✅ **User mines within 7 days** → Stays logged in
3. ❌ **User doesn't mine for 7+ days** → Auto logout on next app open

## Implementation

### Files Modified

**1. `/app/frontend/src/App.js`**
- Added inactivity check in `checkAuth()` function
- Checks `lastMiningTime` on every app load
- Clears session if > 7 days inactive
- Updated `logout()` to clear timestamp

**2. `/app/frontend/src/pages/Dashboard.js`**
- Updates `lastMiningTime` when user starts mining
- Timestamp saved to localStorage

### Code Flow

**App Load:**
```
1. App.js checkAuth() runs
2. Check localStorage.lastMiningTime
3. Calculate days since last mining
4. If > 7 days → Auto logout
5. If ≤ 7 days → Continue login
```

**Mining Started:**
```
1. User clicks "Start Mining"
2. API call to backend
3. localStorage.lastMiningTime = Date.now()
4. User activity timestamp updated
```

## Testing

### Test Case 1: Active User (Daily Mining)
- User mines every day
- lastMiningTime updates daily
- Never hits 7-day threshold
- **Result**: Stays logged in ✅

### Test Case 2: Inactive User (7+ Days)
- User last mined 8 days ago
- Opens app
- checkAuth() calculates 8 days
- **Result**: Auto logout ✅

### Test Case 3: Edge Case (Exactly 7 Days)
- User last mined exactly 7 days ago
- Opens app
- checkAuth() calculates 7.00 days
- **Result**: Stays logged in (> 7 required for logout) ✅

## User Experience

### Auto Logout Message
User sees standard login screen after auto logout. No error message needed as it's a security/inactivity feature.

### Re-Login
User can simply login again and start fresh.

## Benefits

1. **Platform Engagement**: Encourages daily mining
2. **Security**: Inactive sessions don't persist indefinitely
3. **User Motivation**: Keeps active users engaged
4. **Data Hygiene**: Clears stale sessions

## Notes

- Timestamp stored client-side (localStorage)
- No server-side tracking needed
- Works seamlessly with existing auth system
- Compatible with JWT token expiry
