package com.payanam.railconnect.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "passengers")
public class PassengerEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reservation_id", nullable = false)
    @JsonIgnore
    private ReservationEntity reservation;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false)
    private int age;

    @Column(nullable = false, length = 20)
    private String gender;

    @Column(name = "berth_preference", length = 30)
    private String berthPreference;

    @Column(name = "seat_assigned", length = 30)
    private String seatAssigned;

    @Column(name = "emergency_reason", length = 150)
    private String emergencyReason;

    @Column(name = "emergency_id", length = 100)
    private String emergencyId;

    @Column(name = "connecting_pnr", length = 50)
    private String connectingPnr;

    public PassengerEntity() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ReservationEntity getReservation() { return reservation; }
    public void setReservation(ReservationEntity reservation) { this.reservation = reservation; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getBerthPreference() { return berthPreference; }
    public void setBerthPreference(String berthPreference) { this.berthPreference = berthPreference; }

    public String getSeatAssigned() { return seatAssigned; }
    public void setSeatAssigned(String seatAssigned) { this.seatAssigned = seatAssigned; }

    public String getEmergencyReason() { return emergencyReason; }
    public void setEmergencyReason(String emergencyReason) { this.emergencyReason = emergencyReason; }

    public String getEmergencyId() { return emergencyId; }
    public void setEmergencyId(String emergencyId) { this.emergencyId = emergencyId; }

    public String getConnectingPnr() { return connectingPnr; }
    public void setConnectingPnr(String connectingPnr) { this.connectingPnr = connectingPnr; }
}
