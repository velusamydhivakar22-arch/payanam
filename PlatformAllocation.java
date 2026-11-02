import java.time.LocalTime;

public class PlatformAllocation {

    private TrainService train;

    private LocalTime startTime;
    private LocalTime endTime;

    public PlatformAllocation(
            TrainService train,
            LocalTime startTime,
            LocalTime endTime) {

        this.train = train;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    public TrainService getTrain() {
        return train;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(
            LocalTime endTime) {

        this.endTime = endTime;
    }
}
