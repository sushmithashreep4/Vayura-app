package com.vayura.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.Map;

/**
 * Request body for the AI chat endpoint.
 */
public class AiChatRequest {

    @NotBlank
    @Size(max = 2000)
    private String message;

    private String conversationId;
    private String travelProfileId;
    private Map<String, Object> context;

    public AiChatRequest() {}

    public AiChatRequest(String message, String conversationId, String travelProfileId, Map<String, Object> context) {
        this.message = message;
        this.conversationId = conversationId;
        this.travelProfileId = travelProfileId;
        this.context = context;
    }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getConversationId() { return conversationId; }
    public void setConversationId(String conversationId) { this.conversationId = conversationId; }

    public String getTravelProfileId() { return travelProfileId; }
    public void setTravelProfileId(String travelProfileId) { this.travelProfileId = travelProfileId; }

    public Map<String, Object> getContext() { return context; }
    public void setContext(Map<String, Object> context) { this.context = context; }
}
