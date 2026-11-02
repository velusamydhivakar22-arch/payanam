import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.PriorityQueue;

public class RailwaySystem {

    private final Map<String, TrainService> trains =
            new HashMap<>();

    private final Map<String, Integer> nextReservationIds =
            new HashMap<>();

    private final ArrayList<Platform> platforms =
            new ArrayList<>();

    private final PriorityQueue<PlatformRequest> platformQueue =
            new PriorityQueue<>(
                    Comparator.comparingInt(PlatformRequest::priorityRank)
                            .thenComparingInt(PlatformRequest::getRequestOrder)
            );

    private final ArrayList<String> history =
            new ArrayList<>();

    private final PlatformAllocationPolicy allocationPolicy =
            new DefaultPlatformAllocationPolicy();

    private int nextRequestOrder = 1;

    public RailwaySystem() {
        addTrain(new TrainService(
                "P101", "Payanam Express",
                LocalTime.of(8, 0),
                LocalTime.of(8, 30),
                300
        ));

        addTrain(new TrainService(
                "P202", "Junction Intercity",
                LocalTime.of(10, 0),
                LocalTime.of(10, 30),
                250
        ));

        addTrain(new TrainService(
                "P303", "Coastal Passenger",
                LocalTime.of(12, 0),
                LocalTime.of(12, 30),
                200
        ));

        addTrain(new TrainService(
            "P404", "Western Intercity",
            LocalTime.of(14, 0),
            LocalTime.of(14, 30),
            280
        ));

        addTrain(new TrainService(
            "P505", "Northern Express",
            LocalTime.of(16, 0),
            LocalTime.of(16, 30),
            320
        ));

        addTrain(new TrainService(
            "P606", "Southern Passenger",
            LocalTime.of(18, 0),
            LocalTime.of(18, 30),
            220
        ));

        platforms.add(new Platform(1, 250));
        platforms.add(new Platform(2, 300));
        platforms.add(new Platform(3, 400));
    }

    private void addTrain(TrainService train) {
        trains.put(train.getTrainId(), train);
        nextReservationIds.put(train.getTrainId(), 1);
    }

    public void showTrains() {
        System.out.println("\n--- TRAINS ---");

        for (TrainService train : trains.values()) {
            System.out.println(train);
        }
    }

    public void bookTicket(
            String trainId,
            String passengerName) {

        TrainService train = trains.get(trainId);

        if (train == null) {
            System.out.println("Train not found.");
            return;
        }

        int reservationId = nextReservationIds.merge(
                trainId,
                1,
                Integer::sum
        ) - 1;

        Reservation reservation = new Reservation(
                reservationId,
                new Passenger(reservationId, passengerName)
        );

        train.bookSeat(reservation);
        history.add(
                "Booking " + reservationId
                        + " created for " + passengerName
                        + " on " + trainId
        );

        System.out.println("Reservation ID: " + reservationId);
    }

    public void cancelTicket(
            String trainId,
            int reservationId) {

        TrainService train = trains.get(trainId);

        if (train == null) {
            System.out.println("Train not found.");
            return;
        }

        train.cancelBooking(reservationId);
        history.add(
                "Cancellation requested for reservation "
                        + reservationId + " on " + trainId
        );
    }

    public void showWaitingList(String trainId) {
        TrainService train = trains.get(trainId);

        if (train == null) {
            System.out.println("Train not found.");
            return;
        }

        train.showWaitingList();
    }

    public void showConfirmedBookings(String trainId) {
        TrainService train = trains.get(trainId);

        if (train == null) {
            System.out.println("Train not found.");
            return;
        }

        train.showConfirmedBookings();
    }

    public void addPlatformRequest(
            String trainId,
            int type) {

        TrainService train = trains.get(trainId);

        if (train == null) {
            System.out.println("Train not found.");
            return;
        }

        PlatformRequest request;

        if (type == 1) {
            request = new EmergencyArrival(
                    train,
                    nextRequestOrder++
            );
        } else {
            request = new ScheduledArrival(
                    train,
                    nextRequestOrder++,
                    type == 2
            );
        }

        platformQueue.offer(request);
        history.add("Platform request added for " + trainId);
        System.out.println("Platform request added.");
    }

    public void processPlatformRequest() {
        PlatformRequest request = platformQueue.peek();

        if (request == null) {
            System.out.println("Platform queue is empty.");
            return;
        }

        request.refreshFromTrain();
        Platform platform = allocationPolicy.selectPlatform(
                platforms,
                request
        );

        if (platform == null) {
            System.out.println("No suitable platform is available.");
            return;
        }

        platformQueue.poll();
        LocalTime releaseTime = request.getDeparture().plusMinutes(5);
        platform.occupyPlatform(
                request.getTrain(),
                request.getArrival(),
                releaseTime
        );

        history.add(
                "Platform " + platform.getPlatformId()
                        + " allocated to " + request.getTrain().getTrainId()
        );

        System.out.println(
                "Platform " + platform.getPlatformId()
                        + " allocated to " + request.getTrain().getTrainId()
        );
    }

    public void showPlatforms() {
        for (Platform platform : platforms) {
            platform.showAllocations();
        }
    }

    public void delayTrain(
            String trainId,
            int delay) {

        TrainService train = trains.get(trainId);

        if (train == null) {
            System.out.println("Train not found.");
            return;
        }

        train.delayDeparture(delay);

        for (PlatformRequest request : platformQueue) {
            if (request.getTrain() == train) {
                request.refreshFromTrain();
            }
        }

        System.out.println(
                "Train delayed. New departure: "
                        + train.getDepartureTime()
        );
    }

    public void showNextPlatformRelease() {
        LocalTime earliest = null;

        for (Platform platform : platforms) {
            LocalTime release = platform.getNextReleaseTime();

            if (release != null
                    && (earliest == null || release.isBefore(earliest))) {
                earliest = release;
            }
        }

        if (earliest == null) {
            System.out.println("No platform allocations.");
        } else {
            System.out.println("Next platform release: " + earliest);
        }
    }

    public void showPlatformQueue() {
        if (platformQueue.isEmpty()) {
            System.out.println("Platform queue is empty.");
            return;
        }

        List<PlatformRequest> requests =
                new ArrayList<>(platformQueue);

        requests.sort(
                Comparator.comparingInt(PlatformRequest::priorityRank)
                        .thenComparingInt(PlatformRequest::getRequestOrder)
        );

        System.out.println("\n--- PLATFORM QUEUE ---");

        for (PlatformRequest request : requests) {
            System.out.println(
                    request.getTrain().getTrainId()
                            + " | Priority: " + request.priorityRank()
                            + " | Arrival: " + request.getArrival()
            );
        }
    }

    public void showHistory() {
        System.out.println("\n--- HISTORY ---");

        if (history.isEmpty()) {
            System.out.println("No history available.");
            return;
        }

        for (String entry : history) {
            System.out.println(entry);
        }
    }
}
