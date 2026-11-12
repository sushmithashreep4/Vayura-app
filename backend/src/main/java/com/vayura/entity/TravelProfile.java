package com.vayura.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Represents a user's travel journey profile.
 * Purpose-aware and country-aware to drive personalised experience.
 */
@Entity
@Table(name = "travel_profiles")
public class TravelProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    @NotBlank
    private String userId;

    @Column(nullable = false, length = 2)
    @NotBlank
    private String originCountryCode;

    @Column(nullable = false, length = 2)
    @NotBlank
    private String destinationCountryCode;

    @Column(nullable = false)
    @NotNull
    @Enumerated(EnumType.STRING)
    private TravelPurpose purpose;

    @Column
    private LocalDate arrivalDate;

    @Column
    @Min(1)
    private Integer lengthOfStayDays;

    @Column(precision = 15, scale = 2)
    @DecimalMin("0.00")
    private BigDecimal budgetAmount;

    @Column(length = 3)
    private String budgetCurrency;

    @Column(length = 10)
    private String preferredLanguage;

    @Column(length = 1000)
    private String preferences;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public enum TravelPurpose {
        HIGHER_EDUCATION, EMPLOYMENT, JOB_SEARCH, TOURISM, BUSINESS,
        EXCHANGE_PROGRAMME, DIGITAL_NOMAD, PERMANENT_RELOCATION, OTHER
    }

    public TravelProfile() {}

    public TravelProfile(String id, String userId, String originCountryCode, String destinationCountryCode, TravelPurpose purpose, LocalDate arrivalDate, Integer lengthOfStayDays, BigDecimal budgetAmount, String budgetCurrency, String preferredLanguage, String preferences, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.userId = userId;
        this.originCountryCode = originCountryCode;
        this.destinationCountryCode = destinationCountryCode;
        this.purpose = purpose;
        this.arrivalDate = arrivalDate;
        this.lengthOfStayDays = lengthOfStayDays;
        this.budgetAmount = budgetAmount;
        this.budgetCurrency = budgetCurrency;
        this.preferredLanguage = preferredLanguage;
        this.preferences = preferences;
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

    public String getOriginCountryCode() { return originCountryCode; }
    public void setOriginCountryCode(String originCountryCode) { this.originCountryCode = originCountryCode; }

    public String getDestinationCountryCode() { return destinationCountryCode; }
    public void setDestinationCountryCode(String destinationCountryCode) { this.destinationCountryCode = destinationCountryCode; }

    public TravelPurpose getPurpose() { return purpose; }
    public void setPurpose(TravelPurpose purpose) { this.purpose = purpose; }

    public LocalDate getArrivalDate() { return arrivalDate; }
    public void setArrivalDate(LocalDate arrivalDate) { this.arrivalDate = arrivalDate; }

    public Integer getLengthOfStayDays() { return lengthOfStayDays; }
    public void setLengthOfStayDays(Integer lengthOfStayDays) { this.lengthOfStayDays = lengthOfStayDays; }

    public BigDecimal getBudgetAmount() { return budgetAmount; }
    public void setBudgetAmount(BigDecimal budgetAmount) { this.budgetAmount = budgetAmount; }

    public String getBudgetCurrency() { return budgetCurrency; }
    public void setBudgetCurrency(String budgetCurrency) { this.budgetCurrency = budgetCurrency; }

    public String getPreferredLanguage() { return preferredLanguage; }
    public void setPreferredLanguage(String preferredLanguage) { this.preferredLanguage = preferredLanguage; }

    public String getPreferences() { return preferences; }
    public void setPreferences(String preferences) { this.preferences = preferences; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static class Builder {
        private String id;
        private String userId;
        private String originCountryCode;
        private String destinationCountryCode;
        private TravelPurpose purpose;
        private LocalDate arrivalDate;
        private Integer lengthOfStayDays;
        private BigDecimal budgetAmount;
        private String budgetCurrency;
        private String preferredLanguage;
        private String preferences;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public Builder id(String id) { this.id = id; return this; }
        public Builder userId(String userId) { this.userId = userId; return this; }
        public Builder originCountryCode(String originCountryCode) { this.originCountryCode = originCountryCode; return this; }
        public Builder destinationCountryCode(String destinationCountryCode) { this.destinationCountryCode = destinationCountryCode; return this; }
        public Builder purpose(TravelPurpose purpose) { this.purpose = purpose; return this; }
        public Builder arrivalDate(LocalDate arrivalDate) { this.arrivalDate = arrivalDate; return this; }
        public Builder lengthOfStayDays(Integer lengthOfStayDays) { this.lengthOfStayDays = lengthOfStayDays; return this; }
        public Builder budgetAmount(BigDecimal budgetAmount) { this.budgetAmount = budgetAmount; return this; }
        public Builder budgetCurrency(String budgetCurrency) { this.budgetCurrency = budgetCurrency; return this; }
        public Builder preferredLanguage(String preferredLanguage) { this.preferredLanguage = preferredLanguage; return this; }
        public Builder preferences(String preferences) { this.preferences = preferences; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public Builder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public TravelProfile build() {
            return new TravelProfile(id, userId, originCountryCode, destinationCountryCode, purpose, arrivalDate, lengthOfStayDays, budgetAmount, budgetCurrency, preferredLanguage, preferences, createdAt, updatedAt);
        }
    }
}
