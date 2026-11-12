# VAYURA — Architecture Document

## Overview

VAYURA uses a full-stack architecture with a React SPA frontend, Spring Boot REST API backend, and MySQL/H2 database. The PayPal integration is entirely server-side. The AI service is configurable and falls back to structured demo responses.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                   VAYURA Frontend                        │
│          React 18 + TypeScript + Vite                    │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐  │
│  │ Landing  │  │Onboarding│  │Dashboard │  │Pages…  │  │
│  └──────────┘  └──────────┘  └──────────┘  └────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │          Zustand State (persisted)               │   │
│  │  user │ profile │ plan │ budget │ payments │ AI  │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ┌──────────────┐    ┌────────────────────────────────┐ │
│  │ @paypal/     │    │ Axios API Client (/api/*)       │ │
│  │ react-paypal │    └────────────────────────────────┘ │
│  └──────────────┘                                        │
└─────────────────────────────────────────────────────────┘
                           │
                     HTTP/REST (proxied)
                           │
┌─────────────────────────────────────────────────────────┐
│                VAYURA Backend                            │
│           Spring Boot 3.3 (Java 21)                      │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │                REST Controllers                  │   │
│  │  /api/health │ /api/profiles │ /api/payments     │   │
│  │  /api/ai │ /api/countries │ /api/discovery       │   │
│  └──────────────────────────────────────────────────┘   │
│                           │                              │
│  ┌────────────┐  ┌────────────┐  ┌────────────────────┐ │
│  │ Payment    │  │ AI         │  │ Country &          │ │
│  │ Service    │  │ Service    │  │ Discovery Service  │ │
│  └────────────┘  └────────────┘  └────────────────────┘ │
│       │               │                                  │
│  ┌────────────┐  ┌────────────┐                          │
│  │ PayPal     │  │ LLM API    │                          │
│  │ Service    │  │ (OkHttp)   │                          │
│  └────────────┘  └────────────┘                          │
│       │               │                                  │
│  ┌──────────────────────────────────────────────────┐   │
│  │            Spring Data JPA / Hibernate           │   │
│  │  TravelProfile │ Payment │ AiConversation        │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                           │
              ┌────────────────────────┐
              │        Database        │
              │  H2 (dev) / MySQL (prod)│
              └────────────────────────┘
                           │
       ┌───────────────────────────────────┐
       │         External Services         │
       │                                   │
       │  PayPal Sandbox Orders API v2      │
       │  OpenAI-compatible LLM API        │
       └───────────────────────────────────┘
```

## Component Breakdown

### Frontend

| Component | Purpose |
|-----------|---------|
| `LandingPage` | Marketing landing with hero, features, CTA |
| `OnboardingPage` | 4-step journey setup wizard |
| `DashboardLayout` | Sidebar + protected route layout |
| `DashboardOverview` | Unified dashboard with all widgets |
| `AIAssistantPage` | Real-time chat with AI assistant |
| `ArrivalPlanPage` | Task checklist with readiness score |
| `DiscoveryPage` | Country/purpose-filtered local app registry |
| `BudgetPage` | Expense tracker with charts |
| `PaymentsPage` | PayPal SDK integration + transaction history |
| `DocumentsPage` | Document checklist and reminders |
| `EmergencyPage` | Emergency contacts and official resources |

### Backend Packages

| Package | Responsibility |
|---------|---------------|
| `controller/` | REST endpoint definitions, request validation |
| `service/` | Business logic, payment orchestration |
| `repository/` | JPA data access layer |
| `entity/` | Database entity definitions |
| `dto/` | Request/response data objects |
| `config/` | CORS, app configuration |
| `exception/` | Centralised error handling |
| `integration/paypal/` | PayPal API v2 client |
| `ai/` | AI service with LLM integration and demo fallback |

## Data Flow — Payment

```
User selects service → PaymentsPage
         │
         ▼
POST /api/payments/create-order
         │
         ▼
PaymentService.createOrder()
         │
         ▼
PayPalService.createOrder() → PayPal Sandbox API
         │
         ▼
Save Payment(CREATED) → Database
         │
         ▼
Return { orderId, approveUrl } → Frontend
         │
         ▼
@paypal/react-paypal-js renders PayPal buttons
         │
User clicks Pay → PayPal modal → User approves
         │
         ▼
onApprove callback fires with orderId
         │
         ▼
POST /api/payments/capture-order/{orderId}
         │
         ▼
PaymentService.captureOrder() [idempotency check]
         │
         ▼
PayPalService.captureOrder() → PayPal Sandbox API
         │
         ▼
Update Payment(CAPTURED) → Database
         │
         ▼
Return success → Frontend updates UI + Budget
```

## Data Flow — AI Chat

```
User types message → AIAssistantPage
         │
         ▼
POST /api/ai/chat { message, context, profileId }
         │
         ▼
AiService.chat()
         │
    aiEnabled?
   /         \
 YES          NO
  │            │
LLM API    Demo structured
 call       response
  │            │
   \         /
    ▼       ▼
Return response to frontend
         │
         ▼
Render markdown response in chat UI
```

## Country Data Architecture

The Local App Discovery system uses a static registry pattern:

```
countries.ts     → CountryData (flags, emergency, portals)
localApps.ts     → LocalApp[] (filtered by country + purpose)
arrivalTasks.ts  → TaskTemplate[] (filtered by country + purpose)
```

Adding a new country requires:
1. Adding to `COUNTRIES` in `countries.ts`
2. Adding apps to `LOCAL_APPS` in `localApps.ts`
3. Adding task templates with `countries: ['XX']` in `arrivalTasks.ts`

No application code changes required.

## Security Design

| Concern | Implementation |
|---------|---------------|
| PayPal secrets | Backend env vars only, never sent to frontend |
| Input validation | Spring Validation on all DTOs |
| CORS | Restricted to configured origins |
| Error responses | No stack traces, sanitised messages |
| Sensitive logging | Credentials never logged |
| Payment idempotency | DB check before capture |
| AI guardrails | System prompt + demo fallback |

## Database Schema

```sql
travel_profiles   id, userId, originCountryCode, destinationCountryCode,
                  purpose, arrivalDate, lengthOfStayDays, budgetAmount,
                  budgetCurrency, preferredLanguage, preferences,
                  createdAt, updatedAt

payments          id, userId, paypalOrderId (unique), amount, currency,
                  relatedService, description, status, sandbox,
                  createdAt, updatedAt

ai_conversations  id, userId, travelProfileId, messagesJson, createdAt
```
