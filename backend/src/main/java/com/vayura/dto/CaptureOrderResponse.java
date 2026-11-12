package com.vayura.dto;

import java.math.BigDecimal;

/**
 * Response body for a captured PayPal order.
 */
public class CaptureOrderResponse {

    private String orderId;
    private String paymentId;
    private String status;
    private BigDecimal amount;
    private String currency;
    private boolean sandbox;
    private String captureId;
    private String message;

    public CaptureOrderResponse() {}

    public CaptureOrderResponse(String orderId, String paymentId, String status, BigDecimal amount, String currency, boolean sandbox, String captureId, String message) {
        this.orderId = orderId;
        this.paymentId = paymentId;
        this.status = status;
        this.amount = amount;
        this.currency = currency;
        this.sandbox = sandbox;
        this.captureId = captureId;
        this.message = message;
    }

    public static Builder builder() {
        return new Builder();
    }

    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }

    public String getPaymentId() { return paymentId; }
    public void setPaymentId(String paymentId) { this.paymentId = paymentId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public boolean isSandbox() { return sandbox; }
    public void setSandbox(boolean sandbox) { this.sandbox = sandbox; }

    public String getCaptureId() { return captureId; }
    public void setCaptureId(String captureId) { this.captureId = captureId; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public static class Builder {
        private String orderId;
        private String paymentId;
        private String status;
        private BigDecimal amount;
        private String currency;
        private boolean sandbox;
        private String captureId;
        private String message;

        public Builder orderId(String orderId) { this.orderId = orderId; return this; }
        public Builder paymentId(String paymentId) { this.paymentId = paymentId; return this; }
        public Builder status(String status) { this.status = status; return this; }
        public Builder amount(BigDecimal amount) { this.amount = amount; return this; }
        public Builder currency(String currency) { this.currency = currency; return this; }
        public Builder sandbox(boolean sandbox) { this.sandbox = sandbox; return this; }
        public Builder captureId(String captureId) { this.captureId = captureId; return this; }
        public Builder message(String message) { this.message = message; return this; }

        public CaptureOrderResponse build() {
            return new CaptureOrderResponse(orderId, paymentId, status, amount, currency, sandbox, captureId, message);
        }
    }
}
