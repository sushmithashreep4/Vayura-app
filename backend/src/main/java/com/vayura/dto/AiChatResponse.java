package com.vayura.dto;

/**
 * Response body from the AI assistant endpoint.
 */
public class AiChatResponse {

    private String conversationId;
    private String messageId;
    private String message;
    private boolean aiGenerated;
    private boolean demoMode;
    private String disclaimer;

    public AiChatResponse() {}

    public AiChatResponse(String conversationId, String messageId, String message, boolean aiGenerated, boolean demoMode, String disclaimer) {
        this.conversationId = conversationId;
        this.messageId = messageId;
        this.message = message;
        this.aiGenerated = aiGenerated;
        this.demoMode = demoMode;
        this.disclaimer = disclaimer;
    }

    public static Builder builder() {
        return new Builder();
    }

    public String getConversationId() { return conversationId; }
    public void setConversationId(String conversationId) { this.conversationId = conversationId; }

    public String getMessageId() { return messageId; }
    public void setMessageId(String messageId) { this.messageId = messageId; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public boolean isAiGenerated() { return aiGenerated; }
    public void setAiGenerated(boolean aiGenerated) { this.aiGenerated = aiGenerated; }

    public boolean isDemoMode() { return demoMode; }
    public void setDemoMode(boolean demoMode) { this.demoMode = demoMode; }

    public String getDisclaimer() { return disclaimer; }
    public void setDisclaimer(String disclaimer) { this.disclaimer = disclaimer; }

    public static class Builder {
        private String conversationId;
        private String messageId;
        private String message;
        private boolean aiGenerated;
        private boolean demoMode;
        private String disclaimer;

        public Builder conversationId(String conversationId) { this.conversationId = conversationId; return this; }
        public Builder messageId(String messageId) { this.messageId = messageId; return this; }
        public Builder message(String message) { this.message = message; return this; }
        public Builder aiGenerated(boolean aiGenerated) { this.aiGenerated = aiGenerated; return this; }
        public Builder demoMode(boolean demoMode) { this.demoMode = demoMode; return this; }
        public Builder disclaimer(String disclaimer) { this.disclaimer = disclaimer; return this; }

        public AiChatResponse build() {
            return new AiChatResponse(conversationId, messageId, message, aiGenerated, demoMode, disclaimer);
        }
    }
}
