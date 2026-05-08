# Platinum Network - Product Requirements Document

## Original Problem Statement
"Mujhe mining website with apk banana hai. ARC ASTRA JAISA. Platinum network website ka naam aur reward points PNRP. Mining 12 hours, 24 hours boost via ads. Daily rewards streak (7 days up to 50 PNRP). Social media tasks with Download APK/Play Store links. Auto-logout after 7 days of inactivity. User balance and leaderboard. Withdrawal at TGE after KYC. Register with Referral."

User wants the backend rewritten in **pure PHP** so it can be deployed on cPanel shared hosting (no Python/FastAPI).

## User Personas
- **Miner**: Regular user who mines PNRP every 12h, watches ads, claims daily rewards, completes social tasks, refers friends.
- **Admin**: Platform owner who reviews KYC, approves withdrawals (post-TGE), monitors stats.

## Core Requirements
1. 12-hour base mining → 24h with 2 time-boost ads
2. 5 speed-boost ads → 2x speed multiplier
3. Daily reward = 3 ads/day (15, 25, 40 PNRP)
4. 10% referral commission on referred user's mining
5. Social media tasks (Telegram, Twitter, YouTube, Instagram, Discord) - 30 PNRP each
6. Leaderboard by PNRP
7. Admin panel with user list, total PNRP, total mining PNRP
8. Auto-logout after 7 days inactivity (frontend)
9. KYC + TGE withdrawal (Phase 3, future)
10. PWA / Capacitor APK wrap (future)
11. AdSense approval-ready pages (Roadmap, Legal, Contact)

## Tech Stack
- **Frontend**: React 19 + Tailwind + Shadcn UI
- **Backend (cPanel deployment)**: **Pure PHP 7.4+** with PDO + MySQL/MariaDB
- **Backend (dev preview)**: FastAPI + MySQL (kept for Emergent preview)
- **DB**: MySQL/MariaDB
- **Auth**: Hand-rolled JWT HS256 (PHP) / PyJWT (Python). bcrypt-compatible passwords.

## What's Implemented (as of Feb 2026 fork)

### Frontend (live in preview)
- Landing, Register, Login, Dashboard (with mining + 3-ad daily reward)
- Wallet (balance + transactions list, Send/Receive/Swap with TGE alert)
- Referrals, Leaderboard, Profile, Admin Panel, About, Roadmap (7 phases)
- Legal pages: Terms, Privacy, Disclaimer
- Notification bell with unread badge
- 3D PNRP coin logos
- **NEW (this session)**:
  - Profile "Total Mined PNRP" coin logo removed (lighter card)
  - LandingPage hero: first PNRP mention expanded to "PNRP (Platinum Network Reward Point)"
  - Dashboard balance box: subtitle "Platinum Network Reward Point" + tooltip
  - PNRP `title` tooltips on hero/balance

### Backend
**Old (Python/FastAPI)** - still running in preview:
- /api/auth/register, /login, /me
- /api/mining/status, /start, /claim, /watch-ad
- /api/daily-reward/status, /watch-ad
- /api/social-tasks (+ /complete)
- /api/referrals, /api/wallet, /api/leaderboard
- /api/admin/stats, /api/admin/users

**NEW (Pure PHP)** - in `/tmp/php-backend/` and zipped at `/app/platinum-network-cpanel.zip`:
- Same endpoints, identical JSON shapes
- Files: `index.php` (router), `.htaccess`, `config.php`, `database.php`, `helpers.php`, `request.php`
- API: `api/auth.php`, `mining.php`, `daily_rewards.php`, `wallet.php`, `referrals.php`, `leaderboard.php`, `social_tasks.php`, `admin.php`
- JWT HS256 hand-rolled (no Composer needed)
- bcrypt with passlib `$2b$` → `$2y$` auto conversion
- Tested locally against MariaDB (all 13 endpoints verified working)

## Final Deliverables
- **Zip**: `/app/platinum-network-cpanel.zip` (160 KB) containing:
  - `frontend-build/` - React production build with relative API paths + SPA `.htaccess`
  - `php-backend/` - PHP API ready for `public_html/api/`
  - `MYSQL_TABLE_SCHEMAS.sql` - DB schema (without `unique_user_date` constraint)
  - `README.md` - cPanel deployment guide

## Backlog / Roadmap

### P1 (Next)
- KYC system: Aadhar/PAN upload + admin verification
- Withdrawal request system (post-TGE flow)
- Contact Us page (helps AdSense approval)

### P2 (Future)
- Capacitor / PWA wrapper for Android APK
- Google AdSense ad-slot injection
- Email verification on signup
- Password reset flow
- Push notifications

### Known issues
- Notifications are **MOCKED** client-side (no backend persistence)
- Ads are **MOCKED** with a 10s timer (no real ad SDK)
- TGE / withdrawal is locked until phase 3

## Test Credentials
See `/app/memory/test_credentials.md`

## Architecture Notes
- Both Python and PHP backends share the same MySQL schema
- Frontend code is unchanged between the two backends — same JSON shapes
- For cPanel: deploy zip → run SQL → edit `config.php` → done
- For Emergent preview: keep using Python FastAPI
