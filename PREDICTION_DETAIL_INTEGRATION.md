# Prediction Detail Page - Supabase Integration

## ✅ Implementation Complete

### What Was Implemented

#### 1. **New Database Function** (`src/lib/matches.ts`)

Added `getMatchWithPredictions(matchId)` function:

```typescript
export async function getMatchWithPredictions(matchId: string) {
  // Fetches match details
  const match = await getMatchById(matchId)

  // Fetches all active predictions for this match
  const predictions = await supabase
    .from('predictions')
    .select('*, expert:users(*)')
    .eq('match_id', matchId)
    .eq('status', 'active')
    .order('confidence_score', { ascending: false })

  return { match, predictions }
}
```

**Features:**
- ✅ Fetches match with team and league details
- ✅ Loads all expert predictions for the match
- ✅ Includes expert user information
- ✅ Orders by confidence score (highest first)
- ✅ Only shows active predictions

#### 2. **New Route** (`src/app/[lang]/predictions/[id]/page.tsx`)

Created a new dynamic route for prediction details:

**URL Pattern:** `/en/predictions/{match-id}`

**Example:** `http://localhost:3001/en/predictions/4d8f7dc5-c7e1-40bb-9aea-faa62369aa05`

#### 3. **Component Features**

##### **Match Header Component**
- Team logos and names
- League information
- Match status (Live, Upcoming, Completed)
- Match date and time
- Score display (for completed/live matches)

##### **Expert Prediction Card**
- Expert profile picture and name
- Confidence score percentage
- Result prediction (Home/Away/Draw)
- Score prediction (if available)
- Suggested odds
- Detailed analysis text
- Prediction type indicator

##### **Match Information Sidebar**
- Match date and time
- Competition name
- Match status
- Match venue (if available)

##### **Predictions Summary**
- Total number of predictions
- Average confidence score
- Quick statistics

### Key Features

| Feature | Status | Description |
|---------|--------|-------------|
| Match Details | ✅ | Full match info from Supabase |
| Expert Predictions | ✅ | Multiple expert predictions |
| Confidence Scores | ✅ | Visual percentage display |
| Score Predictions | ✅ | Exact score predictions |
| Winner Predictions | ✅ | Home/Away/Draw predictions |
| Expert Analysis | ✅ | Detailed text analysis |
| Loading States | ✅ | Spinner while fetching |
| Error Handling | ✅ | Error messages with retry |
| Empty States | ✅ | No predictions message |
| Responsive Design | ✅ | Mobile and desktop layouts |

## Database Schema Requirements

### Required Tables

1. **matches** - Match information
2. **teams** - Team details with logos
3. **leagues** - League information
4. **competitions** - Competition information
5. **match_leagues** - Links matches to leagues
6. **match_competitions** - Links matches to competitions
7. **predictions** - Expert predictions
8. **users** - Expert user information

### Sample Data

#### Add a Match
```sql
INSERT INTO matches (sport_id, home_team_id, away_team_id, match_date, status)
VALUES (
  'sport-uuid',
  'home-team-uuid',
  'away-team-uuid',
  '2025-10-28 20:45:00',
  'scheduled'
);
```

#### Add Expert User
```sql
INSERT INTO users (email, username, role, is_expert, expert_approved)
VALUES (
  'expert@example.com',
  'John Smith',
  'expert',
  true,
  true
);
```

#### Add Prediction
```sql
INSERT INTO predictions (
  expert_id,
  match_id,
  prediction_type,
  home_prediction,
  away_prediction,
  winner_prediction,
  confidence_score,
  analysis
)
VALUES (
  'expert-uuid',
  'match-uuid',
  'both',  -- 'score' | 'winner' | 'both'
  2,       -- Home score prediction
  1,       -- Away score prediction
  'home',  -- Winner: 'home' | 'away' | 'draw'
  0.85,    -- 85% confidence (0.0 to 1.0)
  'Based on recent form and head-to-head statistics, the home team has a strong advantage.'
);
```

## Usage

### Accessing the Page

**Direct URL:**
```
http://localhost:3001/en/predictions/{match-id}
```

**From Match Cards:**
All `UpcomingMatchCard` components now link to this page automatically.

### Prediction Types

The system supports three prediction types:

1. **score** - Only exact score prediction
2. **winner** - Only match result (Home/Away/Draw)
3. **both** - Both score and winner prediction

### Confidence Scores

- Stored as decimal (0.0 to 1.0) in database
- Displayed as percentage (0% to 100%) in UI
- Used to sort predictions (highest first)

## Component Structure

```
PredictionDetail/
├── MatchHeader
│   ├── Home Team Info
│   ├── Match Status
│   └── Away Team Info
├── Expert Predictions List
│   └── ExpertPredictionCard[]
│       ├── Expert Profile
│       ├── Confidence Score
│       ├── Result Prediction
│       ├── Score Prediction
│       ├── Odds
│       └── Analysis
└── Sidebar
    ├── Match Information
    └── Predictions Summary
```

## State Management

### Loading States
```typescript
if (loading) {
  // Show spinner
}
```

### Error States
```typescript
if (error || !match) {
  // Show error message with back button
}
```

### Empty States
```typescript
if (predictions.length === 0) {
  // Show "No predictions available" message
}
```

## Navigation Flow

```
Homepage
  └─> Today's Matches (/predictions/today)
      └─> Match Card (click)
          └─> Prediction Detail (/predictions/{id})
              ├─> View Expert Predictions
              ├─> See Match Info
              └─> Back to Predictions
```

## Testing

### Test Scenario 1: Match with Predictions

1. Add a match to database
2. Add 2-3 expert predictions
3. Visit `/en/predictions/{match-id}`
4. Verify:
   - Match details display
   - All predictions show
   - Confidence scores are correct
   - Analysis text renders

### Test Scenario 2: Match without Predictions

1. Add a match to database (no predictions)
2. Visit `/en/predictions/{match-id}`
3. Verify:
   - Match details display
   - Empty state message shows
   - No errors occur

### Test Scenario 3: Invalid Match ID

1. Visit `/en/predictions/invalid-uuid`
2. Verify:
   - Error message displays
   - "Back to Predictions" button works

## Error Handling

### Database Connection Failed
```
Error: "Supabase client not initialized"
Action: Check .env.local credentials
```

### Match Not Found
```
Error: "Match not found"
Action: Verify match ID exists in database
```

### Predictions Failed to Load
```
Graceful degradation: Shows match info without predictions
```

## Performance Considerations

### Query Optimization
- Single query fetches match with teams and leagues
- Separate query for predictions with expert info
- Results ordered by confidence score in database

### Caching Opportunities
- Match details (rarely change)
- Expert profiles (static data)
- League information (static data)

## Styling

### Color Scheme
- Primary: Red (#DC2626)
- Success: Green (#10B981)
- Warning: Yellow (#F59E0B)
- Neutral: Gray scale

### Responsive Breakpoints
- Mobile: < 768px (1 column)
- Tablet: 768px - 1024px (2 columns)
- Desktop: > 1024px (3 columns)

## Future Enhancements

1. **Real-time Updates**
   - Supabase subscriptions for live score updates
   - Real-time prediction additions

2. **User Interactions**
   - Vote on predictions
   - Comment on predictions
   - Share predictions

3. **Analytics**
   - Track expert accuracy
   - Show historical performance
   - Display trending predictions

4. **Filtering**
   - Filter by expert
   - Filter by confidence level
   - Sort by different criteria

## Summary

The prediction detail page now:
- ✅ Uses Supabase for all data
- ✅ Displays match information
- ✅ Shows multiple expert predictions
- ✅ Includes confidence scores
- ✅ Renders expert analysis
- ✅ Handles edge cases gracefully
- ✅ Works on mobile and desktop
- ✅ Integrates with other pages

Visit: `http://localhost:3001/en/predictions/{your-match-id}` 🎉
