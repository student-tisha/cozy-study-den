# Cozy Study Den

A gamified task tracker: complete daily tasks ("quests"), keep your streak
alive, and level up. Earn coins per completed task and spend them in the
shop on cosmetic items.

## Tech stack

- **Next.js (App Router)** — `app/` directory
- **Supabase** — Postgres DB, auth (`supabase.auth`), row-level security
- **Framer Motion** — level-up celebration animation
- **Tailwind v4** — via `@import "tailwindcss"` in `app/globals.css`; cozy
  pastel theme tokens live alongside it as CSS variables

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in your Supabase project values
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Data model (Supabase tables)

- `profiles` — id, username, level, xp, currency, streak_count, last_active_date
- `tasks` — id, user_id, title, attribute, xp_value, is_completed, completed_at
- `attributes` — id, user_id, attribute_name, attribute_level, attribute_xp
- `inventory` — id, user_id, item_name, item_type

## Project structure

```
app/
  login/page.js        Login screen (Supabase auth.signInWithPassword)
  signup/page.js        Signup screen (Supabase auth.signUp + profile row)
  dashboard/page.js    Profile summary, attributes
  tasks/page.js         Quest list, XP/streak logic, level-up trigger
  shop/page.js           Currency + inventory, cosmetic purchases
components/
  AuthField.jsx          Shared labeled input for login/signup
  LevelUpCelebration.jsx  Reusable Framer Motion level-up modal
lib/
  supabaseClient.js      Supabase client init
  gameLogic.js             Pure XP/leveling and streak functions
```

## Team

| Person | Area |
|---|---|
| Tisha | Backend, DB schema, auth, XP/streak logic (`lib/gameLogic.js`, Supabase wiring) |
| Sankur | Frontend core (dashboard, task list), currency/shop backend logic |
| Dipan | Login/signup + shop UI polish, level-up animation, accessibility, docs |

## Accessibility

- All form inputs have associated `<label>` elements.
- Errors and shop feedback are announced via `aria-live` regions instead of
  blocking `alert()` popups.
- The level-up modal traps focus, is dismissible with `Escape`, uses
  `role="dialog"` + `aria-modal`, and respects `prefers-reduced-motion`.
- All interactive elements get a visible focus ring (`.cozy-focusable` in
  `globals.css`) for keyboard navigation.

## Demo video

90–180s walkthrough: login/signup → complete a quest → level-up animation →
shop purchase.
