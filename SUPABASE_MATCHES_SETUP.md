# Supabase Upcoming Matches - Implementation Guide

## Overview
This document describes the implementation of the Upcoming Matches feature using Supabase database.

## What Was Implemented

### 1. Database Types (`src/types/database.ts`)
Created TypeScript types that mirror your Supabase database schema:
- `Sport`, `Country`, `League`, `Competition`, `Team`
- `Match` and `MatchWithDetails` (includes related data)
- `Prediction`, `User`

### 2. Match Query Service (`src/lib/matches.ts`)
Created service functions to fetch match data from Supabase:

#### `getUpcomingMatches(limit?, sport?)`
- Fetches upcoming scheduled matches
- Includes team details (logos, names)
- Includes league/competition information
- Sorted by match date (ascending)
- Default: 12 matches, filtered by Football

#### `getMatchById(matchId)`
- Fetches a single match with all details
- Useful for match detail pages

#### `getMatchesByDateRange(startDate, endDate, limit?)`
- Fetches matches within a specific date range
- Useful for calendar views

### 3. UI Components

#### `UpcomingMatchCard` (`src/components/UpcomingMatchCard.tsx`)
Individual match card component displaying:
- League icon and name
- Home team logo and name
- Away team logo and name
- Match date and time
- "VIEW PREDICTION" button

#### `UpcomingMatches` (`src/components/UpcomingMatches.tsx`)
Main section component with:
- Loading states
- Error handling
- Empty states
- Grid layout (responsive: 1 col mobile, 2 cols tablet, 3 cols desktop)
- "View All Predictions" button

### 4. Page Integration
Updated `src/app/[lang]/page.tsx` to use the new `UpcomingMatches` component.

## Database Requirements

Your Supabase database should have the following tables populated:

### Required Tables
1. **sports** - Sport types (e.g., Football, Basketball)
2. **countries** - Countries with flags
3. **teams** - Team information with logos
4. **leagues** - Domestic leagues
5. **competitions** - International competitions
6. **matches** - Match data
7. **match_leagues** - Junction table linking matches to leagues
8. **match_competitions** - Junction table linking matches to competitions

### Sample Data Structure

```sql
-- Example: Add a sport
INSERT INTO sports (name, logo_url)
VALUES ('Football', 'https://example.com/football-icon.png');

-- Example: Add teams
INSERT INTO teams (sport_id, country_id, name, logo_url)
VALUES
  ('uuid-of-football', 'uuid-of-england', 'Manchester United', 'https://example.com/manutd-logo.png'),
  ('uuid-of-football', 'uuid-of-england', 'Liverpool', 'https://example.com/liverpool-logo.png');

-- Example: Add a match
INSERT INTO matches (sport_id, home_team_id, away_team_id, match_date, status)
VALUES (
  'uuid-of-football',
  'uuid-of-manutd',
  'uuid-of-liverpool',
  '2025-10-28 20:45:00',
  'scheduled'
);

-- Example: Link match to league
INSERT INTO match_leagues (match_id, league_id)
VALUES ('uuid-of-match', 'uuid-of-premier-league');
```

## Configuration

### Environment Variables
Already configured in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://rcihtdfhssltbpngblbu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## Usage

### Basic Usage
```tsx
import UpcomingMatches from '@/components/UpcomingMatches'

export default function Page() {
  return <UpcomingMatches limit={12} sport="Football" />
}
```

### Custom Configuration
```tsx
// Show 6 matches
<UpcomingMatches limit={6} sport="Football" />

// Show basketball matches
<UpcomingMatches limit={12} sport="Basketball" />
```

## API Functions

### Fetching Matches in Other Components
```tsx
import { getUpcomingMatches, getMatchById } from '@/lib/matches'

// In a server component
const matches = await getUpcomingMatches(10, 'Football')

// In a client component
useEffect(() => {
  async function fetchData() {
    const matches = await getUpcomingMatches(10, 'Football')
    setMatches(matches)
  }
  fetchData()
}, [])
```

## File Structure
```
src/
├── types/
│   └── database.ts              # Supabase database types
├── lib/
│   ├── supabase.ts              # Supabase client
│   └── matches.ts               # Match query functions
├── components/
│   ├── UpcomingMatches.tsx      # Main section component
│   └── UpcomingMatchCard.tsx    # Individual match card
└── app/
    └── [lang]/
        └── page.tsx             # Homepage (integrated)
```

## Next Steps

1. **Populate Database**: Add sports, countries, teams, leagues, and matches to your Supabase database
2. **Test**: Verify matches are displaying correctly
3. **Customize**: Adjust styling to match your brand
4. **Add Features**:
   - Match filtering by league
   - Date range selector
   - Search functionality
   - Predictions integration

## Troubleshooting

### No Matches Displayed
- Check if matches exist in database with `status = 'scheduled'`
- Verify match_date is in the future
- Check if sport name matches exactly (case-sensitive)
- Verify Supabase credentials are correct

### Images Not Loading
- Ensure `logo_url` fields are populated
- Add placeholder images in `/public` folder
- Check CORS settings in Supabase Storage

### TypeScript Errors
- Ensure all types are imported correctly
- Run `npm run build` to check for type errors

## Support
For issues or questions, refer to:
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
