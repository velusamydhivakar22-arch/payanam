import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Comparator;

public class Platform {

    private int platformId;
    private int platformLength;

    private ArrayList<PlatformAllocation>
            allocations =
            new ArrayList<>();

    public Platform(
            int platformId,
            int platformLength) {

        this.platformId =
                platformId;

        this.platformLength =
                platformLength;
    }

    // ---------------- CHECK PLATFORM ----------------

    public boolean canAllocate(
            TrainService train,
            LocalTime start,
            LocalTime end) {

        // Train length check
        if (train.getTrainLength()
                > platformLength) {

            return false;
        }

        // Time overlap check
        for (PlatformAllocation existing :
                allocations) {

            boolean overlap =
                    start.isBefore(
                            existing.getEndTime()
                    )
                    &&
                    existing.getStartTime()
                            .isBefore(end);

            if (overlap) {

                return false;
            }
        }

        return true;
    }

    // ---------------- ALLOCATE ----------------

    public void occupyPlatform(
            TrainService train,
            LocalTime start,
            LocalTime end) {

        PlatformAllocation allocation =
                new PlatformAllocation(
                        train,
                        start,
                        end
                );

        allocations.add(
                allocation
        );

        // Keep intervals sorted
        allocations.sort(
                Comparator.comparing(
                        PlatformAllocation
                                ::getStartTime
                )
        );
    }

    // ---------------- DELAY UPDATE ----------------

    public boolean extendTrainOccupation(
            String trainId,
            LocalTime newEndTime) {

        for (PlatformAllocation a :
                allocations) {

            if (a.getTrain()
                    .getTrainId()
                    .equals(trainId)) {

                a.setEndTime(
                        newEndTime
                );

                return true;
            }
        }

        return false;
    }

    // ---------------- DISPLAY ----------------

    public void showAllocations() {

        System.out.println(
                "\nPlatform "
                        + platformId
                        + " | Length: "
                        + platformLength
                        + "m"
        );

        if (allocations.isEmpty()) {

            System.out.println(
                    "No train allocated."
            );

            return;
        }

        for (PlatformAllocation a :
                allocations) {

            System.out.println(
                    a.getTrain().getTrainId()
                            + " | "
                            + a.getStartTime()
                            + " - "
                            + a.getEndTime()
            );
        }
    }

    // ---------------- NEXT RELEASE ----------------

    public LocalTime getNextReleaseTime() {

        if (allocations.isEmpty()) {
            return null;
        }

        LocalTime earliest = null;

        for (PlatformAllocation a :
                allocations) {

            if (earliest == null
                    ||
                    a.getEndTime()
                            .isBefore(earliest)) {

                earliest =
                        a.getEndTime();
            }
        }

        return earliest;
    }

    public int getPlatformId() {
        return platformId;
    }

    public int getPlatformLength() {
        return platformLength;
    }

    public ArrayList<PlatformAllocation>
    getAllocations() {

        return allocations;
    }
}
