public class Passenger {

    private int passengerId;
    private String name;

    public Passenger(int passengerId, String name) {
        this.passengerId = passengerId;
        this.name = name;
    }

    public int getPassengerId() {
        return passengerId;
    }

    public String getName() {
        return name;
    }

    @Override
    public String toString() {
        return passengerId + " - " + name;
    }
}
