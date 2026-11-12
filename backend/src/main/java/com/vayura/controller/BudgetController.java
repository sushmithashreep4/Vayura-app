package com.vayura.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {

    public record BudgetCategoryDto(
            String id,
            String name,
            BigDecimal allocatedAmount,
            BigDecimal spentAmount,
            String icon,
            String color
    ) {}

    public record ExpenseDto(
            String id,
            String categoryId,
            String categoryName,
            String description,
            BigDecimal amount,
            String currency,
            String paymentId,
            boolean isPayPal,
            LocalDateTime date
    ) {}

    public record BudgetResponseDto(
            String id,
            String profileId,
            BigDecimal totalBudget,
            String currency,
            BigDecimal spentTotal,
            BigDecimal remainingTotal,
            List<BudgetCategoryDto> categories,
            List<ExpenseDto> expenses
    ) {}

    public record AddExpenseRequest(
            String categoryId,
            String description,
            BigDecimal amount,
            String currency,
            String paymentId
    ) {}

    // In-memory store for dev / session persistence
    private static final Map<String, BudgetResponseDto> BUDGETS = new HashMap<>();

    @GetMapping("/{profileId}")
    public ResponseEntity<BudgetResponseDto> getBudget(@PathVariable String profileId) {
        BudgetResponseDto budget = BUDGETS.computeIfAbsent(profileId, id -> createDefaultBudget(id));
        return ResponseEntity.ok(budget);
    }

    @PostMapping("/{budgetId}/expenses")
    public ResponseEntity<BudgetResponseDto> addExpense(
            @PathVariable String budgetId,
            @RequestBody AddExpenseRequest request
    ) {
        BudgetResponseDto current = BUDGETS.get(budgetId);
        if (current == null) {
            current = createDefaultBudget(budgetId);
        }

        List<ExpenseDto> updatedExpenses = new ArrayList<>(current.expenses());
        ExpenseDto newExpense = new ExpenseDto(
                UUID.randomUUID().toString(),
                request.categoryId(),
                getCategoryName(request.categoryId(), current.categories()),
                request.description(),
                request.amount(),
                request.currency() != null ? request.currency() : current.currency(),
                request.paymentId(),
                request.paymentId() != null,
                LocalDateTime.now()
        );
        updatedExpenses.add(0, newExpense);

        BigDecimal newSpent = current.spentTotal().add(request.amount());
        BigDecimal newRemaining = current.totalBudget().subtract(newSpent);

        // Update category spent amount
        List<BudgetCategoryDto> updatedCategories = current.categories().stream()
                .map(cat -> {
                    if (cat.id().equalsIgnoreCase(request.categoryId()) || cat.name().equalsIgnoreCase(request.categoryId())) {
                        return new BudgetCategoryDto(cat.id(), cat.name(), cat.allocatedAmount(), cat.spentAmount().add(request.amount()), cat.icon(), cat.color());
                    }
                    return cat;
                })
                .toList();

        BudgetResponseDto updatedBudget = new BudgetResponseDto(
                current.id(),
                current.profileId(),
                current.totalBudget(),
                current.currency(),
                newSpent,
                newRemaining,
                updatedCategories,
                updatedExpenses
        );

        BUDGETS.put(budgetId, updatedBudget);
        return ResponseEntity.ok(updatedBudget);
    }

    private String getCategoryName(String categoryId, List<BudgetCategoryDto> categories) {
        return categories.stream()
                .filter(c -> c.id().equalsIgnoreCase(categoryId))
                .map(BudgetCategoryDto::name)
                .findFirst()
                .orElse("Local Essentials");
    }

    private BudgetResponseDto createDefaultBudget(String profileId) {
        BigDecimal total = new BigDecimal("3500.00");
        List<BudgetCategoryDto> categories = List.of(
                new BudgetCategoryDto("cat-acc", "Accommodation", new BigDecimal("1200.00"), BigDecimal.ZERO, "Home", "#3b82f6"),
                new BudgetCategoryDto("cat-food", "Food & Groceries", new BigDecimal("700.00"), BigDecimal.ZERO, "Utensils", "#10b981"),
                new BudgetCategoryDto("cat-trans", "Transportation", new BigDecimal("450.00"), BigDecimal.ZERO, "Compass", "#f59e0b"),
                new BudgetCategoryDto("cat-conn", "Connectivity & SIM", new BigDecimal("150.00"), BigDecimal.ZERO, "Wifi", "#8b5cf6"),
                new BudgetCategoryDto("cat-health", "Health & Insurance", new BigDecimal("300.00"), BigDecimal.ZERO, "HeartPulse", "#ec4899"),
                new BudgetCategoryDto("cat-serv", "Local Services & Essentials", new BigDecimal("400.00"), BigDecimal.ZERO, "Sparkles", "#06b6d4"),
                new BudgetCategoryDto("cat-emerg", "Emergency Reserve", new BigDecimal("300.00"), BigDecimal.ZERO, "ShieldAlert", "#ef4444")
        );

        return new BudgetResponseDto(
                profileId,
                profileId,
                total,
                "USD",
                BigDecimal.ZERO,
                total,
                categories,
                new ArrayList<>()
        );
    }
}

