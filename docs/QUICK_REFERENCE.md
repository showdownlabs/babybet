# 📝 Quick Reference Card

Keep this handy during setup and the event.

---

## 🚀 Essential Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

---

## 🌐 Local URLs

- **Guest form**: http://localhost:3000
- **Admin dashboard**: http://localhost:3000/admin
- **CSV export**: http://localhost:3000/api/export

---

## 📦 Production URLs (after Vercel deploy)

- **Guest form**: https://YOUR-APP.vercel.app
- **Admin dashboard**: https://YOUR-APP.vercel.app/admin
- **CSV export**: https://YOUR-APP.vercel.app/api/export

---

## 🔑 Required Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."
SUPABASE_SERVICE_ROLE_KEY="eyJ..."
DUE_DATE="2025-02-25"
WINDOW_START="2025-02-15"
WINDOW_END="2025-03-10"
VENMO_RECIPIENT="@yourhandle"
VENMO_AMOUNT="5"
VENMO_NOTE_TEMPLATE="Baby Bet — {name} — {date} — {code} — Due {dueDate}"
ADMIN_PASSCODE="your-password"
SESSION_TTL_HOURS="8"
```

---

## 📋 Pre-Event Checklist

- [ ] `npm install` completed
- [ ] Supabase project created
- [ ] `schema.sql` executed
- [ ] `.env.local` configured
- [ ] Local testing passed
- [ ] Deployed to Vercel
- [ ] Production env vars added
- [ ] Mobile testing (iOS + Android)
- [ ] QR code generated and printed
- [ ] Admin passcode verified

---

## 🧪 Quick Tests

### Guest Flow Test
1. Go to landing page
2. Enter name: "Test User"
3. Pick date: 2025-02-20
4. Submit
5. Should redirect to Venmo

### Admin Flow Test
1. Go to /admin
2. Enter passcode
3. Reload page
4. Should see table
5. Toggle "Mark paid"
6. Download CSV

---

## 🔧 Troubleshooting Quick Fixes

| Issue | Solution |
|-------|----------|
| "Missing env: XXX" | Check all env vars in `.env.local` |
| Admin passcode fails | Reload page after entering |
| Venmo doesn't open | Test on mobile with app installed |
| Build fails | Run `npm install` again |
| Table empty | Check Supabase table editor |
| CSV 401 error | Re-login to admin |

---

## 📱 Venmo Note Template

Default template:
```
Baby Bet — {name} — {date} — {code} — Due {dueDate}
```

Example result:
```
Baby Bet — John Doe — 2025-02-20 — JD-7K3M — Due 2025-02-25
```

The `{code}` is the verification code for matching payments.

---

## 🎯 During Event

### Guest Support
- Point guests to QR code
- Confirm they see form on mobile
- Help with date picker if needed
- Show them the Venmo redirect

### Admin Tasks
- Keep laptop/tablet with admin panel open
- Monitor submissions in real-time (refresh page)
- Check Venmo app for incoming payments
- Match verification codes to payments
- Toggle "Mark paid" as payments arrive

### After Event
1. Export CSV for records
2. Verify all payments received
3. Mark remaining payments as paid
4. Announce winner!

---

## 📊 Reconciliation Process

1. Open admin dashboard
2. Open Venmo app on phone
3. For each Venmo payment:
   - Find verification code in note (e.g., "JD-7K3M")
   - Search admin table for matching code
   - Click "Mark paid" for that row
4. Export final CSV
5. Calculate winner (closest date to actual birth)

---

## 🆘 Emergency Contacts

- **Next.js Docs**: https://nextjs.org/docs
- **Supabase Docs**: https://supabase.com/docs
- **Vercel Support**: https://vercel.com/help
- **Tailwind Docs**: https://tailwindcss.com/docs

---

## 💾 Backup Plan

If production goes down:

1. **Fallback**: Share Venmo link directly
2. **Manual tracking**: Google Sheet with name + date + code
3. **Recovery**: Check Supabase data (persists independently)
4. **Redeploy**: Push to Vercel (takes ~2 minutes)

---

## 🎉 Success Metrics

- [ ] All guests submitted guesses
- [ ] All payments received (or tracked)
- [ ] Zero technical issues during event
- [ ] Admin reconciliation completed
- [ ] Winner announced
- [ ] Everyone had fun! 🍼

---

## 📖 Documentation Index

- **QUICKSTART.md** - 10-minute setup guide
- **SETUP.md** - Detailed setup + troubleshooting
- **README.md** - Complete documentation
- **VERIFICATION.md** - Testing checklist
- **IMPLEMENTATION_SUMMARY.md** - What was built

---

## ⚡ Most Common Commands

```bash
# Start development
npm run dev

# Check Supabase connection
# (Visit /admin and try logging in)

# Deploy to Vercel
git add . && git commit -m "Update" && git push

# View production logs
# (Vercel dashboard → Project → Logs)
```

---

**Print this page and keep it handy during the event!** 🎉

