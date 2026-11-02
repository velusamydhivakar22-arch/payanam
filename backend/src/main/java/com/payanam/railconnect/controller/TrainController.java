package com.payanam.railconnect.controller;

import com.payanam.railconnect.entity.TrainEntity;
import com.payanam.railconnect.repository.TrainRepository;
import com.payanam.railconnect.service.TrainService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping({"/api/v1/trains", "/api/trains"})
public class TrainController {

    private final TrainRepository trainRepository;
    private final TrainService trainService;

    public TrainController(TrainRepository trainRepository, TrainService trainService) {
        this.trainRepository = trainRepository;
        this.trainService = trainService;
    }

    @GetMapping
    public ResponseEntity<List<TrainEntity>> getAllTrains() {
        return ResponseEntity.ok(trainRepository.findAll());
    }

    @GetMapping("/search")
    public ResponseEntity<List<TrainEntity>> searchTrains(
            @RequestParam String source,
            @RequestParam String destination,
            @RequestParam(required = false) String mode
    ) {
        List<TrainEntity> trains = trainService.searchDirectTrains(source, destination);
        return ResponseEntity.ok(trains);
    }

    @GetMapping("/connecting")
    public ResponseEntity<List<Map<String, Object>>> searchConnectingRoutes(
            @RequestParam String source,
            @RequestParam String destination,
            @RequestParam(required = false) String mode
    ) {
        List<Map<String, Object>> connecting = trainService.searchConnectingItineraries(source, destination);
        return ResponseEntity.ok(connecting);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TrainEntity> getTrainById(@PathVariable String id) {
        return trainRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
