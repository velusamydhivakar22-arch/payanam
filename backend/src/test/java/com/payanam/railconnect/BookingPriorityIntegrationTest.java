package com.payanam.railconnect;

import com.payanam.railconnect.dto.BookingRequestDto;
import com.payanam.railconnect.dto.ConnectingBookingRequestDto;
import com.payanam.railconnect.entity.PassengerEntity;
import com.payanam.railconnect.entity.ReservationEntity;
import com.payanam.railconnect.entity.StationEntity;
import com.payanam.railconnect.entity.TrainClassEntity;
import com.payanam.railconnect.entity.TrainEntity;
import com.payanam.railconnect.model.BookingMode;
import com.payanam.railconnect.model.ReservationStatus;
import com.payanam.railconnect.repository.ReservationRepository;
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
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
public class BookingPriorityIntegrationTest {

    @Autowired
    private ReservationService reservationService;

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private TrainRepository trainRepository;

    @Autowired
    private StationRepository stationRepository;

    private final String train1Id = "PRIO-T1";
    private final String train2Id = "PRIO-T2";
    private final LocalDate testDate = LocalDate.now().plusDays(5);
    private final String travelClass = "2A";

    @BeforeEach
    void setUp() {
        if (!stationRepository.existsById("MAS")) {
            stationRepository.save(new StationEntity("MAS", "Chennai Central", "சென்னை சென்ட்ரல்", "TN", "Terminal", 12));
        }
        if (!stationRepository.existsById("TPJ")) {
            stationRepository.save(new StationEntity("TPJ", "Tiruchchirappalli", "திருச்சிராப்பள்ளி", "TN", "Junction", 8));
        }
        if (!stationRepository.existsById("MDU")) {
            stationRepository.save(new StationEntity("MDU", "Madurai Junction", "மதுரை சந்திப்பு", "TN", "Junction", 8));
        }

        if (!trainRepository.existsById(train1Id)) {
            TrainEntity t1 = new TrainEntity(train1Id, "99001", "Leg 1 Superfast", "லெக் 1", "MAS", "TPJ", "06:00", "11:30", "5h 30m", 300);
            TrainClassEntity c1 = new TrainClassEntity();
            c1.setClassType("2A");
            c1.setClassName("AC 2 Tier");
            c1.setClassNameTamil("2-ஆம் வகுப்பு ஏசி");
            c1.setFare(BigDecimal.valueOf(700));
            c1.setTotalSeats(100);
            c1.setAvailableSeats(100);
            c1.setTrain(t1);
            t1.getClasses().add(c1);
            trainRepository.save(t1);
        }

        if (!trainRepository.existsById(train2Id)) {
            TrainEntity t2 = new TrainEntity(train2Id, "99002", "Leg 2 Intercity", "லெக் 2", "TPJ", "MDU", "13:00", "15:30", "2h 30m", 300);
            TrainClassEntity c2 = new TrainClassEntity();
            c2.setClassType("2A");
            c2.setClassName("AC 2 Tier");
            c2.setClassNameTamil("2-ஆம் வகுப்பு ஏசி");
            c2.setFare(BigDecimal.valueOf(400));
            c2.setTotalSeats(100);
            c2.setAvailableSeats(100);
            c2.setTrain(t2);
            t2.getClasses().add(c2);
            trainRepository.save(t2);
        }
    }

    private List<PassengerEntity> createPassengers(int count) {
        List<PassengerEntity> list = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            PassengerEntity p = new PassengerEntity();
            p.setName("Passenger " + UUID.randomUUID().toString().substring(0, 5));
            p.setAge(30);
            p.setGender("Male");
            p.setBerthPreference("LOWER");
            list.add(p);
        }
        return list;
    }

    @Test
    @Transactional
    public void testDirectBooking_EmergencyPriority1() {
        ReservationEntity res = reservationService.bookTicket(
                train1Id, travelClass, testDate, BookingMode.EMERGENCY,
                createPassengers(1), BigDecimal.valueOf(700), "PAY-EMG"
        );

        assertNotNull(res.getPnr());
        assertEquals(BookingMode.EMERGENCY, res.getBookingMode(), "Direct booking mode must be EMERGENCY");
        assertEquals(1, res.getBookingMode().getPriorityRank(), "EMERGENCY rank must be 1");

        // Verify database persistence
        ReservationEntity dbRes = reservationRepository.findByPnr(res.getPnr()).orElseThrow();
        assertEquals(BookingMode.EMERGENCY, dbRes.getBookingMode(), "Database must store EMERGENCY");
    }

    @Test
    @Transactional
    public void testDirectBooking_ConnectingPriority2() {
        ReservationEntity res = reservationService.bookTicket(
                train1Id, travelClass, testDate, BookingMode.CONNECTING,
                createPassengers(1), BigDecimal.valueOf(700), "PAY-CONN"
        );

        assertNotNull(res.getPnr());
        assertEquals(BookingMode.CONNECTING, res.getBookingMode(), "Direct booking mode must be CONNECTING");
        assertEquals(2, res.getBookingMode().getPriorityRank(), "CONNECTING rank must be 2");

        // Verify database persistence
        ReservationEntity dbRes = reservationRepository.findByPnr(res.getPnr()).orElseThrow();
        assertEquals(BookingMode.CONNECTING, dbRes.getBookingMode(), "Database must store CONNECTING");
    }

    @Test
    @Transactional
    public void testDirectBooking_NormalPriority3() {
        ReservationEntity res = reservationService.bookTicket(
                train1Id, travelClass, testDate, BookingMode.NORMAL,
                createPassengers(1), BigDecimal.valueOf(700), "PAY-NORM"
        );

        assertNotNull(res.getPnr());
        assertEquals(BookingMode.NORMAL, res.getBookingMode(), "Direct booking mode must be NORMAL");
        assertEquals(3, res.getBookingMode().getPriorityRank(), "NORMAL rank must be 3");

        // Verify database persistence
        ReservationEntity dbRes = reservationRepository.findByPnr(res.getPnr()).orElseThrow();
        assertEquals(BookingMode.NORMAL, dbRes.getBookingMode(), "Database must store NORMAL");
    }

    @Test
    @Transactional
    public void testConnectingJourney_PreservesNormalPriority_DoesNotForceConnectingPriority() {
        ConnectingBookingRequestDto dto = new ConnectingBookingRequestDto();
        dto.setLeg1TrainId(train1Id);
        dto.setLeg2TrainId(train2Id);
        dto.setJunctionCode("TPJ");
        dto.setTravelClass(travelClass);
        dto.setTravelDate(testDate);
        dto.setBookingMode(BookingMode.NORMAL); // Explicitly Normal Priority 3
        dto.setTotalFare(BigDecimal.valueOf(1100));
        dto.setPaymentId("PAY-CONN-NORM");

        List<BookingRequestDto.PassengerDto> passengers = new ArrayList<>();
        BookingRequestDto.PassengerDto p = new BookingRequestDto.PassengerDto();
        p.setName("Ramesh Normal");
        p.setAge(32);
        p.setGender("Male");
        p.setBerthPreference("LOWER");
        passengers.add(p);
        dto.setPassengers(passengers);

        Map<String, Object> result = reservationService.bookConnectingJourney(dto, null);
        assertNotNull(result);
        assertEquals("CONFIRMED", result.get("status"));

        String pnr1 = (String) result.get("leg1Pnr");
        String pnr2 = (String) result.get("leg2Pnr");

        ReservationEntity db1 = reservationRepository.findByPnr(pnr1).orElseThrow();
        ReservationEntity db2 = reservationRepository.findByPnr(pnr2).orElseThrow();

        // Core business rule requirement: A connecting journey booked with Normal mode MUST remain NORMAL
        assertEquals(BookingMode.NORMAL, db1.getBookingMode(), "Leg 1 must have NORMAL booking mode");
        assertEquals(BookingMode.NORMAL, db2.getBookingMode(), "Leg 2 must have NORMAL booking mode");
        assertTrue(db1.getIsConnectingItinerary(), "Leg 1 must be marked as connecting journey");
        assertTrue(db2.getIsConnectingItinerary(), "Leg 2 must be marked as connecting journey");
    }

    @Test
    @Transactional
    public void testConnectingJourney_PreservesEmergencyPriority() {
        ConnectingBookingRequestDto dto = new ConnectingBookingRequestDto();
        dto.setLeg1TrainId(train1Id);
        dto.setLeg2TrainId(train2Id);
        dto.setJunctionCode("TPJ");
        dto.setTravelClass(travelClass);
        dto.setTravelDate(testDate);
        dto.setBookingMode(BookingMode.EMERGENCY); // Explicitly Emergency Priority 1
        dto.setTotalFare(BigDecimal.valueOf(1100));
        dto.setPaymentId("PAY-CONN-EMG");

        List<BookingRequestDto.PassengerDto> passengers = new ArrayList<>();
        BookingRequestDto.PassengerDto p = new BookingRequestDto.PassengerDto();
        p.setName("Suresh Emergency");
        p.setAge(45);
        p.setGender("Male");
        p.setBerthPreference("LOWER");
        p.setEmergencyReason("Medical Emergency");
        p.setEmergencyId("HOSP-9901");
        passengers.add(p);
        dto.setPassengers(passengers);

        Map<String, Object> result = reservationService.bookConnectingJourney(dto, null);
        assertNotNull(result);

        String pnr1 = (String) result.get("leg1Pnr");
        String pnr2 = (String) result.get("leg2Pnr");

        ReservationEntity db1 = reservationRepository.findByPnr(pnr1).orElseThrow();
        ReservationEntity db2 = reservationRepository.findByPnr(pnr2).orElseThrow();

        assertEquals(BookingMode.EMERGENCY, db1.getBookingMode(), "Leg 1 must have EMERGENCY booking mode");
        assertEquals(BookingMode.EMERGENCY, db2.getBookingMode(), "Leg 2 must have EMERGENCY booking mode");
    }

    @Test
    @Transactional
    public void testSwitchingModes_IndependentSearchAndBooking() {
        // Mode 1: Emergency
        ReservationEntity emg = reservationService.bookTicket(
                train1Id, travelClass, testDate, BookingMode.EMERGENCY,
                createPassengers(1), BigDecimal.valueOf(700), "PAY-SWITCH-1"
        );
        assertEquals(BookingMode.EMERGENCY, emg.getBookingMode());

        // Mode 2: Normal
        ReservationEntity norm = reservationService.bookTicket(
                train1Id, travelClass, testDate, BookingMode.NORMAL,
                createPassengers(1), BigDecimal.valueOf(700), "PAY-SWITCH-2"
        );
        assertEquals(BookingMode.NORMAL, norm.getBookingMode());

        // Mode 3: Connecting Priority
        ReservationEntity conn = reservationService.bookTicket(
                train1Id, travelClass, testDate, BookingMode.CONNECTING,
                createPassengers(1), BigDecimal.valueOf(700), "PAY-SWITCH-3"
        );
        assertEquals(BookingMode.CONNECTING, conn.getBookingMode());

        // All 3 coexist without polluting each other
        ReservationEntity r1 = reservationRepository.findByPnr(emg.getPnr()).orElseThrow();
        ReservationEntity r2 = reservationRepository.findByPnr(norm.getPnr()).orElseThrow();
        ReservationEntity r3 = reservationRepository.findByPnr(conn.getPnr()).orElseThrow();

        assertEquals(BookingMode.EMERGENCY, r1.getBookingMode());
        assertEquals(BookingMode.NORMAL, r2.getBookingMode());
        assertEquals(BookingMode.CONNECTING, r3.getBookingMode());
    }
}
