# 🔧 Docker Build Fixes Applied

This document summarizes the fixes applied to make the Docker build work successfully.

---

## Issues Encountered & Solutions

### 1. Missing package-lock.json ❌ → ✅

**Error:**
```
npm ci can only install with an existing package-lock.json
```

**Solution:**
```bash
npm install
```

This generated the `package-lock.json` file (75KB) which is required for reproducible builds in Docker.

---

### 2. Server Action Type Errors ❌ → ✅

**Error:**
```
Type error: "createGuess" is not a valid Page export field.
```

**Root Cause:** Next.js pages cannot export server actions directly.

**Solution:** Removed `export` keyword from server actions:
- `app/page.tsx`: Changed `export async function createGuess` to `async function createGuess`
- Similar fix applied to other server actions

---

### 3. Server Action Signature Mismatch ❌ → ✅

**Error:**
```
Type '(_: any, formData: FormData) => Promise<void>' is not assignable to form action type
```

**Root Cause:** Server actions used in `<form action={}>` should only take `formData` as parameter, not a state parameter.

**Solution:**
- `components/AdminTable.tsx`: Changed `async function markPaid(_: any, formData: FormData)` to `async function markPaid(formData: FormData)`
- `components/PasscodeGate.tsx`: Similar fix

Note: The state parameter is only needed when using `useFormState` in client components (like `GuessForm.tsx`).

---

### 4. Missing TypeScript Types ❌ → ✅

**Error:**
```
Could not find a declaration file for module 'react-dom'
```

**Solution:**
```bash
npm install --save-dev @types/react-dom@18.2.25
```

Added missing TypeScript types for `react-dom` with correct version (React 18 compatible).

---

### 5. Build-Time Environment Variable Errors ❌ → ✅

**Error:**
```
Error: Missing env: SUPABASE_SERVICE_ROLE_KEY
```

**Root Cause:** Next.js tried to evaluate server-side code during build time when environment variables weren't available yet.

**Solution:** Made config loading lazy using a Proxy:

```typescript
// lib/config.ts - Before
export const config = {
  supabaseServiceRole: required('SUPABASE_SERVICE_ROLE_KEY'),
  // ... other vars evaluated immediately
}

// After
export const config = new Proxy({} as ReturnType<typeof getConfig>, {
  get(_target, prop) {
    if (!_config) {
      _config = getConfig() // Only evaluated when accessed
    }
    return _config[prop as keyof ReturnType<typeof getConfig>]
  }
})
```

This defers environment variable validation until runtime.

---

### 6. Static Generation with Missing Env Vars ❌ → ✅

**Error:** Pages tried to statically generate during build without env vars.

**Solution:** Marked pages as dynamic:

```typescript
// app/page.tsx and app/admin/page.tsx
export const dynamic = 'force-dynamic'
```

This tells Next.js to always server-render these pages, avoiding static generation.

---

### 7. Missing public Directory ❌ → ✅

**Error:**
```
"/app/public": not found
```

**Solution:**
```bash
mkdir -p public
touch public/.gitkeep
```

Created the `public` directory that Next.js expects.

---

## Final Build Result ✅

```
Route (app)                              Size     First Load JS
┌ ƒ /                                    854 B          88.1 kB
├ ○ /_not-found                          873 B          88.1 kB
├ ƒ /admin                               136 B          87.4 kB
└ ƒ /api/export                          0 B                0 B
+ First Load JS shared by all            87.2 kB

ƒ  (Dynamic)  server-rendered on demand
```

**Docker Image:** `babybet-app:latest` (~240MB)

---

## Files Modified

1. `package.json` → Added `@types/react-dom`
2. `package-lock.json` → Generated
3. `app/page.tsx` → Removed `export` from server action, added `dynamic = 'force-dynamic'`
4. `app/admin/page.tsx` → Added `dynamic = 'force-dynamic'`, removed `@ts-expect-error`
5. `components/AdminTable.tsx` → Fixed server action signature
6. `components/PasscodeGate.tsx` → Fixed server action signature
7. `lib/config.ts` → Made config loading lazy with Proxy
8. `public/.gitkeep` → Created public directory

---

## How to Build & Run

### Build Docker Image
```bash
docker-compose build
```

### Run Container (requires .env file)
```bash
# Make sure .env is configured first!
docker-compose up -d
```

### View Logs
```bash
docker-compose logs -f app
```

### Stop Container
```bash
docker-compose down
```

---

## Environment Variables Reminder

Before running the Docker container, make sure your `.env` file has:

```bash
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."
SUPABASE_SERVICE_ROLE_KEY="eyJ..."
DUE_DATE="2025-02-25"
WINDOW_START="2025-02-15"
WINDOW_END="2025-03-10"
VENMO_RECIPIENT="@your-handle"
VENMO_AMOUNT="5"
VENMO_NOTE_TEMPLATE="Baby Bet — {name} — {date} — {code} — Due {dueDate}"
ADMIN_PASSCODE="your-password"
SESSION_TTL_HOURS="8"
```

---

## Next Steps

✅ Docker build works  
✅ Image is optimized (~240MB)  
⏭️ Configure `.env` with real credentials  
⏭️ Test locally: `docker-compose up -d`  
⏭️ Deploy to production (AWS, GCP, Fly.io, etc.)  

See `DOCKER.md` for production deployment guides!

---

**All Docker issues resolved!** 🐳✅

