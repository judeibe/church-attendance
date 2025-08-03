---
applyTo: "**/*.{ts,tsx}"
description: "TypeScript 5 development guidelines with React support"
---

# TypeScript 5 Guidelines

## Core Principles

- Use strict mode: `"strict": true`
- Prefer `const` assertions and `as const`
- Use template literal types for string unions
- Leverage satisfies operator for type checking

## React Components

### Function Components

```typescript
// Use React.FC sparingly, prefer direct typing
const Component = ({ title }: { title: string }) => {
  return <div>{title}</div>;
};

// For generic components
function GenericComponent<T>({ data }: { data: T }) {
  return <div>{JSON.stringify(data)}</div>;
}
```

### Props Interface

```typescript
interface ComponentProps {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

// Use extends for HTML attributes
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}
```

### Hooks Typing

```typescript
// useState with explicit types
const [state, setState] = useState<User | null>(null);

// useRef for DOM elements
const inputRef = useRef<HTMLInputElement>(null);

// Custom hooks with return type inference
function useApi<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  // Implementation
  return { data, loading, error } as const;
}
```

## Type Definitions

### Utility Types

- Use `Pick`, `Omit`, `Partial` for object transformations
- `Record<K, V>` for key-value mappings
- `Exclude`, `Extract` for union manipulation

### Advanced Patterns

```typescript
// Conditional types
type ApiResponse<T> = T extends string ? string : T;

// Mapped types
type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Template literals
type EventName<T extends string> = `on${Capitalize<T>}`;
```

## JSX Elements

- Prefer `React.ReactElement` over `JSX.Element`
- Use `React.ComponentProps<typeof Component>` to extract props
- For children: `React.ReactNode` (not `React.ReactChildren`)

## Error Handling

```typescript
// Use discriminated unions for error states
type Result<T> = { success: true; data: T } | { success: false; error: string };
```

## Performance

- Use `React.memo` with proper prop comparison
- Prefer `useMemo` and `useCallback` with dependency arrays
- Use `React.lazy` for code splitting

Reference: https://github.com/microsoft/typescript for latest
