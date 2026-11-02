package com.payanam.railconnect;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
class PayanamJunctionApplicationTests {

    @Test
    void contextLoads() {
        // Verifies Spring context initializes cleanly with test profile
    }
}
