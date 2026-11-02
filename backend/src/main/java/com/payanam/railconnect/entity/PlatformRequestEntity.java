package com.payanam.railconnect.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "platform_requests")
public class PlatformRequestEntity {

    @Id
    @Column(length = 50)
    private String id;

    @Column(name = "train_id", nullable = false, length = 20)
    private String trainId;

    @Column(name = "train_name", nullable = false, length = 100)
    private String trainName;

    @Column(nullable = false, length = 20)
    private String type; // EMERGENCY, CONNECTION, NORMAL

    @Column(name = "arrival_time", nullable = false, length = 10)
    private String arrivalTime;

    @Column(name = "departure_time", nullable = false, length = 10)
    private String departureTime;

    @Column(name = "length_meters", nullable = false)
    private int lengthMeters;

    @Column(name = "priority_rank", nullable = false)
    private int priorityRank; // 1: Emergency, 2: Connection, 3: Normal

    @Column(name = "request_order", nullable = false)
    private int requestOrder;

    @Column(nullable = false, length = 20)
    private String status = "PENDING"; // PENDING, ALLOCATED, DELAYED

    @Column(name = "allocated_platform_id")
    private Integer allocatedPlatformId;

    public PlatformRequestEntity() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTrainId() { return trainId; }
    public void setTrainId(String trainId) { this.trainId = trainId; }

    public String getTrainName() { return trainName; }
    public void setTrainName(String trainName) { this.trainName = trainName; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getArrivalTime() { return arrivalTime; }
    public void setArrivalTime(String arrivalTime) { this.arrivalTime = arrivalTime; }

    public String getDepartureTime() { return departureTime; }
    public void setDepartureTime(String departureTime) { this.departureTime = departureTime; }

    public int getLengthMeters() { return lengthMeters; }
    public void setLengthMeters(int lengthMeters) { this.lengthMeters = lengthMeters; }

    public int getPriorityRank() { return priorityRank; }
    public void setPriorityRank(int priorityRank) { this.priorityRank = priorityRank; }

    public int getRequestOrder() { return requestOrder; }
    public void setRequestOrder(int requestOrder) { this.requestOrder = requestOrder; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getAllocatedPlatformId() { return allocatedPlatformId; }
    public void setAllocatedPlatformId(Integer allocatedPlatformId) { this.allocatedPlatformId = allocatedPlatformId; }
}
