package com.payanam.railconnect.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "trains")
public class TrainEntity {

    @Id
    @Column(length = 20)
    private String id;

    @Column(nullable = false, length = 10)
    private String number;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "name_tamil", nullable = false, length = 100)
    private String nameTamil;

    @Column(name = "source_code", nullable = false, length = 10)
    private String sourceCode;

    @Column(name = "destination_code", nullable = false, length = 10)
    private String destinationCode;

    @Column(name = "departure_time", nullable = false, length = 10)
    private String departureTime;

    @Column(name = "arrival_time", nullable = false, length = 10)
    private String arrivalTime;

    @Column(nullable = false, length = 20)
    private String duration;

    @Column(name = "train_length_meters")
    private int trainLengthMeters = 300;

    @OneToMany(mappedBy = "train", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<TrainClassEntity> classes = new ArrayList<>();

    public TrainEntity() {}

    public TrainEntity(String id, String number, String name, String nameTamil, String sourceCode, String destinationCode, String departureTime, String arrivalTime, String duration, int trainLengthMeters) {
        this.id = id;
        this.number = number;
        this.name = name;
        this.nameTamil = nameTamil;
        this.sourceCode = sourceCode;
        this.destinationCode = destinationCode;
        this.departureTime = departureTime;
        this.arrivalTime = arrivalTime;
        this.duration = duration;
        this.trainLengthMeters = trainLengthMeters;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getNumber() { return number; }
    public void setNumber(String number) { this.number = number; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getNameTamil() { return nameTamil; }
    public void setNameTamil(String nameTamil) { this.nameTamil = nameTamil; }

    public String getSourceCode() { return sourceCode; }
    public void setSourceCode(String sourceCode) { this.sourceCode = sourceCode; }

    public String getDestinationCode() { return destinationCode; }
    public void setDestinationCode(String destinationCode) { this.destinationCode = destinationCode; }

    public String getDepartureTime() { return departureTime; }
    public void setDepartureTime(String departureTime) { this.departureTime = departureTime; }

    public String getArrivalTime() { return arrivalTime; }
    public void setArrivalTime(String arrivalTime) { this.arrivalTime = arrivalTime; }

    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }

    public int getTrainLengthMeters() { return trainLengthMeters; }
    public void setTrainLengthMeters(int trainLengthMeters) { this.trainLengthMeters = trainLengthMeters; }

    public List<TrainClassEntity> getClasses() { return classes; }
    public void setClasses(List<TrainClassEntity> classes) { this.classes = classes; }
}
