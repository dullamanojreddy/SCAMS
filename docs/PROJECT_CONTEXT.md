# Campus OS — Project Context & Persistent System Memory

## 1. Project Overview
- **Product Name**: Campus OS
- **Tagline**: Smart Campus. Smarter You.
- **Vision**: A unified, startup-grade Gen-Z digital operating platform connecting every campus service for students, faculty, food vendors, maintenance staff, and administrators into one synchronized ecosystem ("One campus. One application. Every campus service connected.").
- **Core Philosophy**: A real, connected product combining consumer-grade UX, campus operating system power, and productivity tools — not a traditional college ERP, CRUD dashboard, or government portal.

## 2. Technology Stack
- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide React, Motion, Canvas Confetti.
- **Backend Architecture**: Layered, modular Express architecture (Routes → Middleware → Controllers → Services → Repositories → Data Store).
- **AI & Intelligence**: `@google/genai` (Gemini 3.7 Flash) with deterministic tool routing, confirmation action flows, and strict domain service boundaries.
- **Security & Authorization**: Role-Based Access Control (RBAC) with `STUDENT`, `FACULTY`, `VENDOR`, `MAINTENANCE`, `ADMIN` permission matrices, short-lived tokens, rate limiting, and request ID tracking.

## 3. Backend Layered Architecture (Parts 6 & 7 Implemented)
```text
server/
├── src/
│   ├── app.js                          # Express app bootstrap & v1 route mounts
│   ├── config/
│   │   ├── env.js                      # Centralized configuration & defaults
│   │   ├── cors.js                     # Secure CORS policy
│   │   └── logger.js                   # Structured JSON logger
│   │
│   ├── database/
│   │   └── inMemoryStore.js            # Unified data store with spatial graphs & entities
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js          # Authentication & user resolver
│   │   ├── role.middleware.js          # RBAC & permission gatekeeper
│   │   ├── error.middleware.js         # AppError & unhandled exception handler
│   │   ├── validation.middleware.js    # Schema validation middleware
│   │   ├── rate-limit.middleware.js    # Rate limiting middleware
│   │   └── request-id.middleware.js    # Correlation ID generator
│   │
│   ├── shared/
│   │   ├── errors/AppError.js          # Typed application errors
│   │   ├── constants/roles.js          # Roles, order & complaint lifecycles
│   │   ├── utils/response.js           # Standardized API response format
│   │   ├── validators/validator.js     # Runtime schema verification
│   │   └── pagination/paginate.js      # Pagination helper
│   │
│   └── modules/
│       ├── auth/                       # Login, user profile, token lifecycle
│       ├── campus/                     # Buildings, rooms, facilities, spatial search
│       ├── map/                        # Dijkstra routing & waypoint graph
│       ├── timetable/                  # Student schedules, next-class ETA
│       ├── food/                       # Canteen menus, prices, availability
│       ├── orders/                     # Order state machine, verification, points deduction
│       ├── bookings/                   # Facility reservation with conflict prevention
│       ├── complaints/                 # Maintenance helpdesk with room-to-building resolution
│       ├── notices/                    # Circulars with priority badges & authoring
│       ├── events/                     # Capacity-checked RSVP management
│       ├── notifications/              # Centralized user notifications & read states
│       ├── feedback/                   # Service ratings & campus point incentives
│       └── ai/                         # Tool registry, confirmation loop, Gemini orchestrator
```

## 4. AI Assistant System & Tool Registry
The AI is an intelligent orchestration layer built on top of backend services (never directly reading/writing raw database records):
- **Tool Architecture**:
  - `searchCampus`: Building, room, and facility search
  - `getRoomDetails`: Specific room capacity, floor, and equipment lookup
  - `getNextClass`: Schedule lookup with walking ETA
  - `getTimetable`: Full student schedule retrieval
  - `searchFood`: Real-time menu queries and pricing
  - `getFoodOrder`: Active order tracking and pickup details
  - `prepareFoodOrderAction` (Write / Confirmation Required): Order staging and verification
  - `getNotices`: Circulars and broadcast announcements
  - `searchEvents`: Hackathon and workshop discovery
  - `registerForEventAction` (Write / Confirmation Required): Event registration flow
  - `createComplaintAction` (Write / Confirmation Required): Helpdesk ticket drafting
  - `getComplaintStatus`: Ticket status checks
  - `navigateCampus`: Dijkstra-based routing with distance and walking times
- **Confirmation Flow**: Write actions generate a temporary `actionId` requiring explicit user confirmation before modifying records.
- **Hallucination Control**: All factual campus data is sourced directly from domain services.

## 5. API Endpoints (`/api/v1/*`)
- `GET  /api/v1/auth/me`: Current user profile & Campus Points
- `POST /api/v1/auth/login`: Authenticate credentials
- `GET  /api/v1/campus/buildings`: Academic, admin, and food buildings
- `GET  /api/v1/campus/rooms`: Rooms filtered by building, floor, or type
- `GET  /api/v1/campus/search`: Unified cross-module campus search
- `GET  /api/v1/map`: Spatial graph nodes and edges
- `GET  /api/v1/map/route`: Shortest walking path & time calculation
- `GET  /api/v1/timetable/me`: Student weekly schedule
- `GET  /api/v1/timetable/me/today`: Today's classes & active lecture
- `GET  /api/v1/timetable/me/next`: Upcoming lecture & room ETA
- `GET  /api/v1/food/vendors`: Registered campus canteens & wait times
- `GET  /api/v1/food/items`: Menu items with dietary tags and availability
- `GET  /api/v1/orders/me`: Student order history
- `POST /api/v1/orders`: Server-validated order creation with balance check
- `POST /api/v1/orders/:id/accept | prepare | ready | pickup | complete`: State machine transitions
- `GET  /api/v1/bookings/resources`: Bookable seminar halls, courts, and labs
- `GET  /api/v1/bookings/resources/:id/availability`: Slot-level availability check
- `POST /api/v1/bookings`: Conflict-safe resource reservation
- `GET  /api/v1/complaints`: User or maintenance tickets
- `POST /api/v1/complaints`: Location-resolved helpdesk ticket creation
- `POST /api/v1/complaints/:id/resolve`: Technician resolution and notification
- `GET  /api/v1/notices`: Circulars and announcements
- `POST /api/v1/notices`: Faculty/Admin notice publishing
- `GET  /api/v1/events`: Campus events and hackathons
- `POST /api/v1/events/:id/register`: Capacity-controlled RSVP
- `GET  /api/v1/notifications`: User notification center
- `POST /api/v1/notifications/:id/read`: Mark notification as read
- `POST /api/v1/feedback`: 5-star campus feedback submission
- `POST /api/v1/ai/chat`: AI assistant with structured tools & UI action buttons
- `POST /api/v1/ai/actions/:actionId/confirm`: Execute confirmed AI actions

## 6. Current Status & Definition of Done
- **Part 6 & 7 Complete**:
  - Full modular backend architecture implemented with clean separation of concerns.
  - Endpoints follow strict `/api/v1` standards with unified error handling, validation, rate limiting, and RBAC.
  - AI Assistant integrated with domain tool registry, confirmation loop, and Gemini 3.7 Flash server-side client.
