# AGENTS.md

# React Strict DOM (RSD) Development Rules

These rules are mandatory. Always follow them when generating or modifying code.

---

# 1. Core Principles

- Build components that work on **Web, iOS and Android**.
- Prefer a single implementation whenever possible.
- Never sacrifice cross-platform compatibility for web-only convenience.
- Generate idiomatic React + TypeScript code.

---

# 2. Imports

Always import primitives from React Strict DOM.

```ts
import { html, css } from 'react-strict-dom';
```

Never import UI primitives from:

- react-native
- react-native-web
- react-dom

unless explicitly requested.

Never generate:

```tsx
<div />
<span />
<p />
<button />
<img />
<input />
```

Instead use:

```tsx
<html.div />
<html.span />
<html.p />
<html.button />
<html.img />
<html.input />
```

---

# 3. Text Rules (VERY IMPORTANT)

React Strict DOM does **not** allow raw text inside layout elements.

Never write:

```tsx
<html.div>Hello</html.div>
```

Always write:

```tsx
<html.div>
  <html.span>Hello</html.span>
</html.div>
```

Every text node must be wrapped in one of:

- html.span
- html.p
- html.label
- html.h1-h6
- another text primitive

This includes:

- conditional rendering
- map()
- ternaries
- template strings
- translated strings

Correct:

```tsx
{
  count > 0 && <html.span>{count}</html.span>;
}
```

Incorrect:

```tsx
{
  count > 0 && count;
}
```

---

# 4. Styling

Never inline style objects.

Bad:

```tsx
<html.div
  style={{
    padding: 16,
  }}
/>
```

Always use:

```tsx
const styles = css.create({
  container: {
    padding: 16,
  },
});

<html.div style={styles.container} />;
```

All styles must live inside `css.create()`.

Remove unused styles.

---

# 5. CSS Rules

Only use cross-platform CSS.

Prefer:

- flex
- gap (when supported)
- padding
- margin
- borderRadius
- backgroundColor
- color
- fontSize
- fontWeight

Avoid unless explicitly required:

- CSS Grid
- position: fixed
- filter
- backdrop-filter
- complex selectors
- pseudo-elements
- pseudo-selectors
- animations tied to the DOM
- web-only CSS properties

---

# 6. Layout

Remember:

```tsx
<html.div
```

already behaves like

```css
display: flex;
flex-direction: column;
```

Do not add these properties unless changing them.

Prefer Flexbox over absolute positioning.

---

# 7. Components

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

# 8. Accessibility

Prefer semantic primitives.

Examples:

- html.main
- html.header
- html.footer
- html.nav
- html.section
- html.article
- html.button
- html.label

Avoid replacing semantic elements with generic divs.

Buttons must be actual:

```tsx
<html.button>
```

not clickable divs.

Images should always include meaningful alt text when appropriate.

---

# 9. Cross-platform Rules

Never write:

```ts
Platform.OS;
```

Never branch UI using runtime platform checks.

If implementations genuinely differ, create:

```
Component.web.tsx
Component.native.tsx
```

Do not place platform-specific logic inside shared components.

---

# 10. State

Prefer:

- useState
- useReducer
- useMemo
- useCallback

Do not prematurely memoize everything.

---

# 11. Performance

Avoid:

- unnecessary re-renders
- creating objects inside render
- inline callbacks when avoidable
- recreating style objects

Prefer stable references.

---

# 12. TypeScript

Always:

- type props
- type callbacks
- type refs
- avoid `any`
- prefer `unknown` over `any`
- use discriminated unions when appropriate

---

# 13. Code Quality

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

# 14. Before Finishing

Verify:

- [ ] No HTML elements were introduced.
- [ ] No React Native primitives were introduced.
- [ ] Every text node is wrapped.
- [ ] All styles use css.create().
- [ ] No inline style objects.
- [ ] No unused styles.
- [ ] No Platform.OS checks.
- [ ] Accessibility semantics preserved.
- [ ] TypeScript passes without `any`.
- [ ] Code is cross-platform.

# 15. Existing Code

When editing an existing component:

- Preserve the existing component API.
- Preserve exported types.
- Do not rewrite unrelated code.
- Make the smallest correct change.
- Match the existing code style.
