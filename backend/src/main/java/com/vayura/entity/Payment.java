package com.vayura.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Persists PayPal payment transactions.
 * Idempotent — capture is never attempted on an already-captured order.
 */
@Entity
@Table(
    name = "payments",
    indexes = {
        @Index(name = "idx_payment_paypal_order", columnList = "paypalOrderId"),
        @Index(name = "idx_payment_user", columnList = "userId"),
    }
)
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String userId;

    /**
     * The PayPal Order ID returned by the PayPal Orders API.
     * Unique per transaction.
     */
    @Column(nullable = false, unique = true)
    private String paypalOrderId;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false, length = 3)
    private String currency;

    @Column
    private String relatedService;

    @Column(length = 500)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus status;

    /** True when using PayPal Sandbox credentials — clearly identified in all responses */
    @Column(nullable = false)
    private boolean sandbox;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public enum PaymentStatus {
        CREATED, APPROVED, CAPTURED, FAILED, CANCELLED, REFUNDED
    }

    public Payment() {}

    public Payment(String id, String userId, String paypalOrderId, BigDecimal amount, String currency, String relatedService, String description, PaymentStatus status, boolean sandbox, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.userId = userId;
        this.paypalOrderId = paypalOrderId;
        this.amount = amount;
        this.currency = currency;
        this.relatedService = relatedService;
        this.description = description;
        this.status = status;
        this.sandbox = sandbox;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getPaypalOrderId() { return paypalOrderId; }
    public void setPaypalOrderId(String paypalOrderId) { this.paypalOrderId = paypalOrderId; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public String getRelatedService() { return relatedService; }
    public void setRelatedService(String relatedService) { this.relatedService = relatedService; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public PaymentStatus getStatus() { return status; }
    public void setStatus(PaymentStatus status) { this.status = status; }

    public boolean isSandbox() { return sandbox; }
    public void setSandbox(boolean sandbox) { this.sandbox = sandbox; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static class Builder {
        private String id;
        private String userId;
        private String paypalOrderId;
        private BigDecimal amount;
        private String currency;
        private String relatedService;
        private String description;
        private PaymentStatus status;
        private boolean sandbox;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public Builder id(String id) { this.id = id; return this; }
        public Builder userId(String userId) { this.userId = userId; return this; }
        public Builder paypalOrderId(String paypalOrderId) { this.paypalOrderId = paypalOrderId; return this; }
        public Builder amount(BigDecimal amount) { this.amount = amount; return this; }
        public Builder currency(String currency) { this.currency = currency; return this; }
        public Builder relatedService(String relatedService) { this.relatedService = relatedService; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder status(PaymentStatus status) { this.status = status; return this; }
        public Builder sandbox(boolean sandbox) { this.sandbox = sandbox; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public Builder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public Payment build() {
            return new Payment(id, userId, paypalOrderId, amount, currency, relatedService, description, status, sandbox, createdAt, updatedAt);
        }
    }
}
