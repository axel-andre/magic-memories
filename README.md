# Magic Memories

A social memory-sharing platform where users create and publish collections of memories (photos with descriptions) called "Magic Memories". Share your cherished moments in beautiful polaroid-style galleries with the world.

## Features

- **Create & Share Memory Collections**: Organize photos and stories into themed "Memory Lanes"
- **Beautiful Polaroid Gallery**: Display memories in an elegant polaroid-style layout with animations
- **User Authentication**: Secure sign-up and login with persistent sessions
- **Draft & Publish**: Create private drafts, then publish to share with the world
- **Public Discovery**: Browse and explore memory lanes from all users
- **User Profiles**: View all published memories from specific users
- **Image Upload**: Store photos securely with Cloudflare R2
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Modern UI**: Built with Tailwind CSS and shadcn/ui components

## Tech Stack

### Frontend
- **Framework**: [TanStack Start](https://tanstack.com/start) - Full-stack React framework
- **React**: v19 with modern hooks and concurrent features
- **Routing**: TanStack Router with file-based routing
- **State Management**: TanStack Query for server state management
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui built on Radix UI primitives
- **Icons**: Lucide React icon library

### Backend
- **Runtime**: Cloudflare Workers
- **Database**: Cloudflare D1 (SQLite) with Drizzle ORM
- **Authentication**: Better Auth with Drizzle adapter
- **File Storage**: Cloudflare R2 for image storage
- **API**: TanStack Start server functions (type-safe)

### Development & Deployment
- **Build Tool**: Vite with TypeScript
- **Package Manager**: pnpm
- **Database Migrations**: Drizzle Kit
- **Deployment**: Cloudflare Workers/Pages
- **Development**: Hot reload with Cloudflare local development

## Prerequisites

- **Node.js**: Version 18 or higher
- **pnpm**: Package manager
- **Cloudflare Account**: For deployment and services (D1, R2, Workers)

## Getting Started

### 1. Clone and Install

```bash
git clone <repository-url>
cd memory-lane
pnpm install
```

### 2. Environment Setup

Create a `.env` file in the project root with the following variables:

```env
# Development
BETTER_AUTH_URL=http://localhost:3000

# Production (for deployment)
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_DATABASE_ID=your_database_id
CLOUDFLARE_D1_TOKEN=your_d1_token
```

### 3. Database Setup

```bash
# Generate database migrations
pnpm db:generate

# Apply migrations locally
pnpm db:apply:local

# Alternative: Complete setup in one command
pnpm db:setup:local
```

### 4. Authentication Setup

```bash
# Generate Better Auth schema
pnpm auth:generate
```

### 5. Start Development Server

```bash
# Standard development server (port 3000)
pnpm dev

# Or use Cloudflare development environment
pnpm dev:cf
```

The application will be available at `http://localhost:3000`.

### 6. Database Studio (Optional)

```bash
# Open Drizzle Studio for database management
pnpm studio

# Or for local development database
pnpm studio:dev
```

## Architecture

### Project Structure

```
src/
├── routes/                 # TanStack Router file-based routes
│   ├── __root.tsx         # Root layout and providers
│   ├── index.tsx          # Home page with memory lanes feed
│   ├── sign-in.tsx        # Authentication pages
│   ├── sign-up.tsx
│   ├── memory-lanes/      # Memory lane routes
│   │   └── $id/
│   │       ├── index.tsx  # Memory lane detail view
│   │       └── edit.tsx   # Memory lane editing
│   ├── users/             # User profile routes
│   │   └── $id/index.tsx  # User profile view
│   └── api/               # API routes
│       ├── auth/          # Authentication endpoints
│       └── files/         # File upload endpoints
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── MemoryGallery.tsx # Polaroid gallery component
│   ├── MemoryLanesFeed.tsx # Home feed component
│   ├── UserProfileFeed.tsx # User profile feed
│   ├── PublicationControls.tsx # Publication status controls
│   └── ...               # Other feature components
├── db/                   # Database schemas
│   ├── schema.ts         # Main schema exports
│   ├── auth-schema.ts    # Better Auth schema
│   └── memory-lane-schema.ts # Memory lane entities
├── utils/                # Utility functions
│   ├── server/           # Server-side utilities
│   │   ├── memories/     # Memory CRUD operations
│   │   ├── users/        # User operations
│   │   ├── services/     # External services (image storage)
│   │   └── auth.ts       # Authentication setup
│   ├── auth.ts           # Client-side auth utilities
│   ├── errors.ts         # Error handling
│   └── validation.ts     # Form validation schemas
├── hooks/                # Custom React hooks
│   ├── useMemoryLaneState.ts # Memory lane state management
│   ├── useInfiniteScroll.ts  # Infinite scroll hook
│   └── useIntersectionObserver.ts # Animation triggers
└── styles/               # Global styles
    └── app.css           # Tailwind CSS imports
```

### Key Architecture Patterns

#### 1. File-Based Routing
- Routes are automatically generated from the file structure
- Type-safe routing with automatic params and search validation
- Nested layouts with shared components

#### 2. Server Functions
- Type-safe API calls using TanStack Start server functions
- Automatic serialization and deserialization
- Shared types between client and server

#### 3. Data Fetching
- TanStack Query for caching and synchronization
- Infinite queries for paginated feeds
- Optimistic updates for better UX

#### 4. Database Layer
- Drizzle ORM for type-safe database operations
- Migrations managed with Drizzle Kit
- Relations and constraints defined in schema

#### 5. Authentication Flow
- Better Auth handles session management
- Secure cookie-based authentication
- Protected routes with automatic redirects

### Database Schema

```sql
-- Users (managed by Better Auth)
user (
  id, name, email, email_verified, image, created_at, updated_at
)

-- Memory Lanes
memory_lane (
  id, name, user_id, status, created_at, updated_at
)

-- Individual Memories
memory (
  id, memory_lane_id, title, content, image, date
)
```

**Status Values**:
- `draft`: Private, only visible to owner
- `published`: Public, visible to everyone
- `archived`: Soft deleted, hidden from feeds

## Deployment

### 1. Build for Production

```bash
pnpm build
```

### 2. Deploy to Cloudflare

```bash
pnpm deploy
```

### 3. Environment Configuration

Update `wrangler.jsonc` with your production values:

```jsonc
{
  "env": {
    "production": {
      "vars": {
        "BETTER_AUTH_URL": "https://your-app.workers.dev"
      },
      "d1_databases": [{
        "binding": "db_app",
        "database_name": "db_app",
        "database_id": "your-production-db-id"
      }],
      "r2_buckets": [{
        "binding": "IMAGE_BUCKET",
        "bucket_name": "your-images-bucket"
      }]
    }
  }
}
```

### 4. Required Cloudflare Resources

- **D1 Database**: For application data storage
- **R2 Bucket**: For image storage
- **Workers**: For application hosting
- **Custom Domain**: (Optional) For production URL

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server (port 3000) |
| `pnpm dev:cf` | Start Cloudflare development environment |
| `pnpm build` | Build for production |
| `pnpm preview` | Preview production build locally |
| `pnpm deploy` | Deploy to Cloudflare Workers |
| `pnpm studio` | Open Drizzle Studio for database management |
| `pnpm studio:dev` | Open Drizzle Studio for local database |
| `pnpm db:generate` | Generate database migrations |
| `pnpm db:apply:local` | Apply migrations to local database |
| `pnpm db:setup:local` | Complete local database setup |
| `pnpm auth:generate` | Generate Better Auth schema |
| `pnpm cf-typegen` | Generate Cloudflare Workers types |

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [TanStack](https://tanstack.com/) for the amazing React ecosystem
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Better Auth](https://better-auth.com/) for authentication
- [Cloudflare](https://cloudflare.com/) for hosting and services
- [Drizzle](https://orm.drizzle.team/) for type-safe database operations