import java.util.Scanner;

public class Main {

    public static void main(
            String[] args) {

        Scanner scanner =
                new Scanner(System.in);

        RailwaySystem system =
                new RailwaySystem();

        while (true) {

            System.out.println(
                    "\n=============================="
            );

            System.out.println(
                    " PAYANAM JUNCTION"
            );

            System.out.println(
                    "=============================="
            );

            System.out.println(
                    "1. View Trains"
            );

            System.out.println(
                    "2. Book Ticket"
            );

            System.out.println(
                    "3. Cancel Ticket"
            );

            System.out.println(
                    "4. View Waiting List"
            );

            System.out.println(
                    "5. View Confirmed Bookings"
            );

            System.out.println(
                    "6. Add Platform Request"
            );

            System.out.println(
                    "7. Process Platform Request"
            );

            System.out.println(
                    "8. View Platforms"
            );

            System.out.println(
                    "9. Delay Train"
            );

            System.out.println(
                    "10. Next Platform Release"
            );

            System.out.println(
                    "11. View Platform Queue"
            );

            System.out.println(
                    "12. View History"
            );

            System.out.println(
                    "0. Exit"
            );

            int choice =
                    readInt(
                            scanner,
                            "Enter choice: "
                    );

            switch (choice) {

                case 1:

                    system.showTrains();
                    break;

                case 2:

                    System.out.print(
                            "Train ID: "
                    );

                    String trainId =
                            scanner
                                    .nextLine()
                                    .trim()
                                    .toUpperCase();

                    System.out.print(
                            "Passenger Name: "
                    );

                    String passengerName =
                            scanner
                                    .nextLine()
                                    .trim();

                    system.bookTicket(
                            trainId,
                            passengerName
                    );

                    break;

                case 3:

                    System.out.print(
                            "Train ID: "
                    );

                    String cancelTrain =
                            scanner
                                    .nextLine()
                                    .trim()
                                    .toUpperCase();

                    int reservationId =
                            readInt(
                                    scanner,
                                    "Reservation ID: "
                            );

                    system.cancelTicket(
                            cancelTrain,
                            reservationId
                    );

                    break;

                case 4:

                    System.out.print(
                            "Train ID: "
                    );

                    String waitingTrain =
                            scanner
                                    .nextLine()
                                    .trim()
                                    .toUpperCase();

                    system.showWaitingList(
                            waitingTrain
                    );

                    break;

                case 5:

                    System.out.print(
                            "Train ID: "
                    );

                    String bookingTrain =
                            scanner
                                    .nextLine()
                                    .trim()
                                    .toUpperCase();

                    system.showConfirmedBookings(
                            bookingTrain
                    );

                    break;

                case 6:

                    System.out.print(
                            "Train ID: "
                    );

                    String requestTrain =
                            scanner
                                    .nextLine()
                                    .trim()
                                    .toUpperCase();

                    System.out.println(
                            "1. Emergency"
                    );

                    System.out.println(
                            "2. Connection"
                    );

                    System.out.println(
                            "3. Normal"
                    );

                    int type =
                            readInt(
                                    scanner,
                                    "Select Type: "
                            );

                    if (type < 1
                            || type > 3) {

                        System.out.println(
                                "Invalid request type."
                        );

                        break;
                    }

                    system.addPlatformRequest(
                            requestTrain,
                            type
                    );

                    break;

                case 7:

                    system.processPlatformRequest();

                    break;

                case 8:

                    system.showPlatforms();

                    break;

                case 9:

                    System.out.print(
                            "Train ID: "
                    );

                    String delayedTrain =
                            scanner
                                    .nextLine()
                                    .trim()
                                    .toUpperCase();

                    int delay =
                            readInt(
                                    scanner,
                                    "Delay Minutes: "
                            );

                    system.delayTrain(
                            delayedTrain,
                            delay
                    );

                    break;

                case 10:

                    system.showNextPlatformRelease();

                    break;

                case 11:

                    system.showPlatformQueue();

                    break;

                case 12:

                    system.showHistory();

                    break;

                case 0:

                    System.out.println(
                            "Program closed."
                    );

                    scanner.close();

                    return;

                default:

                    System.out.println(
                            "Invalid choice."
                    );
            }
        }
    }

    // Safe integer input
    private static int readInt(
            Scanner scanner,
            String message) {

        while (true) {

            System.out.print(
                    message
            );

            String input =
                    scanner
                            .nextLine()
                            .trim();

            try {

                return Integer.parseInt(
                        input
                );

            } catch (
                    NumberFormatException e) {

                System.out.println(
                        "Please enter a valid number."
                );
            }
        }
    }
}
