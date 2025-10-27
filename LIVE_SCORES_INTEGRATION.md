# Live Scores Page - Supabase Integration

## ✅ Implementation Complete

### What Was Implemented

#### 1. **New Database Functions** (`src/lib/matches.ts`)

Added three new functions for live match management:

##### `getLiveMatches(limit?)`
- Fetches all matches with `status = 'live'`
- Includes team details (logos, names)
- Includes league/competition information
- Auto-refreshes every 60 seconds

##### `getAllTodayMatches(limit?)`
- Fetches all matches for today (live, scheduled, completed)
- Useful for comprehensive match listings
- Supports multiple statuses

#### 2. **New Component** (`src/components/LiveMatchCard.tsx`)

Created a specialized component for displaying live matches:

**Features:**
- ✅ Two layout modes: Grid and List
- ✅ Live indicator with pulsing animation
- ✅ Real-time score display
- ✅ Match status badges (LIVE, FT, Scheduled)
- ✅ Team logos and names
- ✅ League information
- ✅ Match time display

**Status Display:**
- 🟢 **LIVE** - Green badge with pulsing dot
- ⚪ **FT** (Full Time) - Gray badge
- 🔵 **Scheduled** - Blue badge

#### 3. **Updated Live Scores Page** (`src/app/[lang]/live-scores/page.tsx`)

**Key Features:**

✅ **Auto-Refresh**
- Fetches live data every 60 seconds
- Manual refresh button with loading animation
- Displays last update time

✅ **League Filtering**
- Horizontal scrollable league tabs
- Shows match count per league
- "All Leagues" option

✅ **Search Functionality**
- Search by team name
- Search by league name
- Real-time filtering

✅ **Layout Toggle**
- Grid view (4 columns on desktop)
- List view (wide cards)
- Persists user preference

✅ **Loading & Error States**
- Loading spinner on initial load
- Error message with retry button
- Empty state for no matches

## File Structure

```
src/
├── lib/
│   └── matches.ts                    # Added: getLiveMatches(), getAllTodayMatches()
├── components/
│   └── LiveMatchCard.tsx             # New: Live match display component
└── app/
    └── [lang]/
        └── live-scores/
            └── page.tsx              # Updated: Supabase integration
```

## How It Works

### Data Flow

```typescript
// 1. Fetch live matches from Supabase
const data = await getLiveMatches()

// 2. Extract unique leagues
data.forEach(match => {
  const league = match.leagues?.[0] || match.competitions?.[0]
  // Build league list...
})

// 3. Filter by league and search
const filtered = matches.filter(match => {
  // League filtering
  // Search filtering
})

// 4. Display with LiveMatchCard
<LiveMatchCard match={match} layout={layout} />
```

### Auto-Refresh Implementation

```typescript
useEffect(() => {
  fetchLiveScores()

  // Auto-refresh every 60 seconds
  const intervalId = setInterval(fetchLiveScores, 60000)

  return () => clearInterval(intervalId)
}, [])
```

## Database Requirements

### Required Data

For live matches to display, your Supabase database needs:

1. **Matches with `status = 'live'`**
   ```sql
   UPDATE matches
   SET status = 'live',
       home_score = 2,
       away_score = 1
   WHERE id = 'match-id';
   ```

2. **Teams with logos**
   ```sql
   INSERT INTO teams (sport_id, country_id, name, logo_url)
   VALUES ('sport-id', 'country-id', 'Team Name', 'https://example.com/logo.png');
   ```

3. **League/Competition links**
   ```sql
   INSERT INTO match_leagues (match_id, league_id)
   VALUES ('match-id', 'league-id');
   ```

## Testing

### Visit the Page
```
http://localhost:3001/en/live-scores
```

### Expected Behavior

1. **With Live Matches:**
   - Green "LIVE" badges
   - Pulsing indicator
   - Real-time scores
   - Auto-refresh every 60 seconds

2. **Without Live Matches:**
   - Empty state message
   - "No live matches at the moment"
   - Suggestion to check back later

3. **League Filtering:**
   - Click league to filter
   - Match count updates
   - Search works within filter

4. **Layout Toggle:**
   - Grid: 4 columns (desktop)
   - List: Wide horizontal cards

## Features Comparison

| Feature | Old (API Football) | New (Supabase) |
|---------|-------------------|----------------|
| Data Source | External API | Your Database |
| Auto-Refresh | ✅ 60 seconds | ✅ 60 seconds |
| Search | ✅ | ✅ |
| League Filter | ✅ | ✅ |
| Layout Toggle | ✅ Grid/List | ✅ Grid/List |
| Real-time Updates | API dependent | Database controlled |
| Offline Support | ❌ | Possible with caching |

## Match Status Types

The system supports these match statuses:

| Status | Display | Color | Animated |
|--------|---------|-------|----------|
| `live` | LIVE | Green | Yes (pulse) |
| `completed` | FT | Gray | No |
| `scheduled` | Scheduled | Blue | No |
| `postponed` | Postponed | Orange | No |
| `cancelled` | Cancelled | Red | No |

## Advanced Features

### Real-time Updates (Optional)

To add real-time Supabase subscriptions:

```typescript
useEffect(() => {
  const subscription = supabase
    .channel('live-matches')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'matches',
      filter: 'status=eq.live'
    }, (payload) => {
      // Update matches in real-time
      fetchLiveScores()
    })
    .subscribe()

  return () => {
    subscription.unsubscribe()
  }
}, [])
```

## Troubleshooting

### No Matches Displayed

1. Check if matches exist with `status = 'live'`:
   ```sql
   SELECT * FROM matches WHERE status = 'live';
   ```

2. Verify teams have logos:
   ```sql
   SELECT * FROM teams WHERE id IN (
     SELECT home_team_id FROM matches WHERE status = 'live'
   );
   ```

3. Check Supabase credentials in `.env.local`

### Scores Not Updating

- Ensure `home_score` and `away_score` are set in the database
- Check if auto-refresh is working (watch console logs)
- Manually click refresh button to test

### Layout Issues

- Clear browser cache
- Check responsive breakpoints
- Verify Tailwind CSS is loaded

## Next Steps

1. **Populate Database**: Add live matches to test
2. **Test Auto-Refresh**: Let page run for 60+ seconds
3. **Add Real-time**: Implement Supabase subscriptions
4. **Performance**: Add caching for frequently accessed data

## Summary

The live-scores page now:
- ✅ Uses Supabase instead of API Football
- ✅ Shows live matches with real-time scores
- ✅ Auto-refreshes every 60 seconds
- ✅ Supports league filtering and search
- ✅ Offers grid and list layouts
- ✅ Handles loading and error states
- ✅ Displays match status with animations

Visit: `http://localhost:3001/en/live-scores` 🎉
