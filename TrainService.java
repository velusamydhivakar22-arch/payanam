import java.time.LocalTime;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.Iterator;

public class TrainService {

    private String trainId;
    private String trainName;

    private LocalTime arrivalTime;
    private LocalTime departureTime;

    private int trainLength;

    private final int seatCapacity = 10;

    // Confirmed booking lookup
    private HashMap<Integer, Reservation>
            confirmedBookings =
            new HashMap<>();

    // FIFO Waiting List
    private ArrayDeque<Reservation>
            waitingQueue =
            new ArrayDeque<>();

    public TrainService(
            String trainId,
            String trainName,
            LocalTime arrivalTime,
            LocalTime departureTime,
            int trainLength) {

        this.trainId = trainId;
        this.trainName = trainName;
        this.arrivalTime = arrivalTime;
        this.departureTime = departureTime;
        this.trainLength = trainLength;
    }

    // ---------------- BOOKING ----------------

    public void bookSeat(
            Reservation reservation) {

        if (confirmedBookings.size()
                < seatCapacity) {

            int seat =
                    findFreeSeat();

            reservation.confirm(seat);

            confirmedBookings.put(
                    reservation.getReservationId(),
                    reservation
            );

            System.out.println(
                    "\nBooking CONFIRMED"
            );

            System.out.println(
                    "Seat Number: " + seat
            );

        } else {

            reservation.setWaiting();

            waitingQueue.offer(
                    reservation
            );

            System.out.println(
                    "\nTrain is FULL."
            );

            System.out.println(
                    "Passenger added to WAITING LIST."
            );

            System.out.println(
                    "Waiting Position: "
                            + waitingQueue.size()
            );
        }
    }

    // ---------------- FIND FREE SEAT ----------------

    private int findFreeSeat() {

        for (int seat = 1;
             seat <= seatCapacity;
             seat++) {

            boolean used = false;

            for (Reservation r :
                    confirmedBookings.values()) {

                if (r.getSeatNumber()
                        == seat) {

                    used = true;
                    break;
                }
            }

            if (!used) {
                return seat;
            }
        }

        return -1;
    }

    // ---------------- CANCELLATION ----------------

    public Reservation cancelBooking(
            int reservationId) {

        Reservation cancelled =
                confirmedBookings.remove(
                        reservationId
                );

        // Confirmed passenger cancellation
        if (cancelled != null) {

            int freeSeat =
                    cancelled.getSeatNumber();

            cancelled.cancel();

            System.out.println(
                    "\nBooking CANCELLED."
            );

            // FIFO automatic promotion
            if (!waitingQueue.isEmpty()) {

                Reservation promoted =
                        waitingQueue.poll();

                promoted.confirm(
                        freeSeat
                );

                confirmedBookings.put(
                        promoted.getReservationId(),
                        promoted
                );

                System.out.println(
                        promoted.getPassenger()
                                .getName()
                                + " promoted from WAITING"
                                + " to CONFIRMED."
                );

                System.out.println(
                        "Seat Number: "
                                + freeSeat
                );

                return promoted;
            }

            return null;
        }

        // Check waiting list cancellation
        Iterator<Reservation> iterator =
                waitingQueue.iterator();

        while (iterator.hasNext()) {

            Reservation r =
                    iterator.next();

            if (r.getReservationId()
                    == reservationId) {

                iterator.remove();

                r.cancel();

                System.out.println(
                        "Waiting reservation CANCELLED."
                );

                return null;
            }
        }

        System.out.println(
                "Reservation not found."
        );

        return null;
    }

    // ---------------- WAITING LIST ----------------

    public void showWaitingList() {

        System.out.println(
                "\n--- WAITING LIST ---"
        );

        if (waitingQueue.isEmpty()) {

            System.out.println(
                    "Waiting list is empty."
            );

            return;
        }

        int position = 1;

        for (Reservation r :
                waitingQueue) {

            System.out.println(
                    position
                            + ". "
                            + r.getPassenger().getName()
                            + " | Reservation ID: "
                            + r.getReservationId()
            );

            position++;
        }
    }

    // ---------------- CONFIRMED BOOKINGS ----------------

    public void showConfirmedBookings() {

        System.out.println(
                "\n--- CONFIRMED BOOKINGS ---"
        );

        if (confirmedBookings.isEmpty()) {

            System.out.println(
                    "No confirmed bookings."
            );

            return;
        }

        ArrayList<Reservation> list =
                new ArrayList<>(
                        confirmedBookings.values()
                );

        list.sort(
                Comparator.comparingInt(
                        Reservation::getSeatNumber
                )
        );

        for (Reservation r : list) {

            System.out.println(
                    "Seat "
                            + r.getSeatNumber()
                            + " | "
                            + r.getPassenger().getName()
                            + " | Reservation: "
                            + r.getReservationId()
            );
        }
    }

    // ---------------- DELAY ----------------

    public void delayDeparture(
            int minutes) {

        departureTime =
                departureTime.plusMinutes(
                        minutes
                );
    }

    public String getTrainId() {
        return trainId;
    }

    public String getTrainName() {
        return trainName;
    }

    public LocalTime getArrivalTime() {
        return arrivalTime;
    }

    public LocalTime getDepartureTime() {
        return departureTime;
    }

    public int getTrainLength() {
        return trainLength;
    }

    public int getSeatCapacity() {
        return seatCapacity;
    }

    @Override
    public String toString() {

        return trainId
                + " | "
                + trainName
                + " | Arrival: "
                + arrivalTime
                + " | Departure: "
                + departureTime
                + " | Length: "
                + trainLength
                + "m";
    }
}
