# Aux Arena Client

Frontend client for a lobby-based, music-themed party game built with React + TypeScript.  
Players can create/join lobbies, chat in real time, and progress through game phases (prompt, song picking, viewing, voting, winner).

## What This App Does

This app provides the UI for a multiplayer game flow:

- Users create or join a game lobby.
- The client connects to a backend over REST and WebSockets (STOMP over SockJS).
- Players and spectators move through game phases.
- Players select songs (currently test-data driven in the UI), everyone votes, and a winner is shown.

## Main Features

- Lobby creation and join flow
- Real-time lobby updates via WebSocket topics/queues
- Real-time lobby chat
- Multi-phase game screen:
  - Prompt phase
  - Song picking phase
  - Viewing phase
  - Voting phase
  - Winner phase
- Redux state management for user, lobby, and game state

## Tech Stack

- **Framework:** React 19, TypeScript
- **Build tooling:** Create React App (`react-scripts` 5)
- **State management:** Redux Toolkit, React Redux
- **Networking:** Axios (REST), RxStomp + SockJS/STOMP (WebSockets)
- **Routing:** React Router
- **Testing:** Jest + React Testing Library (CRA default setup)

## Project Structure

This repo is organized as a single client app under `aux-arena`:

```text
CISC498-Project-Client/
├─ aux-arena/
│  ├─ public/                  # Static assets
│  ├─ src/
│  │  ├─ Pages/                # Main pages + UI components
│  │  ├─ redux/                # Store, slices, middleware
│  │  ├─ service/              # REST API service wrappers
│  │  ├─ sockets/              # STOMP publish/subscribe helpers
│  │  ├─ Config/               # Socket configuration
│  │  ├─ Interfaces/           # TypeScript interfaces/types
│  │  └─ testCaseTOBEREMOVED/  # Temporary mock data
│  ├─ package.json
│  └─ tsconfig.json
├─ .gitignore
└─ README.md
```

## Setup (Fresh Clone)

1. Clone the repository.
2. Open a terminal in the project root.
3. Install dependencies for the client app:

```bash
cd aux-arena
npm install
```

## Environment Variables

No environment variables are currently consumed by the committed code.  
The client currently hardcodes backend URLs to `http://localhost:8080`.

If you choose to externalize configuration (recommended), use placeholder values like:

```env
REACT_APP_API_BASE_URL=http://localhost:8080/api
REACT_APP_WS_BASE_URL=http://localhost:8080/ws
```

## Running Locally

From `aux-arena`:

```bash
npm start
```

- Client runs on `http://localhost:3000`
- Expected backend base URL: `http://localhost:8080/api`
- Expected WebSocket endpoint: `http://localhost:8080/ws`

## Available Scripts

From `aux-arena`:

- `npm start` - Run the CRA dev server
- `npm run build` - Build a production bundle into `build/`
- `npm test` - Run tests in watch mode
- `npm run eject` - Eject CRA config (irreversible)

## Database / Migrations

No database schema, migration files, or DB setup scripts exist in this repository.  
Database setup appears to be handled by the backend service this client talks to.

## API Routes and Real-Time Endpoints

### REST endpoints used by this client

Base URL (hardcoded): `http://localhost:8080/api`

- `GET /v1/auth` - Authenticate user
- `POST /v1/auth` - Register/create user
- `POST /v1/auth/guest` - Create guest user
- `POST /v1/game-lobby` - Create lobby
- `GET /v1/game-lobby` - Fetch lobby (`lobby-id`, `password`)
- `POST /v1/lobby-session/connect` - Connect user to lobby session
- `POST /v1/youtube` - Song search

### WebSocket endpoints used by this client

WebSocket/SockJS endpoint (hardcoded): `http://localhost:8080/ws`

Client publish destinations:

- `/app/game-lobby/join/{lobbyId}`
- `/app/game-lobby/send-message/{lobbyId}`

Client subscriptions:

- `/topic/game-lobby/{lobbyId}`
- `/topic/game-lobby/message/{lobbyId}`
- `/user/queue/game-lobby/{lobbyId}`

## Auth / Payment / Storage / Integrations

- **Authentication:** Login/register UI exists; some login behavior is currently mocked in UI state.
- **Payment:** No payment integration found.
- **Storage:** No client-side storage integration beyond in-memory Redux state.
- **External integrations:**
  - Backend REST API + STOMP WebSocket service
  - YouTube-related search endpoint via backend (`/v1/youtube`)
  - YouTube embeds in viewing/voting phases

## Testing

Test setup exists (`Jest` + `React Testing Library`), with a default-style `App.test.tsx`.

Run tests from `aux-arena`:

```bash
npm test
```

Note: the existing test appears to still target default CRA content and may need updating for current UI behavior.

## Deployment Notes

No deployment configuration files are present (for example: Docker, CI workflow, or infrastructure manifests).  
A production deployment process is not defined in this repository.

## Limitations / TODOs / Assumptions

- Multiple comments in code indicate TODO/in-progress areas (auth flow, host assignment, spectator behavior, env-based configuration).
- Some game logic currently uses local Redux updates and temporary/mock song data.
- There is no backend code in this repository; successful local runtime depends on a compatible backend running separately on `localhost:8080`.
- Socket/API URLs are currently hardcoded rather than environment-driven.

## Assumptions / Needs Confirmation

- Whether the intended project root for day-to-day work is `aux-arena` (it appears to be).
- Exact backend repository/setup steps and required backend environment variables.
- Final intended auth behavior (current login UI dispatches local state directly in at least one path).
