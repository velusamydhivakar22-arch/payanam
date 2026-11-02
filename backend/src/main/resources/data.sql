-- Initial Seed Data for Payanam Junction — RailConnect

-- Stations
INSERT INTO stations (code, name, name_tamil, state, junction_type, platforms_count) VALUES
('MAS', 'Chennai Central', 'சென்னை சென்ட்ரல்', 'Tamil Nadu', 'Terminal & Headquarters Junction', 15),
('MS', 'Chennai Egmore', 'சென்னை எழும்பூர்', 'Tamil Nadu', 'Major Junction', 11),
('CBE', 'Coimbatore Junction', 'கோயம்புத்தூர் சந்திப்பு', 'Tamil Nadu', 'Major City Junction', 6),
('MDU', 'Madurai Junction', 'மதுரை சந்திப்பு', 'Tamil Nadu', 'Historic Heritage Junction', 8),
('TPJ', 'Tiruchirappalli Junction', 'திருச்சிராப்பள்ளி சந்திப்பு', 'Tamil Nadu', 'Central Regional Division Hub', 8),
('SA', 'Salem Junction', 'சேலம் சந்திப்பு', 'Tamil Nadu', 'Divisional Railway Hub', 6),
('SBC', 'KSR Bengaluru', 'பெங்களூரு நகரம்', 'Karnataka', 'Interstate Metropolitan Terminal', 10),
('TVC', 'Thiruvananthapuram Central', 'திருவனந்தபுரம் சென்ட்ரல்', 'Kerala', 'Capital Terminal Junction', 5),
('NDLS', 'New Delhi', 'புது தில்லி', 'Delhi', 'National Capital Terminal', 16),
('CSTM', 'Mumbai CSMT', 'மும்பை சி.எஸ்.எம்.டி', 'Maharashtra', 'UNESCO World Heritage Terminal', 18)
ON DUPLICATE KEY UPDATE name=name;

-- Trains
INSERT INTO trains (id, number, name, name_tamil, source_code, destination_code, departure_time, arrival_time, duration, train_length_meters) VALUES
('P101', '12638', 'Pandian Superfast Express', 'பாண்டியன் அதிவிரைவு வண்டி', 'MDU', 'MS', '21:35', '05:10', '7h 35m', 300),
('P102', '12637', 'Pandian Superfast Express', 'பாண்டியன் அதிவிரைவு வண்டி', 'MS', 'MDU', '21:40', '05:35', '7h 55m', 300),
('P201', '20607', 'Vande Bharat Express', 'வந்தே பாரத் எக்ஸ்பிரஸ்', 'MAS', 'SBC', '05:50', '10:20', '4h 30m', 250),
('P202', '20608', 'Vande Bharat Express', 'வந்தே பாரத் எக்ஸ்பிரஸ்', 'SBC', 'MAS', '14:50', '19:20', '4h 30m', 250),
('P301', '12675', 'Kovai Superfast Express', 'கோவை அதிவிரைவு வண்டி', 'MAS', 'CBE', '06:10', '14:05', '7h 55m', 280),
('P302', '12676', 'Kovai Superfast Express', 'கோவை அதிவிரைவு வண்டி', 'CBE', 'MAS', '15:15', '22:50', '7h 35m', 280),
('P401', '12635', 'Vaigai Superfast Express', 'வைகை அதிவிரைவு வண்டி', 'MS', 'MDU', '13:50', '21:30', '7h 40m', 320),
('P402', '12636', 'Vaigai Superfast Express', 'வைகை அதிவிரைவு வண்டி', 'MDU', 'MS', '07:10', '14:40', '7h 30m', 320)
ON DUPLICATE KEY UPDATE name=name;

-- Train Classes (strictly 100 seats per class capacity rule)
INSERT INTO train_classes (train_id, class_type, class_name, class_name_tamil, fare, total_seats, available_seats, waiting_list_count) VALUES
('P101', '1A', 'AC First Class (1A)', 'ஏசி முதல் வகுப்பு', 2150.00, 100, 18, 0),
('P101', '2A', 'AC 2 Tier (2A)', 'ஏசி 2 அடுக்கு', 1350.00, 100, 32, 0),
('P101', '3A', 'AC 3 Tier (3A)', 'ஏசி 3 அடுக்கு', 960.00, 100, 6, 0),
('P101', 'SL', 'Sleeper Class (SL)', 'படுக்கை வசதி', 365.00, 100, 0, 3),

('P201', 'EC', 'Executive Chair Car (EC)', 'நிர்வாக நாற்காலி கார்', 1880.00, 100, 14, 0),
('P201', 'CC', 'AC Chair Car (CC)', 'ஏசி நாற்காலி கார்', 995.00, 100, 28, 0),

('P301', 'CC', 'AC Chair Car (CC)', 'ஏசி நாற்காலி கார்', 710.00, 100, 39, 0),
('P301', '2A', 'AC 2 Tier (2A)', 'ஏசி 2 அடுக்கு', 1280.00, 100, 15, 0),
('P301', 'SL', 'Second Sitting / Sleeper', 'படுக்கை வசதி', 220.00, 100, 74, 0)
ON DUPLICATE KEY UPDATE fare=fare;

-- Platforms (Platform 1: 250m, Platform 2: 300m, Platform 3: 400m)
INSERT INTO platforms (platform_id, length_meters, occupied, current_train_id, current_train_name, arrival_time, release_time) VALUES
(1, 250, FALSE, NULL, NULL, NULL, NULL),
(2, 300, FALSE, NULL, NULL, NULL, NULL),
(3, 400, FALSE, NULL, NULL, NULL, NULL)
ON DUPLICATE KEY UPDATE length_meters=length_meters;
