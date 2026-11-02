# Payanam Junction — RailConnect Backend

Java Spring Boot + MySQL Backend service for Payanam Junction Railway System.

## Architecture & Core Algorithms

1. **100 Seats Per Class Capacity**:
   - Strictly enforces 100 seats limit per train service and class (`1A`, `2A`, `3A`, `CC`, `EC`, `SL`).
2. **3-Tier Booking Priority Engine**:
   - **Emergency (Rank 1)**: Pre-empts lower queues.
   - **Connecting (Rank 2)**: Prioritized for passengers with incoming train/flight connections.
   - **Normal (Rank 3)**: Standard commuter quota.
   - **FIFO within tier**: Passengers within the same priority level are ordered strictly first-come, first-served.
   - **No displacement**: Confirmed passengers are *never* displaced by subsequent emergency or connecting bookings.
3. **Automatic Promotion on Cancellation**:
   - When a confirmed booking is cancelled, the released seat is immediately assigned to the highest-priority eligible waiting list passenger.
   - Waiting list positions are dynamically recalculated for remaining waiting passengers.
4. **Smart Platform Allocation**:
   - Matches incoming train length with platform track capacity (Platform 1: 250m, Platform 2: 300m, Platform 3: 400m).
   - Enforces a mandatory **5-minute clearance buffer** past train departure before the platform is marked clear.
   - Supports emergency arrival pre-emption and real-time departure delay recalculation.

## Database Setup

1. Start your local MySQL service (port 3306).
2. The application is configured in `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/payanam_junction?createDatabaseIfNotExist=true
   spring.datasource.username=root
   spring.datasource.password=root
   ```
3. Initial schemas and seed data are automatically executed from `schema.sql` and `data.sql`.

## Running the Backend

If Maven is installed on your system:
```bash
cd backend
mvn spring-boot:run
```

Or package the JAR:
```bash
mvn clean package
java -jar target/railconnect-1.0.0.jar
```

The REST API endpoints will be live at `http://localhost:8080/api/`.

## REST API Endpoints

- `GET  /api/stations`: List all railway stations.
- `GET  /api/trains/search?source=MDU&destination=MS`: Search trains by source and destination.
- `POST /api/reservations/book`: Create a new booking with priority queue rules.
- `POST /api/reservations/cancel/{pnr}`: Cancel a ticket and automatically promote waitlisted passengers.
- `GET  /api/reservations/my-bookings`: Retrieve all reservations.
- `GET  /api/reservations/pnr/{pnr}`: Lookup reservation by PNR.
- `GET  /api/platforms`: Get live status of platform tracks.
- `POST /api/platforms/process-next`: Process next priority request in platform queue.
- `POST /api/platforms/delay?trainId=P101&minutes=15`: Delay a train and update release buffer.
