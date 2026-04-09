# LEY Beauty — Luxury Braiding Salon Website

A complete, production-ready website for **LEY Beauty**, a luxury braiding salon in Okinawa, Japan.

Built with Next.js 14 (App Router), Supabase, Tailwind CSS, and Resend.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router, TypeScript) |
| Database | Supabase (PostgreSQL + Row Level Security) |
| Auth | Supabase (service role for admin APIs) |
| Emails | Resend |
| Styling | Tailwind CSS (custom design tokens) |
| Deployment | Vercel |

---

## Project Structure

```
ley-beauty/
├── app/
│   ├── layout.tsx               # Root layout + fonts
│   ├── page.tsx                 # Home page (all sections)
│   ├── globals.css              # Brand styles + animations
│   ├── booking/
│   │   └── page.tsx             # Public booking page
│   ├── admin/
│   │   └── dashboard/
│   │       └── page.tsx         # Password-protected admin dashboard
│   └── api/
│       ├── admin/auth/route.ts  # Admin password verification
│       ├── bookings/
│       │   ├── route.ts         # GET (admin) + POST (create booking)
│       │   └── [id]/
│       │       ├── accept/route.ts   # Accept booking + send email
│       │       └── decline/route.ts  # Decline + free slot
│       └── slots/
│           ├── route.ts         # GET (public) + POST (admin create)
│           └── [id]/route.ts    # DELETE slot
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── BookingCalendar.tsx      # Custom calendar (no external libs)
│   ├── SlotGrid.tsx             # Time slot cards (green/red states)
│   ├── BookingForm.tsx          # Booking form with validation
│   ├── AcceptButton.tsx         # Admin action button with loading state
│   ├── ServiceCard.tsx          # Service card with gold hover border
│   ├── TestimonialCard.tsx      # Client review card with gold stars
│   ├── AdminSlotManager.tsx     # Admin slot management interface
│   └── GeometricPattern.tsx    # SVG decorative background
├── lib/
│   ├── supabase.ts              # Public Supabase client
│   ├── supabase-admin.ts        # Service role Supabase client
│   └── emails.ts               # Resend email templates
├── types/
│   └── index.ts                 # TypeScript interfaces + SERVICES const
├── schema.sql                   # Complete Supabase SQL schema
└── .env.local.example           # Environment variables template
```

---

## Quick Start

### 1. Clone & Install

```bash
git clone <your-repo>
cd ley-beauty
npm install
```

### 2. Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Open the **SQL Editor** and run `schema.sql` (included in root)
3. Copy your project URL, anon key, and service role key from **Settings → API**

### 3. Resend Setup

1. Create an account at [resend.com](https://resend.com)
2. Add and verify your domain (e.g. `leybeauty.jp`)
3. Generate an API key

### 4. Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your values:

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

RESEND_API_KEY=re_your_key

ADMIN_EMAIL=hello@leybeauty.jp
ADMIN_PASSWORD=your_secure_password

NEXT_PUBLIC_URL=https://leybeauty.jp
PAYMENT_BANK_ACCOUNT=Japan Post Bank / Account: 12345-67890
BOOKING_CURRENCY=JPY
```

### 5. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deploying to Vercel

### Option A — Vercel CLI

```bash
npm i -g vercel
vercel
```

Follow the prompts. Then add environment variables:

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add RESEND_API_KEY
vercel env add ADMIN_EMAIL
vercel env add ADMIN_PASSWORD
vercel env add NEXT_PUBLIC_URL
vercel env add PAYMENT_BANK_ACCOUNT
vercel env add BOOKING_CURRENCY
```

Then deploy to production:

```bash
vercel --prod
```

### Option B — Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new) → import your repository
3. In **Environment Variables**, add all variables from `.env.local.example`
4. Click **Deploy**

---

## Pages

| URL | Description |
|---|---|
| `/` | Home page — hero, services, why us, gallery, testimonials |
| `/booking` | Booking flow — calendar → slots → form |
| `/admin/dashboard` | Password-protected admin panel |

---

## Admin Dashboard Features

- **Pending Requests** — view, accept, or decline bookings
- **Manage Availability** — add/remove time slots by date
- **Booking History** — filterable table of all past bookings

**Default admin password:** `LeyBeauty2025!` (change via `ADMIN_PASSWORD` env var)

---

## Email Flows

### Admin Notification (on new booking)
- Subject: `✨ New Appointment Request – [Client Name]`
- Sent to: `ADMIN_EMAIL`
- Contains: client details + link to dashboard

### Client Confirmation (on admin accept)
- Subject: `Your appointment at LEY Beauty is confirmed!`
- Sent to: client's email
- Contains: appointment details, price, bank transfer instructions, 48h payment deadline

---

## Services & Pricing

| Service | Duration | Price |
|---|---|---|
| Box Braids | 3h | ¥12,000 |
| Knotless Braids | 4h | ¥15,000 |
| Cornrows | 1h30 | ¥7,000 |
| Senegalese Twists | 3h30 | ¥13,500 |
| Fulani Braids | 2h | ¥9,500 |
| Goddess Braids | 2h30 | ¥11,000 |

To update prices/services, edit `types/index.ts` → `SERVICES` array.

---

## Supabase RLS Policies

The schema includes Row Level Security policies:

- **slots**: Public read, service role write
- **bookings**: Service role full access, public insert

All server-side API routes use the **service role key** (bypasses RLS) — never exposed client-side.

---

## Brand Design System

| Token | Value |
|---|---|
| `obsidian` | `#080B0F` — background |
| `gold` | `#C8952A` — primary accent |
| `sand` | `#EDE5D0` — body text |
| `coral` | `#C4593A` — secondary accent |
| `sage` | `#6B8F71` — available state |
| Font (headings) | Cormorant Garamond |
| Font (body) | DM Sans |

---

## License

© 2025 LEY Beauty. All rights reserved.
