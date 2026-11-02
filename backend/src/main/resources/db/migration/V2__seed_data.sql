-- V2__seed_data.sql: Development Seed Data for Payanam Junction — RailConnect

-- 1. Demo Users (BCrypt hashes: AdminSecurePass@2026 and Password@123)
INSERT INTO users (id, email, password_hash, full_name, role, phone) VALUES
(1, 'admin@railconnect.com', '$2a$10$7ZJkJWpT2W8v0c3x/9mQ2.5d3vR6eY1uP9qO8wI7yU6tS5rE4wQ2a', 'Chief Station Controller', 'ADMIN', '+919876543210'),
(2, 'passenger@railconnect.com', '$2a$10$Y1rV3wX5uP7sQ9tB2mD4e.8f6g0h2j4k6l8n0p2r4t6v8x0z2b4d', 'Karthik Subramanian', 'USER', '+919876543211')
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name);

-- 2. Stations
INSERT INTO stations (code, name, name_tamil, state, junction_type, platforms_count, lat, lng) VALUES
('MAS', 'Chennai Central', 'சென்னை சென்ட்ரல்', 'Tamil Nadu', 'Terminal & Headquarters Junction', 15, 13.0827, 80.2707),
('MS', 'Chennai Egmore', 'சென்னை எழும்பூர்', 'Tamil Nadu', 'Major Junction', 11, 13.0784, 80.2612),
('CBE', 'Coimbatore Junction', 'கோயம்புத்தூர் சந்திப்பு', 'Tamil Nadu', 'Major City Junction', 6, 11.0016, 76.9628),
('MDU', 'Madurai Junction', 'மதுரை சந்திப்பு', 'Tamil Nadu', 'Historic Heritage Junction', 8, 9.9195, 78.1100),
('TPJ', 'Tiruchirappalli Junction', 'திருச்சிராப்பள்ளி சந்திப்பு', 'Tamil Nadu', 'Central Regional Division Hub', 8, 10.7905, 78.6856),
('SA', 'Salem Junction', 'சேலம் சந்திப்பு', 'Tamil Nadu', 'Divisional Railway Hub', 6, 11.6643, 78.1460),
('SBC', 'KSR Bengaluru', 'பெங்களூரு நகரம்', 'Karnataka', 'Interstate Metropolitan Terminal', 10, 12.9781, 77.5695),
('TVC', 'Thiruvananthapuram Central', 'திருவனந்தபுரம் சென்ட்ரல்', 'Kerala', 'Capital Terminal Junction', 5, 8.4875, 76.9525),
('NDLS', 'New Delhi', 'புது தில்லி', 'Delhi', 'National Capital Terminal', 16, 28.6431, 77.2197),
('CSTM', 'Mumbai CSMT', 'மும்பை சி.எஸ்.எம்.டி', 'Maharashtra', 'UNESCO World Heritage Terminal', 18, 18.9401, 72.8356)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 3. Trains Network (Connecting all major corridors)
INSERT INTO trains (id, number, name, name_tamil, source_code, destination_code, departure_time, arrival_time, duration, train_length_meters) VALUES
('P101', '12638', 'Pandian Superfast Express', 'பாண்டியன் அதிவிரைவு வண்டி', 'MDU', 'MS', '21:35', '05:10', '7h 35m', 300),
('P102', '12637', 'Pandian Superfast Express', 'பாண்டியன் அதிவிரைவு வண்டி', 'MS', 'MDU', '21:40', '05:35', '7h 55m', 300),
('P103', '20601', 'Chennai Central - Madurai AC Superfast', 'சென்னை சென்ட்ரல் - மதுரை ஏசி அதிவிரைவு வண்டி', 'MAS', 'MDU', '22:30', '07:20', '8h 50m', 300),
('P104', '20602', 'Madurai - Chennai Central AC Superfast', 'மதுரை - சென்னை சென்ட்ரல் ஏசி அதிவிரைவு வண்டி', 'MDU', 'MAS', '22:45', '07:50', '9h 05m', 300),
('P201', '20607', 'Vande Bharat Express', 'வந்தே பாரத் எக்ஸ்பிரஸ்', 'MAS', 'SBC', '05:50', '10:20', '4h 30m', 250),
('P202', '20608', 'Vande Bharat Express', 'வந்தே பாரத் எக்ஸ்பிரஸ்', 'SBC', 'MAS', '14:50', '19:20', '4h 30m', 250),
('P203', '12607', 'Lalbagh Superfast Express', 'லால்பாக் அதிவிரைவு வண்டி', 'MAS', 'SBC', '15:30', '21:35', '6h 05m', 280),
('P204', '12608', 'Lalbagh Superfast Express', 'லால்பாக் அதிவிரைவு வண்டி', 'SBC', 'MAS', '06:30', '12:15', '5h 45m', 280),
('P301', '12675', 'Kovai Superfast Express', 'கோவை அதிவிரைவு வண்டி', 'MAS', 'CBE', '06:10', '14:05', '7h 55m', 280),
('P302', '12676', 'Kovai Superfast Express', 'கோவை அதிவிரைவு வண்டி', 'CBE', 'MAS', '15:15', '22:50', '7h 35m', 280),
('P303', '16617', 'Chemmozhi Express', 'செம்மொழி விரைவு வண்டி', 'CBE', 'MDU', '06:15', '10:30', '4h 15m', 260),
('P304', '16618', 'Chemmozhi Express', 'செம்மொழி விரைவு வண்டி', 'MDU', 'CBE', '16:30', '21:00', '4h 30m', 260),
('P401', '12635', 'Vaigai Superfast Express', 'வைகை அதிவிரைவு வண்டி', 'MS', 'MDU', '13:50', '21:30', '7h 40m', 320),
('P402', '12636', 'Vaigai Superfast Express', 'வைகை அதிவிரைவு வண்டி', 'MDU', 'MS', '07:10', '14:40', '7h 30m', 320),
('P501', '12653', 'Rockfort Superfast Express', 'மலைக்கோட்டை அதிவிரைவு வண்டி', 'MS', 'TPJ', '23:15', '05:05', '5h 50m', 300),
('P502', '12654', 'Rockfort Superfast Express', 'மலைக்கோட்டை அதிவிரைவு வண்டி', 'TPJ', 'MS', '22:45', '04:40', '5h 55m', 300),
('P503', '22675', 'Cholan Superfast Express', 'சோழன் அதிவிரைவு வண்டி', 'MS', 'TPJ', '07:15', '13:45', '6h 30m', 280),
('P504', '22676', 'Cholan Superfast Express', 'சோழன் அதிவிரைவு வண்டி', 'TPJ', 'MS', '10:15', '17:30', '7h 15m', 280),
('P601', '16843', 'Tiruchirappalli - Madurai Express', 'திருச்சிராப்பள்ளி - மதுரை விரைவு வண்டி', 'TPJ', 'MDU', '14:30', '16:45', '2h 15m', 260),
('P602', '16844', 'Madurai - Tiruchirappalli Express', 'மதுரை - திருச்சிராப்பள்ளி விரைவு வண்டி', 'MDU', 'TPJ', '09:15', '11:30', '2h 15m', 260),
('P701', '22637', 'West Coast Superfast Express', 'மேற்கு கடற்கரை அதிவிரைவு வண்டி', 'MAS', 'SA', '13:15', '18:30', '5h 15m', 300),
('P702', '22638', 'West Coast Superfast Express', 'மேற்கு கடற்கரை அதிவிரைவு வண்டி', 'SA', 'MAS', '06:00', '11:45', '5h 45m', 300),
('P703', '16353', 'Salem - Madurai Passenger Express', 'சேலம் - மதுரை பயணிகள் விரைவு வண்டி', 'SA', 'MDU', '19:15', '22:45', '3h 30m', 260),
('P704', '16354', 'Madurai - Salem Passenger Express', 'மதுரை - சேலம் பயணிகள் விரைவு வண்டி', 'MDU', 'SA', '05:30', '09:00', '3h 30m', 260),
('P801', '22665', 'Uday Express', 'உதய் டபுள் டெக்கர் எக்ஸ்பிரஸ்', 'SBC', 'CBE', '14:15', '21:00', '6h 45m', 280),
('P802', '22666', 'Uday Express', 'உதய் டபுள் டெக்கர் எக்ஸ்பிரஸ்', 'CBE', 'SBC', '05:45', '12:30', '6h 45m', 280),
('P803', '17235', 'Bengaluru - Madurai Express', 'பெங்களூரு - மதுரை விரைவு வண்டி', 'SBC', 'MDU', '07:30', '14:45', '7h 15m', 290),
('P804', '17236', 'Madurai - Bengaluru Express', 'மதுரை - பெங்களூரு விரைவு வண்டி', 'MDU', 'SBC', '15:30', '22:50', '7h 20m', 290),
('P901', '12623', 'Thiruvananthapuram Mail', 'திருவனந்தபுரம் மெயில்', 'MAS', 'TVC', '15:20', '06:50', '15h 30m', 320),
('P902', '12624', 'Thiruvananthapuram Mail', 'திருவனந்தபுரம் மெயில்', 'TVC', 'MAS', '17:15', '08:35', '15h 20m', 320),
('P903', '12615', 'Grand Trunk Superfast Express', 'கிராண்ட் டிரங்க் அதிவிரைவு வண்டி', 'MAS', 'NDLS', '22:00', '06:15', '32h 15m', 340),
('P904', '12616', 'Grand Trunk Superfast Express', 'கிராண்ட் டிரங்க் அதிவிரைவு வண்டி', 'NDLS', 'MAS', '22:30', '07:10', '32h 40m', 340),
('P905', '22158', 'Chennai - Mumbai CSMT Express', 'சென்னை - மும்பை சி.எஸ்.எம்.டி எக்ஸ்பிரஸ்', 'MAS', 'CSTM', '18:25', '13:30', '19h 05m', 320),
('P906', '22157', 'Mumbai CSMT - Chennai Express', 'மும்பை சி.எஸ்.எம்.டி - சென்னை எக்ஸ்பிரஸ்', 'CSTM', 'MAS', '14:00', '09:15', '19h 15m', 320)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 4. Train Classes (strictly 100-seat capacity limit per class)
INSERT INTO train_classes (train_id, class_type, class_name, class_name_tamil, fare, total_seats, available_seats, waiting_list_count) VALUES
('P101', '1A', 'AC First Class (1A)', 'ஏசி முதல் வகுப்பு', 2150.00, 100, 18, 0),
('P101', '2A', 'AC 2 Tier (2A)', 'ஏசி 2 அடுக்கு', 1350.00, 100, 32, 0),
('P101', '3A', 'AC 3 Tier (3A)', 'ஏசி 3 அடுக்கு', 960.00, 100, 6, 0),
('P101', 'SL', 'Sleeper Class (SL)', 'படுக்கை வசதி', 365.00, 100, 0, 3),

('P102', '1A', 'AC First Class (1A)', 'ஏசி முதல் வகுப்பு', 2150.00, 100, 20, 0),
('P102', '2A', 'AC 2 Tier (2A)', 'ஏசி 2 அடுக்கு', 1350.00, 100, 45, 0),
('P102', '3A', 'AC 3 Tier (3A)', 'ஏசி 3 அடுக்கு', 960.00, 100, 12, 0),
('P102', 'SL', 'Sleeper Class (SL)', 'படுக்கை வசதி', 365.00, 100, 5, 0),

('P103', '1A', 'AC First Class (1A)', 'ஏசி முதல் வகுப்பு', 2250.00, 100, 14, 0),
('P103', '2A', 'AC 2 Tier (2A)', 'ஏசி 2 அடுக்கு', 1420.00, 100, 28, 0),
('P103', '3A', 'AC 3 Tier (3A)', 'ஏசி 3 அடுக்கு', 1020.00, 100, 42, 0),

('P104', '1A', 'AC First Class (1A)', 'ஏசி முதல் வகுப்பு', 2250.00, 100, 16, 0),
('P104', '2A', 'AC 2 Tier (2A)', 'ஏசி 2 அடுக்கு', 1420.00, 100, 35, 0),
('P104', '3A', 'AC 3 Tier (3A)', 'ஏசி 3 அடுக்கு', 1020.00, 100, 50, 0),

('P201', 'EC', 'Executive Chair Car (EC)', 'நிர்வாக நாற்காலி கார்', 1880.00, 100, 14, 0),
('P201', 'CC', 'AC Chair Car (CC)', 'ஏசி நாற்காலி கார்', 995.00, 100, 28, 0),

('P202', 'EC', 'Executive Chair Car (EC)', 'நிர்வாக நாற்காலி கார்', 1880.00, 100, 16, 0),
('P202', 'CC', 'AC Chair Car (CC)', 'ஏசி நாற்காலி கார்', 995.00, 100, 34, 0),

('P301', 'CC', 'AC Chair Car (CC)', 'ஏசி நாற்காலி கார்', 710.00, 100, 39, 0),
('P301', '2A', 'AC 2 Tier (2A)', 'ஏசி 2 அடுக்கு', 1280.00, 100, 15, 0),
('P301', 'SL', 'Second Sitting / Sleeper', 'படுக்கை வசதி', 220.00, 100, 74, 0),

('P302', 'CC', 'AC Chair Car (CC)', 'ஏசி நாற்காலி கார்', 710.00, 100, 42, 0),
('P302', '2A', 'AC 2 Tier (2A)', 'ஏசி 2 அடுக்கு', 1280.00, 100, 18, 0),
('P302', 'SL', 'Second Sitting / Sleeper', 'படுக்கை வசதி', 220.00, 100, 60, 0),

('P303', '2A', 'AC 2 Tier (2A)', 'ஏசி 2 அடுக்கு', 820.00, 100, 20, 0),
('P303', '3A', 'AC 3 Tier (3A)', 'ஏசி 3 அடுக்கு', 580.00, 100, 35, 0),
('P303', 'SL', 'Sleeper Class (SL)', 'படுக்கை வசதி', 190.00, 100, 55, 0),

('P304', '2A', 'AC 2 Tier (2A)', 'ஏசி 2 அடுக்கு', 820.00, 100, 24, 0),
('P304', '3A', 'AC 3 Tier (3A)', 'ஏசி 3 அடுக்கு', 580.00, 100, 40, 0),
('P304', 'SL', 'Sleeper Class (SL)', 'படுக்கை வசதி', 190.00, 100, 62, 0),

('P401', 'CC', 'AC Chair Car (CC)', 'ஏசி நாற்காலி கார்', 650.00, 100, 22, 0),
('P401', '2S', 'Second Sitting (2S)', 'இரண்டாம் வகுப்பு அமரும் வசதி', 185.00, 100, 50, 0),

('P402', 'CC', 'AC Chair Car (CC)', 'ஏசி நாற்காலி கார்', 650.00, 100, 30, 0),
('P402', '2S', 'Second Sitting (2S)', 'இரண்டாம் வகுப்பு அமரும் வசதி', 185.00, 100, 65, 0),

('P501', '1A', 'AC First Class (1A)', 'ஏசி முதல் வகுப்பு', 1750.00, 100, 12, 0),
('P501', '2A', 'AC 2 Tier (2A)', 'ஏசி 2 அடுக்கு', 1080.00, 100, 28, 0),
('P501', '3A', 'AC 3 Tier (3A)', 'ஏசி 3 அடுக்கு', 760.00, 100, 45, 0),
('P501', 'SL', 'Sleeper Class (SL)', 'படுக்கை வசதி', 275.00, 100, 60, 0),

('P503', 'CC', 'AC Chair Car (CC)', 'ஏசி நாற்காலி கார்', 580.00, 100, 26, 0),
('P503', '2S', 'Second Sitting (2S)', 'இரண்டாம் வகுப்பு', 165.00, 100, 58, 0),

('P601', 'CC', 'AC Chair Car (CC)', 'ஏசி நாற்காலி கார்', 340.00, 100, 22, 0),
('P601', '2S', 'Second Sitting (2S)', 'இரண்டாம் வகுப்பு', 95.00, 100, 70, 0),

('P701', '2A', 'AC 2 Tier (2A)', 'ஏசி 2 அடுக்கு', 980.00, 100, 20, 0),
('P701', '3A', 'AC 3 Tier (3A)', 'ஏசி 3 அடுக்கு', 690.00, 100, 35, 0),
('P701', 'SL', 'Sleeper Class (SL)', 'படுக்கை வசதி', 240.00, 100, 65, 0),

('P703', '2S', 'Second Sitting (2S)', 'இரண்டாம் வகுப்பு', 120.00, 100, 60, 0),
('P703', 'SL', 'Sleeper Class (SL)', 'படுக்கை வசதி', 160.00, 100, 45, 0),

('P801', 'CC', 'AC Chair Car (CC)', 'ஏசி நாற்காலி கார்', 610.00, 100, 34, 0),
('P801', '2S', 'Second Sitting (2S)', 'இரண்டாம் வகுப்பு', 180.00, 100, 60, 0),

('P803', '2A', 'AC 2 Tier (2A)', 'ஏசி 2 அடுக்கு', 1150.00, 100, 22, 0),
('P803', '3A', 'AC 3 Tier (3A)', 'ஏசி 3 அடுக்கு', 810.00, 100, 38, 0),
('P803', 'SL', 'Sleeper Class (SL)', 'படுக்கை வசதி', 280.00, 100, 52, 0),

('P901', '1A', 'AC First Class (1A)', 'ஏசி முதல் வகுப்பு', 2850.00, 100, 10, 0),
('P901', '2A', 'AC 2 Tier (2A)', 'ஏசி 2 அடுக்கு', 1720.00, 100, 25, 0),
('P901', '3A', 'AC 3 Tier (3A)', 'ஏசி 3 அடுக்கு', 1210.00, 100, 35, 0),
('P901', 'SL', 'Sleeper Class (SL)', 'படுக்கை வசதி', 445.00, 100, 55, 0),

('P903', '1A', 'AC First Class (1A)', 'ஏசி முதல் வகுப்பு', 4200.00, 100, 8, 0),
('P903', '2A', 'AC 2 Tier (2A)', 'ஏசி 2 அடுக்கு', 2650.00, 100, 20, 0),
('P903', '3A', 'AC 3 Tier (3A)', 'ஏசி 3 அடுக்கு', 1850.00, 100, 35, 0),
('P903', 'SL', 'Sleeper Class (SL)', 'படுக்கை வசதி', 710.00, 100, 45, 0),

('P905', '2A', 'AC 2 Tier (2A)', 'ஏசி 2 அடுக்கு', 2250.00, 100, 16, 0),
('P905', '3A', 'AC 3 Tier (3A)', 'ஏசி 3 அடுக்கு', 1550.00, 100, 30, 0),
('P905', 'SL', 'Sleeper Class (SL)', 'படுக்கை வசதி', 590.00, 100, 52, 0)
ON DUPLICATE KEY UPDATE fare=VALUES(fare);

-- 5. Platforms (P1: 250m, P2: 300m, P3: 400m)
INSERT INTO platforms (platform_id, length_meters, occupied, current_train_id, current_train_name, arrival_time, release_time) VALUES
(1, 250, FALSE, NULL, NULL, NULL, NULL),
(2, 300, FALSE, NULL, NULL, NULL, NULL),
(3, 400, FALSE, NULL, NULL, NULL, NULL)
ON DUPLICATE KEY UPDATE length_meters=VALUES(length_meters);
