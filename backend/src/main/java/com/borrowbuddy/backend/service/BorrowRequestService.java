package com.borrowbuddy.backend.service;

import com.borrowbuddy.backend.model.*;
import com.borrowbuddy.backend.repository.BorrowRequestRepository;
import com.borrowbuddy.backend.repository.ItemRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class BorrowRequestService {

    private final BorrowRequestRepository requestRepository;
    private final ItemRepository itemRepository;

    public BorrowRequestService(
            BorrowRequestRepository requestRepository,
            ItemRepository itemRepository
    ) {
        this.requestRepository = requestRepository;
        this.itemRepository = itemRepository;
    }

    public List<BorrowRequest> getAllRequests() {
        return requestRepository.findAll();
    }

    public BorrowRequest createRequest(
            Long itemId,
            BorrowRequest request
    ) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Item not found"
                ));

        if (item.getStatus() != ItemStatus.AVAILABLE) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "This item is not available"
            );
        }

        if (request.getReturnDate().isBefore(request.getBorrowDate())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Return date cannot be before borrow date"
            );
        }

        request.setId(null);
        request.setItem(item);
        request.setStatus(RequestStatus.PENDING);

        return requestRepository.save(request);
    }

    public BorrowRequest updateRequestStatus(
            Long requestId,
            RequestStatus newStatus
    ) {
        BorrowRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Borrow request not found"
                ));

        Item item = request.getItem();

        if (newStatus == RequestStatus.APPROVED) {
            if (item.getStatus() != ItemStatus.AVAILABLE) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Item is already borrowed"
                );
            }

            item.setStatus(ItemStatus.BORROWED);
            itemRepository.save(item);
        }

        if (newStatus == RequestStatus.RETURNED) {
            item.setStatus(ItemStatus.AVAILABLE);
            itemRepository.save(item);
        }

        request.setStatus(newStatus);

        return requestRepository.save(request);
    }
}