/**
 * Payanam Junction — MongoDB Connectivity Guide & Reference
 * 
 * Supports both:
 * 1. Local MongoDB:  mongodb://localhost:27017/payanam_junction
 * 2. MongoDB Atlas:  mongodb+srv://<username>:<password>@cluster0.mongodb.net/payanam_junction?retryWrites=true&w=majority
 *
 * To run this with the MongoDB Java Driver:
 * Dependency required: org.mongodb:mongodb-driver-sync:5.1.0
 */
public class MongoConnection {

    // Default connection URI (Reads from environment variable MONGODB_URI if set)
    private static final String DEFAULT_URI = "mongodb://localhost:27017";
    private static final String DEFAULT_DB_NAME = "payanam_junction";

    public static String getConnectionString() {
        String envUri = System.getenv("MONGODB_URI");
        if (envUri != null && !envUri.trim().isEmpty()) {
            return envUri;
        }
        return DEFAULT_URI;
    }

    public static String getDatabaseName() {
        String envDb = System.getenv("MONGODB_DATABASE");
        if (envDb != null && !envDb.trim().isEmpty()) {
            return envDb;
        }
        return DEFAULT_DB_NAME;
    }

    public static void main(String[] args) {
        System.out.println("==============================================================================");
        System.out.println("PAYANAM JUNCTION — MONGODB CONNECTION TEMPLATE");
        System.out.println("==============================================================================");
        System.out.println("Connection URI: " + getConnectionString());
        System.out.println("Target Database: " + getDatabaseName());
        System.out.println();
        System.out.println("How to connect with Java:");
        System.out.println("------------------------------------------------------------------------------");
        System.out.println("try (com.mongodb.client.MongoClient client = com.mongodb.client.MongoClients.create(getConnectionString())) {");
        System.out.println("    com.mongodb.client.MongoDatabase db = client.getDatabase(getDatabaseName());");
        System.out.println("    com.mongodb.client.MongoCollection<org.bson.Document> collection = db.getCollection(\"tracking_events\");");
        System.out.println("    // Insert document:");
        System.out.println("    org.bson.Document doc = new org.bson.Document(\"trainId\", \"P101\")");
        System.out.println("        .append(\"status\", \"ON_TIME\")");
        System.out.println("        .append(\"currentStation\", \"MDU\");");
        System.out.println("    collection.insertOne(doc);");
        System.out.println("    // Retrieve documents:");
        System.out.println("    for (org.bson.Document d : collection.find()) {");
        System.out.println("        System.out.println(d.toJson());");
        System.out.println("    }");
        System.out.println("}");
        System.out.println("==============================================================================");
    }
}
