package com.payanam.railconnect;

import com.payanam.railconnect.entity.PassengerEntity;
import com.payanam.railconnect.entity.ReservationEntity;
import com.payanam.railconnect.entity.StationEntity;
import com.payanam.railconnect.entity.TrainEntity;
import com.payanam.railconnect.dto.BookingRequestDto;
import com.payanam.railconnect.dto.ConnectingBookingRequestDto;
import com.payanam.railconnect.model.BookingMode;
import com.payanam.railconnect.model.ReservationStatus;
import com.payanam.railconnect.repository.StationRepository;
import com.payanam.railconnect.repository.TrainRepository;
import com.payanam.railconnect.service.ReservationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class ReservationServiceTest {

    @Autowired
    private ReservationService reservationService;

    @Autowired
    private TrainRepository trainRepository;

    @Autowired
    private StationRepository stationRepository;

    private final String trainId = "TEST-TRAIN-1";
    private final LocalDate testDate = LocalDate.now().plusDays(2);
    private final String travelClass = "2A";

    @BeforeEach
    void setUp() {
        if (!stationRepository.existsById("STN1")) {
            StationEntity s1 = new StationEntity("STN1", "Station 1", "நிலையம் 1", "TN", "Junction", 4);
            stationRepository.save(s1);
        }
        if (!stationRepository.existsById("STN2")) {
            StationEntity s2 = new StationEntity("STN2", "Station 2", "நிலையம் 2", "TN", "Junction", 4);
            stationRepository.save(s2);
        }

        if (!trainRepository.existsById(trainId)) {
            TrainEntity train = new TrainEntity(
                    trainId, "99999", "Test Superfast", "தேர்வு ரயில்",
                    "STN1", "STN2", "10:00", "14:00", "4h 00m", 300
            );
            trainRepository.save(train);
        }
    }

    private List<PassengerEntity> createPassengers(int count) {
        List<PassengerEntity> list = new ArrayList<>();
        for (int i = 1; i <= count; i++) {
            PassengerEntity p = new PassengerEntity();
            p.setName("Passenger " + i);
            p.setAge(30);
            p.setGender("Male");
            p.setBerthPreference("LOWER");
            list.add(p);
        }
        return list;
    }

    @Test
    void testCapacityEnforcement100SeatsAndWaitingList() {
        LocalDate date = testDate.plusDays(10);
        // Book 99 seats
        ReservationEntity r1 = reservationService.bookTicket(
                trainId, travelClass, date, BookingMode.NORMAL,
                createPassengers(99), BigDecimal.valueOf(9900), "PAY-TEST-1"
        );
        assertEquals(ReservationStatus.CONFIRMED, r1.getStatus());

        // Book 1 seat (reaching exactly 100 capacity)
        ReservationEntity r2 = reservationService.bookTicket(
                trainId, travelClass, date, BookingMode.NORMAL,
                createPassengers(1), BigDecimal.valueOf(100), "PAY-TEST-2"
        );
        assertEquals(ReservationStatus.CONFIRMED, r2.getStatus());

        // Book 101st seat -> Must enter WAITING_LIST
        ReservationEntity r3 = reservationService.bookTicket(
                trainId, travelClass, date, BookingMode.NORMAL,
                createPassengers(1), BigDecimal.valueOf(100), "PAY-TEST-3"
        );
        assertEquals(ReservationStatus.WAITING_LIST, r3.getStatus());
        assertEquals(1, r3.getWaitingListNumber());
    }

    @Test
    void testPriorityPromotionEmergencyAboveConnectingAndNormal() {
        LocalDate date = testDate.plusDays(20);
        // Fill 100 seats
        ReservationEntity confirmedRes = reservationService.bookTicket(
                trainId, travelClass, date, BookingMode.NORMAL,
                createPassengers(100), BigDecimal.valueOf(10000), "PAY-FULL"
        );
        assertEquals(ReservationStatus.CONFIRMED, confirmedRes.getStatus());

        // Passenger A: Normal mode (Priority 3, booked first)
        ReservationEntity wlNormal = reservationService.bookTicket(
                trainId, travelClass, date, BookingMode.NORMAL,
                createPassengers(1), BigDecimal.valueOf(100), "PAY-WL-NORM"
        );
        assertEquals(ReservationStatus.WAITING_LIST, wlNormal.getStatus());

        // Passenger B: Connecting mode (Priority 2, booked second)
        ReservationEntity wlConnecting = reservationService.bookTicket(
                trainId, travelClass, date, BookingMode.CONNECTING,
                createPassengers(1), BigDecimal.valueOf(100), "PAY-WL-CONN"
        );
        assertEquals(ReservationStatus.WAITING_LIST, wlConnecting.getStatus());

        // Passenger C: Emergency mode (Priority 1, booked third)
        ReservationEntity wlEmergency = reservationService.bookTicket(
                trainId, travelClass, date, BookingMode.EMERGENCY,
                createPassengers(1), BigDecimal.valueOf(100), "PAY-WL-EMERG"
        );
        assertEquals(ReservationStatus.WAITING_LIST, wlEmergency.getStatus());

        // Cancel the confirmed booking -> Released seat must be given to Emergency passenger (Priority 1)!
        Map<String, Object> cancelResult = reservationService.cancelTicket(confirmedRes.getPnr());
        assertEquals("SUCCESS", cancelResult.get("status"));
        assertEquals(wlEmergency.getPnr(), cancelResult.get("promotedReservation"));

        // Verify Emergency booking is now CONFIRMED
        ReservationEntity updatedEmergency = reservationService.getReservationByPnr(wlEmergency.getPnr()).orElseThrow();
        assertEquals(ReservationStatus.CONFIRMED, updatedEmergency.getStatus());
        assertNotNull(updatedEmergency.getPassengers().get(0).getSeatAssigned());
    }

    @Test
    void testConfirmedPassengersNeverDisplaced() {
        LocalDate date = testDate.plusDays(30);
        // Confirm booking
        ReservationEntity r1 = reservationService.bookTicket(
                trainId, travelClass, date, BookingMode.NORMAL,
                createPassengers(10), BigDecimal.valueOf(1000), "PAY-1"
        );
        assertEquals(ReservationStatus.CONFIRMED, r1.getStatus());

        // New Emergency booking arrives
        ReservationEntity r2 = reservationService.bookTicket(
                trainId, travelClass, date, BookingMode.EMERGENCY,
                createPassengers(5), BigDecimal.valueOf(500), "PAY-2"
        );
        assertEquals(ReservationStatus.CONFIRMED, r2.getStatus());

        // Confirmed passenger R1 still has their seat and remains CONFIRMED
        ReservationEntity checkR1 = reservationService.getReservationByPnr(r1.getPnr()).orElseThrow();
        assertEquals(ReservationStatus.CONFIRMED, checkR1.getStatus());
        assertNotNull(checkR1.getPassengers().get(0).getSeatAssigned());
    }

    @Test
    void testConnectingJourneyValid() {
        // Ensure STN3 exists
        if (!stationRepository.existsById("STN3")) {
            stationRepository.save(new StationEntity("STN3", "Station 3", "நிலையம் 3", "TN", "Junction", 4));
        }

        // Leg 1: STN1 -> STN2, arr: 12:00
        String leg1Id = "LEG-1-TRAIN";
        if (!trainRepository.existsById(leg1Id)) {
            trainRepository.save(new TrainEntity(leg1Id, "11111", "Leg 1 Exp", "பகுதி 1", "STN1", "STN2", "08:00", "12:00", "4h", 250));
        }

        // Leg 2: STN2 -> STN3, dep: 13:00 (60 mins transfer > 30 mins)
        String leg2Id = "LEG-2-TRAIN";
        if (!trainRepository.existsById(leg2Id)) {
            trainRepository.save(new TrainEntity(leg2Id, "22222", "Leg 2 Exp", "பகுதி 2", "STN2", "STN3", "13:00", "17:00", "4h", 250));
        }

        ConnectingBookingRequestDto req = new ConnectingBookingRequestDto();
        req.setLeg1TrainId(leg1Id);
        req.setLeg2TrainId(leg2Id);
        req.setJunctionCode("STN2");
        req.setTravelClass(travelClass);
        req.setTravelDate(testDate);
        req.setTotalFare(BigDecimal.valueOf(1500));
        req.setPaymentId("PAY-CONN-1");

        BookingRequestDto.PassengerDto p = new BookingRequestDto.PassengerDto();
        p.setName("Connecting Passenger");
        p.setAge(29);
        p.setGender("Male");
        p.setBerthPreference("LOWER");
        req.setPassengers(List.of(p));

        Map<String, Object> result = reservationService.bookConnectingJourney(req, 1L);
        assertNotNull(result.get("journeyPnr"));
        assertEquals(ReservationStatus.CONFIRMED, result.get("leg1Status"));
        assertEquals(ReservationStatus.CONFIRMED, result.get("leg2Status"));
        assertEquals(60, result.get("layoverMinutes"));
    }

    @Test
    void testConnectingJourneyImpossibleTransferRejected() {
        if (!stationRepository.existsById("STN3")) {
            stationRepository.save(new StationEntity("STN3", "Station 3", "நிலையம் 3", "TN", "Junction", 4));
        }

        String leg1Id = "LEG-FAST-1";
        if (!trainRepository.existsById(leg1Id)) {
            trainRepository.save(new TrainEntity(leg1Id, "33333", "Fast 1", "விரைவு 1", "STN1", "STN2", "08:00", "12:00", "4h", 250));
        }

        // Leg 2 departs at 12:15 -> only 15 mins layover (< 30 mins required buffer)
        String leg2Id = "LEG-FAST-2";
        if (!trainRepository.existsById(leg2Id)) {
            trainRepository.save(new TrainEntity(leg2Id, "44444", "Fast 2", "விரைவு 2", "STN2", "STN3", "12:15", "16:00", "3h 45m", 250));
        }

        ConnectingBookingRequestDto req = new ConnectingBookingRequestDto();
        req.setLeg1TrainId(leg1Id);
        req.setLeg2TrainId(leg2Id);
        req.setJunctionCode("STN2");
        req.setTravelClass(travelClass);
        req.setTravelDate(testDate);
        req.setTotalFare(BigDecimal.valueOf(1500));
        req.setPaymentId("PAY-CONN-2");

        BookingRequestDto.PassengerDto p = new BookingRequestDto.PassengerDto();
        p.setName("Transfer Passenger");
        p.setAge(35);
        p.setGender("Female");
        p.setBerthPreference("LOWER");
        req.setPassengers(List.of(p));

        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            reservationService.bookConnectingJourney(req, 1L);
        });
        assertTrue(exception.getMessage().contains("at least 30 minutes"));
    }

    @Test
    void testConnectingJourneyDisconnectedJunctionRejected() {
        String leg1Id = "LEG-MIS-1";
        if (!trainRepository.existsById(leg1Id)) {
            trainRepository.save(new TrainEntity(leg1Id, "55555", "Mis 1", "தவறு 1", "STN1", "STN2", "08:00", "12:00", "4h", 250));
        }

        // Leg 2 starts at STN1 instead of STN2 (broken junction continuity)
        String leg2Id = "LEG-MIS-2";
        if (!trainRepository.existsById(leg2Id)) {
            trainRepository.save(new TrainEntity(leg2Id, "66666", "Mis 2", "தவறு 2", "STN1", "STN2", "13:00", "17:00", "4h", 250));
        }

        ConnectingBookingRequestDto req = new ConnectingBookingRequestDto();
        req.setLeg1TrainId(leg1Id);
        req.setLeg2TrainId(leg2Id);
        req.setTravelClass(travelClass);
        req.setTravelDate(testDate);
        req.setTotalFare(BigDecimal.valueOf(1500));
        req.setPaymentId("PAY-CONN-3");

        BookingRequestDto.PassengerDto p = new BookingRequestDto.PassengerDto();
        p.setName("Passenger");
        p.setAge(40);
        p.setGender("Male");
        p.setBerthPreference("LOWER");
        req.setPassengers(List.of(p));

        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            reservationService.bookConnectingJourney(req, 1L);
        });
        assertTrue(exception.getMessage().contains("does not match Leg 2 origin"));
    }

    @Test
    void testConcurrentBookingPreventsOverselling() throws InterruptedException {
        String concTrainId = "CONC-TRAIN";
        LocalDate concDate = testDate.plusDays(99);
        if (!trainRepository.existsById(concTrainId)) {
            trainRepository.save(new TrainEntity(concTrainId, "77777", "Concurrency Exp", "வேக ரயில்", "STN1", "STN2", "06:00", "10:00", "4h", 300));
        }

        // Fill 90 seats first, leaving exactly 10 seats to reach the 100 capacity
        ReservationEntity base = reservationService.bookTicket(
                concTrainId, travelClass, concDate, BookingMode.NORMAL,
                createPassengers(90), BigDecimal.valueOf(9000), "PAY-BASE"
        );
        assertEquals(ReservationStatus.CONFIRMED, base.getStatus());

        int numberOfThreads = 10;
        ExecutorService executor = Executors.newFixedThreadPool(numberOfThreads);
        CountDownLatch latch = new CountDownLatch(numberOfThreads);
        AtomicInteger confirmedCount = new AtomicInteger(0);
        AtomicInteger waitlistedCount = new AtomicInteger(0);

        // 10 concurrent threads each try to book 2 seats (20 seats requested, but only 10 available)
        for (int i = 0; i < numberOfThreads; i++) {
            final int idx = i;
            executor.submit(() -> {
                try {
                    ReservationEntity res = reservationService.bookTicket(
                            concTrainId, travelClass, concDate, BookingMode.NORMAL,
                            createPassengers(2), BigDecimal.valueOf(200), "PAY-CONC-" + idx
                    );
                    if (res.getStatus() == ReservationStatus.CONFIRMED) {
                        confirmedCount.addAndGet(2);
                    } else if (res.getStatus() == ReservationStatus.WAITING_LIST) {
                        waitlistedCount.addAndGet(2);
                    }
                } catch (Throwable t) {
                    t.printStackTrace();
                } finally {
                    latch.countDown();
                }
            });
        }

        latch.await(10, TimeUnit.SECONDS);
        executor.shutdown();

        // Exactly 10 seats could be confirmed (reaching exactly 100 total capacity), and 10 seats were waitlisted
        assertEquals(10, confirmedCount.get(), "Exactly 10 seats must be confirmed to reach 100 capacity");
        assertEquals(10, waitlistedCount.get(), "The remaining 10 requested seats must be waitlisted");
    }

    @Test
    void testUserBookingIsolation() {
        Long userA = 101L;
        Long userB = 202L;
        LocalDate date = testDate.plusDays(40);

        ReservationEntity resA = reservationService.bookTicketWithUser(
                trainId, travelClass, date, BookingMode.NORMAL,
                createPassengers(1), BigDecimal.valueOf(100), "PAY-USER-A", userA
        );

        ReservationEntity resB = reservationService.bookTicketWithUser(
                trainId, travelClass, date, BookingMode.NORMAL,
                createPassengers(1), BigDecimal.valueOf(100), "PAY-USER-B", userB
        );

        List<ReservationEntity> bookingsA = reservationService.getUserReservations(userA);
        List<ReservationEntity> bookingsB = reservationService.getUserReservations(userB);
        List<ReservationEntity> unauth = reservationService.getUserReservations(null);

        assertTrue(bookingsA.stream().anyMatch(r -> r.getPnr().equals(resA.getPnr())));
        assertFalse(bookingsA.stream().anyMatch(r -> r.getPnr().equals(resB.getPnr())));

        assertTrue(bookingsB.stream().anyMatch(r -> r.getPnr().equals(resB.getPnr())));
        assertFalse(bookingsB.stream().anyMatch(r -> r.getPnr().equals(resA.getPnr())));

        assertTrue(unauth.isEmpty(), "Unauthenticated user must receive empty list and not see other users' bookings");
    }
}
