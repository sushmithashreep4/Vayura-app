package com.vayura.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Persists AI conversation history for context-aware responses.
 * Message content is stored as JSON text for flexibility.
 */
@Entity
@Table(name = "ai_conversations",
    indexes = { @Index(name = "idx_conversation_user", columnList = "userId") })
public class AiConversation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String userId;

    @Column
    private String travelProfileId;

    /**
     * JSON array of messages: [{role, content, timestamp}]
     * Stored as large text — no sensitive personal data should be stored here.
     */
    @Column(columnDefinition = "TEXT")
    private String messagesJson;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    public AiConversation() {}

    public AiConversation(String id, String userId, String travelProfileId, String messagesJson, LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.travelProfileId = travelProfileId;
        this.messagesJson = messagesJson;
        this.createdAt = createdAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getTravelProfileId() { return travelProfileId; }
    public void setTravelProfileId(String travelProfileId) { this.travelProfileId = travelProfileId; }

    public String getMessagesJson() { return messagesJson; }
    public void setMessagesJson(String messagesJson) { this.messagesJson = messagesJson; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static class Builder {
        private String id;
        private String userId;
        private String travelProfileId;
        private String messagesJson;
        private LocalDateTime createdAt;

        public Builder id(String id) { this.id = id; return this; }
        public Builder userId(String userId) { this.userId = userId; return this; }
        public Builder travelProfileId(String travelProfileId) { this.travelProfileId = travelProfileId; return this; }
        public Builder messagesJson(String messagesJson) { this.messagesJson = messagesJson; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public AiConversation build() {
            return new AiConversation(id, userId, travelProfileId, messagesJson, createdAt);
        }
    }
}
