public class EmergencyArrival
        extends PlatformRequest {

    public EmergencyArrival(
            TrainService train,
            int requestOrder) {

        super(
                train,
                requestOrder
        );
    }

    @Override
    public int priorityRank() {

        // Highest priority
        return 1;
    }
}
