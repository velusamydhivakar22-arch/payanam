package com.payanam.railconnect.service;

import com.payanam.railconnect.entity.PlatformEntity;
import com.payanam.railconnect.entity.PlatformRequestEntity;
import com.payanam.railconnect.repository.PlatformRepository;
import com.payanam.railconnect.repository.PlatformRequestRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class PlatformAllocationService {

    private final PlatformRepository platformRepository;
    private final PlatformRequestRepository requestRepository;
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm");

    public PlatformAllocationService(PlatformRepository platformRepository, PlatformRequestRepository requestRepository) {
        this.platformRepository = platformRepository;
        this.requestRepository = requestRepository;
    }

    public List<PlatformEntity> getAllPlatforms() {
        return platformRepository.findAll();
    }

    public List<PlatformRequestEntity> getAllRequests() {
        return requestRepository.findAll();
    }

    @Transactional
    public PlatformRequestEntity addRequest(
            String trainId,
            String trainName,
            String type,
            String arrivalTime,
            String departureTime,
            int lengthMeters
    ) {
        int rank = switch (type.toUpperCase()) {
            case "EMERGENCY" -> 1;
            case "CONNECTION" -> 2;
            default -> 3;
        };

        long count = requestRepository.count();

        PlatformRequestEntity req = new PlatformRequestEntity();
        req.setId("req-" + System.currentTimeMillis());
        req.setTrainId(trainId);
        req.setTrainName(trainName);
        req.setType(type.toUpperCase());
        req.setArrivalTime(arrivalTime);
        req.setDepartureTime(departureTime);
        req.setLengthMeters(lengthMeters);
        req.setPriorityRank(rank);
        req.setRequestOrder((int) count + 1);
        req.setStatus("PENDING");

        return requestRepository.save(req);
    }

    /**
     * Process next request in queue according to:
     * 1. Priority Rank (Emergency 1 > Connection 2 > Normal 3)
     * 2. FIFO Request Order
     * 3. Length fit: platform length >= train length
     * 4. Clearance Buffer: Release time = departureTime + 5 minutes
     */
    @Transactional
    public synchronized Map<String, Object> processNextRequest() {
        List<PlatformRequestEntity> pendingList = requestRepository
                .findByStatusOrderByPriorityRankAscRequestOrderAsc("PENDING");

        Map<String, Object> response = new HashMap<>();

        if (pendingList.isEmpty()) {
            response.put("success", false);
            response.put("message", "Platform queue is empty. No pending arrivals.");
            return response;
        }

        PlatformRequestEntity request = pendingList.get(0);
        List<PlatformEntity> availablePlatforms = platformRepository.findByOccupiedFalse();

        // Find platform that fits length
        Optional<PlatformEntity> suitableOpt = availablePlatforms.stream()
                .filter(p -> p.getLengthMeters() >= request.getLengthMeters())
                .min(Comparator.comparingInt(PlatformEntity::getLengthMeters));

        if (suitableOpt.isEmpty()) {
            response.put("success", false);
            response.put("message", "No suitable platform available for train " + request.getTrainId() + " (Length: " + request.getLengthMeters() + "m). Platforms occupied or insufficient capacity.");
            return response;
        }

        PlatformEntity platform = suitableOpt.get();

        // Calculate clearance buffer: departure + 5 minutes
        LocalTime depTime = LocalTime.parse(request.getDepartureTime(), TIME_FORMATTER);
        LocalTime releaseTime = depTime.plusMinutes(5);

        platform.setOccupied(true);
        platform.setCurrentTrainId(request.getTrainId());
        platform.setCurrentTrainName(request.getTrainName());
        platform.setArrivalTime(request.getArrivalTime());
        platform.setReleaseTime(releaseTime.format(TIME_FORMATTER));
        platformRepository.save(platform);

        request.setStatus("ALLOCATED");
        request.setAllocatedPlatformId(platform.getPlatformId());
        requestRepository.save(request);

        response.put("success", true);
        response.put("allocatedPlatformId", platform.getPlatformId());
        response.put("trainId", request.getTrainId());
        response.put("releaseTime", platform.getReleaseTime());
        response.put("message", "Platform " + platform.getPlatformId() + " allocated to " + request.getTrainName() + ". Occupied until " + platform.getReleaseTime() + " (+5 min buffer).");

        return response;
    }

    @Transactional
    public boolean releasePlatform(int platformId) {
        Optional<PlatformEntity> platOpt = platformRepository.findById(platformId);
        if (platOpt.isPresent()) {
            PlatformEntity p = platOpt.get();
            p.setOccupied(false);
            p.setCurrentTrainId(null);
            p.setCurrentTrainName(null);
            p.setArrivalTime(null);
            p.setReleaseTime(null);
            platformRepository.save(p);
            return true;
        }
        return false;
    }

    @Transactional
    public boolean delayTrain(String trainId, int delayMinutes) {
        List<PlatformEntity> platforms = platformRepository.findAll();
        for (PlatformEntity p : platforms) {
            if (trainId.equalsIgnoreCase(p.getCurrentTrainId()) && p.getReleaseTime() != null) {
                LocalTime currentRelease = LocalTime.parse(p.getReleaseTime(), TIME_FORMATTER);
                LocalTime newRelease = currentRelease.plusMinutes(delayMinutes);
                p.setReleaseTime(newRelease.format(TIME_FORMATTER));
                platformRepository.save(p);
                return true;
            }
        }
        return false;
    }
}
