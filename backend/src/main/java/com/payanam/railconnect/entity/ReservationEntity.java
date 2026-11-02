package com.payanam.railconnect.entity;

import com.payanam.railconnect.model.BookingMode;
import com.payanam.railconnect.model.ReservationStatus;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "reservations")
public class ReservationEntity {

    @Id
    @Column(name = "reservation_id")
    private Long reservationId;

    @Column(nullable = false, unique = true, length = 20)
    private String pnr;

    @Column(name = "train_id", nullable = false, length = 20)
    private String trainId;

    @Column(name = "source_code", nullable = false, length = 10)
    private String sourceCode;

    @Column(name = "destination_code", nullable = false, length = 10)
    private String destinationCode;

    @Column(name = "travel_date", nullable = false)
    private LocalDate travelDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "booking_mode", nullable = false, length = 20)
    private BookingMode bookingMode;

    @Column(name = "travel_class", nullable = false, length = 10)
    private String travelClass;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ReservationStatus status;

    @Column(name = "waiting_list_number")
    private Integer waitingListNumber;

    @Column(name = "total_fare", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalFare;

    @Column(name = "payment_id", length = 50)
    private String paymentId;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "is_connecting_itinerary")
    private Boolean isConnectingItinerary = false;

    @Column(name = "connecting_leg_info", length = 255)
    private String connectingLegInfo;

    @Column(name = "booking_timestamp")
    private LocalDateTime bookingTimestamp = LocalDateTime.now();

    @OneToMany(mappedBy = "reservation", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<PassengerEntity> passengers = new ArrayList<>();

    public ReservationEntity() {}

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Boolean getIsConnectingItinerary() { return isConnectingItinerary; }
    public void setIsConnectingItinerary(Boolean isConnectingItinerary) { this.isConnectingItinerary = isConnectingItinerary; }

    public String getConnectingLegInfo() { return connectingLegInfo; }
    public void setConnectingLegInfo(String connectingLegInfo) { this.connectingLegInfo = connectingLegInfo; }

    public Long getReservationId() { return reservationId; }
    public void setReservationId(Long reservationId) { this.reservationId = reservationId; }

    public String getPnr() { return pnr; }
    public void setPnr(String pnr) { this.pnr = pnr; }

    public String getTrainId() { return trainId; }
    public void setTrainId(String trainId) { this.trainId = trainId; }

    public String getSourceCode() { return sourceCode; }
    public void setSourceCode(String sourceCode) { this.sourceCode = sourceCode; }

    public String getDestinationCode() { return destinationCode; }
    public void setDestinationCode(String destinationCode) { this.destinationCode = destinationCode; }

    public LocalDate getTravelDate() { return travelDate; }
    public void setTravelDate(LocalDate travelDate) { this.travelDate = travelDate; }

    public BookingMode getBookingMode() { return bookingMode; }
    public void setBookingMode(BookingMode bookingMode) { this.bookingMode = bookingMode; }

    public String getTravelClass() { return travelClass; }
    public void setTravelClass(String travelClass) { this.travelClass = travelClass; }

    public ReservationStatus getStatus() { return status; }
    public void setStatus(ReservationStatus status) { this.status = status; }

    public Integer getWaitingListNumber() { return waitingListNumber; }
    public void setWaitingListNumber(Integer waitingListNumber) { this.waitingListNumber = waitingListNumber; }

    public BigDecimal getTotalFare() { return totalFare; }
    public void setTotalFare(BigDecimal totalFare) { this.totalFare = totalFare; }

    public String getPaymentId() { return paymentId; }
    public void setPaymentId(String paymentId) { this.paymentId = paymentId; }

    public LocalDateTime getBookingTimestamp() { return bookingTimestamp; }
    public void setBookingTimestamp(LocalDateTime bookingTimestamp) { this.bookingTimestamp = bookingTimestamp; }

    public List<PassengerEntity> getPassengers() { return passengers; }
    public void setPassengers(List<PassengerEntity> passengers) { this.passengers = passengers; }
}
