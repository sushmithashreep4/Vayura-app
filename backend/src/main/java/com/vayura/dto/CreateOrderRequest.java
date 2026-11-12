package com.vayura.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

/**
 * Request body for creating a PayPal order.
 */
public class CreateOrderRequest {

    @NotNull
    @DecimalMin("0.01")
    private BigDecimal amount;

    @NotBlank
    @Size(min = 3, max = 3)
    private String currency;

    @NotBlank
    @Size(max = 200)
    private String description;

    private String serviceId;
    private String userId;

    public CreateOrderRequest() {}

    public CreateOrderRequest(BigDecimal amount, String currency, String description, String serviceId, String userId) {
        this.amount = amount;
        this.currency = currency;
        this.description = description;
        this.serviceId = serviceId;
        this.userId = userId;
    }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getServiceId() { return serviceId; }
    public void setServiceId(String serviceId) { this.serviceId = serviceId; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
}
