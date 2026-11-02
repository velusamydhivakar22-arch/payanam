package com.payanam.railconnect.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "train_classes")
public class TrainClassEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "train_id", nullable = false)
    @JsonIgnore
    private TrainEntity train;

    @Column(name = "class_type", nullable = false, length = 10)
    private String classType;

    @Column(name = "class_name", nullable = false, length = 100)
    private String className;

    @Column(name = "class_name_tamil", nullable = false, length = 100)
    private String classNameTamil;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal fare;

    @Column(name = "total_seats")
    private int totalSeats = 100; // Strictly 100 seats per class rule

    @Column(name = "available_seats")
    private int availableSeats = 100;

    @Column(name = "waiting_list_count")
    private int waitingListCount = 0;

    public TrainClassEntity() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public TrainEntity getTrain() { return train; }
    public void setTrain(TrainEntity train) { this.train = train; }

    public String getClassType() { return classType; }
    public void setClassType(String classType) { this.classType = classType; }

    public String getClassName() { return className; }
    public void setClassName(String className) { this.className = className; }

    public String getClassNameTamil() { return classNameTamil; }
    public void setClassNameTamil(String classNameTamil) { this.classNameTamil = classNameTamil; }

    public BigDecimal getFare() { return fare; }
    public void setFare(BigDecimal fare) { this.fare = fare; }

    public int getTotalSeats() { return totalSeats; }
    public void setTotalSeats(int totalSeats) { this.totalSeats = totalSeats; }

    public int getAvailableSeats() { return availableSeats; }
    public void setAvailableSeats(int availableSeats) { this.availableSeats = availableSeats; }

    public int getWaitingListCount() { return waitingListCount; }
    public void setWaitingListCount(int waitingListCount) { this.waitingListCount = waitingListCount; }
}
