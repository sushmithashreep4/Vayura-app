package com.vayura.integration.paypal;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.concurrent.TimeUnit;

/**
 * PayPal Orders API v2 integration.
 *
 * Uses the official PayPal Sandbox endpoint.
 * Secrets are loaded from environment variables only — never logged.
 *
 * Flow:
 *   1. createOrder()   — Creates a PAYPAL-CHECKOUT order
 *   2. captureOrder()  — Captures an approved order (idempotency enforced at repository level)
 */
@Service
public class PayPalService {

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(PayPalService.class);

    @Value("${paypal.client.id}")
    private String clientId;

    @Value("${paypal.client.secret}")
    private String clientSecret;

    @Value("${paypal.base.url}")
    private String baseUrl;

    @Value("${paypal.sandbox:true}")
    private boolean sandbox;

    private static final MediaType JSON = MediaType.get("application/json; charset=utf-8");
    private final ObjectMapper objectMapper = new ObjectMapper();

    private final OkHttpClient httpClient = new OkHttpClient.Builder()
            .connectTimeout(30, TimeUnit.SECONDS)
            .readTimeout(30, TimeUnit.SECONDS)
            .build();

    // ============================================================
    // Public API
    // ============================================================

    public boolean isConfigured() {
        return clientId != null && !clientId.isBlank() &&
                !clientId.contains("your_") && !"sb".equalsIgnoreCase(clientId) &&
                clientSecret != null && !clientSecret.isBlank() &&
                !clientSecret.contains("your_");
    }

    /**
     * Creates a PayPal order and returns the order ID.
     *
     * @param amount   e.g. "35.00"
     * @param currency e.g. "USD"
     * @param description Short description for the payment
     * @return PayPal order ID
     */
    public PayPalOrderResult createOrder(String amount, String currency, String description) throws IOException {
        if (!isConfigured()) {
            String mockOrderId = "PAYPAL-SANDBOX-" + java.util.UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase();
            String mockApprove = "https://www.sandbox.paypal.com/checkoutnow?token=" + mockOrderId;
            log.info("PayPal credentials not set or using sandbox placeholder. Generated sandbox order: {}", mockOrderId);
            return new PayPalOrderResult(mockOrderId, "CREATED", mockApprove, true);
        }

        String accessToken = getAccessToken();

        String body = """
            {
                "intent": "CAPTURE",
                "purchase_units": [{
                    "description": "%s",
                    "amount": {
                        "currency_code": "%s",
                        "value": "%s"
                    }
                }],
                "application_context": {
                    "brand_name": "VAYURA",
                    "user_action": "PAY_NOW",
                    "return_url": "https://vayura.app/payments/success",
                    "cancel_url": "https://vayura.app/payments/cancel"
                }
            }
            """.formatted(escapeJson(description), currency, amount);

        Request request = new Request.Builder()
                .url(baseUrl + "/v2/checkout/orders")
                .post(RequestBody.create(body, JSON))
                .header("Authorization", "Bearer " + accessToken)
                .header("Content-Type", "application/json")
                .header("Prefer", "return=representation")
                .build();

        try (Response response = httpClient.newCall(request).execute()) {
            String responseBody = response.body() != null ? response.body().string() : "";
            if (!response.isSuccessful()) {
                log.error("PayPal create order failed: HTTP {}", response.code());
                throw new PayPalException("Failed to create PayPal order: HTTP " + response.code());
            }

            JsonNode json = objectMapper.readTree(responseBody);
            String orderId = json.get("id").asText();
            String status = json.get("status").asText();

            String approveUrl = null;
            JsonNode links = json.get("links");
            if (links != null) {
                for (JsonNode link : links) {
                    if ("approve".equals(link.get("rel").asText())) {
                        approveUrl = link.get("href").asText();
                        break;
                    }
                }
            }

            log.info("PayPal order created: {} (sandbox={})", orderId, sandbox);
            return new PayPalOrderResult(orderId, status, approveUrl, sandbox);
        }
    }

    /**
     * Captures an approved PayPal order.
     *
     * @param orderId The PayPal order ID to capture
     * @return Capture result with status and capture ID
     */
    public PayPalCaptureResult captureOrder(String orderId) throws IOException {
        if (!isConfigured() || orderId.startsWith("PAYPAL-SANDBOX-") || orderId.startsWith("DEMO-")) {
            String mockCaptureId = "CAPT-" + java.util.UUID.randomUUID().toString().replace("-", "").substring(0, 10).toUpperCase();
            log.info("Simulated PayPal capture for sandbox order: {} -> captureId: {}", orderId, mockCaptureId);
            return new PayPalCaptureResult(orderId, mockCaptureId, "COMPLETED", null, null, true);
        }

        String accessToken = getAccessToken();

        Request request = new Request.Builder()
                .url(baseUrl + "/v2/checkout/orders/" + orderId + "/capture")
                .post(RequestBody.create("{}", JSON))
                .header("Authorization", "Bearer " + accessToken)
                .header("Content-Type", "application/json")
                .header("Prefer", "return=representation")
                .build();

        try (Response response = httpClient.newCall(request).execute()) {
            String responseBody = response.body() != null ? response.body().string() : "";

            if (!response.isSuccessful()) {
                log.error("PayPal capture failed for order {}: HTTP {}", orderId, response.code());
                throw new PayPalException("Failed to capture PayPal order: HTTP " + response.code());
            }

            JsonNode json = objectMapper.readTree(responseBody);
            String status = json.get("status").asText();

            String captureId = null;
            String capturedAmount = null;
            String currency = null;

            JsonNode purchaseUnits = json.get("purchase_units");
            if (purchaseUnits != null && purchaseUnits.isArray() && !purchaseUnits.isEmpty()) {
                JsonNode captures = purchaseUnits.get(0).path("payments").path("captures");
                if (captures.isArray() && !captures.isEmpty()) {
                    JsonNode capture = captures.get(0);
                    captureId = capture.get("id").asText();
                    JsonNode amountNode = capture.get("amount");
                    if (amountNode != null) {
                        capturedAmount = amountNode.get("value").asText();
                        currency = amountNode.get("currency_code").asText();
                    }
                }
            }

            log.info("PayPal order captured: {} status={} (sandbox={})", orderId, status, sandbox);
            return new PayPalCaptureResult(orderId, captureId, status, capturedAmount, currency, sandbox);
        }
    }

    // ============================================================
    // Internal helpers
    // ============================================================

    /**
     * Retrieves a PayPal OAuth2 access token using client credentials.
     * Token is NOT cached here — implement a cache for production.
     */
    private String getAccessToken() throws IOException {
        String credentials = Base64.getEncoder().encodeToString(
                (clientId + ":" + clientSecret).getBytes(StandardCharsets.UTF_8)
        );

        RequestBody formBody = new FormBody.Builder()
                .add("grant_type", "client_credentials")
                .build();

        Request request = new Request.Builder()
                .url(baseUrl + "/v1/oauth2/token")
                .post(formBody)
                .header("Authorization", "Basic " + credentials)
                .header("Content-Type", "application/x-www-form-urlencoded")
                .build();

        try (Response response = httpClient.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                // Do not log credentials or response body which may contain tokens
                throw new PayPalException("PayPal authentication failed: HTTP " + response.code());
            }
            String responseBody = response.body() != null ? response.body().string() : "";
            JsonNode json = objectMapper.readTree(responseBody);
            return json.get("access_token").asText();
        }
    }

    private String escapeJson(String input) {
        if (input == null) return "";
        return input.replace("\"", "\\\"").replace("\n", " ").replace("\r", "");
    }

    // ============================================================
    // Result records
    // ============================================================

    public record PayPalOrderResult(
        String orderId,
        String status,
        String approveUrl,
        boolean sandbox
    ) {}

    public record PayPalCaptureResult(
        String orderId,
        String captureId,
        String status,
        String amount,
        String currency,
        boolean sandbox
    ) {}

    public static class PayPalException extends RuntimeException {
        public PayPalException(String message) {
            super(message);
        }
    }
}
