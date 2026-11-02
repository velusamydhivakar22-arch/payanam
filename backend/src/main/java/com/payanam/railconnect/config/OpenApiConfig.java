package com.payanam.railconnect.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI payanamJunctionOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Payanam Junction — RailConnect REST API")
                        .description("Official REST API documentation for Payanam Junction: Priority Queue Booking, Platform Clearance Allocation, and Railway Reservation Services.")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Payanam Junction Engineering")
                                .email("support@railconnect.in"))
                        .license(new License().name("Apache 2.0").url("http://springdoc.org")));
    }
}
