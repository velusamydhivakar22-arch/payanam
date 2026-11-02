package com.payanam.railconnect;

import com.payanam.railconnect.security.JwtUtil;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class SecurityIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtUtil jwtUtil;

    @Test
    void testPublicEndpointsAccessibleWithoutAuth() throws Exception {
        mockMvc.perform(get("/api/v1/stations"))
                .andExpect(status().isOk());
    }

    @Test
    void testAdminEndpointsRejectUnauthorizedUser() throws Exception {
        // Without token -> 403 Forbidden
        mockMvc.perform(get("/api/v1/admin/platforms"))
                .andExpect(status().isForbidden());
    }

    @Test
    void testAdminEndpointsRejectStandardUserRole() throws Exception {
        // With standard USER role token -> 403 Forbidden
        String userToken = jwtUtil.generateToken("regular.user@railconnect.in", "USER", 999L);
        mockMvc.perform(get("/api/v1/admin/platforms")
                        .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isForbidden());
    }

    @Test
    void testAdminEndpointsAllowAdminRole() throws Exception {
        // With ADMIN role token -> 200 OK
        String adminToken = jwtUtil.generateToken("admin@railconnect.in", "ADMIN", 1L);
        mockMvc.perform(get("/api/v1/admin/platforms")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk());
    }
}
