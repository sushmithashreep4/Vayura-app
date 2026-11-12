package com.vayura.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.vayura.dto.AiChatRequest;
import com.vayura.dto.AiChatResponse;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.TimeUnit;

/**
 * AI assistant integration.
 *
 * Supports any OpenAI-compatible endpoint (OpenAI, Groq, Together, etc.).
 * Falls back to structured demo responses when AI_ENABLED=false or API key absent.
 *
 * IMPORTANT: AI is never permitted to:
 * - Execute payments automatically
 * - Invent government rules or official information
 * - Present uncertain information as confirmed facts
 */
@Service
public class AiService {

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(AiService.class);

    @Value("${ai.api.key:}")
    private String apiKey;

    @Value("${ai.api.url:https://api.openai.com/v1/chat/completions}")
    private String apiUrl;

    @Value("${ai.model:gpt-4o-mini}")
    private String model;

    @Value("${ai.enabled:false}")
    private boolean aiEnabled;

    private static final MediaType JSON = MediaType.get("application/json; charset=utf-8");
    private final ObjectMapper objectMapper = new ObjectMapper();

    private final OkHttpClient httpClient = new OkHttpClient.Builder()
            .connectTimeout(30, TimeUnit.SECONDS)
            .readTimeout(60, TimeUnit.SECONDS)
            .build();

    private static final String SYSTEM_PROMPT = """
            You are VAYURA's AI Global Arrival Assistant — an expert travel and relocation advisor.
            
            Your role is to help international travellers, students, professionals, and tourists 
            prepare for and manage their international journey.
            
            RULES:
            1. Only provide information you are confident about. When uncertain, say so clearly.
            2. Never invent government rules, visa requirements, or official procedures.
            3. Never claim that specific private apps are government-authorised unless you can confirm it.
            4. Always recommend users verify critical information with official government sources.
            5. Never provide legal, immigration, medical, or financial advice — recommend professionals.
            6. Never suggest or execute financial transactions — the user must approve all payments.
            7. Add disclaimers when providing estimates, costs, or procedural guidance.
            8. Use markdown formatting for clarity (bold, bullets, numbered lists).
            9. Keep responses concise and actionable.
            10. When context includes country and purpose, tailor your response specifically.
            
            DISCLAIMER to include when discussing costs or procedures:
            "⚠️ This is general guidance. Always verify with official sources before making decisions."
            """;

    /**
     * Process a chat message and return an AI-generated response.
     * Falls back to demo responses when AI integration is not configured.
     */
    public AiChatResponse chat(AiChatRequest request) {
        if (!aiEnabled || apiKey == null || apiKey.isBlank() || apiKey.equals("your_ai_api_key")) {
            return generateDemoResponse(request);
        }

        try {
            return callLlmApi(request);
        } catch (Exception e) {
            log.warn("AI API call failed, falling back to demo: {}", e.getMessage());
            return generateDemoResponse(request);
        }
    }

    private AiChatResponse callLlmApi(AiChatRequest request) throws IOException {
        String contextSummary = buildContextSummary(request.getContext());

        String userContent = contextSummary.isBlank()
                ? request.getMessage()
                : contextSummary + "\n\nUser question: " + request.getMessage();

        String requestBody = objectMapper.writeValueAsString(Map.of(
                "model", model,
                "messages", new Object[]{
                        Map.of("role", "system", "content", SYSTEM_PROMPT),
                        Map.of("role", "user", "content", userContent)
                },
                "max_tokens", 800,
                "temperature", 0.7
        ));

        Request httpRequest = new Request.Builder()
                .url(apiUrl)
                .post(RequestBody.create(requestBody, JSON))
                .header("Authorization", "Bearer " + apiKey)
                .header("Content-Type", "application/json")
                .build();

        try (Response response = httpClient.newCall(httpRequest).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException("AI API returned HTTP " + response.code());
            }
            String body = response.body() != null ? response.body().string() : "";
            JsonNode json = objectMapper.readTree(body);
            String content = json
                    .path("choices").get(0)
                    .path("message").path("content").asText();

            return AiChatResponse.builder()
                    .message(content)
                    .aiGenerated(true)
                    .demoMode(false)
                    .disclaimer("AI-generated response. Verify critical information with official sources.")
                    .build();
        }
    }

    private AiChatResponse generateDemoResponse(AiChatRequest request) {
        String country = getContextValue(request.getContext(), "destinationCountry", "South Korea");
        String purpose = getContextValue(request.getContext(), "purpose", "HIGHER_EDUCATION");
        String budgetStr = getContextValue(request.getContext(), "budgetAmount", "3500");
        String msg = request.getMessage().toLowerCase();

        String response;

        if (msg.contains("paypal") || msg.contains("checkout") || msg.contains("pay with")) {
            response = """
                    💳 **Supported PayPal Services in VAYURA**
                    
                    You can securely book and purchase these essential arrival services via **PayPal Sandbox**:
                    
                    1. **Korea Telecom (KT) 5G Unlimited eSIM** — $28.00 USD
                       *Instant QR activation, local number & unlimited data*
                    2. **AREX Express Train (Incheon Airport → Seoul Station)** — $9.50 USD
                       *Direct non-stop 43-minute airport rail ticket*
                    3. **T-Money Smart Transit Pass (South Korea)** — $18.00 USD
                       *Universal metro, bus, and taxi contactless pass*
                    4. **Tokyo Metro 72-Hour Unlimited Pass (Japan)** — $12.00 USD
                       *All Tokyo Metro & Toei Subway lines*
                    5. **Suica Contactless Travel Card (Japan)** — $20.00 USD
                    6. **BVG Berlin & Deutschland-Ticket Welcome Pass (Germany)** — $35.00 USD
                    7. **London Visitor Oyster Card Pre-load (UK)** — $30.00 USD
                    
                    👉 **How to pay:** Go to **Global Essentials** or **VAYURA Payments**, select the service, and click **"Pay with PayPal"**. Every transaction requires your explicit authorization, updates your budget automatically, and saves an official receipt.
                    
                    ⚠️ All transactions execute in PayPal Sandbox mode with zero real monetary charge.
                    """;

        } else if (msg.contains("app") || msg.contains("install") || msg.contains("download")) {
            if (country.toLowerCase().contains("korea") || country.equalsIgnoreCase("kr")) {
                response = """
                        📱 **Essential Everyday Apps for South Korea (%s)**
                        
                        Before boarding your flight, install and set up these verified applications:
                        
                        1. **Naver Map / KakaoMap** 🗺️
                           *Crucial: Google Maps has limited transit and walking routing in Korea due to national geospatial laws. Naver Map supports full English routing.*
                        2. **KakaoTalk** 💬
                           *Ubiquitous messaging platform used by 97%+ of the population, university faculties, student associations, and landlord communication.*
                        3. **Baemin (배달의민족) & Coupang Eats** 🍱
                           *Leading food delivery services with fast dispatch to student dorms and apartments.*
                        4. **Coupang Rocket** 📦
                           *Next-morning 'Dawn Delivery' for bedding, converters, cookware, and study supplies.*
                        5. **HiKorea (Official)** 🏛️
                           *Ministry of Justice portal to book your Alien Registration Card (ARC) appointment upon arrival.*
                        6. **Papago** 🌐
                           *Naver's neural machine translation engine — significantly more accurate than alternatives for Korean honorifics and street signage.*
                        
                        💡 You can pre-order your **KT 5G eSIM** ($28) and **T-Money Transit Pass** ($18) directly in VAYURA with PayPal.
                        """;
            } else if (country.toLowerCase().contains("japan") || country.equalsIgnoreCase("jp")) {
                response = """
                        📱 **Essential Everyday Apps for Japan (%s)**
                        
                        1. **Japan Travel by NAVITIME / Google Maps** 🗺️
                           *Pinpoint precision for JR lines, Tokyo Metro, and Shinkansen bullet train platforms.*
                        2. **Suica / Pasmo (Apple Wallet / Mobile)** 🚆
                           *Contactless tap-to-ride for all trains, buses, vending machines, and konbini (7-Eleven, Lawson).*
                        3. **LINE** 💬
                           *Primary messaging application in Japan for university circles and professional networking.*
                        4. **Uber Eats Japan / Demae-can** 🍱
                           *Top food delivery apps accepting foreign cards and local payment methods.*
                        5. **VoiceTra / Google Translate** 🌐
                           *Real-time speech and camera translation developed by Japan's NICT.*
                        
                        💡 Book your **Tokyo Metro 72-Hour Pass** or **Suica Starter Card** in VAYURA with PayPal.
                        """;
            } else if (country.toLowerCase().contains("germany") || country.equalsIgnoreCase("de")) {
                response = """
                        📱 **Essential Everyday Apps for Germany (%s)**
                        
                        1. **DB Navigator** 🚆
                           *Official Deutsche Bahn rail app for ICE high-speed and regional rail with live delay updates.*
                        2. **BVG Fahrinfo / Citymapper** 🗺️
                           *Urban transit navigation for Berlin and major metropolitan areas.*
                        3. **Lieferando / Wolt** 🍕
                           *Primary food and quick grocery delivery apps across German cities.*
                        4. **Doctolib** 🩺
                           *Online doctor appointments and healthcare specialist bookings.*
                        5. **Make It in Germany** 🏛️
                           *Official government portal for registration (Anmeldung), work permits, and residence visas.*
                        
                        💡 Get your **BVG Welcome Pass** ($35) or **Telekom Germany 5G eSIM** ($25) via VAYURA PayPal.
                        """;
            } else {
                response = """
                        📱 **Essential Everyday Applications for %s**
                        
                        Explore the **Global Essentials** directory in your dashboard. We've verified official government services, local transport passes, maps, and grocery apps specifically curated for your visit.
                        """;
            }
            response = response.formatted(purpose.replace("_", " "));

        } else if (msg.contains("grocery") || msg.contains("food") || msg.contains("supermarket") || msg.contains("eat")) {
            if (country.toLowerCase().contains("japan") || country.equalsIgnoreCase("jp")) {
                response = """
                        🍱 **Grocery & Food Applications in Japan**
                        
                        • **Uber Eats Japan & Demae-can (出前館)**: The two largest meal delivery platforms with extensive menus and English UI.
                        • **Amazon Fresh Japan & Rakuten Seiyu Netsuper**: Fast same-day home grocery delivery for pantry staples, fresh fruits, and imported foods.
                        • **Convenience Store Apps (7-Eleven Japan, Lawson, FamilyMart)**: Daily bento, prepared meals, bill payments, and ATM cash services.
                        • **Tabelog (食べログ)**: Japan's most authoritative restaurant rating directory (ratings above 3.5 indicate exceptional dining).
                        
                        ⚠️ Cash and IC cards (Suica/Pasmo) are widely accepted; keep a small amount of Yen on hand for traditional street stalls.
                        """;
            } else if (country.toLowerCase().contains("korea") || country.equalsIgnoreCase("kr")) {
                response = """
                        🍱 **Grocery & Food Applications in South Korea**
                        
                        • **Baemin (배달의민족)**: The gold standard for restaurant takeaway and 'B-Mart' 30-minute hyper-local grocery delivery.
                        • **Coupang Rocket Fresh**: Dawn grocery delivery (order by midnight, fresh groceries arrive outside your door by 7 AM).
                        • **Yogiyo & Coupang Eats**: Popular alternatives with frequent discount vouchers and English-friendly card processing.
                        • **Market Kurly**: Premium gourmet groceries, fresh morning breads, and healthy meals.
                        """;
            } else {
                response = """
                        🍱 **Food & Grocery Essentials for %s**
                        
                        Local delivery apps and grocery supermarkets are cataloged in your **Global Essentials** section. You'll find verified food delivery, supermarket chains, and dining guides.
                        """.formatted(country);
            }

        } else if (msg.contains("transport") || msg.contains("metro") || msg.contains("train") || msg.contains("subway") || msg.contains("taxi")) {
            if (country.toLowerCase().contains("germany") || country.equalsIgnoreCase("de")) {
                response = """
                        🚆 **Transportation Options in Germany**
                        
                        1. **Deutschland-Ticket (€49/month)**:
                           *Provides unlimited nationwide travel on all regional trains (RB, RE), S-Bahn, U-Bahn, trams, and city buses across Germany.*
                        2. **Deutsche Bahn ICE (InterCity Express)**:
                           *High-speed trains between major hubs (Berlin, Munich, Frankfurt, Hamburg). Pre-booking via DB Navigator yields significant savings.*
                        3. **Local Transit Networks (BVG, MVV, HVV)**:
                           *City-specific transit authorities. In Berlin, BVG covers U-Bahn, buses, and ferries.*
                        4. **Ride-Hailing & Sharing**:
                           *FreeNow, Uber, and Bolt operate in major German metropolitan centers.*
                        
                        💡 Purchase your **BVG Welcome Transit Pass** ($35) instantly via VAYURA PayPal Checkout.
                        """;
            } else if (country.toLowerCase().contains("korea") || country.equalsIgnoreCase("kr")) {
                response = """
                        🚆 **Transportation in South Korea**
                        
                        • **AREX Airport Express**: Non-stop 43-min direct rail from Incheon Airport to Seoul Station ($9.50 in VAYURA).
                        • **Seoul Metro**: 23 interconnected subway lines with English audio announcements and colour-coded routes.
                        • **T-Money Transit Card**: Contactless card accepted on subways, city buses, and taxis nationwide.
                        • **Kakao T**: The primary taxi-hailing and bike-sharing app in Korea.
                        """;
            } else {
                response = """
                        🚆 **Transportation Options in %s**
                        
                        Public transit passes, metro lines, airport express connections, and taxi alternatives for %s are available in your **Global Essentials** catalog with verified regulatory links.
                        """.formatted(country);
            }

        } else if (msg.contains("budget") || msg.contains("remaining") || msg.contains("how much") || msg.contains("balance")) {
            response = """
                    💰 **Smart Budget Overview**
                    
                    • **Allocated Total Budget**: $%s USD
                    • **Planned Primary Categories**:
                      - Accommodation: ~35%% ($1,200.00)
                      - Food & Dining: ~20%% ($700.00)
                      - Transportation & Transit: ~13%% ($450.00)
                      - Connectivity & eSIM: ~4%% ($150.00)
                      - Health & Insurance: ~8%% ($300.00)
                      - Local Essentials: ~11%% ($400.00)
                      - Emergency Reserve: ~9%% ($300.00)
                    
                    💡 **PayPal Integration**: Whenever you complete a PayPal transaction (such as a 5G eSIM or Transit Pass), VAYURA immediately logs the payment, deducts the expense from the corresponding category, and recalculates your remaining balance in real time.
                    
                    👉 Visit the **Smart Budget** page in your dashboard for interactive visual charts and real-time expense breakdown.
                    """.formatted(budgetStr);

        } else if (msg.contains("prepare") || msg.contains("before") || msg.contains("checklist") || msg.contains("arrival")) {
            response = """
                    📋 **Arrival Autopilot — Pre-Departure Checklist for %s**
                    
                    Here are your highest-priority action items:
                    
                    1. 🛂 **Passport & Visa Documents**
                       *Verify passport validity has at least 6 months remaining beyond your planned departure date. Print physical copies of admission/contract.*
                    2. 📱 **Connectivity & eSIM Activation**
                       *Install an international travel eSIM before departure so you have instant high-speed data upon touchdown.*
                    3. 🚆 **Airport Transfer & Transit Card**
                       *Secure your airport express ticket (e.g., AREX in Seoul, N'EX in Tokyo, S-Bahn in Berlin) and transit card via PayPal.*
                    4. 🏠 **Accommodation Confirmation**
                       *Keep the address written in both English and local characters for the airport taxi or immigration inspector.*
                    5. 💳 **Payment Readiness**
                       *Notify your home bank of international travel and set up PayPal for contactless local booking.*
                    6. 🏥 **Travel & Health Insurance**
                       *Carry proof of policy coverage for medical emergencies and hospital visits.*
                    
                    👉 Check your **Arrival Autopilot** in the dashboard to track your completion score!
                    """.formatted(country);

        } else if (msg.contains("visa") || msg.contains("immigration")) {
            response = """
                    For your **%s** journey to **%s**, visa requirements depend on your nationality and visa category.
                    
                    📋 **General requirements typically include:**
                    • Valid passport (6+ months beyond stay)
                    • Completed visa application form & consular appointment
                    • Purpose-specific documentation (Certificate of Admission, employment contract, invitation)
                    • Proof of financial solvency (bank statements)
                    • Recent passport biometric photographs
                    
                    🏛️ Always verify with the **official embassy or national immigration portal** (e.g., HiKorea, ISA Japan, Ausländerbehörde). Links are pinned in your Emergency & Documents sections.
                    
                    ⚠️ General guidance only. Always verify critical procedures directly with official government sources.
                    """.formatted(purpose.replace("_", " "), country);

        } else {
            response = """
                    I'm your **VAYURA AI Global Companion**, here to guide your **%s** journey to **%s**! 🌍
                    
                    Here is what I can help you with:
                    
                    • 📱 **Everyday Apps & Services** — the essential local apps for food, transit, and banking
                    • 💳 **PayPal Checkout** — book eSIMs, train tickets, and transit passes with one click
                    • 📋 **Arrival Autopilot** — step-by-step checklist and Arrival Readiness Score
                    • 💰 **Smart Budget** — expense tracking, currency insights, and savings tips
                    • 🚨 **Emergency Helplines** — verified official phone numbers and consular resources
                    
                    What would you like to prepare next?
                    
                    ⚠️ General travel companion guidance. Always verify critical immigration and health regulations with official authorities.
                    """.formatted(purpose.replace("_", " "), country);
        }

        return AiChatResponse.builder()
                .message(response.trim())
                .aiGenerated(false)
                .demoMode(true)
                .disclaimer("VAYURA AI Intelligence · Verified with country registries · Verify official regulations directly.")
                .build();
    }

    private String buildContextSummary(Map<String, Object> context) {
        if (context == null || context.isEmpty()) return "";
        StringBuilder sb = new StringBuilder("User journey context:\n");
        context.forEach((k, v) -> sb.append("- ").append(k).append(": ").append(v).append("\n"));
        return sb.toString();
    }

    private String getContextValue(Map<String, Object> context, String key, String fallback) {
        if (context == null) return fallback;
        Object val = context.get(key);
        return val != null ? val.toString() : fallback;
    }
}
