package com.payanam.railconnect.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "stations")
public class StationEntity {

    @Id
    @Column(length = 10)
    private String code;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "name_tamil", nullable = false, length = 100)
    private String nameTamil;

    @Column(nullable = false, length = 50)
    private String state;

    @Column(name = "junction_type", length = 100)
    private String junctionType;

    @Column(name = "platforms_count")
    private int platformsCount;

    public StationEntity() {}

    public StationEntity(String code, String name, String nameTamil, String state, String junctionType, int platformsCount) {
        this.code = code;
        this.name = name;
        this.nameTamil = nameTamil;
        this.state = state;
        this.junctionType = junctionType;
        this.platformsCount = platformsCount;
    }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getNameTamil() { return nameTamil; }
    public void setNameTamil(String nameTamil) { this.nameTamil = nameTamil; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getJunctionType() { return junctionType; }
    public void setJunctionType(String junctionType) { this.junctionType = junctionType; }

    public int getPlatformsCount() { return platformsCount; }
    public void setPlatformsCount(int platformsCount) { this.platformsCount = platformsCount; }
}
