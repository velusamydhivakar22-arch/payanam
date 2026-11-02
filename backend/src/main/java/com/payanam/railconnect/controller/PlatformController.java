package com.payanam.railconnect.controller;

import com.payanam.railconnect.entity.PlatformEntity;
import com.payanam.railconnect.entity.PlatformRequestEntity;
import com.payanam.railconnect.service.PlatformAllocationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping({"/api/v1/platforms", "/api/platforms", "/api/v1/admin/platforms"})
public class PlatformController {

    private final PlatformAllocationService allocationService;

    public PlatformController(PlatformAllocationService allocationService) {
        this.allocationService = allocationService;
    }

    @GetMapping
    public ResponseEntity<List<PlatformEntity>> getPlatforms() {
        return ResponseEntity.ok(allocationService.getAllPlatforms());
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getPlatformStatus() {
        return ResponseEntity.ok(Map.of(
                "platforms", allocationService.getAllPlatforms(),
                "requests", allocationService.getAllRequests()
        ));
    }

    @GetMapping("/requests")
    public ResponseEntity<List<PlatformRequestEntity>> getRequests() {
        return ResponseEntity.ok(allocationService.getAllRequests());
    }

    @PostMapping("/request")
    public ResponseEntity<PlatformRequestEntity> queueRequest(@RequestBody Map<String, Object> payload) {
        String trainId = (String) payload.get("trainId");
        String trainName = (String) payload.get("trainName");
        String type = (String) payload.get("type");
        String arrivalTime = (String) payload.get("arrivalTime");
        String departureTime = (String) payload.get("departureTime");
        int lengthMeters = ((Number) payload.get("lengthMeters")).intValue();

        PlatformRequestEntity entity = allocationService.addRequest(
                trainId, trainName, type, arrivalTime, departureTime, lengthMeters
        );
        return ResponseEntity.ok(entity);
    }

    @PostMapping("/process-next")
    public ResponseEntity<Map<String, Object>> processNext() {
        Map<String, Object> result = allocationService.processNextRequest();
        return ResponseEntity.ok(result);
    }

    @PostMapping("/release/{platformId}")
    public ResponseEntity<Map<String, Object>> releasePlatform(@PathVariable int platformId) {
        boolean released = allocationService.releasePlatform(platformId);
        return ResponseEntity.ok(Map.of("success", released, "platformId", platformId));
    }

    @PostMapping("/delay")
    public ResponseEntity<Map<String, Object>> delayTrain(
            @RequestParam String trainId,
            @RequestParam(defaultValue = "15") int minutes
    ) {
        boolean delayed = allocationService.delayTrain(trainId, minutes);
        return ResponseEntity.ok(Map.of("success", delayed, "trainId", trainId, "delayMinutes", minutes));
    }
}
