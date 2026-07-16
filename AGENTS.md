# AGENTS.md

One codebase targets all three platforms via Expo's managed workflow and `react-native-web`.

# Cross-Platform React Native Development Guide

These rules are mandatory. Always follow them when generating or modifying code.

---

# 1. Core Principles

- Build components that work on **Web, iOS and Android**.
- Prefer a single implementation whenever possible.
- Never sacrifice cross-platform compatibility for web-only convenience.
- Generate idiomatic React + TypeScript code.

---

# 2. Tech stack

- **Expo** (SDK, latest stable) — managed workflow, EAS for builds when needed
- **TypeScript** — strict mode, no implicit `any`
- **React** / **React Native** — functional components + hooks only, no class components
- **Expo Router** for navigation (file-based routing) unless the project already has React Navigation wired up
- **State**: prefer React state/context for local UI state; only reach for a library (Zustand, Redux, etc.) if state complexity genuinely warrants it — don't add one preemptively
- **Persistence**: local-first storage (e.g. `expo-sqlite` or `AsyncStorage`) is sufficient for v1; no backend/auth unless asked
- **Styling**: `StyleSheet.create` for custom styles; **HeroUI Native** components for common UI surfaces; Tailwind utility classes via **Uniwind** for HeroUI component styling when it improves consistency

Keep platform-specific code minimal. Use `Platform.select` or `.web.tsx` / `.native.tsx` file suffixes only when a genuine platform divergence exists — default to writing once and letting RN/Expo handle both.

---

# 3. Conventions

- **TypeScript everywhere**, including config files where practical.
- Components are named exports in PascalCase files (`HabitCard.tsx` exports `HabitCard`).
- Prefer composition over prop-drilling; use context only for genuinely cross-cutting state (e.g. the habit list, theme).
- No comments explaining _what_ code does — code should read clearly from naming. Comment only non-obvious _why_ (e.g. a platform quirk or a streak-calculation edge case).
- Don't introduce a backend, auth, or cloud sync unless explicitly requested — this is a local-first app by default.
- Don't add dependencies for problems solvable with a few lines of code (e.g. date math) unless the library is already idiomatic in the Expo ecosystem (e.g. `date-fns`).
- Match existing formatting; don't reformat unrelated files.

---

# 4. Testing changes

Since this is a UI-heavy cross-platform app, verify changes by actually running them:

```bash
npx expo start --web    # fastest loop for UI iteration
```

Check both a mobile viewport and web layout before calling a UI change done — react-native-web can diverge from native rendering (touch targets, scroll behavior, safe-area insets).

---

# 5. Components

Write:

- functional components
- TypeScript
- strongly typed props
- small reusable components

Avoid:

- class components
- any
- unnecessary wrappers
- deeply nested layouts

---

# 6. State

Prefer:

- useState
- useReducer
- useMemo
- useCallback

Do not prematurely memoize everything.

---

# 7. Styling

- Use `StyleSheet.create` from `react-native` for all custom component styles.
- Colocate styles with the component that uses them.
- Use the token objects exported from `src/styles/tokens.ts` (`colors`, `spacing`, `typography`) for consistency.
- Use **HeroUI Native** components (`Button`, `Card`, etc.) for common UI surfaces.
- Use Tailwind utility classes via **Uniwind** for HeroUI component styling when it improves consistency.
- Keep the required global CSS entry at `global.css` (`@import 'tailwindcss'; @import 'uniwind'; @import 'heroui-native/styles';`).
- Do **not** use `display: 'flex'` — every `View` is already a flex container.
- Do **not** use web-only layout properties (e.g. `boxSizing`, `overflow: scroll` on `View`). Use `ScrollView` for scrollable regions.

## Interaction states

Use HeroUI `Button` for actions. Its built-in feedback handles press states. When building a custom interactive surface, use `Pressable` and handle `:active` / `:hover` through the `pressed` and `hovered` callback states:

```tsx
<Pressable
  style={({ hovered, pressed }) => [
    styles.button,
    (pressed || hovered) && styles.buttonPressed,
  ]}
>
  <Text style={styles.buttonText}>Action</Text>
</Pressable>
```

`hovered` is provided by `react-native-web` on web and ignored on native.

For scrolling lists or screens, wrap content in `ScrollView` and apply layout styles via `contentContainerStyle`.

---

# 8. Performance

Avoid:

- unnecessary re-renders
- creating objects inside render
- inline callbacks when avoidable
- recreating style objects

Prefer stable references.

---

# 9. TypeScript

Always:

- type props
- type callbacks
- type refs
- avoid `any`
- prefer `unknown` over `any`
- use discriminated unions when appropriate

---

# 10. Code Quality

Generate code that is:

- readable
- deterministic
- lint clean
- type safe
- production ready

Do not leave:

- TODOs
- placeholder code
- dead code
- commented-out code

unless explicitly requested.

---

# 11. Before Finishing

Verify:

- [ ] No inline style objects.
- [ ] No unused styles.
- [ ] Accessibility semantics preserved.
- [ ] TypeScript passes without `any`.
- [ ] Code is cross-platform.

---

# 12. Existing Code

When editing an existing component:

- Preserve the existing component API.
- Preserve exported types.
- Do not rewrite unrelated code.
- Make the smallest correct change.
- Match the existing code style.

---

# 13. Web-only APIs

Do not rely on:

- document
- window
- localStorage
- sessionStorage
- HTMLElement
- CSSStyleSheet
- MutationObserver
- ResizeObserver

unless the code is explicitly web-only.

---

# 14. Web-only CSS

Avoid:

- display: grid
- position: fixed
- backdrop-filter
- filter
- clip-path
- ::before
- ::after
- :hover
- :focus-visible
- :has()
- :nth-child()
- @media
- @container

unless explicitly requested.

---

# 15. Unsafe React Patterns

Avoid:

- class components
- string refs
- findDOMNode()
- forceUpdate()
- legacy lifecycle methods

Always use modern React APIs.

---

# 16. Untyped Code

Do not generate:

```ts
any;
```

Avoid:

```ts
as any
```

Avoid suppressing errors with:

```ts
// @ts-ignore
```

Prefer proper types.

---

# 17. Large Unnecessary Refactors

When modifying existing code:

- Do not rewrite unrelated files.
- Do not rename public APIs.
- Do not change formatting unnecessarily.
- Do not reorder imports unless required.
- Do not introduce new dependencies unless requested.
- Make the smallest correct change.
