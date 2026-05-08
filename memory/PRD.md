# Platinum Network - Product Requirements Document

## Original Problem Statement
Mining website with APK (like ARC ASTRA). Name: Platinum Network. Reward Points: PNRP. 12-hour mining base, 24-hour boost via ads. Daily reward streak (3 ads/day = 15+25+40 PNRP). Social tasks. Auto-logout after 7 days inactivity. Leaderboard. Withdrawal at TGE after KYC. Referral signup. **Backend rewritten in pure PHP for cPanel shared hosting**.

## User Personas
- **Miner**: Daily user; mines, watches ads, completes tasks, refers friends.
- **Admin**: Reviews KYC, monitors stats, approves withdrawals (post-TGE).

## Core Requirements
1. 12h base mining → 24h with 2 time-boost ads
2. 5 speed-boost ads → 2x speed multiplier
3. Daily reward = 3 ads/day (15, 25, 40 PNRP)
4. 10% referral commission forever
5. Social tasks (Telegram/Twitter/YouTube/Instagram/Discord) - 30 PNRP each
6. Leaderboard, Profile, Admin Panel
7. Auto-logout after 7 days inactivity
8. KYC + TGE withdrawal (Phase 3, future)
9. PWA / APK wrap (future)
10. AdSense-ready public pages

## Tech Stack
- **Frontend**: React 19 + Tailwind + Shadcn UI
- **Backend (cPanel)**: **Pure PHP 7.4+** (PDO, hand-rolled JWT HS256, no Composer)
- **Backend (preview)**: FastAPI + MySQL (kept for Emergent dev)
- **DB**: MySQL/MariaDB

## Implemented Features

### Frontend
**Authenticated pages** (in Layout): Dashboard, Wallet, Referrals, SocialTasks, Leaderboard, Profile, AdminPanel, About, Roadmap
**Public pages** (no auth required, accessible to AdSense crawlers):
- Landing (with PNRP first-mention expansion)
- **Contact Us** (form + company info + FAQ + social links) — NEW
- **Blog** (5 SEO articles + detail pages: PNRP intro, max earnings tips, TGE explained, referrals, security) — NEW
- Terms, Privacy, Disclaimer
- Login, Register

**Recent UI fixes**:
- Profile "Total Mined PNRP" coin logo removed
- LandingPage hero: "PNRP (Platinum Network Reward Point)" first-mention expansion
- Dashboard balance: subtitle + tooltip
- Footer with Blog/Contact/Terms/Privacy/Disclaimer links
- Layout null-safe — guests can browse public pages

### Backend (Pure PHP — fully tested locally)
13 endpoints in `/tmp/php-backend/`:
- `/api/auth/{register,login,me}`
- `/api/mining/{status,start,claim,watch-ad}`
- `/api/daily-reward/{status,watch-ad}`
- `/api/wallet`, `/api/referrals`, `/api/leaderboard`
- `/api/social-tasks`, `/api/social-tasks/{id}/complete`
- `/api/admin/{stats,users}`

Files: `index.php` (router), `.htaccess`, `config.php`, `database.php`, `helpers.php`, `request.php`, plus 8 API class files.

### Final Deliverable
**`/app/platinum-network-cpanel.zip`** (167 KB, 30 files):
- `frontend-build/` — React production build (relative `/api`) + SPA `.htaccess`
- `php-backend/` — full PHP API
- `MYSQL_TABLE_SCHEMAS.sql` (no `unique_user_date` constraint)
- `README.md` — cPanel deployment guide

Tested: PHP 8.2 + MariaDB locally, all endpoints return correct JSON.

## Backlog / Roadmap

### P1 (Next)
- KYC system: Aadhar/PAN upload + admin verification
- Withdrawal request system (TGE flow)
- Real notifications backend (currently MOCKED in Layout)

### P2 (Future)
- Capacitor / PWA → Android APK
- Google AdSense ad-slot injection
- Email verification, password reset
- Push notifications
- Real ad SDK integration (ads currently MOCKED with 10s timer)

## Test Credentials
See `/app/memory/test_credentials.md`.

## Mocked / Pending
- **MOCKED**: Notifications (Layout state, no DB)
- **MOCKED**: Ad watching (10-second timer)
- TGE / withdrawal locked until Phase 3

## Architecture Notes
- Both Python and PHP backends share the same MySQL schema
- Frontend is unchanged between backends — same JSON shapes
- For cPanel: deploy zip → run SQL → edit `config.php` → done
- For Emergent preview: Python FastAPI on supervisor
