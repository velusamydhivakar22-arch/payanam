package com.payanam.railconnect.repository;

import com.payanam.railconnect.entity.ReservationEntity;
import com.payanam.railconnect.model.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReservationRepository extends JpaRepository<ReservationEntity, Long> {
    Optional<ReservationEntity> findByPnr(String pnr);

    List<ReservationEntity> findByTrainIdAndTravelClassAndTravelDateAndStatus(
            String trainId, String travelClass, LocalDate travelDate, ReservationStatus status
    );

    List<ReservationEntity> findAllByOrderByBookingTimestampDesc();

    List<ReservationEntity> findByUserIdOrderByBookingTimestampDesc(Long userId);
}
