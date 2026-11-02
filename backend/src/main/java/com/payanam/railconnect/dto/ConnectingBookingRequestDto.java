package com.payanam.railconnect.dto;

import com.payanam.railconnect.model.BookingMode;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class ConnectingBookingRequestDto {

    private String leg1TrainId;
    private String leg2TrainId;
    private String junctionCode;
    private String travelClass;
    private LocalDate travelDate;
    private BookingMode bookingMode = BookingMode.NORMAL;
    private List<BookingRequestDto.PassengerDto> passengers;
    private BigDecimal totalFare;
    private String paymentId;

    public String getLeg1TrainId() { return leg1TrainId; }
    public void setLeg1TrainId(String leg1TrainId) { this.leg1TrainId = leg1TrainId; }

    public String getLeg2TrainId() { return leg2TrainId; }
    public void setLeg2TrainId(String leg2TrainId) { this.leg2TrainId = leg2TrainId; }

    public String getJunctionCode() { return junctionCode; }
    public void setJunctionCode(String junctionCode) { this.junctionCode = junctionCode; }

    public String getTravelClass() { return travelClass; }
    public void setTravelClass(String travelClass) { this.travelClass = travelClass; }

    public LocalDate getTravelDate() { return travelDate; }
    public void setTravelDate(LocalDate travelDate) { this.travelDate = travelDate; }

    public BookingMode getBookingMode() { return bookingMode; }
    public void setBookingMode(BookingMode bookingMode) { this.bookingMode = bookingMode; }

    public List<BookingRequestDto.PassengerDto> getPassengers() { return passengers; }
    public void setPassengers(List<BookingRequestDto.PassengerDto> passengers) { this.passengers = passengers; }

    public BigDecimal getTotalFare() { return totalFare; }
    public void setTotalFare(BigDecimal totalFare) { this.totalFare = totalFare; }

    public String getPaymentId() { return paymentId; }
    public void setPaymentId(String paymentId) { this.paymentId = paymentId; }
}
