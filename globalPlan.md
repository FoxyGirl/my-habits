# Habit Tracker Implementation Plan

## Overview

Build a cross-platform habit tracker for iOS, Android, and Web using Expo, React, TypeScript, and `react-native`.

The app will support registration, login, habit management, streak tracking, offline persistence, and AI-generated habit suggestions with a local fallback when offline.

## Current State

- No application source code or package configuration exists.
- `globalTask.md` is the complete product specification.
- `AGENTS.md` requires `react-native` primitives, `StyleSheet.create()` styles, cross-platform components, and shared files whenever possible.
- React Native supports shared files plus platform-specific `.web`, `.native`, `.ios`, and `.android` files when a genuine divergence exists.
- Expo's React Native setup uses bundler module resolution, strict TypeScript settings, and appropriate module suffixes.

## Assumptions

- Expo will provide the iOS, Android, and Web runtime.
- Authentication is local/demo authentication because no backend requirement was specified.
- Passwords will not be stored in plaintext; a production implementation should use a backend authentication provider.
- AI suggestions will use a server-side LLM endpoint when online.
- A deterministic local suggestion generator will be used offline.

## Desired End State

Users should be able to:

- Register with full name, email, password, confirmation, sex, and birth date.
- Log in on subsequent launches.
- Remain logged in between launches.
- Create, complete, and delete habits.
- View current completion streaks.
- Request actionable habit suggestions based on a goal.
- Continue using all core habit features without network connectivity.
- Receive a graceful local fallback when AI services are unavailable.

## Proposed Structure

```text
app/
  _layout.tsx
  index.tsx

src/
  components/
  screens/
  navigation/
  state/
  storage/
  services/
  domain/
  styles/
  utils/
  types/
```

## Phase 1: Project Scaffold

### Files

- `package.json`
- `app.json`
- `tsconfig.json`
- `babel.config.js`
- `metro.config.js`
- `postcss.config.js`
- `src/styles/tokens.ts`
- `src/navigation/AppRouter.tsx`

### Changes

- Initialize an Expo TypeScript application.
- Add React Strict DOM and required Expo dependencies.
- Configure Web, iOS, and Android targets.
- Configure TypeScript bundler resolution and React Native module suffixes.
- Configure React Strict DOM's PostCSS integration for Web.
- Add shared design tokens for color, spacing, typography, borders, and status states.
- Create the root router that selects registration, login, or the authenticated dashboard.

### Success Criteria

- The application starts on Web, iOS, and Android.
- All UI primitives come from `react-native`.
- No raw HTML or React Strict DOM primitives are introduced.
- TypeScript compilation succeeds.

## Phase 2: Domain Model and Offline Storage

### Files

- `src/domain/user.ts`
- `src/domain/habit.ts`
- `src/domain/session.ts`
- `src/storage/storage.ts`
- `src/storage/storageKeys.ts`
- `src/storage/repositories.ts`
- `src/utils/date.ts`
- `src/utils/streak.ts`

### Data Models

`UserProfile`:

- `id`
- `fullName`
- `email`
- `passwordHash`
- `sex`
- `birthDate`
- `createdAt`

`Habit`:

- `id`
- `name`
- `description`
- `createdAt`
- `completionDates`
- `archived`

`Session`:

- `userId`
- `authenticatedAt`

### Changes

- Implement a typed storage abstraction over a cross-platform local persistence solution.
- Store users, current session, habits, and AI suggestion history separately.
- Add serialization and parsing validation.
- Normalize dates to `YYYY-MM-DD` for completion tracking.
- Implement streak calculation based on consecutive completed days.
- Ensure completion is idempotent for the current date.
- Preserve data across app restarts.

### Success Criteria

- Data persists after app restart.
- Storage reads and writes work on all supported platforms.
- Corrupt or missing storage data falls back safely.
- Streak calculations handle today, yesterday, gaps, and empty histories.

## Phase 3: Authentication Flow

### Files

- `src/state/AuthContext.tsx`
- `src/screens/RegisterScreen.tsx`
- `src/screens/LoginScreen.tsx`
- `src/components/FormField.tsx`
- `src/components/PasswordField.tsx`
- `src/components/ValidationMessage.tsx`
- `src/services/authService.ts`

### Registration

Implement fields for:

- Full name
- Email address
- Password
- Confirm password
- Sex
- Birth date

Validation should cover:

- Required fields
- Valid email format
- Minimum password length
- Matching passwords
- Valid birth date
- Duplicate email prevention

### Login

- Validate email and password.
- Load the matching local user.
- Persist the session after successful login.
- Show a clear error for invalid credentials.
- Provide navigation between login and registration.

### Security

- Avoid storing plaintext passwords in the domain layer.
- Isolate the password hashing implementation so it can later be replaced with backend authentication.
- Do not expose credentials in logs or AI requests.

### Success Criteria

- First launch displays registration when no user exists.
- Later launches display login when a user exists but no session is active.
- An active session opens the dashboard.
- Invalid input is reported accessibly and does not submit.

## Phase 4: Habit Management

### Files

- `src/screens/DashboardScreen.tsx`
- `src/screens/CreateHabitScreen.tsx`
- `src/components/HabitCard.tsx`
- `src/components/StreakBadge.tsx`
- `src/state/HabitContext.tsx`
- `src/services/habitService.ts`

### Changes

- Display the authenticated user's habits.
- Add a create-habit form with name and optional description.
- Add a completion control for today.
- Show current streak and completion state.
- Add deletion with confirmation.
- Display an empty state when no habits exist.
- Refresh state after storage mutations.

### Success Criteria

- Users can create habits.
- Users can mark a habit complete for today.
- Repeating the completion action does not duplicate the date.
- Users can delete habits.
- Streak values update immediately.
- Habit data remains available offline.

## Phase 5: AI Habit Suggestions

### Files

- `src/screens/AISuggestionsScreen.tsx`
- `src/components/GoalInput.tsx`
- `src/components/SuggestionCard.tsx`
- `src/services/aiSuggestionService.ts`
- `src/services/localSuggestionService.ts`
- `src/types/ai.ts`

### Feature

Users enter a goal such as “improve sleep” or “exercise more.” The app requests several specific, actionable habit suggestions.

### Online Behavior

- Send only the goal and necessary non-sensitive context.
- Call a server-side AI endpoint rather than embedding an API key in the client.
- Validate and normalize the returned suggestions.
- Display loading, success, and error states.
- Cache successful suggestions locally.

### Offline Behavior

- Detect request failure without blocking the rest of the app.
- Generate suggestions from a small deterministic category/rule set.
- Clearly label locally generated suggestions.
- Allow users to add a suggestion directly as a habit.

### Success Criteria

- AI suggestions are useful, actionable, and distinct.
- The feature works without network access through the local fallback.
- No API credentials are bundled into the client.
- Malformed AI responses do not crash the app.

## Phase 6: Shared UI and Accessibility

### Files

- `src/components/AppShell.tsx`
- `src/components/PrimaryButton.tsx`
- `src/components/ScreenHeader.tsx`
- `src/components/EmptyState.tsx`
- `src/styles/tokens.ts`

### Changes

- Use semantic `html.main`, `html.header`, `html.section`, `html.label`, `html.button`, and text primitives.
- Wrap every text node in a text-capable React Strict DOM primitive.
- Define all styles with `css.create()`.
- Support readable layouts on narrow mobile screens and wider Web screens.
- Ensure controls have accessible labels and clear focus/pressed states.
- Avoid platform-specific rendering branches unless separate platform files are required.

### Success Criteria

- Layout works on mobile and desktop widths.
- Buttons and fields are keyboard accessible on Web.
- Form errors are associated with their fields.
- Color contrast is sufficient for primary text and controls.

## Phase 7: Testing and Verification

### Unit Tests

- Registration validation.
- Login validation.
- Password mismatch handling.
- Habit creation and deletion.
- Completion idempotency.
- Streak calculations.
- Storage serialization and recovery.
- Local AI fallback generation.

### Integration Tests

- Registration to authenticated dashboard.
- Login after application restart.
- Habit creation, completion, and deletion.
- Offline operation.
- AI failure fallback.

### Manual Verification

1. Launch with empty storage and confirm registration appears.
2. Register a user and verify the dashboard opens.
3. Restart the app and verify login/session behavior.
4. Create and complete multiple habits.
5. Verify streaks across consecutive dates and gaps.
6. Disable network access and verify core functionality.
7. Request AI suggestions offline and add one as a habit.
8. Run the app on Web, iOS, and Android.
9. Run TypeScript, lint, unit tests, and platform builds.

## Out of Scope

- Multi-user cloud synchronization.
- Social sharing or collaboration.
- Push notifications.
- Password reset via email.
- Production-grade remote authentication.
- Advanced habit recurrence rules.
- Background synchronization.
- Full AI conversation history.

## Risks and Mitigations

- Local authentication is not production secure: isolate it behind an authentication service for later replacement.
- AI requests may fail or be unavailable: provide deterministic offline suggestions.
- Date and timezone changes can affect streaks: normalize completion dates and document local-date behavior.
- Storage corruption can break startup: validate persisted data and recover with empty defaults.
- React Strict DOM platform differences may require separate implementations: keep shared logic platform-neutral and use `.web` or `.native` files only when necessary.

## Completion Criteria

The implementation is complete when:

- The app runs on iOS, Android, and Web.
- Registration and login flows work.
- Habits can be created, completed, deleted, and measured by streak.
- Core functionality works offline.
- The AI feature works online and has an offline fallback.
- TypeScript, linting, tests, and platform builds pass.
- The implementation follows all React Strict DOM rules in `AGENTS.md`.
