# 🚀 Quick Start — Baby Bet MVP

Get up and running in under 10 minutes.

---

## Prerequisites

- Node.js 18+ installed
- A [Supabase](https://supabase.com) account (free)
- A Venmo account

---

## 1. Install Dependencies

```bash
npm install
```

---

## 2. Setup Supabase Database

### Create Project
1. Go to [supabase.com](https://supabase.com) → New Project
2. Wait for setup to complete (~2 minutes)

### Run Schema
1. Open **SQL Editor** in Supabase dashboard
2. Copy/paste contents of `supabase/schema.sql`
3. Click **Run**
4. Verify table exists: **Table Editor** → `guesses`

### Get API Keys
1. Go to **Settings → API**
2. Copy these values (you'll need them next):
   - **Project URL**: `https://xxxxx.supabase.co`
   - **service_role key**: `eyJhbG...` (secret!)

---

## 3. Configure Environment

Create `.env.local` in project root:

```bash
# Paste your Supabase URL and keys
NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbG..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbG..."

# Event configuration
DUE_DATE="2025-02-25"
WINDOW_START="2025-02-15"
WINDOW_END="2025-03-10"

# Your Venmo handle
VENMO_RECIPIENT="@your-venmo-handle"
VENMO_AMOUNT="5"
VENMO_NOTE_TEMPLATE="Baby Bet — {name} — {date} — {code} — Due {dueDate}"

# Choose a secure admin password
ADMIN_PASSCODE="your-secret-password"
SESSION_TTL_HOURS="8"
```

**Important**: Replace placeholder values with your actual credentials!

---

## 4. Run Development Server

```bash
npm run dev
```

Visit: [http://localhost:3000](http://localhost:3000)

---

## 5. Test It Out

### Test Guest Flow
1. Go to [http://localhost:3000](http://localhost:3000)
2. Enter name: "Test User"
3. Pick a date within your window
4. Click "Place bet & Venmo"
5. Should redirect to Venmo (may not work on desktop)

### Verify Database
1. Go to Supabase → **Table Editor** → `guesses`
2. You should see your test submission with a code like `TU-A8K2`

### Test Admin Panel
1. Go to [http://localhost:3000/admin](http://localhost:3000/admin)
2. Enter your `ADMIN_PASSCODE`
3. Click "Enter" then **reload the page**
4. You should see your test submission
5. Try clicking "Mark paid"
6. Click "Export CSV" to download data

---

## 6. Deploy to Vercel (Optional)

### Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/babybet.git
git push -u origin main
```

### Deploy
1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repo
3. Add **all** environment variables from `.env.local`
4. Click **Deploy**
5. Wait ~2 minutes for build
6. Copy your production URL (e.g., `babybet.vercel.app`)

### Generate QR Code
1. Use [qr-code-generator.com](https://www.qr-code-generator.com/)
2. Paste your Vercel URL
3. Download PNG
4. Print for the baby shower!

---

## 🎉 You're Done!

The app is now ready for your baby shower event. 

### Mobile Testing
**Critical**: Test the Venmo redirect on a real mobile device before the event:
- iOS: Test in Safari
- Android: Test in Chrome
- Make sure Venmo app is installed

---

## Common Issues

### "Missing env: XXX"
→ Check `.env.local` has all required variables

### Admin passcode doesn't work
→ Reload page after entering passcode

### Venmo doesn't open
→ Must test on mobile device with Venmo app installed

---

## Next Steps

- Read `README.md` for full documentation
- See `docs/SETUP.md` for detailed deployment guide
- Check `docs/VERIFICATION.md` for complete testing checklist
- Browse `docs/` for all documentation

**Need help?** Check the troubleshooting sections in README.md and docs/SETUP.md.

Good luck with your baby shower! 🍼

