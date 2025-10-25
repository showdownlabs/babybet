# Internationalization (i18n) Implementation

## Overview
The Baby Bet app now supports English and Spanish languages using `next-intl` for Next.js App Router.

## Features Implemented

### 1. Automatic Language Detection
- The app automatically detects the user's preferred language based on their browser's `Accept-Language` header
- When users share links via WhatsApp, their browser will open the correct language version automatically
- No IP-based detection needed - browser language detection works seamlessly

### 2. Supported Languages
- **English (en)** - Default language
- **Spanish (es)** - Full translation for Mexican Spanish speakers

### 3. Manual Language Switching
- Language switcher in the top-right corner of every page
- Users can toggle between EN and ES at any time
- Language preference persists across navigation

## Technical Implementation

### URL Structure
All user-facing routes now include a locale prefix:
- English: `/en/` (e.g., `/en/ruiz`)
- Spanish: `/es/` (e.g., `/es/ruiz`)

### File Structure
```
app/
├── [locale]/              # Localized routes
│   ├── layout.tsx         # Layout with NextIntl provider
│   ├── page.tsx           # Home page
│   ├── [baby_slug]/       # Baby-specific pages
│   │   └── page.tsx
│   └── rules/             # Rules page
│       └── page.tsx
├── admin/                 # Non-localized (admin only)
├── api/                   # Non-localized (API routes)
└── auth/                  # Non-localized (auth callbacks)

i18n/
└── request.ts             # i18n configuration

messages/
├── en.json                # English translations
└── es.json                # Spanish translations

components/
└── LanguageSwitcher.tsx   # Language toggle component
```

### Translation Coverage

All user-facing content is translated:
- ✅ Home page (baby selection)
- ✅ Baby bet page
- ✅ Rules/How It Works page
- ✅ Bet forms (guest and authenticated)
- ✅ Date carousel
- ✅ Success messages
- ✅ Payment options

## How It Works

### For Users Sharing Links
1. You share a link: `https://yourdomain.com/en/ruiz`
2. When your Mexican family opens it, the middleware detects Spanish in their browser
3. They're automatically redirected to: `https://yourdomain.com/es/ruiz`
4. They see everything in Spanish!

### For Development
1. All translations are in `messages/en.json` and `messages/es.json`
2. Use translation keys in components:
   ```tsx
   const t = useTranslations('namespace')
   return <h1>{t('title')}</h1>
   ```
3. Server components use `getTranslations()` instead of `useTranslations()`

### Adding New Translations
1. Add the English text to `messages/en.json`
2. Add the Spanish translation to `messages/es.json`
3. Use the translation key in your component

Example:
```json
// messages/en.json
{
  "common": {
    "welcome": "Welcome"
  }
}

// messages/es.json
{
  "common": {
    "welcome": "Bienvenido"
  }
}
```

```tsx
// In component
const t = useTranslations('common')
<h1>{t('welcome')}</h1>
```

## Middleware Configuration

The middleware handles:
1. **i18n routing** - Adds locale prefix to URLs
2. **Supabase auth** - Maintains authentication state
3. **Language detection** - Automatically redirects based on browser language

## Testing

To test different languages:
1. Change browser language settings
2. Or manually navigate to `/en/` or `/es/` routes
3. Use the language switcher in the UI

## Admin Routes

Admin routes (`/admin`) remain non-localized as they're internal-facing only.

## API Routes

API routes (`/api/*`) remain non-localized as they're system routes.

## Future Enhancements

Possible additions:
- Add more languages (French, Portuguese, etc.)
- Localized date formats per region
- Currency localization (if needed)
- Admin interface translation (if needed)

