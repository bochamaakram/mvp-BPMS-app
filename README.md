# BPMS MVP

Minimal Business Process Management System built with React, Node.js/Express, and PostgreSQL.

## Quick Start

```bash
# 1. Copy environment template
cp .env.example .env

# 2. Edit .env with your database credentials

# 3. Run the schema on your database
# (Already done for Supabase)

# 4. Start services
docker-compose up -d
```

## Access

- **Frontend**: http://localhost:5173
- **API**: http://localhost:3000/api

## Features

- ✅ Multi-tenant authentication (organizations)
- ✅ Process definition with steps
- ✅ Conditional workflow rules
- ✅ Process instance execution
- ✅ Status tracking (Pending → Approved/Rejected)
- ✅ AI summary generation

## Tech Stack

- Frontend: React 18 + Vite
- Backend: Node.js + Express
- Database: PostgreSQL (Supabase)
- Deployment: Docker Compose
