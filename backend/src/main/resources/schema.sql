-- Payanam Junction — RailConnect Database Schema (MySQL)

CREATE TABLE IF NOT EXISTS stations (
    code VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    name_tamil VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    junction_type VARCHAR(100),
    platforms_count INT DEFAULT 4
);

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

CREATE TABLE IF NOT EXISTS train_classes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    train_id VARCHAR(20) NOT NULL,
    class_type VARCHAR(10) NOT NULL,
    class_name VARCHAR(100) NOT NULL,
    class_name_tamil VARCHAR(100) NOT NULL,
    fare DECIMAL(10, 2) NOT NULL,
    total_seats INT DEFAULT 100,  -- Configured strictly to 100 seats per class
    available_seats INT DEFAULT 100,
    waiting_list_count INT DEFAULT 0,
    FOREIGN KEY (train_id) REFERENCES trains(id),
    UNIQUE (train_id, class_type)
);

CREATE TABLE IF NOT EXISTS reservations (
    reservation_id BIGINT PRIMARY KEY,
    pnr VARCHAR(20) UNIQUE NOT NULL,
    train_id VARCHAR(20) NOT NULL,
    source_code VARCHAR(10) NOT NULL,
    destination_code VARCHAR(10) NOT NULL,
    travel_date DATE NOT NULL,
    booking_mode VARCHAR(20) NOT NULL, -- EMERGENCY, CONNECTING, NORMAL
    travel_class VARCHAR(10) NOT NULL,
    status VARCHAR(20) NOT NULL,       -- CONFIRMED, WAITING_LIST, CANCELLED
    waiting_list_number INT,
    total_fare DECIMAL(10, 2) NOT NULL,
    payment_id VARCHAR(50),
    booking_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (train_id) REFERENCES trains(id)
);

CREATE TABLE IF NOT EXISTS passengers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    reservation_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    age INT NOT NULL,
    gender VARCHAR(20) NOT NULL,
    berth_preference VARCHAR(30) DEFAULT 'NO_PREF',
    seat_assigned VARCHAR(30),
    emergency_reason VARCHAR(150),
    emergency_id VARCHAR(100),
    connecting_pnr VARCHAR(50),
    FOREIGN KEY (reservation_id) REFERENCES reservations(reservation_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS platforms (
    platform_id INT PRIMARY KEY,
    length_meters INT NOT NULL,
    occupied BOOLEAN DEFAULT FALSE,
    current_train_id VARCHAR(20),
    current_train_name VARCHAR(100),
    arrival_time VARCHAR(10),
    release_time VARCHAR(10)
);

CREATE TABLE IF NOT EXISTS platform_requests (
    id VARCHAR(50) PRIMARY KEY,
    train_id VARCHAR(20) NOT NULL,
    train_name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL, -- EMERGENCY, CONNECTION, NORMAL
    arrival_time VARCHAR(10) NOT NULL,
    departure_time VARCHAR(10) NOT NULL,
    length_meters INT NOT NULL,
    priority_rank INT NOT NULL, -- 1: Emergency, 2: Connection, 3: Normal
    request_order INT NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING',
    allocated_platform_id INT
);
