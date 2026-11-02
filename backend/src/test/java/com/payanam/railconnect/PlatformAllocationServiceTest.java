package com.payanam.railconnect;

import com.payanam.railconnect.entity.PlatformEntity;
import com.payanam.railconnect.entity.PlatformRequestEntity;
import com.payanam.railconnect.repository.PlatformRepository;
import com.payanam.railconnect.repository.PlatformRequestRepository;
import com.payanam.railconnect.service.PlatformAllocationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class PlatformAllocationServiceTest {

    @Autowired
    private PlatformAllocationService platformService;

    @Autowired
    private PlatformRepository platformRepository;

    @Autowired
    private PlatformRequestRepository requestRepository;

    @BeforeEach
    void setUp() {
        requestRepository.deleteAll();
        platformRepository.deleteAll();

        // Platform 1: 250m, Platform 2: 300m, Platform 3: 400m
        platformRepository.save(new PlatformEntity(1, 250, false));
        platformRepository.save(new PlatformEntity(2, 300, false));
        platformRepository.save(new PlatformEntity(3, 400, false));
    }

    @Test
    void testLengthMatchingAndClearanceBuffer() {
        // Train of 280m should be allocated to Platform 2 (300m, best fit), not Platform 1 (250m)
        platformService.addRequest("T101", "Kovai Express", "NORMAL", "08:00", "08:30", 280);

        Map<String, Object> result = platformService.processNextRequest();
        assertTrue((Boolean) result.get("success"));
        assertEquals(2, result.get("allocatedPlatformId"));

        // Release time must have 5-min clearance buffer: 08:30 + 5 mins = 08:35
        assertEquals("08:35", result.get("releaseTime"));
    }

    @Test
    void testPriorityDispatchEmergencyBeforeNormal() {
        // Normal train queued first
        platformService.addRequest("T-NORM", "Normal Passenger", "NORMAL", "09:00", "09:30", 240);

        // Emergency train queued second
        platformService.addRequest("T-EMERG", "Medical Relief Train", "EMERGENCY", "09:05", "09:20", 240);

        // Process next -> Emergency train must be processed FIRST despite being queued second!
        Map<String, Object> result = platformService.processNextRequest();
        assertTrue((Boolean) result.get("success"));
        assertEquals("T-EMERG", result.get("trainId"));
    }

    @Test
    void testConflictWhenNoSuitablePlatformAvailable() {
        // Platform 1 (250m), Platform 2 (300m), Platform 3 (400m)
        // Request a massive train of 450m -> No platform can fit this!
        platformService.addRequest("T-LONG", "Super Freight", "NORMAL", "11:00", "11:30", 450);

        Map<String, Object> result = platformService.processNextRequest();
        assertFalse((Boolean) result.get("success"));
        assertTrue(((String) result.get("message")).contains("No suitable platform available"));
    }

    @Test
    void testOvernightScheduleMidnightCrossover() {
        // Train departs at 23:58, crossing midnight
        platformService.addRequest("T-NIGHT", "Overnight SF", "NORMAL", "23:20", "23:58", 240);

        Map<String, Object> result = platformService.processNextRequest();
        assertTrue((Boolean) result.get("success"));
        assertEquals(1, result.get("allocatedPlatformId")); // Platform 1 (250m) fits 240m

        // Release time = 23:58 + 5 mins = 00:03 the next morning!
        assertEquals("00:03", result.get("releaseTime"));
    }

    @Test
    void testDelayUpdatesExtendReleaseTime() {
        platformService.addRequest("T-DELAYED", "Vaigai Exp", "NORMAL", "14:00", "14:30", 280);
        Map<String, Object> alloc = platformService.processNextRequest();
        assertTrue((Boolean) alloc.get("success"));
        assertEquals("14:35", alloc.get("releaseTime")); // 14:30 + 5 min clearance

        // Add 15-minute operational delay
        boolean updated = platformService.delayTrain("T-DELAYED", 15);
        assertTrue(updated);

        // Platform release time should be extended to 14:50
        PlatformEntity platform = platformRepository.findById(2).orElseThrow();
        assertEquals("14:50", platform.getReleaseTime());
    }
}
