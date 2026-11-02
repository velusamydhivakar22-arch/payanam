package com.payanam.railconnect.repository;

import com.payanam.railconnect.entity.PlatformEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlatformRepository extends JpaRepository<PlatformEntity, Integer> {
    List<PlatformEntity> findByOccupiedFalse();
}
