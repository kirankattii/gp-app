# Green Peddle (gp-app)

Welcome to the **Green Peddle** core application repository (`gp-app`). This document provides an overview of the platform's architecture, functionality, and purpose.

## Architecture Overview

### 1. Frontend (Client)

The frontend is a modern React application built with **Next.js**, focused on high performance, SEO optimization, and a highly responsive user experience. 

- **Framework**: Next.js (App Router) combined with React 19.
- **Language**: TypeScript for strict typing and improved DX.
- **Styling**: Tailwind CSS v4 alongside Shadcn UI and Radix UI primitives for a sleek, accessible, and customizable component system.
- **State Management**:
  - Global UI/Auth State: `zustand`
  - Server State/Caching: `@tanstack/react-query`
- **Data Fetching**: `axios` with configured interceptors for token management and refreshing.
- **Form Handling & Validation**: `react-hook-form` paired with `zod` and `yup`.
- **Authentication**: Custom JWT-based authentication combined with Next-Auth for seamless session management.

**Key Frontend Architectural Patterns:**
- **Component-Driven UI**: UIs are modular, adopting responsive designs (like desktop-to-mobile view switches for data tables/cards).
- **Service Layer Abstraction**: API calls are strictly encapsulated in a `services/` layer (e.g., `SellerService`), separating UI from data fetching logic.
- **Protected Routes**: Use of middleware and higher-order components to enforce route guards (e.g., restricting access based on a Seller's approval status).

### 2. Backend (Server)

The backend is a robust RESTful API built on **Node.js** and **Express**, designed to handle the heavy lifting, asynchronous tasks, and database interactions securely.

- **Framework**: Express.js (Node.js).
- **Language**: TypeScript for end-to-end type safety.
- **Database**: PostgreSQL, managed via **Prisma ORM**.
- **Caching & Background Jobs**: Redis and BullMQ are utilized to offload heavy asynchronous tasks and manage background job queues smoothly.
- **Authentication & Security**: 
  - JWT integration for stateless authentication streams.
  - Route protections, `helmet` and `cors`, alongside rate limiters.
  - Role-Based Access Control (RBAC) separating Buyers, Sellers, and Admins.
- **File & Media Handling**: Handled locally via `multer` and integrated with **Cloudinary** / **AWS S3** pipelines for persistent media storage.
- **Mailing**: `nodemailer` handles notifications and OTP routines.

**Key Backend Architectural Patterns:**
- **Layered Architecture**: Clear separation of routing, controllers, middleware (auth verification), and business logic.
- **Automated Queuing**: BullMQ delegates background tasks (e.g., email dispatch, deep processing) to avoid blocking the Express event loop.

## Platform Functionality

1. **Authentication & Authorization**:
   - Secure login, registration, and OTP flows.
   - Distinct session handling identifying different role lifecycles (Buyer vs. Pending Seller vs. Approved Seller).
   
2. **Seller Ecosystem & Dashboard**:
   - **Profile Management**: Profile status tracking mechanism (Pending, Approved, Rejected).
   - **Product Catalog Management**: Modules handling responsive summary cards, filtering, list rendering, and adding/editing items dynamically.
   - **Real-time Status Sync**: Automated token/session interception updates status changes continuously from backend to frontend.
   
3. **Core API / System Jobs**:
   - Secure media uploading and dynamic storage via Cloudinary.
   - Scalable background processes for dispatching systemic notifications.
   - Optimized search, filtering, and data aggregation for the product catalog.

## Folder Structure & Rationale

### Common Architecture Focus
The application prioritizes **Separation of Concerns**, **Domain-Driven Design**, and **Scalability**. By strictly defining responsibilities across folders, the codebase remains approachable and testable even as feature sets expand.

#### Client (`/client`)
```text
client/
├── app/          # Next.js App Router (Pages, Layouts, API routes)
├── components/   # Reusable UI components (Shadcn, generic components)
├── hooks/        # Custom React hooks (e.g., useAuth)
├── lib/          # Utility functions and configurations
├── public/       # Static assets (images, icons)
├── schemas/      # Validation schemas (Zod, Yup)
├── services/     # API service classes (axios instances, endpoints)
├── store/        # Zustand global state management
└── types/        # TypeScript interfaces and type definitions
```
**Why this structure?**
- **Decoupled Logic**: UI components are kept clean while `services/` handles API interactions and `store/` manages global application state.
- **Feature-Ready**: `schemas/` ensures consistency across forms, and the explicit `types/` folder reinforces strict TypeScript typing across the platform.

#### Server (`/server`)
```text
server/
├── prisma/       # Database schema and migrations
├── src/
│   ├── config/       # Environment variables & system configuration
│   ├── middlewares/  # Express middlewares (Auth, validation, error handling)
│   ├── modules/      # Domain-driven features (auth, user, product, admin, seller)
│   ├── routes/       # Centralized API route definitions
│   ├── utils/        # Reusable helper functions
│   ├── validations/  # Request validation schemas (Zod)
│   └── types/        # TypeScript declarations
└── uploads/      # Local staging for file uploads
```
**Why this structure?**
- **Domain-Driven Design (DDD)**: Grouping logic into `modules/` isolates capabilities into self-contained units (e.g., the `seller` module owns its specific services and controllers).
- **Security & Reusability**: Centralized `middlewares/` allows universal application of authentication and data parsing, protecting all API endpoints easily.

## Performance Optimizations

Both the frontend and backend are engineered to handle high traffic and ensure low latency for buyers and sellers:

1. **Frontend Performance**:
   - **Data Caching & Fast Re-fetching**: `@tanstack/react-query` handles heavy caching, stale-while-revalidate mechanisms, and pagination states to drastically minimize unnecessary server requests.
   - **Server-Side Rendering (SSR)**: Utilizing the Next.js App Router delivers lightweight, pre-rendered HTML to the client for faster First Contentful Paint (FCP) and better SEO.
   - **Optimistic UI Updates**: Leveraging Zustand for global state and React Query ensures the UI reacts instantly to user actions while syncing securely in the background.

2. **Backend Performance**:
   - **Job Queues (BullMQ + Redis)**: Heavy tasks like image transformations (Cloudinary), order processing, and mass email dispatching are offloaded from the main Express thread to prevent blocking.
   - **Database Efficiency**: Prisma interacts with heavily indexed PostgreSQL tables. For expensive data aggregations, Redis layers provide fast in-memory caching.
   - **Compression & Rate Limiting**: Integration of payload `compression` reduces JSON transfer sizes, while strict rate-limiting prevents API abuse, maintaining overall system stability.

## Development & Operations

- **Containerization**: `docker-compose.yml` encapsulates interdependent services (such as databases and caching layers) for consistent local environments.
- **Type Checking & Linting**: ESLint and TypeScript compilation rigorously enforce codebase consistency across both ends.
