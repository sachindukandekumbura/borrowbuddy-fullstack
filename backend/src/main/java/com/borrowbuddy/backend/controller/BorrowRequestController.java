package com.borrowbuddy.backend.controller;

import com.borrowbuddy.backend.dto.StatusUpdateRequest;
import com.borrowbuddy.backend.model.BorrowRequest;
import com.borrowbuddy.backend.model.RequestStatus;
import com.borrowbuddy.backend.service.BorrowRequestService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
@CrossOrigin(origins = "http://localhost:5173")
public class BorrowRequestController {

    private final BorrowRequestService requestService;

    public BorrowRequestController(
            BorrowRequestService requestService
    ) {
        this.requestService = requestService;
    }

    @GetMapping
    public List<BorrowRequest> getAllRequests() {
        return requestService.getAllRequests();
    }

    @PostMapping("/item/{itemId}")
    @ResponseStatus(HttpStatus.CREATED)
    public BorrowRequest createRequest(
            @PathVariable Long itemId,
            @Valid @RequestBody BorrowRequest request
    ) {
        return requestService.createRequest(itemId, request);
    }

    @PatchMapping("/{requestId}/status")
    public BorrowRequest updateStatus(
            @PathVariable Long requestId,
            @RequestBody StatusUpdateRequest body
    ) {
        try {
            RequestStatus status = RequestStatus.valueOf(
                    body.getStatus().toUpperCase()
            );

            return requestService.updateRequestStatus(
                    requestId,
                    status
            );
        } catch (IllegalArgumentException |
                 NullPointerException exception) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid request status"
            );
        }
    }
}