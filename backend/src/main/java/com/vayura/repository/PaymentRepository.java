package com.vayura.repository;

import com.vayura.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, String> {

    /**
     * Find by PayPal order ID — used for idempotency checks before capture.
     */
    Optional<Payment> findByPaypalOrderId(String paypalOrderId);

    /**
     * Find all payments for a user, ordered newest first.
     */
    List<Payment> findByUserIdOrderByCreatedAtDesc(String userId);

    /**
     * Check if a PayPal order has already been captured.
     */
    boolean existsByPaypalOrderIdAndStatus(String paypalOrderId, Payment.PaymentStatus status);
}
