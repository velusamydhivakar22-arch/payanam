# Payanam Junction — RailConnect: Production Deployment & Operations Guide

**Tagline:** *Travel Smarter. Travel Safer.*  
**System Version:** `1.0.0`  
**Architecture:** React + TypeScript (Vite + Tailwind CSS) Frontend, Java 21 Spring Boot Backend, MySQL 8.0 Enterprise/Community Database.

---

## 1. System Architecture Overview

```
                      +-----------------------------+
                      |   Client Browsers & Mobile  |
                      +--------------+--------------+
                                     |
                                     | Port 80 / 443
                                     v
                      +-----------------------------+
                      |       Nginx Web Server      |
                      |   - Static SPA Distribution  |
                      |   - Gzip Compression        |
                      |   - /api/ Reverse Proxy     |
                      +--------------+--------------+
                                     |
                                     | Port 8080 (Internal Bridge)
                                     v
                      +-----------------------------+
                      | Spring Boot REST Backend    |
                      |   - Stateless JWT Filter    |
                      |   - Priority Allocation Engine|
                      |   - 100-Seat Quota Lock     |
                      |   - Actuator Health Checks  |
                      +--------------+--------------+
                                     |
                                     | Port 3306 (Internal Bridge)
                                     v
                      +-----------------------------+
                      |      MySQL 8.0 Database     |
                      |   - Flyway Schema Migration |
                      |   - InnoDB Atomic Inventory |
                      |   - Named Persistent Volume |
                      +-----------------------------+
```

---

## 2. Prerequisites & Environment Requirements

### For Containerized Production (Docker Compose)
- **Docker Engine:** `24.0+`
- **Docker Compose:** `v2.20+`
- **RAM:** Minimum 4GB (8GB recommended)
- **Disk:** 20GB free space for persistent MySQL volumes and build caches.

### For Bare-Metal / Local Production Execution
- **Java Runtime / SDK:** Eclipse Temurin or Oracle JDK 21 (LTS)
- **Node.js:** Node `18.18+` or `20.x` LTS with `npm 9+`
- **Database:** MySQL Server 8.0 with InnoDB engine enabled.
- **Build Tools:** Apache Maven 3.9+ (packaged wrapper `mvnw.cmd` included).

---

## 3. Configuration Management & Security

### 3.1 Environment Variables
All secret and environment configurations are decoupled from code. Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

| Variable Name | Description | Production Recommendation |
| :--- | :--- | :--- |
| `DB_HOST` | Hostname of MySQL database | `mysql` (Docker) or `localhost` (Bare-metal) |
| `DB_PORT` | Port of MySQL service | `3306` |
| `DB_NAME` | Database schema name | `payanam_junction` |
| `DB_USERNAME` | Application DB user | Dedicated non-root user (e.g. `railconnect`) |
| `DB_PASSWORD` | Application DB password | Minimum 16-character alphanumeric random secret |
| `DB_ROOT_PASSWORD` | MySQL root administrative password | Minimum 20-character complex secret |
| `SERVER_PORT` | Spring Boot HTTP listening port | `8080` |
| `JWT_SECRET` | 256-bit HMAC-SHA signing secret key | High-entropy hex/base64 string (`openssl rand -hex 32`) |
| `JWT_EXPIRATION_MS` | JWT validity lifetime in milliseconds | `86400000` (24 hours) |
| `ADMIN_USERNAME` | Bootstrap administrator email | `admin@railconnect.in` |
| `ADMIN_PASSWORD` | Initial admin account password | Secure random master password |
| `FRONTEND_PORT` | HTTP port exposed by Nginx | `80` (or `443` with TLS termination) |
| `VITE_API_BASE_URL` | Frontend REST API URL | Reverse-proxied path `/api/v1` or public domain URL |

### 3.2 Secret Sanitization Rules
- **Never** commit `.env`, private keys, or keystores to Git.
- Sample seeds in `V2__seed_data.sql` contain development test hashes only.
- In production, rotate all default passwords before public network binding.

---

## 4. Production Build Instructions

### 4.1 Frontend Build
From the `frontend/` directory:
```bash
cd frontend
npm install --frozen-lockfile
npm run build
```
- Output directory: `frontend/dist/`
- Validated with: `tsc -b && vite build` (zero type errors, bundled CSS and JS chunks).

### 4.2 Backend Build
From the `backend/` directory:
```bash
cd backend
mvnw.cmd clean package -Dspring.profiles.active=test
```
- Executable JAR: `backend/target/railconnect-1.0.0.jar`
- Validated with: 18/18 Automated tests passing including concurrent booking locks, priority allocation, midnight crossover, and RBAC authorization.

---

## 5. Docker Deployment

### 5.1 One-Step Production Startup
From the project root:
```bash
docker compose up -d --build
```

### 5.2 Container Health Verification
Check that all three containers are healthy:
```bash
docker compose ps
```
Expected output:
- `payanam-mysql`: `Up (healthy)`
- `payanam-backend`: `Up (healthy)`
- `payanam-frontend`: `Up (healthy)`

### 5.3 Actuator Health Check
Verify live Spring Boot health status:
```bash
curl -f http://localhost:8080/actuator/health
```

---

## 6. Database Operations & Management

### 6.1 Automated Migrations (Flyway)
Flyway migrations execute automatically upon Spring Boot backend startup:
- `V1__initial_schema.sql`: Normalizes 10 tables (`users`, `stations`, `trains`, `train_classes`, `reservations`, `passengers`, `reservation_legs`, `platforms`, `platform_requests`, `audit_logs`).
- `V2__seed_data.sql`: Seeds railway stations (10 major regional stations), train schedules (Pandian, Vande Bharat, Kovai, Vaigai), and platform lengths.

### 6.2 Manual Database Backup (mysqldump)
To back up the production database to a timestamped SQL dump:
```bash
docker exec payanam-mysql mysqldump -u railconnect -p"railconnect_pass_2026" payanam_junction > backup_$(date +%Y%m%d_%H%M%S).sql
```

### 6.3 Database Restoration
To restore from an existing SQL backup:
```bash
docker exec -i payanam-mysql mysql -u railconnect -p"railconnect_pass_2026" payanam_junction < backup_file.sql
```

### 6.4 Clean Graceful Shutdown
```bash
docker compose down
```
To preserve persistent volume data:
`docker compose down` retains `payanam_mysql_data`.
To destroy database volumes (WARNING: Irreversible data deletion):
`docker compose down -v`

---

## 7. Security & CORS Configuration

1. **CORS Isolation:** The backend `SecurityConfig` allows only registered origins (`http://localhost:5173`, `http://127.0.0.1:5173`, and production reverse-proxy origins).
2. **Stateless JWT Authorization:** Every protected request carries `Authorization: Bearer <token>`. Session creation policy is set to `STATELESS`.
3. **Role-Based Access Control (RBAC):**
   - Public: Station search, train timetable queries, public platform status, user registration, and login.
   - User Role: My Bookings (`/api/v1/reservations/user/**`), booking ticket, cancelling ticket.
   - Admin Role: Smart platform allocations, dispatch overrides, train delay updates (`/api/v1/admin/**`).

---

## 8. Exact Local URLs & Service Endpoints

| Service / Interface | Local URL | Credentials / Notes |
| :--- | :--- | :--- |
| **Frontend Web Application** | `http://127.0.0.1:5173/` or `http://localhost/` | Responsive UI, English/Tamil |
| **Backend REST API** | `http://localhost:8080/api/v1` | Spring Boot 3.3.4 |
| **Swagger UI Documentation** | `http://localhost:8080/swagger-ui/index.html` | Interactive OpenAPI 3.0 specs |
| **Spring Actuator Health** | `http://localhost:8080/actuator/health` | Automated monitoring health status |
| **Admin Portal Dashboard** | `http://127.0.0.1:5173/` (Admin Login) | `admin@railconnect.in` / `Admin@123` |
| **Passenger Demo Account** | `http://127.0.0.1:5173/` (User Login) | `passenger@railconnect.in` / `Passenger@123` |
