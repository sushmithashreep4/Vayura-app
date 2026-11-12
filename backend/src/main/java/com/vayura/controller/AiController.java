package com.vayura.controller;

import com.vayura.ai.AiService;
import com.vayura.dto.AiChatRequest;
import com.vayura.dto.AiChatResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

/**
 * REST controller for AI assistant interactions.
 *
 * AI never executes payments or modifies data autonomously.
 * All sensitive operations require explicit user action.
 */
@RestController
@RequestMapping("/api/ai")
public class AiController {

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(AiController.class);

    private final AiService aiService;

    public AiController(AiService aiService) {
        this.aiService = aiService;
    }

    /**
     * Send a message to the AI assistant.
     * Returns a contextual response based on the user's journey profile.
     */
    @PostMapping("/chat")
    public ResponseEntity<AiChatResponse> chat(@Valid @RequestBody AiChatRequest request) {
        log.info("AI chat request received (conversationId: {})", request.getConversationId());
        AiChatResponse response = aiService.chat(request);
        response.setConversationId(
                request.getConversationId() != null
                        ? request.getConversationId()
                        : UUID.randomUUID().toString()
        );
        response.setMessageId(UUID.randomUUID().toString());
        return ResponseEntity.ok(response);
    }

    /**
     * Health check for AI service.
     */
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> status() {
        return ResponseEntity.ok(Map.of(
                "service", "VAYURA AI Assistant",
                "status", "operational",
                "note", "Demo mode active when AI_API_KEY not configured."
        ));
    }
}
