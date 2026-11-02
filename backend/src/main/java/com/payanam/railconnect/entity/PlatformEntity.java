package com.payanam.railconnect.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "platforms")
public class PlatformEntity {

    @Id
    @Column(name = "platform_id")
    private int platformId;

    @Column(name = "length_meters", nullable = false)
    private int lengthMeters;

    @Column(nullable = false)
    private boolean occupied = false;

    @Column(name = "current_train_id", length = 20)
    private String currentTrainId;

    @Column(name = "current_train_name", length = 100)
    private String currentTrainName;

    @Column(name = "arrival_time", length = 10)
    private String arrivalTime;

    @Column(name = "release_time", length = 10)
    private String releaseTime;

    public PlatformEntity() {}

    public PlatformEntity(int platformId, int lengthMeters) {
        this.platformId = platformId;
        this.lengthMeters = lengthMeters;
        this.occupied = false;
    }

    public PlatformEntity(int platformId, int lengthMeters, boolean occupied) {
        this.platformId = platformId;
        this.lengthMeters = lengthMeters;
        this.occupied = occupied;
    }

    public int getPlatformId() { return platformId; }
    public void setPlatformId(int platformId) { this.platformId = platformId; }

    public int getLengthMeters() { return lengthMeters; }
    public void setLengthMeters(int lengthMeters) { this.lengthMeters = lengthMeters; }

    public boolean isOccupied() { return occupied; }
    public void setOccupied(boolean occupied) { this.occupied = occupied; }

    public String getCurrentTrainId() { return currentTrainId; }
    public void setCurrentTrainId(String currentTrainId) { this.currentTrainId = currentTrainId; }

    public String getCurrentTrainName() { return currentTrainName; }
    public void setCurrentTrainName(String currentTrainName) { this.currentTrainName = currentTrainName; }

    public String getArrivalTime() { return arrivalTime; }
    public void setArrivalTime(String arrivalTime) { this.arrivalTime = arrivalTime; }

    public String getReleaseTime() { return releaseTime; }
    public void setReleaseTime(String releaseTime) { this.releaseTime = releaseTime; }
}
