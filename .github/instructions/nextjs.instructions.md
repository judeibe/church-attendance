---
description: 'Guidelines for building NextJS + ShadCN Start applications'
applyTo: '**/*.ts, **/*.tsx, **/*.js, **/*.jsx, **/*.css, **/*.scss, **/*.json'
---

# Next.js + Tailwind CSS + shadcn/ui Development Guide

You are an expert TypeScript developer specializing in Next.js applications with modern React patterns.

## Tech Stack

- TypeScript (strict mode)
- Next.js 14+ (App Router)
- shadcn/ui (UI components)
- Tailwind CSS (styling)
- Zod (validation)
- Next.js built-in data fetching

## Code Style Rules

- NEVER use `any` type - always use proper TypeScript types
- Prefer Server Components over Client Components when possible
- Always validate external data with Zod schemas
- Use proper error boundaries and loading states
- Follow accessibility best practices with ARIA attributes
- Leverage Next.js caching strategies appropriately

## Component Patterns

Use Server Components by default, Client Components when needed:

```typescript
// Server Component (default)
interface UserListProps {
  users: User[];
}

export default function UserList({ users }: UserListProps) {
  return (
    <div className="grid gap-4">
      {users.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}

// Client Component (when interactivity is needed)
'use client';

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export default function Button({ children, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button onClick={onClick} className={cn(buttonVariants({ variant }))}>
      {children}
    </button>
  );
}
```

## Data Fetching

Use Server Components for initial data, Client Components for interactions:

```typescript
// Server Component with data fetching
export default async function UsersPage() {
  const users = await fetchUsers();
  const validatedUsers = userListSchema.parse(users);
  
  return (
    <div>
      <h1>Users</h1>
      <UserList users={validatedUsers} />
    </div>
  );
}

// Client Component for dynamic data
'use client';

import { useEffect, useState } from 'react';

export default function UserStats({ userId }: { userId: string }) {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserStats(userId)
      .then(data => setStats(userStatsSchema.parse(data)))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <UserStatsSkeleton />;
  
  return <UserStatsDisplay stats={stats} />;
}
```

## App Router Structure

Use the App Router with proper file conventions:

```test
app/
├── globals.css
├── layout.tsx        # Root layout
├── page.tsx          # Home page
├── loading.tsx       # Loading UI
├── error.tsx         # Error UI
├── not-found.tsx     # 404 page
├── users/
│   ├── page.tsx      # /users
│   ├── loading.tsx   # Loading for /users
│   └── [id]/
│       ├── page.tsx  # /users/[id]
│       └── loading.tsx
└── api/
    └── users/
        └── route.ts  # API route
```

## Route Handlers (API Routes)

Create API routes using the new App Router conventions:

```typescript
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { userSchema } from '@/lib/schemas';

export async function GET() {
  try {
    const users = await fetchUsers();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedUser = userSchema.parse(body);
    const user = await createUser(validatedUser);
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.format() }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

## Zod Validation

Always validate external data. Define schemas in `lib/schemas.ts`:

```typescript
import { z } from 'zod';

export const userSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(100),
  email: z.string().email().optional(),
  role: z.enum(['admin', 'user']).default('user'),
  createdAt: z.coerce.date(),
});

export const userListSchema = z.array(userSchema);
export const userStatsSchema = z.object({
  totalPosts: z.number(),
  totalLikes: z.number(),
  joinedDays: z.number(),
});

export type User = z.infer<typeof userSchema>;
export type UserStats = z.infer<typeof userStatsSchema>;

// Safe parsing with error handling
export function parseUser(data: unknown): User | null {
  const result = userSchema.safeParse(data);
  if (!result.success) {
    console.error('User validation failed:', result.error.format());
    return null;
  }
  return result.data;
}
```

## Loading and Error States

Use Next.js conventions for loading and error states:

```typescript
// app/users/loading.tsx
export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  );
}

// app/users/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
      <h2 className="text-xl font-semibold text-red-600">Something went wrong!</h2>
      <p className="text-muted-foreground">{error.message}</p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
```

## UI Components

Always prefer shadcn/ui components over custom ones:

```typescript
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function UserCard({ user }: { user: User }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {user.name}
          <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
            {user.role}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {user.email && (
          <p className="text-sm text-muted-foreground">{user.email}</p>
        )}
        <div className="mt-4 flex gap-2">
          <Button size="sm">Edit</Button>
          <Button size="sm" variant="outline">View</Button>
        </div>
      </CardContent>
    </Card>
  );
}
```

## Forms with Server Actions

Use Next.js Server Actions for form handling:

```typescript
// app/users/create/page.tsx
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { userSchema } from '@/lib/schemas';

async function createUser(formData: FormData) {
  'use server';
  
  const rawData = {
    name: formData.get('name'),
    email: formData.get('email'),
    role: formData.get('role'),
  };

  const validatedData = userSchema.parse(rawData);
  await saveUser(validatedData);
  redirect('/users');
}

export default function CreateUserPage() {
  return (
    <form action={createUser} className="space-y-4 max-w-md">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" required />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" />
      </div>
      <Button type="submit">Create User</Button>
    </form>
  );
}
```

## Responsive Design with Tailwind

Use Tailwind's responsive utilities effectively:

```typescript
<div className="grid gap-4 md:gap-6 lg:gap-8">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {items.map(item => (
      <Card key={item.id} className="w-full">
        <CardContent className="p-4 md:p-6">
          <h3 className="text-lg md:text-xl font-semibold">{item.title}</h3>
          <p className="text-sm md:text-base text-muted-foreground mt-2">
            {item.description}
          </p>
        </CardContent>
      </Card>
    ))}
  </div>
</div>
```

## Accessibility

Use semantic HTML first, minimal ARIA when needed:

```typescript
// ✅ Good: Semantic HTML
<nav aria-label="Main navigation">
  <ul className="flex space-x-4">
    <li><Link href="/" className="hover:underline">Home</Link></li>
    <li><Link href="/users" className="hover:underline">Users</Link></li>
  </ul>
</nav>

// ✅ Good: Form with proper labels
<form className="space-y-4">
  <div>
    <Label htmlFor="email">Email Address</Label>
    <Input 
      id="email" 
      type="email" 
      required 
      aria-describedby="email-error"
    />
    {errors.email && (
      <p id="email-error" role="alert" className="text-sm text-red-600 mt-1">
        {errors.email}
      </p>
    )}
  </div>
</form>

// ✅ Good: Interactive elements with proper states
<Button 
  aria-expanded={isOpen}
  aria-controls="dropdown-menu"
  onClick={toggleDropdown}
>
  <span>Options</span>
  <ChevronDown className={cn("ml-2 h-4 w-4 transition-transform", {
    "rotate-180": isOpen
  })} />
</Button>
```

## File Organization

```text
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── (auth)/          # Route groups
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/
│   │   ├── page.tsx
│   │   └── users/
│   └── api/
├── components/
│   ├── ui/              # shadcn/ui components
│   └── custom/          # Custom components
├── lib/
│   ├── schemas.ts       # Zod schemas
│   ├── utils.ts         # Utility functions
│   └── db.ts            # Database utilities
└── types/
    └── index.ts         # TypeScript types
```

## Import Standards

Use `@/` alias for all internal imports:

```typescript
// ✅ Good
import { Button } from '@/components/ui/button';
import { userSchema } from '@/lib/schemas';
import { cn } from '@/lib/utils';

// ❌ Bad
import { Button } from '../components/ui/button';
import { userSchema } from '../../lib/schemas';
```

## Adding Components

Install shadcn/ui components when needed:

```bash
npx shadcn@latest add button card input dialog form
```

## Metadata and SEO

Use Next.js metadata API for SEO:

```typescript
// app/users/[id]/page.tsx
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const user = await fetchUser(params.id);
  
  return {
    title: `${user.name} - User Profile`,
    description: `View ${user.name}'s profile and information`,
  };
}

export default async function UserPage({ params }: { params: { id: string } }) {
  const user = await fetchUser(params.id);
  return <UserProfile user={user} />;
}
```

## Common Patterns

- Use Server Components by default, Client Components when needed
- Always validate external data with Zod
- Leverage Next.js caching and revalidation
- Use Server Actions for form submissions
- Include proper loading and error states
- Prefer shadcn/ui components over custom UI
- Use `@/` imports consistently
- Follow accessibility best practices
- Structure routes with App Router conventions
- Use TypeScript strictly with proper interfaces
