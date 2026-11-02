package com.payanam.railconnect.repository;

import com.payanam.railconnect.entity.ReservationLegEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReservationLegRepository extends JpaRepository<ReservationLegEntity, Long> {
    List<ReservationLegEntity> findByJourneyPnrOrderByLegOrderAsc(String journeyPnr);
}
