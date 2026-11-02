package com.payanam.railconnect.dto;

import com.payanam.railconnect.model.BookingMode;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class BookingRequestDto {
    private String trainId;
    private String travelClass;
    private LocalDate travelDate;
    private BookingMode bookingMode;
    private BigDecimal totalFare;
    private String paymentId;
    private List<PassengerDto> passengers;

    public static class PassengerDto {
        private String name;
        private int age;
        private String gender;
        private String berthPreference;
        private String emergencyReason;
        private String emergencyId;
        private String connectingPnr;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public int getAge() { return age; }
        public void setAge(int age) { this.age = age; }

        public String getGender() { return gender; }
        public void setGender(String gender) { this.gender = gender; }

        public String getBerthPreference() { return berthPreference; }
        public void setBerthPreference(String berthPreference) { this.berthPreference = berthPreference; }

        public String getEmergencyReason() { return emergencyReason; }
        public void setEmergencyReason(String emergencyReason) { this.emergencyReason = emergencyReason; }

        public String getEmergencyId() { return emergencyId; }
        public void setEmergencyId(String emergencyId) { this.emergencyId = emergencyId; }

        public String getConnectingPnr() { return connectingPnr; }
        public void setConnectingPnr(String connectingPnr) { this.connectingPnr = connectingPnr; }
    }

    public String getTrainId() { return trainId; }
    public void setTrainId(String trainId) { this.trainId = trainId; }

    public String getTravelClass() { return travelClass; }
    public void setTravelClass(String travelClass) { this.travelClass = travelClass; }

    public LocalDate getTravelDate() { return travelDate; }
    public void setTravelDate(LocalDate travelDate) { this.travelDate = travelDate; }

    public BookingMode getBookingMode() { return bookingMode; }
    public void setBookingMode(BookingMode bookingMode) { this.bookingMode = bookingMode; }

    public BigDecimal getTotalFare() { return totalFare; }
    public void setTotalFare(BigDecimal totalFare) { this.totalFare = totalFare; }

    public String getPaymentId() { return paymentId; }
    public void setPaymentId(String paymentId) { this.paymentId = paymentId; }

    public List<PassengerDto> getPassengers() { return passengers; }
    public void setPassengers(List<PassengerDto> passengers) { this.passengers = passengers; }
}
