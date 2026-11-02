package com.payanam.railconnect;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class PayanamJunctionApplication {

    public static void main(String[] args) {
        SpringApplication.run(PayanamJunctionApplication.class, args);
        System.out.println("==================================================");
        System.out.println(" PAYANAM JUNCTION — RAILCONNECT BACKEND ACTIVE");
        System.out.println(" Port: 8080 | MySQL & Priority Quota Services Ready");
        System.out.println("==================================================");
    }
}
