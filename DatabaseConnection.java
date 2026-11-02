import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

/**
 * Payanam Junction — Database Connectivity Helper
 * Provides direct JDBC connectivity to MySQL 8.0 instance on port 3307.
 */
public class DatabaseConnection {

    private static final String DEFAULT_HOST = "localhost";
    private static final int DEFAULT_PORT = 3307;
    private static final String DEFAULT_DATABASE = "payanam_junction";
    private static final String DEFAULT_USER = "root";
    private static final String DEFAULT_PASSWORD = "root";

    public static Connection getConnection() throws SQLException {
        String host = System.getenv().getOrDefault("DB_HOST", DEFAULT_HOST);
        String portStr = System.getenv().getOrDefault("DB_PORT", String.valueOf(DEFAULT_PORT));
        String database = System.getenv().getOrDefault("DB_NAME", DEFAULT_DATABASE);
        String user = System.getenv().getOrDefault("DB_USERNAME", DEFAULT_USER);
        String password = System.getenv().getOrDefault("DB_PASSWORD", DEFAULT_PASSWORD);

        String url = String.format(
            "jdbc:mysql://%s:%s/%s?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC",
            host, portStr, database
        );

        return DriverManager.getConnection(url, user, password);
    }

    public static boolean testConnection() {
        System.out.println("Testing MySQL Connection to " + DEFAULT_HOST + ":" + DEFAULT_PORT + "/" + DEFAULT_DATABASE + "...");
        try (Connection conn = getConnection()) {
            if (conn != null && !conn.isClosed()) {
                System.out.println("[SUCCESS] Successfully connected to MySQL database: " + conn.getCatalog());
                try (Statement stmt = conn.createStatement();
                     ResultSet rs = stmt.executeQuery("SELECT count(*) as total FROM information_schema.tables WHERE table_schema = '" + DEFAULT_DATABASE + "'")) {
                    if (rs.next()) {
                        System.out.println("[INFO] Tables in " + DEFAULT_DATABASE + ": " + rs.getInt("total"));
                    }
                }
                return true;
            }
        } catch (SQLException e) {
            System.err.println("[ERROR] Database connection failed: " + e.getMessage());
        }
        return false;
    }

    /**
     * Example 1: Retrieve and display trains from the database
     */
    public static void printAllTrains() {
        String sql = "SELECT id, number, name, source_code, destination_code, departure_time, arrival_time FROM trains LIMIT 5";
        System.out.println("\n--- 1. RETRIEVING TRAINS (SELECT query) ---");
        try (Connection conn = getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {

            while (rs.next()) {
                String id = rs.getString("id");
                String number = rs.getString("number");
                String name = rs.getString("name");
                String src = rs.getString("source_code");
                String dest = rs.getString("destination_code");
                String dep = rs.getString("departure_time");
                String arr = rs.getString("arrival_time");

                System.out.printf("  * [%s] %s (%s): %s -> %s | Dep: %s, Arr: %s%n",
                        id, name, number, src, dest, dep, arr);
            }
        } catch (SQLException e) {
            System.err.println("Error fetching trains: " + e.getMessage());
        }
    }

    /**
     * Example 2: Parameterized query using PreparedStatement
     */
    public static void searchTrainsByRoute(String sourceCode, String destCode) {
        String sql = "SELECT id, number, name, departure_time, arrival_time FROM trains WHERE source_code = ? AND destination_code = ?";
        System.out.printf("\n--- 2. RETRIEVING TRAINS FOR ROUTE: %s -> %s ---%n", sourceCode, destCode);
        try (Connection conn = getConnection();
             java.sql.PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, sourceCode);
            pstmt.setString(2, destCode);

            try (ResultSet rs = pstmt.executeQuery()) {
                boolean found = false;
                while (rs.next()) {
                    found = true;
                    System.out.printf("  * Train #%s: %s (Dep: %s, Arr: %s)%n",
                            rs.getString("number"), rs.getString("name"),
                            rs.getString("departure_time"), rs.getString("arrival_time"));
                }
                if (!found) {
                    System.out.println("  No direct trains found for this route.");
                }
            }
        } catch (SQLException e) {
            System.err.println("Error querying route: " + e.getMessage());
        }
    }

    public static void main(String[] args) {
        if (testConnection()) {
            printAllTrains();
            searchTrainsByRoute("MDU", "MS");
        }
    }
}
