public class Reservation {

    private int reservationId;
    private Passenger passenger;
    private ReservationStatus status;
    private int seatNumber;

    public Reservation(
            int reservationId,
            Passenger passenger) {

        this.reservationId = reservationId;
        this.passenger = passenger;

        this.status =
                ReservationStatus.WAITING;

        this.seatNumber = 0;
    }

    public int getReservationId() {
        return reservationId;
    }

    public Passenger getPassenger() {
        return passenger;
    }

    public ReservationStatus getStatus() {
        return status;
    }

    public int getSeatNumber() {
        return seatNumber;
    }

    public void confirm(int seatNumber) {

        this.status =
                ReservationStatus.CONFIRMED;

        this.seatNumber =
                seatNumber;
    }

    public void setWaiting() {

        this.status =
                ReservationStatus.WAITING;

        this.seatNumber = 0;
    }

    public void cancel() {

        this.status =
                ReservationStatus.CANCELLED;

        this.seatNumber = 0;
    }
}
