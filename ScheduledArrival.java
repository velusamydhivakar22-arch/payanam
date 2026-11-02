public class ScheduledArrival
        extends PlatformRequest {

    private boolean connectionTrain;

    public ScheduledArrival(
            TrainService train,
            int requestOrder,
            boolean connectionTrain) {

        super(
                train,
                requestOrder
        );

        this.connectionTrain =
                connectionTrain;
    }

    @Override
    public int priorityRank() {

        if (connectionTrain) {

            return 2;
        }

        // Normal train
        return 3;
    }
}
