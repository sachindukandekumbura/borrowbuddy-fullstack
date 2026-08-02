package com.borrowbuddy.backend.repository;

import com.borrowbuddy.backend.model.BorrowRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BorrowRequestRepository
        extends JpaRepository<BorrowRequest, Long> {
}