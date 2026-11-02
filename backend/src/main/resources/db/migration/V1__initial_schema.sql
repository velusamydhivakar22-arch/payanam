-- V1__initial_schema.sql: Payanam Junction — RailConnect Normalized Database Schema

-- 1. Users & Authentication
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Stations
CREATE TABLE IF NOT EXISTS stations (
    code VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    name_tamil VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    junction_type VARCHAR(100),
    platforms_count INT DEFAULT 4,
    lat DECIMAL(10, 6) DEFAULT 13.082700,
    lng DECIMAL(10, 6) DEFAULT 80.270700
);

-- 3. Trains
CREATE TABLE IF NOT EXISTS trains (
    id VARCHAR(20) PRIMARY KEY,
    number VARCHAR(10) NOT NULL,
    name VARCHAR(100) NOT NULL,
    name_tamil VARCHAR(100) NOT NULL,
    source_code VARCHAR(10) NOT NULL,
    destination_code VARCHAR(10) NOT NULL,
    departure_time VARCHAR(10) NOT NULL,
    arrival_time VARCHAR(10) NOT NULL,
    duration VARCHAR(20) NOT NULL,
    train_length_meters INT DEFAULT 300,
    FOREIGN KEY (source_code) REFERENCES stations(code),
    FOREIGN KEY (destination_code) REFERENCES stations(code)
);

-- 4. Travel Classes (strictly 100-seat capacity limit)
CREATE TABLE IF NOT EXISTS train_classes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    train_id VARCHAR(20) NOT NULL,
    class_type VARCHAR(10) NOT NULL,
    class_name VARCHAR(100) NOT NULL,
    class_name_tamil VARCHAR(100) NOT NULL,
    fare DECIMAL(10, 2) NOT NULL,
    total_seats INT DEFAULT 100,
    available_seats INT DEFAULT 100,
    waiting_list_count INT DEFAULT 0,
    FOREIGN KEY (train_id) REFERENCES trains(id),
    UNIQUE KEY uk_train_class (train_id, class_type)
);

-- 5. Reservations
CREATE TABLE IF NOT EXISTS reservations (
    reservation_id BIGINT PRIMARY KEY,
    pnr VARCHAR(25) NOT NULL UNIQUE,
    user_id BIGINT,
    train_id VARCHAR(20) NOT NULL,
    source_code VARCHAR(10) NOT NULL,
    destination_code VARCHAR(10) NOT NULL,
    travel_date DATE NOT NULL,
    booking_mode VARCHAR(20) NOT NULL, -- EMERGENCY (1), CONNECTING (2), NORMAL (3)
    travel_class VARCHAR(10) NOT NULL,
    status VARCHAR(20) NOT NULL,       -- CONFIRMED, WAITING_LIST, CANCELLED
    waiting_list_number INT,
    total_fare DECIMAL(10, 2) NOT NULL,
    payment_id VARCHAR(50),
    is_connecting_itinerary BOOLEAN DEFAULT FALSE,
    connecting_leg_info VARCHAR(255),
    booking_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (train_id) REFERENCES trains(id),
    INDEX idx_train_date_class (train_id, travel_date, travel_class),
    INDEX idx_pnr (pnr),
    INDEX idx_user_reservations (user_id)
);

-- 6. Passengers
CREATE TABLE IF NOT EXISTS passengers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    reservation_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    age INT NOT NULL,
    gender VARCHAR(20) NOT NULL,
    berth_preference VARCHAR(30) DEFAULT 'NO_PREF',
    seat_assigned VARCHAR(40),
    emergency_reason VARCHAR(150),
    emergency_id VARCHAR(100),
    connecting_pnr VARCHAR(50),
    FOREIGN KEY (reservation_id) REFERENCES reservations(reservation_id) ON DELETE CASCADE
);

-- 7. Connecting Reservation Legs (for Atomic Multi-Leg Journeys)
CREATE TABLE IF NOT EXISTS reservation_legs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    journey_pnr VARCHAR(25) NOT NULL,
    leg_order INT NOT NULL,
    train_id VARCHAR(20) NOT NULL,
    travel_class VARCHAR(10) NOT NULL,
    source_code VARCHAR(10) NOT NULL,
    destination_code VARCHAR(10) NOT NULL,
    departure_time VARCHAR(10) NOT NULL,
    arrival_time VARCHAR(10) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'CONFIRMED',
    FOREIGN KEY (train_id) REFERENCES trains(id),
    INDEX idx_journey_pnr (journey_pnr)
);

-- 8. Platforms
CREATE TABLE IF NOT EXISTS platforms (
    platform_id INT PRIMARY KEY,
    length_meters INT NOT NULL,
    occupied BOOLEAN DEFAULT FALSE,
    current_train_id VARCHAR(20),
    current_train_name VARCHAR(100),
    arrival_time VARCHAR(10),
    release_time VARCHAR(10)
);

-- 9. Platform Requests & Allocation Queue
CREATE TABLE IF NOT EXISTS platform_requests (
    id VARCHAR(50) PRIMARY KEY,
    train_id VARCHAR(20) NOT NULL,
    train_name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL, -- EMERGENCY (1), CONNECTION (2), NORMAL (3)
    arrival_time VARCHAR(10) NOT NULL,
    departure_time VARCHAR(10) NOT NULL,
    length_meters INT NOT NULL,
    priority_rank INT NOT NULL, -- 1: Emergency, 2: Connection, 3: Normal
    request_order INT NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING',
    allocated_platform_id INT,
    INDEX idx_platform_req_status_rank (status, priority_rank, request_order)
);

-- 10. Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    entity_name VARCHAR(50) NOT NULL,
    entity_id VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    details TEXT,
    performed_by VARCHAR(100) DEFAULT 'SYSTEM',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
