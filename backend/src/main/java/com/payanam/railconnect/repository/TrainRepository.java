package com.payanam.railconnect.repository;

import com.payanam.railconnect.entity.TrainEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrainRepository extends JpaRepository<TrainEntity, String> {
    List<TrainEntity> findBySourceCodeAndDestinationCode(String sourceCode, String destinationCode);
}
