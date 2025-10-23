# 🍼 Baby Arrival Betting App — MVP

A focused, production-ready baby arrival betting app built with **Next.js 14 (App Router)**, **Supabase Postgres**, **Tailwind CSS**, and **Venmo deep links**. Features admin passcode gate, payment tracking, CSV export, and verification codes.

---

## Features

✅ **Guest Flow**: Simple form to enter name + guess date → auto-redirect to Venmo with pre-filled note  
✅ **Verification Codes**: Each submission gets a unique code (e.g., `AL-3FQ2`) included in Venmo note  
✅ **Admin Dashboard**: Password-protected page to view all guesses and toggle paid status  
✅ **CSV Export**: Download all submissions with payment status  
✅ **Mobile-First**: Optimized for iOS Safari and Android Chrome  
✅ **Secure**: Service-role credentials server-side only, RLS enabled, HttpOnly cookies  

---

## Quick Start

### 1. Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) account (free tier works)
- A Venmo account

### 2. Setup Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** in your Supabase dashboard
3. Copy the contents of `supabase/schema.sql` and run it
4. Go to **Settings → API** and copy:
   - Project URL
   - `anon` public key (optional for MVP)
   - `service_role` key (keep this secret!)

### 3. Configure Environment

Create a `.env.local` file in the project root:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://YOUR-PROJECT.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR-ANON-KEY"
SUPABASE_SERVICE_ROLE_KEY="YOUR-SERVICE-ROLE-KEY"

# Event config
DUE_DATE="2025-02-25"
WINDOW_START="2025-02-15"
WINDOW_END="2025-03-10"

# Venmo config
VENMO_RECIPIENT="@yourhandle"
VENMO_AMOUNT="5"
VENMO_NOTE_TEMPLATE="Baby Bet — {name} — {date} — {code} — Due {dueDate}"

# Admin
ADMIN_PASSCODE="your-secret-passcode"
SESSION_TTL_HOURS="8"
```

### 4. Install & Run

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## Deployment Options

### Option 1: Deploy to Vercel (Recommended for Quick Start)

1. Push your code to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Add all environment variables from `.env.local` to Vercel → Project Settings → Environment Variables
4. Deploy!
5. Generate a QR code pointing to your production URL for the baby shower

### Option 2: Deploy with Docker

The app includes full Docker support for flexible deployment on any platform (AWS, GCP, DigitalOcean, etc.).

**Quick Start**:
```bash
# Copy environment template
cp .env.example .env
# Edit .env with your credentials

# Build and run with Docker Compose
docker-compose up -d

# View at http://localhost:3000
```

**See `docs/DOCKER.md` for**:
- Detailed Docker deployment guide
- AWS ECS, Google Cloud Run, Fly.io examples
- Production best practices
- CI/CD integration

### QR Code Generation

Use any free QR code generator (e.g., [qr-code-generator.com](https://www.qr-code-generator.com/)) and point it to your production URL.

---

## Project Structure

```
.
├── app/
│   ├── layout.tsx              # Root layout with Tailwind
│   ├── globals.css             # Global styles
│   ├── page.tsx                # Landing page with guess form + server action
│   ├── admin/
│   │   └── page.tsx            # Admin dashboard (passcode-gated)
│   └── api/
│       └── export/route.ts     # CSV export route
├── components/
│   ├── GuessForm.tsx           # Client form with Venmo redirect logic
│   ├── PasscodeGate.tsx        # Admin passcode form
│   └── AdminTable.tsx          # Server-rendered table with paid toggles
├── lib/
│   ├── config.ts               # Environment variable parsing + admin auth
│   ├── supabaseServer.ts       # Supabase service-role client (server-only)
│   ├── utils.ts                # Helper functions (code gen, name clamping)
│   └── venmo.ts                # Venmo link builders
├── supabase/
│   └── schema.sql              # Database schema
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.mjs
```

---

## How It Works

### Guest Flow

1. User scans QR code → lands on home page
2. Enters name and picks a date (validated against `WINDOW_START` to `WINDOW_END`)
3. Submits form → server action:
   - Validates input
   - Generates verification code (initials + random chars)
   - Inserts row into Supabase `guesses` table
   - Returns Venmo deep link + web fallback
4. Client attempts Venmo deep link (`venmo://...`)
5. After 1.2s, falls back to HTTPS Venmo URL if deep link doesn't work

### Admin Flow

1. Admin visits `/admin`
2. Enters passcode → server sets HttpOnly cookie
3. Reload page → sees table of all guesses
4. Can toggle "Paid" status per row (updates `paid` and `paid_at` in DB)
5. Can download CSV export of all submissions

### Venmo Integration

- No webhook verification (MVP approach)
- Verification code in note allows manual reconciliation
- Admin manually marks payments as received after checking Venmo transactions

---

## Database Schema

**Table: `public.guesses`**

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key (auto-generated) |
| `name` | text | Guest name (1-64 chars) |
| `guess_date` | date | Their arrival date guess |
| `code` | text | Verification code (e.g., `AL-3FQ2`) |
| `created_at` | timestamptz | Submission timestamp |
| `paid` | boolean | Payment status (default: false) |
| `paid_at` | timestamptz | When marked as paid (nullable) |
| `payment_provider` | text | Reserved for future (nullable) |
| `payment_id` | text | Reserved for future (nullable) |

**Security**: Row Level Security (RLS) is enabled. MVP uses service-role key on server, so no anonymous policies needed.

---

## Configuration Reference

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ⚠️ | Anon key (optional for MVP) |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Service role key (server-only) |
| `DUE_DATE` | ✅ | Official due date (YYYY-MM-DD) |
| `WINDOW_START` | ✅ | Earliest allowed guess (YYYY-MM-DD) |
| `WINDOW_END` | ✅ | Latest allowed guess (YYYY-MM-DD) |
| `VENMO_RECIPIENT` | ✅ | Your Venmo handle (e.g., `@john-doe`) |
| `VENMO_AMOUNT` | ✅ | Bet amount in dollars (e.g., `5`) |
| `VENMO_NOTE_TEMPLATE` | ✅ | Template with placeholders (see below) |
| `ADMIN_PASSCODE` | ✅ | Admin access password |
| `SESSION_TTL_HOURS` | ⚠️ | Cookie expiry hours (default: 8) |

### Venmo Note Template Placeholders

- `{name}` → Guest's name
- `{date}` → Their guess date
- `{code}` → Generated verification code
- `{dueDate}` → Official due date from `DUE_DATE`

**Example**: `"Baby Bet — {name} — {date} — {code} — Due {dueDate}"`  
**Result**: `"Baby Bet — Alex Smith — 2025-02-20 — AS-7K3M — Due 2025-02-25"`

---

## Testing Checklist

- [ ] Valid submission creates DB row and redirects to Venmo
- [ ] Invalid inputs (empty name, out-of-range date) show inline errors
- [ ] Admin passcode gates access correctly
- [ ] Paid toggle updates database and sets `paid_at`
- [ ] CSV export downloads with proper comma/quote escaping
- [ ] Test on iOS Safari (Venmo deep link)
- [ ] Test on Android Chrome (Venmo deep link)
- [ ] Verify HTTPS fallback works if Venmo app not installed

---

## Future Enhancements (Post-MVP)

- Rate limiting per IP (prevent spam)
- Duplicate detection (same name + date)
- Webhook integration for Stripe/PayPal
- Real-time leaderboard
- Winner announcement page
- SMS/email notifications

---

## 📚 Documentation

- **[QUICKSTART.md](./docs/QUICKSTART.md)** - 10-minute setup guide
- **[docs/](docs/)** - Complete documentation
  - [Setup Guide](docs/SETUP.md) - Detailed setup with troubleshooting
  - [Verification](docs/VERIFICATION.md) - Testing checklist
  - [Docker Guide](docs/DOCKER.md) - Complete Docker deployment
  - [Quick Reference](docs/QUICK_REFERENCE.md) - Command reference
  - [More...](docs/README.md) - Full documentation index

## Troubleshooting

**Quick fixes** (see [docs/SETUP.md](docs/SETUP.md) for detailed troubleshooting):

- **"Missing env" error** → Check all env vars in `.env.local`
- **Venmo doesn't open** → Test on mobile with Venmo app installed
- **Admin passcode doesn't work** → Reload page after entering
- **Supabase insert fails** → Verify service role key and run `schema.sql`

---

## License

MIT

---

## Support

Built with ❤️ for baby showers. Questions? Open an issue or check the [Next.js](https://nextjs.org/docs) and [Supabase](https://supabase.com/docs) docs.

