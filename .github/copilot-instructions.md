# Copilot Instructions for Time Tracker

## Architecture Overview

**Time Tracker** is a full-stack time management application with a monorepo structure:
- **Backend**: Express.js server (port 5000) in `server.js` with MongoDB integration
- **Frontend**: React 19 SPA (port 3000) in `client/src/`
- **Database**: MongoDB (port 27017) storing ActivityCodes and TimeEntries

### Data Flow
1. React client makes HTTP requests via axios to `http://localhost:5000/api/*`
2. Express routes handle requests and persist to MongoDB via Mongoose
3. Collections auto-create on first insert: `ActivityCode` and `TimeEntry`

## Setup & Development Workflow

### Prerequisites
- **Node.js** installed (npm)
- **MongoDB** service running locally (`service MongoDB Status` should be "Running")
- Both server and client must be running simultaneously

### Starting Development
```bash
# Terminal 1: Backend (runs on port 5000)
node server.js

# Terminal 2: Frontend (runs on port 3000)
cd client && npm start
```

**Important**: The React proxy in `client/package.json` routes API calls to `http://localhost:5000`, but axios calls use full URLs (see below).

## Key Technical Patterns

### Backend (server.js)
- **Mongoose Models**: Inline schema definitions in `server.js`
  - `ActivityCode`: {label, color, client}
  - `TimeEntry`: {activityCode, timeSpent, date}
- **Routes**: Simple CRUD endpoints with no validation or error handling
  - POST endpoints save to DB and return 201 status
  - GET endpoints fetch all records

### Frontend (client/src/TimeTracker.js)
- **State Management**: React hooks (`useState`, `useEffect`)
- **API Communication**: Axios with hardcoded base URLs `http://localhost:5000/api/*`
  - `fetchActivityCodes()`: GET activity codes
  - `fetchEntries()`: GET time entries
  - `handleNewCodeSubmit()`: POST new activity code
  - `handleSubmit()`: POST new time entry
- **Excel Export**: Uses `xlsx` library to export entries

### Common API Endpoints
```
GET  /api/activity-codes         → Return all activity codes
POST /api/activity-codes         → Create new activity code {label, color, client}
GET  /api/time-entries           → Return all time entries
POST /api/time-entries           → Create new time entry {activityCode, timeSpent, date}
```

## Troubleshooting

### "Network Error" in Console
- **Cause**: Backend server not running on port 5000
- **Fix**: Run `node server.js` in terminal; verify with `Test-NetConnection -ComputerName localhost -Port 5000`

### MongoDB Connection Issues
- **Verify MongoDB is running**: `Get-Service MongoDB | Select-Object Status`
- **Default connection**: `mongodb://localhost:27017/time-tracker`

## Common Modifications

### Adding a New API Endpoint
1. Define Mongoose schema at top of `server.js`
2. Add `app.get()` or `app.post()` route before `app.listen()`
3. Call `fetchData()` equivalent in React useEffect or after form submission

### Frontend State Updates
- After POST requests, always call fetch function to refresh UI (e.g., `fetchActivityCodes()`)
- Date field defaults to today via `new Date().toISOString().substr(0, 10)`

## Languages & Dependencies

- **Backend**: Node.js, Express 4.x, Mongoose 8.x, CORS
- **Frontend**: React 19, Axios 1.8, XLSX 0.18
- **Database**: MongoDB 5+

## File Structure Reference
```
server.js                    # Express backend (models + routes inline)
client/
  src/
    TimeTracker.js          # Main app component (activity codes + time entries)
    App.js                  # Root component
    index.js                # React entry point
  package.json              # React scripts, axios, xlsx
```

---

**Last updated**: February 2026 | Focus areas: Full-stack debugging, API integration, MongoDB schema changes
