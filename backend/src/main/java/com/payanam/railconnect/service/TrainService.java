package com.payanam.railconnect.service;

import com.payanam.railconnect.entity.StationEntity;
import com.payanam.railconnect.entity.TrainClassEntity;
import com.payanam.railconnect.entity.TrainEntity;
import com.payanam.railconnect.repository.StationRepository;
import com.payanam.railconnect.repository.TrainRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

@Service
public class TrainService {

    private final TrainRepository trainRepository;
    private final StationRepository stationRepository;

    public TrainService(TrainRepository trainRepository, StationRepository stationRepository) {
        this.trainRepository = trainRepository;
        this.stationRepository = stationRepository;
    }

    public List<TrainEntity> searchDirectTrains(String source, String destination) {
        List<TrainEntity> directTrains = trainRepository.findBySourceCodeAndDestinationCode(source, destination);
        if (!directTrains.isEmpty()) {
            return directTrains;
        }

        // Chennai Twin-Terminal Metropolitan Intelligence (MAS <-> MS)
        // If searching MAS to a destination, also check sister terminal MS if MAS has no direct trains
        if ("MAS".equalsIgnoreCase(source)) {
            List<TrainEntity> sisterTrains = trainRepository.findBySourceCodeAndDestinationCode("MS", destination);
            if (!sisterTrains.isEmpty()) {
                return sisterTrains;
            }
        } else if ("MS".equalsIgnoreCase(source)) {
            List<TrainEntity> sisterTrains = trainRepository.findBySourceCodeAndDestinationCode("MAS", destination);
            if (!sisterTrains.isEmpty()) {
                return sisterTrains;
            }
        }

        if ("MAS".equalsIgnoreCase(destination)) {
            List<TrainEntity> sisterTrains = trainRepository.findBySourceCodeAndDestinationCode(source, "MS");
            if (!sisterTrains.isEmpty()) {
                return sisterTrains;
            }
        } else if ("MS".equalsIgnoreCase(destination)) {
            List<TrainEntity> sisterTrains = trainRepository.findBySourceCodeAndDestinationCode(source, "MAS");
            if (!sisterTrains.isEmpty()) {
                return sisterTrains;
            }
        }

        return Collections.emptyList();
    }

    public List<Map<String, Object>> searchConnectingItineraries(String source, String destination) {
        List<Map<String, Object>> itineraries = new ArrayList<>();
        List<TrainEntity> allTrains = trainRepository.findAll();
        Map<String, StationEntity> stationMap = new HashMap<>();
        stationRepository.findAll().forEach(s -> stationMap.put(s.getCode(), s));

        // Group trains by source and destination
        Map<String, List<TrainEntity>> trainsBySource = new HashMap<>();
        for (TrainEntity t : allTrains) {
            trainsBySource.computeIfAbsent(t.getSourceCode(), k -> new ArrayList<>()).add(t);
        }

        // Potential transfer junctions
        Set<String> candidateJunctions = new HashSet<>(Arrays.asList("TPJ", "CBE", "SA", "MS", "MAS", "SBC", "MDU"));
        candidateJunctions.remove(source);
        candidateJunctions.remove(destination);

        List<TrainEntity> leg1Options = trainsBySource.getOrDefault(source, Collections.emptyList());
        // Also support Chennai sister terminal for leg 1 if needed
        if (leg1Options.isEmpty()) {
            if ("MAS".equalsIgnoreCase(source)) leg1Options = trainsBySource.getOrDefault("MS", Collections.emptyList());
            else if ("MS".equalsIgnoreCase(source)) leg1Options = trainsBySource.getOrDefault("MAS", Collections.emptyList());
        }

        for (TrainEntity leg1 : leg1Options) {
            String junction = leg1.getDestinationCode();
            if (!candidateJunctions.contains(junction)) continue;

            List<TrainEntity> leg2Candidates = trainsBySource.getOrDefault(junction, Collections.emptyList());
            for (TrainEntity leg2 : leg2Candidates) {
                boolean matchesDest = leg2.getDestinationCode().equalsIgnoreCase(destination);
                // Also support Chennai sister terminal for destination
                if (!matchesDest) {
                    if ("MAS".equalsIgnoreCase(destination) && "MS".equalsIgnoreCase(leg2.getDestinationCode())) matchesDest = true;
                    if ("MS".equalsIgnoreCase(destination) && "MAS".equalsIgnoreCase(leg2.getDestinationCode())) matchesDest = true;
                }

                if (matchesDest) {
                    int layoverMinutes = calculateMinutesBetween(leg1.getArrivalTime(), leg2.getDepartureTime());
                    if (layoverMinutes >= 30) {
                        StationEntity juncStn = stationMap.get(junction);
                        String juncName = (juncStn != null) ? juncStn.getName() : junction;
                        String juncNameTa = (juncStn != null) ? juncStn.getNameTamil() : junction;

                        BigDecimal leg1MinFare = getMinFare(leg1);
                        BigDecimal leg2MinFare = getMinFare(leg2);

                        Map<String, Object> it = new LinkedHashMap<>();
                        it.put("id", "conn-" + leg1.getId() + "-" + leg2.getId());
                        it.put("leg1", leg1);
                        it.put("leg2", leg2);
                        it.put("junctionCode", junction);
                        it.put("junctionName", juncName);
                        it.put("junctionNameTamil", juncNameTa);
                        it.put("departureTime", leg1.getDepartureTime());
                        it.put("arrivalTime", leg2.getArrivalTime());
                        it.put("totalDuration", formatTotalDuration(leg1.getDuration(), leg2.getDuration(), layoverMinutes));
                        it.put("layoverDuration", layoverMinutes + "m Layover");
                        it.put("combinedFare", leg1MinFare.add(leg2MinFare));
                        it.put("availableClasses", List.of("2A", "3A", "SL", "CC"));

                        itineraries.add(it);
                    }
                }
            }
        }

        return itineraries;
    }

    private BigDecimal getMinFare(TrainEntity train) {
        if (train.getClasses() == null || train.getClasses().isEmpty()) {
            return BigDecimal.valueOf(350);
        }
        return train.getClasses().stream()
                .map(TrainClassEntity::getFare)
                .min(Comparator.naturalOrder())
                .orElse(BigDecimal.valueOf(350));
    }

    private int calculateMinutesBetween(String arrival, String departure) {
        String[] arrParts = arrival.split(":");
        String[] depParts = departure.split(":");
        int arrMin = Integer.parseInt(arrParts[0].trim()) * 60 + Integer.parseInt(arrParts[1].trim());
        int depMin = Integer.parseInt(depParts[0].trim()) * 60 + Integer.parseInt(depParts[1].trim());
        if (depMin < arrMin) {
            depMin += 24 * 60; // Overnight layover
        }
        return depMin - arrMin;
    }

    private String formatTotalDuration(String dur1, String dur2, int layoverMinutes) {
        int m1 = parseDurationMinutes(dur1);
        int m2 = parseDurationMinutes(dur2);
        int total = m1 + m2 + layoverMinutes;
        int hours = total / 60;
        int mins = total % 60;
        return hours + "h " + mins + "m (Combined)";
    }

    private int parseDurationMinutes(String dur) {
        int h = 0, m = 0;
        try {
            if (dur.contains("h")) {
                String[] parts = dur.split("h");
                h = Integer.parseInt(parts[0].trim());
                if (parts.length > 1 && parts[1].contains("m")) {
                    m = Integer.parseInt(parts[1].replace("m", "").trim());
                }
            }
        } catch (Exception ignored) {}
        return h * 60 + m;
    }
}
