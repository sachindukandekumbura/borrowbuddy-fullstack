package com.borrowbuddy.backend.service;

import com.borrowbuddy.backend.model.Item;
import com.borrowbuddy.backend.model.ItemStatus;
import com.borrowbuddy.backend.repository.ItemRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ItemService {

    private final ItemRepository itemRepository;

    public ItemService(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }

    public List<Item> getAllItems() {
        return itemRepository.findAll();
    }

    public Item getItemById(Long id) {
        return itemRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Item not found"
                ));
    }

    public Item createItem(Item item) {
        item.setId(null);

        if (item.getStatus() == null) {
            item.setStatus(ItemStatus.AVAILABLE);
        }

        return itemRepository.save(item);
    }

    public Item updateItem(Long id, Item newItem) {
        Item existingItem = getItemById(id);

        existingItem.setName(newItem.getName());
        existingItem.setDescription(newItem.getDescription());
        existingItem.setCategory(newItem.getCategory());
        existingItem.setOwnerName(newItem.getOwnerName());
        existingItem.setLocation(newItem.getLocation());
        existingItem.setConditionStatus(newItem.getConditionStatus());
        existingItem.setImageUrl(newItem.getImageUrl());

        if (newItem.getStatus() != null) {
            existingItem.setStatus(newItem.getStatus());
        }

        return itemRepository.save(existingItem);
    }

    public void deleteItem(Long id) {
        Item item = getItemById(id);
        itemRepository.delete(item);
    }
}