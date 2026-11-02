package com.payanam.railconnect.repository;

import com.payanam.railconnect.entity.PlatformRequestEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlatformRequestRepository extends JpaRepository<PlatformRequestEntity, String> {
    List<PlatformRequestEntity> findByStatusOrderByPriorityRankAscRequestOrderAsc(String status);
}
