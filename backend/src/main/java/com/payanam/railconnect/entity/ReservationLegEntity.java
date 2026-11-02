package com.payanam.railconnect.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "reservation_legs")
public class ReservationLegEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "journey_pnr", nullable = false, length = 25)
    private String journeyPnr;

    @Column(name = "leg_order", nullable = false)
    private int legOrder;

    @Column(name = "train_id", nullable = false, length = 20)
    private String trainId;

    @Column(name = "travel_class", nullable = false, length = 10)
    private String travelClass;

    @Column(name = "source_code", nullable = false, length = 10)
    private String sourceCode;

    @Column(name = "destination_code", nullable = false, length = 10)
    private String destinationCode;

    @Column(name = "departure_time", nullable = false, length = 10)
    private String departureTime;

    @Column(name = "arrival_time", nullable = false, length = 10)
    private String arrivalTime;

    @Column(nullable = false, length = 20)
    private String status = "CONFIRMED";

    public ReservationLegEntity() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getJourneyPnr() { return journeyPnr; }
    public void setJourneyPnr(String journeyPnr) { this.journeyPnr = journeyPnr; }

    public int getLegOrder() { return legOrder; }
    public void setLegOrder(int legOrder) { this.legOrder = legOrder; }

    public String getTrainId() { return trainId; }
    public void setTrainId(String trainId) { this.trainId = trainId; }

    public String getTravelClass() { return travelClass; }
    public void setTravelClass(String travelClass) { this.travelClass = travelClass; }

    public String getSourceCode() { return sourceCode; }
    public void setSourceCode(String sourceCode) { this.sourceCode = sourceCode; }

    public String getDestinationCode() { return destinationCode; }
    public void setDestinationCode(String destinationCode) { this.destinationCode = destinationCode; }

    public String getDepartureTime() { return departureTime; }
    public void setDepartureTime(String departureTime) { this.departureTime = departureTime; }

    public String getArrivalTime() { return arrivalTime; }
    public void setArrivalTime(String arrivalTime) { this.arrivalTime = arrivalTime; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
