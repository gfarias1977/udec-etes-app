# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
yarn start          # Start dev server (uses --openssl-legacy-provider)
yarn build          # Production build
yarn test           # Run tests in watch mode
yarn test --watchAll=false  # Run tests once (CI mode)

# Code quality
yarn lint           # ESLint check
yarn lint:fix       # ESLint auto-fix
yarn format         # Prettier format (JS, JSX, JSON, CSS)
```

**Node version**: 20.16.0 (required — see `engines` in `package.json`)

**Environment**: Set `REACT_APP_API_URL` (e.g. `http://localhost:3005/api/`) for the backend API base URL.

Pre-commit hooks run ESLint + Prettier automatically via Husky/lint-staged.

## Architecture

### Layer overview

```
src/
  @jumbo/          # Framework shell: layout, constants, shared utilities
  @coremat/        # Reusable Material-UI component library (Cmt* components)
  routes/          # Page-level modules
    Admin/         # CRUD modules: Users, Roles, BusinessUnits, PurchaseAreas, etc.
    Pages/         # Feature pages: Standards, Gap analysis, Reports
    Auth/          # Login, Register, ForgotPassword
  redux/
    actions/       # Redux thunks (one file per domain)
    reducers/      # Redux reducers (one file per domain)
    store/         # Store config with redux-thunk + connected-react-router
  services/
    auth/jwt/      # JWT auth implementation
    config/        # Axios instance (reads REACT_APP_API_URL)
  i18n/            # Translations: es_ES (primary), en_US, ar_SA, fr_FR, it_IT, zh-Hans
  theme/           # Material-UI theme customization
  components/      # Export button components (CSV/report exports)
```

### Import aliases (defined in `jsconfig.json`)

| Alias | Resolves to |
|-------|-------------|
| `@jumbo` | `src/@jumbo` |
| `@coremat` | `src/@coremat` |
| `redux` | `src/redux` |
| `components` | `src/components` |

### State management

Redux store (`src/redux/store/index.js`) uses `redux-thunk` + `connected-react-router`. Each domain has a paired action file and reducer — e.g. `redux/actions/Users.js` + `redux/reducers/Users.js`. Reducer keys follow the pattern `<domain>Reducer` (e.g. `usersReducer`, `standardsReducer`).

The `common` slice handles global fetch state (`loading`, `error`, `message`) dispatched via `FETCH_START` / `FETCH_SUCCESS` / `FETCH_ERROR` action types from `@jumbo/constants/ActionTypes`.

### Auth

JWT-only (`CurrentAuthMethod = 'jwtAuth'` in `@jumbo/constants/AppConstants.js`). The `RestrictedRoute` wrapper in `src/routes/index.js` checks `auth.authUser` in Redux state and redirects unauthenticated users to `/signin`.

### Module pattern

Each Admin/Pages module follows a consistent structure:

```
routes/Admin/<Module>/
  index.js              # Main list view (table with sort/filter/pagination)
  index.style.js        # JSS styles
  AddEdit<Module>/      # Create/edit dialog
  <Module>ListRow/      # Table row component
  <Module>TableHead/    # Sortable column headers
  <Module>TableToolbar/ # Search, filter, add button
  <Module>DetailView/   # Read-only detail dialog
  NoRecordFound.js      # Empty state
```

### Domain model summary

The app manages university equipment standards for Universidad de Concepción:

- **Admin modules**: Users, Roles, BusinessUnits, PurchaseAreas, ChargeAccounts, Majors (carreras), Schools (facultades), Items (clases de bienes)
- **Standards**: Equipment standards assigned to courses/room layouts
- **Bibliographic gap**: Gap calculation between stock, demand, and standard — loaded via Process uploads (`GapSourceStock`, `GapSourceDemand`, `GapSourceStandard`)
- **Reports**: Standard-by-major, equipment-by-major, room layout prototype, book coverage

### Deployment

- Vercel (`vercel.json`) — primary deployment target
- Docker + Nginx (`Dockerfile`, `nginx.config`, `static.json`) — alternative containerized deploy
