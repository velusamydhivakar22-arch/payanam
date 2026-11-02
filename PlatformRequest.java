import java.time.LocalTime;

public abstract class PlatformRequest {

    protected TrainService train;

    protected LocalTime arrival;
    protected LocalTime departure;

    protected int requestOrder;

    public PlatformRequest(
            TrainService train,
            int requestOrder) {

        this.train =
                train;

        this.requestOrder =
                requestOrder;

        refreshFromTrain();
    }

    public abstract int priorityRank();

    public void refreshFromTrain() {

        this.arrival =
                train.getArrivalTime();

        this.departure =
                train.getDepartureTime();
    }

    public TrainService getTrain() {
        return train;
    }

    public LocalTime getArrival() {
        return arrival;
    }

    public LocalTime getDeparture() {
        return departure;
    }

    public int getRequestOrder() {
        return requestOrder;
    }
}
