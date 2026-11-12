package com.vayura.controller;

import com.vayura.dto.CaptureOrderResponse;
import com.vayura.dto.CreateOrderRequest;
import com.vayura.dto.CreateOrderResponse;
import com.vayura.entity.Payment;
import com.vayura.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST controller for PayPal payment operations.
 *
 * All PayPal secrets are handled server-side only.
 * No credentials are exposed to the frontend.
 */
@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(PaymentController.class);

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    /**
     * Step 1: Create a PayPal order.
     * Frontend will render the PayPal button after receiving the order ID.
     */
    @PostMapping("/create-order")
    public ResponseEntity<CreateOrderResponse> createOrder(
            @Valid @RequestBody CreateOrderRequest request) {
        log.info("Creating PayPal order for service: {}", request.getServiceId());
        CreateOrderResponse response = paymentService.createOrder(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Step 2: Capture an approved PayPal order.
     * Called after the user approves the payment on PayPal.
     * Idempotent — safe to call multiple times with the same order ID.
     */
    @PostMapping("/capture-order/{orderId}")
    public ResponseEntity<CaptureOrderResponse> captureOrder(
            @PathVariable String orderId) {
        log.info("Capturing PayPal order: {}", orderId);
        CaptureOrderResponse response = paymentService.captureOrder(orderId);
        return ResponseEntity.ok(response);
    }

    /**
     * Get transaction history for a user.
     */
    @GetMapping("/transactions/{userId}")
    public ResponseEntity<List<Payment>> getTransactions(
            @PathVariable String userId) {
        return ResponseEntity.ok(paymentService.getTransactions(userId));
    }

    /**
     * Health check for PayPal integration.
     */
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> status() {
        return ResponseEntity.ok(Map.of(
                "service", "PayPal Payment Integration",
                "mode", "sandbox",
                "status", "operational",
                "note", "Using PayPal Sandbox. No real transactions."
        ));
    }
}
