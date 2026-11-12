package com.vayura.dto;

/**
 * Response body for a created PayPal order.
 */
public class CreateOrderResponse {

    private String orderId;
    private String status;
    private String approveUrl;
    private boolean sandbox;
    private String internalPaymentId;

    public CreateOrderResponse() {}

    public CreateOrderResponse(String orderId, String status, String approveUrl, boolean sandbox, String internalPaymentId) {
        this.orderId = orderId;
        this.status = status;
        this.approveUrl = approveUrl;
        this.sandbox = sandbox;
        this.internalPaymentId = internalPaymentId;
    }

    public static Builder builder() {
        return new Builder();
    }

    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getApproveUrl() { return approveUrl; }
    public void setApproveUrl(String approveUrl) { this.approveUrl = approveUrl; }

    public boolean isSandbox() { return sandbox; }
    public void setSandbox(boolean sandbox) { this.sandbox = sandbox; }

    public String getInternalPaymentId() { return internalPaymentId; }
    public void setInternalPaymentId(String internalPaymentId) { this.internalPaymentId = internalPaymentId; }

    public static class Builder {
        private String orderId;
        private String status;
        private String approveUrl;
        private boolean sandbox;
        private String internalPaymentId;

        public Builder orderId(String orderId) { this.orderId = orderId; return this; }
        public Builder status(String status) { this.status = status; return this; }
        public Builder approveUrl(String approveUrl) { this.approveUrl = approveUrl; return this; }
        public Builder sandbox(boolean sandbox) { this.sandbox = sandbox; return this; }
        public Builder internalPaymentId(String internalPaymentId) { this.internalPaymentId = internalPaymentId; return this; }

        public CreateOrderResponse build() {
            return new CreateOrderResponse(orderId, status, approveUrl, sandbox, internalPaymentId);
        }
    }
}
