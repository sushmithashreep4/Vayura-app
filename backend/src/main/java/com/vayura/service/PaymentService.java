package com.vayura.service;

import com.vayura.dto.CaptureOrderResponse;
import com.vayura.dto.CreateOrderRequest;
import com.vayura.dto.CreateOrderResponse;
import com.vayura.entity.Payment;
import com.vayura.integration.paypal.PayPalService;
import com.vayura.repository.PaymentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Orchestrates payment lifecycle:
 * create → approve (user action on PayPal) → capture → persist
 *
 * Idempotency: will not capture an already-captured order.
 */
@Service
public class PaymentService {

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(PaymentService.class);

    private final PaymentRepository paymentRepository;
    private final PayPalService payPalService;

    public PaymentService(PaymentRepository paymentRepository, PayPalService payPalService) {
        this.paymentRepository = paymentRepository;
        this.payPalService = payPalService;
    }

    /**
     * Creates a PayPal Sandbox order and persists a CREATED payment record.
     */
    @Transactional
    public CreateOrderResponse createOrder(CreateOrderRequest request) {
        try {
            String amountStr = request.getAmount().setScale(2, java.math.RoundingMode.HALF_UP).toPlainString();

            PayPalService.PayPalOrderResult result = payPalService.createOrder(
                    amountStr,
                    request.getCurrency(),
                    request.getDescription()
            );

            Payment payment = Payment.builder()
                    .userId(Optional.ofNullable(request.getUserId()).orElse("guest"))
                    .paypalOrderId(result.orderId())
                    .amount(request.getAmount())
                    .currency(request.getCurrency())
                    .relatedService(request.getServiceId())
                    .description(request.getDescription())
                    .status(Payment.PaymentStatus.CREATED)
                    .sandbox(result.sandbox())
                    .build();

            payment = paymentRepository.save(payment);

            return CreateOrderResponse.builder()
                    .orderId(result.orderId())
                    .status(result.status())
                    .approveUrl(result.approveUrl())
                    .sandbox(result.sandbox())
                    .internalPaymentId(payment.getId())
                    .build();

        } catch (Exception e) {
            log.error("Error creating PayPal order: {}", e.getMessage());
            throw new RuntimeException("Could not create payment order: " + e.getMessage(), e);
        }
    }

    /**
     * Captures an approved PayPal order.
     * Idempotent — returns existing capture result if already captured.
     */
    @Transactional
    public CaptureOrderResponse captureOrder(String paypalOrderId) {
        // Idempotency guard
        if (paymentRepository.existsByPaypalOrderIdAndStatus(
                paypalOrderId, Payment.PaymentStatus.CAPTURED)) {
            log.info("Order {} already captured — returning existing record", paypalOrderId);
            Payment existing = paymentRepository.findByPaypalOrderId(paypalOrderId)
                    .orElseThrow(() -> new RuntimeException("Payment not found"));
            return CaptureOrderResponse.builder()
                    .orderId(paypalOrderId)
                    .paymentId(existing.getId())
                    .status("COMPLETED")
                    .amount(existing.getAmount())
                    .currency(existing.getCurrency())
                    .sandbox(existing.isSandbox())
                    .message("Order already captured.")
                    .build();
        }

        try {
            PayPalService.PayPalCaptureResult result = payPalService.captureOrder(paypalOrderId);

            // Update payment record
            Payment paymentRecord = paymentRepository.findByPaypalOrderId(paypalOrderId)
                    .orElse(null);

            if (paymentRecord != null) {
                if ("COMPLETED".equals(result.status())) {
                    paymentRecord.setStatus(Payment.PaymentStatus.CAPTURED);
                } else {
                    paymentRecord.setStatus(Payment.PaymentStatus.FAILED);
                }
                paymentRepository.save(paymentRecord);
            }

            String paymentId = paymentRecord != null ? paymentRecord.getId() : null;
            java.math.BigDecimal finalAmount = result.amount() != null 
                    ? new java.math.BigDecimal(result.amount()) 
                    : (paymentRecord != null ? paymentRecord.getAmount() : null);
            String finalCurrency = result.currency() != null 
                    ? result.currency() 
                    : (paymentRecord != null ? paymentRecord.getCurrency() : "USD");

            return CaptureOrderResponse.builder()
                    .orderId(paypalOrderId)
                    .paymentId(paymentId)
                    .status(result.status())
                    .amount(finalAmount)
                    .currency(finalCurrency)
                    .sandbox(result.sandbox())
                    .captureId(result.captureId())
                    .message("Payment captured successfully.")
                    .build();

        } catch (Exception e) {
            log.error("Error capturing PayPal order {}: {}", paypalOrderId, e.getMessage());

            paymentRepository.findByPaypalOrderId(paypalOrderId).ifPresent(payment -> {
                payment.setStatus(Payment.PaymentStatus.FAILED);
                paymentRepository.save(payment);
            });

            throw new RuntimeException("Could not capture payment: " + e.getMessage(), e);
        }
    }

    public List<Payment> getTransactions(String userId) {
        return paymentRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
}
