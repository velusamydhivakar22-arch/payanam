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

    public static void main(String[] args) {
        testConnection();
    }
}
