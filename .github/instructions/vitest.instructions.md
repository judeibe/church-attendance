---
applyTo: "**/*.{test,spec}.{ts,tsx,js,jsx}"
description: "Instructions for testing with Vitest in Next.js"
---

# Vitest with Next.js

## Configuration

- Use `vitest.config.mts` in root with React and tsconfig-paths plugins
- Environment: `jsdom` for React components
- Package.json scripts: `"test": "vitest"`

## Test Structure

- Files: `*.test.ts` or `*.spec.ts`
- Location: `__tests__/` or placed alongside files
- Imports: `import { test, expect } from 'vitest'`

## Component Testing

```typescript
import { render, screen } from "@testing-library/react";
import { test, expect } from "vitest";
import Component from "./Component";

test("renders component", () => {
  render(<Component />);
  expect(screen.getByRole("heading")).toBeDefined();
});
```

## Commands

- `npm run test` - Watch mode
- `npm run test run` - Single run
- `npm run test -- --coverage` - With coverage

## Best Practices

- Use `screen.getByRole()` instead of `getByTestId()`
- Test behavior, not implementation
- Server Components synchronous only (async not supported)
- Use `vi.mock()` for mocking
