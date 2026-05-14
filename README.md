# NaijaGig Escrow

A milestone-based escrow platform for Nigeria's freelance and artisan economy. Clients lock USDC into non-custodial smart contracts on Stellar (Soroban) via the Trustless Work API. Funds release automatically when milestones are approved, with a built-in dispute flow for contested deliveries.

Built for the Boundless x Trustless Work Hackathon.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Escrow Lifecycle](#escrow-lifecycle)
- [API Reference](#api-reference)
- [Deployment](#deployment)
- [Contributing](#contributing)

---

## Overview

Nigerian freelancers and clients have no trustless mechanism for payment escrow. NaijaGig Escrow solves this by wrapping Trustless Work's Escrow-as-a-Service API around a familiar job-posting and milestone-tracking UX.

Core flows:

- Client creates a job with defined milestones and locks USDC on Stellar testnet/mainnet
- Freelancer submits milestone completions
- Client approves each milestone, triggering an on-chain fund release
- Either party can flag a dispute, which routes to a resolver

---

## Architecture

```mermaid
graph TD
    subgraph Client Layer
        A[Next.js Frontend<br>App Router + Tailwind CSS]
    end

    subgraph API Layer
        B[FastAPI Backend<br>Job and Milestone State]
        C[Trustless Work REST API<br>Escrow-as-a-Service]
    end

    subgraph Blockchain Layer
        D[Stellar Network<br>Soroban Smart Contracts]
        E[Freighter Wallet<br>Transaction Signing]
    end

    subgraph Data Layer
        F[PostgreSQL via NeonDB<br>Jobs, Users, Milestones]
        G[Redis<br>Session Cache and Job Queue]
    end

    A -->|REST calls| B
    A -->|Signs transactions| E
    B -->|Escrow operations| C
    C -->|Submits to chain| D
    E -->|Signs and broadcasts| D
    B -->|Reads and writes| F
    B -->|Caches| G
```

```mermaid
sequenceDiagram
    participant Client
    participant Frontend
    participant FastAPI
    participant TrustlessWork
    participant Stellar

    Client->>Frontend: Create job with milestones
    Frontend->>FastAPI: POST /jobs
    FastAPI->>TrustlessWork: Initialize escrow contract
    TrustlessWork->>Stellar: Deploy Soroban escrow
    Stellar-->>TrustlessWork: Contract address
    TrustlessWork-->>FastAPI: Escrow ID
    FastAPI-->>Frontend: Job created with escrow ref
    Client->>Frontend: Fund escrow (lock USDC)
    Frontend->>FastAPI: POST /escrow/:id/fund
    FastAPI->>TrustlessWork: Fund escrow
    TrustlessWork->>Stellar: Lock USDC on-chain
```

---

## Tech Stack

Frontend:
- Next.js 15 (App Router)
- Tailwind CSS 4
- Bootstrap Icons 1.11
- Freighter API (Stellar wallet)
- Trustless Work React SDK

Backend:
- Python FastAPI
- SQLAlchemy ORM
- Alembic migrations
- Redis (session cache, job queue)

Database:
- PostgreSQL hosted on NeonDB

Blockchain:
- Stellar Soroban smart contracts
- Trustless Work Escrow-as-a-Service API
- USDC on Stellar

Tooling:
- pnpm workspaces (monorepo)
- uv (Python dependency management)
- Turborepo
- Vercel (frontend deployment)
- Hugging Face Spaces (FastAPI deployment)

---

## Getting Started

**Prerequisites**

- Node.js v23+
- pnpm v9+
- Python 3.11+
- uv
- PostgreSQL (or NeonDB connection string)
- Redis instance
- Freighter browser extension
- Trustless Work API key

**Install**

```bash
git clone https://github.com/thetruesammyjay/naijagig-escrow
cd naijagig-escrow
pnpm install
```

**Setup Python backend**

```bash
cd apps/api
uv sync
```

**Run development servers**

```bash
# From root - starts all apps in parallel
pnpm dev
```

Frontend runs on `http://localhost:3000`
API runs on `http://localhost:8000`

---

## Environment Variables

**apps/web/.env.local**

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_TRUSTLESS_WORK_BASE_URL=https://dev.api.trustlesswork.com
```

**apps/api/.env**

```env
DATABASE_URL=postgresql://user:password@host/naijagig
REDIS_URL=redis://localhost:6379
TRUSTLESS_WORK_API_KEY=your_api_key_here
STELLAR_NETWORK=testnet
JWT_SECRET=your_jwt_secret
```

---

## Escrow Lifecycle

```
DRAFT -> FUNDED -> IN_PROGRESS -> MILESTONE_SUBMITTED -> APPROVED -> RELEASED
                                                       -> DISPUTED  -> RESOLVED
```

States:

- `DRAFT` - job created, escrow contract initialized, not yet funded
- `FUNDED` - client has locked USDC on-chain
- `IN_PROGRESS` - freelancer accepted, work has started
- `MILESTONE_SUBMITTED` - freelancer marked a milestone complete
- `APPROVED` - client approved the milestone, funds released for that milestone
- `DISPUTED` - either party flagged the milestone
- `RESOLVED` - dispute arbiter released or refunded
- `RELEASED` - all milestones approved, full job complete

---

## API Reference

All routes are prefixed with `/api/v1`.

**Auth**

```
POST /auth/register
POST /auth/login
POST /auth/refresh
```

**Jobs**

```
POST   /jobs                    - Create a job with milestones
GET    /jobs                    - List jobs (filtered by role)
GET    /jobs/:id                - Get job detail
PATCH  /jobs/:id                - Update job metadata
DELETE /jobs/:id                - Cancel job (pre-funding only)
```

**Escrow**

```
POST   /escrow/:job_id/fund             - Lock USDC into escrow
POST   /escrow/:job_id/milestone/:n/submit   - Submit milestone as complete
POST   /escrow/:job_id/milestone/:n/approve  - Approve milestone, release funds
POST   /escrow/:job_id/milestone/:n/dispute  - Flag dispute
GET    /escrow/:job_id/status           - Get on-chain escrow state
```

**Users**

```
GET    /users/me
PATCH  /users/me
GET    /users/:id/profile
```

Full Swagger docs available at `http://localhost:8000/docs` when running locally.

---

## Deployment

**Frontend (Vercel)**

```bash
pnpm --filter web build
vercel --prod
```

**API (Hugging Face Spaces)**

The FastAPI app is packaged as a Docker Space on Hugging Face. Push to the `hf-deploy` branch to trigger a build.

```bash
git push origin main:hf-deploy
```

**Database**

Migrations are managed with Alembic:

```bash
cd apps/api
uv run alembic upgrade head
```

---

## Contributing

1. Fork the repository
2. Create a feature branch off `main`
3. Follow the existing naming conventions (kebab-case for files, snake_case for Python, camelCase for TypeScript)
4. Open a PR with a clear description of the change and any relevant escrow flow it affects

---

## License

MIT