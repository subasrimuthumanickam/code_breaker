# Code Breaker — Backend

Node.js + Express + MySQL API for the Code Breaker game. It owns the secret
code, computes guess feedback, tracks attempts/score, and persists everything
to MySQL — the app no longer needs to trust the client with the answer.

## Setup

```bash
cd backend
npm install
cp .env.example .env      # then fill in your MySQL credentials
mysql -u root -p < schema.sql
npm run dev                # starts on http://localhost:4000
```

## Important: match your difficulty config

`src/config/difficulty.js` mirrors your frontend's `DIFFICULTY_CONFIG`
(`types/game.ts`) with placeholder numbers. Edit it so `codeLength`,
`maxAttempts`, and `timeLimitSec` for each difficulty match your app exactly —
the backend is now the source of truth for scoring and attempt limits.

## Endpoints

All responses are JSON. The secret code is only ever included once a game
has finished (`status: "won" | "lost"`).

### Start a game
`POST /api/games/start`
```json
{ "difficulty": "easy" }
```
Response:
```json
{
  "gameId": "b3f1...",
  "difficulty": "easy",
  "codeLength": 3,
  "maxAttempts": 4,
  "timeLimitSec": 60,
  "attemptsUsed": 0,
  "attemptsLeft": 4,
  "score": 0,
  "status": "playing"
}
```

### Submit a guess
`POST /api/games/:gameId/guess`
```json
{ "guess": [5, 6, 8], "timeLeft": 37 }
```
`timeLeft` (seconds remaining, from the frontend's countdown) is optional but
needed to reproduce the original time-bonus scoring on a win.

Response adds a `feedback` object and reflects the new state:
```json
{
  "gameId": "b3f1...",
  "status": "playing",
  "attemptsUsed": 1,
  "attemptsLeft": 3,
  "score": 10,
  "feedback": { "exactMatches": 0, "partialMatches": 1 }
}
```
When `status` becomes `"won"` or `"lost"`, the response also includes
`secretCode`.

### Get current game state (e.g. on app resume)
`GET /api/games/:gameId` → game state + full guess history.

### High score / stats
`GET /api/highscore` → `{ "highScore": 340 }`
`GET /api/stats` → games played, wins, losses, high score, avg attempts to win.

## Notes

- `guesses` table keeps every guess for a game, so `GET /api/games/:gameId`
  can rebuild the "CLUES" list the app already renders.
- There's no auth/user concept yet — scores and stats are global. If you
  want per-player high scores later, add a `user_id` column to `games` and
  a way to identify the device/account making the request.
- CORS is wide open (`cors()`), tighten `origin` before shipping to
  production.
