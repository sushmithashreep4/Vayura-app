# VAYURA — Demo Script
## Hackathon Demonstration Guide

---

## Demo Scenario

**"A student in India travels to South Korea for higher education."**

This end-to-end flow covers every major feature: AI, PayPal, country discovery, arrival planning, and budget.

---

## Step-by-Step Demo (Under 3 minutes)

### SCENE 1 — Landing Page (0:00 – 0:20)

1. Open `http://localhost:5173`
2. **Show:** Hero section with animated floating cards
3. **Narrate:** "VAYURA is a fully AI-powered global arrival platform. It knows where you're going and why — and builds everything around that."
4. **Scroll** through Features, Countries, How It Works sections
5. **Click** "Start My Journey"

---

### SCENE 2 — Smart Onboarding (0:20 – 0:50)

1. **Step 1 — Personal:** Enter name: "Priya Sharma", email: "priya@example.com"
2. **Step 2 — Journey:**
   - Origin: 🇮🇳 India
   - Destination: 🇰🇷 South Korea
   - Purpose: **Higher Education** (click the tile)
3. **Step 3 — Timeline:** Set arrival date 2 months ahead, length: 365 days
4. **Step 4 — Budget:** Amount: 200000, Currency: INR
5. **Click** "🚀 Launch My Journey"

**Result:** Dashboard loads with South Korea-specific content

---

### SCENE 3 — Personalised Dashboard (0:50 – 1:15)

1. **Show** the Overview dashboard:
   - "Welcome back, Priya" with arrival countdown
   - Arrival Readiness Score: 0% (just started)
   - Budget: ₹2,00,000 remaining
   - Urgent tasks highlighted
   - South Korea emergency numbers
2. **Point out:** "Every single piece of this is specific to South Korea + Higher Education. A tourist would see something completely different."

---

### SCENE 4 — AI Arrival Assistant (1:15 – 1:40)

1. Navigate to **AI Assistant**
2. **Ask:** "I'm travelling from India to South Korea for my master's degree. What should I do first?"
3. **Show** the contextual AI response with:
   - Day-1 checklist
   - Immigration guidance
   - Disclaimer about verifying with official sources
4. **Ask one follow-up:** "What bank account should I open?"
5. **Show** the structured banking guidance

---

### SCENE 5 — Local App Discovery (1:40 – 2:00)

1. Navigate to **Local Apps & Services**
2. **Show** South Korea-specific apps: HiKorea, KakaoTalk, Study in Korea, Korail, Baemin
3. **Point out** verification labels: "🏛️ Official Government" on HiKorea and Study in Korea
4. **Click** on HiKorea to open detail modal — shows eligibility, source, disclaimer
5. **Filter** by category: "Banking & Payments" — shows Shinhan SOL

---

### SCENE 6 — Arrival Plan + Readiness Score (2:00 – 2:20)

1. Navigate to **Arrival Plan**
2. **Show** phases: Before Departure, Arrival Day, First Week, First Month
3. **Complete 3 tasks** by clicking the checkboxes:
   - "Ensure passport is valid"
   - "Register on HiKorea portal"
   - "Research university accommodation"
4. **Watch readiness score increase** in real time
5. **Show** the updated summary

---

### SCENE 7 — Smart Budget (2:20 – 2:35)

1. Navigate to **Smart Budget**
2. **Show** pie chart of budget allocation (Accommodation 35%, Food 20%, etc.)
3. **Add an expense:** Click "Add Expense" → Category: Food, Description: "Grocery run", Amount: 5000
4. **Show** bar chart updating with spent vs allocated
5. **Show** AI recommendations

---

### SCENE 8 — PayPal Payment (2:35 – 3:00)

1. Navigate to **Payments**
2. **Point out:** "Sandbox mode — no real money charged"
3. **Click** "Make a Payment"
4. **Select:** "Local SIM Card (1 Month)" — $20 USD
5. **Click** "Continue to PayPal"
6. **PayPal buttons render** — sign in with PayPal sandbox test account
7. **Approve** the payment in the PayPal modal
8. **Show** ✅ "Payment Successful" screen with sandbox badge
9. **Return to Dashboard** — budget updated, payment in history

---

## Key Points to Highlight

- **Country-awareness:** South Korea student ≠ Japan tourist ≠ Germany professional
- **Verification transparency:** Every app clearly labelled — no false government claims
- **PayPal integration:** Full Orders API v2 — create → approve → capture — backend only
- **AI safety:** Every response includes "verify with official sources" disclaimer
- **Readiness score:** Calculated from actual task completion, not fake data
- **Full-stack:** React frontend talks to Spring Boot backend backed by real database

---

## PayPal Test Credentials

Use these for the payment demo:
- Buyer account: Use PayPal sandbox personal account from developer.paypal.com
- Or use the auto-generated sandbox accounts in your PayPal Developer Dashboard

---

## Fallback Notes

- **Backend offline?** The app works fully in demo mode — AI uses structured responses, budget and checklist are all client-side with Zustand persistence
- **No PayPal Client ID configured?** Use `sb` (the default) — PayPal SDK will still render buttons in sandbox mode
- **No AI API key?** Demo responses are structured and contextual — no degradation in demo experience
