---
description: "Guidelines for Prisma ORM development in hexagonal architecture"
applyTo: "**/*.{ts,tsx,prisma}"
---

# Prisma ORM Development Guidelines

Use the `#githubRepo` tool with `prisma/prisma` to find relevant code snippets in the Prisma codebase.
Use the `#githubRepo` tool with `prisma/prisma` to answer questions about how Prisma is implemented.

## Base Configuration

### Installation and Setup
```bash
# Installation
npm install prisma @prisma/client

# Initialization
npx prisma init

# Client generation
npx prisma generate

# Migrations
npx prisma migrate dev --name init
npx prisma migrate deploy

# Prisma Studio
npx prisma studio
```

### File Structure
```
prisma/
├── schema.prisma       # Main schema
├── migrations/         # Migration history
└── seed.ts            # Seed script (optional)

src/
├── infrastructure/
│   └── database/
│       ├── prisma.ts       # Client instance
│       ├── repositories/   # Repository implementations
│       └── migrations/     # Custom scripts
```

## Schema Definition

### Client Configuration
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### Base Models
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relationships
  notes     Note[]
  notebooks Notebook[]

  @@map("users")
}

model Note {
  id        String   @id @default(cuid())
  title     String
  content   Json     // For PlateJS content
  color     String?
  isPinned  Boolean  @default(false)
  tags      String[] // Array of strings
  userId    String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relationships
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Indexes
  @@index([userId])
  @@index([createdAt])
  @@index([isPinned])
  @@map("notes")
}
```

### Advanced Types
```prisma
// Enums
enum NoteStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

// JSON for complex structures
model Page {
  id      String @id @default(cuid())
  title   String
  content Json   // PlateJS blocks
  blocks  Json[] // Array of blocks

  @@map("pages")
}

// Many-to-Many relationships
model Article {
  id   String @id @default(cuid())
  tags ArticleTag[]

  @@map("articles")
}

model Tag {
  id       String       @id @default(cuid())
  name     String       @unique
  articles ArticleTag[]

  @@map("tags")
}

model ArticleTag {
  articleId String
  tagId     String

  article Article @relation(fields: [articleId], references: [id])
  tag     Tag     @relation(fields: [tagId], references: [id])

  @@id([articleId, tagId])
  @@map("article_tags")
}
```

## Prisma Client and Connection

### Client Configuration
```typescript
// src/infrastructure/database/prisma.ts
import { PrismaClient } from '@/generated/prisma'

declare global {
  var __prisma: PrismaClient | undefined
}

export const prisma = globalThis.__prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma
}

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})
```

### Edge Runtime Configuration
```typescript
// For Vercel Edge Runtime
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

const prisma = new PrismaClient({
  datasourceUrl: env.DATABASE_URL,
}).$extends(withAccelerate())
```

## Repository Implementation

### Domain Interface (Port)
```typescript
// features/quicknotes/domain/ports/note-repository.port.ts
export interface NoteRepositoryPort {
  findAll(userId: string): Promise<Note[]>
  findById(id: string): Promise<Note | null>
  create(data: CreateNoteDTO): Promise<Note>
  update(id: string, data: UpdateNoteDTO): Promise<Note>
  delete(id: string): Promise<void>
  search(query: string, userId: string): Promise<Note[]>
  findByTags(tags: string[], userId: string): Promise<Note[]>
}
```

### Repository Implementation
```typescript
// features/quicknotes/infrastructure/repositories/prisma-note.repository.ts
import { injectable } from 'tsyringe'
import { prisma } from '@/infrastructure/database/prisma'
import { NoteRepositoryPort } from '../../domain/ports/note-repository.port'
import { Note } from '../../domain/entities/note.entity'
import { CreateNoteDTO, UpdateNoteDTO } from '../../application/dtos'
import { PrismaNoteToDomainMapper } from '../mappers/prisma-note-to-domain.mapper'

@injectable()
export class PrismaNoteRepository implements NoteRepositoryPort {
  async findAll(userId: string): Promise<Note[]> {
    const notes = await prisma.note.findMany({
      where: { userId },
      orderBy: [
        { isPinned: 'desc' },
        { updatedAt: 'desc' }
      ]
    })

    return notes.map(PrismaNoteToDomainMapper.map)
  }

  async findById(id: string): Promise<Note | null> {
    const note = await prisma.note.findUnique({
      where: { id },
      include: {
        user: true // If needed
      }
    })

    return note ? PrismaNoteToDomainMapper.map(note) : null
  }

  async create(data: CreateNoteDTO): Promise<Note> {
    const note = await prisma.note.create({
      data: {
        title: data.title,
        content: data.content,
        color: data.color,
        tags: data.tags || [],
        userId: data.userId,
      }
    })

    return PrismaNoteToDomainMapper.map(note)
  }

  async update(id: string, data: UpdateNoteDTO): Promise<Note> {
    const note = await prisma.note.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.content && { content: data.content }),
        ...(data.color !== undefined && { color: data.color }),
        ...(data.tags && { tags: data.tags }),
        ...(data.isPinned !== undefined && { isPinned: data.isPinned }),
        updatedAt: new Date(),
      }
    })

    return PrismaNoteToDomainMapper.map(note)
  }

  async delete(id: string): Promise<void> {
    await prisma.note.delete({
      where: { id }
    })
  }

  async search(query: string, userId: string): Promise<Note[]> {
    const notes = await prisma.note.findMany({
      where: {
        userId,
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { content: { path: ['ops'], array_contains: [{ insert: { contains: query } }] } }
        ]
      },
      orderBy: { updatedAt: 'desc' }
    })

    return notes.map(PrismaNoteToDomainMapper.map)
  }

  async findByTags(tags: string[], userId: string): Promise<Note[]> {
    const notes = await prisma.note.findMany({
      where: {
        userId,
        tags: {
          hasSome: tags
        }
      },
      orderBy: { updatedAt: 'desc' }
    })

    return notes.map(PrismaNoteToDomainMapper.map)
  }
}
```

## Data Mappers

### Prisma to Domain Mapper
```typescript
// features/quicknotes/infrastructure/mappers/prisma-note-to-domain.mapper.ts
import { Note as PrismaNote } from '@/generated/prisma'
import { Note } from '../../domain/entities/note.entity'

export class PrismaNoteToDomainMapper {
  static map(prismaNote: PrismaNote): Note {
    return new Note({
      id: prismaNote.id,
      title: prismaNote.title,
      content: prismaNote.content,
      color: prismaNote.color,
      isPinned: prismaNote.isPinned,
      tags: prismaNote.tags,
      userId: prismaNote.userId,
      createdAt: prismaNote.createdAt,
      updatedAt: prismaNote.updatedAt,
    })
  }
}
```

## Transactions and Performance

### Transactions
```typescript
// Use transactions for complex operations
async createNotebookWithSections(data: CreateNotebookDTO): Promise<Notebook> {
  return await prisma.$transaction(async (tx) => {
    const notebook = await tx.notebook.create({
      data: {
        title: data.title,
        description: data.description,
        userId: data.userId,
      }
    })

    const sections = await Promise.all(
      data.sections.map((section, index) =>
        tx.section.create({
          data: {
            title: section.title,
            notebookId: notebook.id,
            order: index,
          }
        })
      )
    )

    return PrismaNotebookToDomainMapper.map({ ...notebook, sections })
  })
}
```

### Query Optimizations
```typescript
// Include relationships selectively
async findNotebookWithSections(id: string): Promise<Notebook | null> {
  const notebook = await prisma.notebook.findUnique({
    where: { id },
    include: {
      sections: {
        orderBy: { order: 'asc' },
        include: {
          pages: {
            orderBy: { order: 'asc' },
            select: {
              id: true,
              title: true,
              createdAt: true,
              // Don't include content for performance
            }
          }
        }
      }
    }
  })

  return notebook ? PrismaNotebookToDomainMapper.map(notebook) : null
}

// Efficient pagination
async findNotesPaginated(
  userId: string,
  page: number = 1,
  limit: number = 20
): Promise<{ notes: Note[]; total: number }> {
  const [notes, total] = await Promise.all([
    prisma.note.findMany({
      where: { userId },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { updatedAt: 'desc' }
    }),
    prisma.note.count({
      where: { userId }
    })
  ])

  return {
    notes: notes.map(PrismaNoteToDomainMapper.map),
    total
  }
}
```

## Migrations and Schema Evolution

### Migration Conventions
```bash
# Descriptive naming
npx prisma migrate dev --name add_user_preferences_table
npx prisma migrate dev --name update_note_content_structure
npx prisma migrate dev --name add_indexes_for_search

# Reset database (development)
npx prisma migrate reset

# Deploy to production
npx prisma migrate deploy
```

### Custom Migration Script
```typescript
// prisma/migrations/20241224000000_custom_data_migration/migration.sql
-- CreateTable
CREATE TABLE "user_preferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "theme" TEXT NOT NULL DEFAULT 'light',
    "language" TEXT NOT NULL DEFAULT 'en',

    CONSTRAINT "user_preferences_pkey" PRIMARY KEY ("id")
);

-- Manual data migration
-- UPDATE notes SET content = '{"type":"doc","content":[]}' WHERE content IS NULL;
```

### Schema Backup and Restore
```bash
# Schema backup
npx prisma db pull --preview-feature

# Introspect existing database
npx prisma db pull

# Generate client after changes
npx prisma generate
```

## Seed Data

### Seed Script
```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create test user
  const testUser = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test User',
    },
  })

  // Create sample notes
  const sampleNotes = [
    {
      title: 'Welcome Note',
      content: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Welcome to the app!' }] }] },
      color: 'blue',
      tags: ['welcome', 'getting-started'],
      userId: testUser.id,
    },
    {
      title: 'Todo List',
      content: { type: 'doc', content: [] },
      color: 'yellow',
      tags: ['todo', 'tasks'],
      isPinned: true,
      userId: testUser.id,
    },
  ]

  for (const note of sampleNotes) {
    await prisma.note.upsert({
      where: { title: note.title },
      update: {},
      create: note,
    })
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

## Testing with Prisma

### Test Database Setup
```typescript
// src/infrastructure/database/test-prisma.ts
import { PrismaClient } from '@/generated/prisma'
import { execSync } from 'child_process'

export const testPrisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.TEST_DATABASE_URL || process.env.DATABASE_URL
    }
  }
})

export async function setupTestDatabase() {
  await testPrisma.$connect()

  // Reset database for each test
  await testPrisma.$executeRaw`TRUNCATE TABLE "notes", "users" RESTART IDENTITY CASCADE`
}

export async function teardownTestDatabase() {
  await testPrisma.$disconnect()
}
```

### Repository Tests
```typescript
// features/quicknotes/infrastructure/__tests__/prisma-note.repository.spec.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { PrismaNoteRepository } from '../repositories/prisma-note.repository'
import { setupTestDatabase, teardownTestDatabase, testPrisma } from '@/infrastructure/database/test-prisma'

describe('PrismaNoteRepository', () => {
  let repository: PrismaNoteRepository
  let testUserId: string

  beforeEach(async () => {
    await setupTestDatabase()
    repository = new PrismaNoteRepository()

    // Create test user
    const user = await testPrisma.user.create({
      data: { email: 'test@example.com', name: 'Test User' }
    })
    testUserId = user.id
  })

  afterEach(async () => {
    await teardownTestDatabase()
  })

  it('should create a note', async () => {
    const noteData = {
      title: 'Test Note',
      content: { type: 'doc', content: [] },
      tags: ['test'],
      userId: testUserId,
    }

    const note = await repository.create(noteData)

    expect(note.title).toBe('Test Note')
    expect(note.userId).toBe(testUserId)
    expect(note.tags).toEqual(['test'])
  })

  it('should find notes by user', async () => {
    // Create test notes
    await testPrisma.note.createMany({
      data: [
        { title: 'Note 1', content: {}, userId: testUserId },
        { title: 'Note 2', content: {}, userId: testUserId },
      ]
    })

    const notes = await repository.findAll(testUserId)

    expect(notes).toHaveLength(2)
    expect(notes[0].title).toBe('Note 1')
  })
})
```

## Mandatory Practices

### Naming Conventions
- **Models**: PascalCase (`User`, `Note`, `Notebook`)
- **Fields**: camelCase (`createdAt`, `isPinned`, `userId`)
- **Tables**: snake_case with @@map (`users`, `quick_notes`)
- **Indexes**: Descriptive (`@@index([userId], name: "idx_notes_user")`)

### Relationships
- Always define `onDelete` and `onUpdate` actions
- Use `Cascade` for parent-child dependencies
- Use `SetNull` for optional relationships
- Prefer explicit relationships over implicit ones

### Performance
- Add indexes for frequently searched fields
- Use `select` to limit returned fields
- Implement pagination in listings
- Use transactions for multi-table operations
- Configure connection pooling appropriately

### Security
- Never expose Prisma data directly in API
- Always use mappers between layers
- Validate input before queries
- Use Row Level Security when applicable
- Configure logs only for development

## Avoid

### Anti-patterns
- ❌ Using Prisma Client directly in Use Cases
- ❌ Exposing Prisma types in domain layer
- ❌ N+1 queries without include/select
- ❌ Unnecessary transactions for simple operations
- ❌ Migrations without backup in production
- ❌ Seeds with sensitive data
- ❌ Schema without appropriate validations

### Common Issues
- ❌ Not using connection pooling
- ❌ Queries without appropriate indexes
- ❌ Relationships without cascade rules
- ❌ Untested migrations
- ❌ Global client without singleton pattern

## Useful Commands

```bash
# Regenerate client after changes
npx prisma generate

# Visualize database
npx prisma studio

# Complete reset (development)
npx prisma migrate reset

# Deploy migrations (production)
npx prisma migrate deploy

# Validate schema
npx prisma validate

# Format schema
npx prisma format

# Introspect database
npx prisma db pull

# Push schema without migration
npx prisma db push

# Seed database
npx prisma db seed
```

## Next.js 15 Integration

### Server Actions
```typescript
// app/api/notes/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { container } from '@/core/di/container'
import { CreateNoteUseCase } from '@/features/quicknotes/application/use-cases/create-note.use-case'

export async function createNoteAction(data: CreateNoteDTO) {
  const createNoteUseCase = container.resolve(CreateNoteUseCase)

  try {
    const note = await createNoteUseCase.execute(data)
    revalidatePath('/notes')
    return { success: true, data: note }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
```

### Edge Runtime
For edge functions, use `@prisma/client/edge` with Prisma Accelerate:

```typescript
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

const prisma = new PrismaClient().$extends(withAccelerate())

export const runtime = 'edge'
```

Official reference: [Prisma Documentation](https://www.prisma.io/docs)