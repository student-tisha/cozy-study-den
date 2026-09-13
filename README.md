# Cozy Study Den 🌿

A gamified productivity app that turns your daily tasks into quests. Complete quests to earn XP, level up, build streaks, grow your attributes, and spend coins in the shop.

## Features

- Secure authentication (signup/login) with Supabase Auth
- Task ("Quest") management: create, complete, delete
- Non-linear XP and leveling system
- Daily streak tracking
- Attribute leveling (tasks contribute XP to specific stats like Focus, Intellect, Wellness)
- In-app currency and shop for cosmetic items
- Row-Level Security: users can only access their own data
- Fully responsive, accessible UI with keyboard navigation support

## Tech Stack

- **Frontend/Backend:** Next.js (App Router)
- **Database & Auth:** Supabase (PostgreSQL + Auth + Row Level Security)
- **Styling:** Custom CSS with cozy theme variables
- **Hosting:** Vercel

## Live Demo

[cozy-study-den.vercel.app](https://cozy-study-den.vercel.app/)

## Demo Video

[Watch the walkthrough](https://drive.google.com/file/d/1H4mYW7W4rTxEMtZ0TlNWdXVKIw1a--mB/view?usp=drive_link)

## Setup Instructions

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/student-tisha/cozy-study-den.git
cd cozy-study-den
\`\`\`

### 2. Install dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Set up Supabase
- Create a project at [supabase.com](https://supabase.com)
- In the SQL Editor or Table Editor, create four tables: `profiles`, `tasks`, `attributes`, `inventory` (see schema below)
- Enable Row Level Security on all tables with policies restricting access to `auth.uid() = user_id` (or `= id` for `profiles`)

### 4. Configure environment variables
Copy `.env.example` to `.env.local` and fill in your Supabase credentials:
\`\`\`bash
cp .env.example .env.local
\`\`\`
\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_publishable_key
\`\`\`

### 5. Run the development server
\`\`\`bash
npm run dev
\`\`\`
Open [http://localhost:3000](http://localhost:3000)

## Database Schema

**profiles** — id (uuid, FK to auth.users), username, level, xp, currency, streak_count, last_active_date

**tasks** — id, user_id (FK), title, attribute, xp_value, is_completed, completed_at

**attributes** — id, user_id (FK), attribute_name, attribute_level, attribute_xp

**inventory** — id, user_id (FK), item_name, item_type, purchased_at

## Team

- Tisha
- Dipan
- Sankur

Built for Tech Zephyr 4.0 Hackathon.