package com.payanam.railconnect.config;

import com.payanam.railconnect.entity.*;
import com.payanam.railconnect.model.UserRole;
import com.payanam.railconnect.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final StationRepository stationRepository;
    private final TrainRepository trainRepository;
    private final PlatformRepository platformRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            StationRepository stationRepository,
            TrainRepository trainRepository,
            PlatformRepository platformRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        this.stationRepository = stationRepository;
        this.trainRepository = trainRepository;
        this.platformRepository = platformRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedUsers();
        seedStations();
        seedPlatforms();
        seedTrains();
    }

    private void seedUsers() {
        if (!userRepository.existsByEmail("admin@railconnect.in")) {
            UserEntity admin = new UserEntity(
                    "admin@railconnect.in",
                    passwordEncoder.encode("Admin@123"),
                    "System Administrator",
                    UserRole.ADMIN
            );
            admin.setPhone("9840199999");
            userRepository.save(admin);
        }

        if (!userRepository.existsByEmail("passenger@railconnect.in")) {
            UserEntity user = new UserEntity(
                    "passenger@railconnect.in",
                    passwordEncoder.encode("Passenger@123"),
                    "Karthik Velu",
                    UserRole.USER
            );
            user.setPhone("9840123456");
            userRepository.save(user);
        }
    }

    private void seedStations() {
        if (stationRepository.count() == 0) {
            List<StationEntity> stations = List.of(
                    new StationEntity("MAS", "Chennai Central", "சென்னை சென்ட்ரல்", "Tamil Nadu", "Terminal & Headquarters Junction", 15),
                    new StationEntity("MS", "Chennai Egmore", "சென்னை எழும்பூர்", "Tamil Nadu", "Major Junction", 11),
                    new StationEntity("CBE", "Coimbatore Junction", "கோயம்புத்தூர் சந்திப்பு", "Tamil Nadu", "Major City Junction", 6),
                    new StationEntity("MDU", "Madurai Junction", "மதுரை சந்திப்பு", "Tamil Nadu", "Historic Heritage Junction", 8),
                    new StationEntity("TPJ", "Tiruchirappalli Junction", "திருச்சிராப்பள்ளி சந்திப்பு", "Tamil Nadu", "Central Regional Division Hub", 8),
                    new StationEntity("SA", "Salem Junction", "சேலம் சந்திப்பு", "Tamil Nadu", "Divisional Railway Hub", 6),
                    new StationEntity("SBC", "KSR Bengaluru", "பெங்களூரு நகரம்", "Karnataka", "Interstate Metropolitan Terminal", 10),
                    new StationEntity("TVC", "Thiruvananthapuram Central", "திருவனந்தபுரம் சென்ட்ரல்", "Kerala", "Capital Terminal Junction", 5),
                    new StationEntity("NDLS", "New Delhi", "புது தில்லி", "Delhi", "National Capital Terminal", 16),
                    new StationEntity("CSTM", "Mumbai CSMT", "மும்பை சி.எஸ்.எம்.டி", "Maharashtra", "UNESCO World Heritage Terminal", 18)
            );
            stationRepository.saveAll(stations);
        }
    }

    private void seedPlatforms() {
        if (platformRepository.count() == 0) {
            List<PlatformEntity> platforms = List.of(
                    new PlatformEntity(1, 250),
                    new PlatformEntity(2, 300),
                    new PlatformEntity(3, 400)
            );
            platformRepository.saveAll(platforms);
        }
    }

    private void seedTrains() {
        // Seed each train if not already present by ID
        seedSingleTrain("P101", "12638", "Pandian Superfast Express", "பாண்டியன் அதிவிரைவு வண்டி", "MDU", "MS", "21:35", "05:10", "7h 35m", 300,
                List.of(new ClassSpec("1A", "AC First Class (1A)", "ஏசி முதல் வகுப்பு", new BigDecimal("2150.00"), 18),
                        new ClassSpec("2A", "AC 2 Tier (2A)", "ஏசி 2 அடுக்கு", new BigDecimal("1350.00"), 32),
                        new ClassSpec("3A", "AC 3 Tier (3A)", "ஏசி 3 அடுக்கு", new BigDecimal("960.00"), 6),
                        new ClassSpec("SL", "Sleeper Class (SL)", "படுக்கை வசதி", new BigDecimal("365.00"), 0)));

        seedSingleTrain("P102", "12637", "Pandian Superfast Express", "பாண்டியன் அதிவிரைவு வண்டி", "MS", "MDU", "21:40", "05:35", "7h 55m", 300,
                List.of(new ClassSpec("1A", "AC First Class (1A)", "ஏசி முதல் வகுப்பு", new BigDecimal("2150.00"), 20),
                        new ClassSpec("2A", "AC 2 Tier (2A)", "ஏசி 2 அடுக்கு", new BigDecimal("1350.00"), 45),
                        new ClassSpec("3A", "AC 3 Tier (3A)", "ஏசி 3 அடுக்கு", new BigDecimal("960.00"), 12),
                        new ClassSpec("SL", "Sleeper Class (SL)", "படுக்கை வசதி", new BigDecimal("365.00"), 5)));

        // Direct MAS <-> MDU AC Superfast (Train 20601 / 20602)
        seedSingleTrain("P103", "20601", "Chennai Central - Madurai AC Superfast", "சென்னை சென்ட்ரல் - மதுரை ஏசி அதிவிரைவு வண்டி", "MAS", "MDU", "22:30", "07:20", "8h 50m", 300,
                List.of(new ClassSpec("1A", "AC First Class (1A)", "ஏசி முதல் வகுப்பு", new BigDecimal("2250.00"), 14),
                        new ClassSpec("2A", "AC 2 Tier (2A)", "ஏசி 2 அடுக்கு", new BigDecimal("1420.00"), 28),
                        new ClassSpec("3A", "AC 3 Tier (3A)", "ஏசி 3 அடுக்கு", new BigDecimal("1020.00"), 42)));

        seedSingleTrain("P104", "20602", "Madurai - Chennai Central AC Superfast", "மதுரை - சென்னை சென்ட்ரல் ஏசி அதிவிரைவு வண்டி", "MDU", "MAS", "22:45", "07:50", "9h 05m", 300,
                List.of(new ClassSpec("1A", "AC First Class (1A)", "ஏசி முதல் வகுப்பு", new BigDecimal("2250.00"), 16),
                        new ClassSpec("2A", "AC 2 Tier (2A)", "ஏசி 2 அடுக்கு", new BigDecimal("1420.00"), 35),
                        new ClassSpec("3A", "AC 3 Tier (3A)", "ஏசி 3 அடுக்கு", new BigDecimal("1020.00"), 50)));

        seedSingleTrain("P201", "20607", "Vande Bharat Express", "வந்தே பாரத் எக்ஸ்பிரஸ்", "MAS", "SBC", "05:50", "10:20", "4h 30m", 250,
                List.of(new ClassSpec("EC", "Executive Chair Car (EC)", "நிர்வாக நாற்காலி கார்", new BigDecimal("1880.00"), 14),
                        new ClassSpec("CC", "AC Chair Car (CC)", "ஏசி நாற்காலி கார்", new BigDecimal("995.00"), 28)));

        seedSingleTrain("P202", "20608", "Vande Bharat Express", "வந்தே பாரத் எக்ஸ்பிரஸ்", "SBC", "MAS", "14:50", "19:20", "4h 30m", 250,
                List.of(new ClassSpec("EC", "Executive Chair Car (EC)", "நிர்வாக நாற்காலி கார்", new BigDecimal("1880.00"), 16),
                        new ClassSpec("CC", "AC Chair Car (CC)", "ஏசி நாற்காலி கார்", new BigDecimal("995.00"), 34)));

        seedSingleTrain("P203", "12607", "Lalbagh Superfast Express", "லால்பாக் அதிவிரைவு வண்டி", "MAS", "SBC", "15:30", "21:35", "6h 05m", 280,
                List.of(new ClassSpec("CC", "AC Chair Car (CC)", "ஏசி நாற்காலி கார்", new BigDecimal("650.00"), 30),
                        new ClassSpec("2S", "Second Sitting (2S)", "இரண்டாம் வகுப்பு", new BigDecimal("170.00"), 65)));

        seedSingleTrain("P204", "12608", "Lalbagh Superfast Express", "லால்பாக் அதிவிரைவு வண்டி", "SBC", "MAS", "06:30", "12:15", "5h 45m", 280,
                List.of(new ClassSpec("CC", "AC Chair Car (CC)", "ஏசி நாற்காலி கார்", new BigDecimal("650.00"), 25),
                        new ClassSpec("2S", "Second Sitting (2S)", "இரண்டாம் வகுப்பு", new BigDecimal("170.00"), 55)));

        seedSingleTrain("P301", "12675", "Kovai Superfast Express", "கோவை அதிவிரைவு வண்டி", "MAS", "CBE", "06:10", "14:05", "7h 55m", 280,
                List.of(new ClassSpec("CC", "AC Chair Car (CC)", "ஏசி நாற்காலி கார்", new BigDecimal("710.00"), 39),
                        new ClassSpec("2A", "AC 2 Tier (2A)", "ஏசி 2 அடுக்கு", new BigDecimal("1280.00"), 15),
                        new ClassSpec("SL", "Second Sitting / Sleeper", "படுக்கை வசதி", new BigDecimal("220.00"), 74)));

        seedSingleTrain("P302", "12676", "Kovai Superfast Express", "கோவை அதிவிரைவு வண்டி", "CBE", "MAS", "15:15", "22:50", "7h 35m", 280,
                List.of(new ClassSpec("CC", "AC Chair Car (CC)", "ஏசி நாற்காலி கார்", new BigDecimal("710.00"), 42),
                        new ClassSpec("2A", "AC 2 Tier (2A)", "ஏசி 2 அடுக்கு", new BigDecimal("1280.00"), 18),
                        new ClassSpec("SL", "Second Sitting / Sleeper", "படுக்கை வசதி", new BigDecimal("220.00"), 60)));

        seedSingleTrain("P303", "16617", "Chemmozhi Express", "செம்மொழி விரைவு வண்டி", "CBE", "MDU", "06:15", "10:30", "4h 15m", 260,
                List.of(new ClassSpec("2A", "AC 2 Tier (2A)", "ஏசி 2 அடுக்கு", new BigDecimal("820.00"), 20),
                        new ClassSpec("3A", "AC 3 Tier (3A)", "ஏசி 3 அடுக்கு", new BigDecimal("580.00"), 35),
                        new ClassSpec("SL", "Sleeper Class (SL)", "படுக்கை வசதி", new BigDecimal("190.00"), 55)));

        seedSingleTrain("P304", "16618", "Chemmozhi Express", "செம்மொழி விரைவு வண்டி", "MDU", "CBE", "16:30", "21:00", "4h 30m", 260,
                List.of(new ClassSpec("2A", "AC 2 Tier (2A)", "ஏசி 2 அடுக்கு", new BigDecimal("820.00"), 24),
                        new ClassSpec("3A", "AC 3 Tier (3A)", "ஏசி 3 அடுக்கு", new BigDecimal("580.00"), 40),
                        new ClassSpec("SL", "Sleeper Class (SL)", "படுக்கை வசதி", new BigDecimal("190.00"), 62)));

        seedSingleTrain("P401", "12635", "Vaigai Superfast Express", "வைகை அதிவிரைவு வண்டி", "MS", "MDU", "13:50", "21:30", "7h 40m", 320,
                List.of(new ClassSpec("CC", "AC Chair Car (CC)", "ஏசி நாற்காலி கார்", new BigDecimal("650.00"), 22),
                        new ClassSpec("2S", "Second Sitting (2S)", "இரண்டாம் வகுப்பு அமரும் வசதி", new BigDecimal("185.00"), 50)));

        seedSingleTrain("P402", "12636", "Vaigai Superfast Express", "வைகை அதிவிரைவு வண்டி", "MDU", "MS", "07:10", "14:40", "7h 30m", 320,
                List.of(new ClassSpec("CC", "AC Chair Car (CC)", "ஏசி நாற்காலி கார்", new BigDecimal("650.00"), 30),
                        new ClassSpec("2S", "Second Sitting (2S)", "இரண்டாம் வகுப்பு அமரும் வசதி", new BigDecimal("185.00"), 65)));

        seedSingleTrain("P501", "12653", "Rockfort Superfast Express", "மலைக்கோட்டை அதிவிரைவு வண்டி", "MS", "TPJ", "23:15", "05:05", "5h 50m", 300,
                List.of(new ClassSpec("1A", "AC First Class (1A)", "ஏசி முதல் வகுப்பு", new BigDecimal("1750.00"), 12),
                        new ClassSpec("2A", "AC 2 Tier (2A)", "ஏசி 2 அடுக்கு", new BigDecimal("1080.00"), 28),
                        new ClassSpec("3A", "AC 3 Tier (3A)", "ஏசி 3 அடுக்கு", new BigDecimal("760.00"), 45),
                        new ClassSpec("SL", "Sleeper Class (SL)", "படுக்கை வசதி", new BigDecimal("275.00"), 60)));

        seedSingleTrain("P502", "12654", "Rockfort Superfast Express", "மலைக்கோட்டை அதிவிரைவு வண்டி", "TPJ", "MS", "22:45", "04:40", "5h 55m", 300,
                List.of(new ClassSpec("1A", "AC First Class (1A)", "ஏசி முதல் வகுப்பு", new BigDecimal("1750.00"), 15),
                        new ClassSpec("2A", "AC 2 Tier (2A)", "ஏசி 2 அடுக்கு", new BigDecimal("1080.00"), 32),
                        new ClassSpec("3A", "AC 3 Tier (3A)", "ஏசி 3 அடுக்கு", new BigDecimal("760.00"), 40),
                        new ClassSpec("SL", "Sleeper Class (SL)", "படுக்கை வசதி", new BigDecimal("275.00"), 55)));

        seedSingleTrain("P503", "22675", "Cholan Superfast Express", "சோழன் அதிவிரைவு வண்டி", "MS", "TPJ", "07:15", "13:45", "6h 30m", 280,
                List.of(new ClassSpec("CC", "AC Chair Car (CC)", "ஏசி நாற்காலி கார்", new BigDecimal("580.00"), 26),
                        new ClassSpec("2S", "Second Sitting (2S)", "இரண்டாம் வகுப்பு", new BigDecimal("165.00"), 58)));

        seedSingleTrain("P504", "22676", "Cholan Superfast Express", "சோழன் அதிவிரைவு வண்டி", "TPJ", "MS", "10:15", "17:30", "7h 15m", 280,
                List.of(new ClassSpec("CC", "AC Chair Car (CC)", "ஏசி நாற்காலி கார்", new BigDecimal("580.00"), 30),
                        new ClassSpec("2S", "Second Sitting (2S)", "இரண்டாம் வகுப்பு", new BigDecimal("165.00"), 60)));

        seedSingleTrain("P601", "16843", "Tiruchirappalli - Madurai Express", "திருச்சிராப்பள்ளி - மதுரை விரைவு வண்டி", "TPJ", "MDU", "14:30", "16:45", "2h 15m", 260,
                List.of(new ClassSpec("CC", "AC Chair Car (CC)", "ஏசி நாற்காலி கார்", new BigDecimal("340.00"), 22),
                        new ClassSpec("2S", "Second Sitting (2S)", "இரண்டாம் வகுப்பு", new BigDecimal("95.00"), 70)));

        seedSingleTrain("P602", "16844", "Madurai - Tiruchirappalli Express", "மதுரை - திருச்சிராப்பள்ளி விரைவு வண்டி", "MDU", "TPJ", "09:15", "11:30", "2h 15m", 260,
                List.of(new ClassSpec("CC", "AC Chair Car (CC)", "ஏசி நாற்காலி கார்", new BigDecimal("340.00"), 25),
                        new ClassSpec("2S", "Second Sitting (2S)", "இரண்டாம் வகுப்பு", new BigDecimal("95.00"), 65)));

        seedSingleTrain("P701", "22637", "West Coast Superfast Express", "மேற்கு கடற்கரை அதிவிரைவு வண்டி", "MAS", "SA", "13:15", "18:30", "5h 15m", 300,
                List.of(new ClassSpec("2A", "AC 2 Tier (2A)", "ஏசி 2 அடுக்கு", new BigDecimal("980.00"), 20),
                        new ClassSpec("3A", "AC 3 Tier (3A)", "ஏசி 3 அடுக்கு", new BigDecimal("690.00"), 35),
                        new ClassSpec("SL", "Sleeper Class (SL)", "படுக்கை வசதி", new BigDecimal("240.00"), 65)));

        seedSingleTrain("P702", "22638", "West Coast Superfast Express", "மேற்கு கடற்கரை அதிவிரைவு வண்டி", "SA", "MAS", "06:00", "11:45", "5h 45m", 300,
                List.of(new ClassSpec("2A", "AC 2 Tier (2A)", "ஏசி 2 அடுக்கு", new BigDecimal("980.00"), 18),
                        new ClassSpec("3A", "AC 3 Tier (3A)", "ஏசி 3 அடுக்கு", new BigDecimal("690.00"), 30),
                        new ClassSpec("SL", "Sleeper Class (SL)", "படுக்கை வசதி", new BigDecimal("240.00"), 58)));

        seedSingleTrain("P703", "16353", "Salem - Madurai Passenger Express", "சேலம் - மதுரை பயணிகள் விரைவு வண்டி", "SA", "MDU", "19:15", "22:45", "3h 30m", 260,
                List.of(new ClassSpec("2S", "Second Sitting (2S)", "இரண்டாம் வகுப்பு", new BigDecimal("120.00"), 60),
                        new ClassSpec("SL", "Sleeper Class (SL)", "படுக்கை வசதி", new BigDecimal("160.00"), 45)));

        seedSingleTrain("P704", "16354", "Madurai - Salem Passenger Express", "மதுரை - சேலம் பயணிகள் விரைவு வண்டி", "MDU", "SA", "05:30", "09:00", "3h 30m", 260,
                List.of(new ClassSpec("2S", "Second Sitting (2S)", "இரண்டாம் வகுப்பு", new BigDecimal("120.00"), 55),
                        new ClassSpec("SL", "Sleeper Class (SL)", "படுக்கை வசதி", new BigDecimal("160.00"), 50)));

        seedSingleTrain("P801", "22665", "Uday Express", "உதய் டபுள் டெக்கர் எக்ஸ்பிரஸ்", "SBC", "CBE", "14:15", "21:00", "6h 45m", 280,
                List.of(new ClassSpec("CC", "AC Chair Car (CC)", "ஏசி நாற்காலி கார்", new BigDecimal("610.00"), 34),
                        new ClassSpec("2S", "Second Sitting (2S)", "இரண்டாம் வகுப்பு", new BigDecimal("180.00"), 60)));

        seedSingleTrain("P802", "22666", "Uday Express", "உதய் டபுள் டெக்கர் எக்ஸ்பிரஸ்", "CBE", "SBC", "05:45", "12:30", "6h 45m", 280,
                List.of(new ClassSpec("CC", "AC Chair Car (CC)", "ஏசி நாற்காலி கார்", new BigDecimal("610.00"), 30),
                        new ClassSpec("2S", "Second Sitting (2S)", "இரண்டாம் வகுப்பு", new BigDecimal("180.00"), 58)));

        seedSingleTrain("P803", "17235", "Bengaluru - Madurai Express", "பெங்களூரு - மதுரை விரைவு வண்டி", "SBC", "MDU", "07:30", "14:45", "7h 15m", 290,
                List.of(new ClassSpec("2A", "AC 2 Tier (2A)", "ஏசி 2 அடுக்கு", new BigDecimal("1150.00"), 22),
                        new ClassSpec("3A", "AC 3 Tier (3A)", "ஏசி 3 அடுக்கு", new BigDecimal("810.00"), 38),
                        new ClassSpec("SL", "Sleeper Class (SL)", "படுக்கை வசதி", new BigDecimal("280.00"), 52)));

        seedSingleTrain("P804", "17236", "Madurai - Bengaluru Express", "மதுரை - பெங்களூரு விரைவு வண்டி", "MDU", "SBC", "15:30", "22:50", "7h 20m", 290,
                List.of(new ClassSpec("2A", "AC 2 Tier (2A)", "ஏசி 2 அடுக்கு", new BigDecimal("1150.00"), 20),
                        new ClassSpec("3A", "AC 3 Tier (3A)", "ஏசி 3 அடுக்கு", new BigDecimal("810.00"), 35),
                        new ClassSpec("SL", "Sleeper Class (SL)", "படுக்கை வசதி", new BigDecimal("280.00"), 48)));

        seedSingleTrain("P901", "12623", "Thiruvananthapuram Mail", "திருவனந்தபுரம் மெயில்", "MAS", "TVC", "15:20", "06:50", "15h 30m", 320,
                List.of(new ClassSpec("1A", "AC First Class (1A)", "ஏசி முதல் வகுப்பு", new BigDecimal("2850.00"), 10),
                        new ClassSpec("2A", "AC 2 Tier (2A)", "ஏசி 2 அடுக்கு", new BigDecimal("1720.00"), 25),
                        new ClassSpec("3A", "AC 3 Tier (3A)", "ஏசி 3 அடுக்கு", new BigDecimal("1210.00"), 35),
                        new ClassSpec("SL", "Sleeper Class (SL)", "படுக்கை வசதி", new BigDecimal("445.00"), 55)));

        seedSingleTrain("P902", "12624", "Thiruvananthapuram Mail", "திருவனந்தபுரம் மெயில்", "TVC", "MAS", "17:15", "08:35", "15h 20m", 320,
                List.of(new ClassSpec("1A", "AC First Class (1A)", "ஏசி முதல் வகுப்பு", new BigDecimal("2850.00"), 12),
                        new ClassSpec("2A", "AC 2 Tier (2A)", "ஏசி 2 அடுக்கு", new BigDecimal("1720.00"), 22),
                        new ClassSpec("3A", "AC 3 Tier (3A)", "ஏசி 3 அடுக்கு", new BigDecimal("1210.00"), 40),
                        new ClassSpec("SL", "Sleeper Class (SL)", "படுக்கை வசதி", new BigDecimal("445.00"), 60)));

        seedSingleTrain("P903", "12615", "Grand Trunk Superfast Express", "கிராண்ட் டிரங்க் அதிவிரைவு வண்டி", "MAS", "NDLS", "22:00", "06:15", "32h 15m", 340,
                List.of(new ClassSpec("1A", "AC First Class (1A)", "ஏசி முதல் வகுப்பு", new BigDecimal("4200.00"), 8),
                        new ClassSpec("2A", "AC 2 Tier (2A)", "ஏசி 2 அடுக்கு", new BigDecimal("2650.00"), 20),
                        new ClassSpec("3A", "AC 3 Tier (3A)", "ஏசி 3 அடுக்கு", new BigDecimal("1850.00"), 35),
                        new ClassSpec("SL", "Sleeper Class (SL)", "படுக்கை வசதி", new BigDecimal("710.00"), 45)));

        seedSingleTrain("P904", "12616", "Grand Trunk Superfast Express", "கிராண்ட் டிரங்க் அதிவிரைவு வண்டி", "NDLS", "MAS", "22:30", "07:10", "32h 40m", 340,
                List.of(new ClassSpec("1A", "AC First Class (1A)", "ஏசி முதல் வகுப்பு", new BigDecimal("4200.00"), 10),
                        new ClassSpec("2A", "AC 2 Tier (2A)", "ஏசி 2 அடுக்கு", new BigDecimal("2650.00"), 18),
                        new ClassSpec("3A", "AC 3 Tier (3A)", "ஏசி 3 அடுக்கு", new BigDecimal("1850.00"), 30),
                        new ClassSpec("SL", "Sleeper Class (SL)", "படுக்கை வசதி", new BigDecimal("710.00"), 50)));

        seedSingleTrain("P905", "22158", "Chennai - Mumbai CSMT Express", "சென்னை - மும்பை சி.எஸ்.எம்.டி எக்ஸ்பிரஸ்", "MAS", "CSTM", "18:25", "13:30", "19h 05m", 320,
                List.of(new ClassSpec("2A", "AC 2 Tier (2A)", "ஏசி 2 அடுக்கு", new BigDecimal("2250.00"), 16),
                        new ClassSpec("3A", "AC 3 Tier (3A)", "ஏசி 3 அடுக்கு", new BigDecimal("1550.00"), 30),
                        new ClassSpec("SL", "Sleeper Class (SL)", "படுக்கை வசதி", new BigDecimal("590.00"), 52)));

        seedSingleTrain("P906", "22157", "Mumbai CSMT - Chennai Express", "மும்பை சி.எஸ்.எம்.டி - சென்னை எக்ஸ்பிரஸ்", "CSTM", "MAS", "14:00", "09:15", "19h 15m", 320,
                List.of(new ClassSpec("2A", "AC 2 Tier (2A)", "ஏசி 2 அடுக்கு", new BigDecimal("2250.00"), 14),
                        new ClassSpec("3A", "AC 3 Tier (3A)", "ஏசி 3 அடுக்கு", new BigDecimal("1550.00"), 28),
                        new ClassSpec("SL", "Sleeper Class (SL)", "படுக்கை வசதி", new BigDecimal("590.00"), 48)));
    }

    private record ClassSpec(String type, String name, String nameTa, BigDecimal fare, int available) {}

    private void seedSingleTrain(String id, String number, String name, String nameTa, String src, String dest, String dep, String arr, String dur, int len, List<ClassSpec> classes) {
        if (!trainRepository.existsById(id)) {
            TrainEntity train = new TrainEntity(id, number, name, nameTa, src, dest, dep, arr, dur, len);
            for (ClassSpec cs : classes) {
                addClass(train, cs.type(), cs.name(), cs.nameTa(), cs.fare(), cs.available());
            }
            trainRepository.save(train);
        }
    }

    private void addClass(TrainEntity train, String type, String name, String nameTa, BigDecimal fare, int available) {
        TrainClassEntity tc = new TrainClassEntity();
        tc.setTrain(train);
        tc.setClassType(type);
        tc.setClassName(name);
        tc.setClassNameTamil(nameTa);
        tc.setFare(fare);
        tc.setTotalSeats(100); // 100 seats limit per class rule
        tc.setAvailableSeats(available);
        tc.setWaitingListCount(available == 0 ? 3 : 0);
        train.getClasses().add(tc);
    }
}
