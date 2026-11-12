# VAYURA — Your AI-Powered Global Arrival & Living Companion

> **"Moving Across Borders. Arrive Connected."**

VAYURA is a full-stack, production-quality AI-powered global travel and international arrival platform built for the PayPal Developer Hackathon.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![PayPal Sandbox](https://img.shields.io/badge/PayPal-Sandbox-blue)](https://developer.paypal.com)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3-green)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org)

---

## What is VAYURA?

VAYURA helps international students, working professionals, job seekers, tourists, business travellers, digital nomads and relocating individuals navigate international arrival in a completely new country.

The platform understands **why** you are travelling and **where** you are going — and builds a completely personalised experience around those two answers.

---

## Key Features

### 🤖 AI Global Arrival Assistant
- Natural-language travel and relocation advisor
- Context-aware responses based on your profile
- Arrival plan generation and budget insights
- Falls back to structured demo responses when AI API not configured

### 🗺️ Country-Aware Local App Discovery
- 50+ verified services across 8 countries
- Clear verification labels (Official Government / Licensed / Verified Commercial)
- Purpose-filtered — a student sees different apps than a tourist
- Availability status and last-verified dates

### ✅ Arrival Autopilot
- Personalised before-departure and post-arrival checklists
- Priority-based task management
- AI Arrival Readiness Score (0–100%)
- Phase-organised: Before Departure → Arrival Day → First Week → First Month

### 💰 Smart Budget Intelligence
- Purpose-aware budget allocation
- Expense tracking with category breakdown
- Interactive charts (Recharts)
- AI saving recommendations

### 💳 PayPal Developer Integration
- Full PayPal Orders API v2 flow (create → approve → capture)
- Backend-only credential management
- Idempotent capture (no duplicate charges)
- Full transaction persistence and history
- PayPal Sandbox clearly identified

### 🚨 Emergency & Help
- Country-specific emergency numbers
- Official government portal links
- Healthcare and embassy resources
- Source-verified information

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, Framer Motion |
| State | Zustand (persisted) |
| Charts | Recharts |
| Icons | Lucide React |
| Payments (UI) | @paypal/react-paypal-js |
| Backend | Java 21, Spring Boot 3.3 |
| Database | H2 (dev) / MySQL (production) |
| ORM | Spring Data JPA / Hibernate |
| HTTP Client | OkHttp3 |
| AI | OpenAI-compatible API (configurable) |
| Payments (Server) | PayPal Orders API v2 |

---

## Supported Countries

| Country | Code | Focus |
|---------|------|-------|
| South Korea | 🇰🇷 KR | Students, workers, exchange |
| Japan | 🇯🇵 JP | Tourism, students, professionals |
| Germany | 🇩🇪 DE | Students, employment, relocation |
| Singapore | 🇸🇬 SG | Business, employment, tourism |
| UAE | 🇦🇪 AE | Employment, business, tourism |
| United Kingdom | 🇬🇧 GB | Students, employment |
| United States | 🇺🇸 US | Students, employment, tourism |
| India | 🇮🇳 IN | Origin country |

---

## Quick Start

### Prerequisites
- Node.js 18+
- Java 21+
- Maven 3.8+

### 1. Clone the repository
```bash
git clone https://github.com/your-username/vayura.git
cd vayura
```

### 2. Frontend setup
```bash
cd frontend
cp .env.example .env
# Edit .env with your VITE_PAYPAL_CLIENT_ID
npm install
npm run dev
# → http://localhost:5173
```

### 3. Backend setup
```bash
cd backend
cp .env.example .env
# Edit .env with your PayPal sandbox credentials
# Backend uses H2 in-memory database by default (no setup needed)
./mvnw spring-boot:run
# → http://localhost:8080
```

### 4. Environment variables

**Frontend (`.env`):**
```env
VITE_API_URL=http://localhost:8080/api
VITE_PAYPAL_CLIENT_ID=your_sandbox_client_id
```

**Backend (environment variables):**
```env
PAYPAL_CLIENT_ID=your_sandbox_client_id
PAYPAL_CLIENT_SECRET=your_sandbox_client_secret
AI_API_KEY=your_openai_api_key   # optional
AI_ENABLED=true                   # optional
```

### 5. PayPal Sandbox setup
1. Go to https://developer.paypal.com/developer/applications
2. Create a new Sandbox application
3. Copy Client ID and Secret
4. For testing payments: https://developer.paypal.com/tools/sandbox/accounts

---

## Demo Journey

**The flagship demo scenario:**

1. Open VAYURA at `http://localhost:5173`
2. Click **"Start My Journey"**
3. Enter: Origin = India 🇮🇳, Destination = South Korea 🇰🇷, Purpose = Higher Education
4. Set budget: ₹2,00,000, Arrival date: a future date
5. Dashboard generates with South Korea-specific services
6. Navigate **AI Assistant** → ask "What should I do when I arrive?"
7. Navigate **Arrival Plan** → complete tasks to watch readiness score increase
8. Navigate **Local Apps** → see South Korea-specific verified services
9. Navigate **Smart Budget** → see expense breakdown
10. Navigate **Payments** → make a PayPal Sandbox payment
11. Navigate **Documents** → track preparation status

---

## Project Structure

```
vayura/
├── frontend/                # React + TypeScript frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Route-level page components
│   │   ├── store/           # Zustand state management
│   │   ├── data/            # Country data, apps registry, task templates
│   │   ├── services/        # API client
│   │   ├── types/           # TypeScript definitions
│   │   └── lib/             # Utilities
│   └── ...
├── backend/                 # Spring Boot Java backend
│   └── src/main/java/com/vayura/
│       ├── controller/      # REST controllers
│       ├── service/         # Business logic
│       ├── repository/      # JPA repositories
│       ├── entity/          # Database entities
│       ├── dto/             # Data transfer objects
│       ├── config/          # CORS, security config
│       ├── exception/       # Error handling
│       ├── integration/     # PayPal API integration
│       └── ai/              # AI service
├── docs/                    # Architecture and documentation
├── README.md
├── ARCHITECTURE.md
├── API_DOCUMENTATION.md
├── DEMO_SCRIPT.md
└── LICENSE
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/profiles` | Create travel profile |
| GET | `/api/profiles/{id}` | Get travel profile |
| POST | `/api/payments/create-order` | Create PayPal order |
| POST | `/api/payments/capture-order/{orderId}` | Capture approved order |
| GET | `/api/payments/transactions/{userId}` | Get transaction history |
| POST | `/api/ai/chat` | Chat with AI assistant |
| GET | `/api/ai/status` | AI service status |

See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for full documentation.

---

## Security

- PayPal client secrets are **never** exposed to the frontend
- All secrets loaded from environment variables
- Backend handles all PayPal API calls
- Input validation on all API endpoints
- CORS restricted to configured origins
- No sensitive data logged
- Idempotent payment capture

---

## Verification Labels

All services in VAYURA are clearly labelled:

| Label | Meaning |
|-------|---------|
| 🏛️ Official Government Service | Direct government portal |
| ✅ Government-Licensed Provider | Regulated by government authority |
| 🔵 Verified Commercial Provider | Established commercial service |
| ⭐ Community Recommended | Popular among travellers |
| ⏳ Verification Pending | Awaiting full verification |

---

## Disclaimer

VAYURA is a demonstration platform built for hackathon purposes.

- PayPal integration uses **Sandbox** credentials — no real transactions
- AI responses are general guidance — not legal, immigration, medical or financial advice
- Service information is sourced from official providers but may change
- Budget estimates are illustrative only
- Always verify critical information with official government sources

---

## Licence

MIT License — see [LICENSE](LICENSE)

---

## Built With

VAYURA was designed and built as a hackathon entry demonstrating:
- Meaningful AI integration with contextual travel assistance
- Full PayPal Developer Platform integration (Orders API v2)
- Production-quality full-stack architecture
- Real country-specific data and verified service registry
- Excellent responsive UI/UX with animations
