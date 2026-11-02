package com.payanam.railconnect.controller;

import com.payanam.railconnect.dto.BookingRequestDto;
import com.payanam.railconnect.dto.ConnectingBookingRequestDto;
import com.payanam.railconnect.entity.PassengerEntity;
import com.payanam.railconnect.entity.ReservationEntity;
import com.payanam.railconnect.security.JwtUtil;
import com.payanam.railconnect.service.ReservationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping({"/api/v1/reservations", "/api/reservations"})
public class ReservationController {

    private final ReservationService reservationService;
    private final JwtUtil jwtUtil;

    public ReservationController(ReservationService reservationService, JwtUtil jwtUtil) {
        this.reservationService = reservationService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping({"", "/book"})
    public ResponseEntity<ReservationEntity> bookTicket(
            @RequestBody BookingRequestDto request,
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        Long userId = extractUserId(authHeader);

        List<PassengerEntity> passengers = new ArrayList<>();
        if (request.getPassengers() != null) {
            for (BookingRequestDto.PassengerDto dto : request.getPassengers()) {
                PassengerEntity p = new PassengerEntity();
                p.setName(dto.getName());
                p.setAge(dto.getAge());
                p.setGender(dto.getGender());
                p.setBerthPreference(dto.getBerthPreference());
                p.setEmergencyReason(dto.getEmergencyReason());
                p.setEmergencyId(dto.getEmergencyId());
                p.setConnectingPnr(dto.getConnectingPnr());
                passengers.add(p);
            }
        }

        ReservationEntity reservation = reservationService.bookTicketWithUser(
                request.getTrainId(),
                request.getTravelClass(),
                request.getTravelDate(),
                request.getBookingMode(),
                passengers,
                request.getTotalFare(),
                request.getPaymentId(),
                userId
        );

        return ResponseEntity.ok(reservation);
    }

    @PostMapping({"/connecting", "/book-connecting"})
    public ResponseEntity<Map<String, Object>> bookConnectingJourney(
            @RequestBody ConnectingBookingRequestDto request,
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        Long userId = extractUserId(authHeader);
        Map<String, Object> result = reservationService.bookConnectingJourney(request, userId);
        return ResponseEntity.ok(result);
    }

    @PostMapping({"/cancel/{pnr}", "/{pnr}/cancel"})
    public ResponseEntity<Map<String, Object>> cancelTicket(@PathVariable String pnr) {
        Map<String, Object> result = reservationService.cancelTicket(pnr);
        return ResponseEntity.ok(result);
    }

    @GetMapping({"", "/my-bookings"})
    public ResponseEntity<List<ReservationEntity>> getMyBookings(
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        Long userId = extractUserId(authHeader);
        return ResponseEntity.ok(reservationService.getUserReservations(userId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ReservationEntity>> getUserBookings(@PathVariable Long userId) {
        return ResponseEntity.ok(reservationService.getUserReservations(userId));
    }

    @GetMapping("/pnr/{pnr}")
    public ResponseEntity<ReservationEntity> getReservationByPnr(@PathVariable String pnr) {
        return reservationService.getReservationByPnr(pnr)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    private Long extractUserId(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            if (jwtUtil.validateToken(token)) {
                return jwtUtil.extractUserId(token);
            }
        }
        return null;
    }
}
