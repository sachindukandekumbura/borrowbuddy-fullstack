package com.borrowbuddy.backend.repository;

import com.borrowbuddy.backend.model.Item;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ItemRepository extends JpaRepository<Item, Long> {
}