# Setup Guide — Baby Bet MVP

Quick reference for getting the app running locally and deploying to production.

---

## Local Development Setup (5 minutes)

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Configure Supabase

1. Create a free account at [supabase.com](https://supabase.com)
2. Click "New Project"
3. Once created, go to **SQL Editor** → New Query
4. Copy-paste the entire contents of `supabase/schema.sql`
5. Click **Run** to create the `guesses` table

### Step 3: Get Supabase Credentials

1. In Supabase dashboard, go to **Settings → API**
2. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key (starts with `eyJ...`)
   - **service_role** key (starts with `eyJ...`) ⚠️ **Keep this secret!**

### Step 4: Create `.env.local`

Create a file named `.env.local` in the project root and add:

```bash
# Supabase (from Step 3)
NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbG..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbG..."

# Event dates (adjust as needed)
DUE_DATE="2025-02-25"
WINDOW_START="2025-02-15"
WINDOW_END="2025-03-10"

# Venmo (your Venmo handle)
VENMO_RECIPIENT="@your-venmo-handle"
VENMO_AMOUNT="5"
VENMO_NOTE_TEMPLATE="Baby Bet — {name} — {date} — {code} — Due {dueDate}"

# Admin access
ADMIN_PASSCODE="your-secret-password"
SESSION_TTL_HOURS="8"
```

### Step 5: Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## Testing Locally

1. **Test Guest Flow**:
   - Go to [http://localhost:3000](http://localhost:3000)
   - Enter a name and pick a date
   - Submit → should redirect to Venmo (may not work in desktop browser)
   - Check Supabase dashboard → Table Editor → `guesses` to see the new row

2. **Test Admin Dashboard**:
   - Go to [http://localhost:3000/admin](http://localhost:3000/admin)
   - Enter your `ADMIN_PASSCODE`
   - Click "Enter" then **reload the page**
   - Should see the table with all submissions
   - Try toggling "Mark paid" → check Supabase to verify `paid` updates

3. **Test CSV Export**:
   - In admin dashboard, click "Export CSV"
   - Should download a `guesses.csv` file

---

## Production Deployment (Vercel)

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Baby Bet MVP"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/babybet.git
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **Add New → Project**
3. Import your GitHub repository
4. In the **Environment Variables** section, add all variables from `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `DUE_DATE`
   - `WINDOW_START`
   - `WINDOW_END`
   - `VENMO_RECIPIENT`
   - `VENMO_AMOUNT`
   - `VENMO_NOTE_TEMPLATE`
   - `ADMIN_PASSCODE`
   - `SESSION_TTL_HOURS`
5. Click **Deploy**

### Step 3: Generate QR Code

1. Once deployed, copy your Vercel URL (e.g., `https://babybet.vercel.app`)
2. Use a QR code generator:
   - [qr-code-generator.com](https://www.qr-code-generator.com/)
   - [qrcode-monkey.com](https://www.qrcode-monkey.com/)
3. Paste your Vercel URL
4. Download the QR code image
5. Print it for the baby shower! 🎉

---

## Testing in Production

### Mobile Testing (Critical!)

The app is designed for mobile, especially Venmo deep links:

**iOS Safari**:
- Open the QR code or visit the URL
- Submit a guess
- Should attempt to open Venmo app
- If Venmo not installed, falls back to web version

**Android Chrome**:
- Same flow as iOS
- Venmo deep link behavior may vary by device

**Desktop Browser** (for admin only):
- Venmo redirect won't work properly (expected)
- Use for testing form validation and admin dashboard

---

## Troubleshooting

### "Missing env: XXX" Error

**Symptom**: Error message on page load  
**Fix**: Make sure ALL environment variables are set in `.env.local` (local) or Vercel dashboard (production)

### Admin Passcode Not Working

**Symptom**: Passcode form submits but still shows gate  
**Fix**: 
1. Make sure you **reload the page** after entering correct passcode
2. Clear browser cookies
3. Verify `ADMIN_PASSCODE` is set correctly (case-sensitive)

### Supabase Insert Fails

**Symptom**: "Could not save your guess" error  
**Fix**:
1. Check Supabase dashboard → Logs → API
2. Verify `SUPABASE_SERVICE_ROLE_KEY` is correct
3. Run `supabase/schema.sql` again if table is missing
4. Check RLS policies (MVP uses service-role, so policies don't apply)

### Venmo Redirect Doesn't Work

**Symptom**: After submit, nothing happens or web page opens instead of app  
**Fix**:
1. Make sure Venmo app is installed
2. Test on a real mobile device (deep links don't work in desktop browsers)
3. Verify `VENMO_RECIPIENT` is a valid Venmo username (starts with `@`)
4. Check that the HTTPS fallback link works (tap the "tap here" link)

### CSV Export Shows 401 Unauthorized

**Symptom**: CSV export fails or shows error  
**Fix**:
1. Make sure you're logged into admin (entered passcode and reloaded)
2. Check that cookies are enabled
3. Try logging in again

---

## Day-of-Event Checklist

- [ ] Deploy is live and working (test on mobile)
- [ ] QR code printed and displayed at venue
- [ ] Admin passcode works (test on your phone)
- [ ] Venmo deep link tested on both iOS and Android
- [ ] Test submission end-to-end (including checking Supabase)
- [ ] Have laptop/tablet ready for admin dashboard
- [ ] Know how to download CSV export
- [ ] Have Venmo app open to verify incoming payments

---

## Post-Event: Reconciling Payments

1. Log into admin dashboard
2. Review all submissions in the table
3. Open Venmo app and check your transactions
4. For each payment, find the verification code in the note
5. Match the code to a row in the admin table
6. Click "Mark paid" for verified payments
7. Export CSV for your records

---

## Support

- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)

Good luck with the baby shower! 🍼

