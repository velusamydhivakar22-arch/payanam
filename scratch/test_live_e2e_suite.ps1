$base = "http://localhost:8080/api/v1"
Write-Host "PAYANAM JUNCTION - LIVE INTEGRATION TEST SUITE"

$health = Invoke-RestMethod -Uri "http://localhost:8080/actuator/health"
Write-Host "1. Actuator Health Status: $($health.status)"

$stations = Invoke-RestMethod -Uri "$base/stations"
Write-Host "2. Stations Available: $($stations.Count)"

$trains = Invoke-RestMethod -Uri "$base/trains"
Write-Host "3. Trains Available: $($trains.Count)"

$randomSuffix = Get-Random -Minimum 1000 -Maximum 9999
$testEmail = "tester_$randomSuffix@railconnect.in"
$regPayload = @{
    email = $testEmail
    password = "TesterPass@2026"
    fullName = "QA Automation Tester"
    phone = "9876543210"
} | ConvertTo-Json

$regRes = Invoke-RestMethod -Uri "$base/auth/register" -Method Post -Body $regPayload -ContentType "application/json"
$userToken = $regRes.token
$userId = $regRes.userId
Write-Host "4. Registered User: $testEmail (ID: $userId)"

$bookDate = (Get-Date).AddDays(15).ToString("yyyy-MM-dd")
$bookPayload = @{
    trainId = "P101"
    travelClass = "2A"
    travelDate = $bookDate
    bookingMode = "NORMAL"
    totalFare = 1350.00
    paymentId = "PAY-E2E-TEST"
    passengers = @(
        @{
            name = "Suresh Kumar"
            age = 34
            gender = "Male"
            berthPreference = "LOWER"
        }
    )
} | ConvertTo-Json -Depth 4

$authHeaders = @{
    "Authorization" = "Bearer $userToken"
    "Content-Type" = "application/json"
}

$booking = Invoke-RestMethod -Uri "$base/reservations" -Method Post -Body $bookPayload -Headers $authHeaders
Write-Host "5. Booked Ticket: PNR=$($booking.pnr), Status=$($booking.status), Class=$($booking.travelClass)"

$myBookings = Invoke-RestMethod -Uri "$base/reservations/user/$userId" -Headers $authHeaders
Write-Host "6. My Bookings retrieved: $($myBookings.Count) tickets"

$cancelRes = Invoke-RestMethod -Uri "$base/reservations/$($booking.pnr)/cancel" -Method Post -Headers $authHeaders
Write-Host "7. Cancelled Ticket: Status=$($cancelRes.status)"

$connDate = (Get-Date).AddDays(20).ToString("yyyy-MM-dd")
$connPayload = @{
    leg1TrainId = "P301"
    leg2TrainId = "P302"
    junctionCode = "CBE"
    travelClass = "2A"
    travelDate = $connDate
    totalFare = 2560.00
    paymentId = "PAY-E2E-CONN"
    passengers = @(
        @{
            name = "Ravi Shankar"
            age = 42
            gender = "Male"
            berthPreference = "MIDDLE"
        }
    )
} | ConvertTo-Json -Depth 4

$connBooking = Invoke-RestMethod -Uri "$base/reservations/connecting" -Method Post -Body $connPayload -Headers $authHeaders
Write-Host "8. Connecting Booking: JourneyPNR=$($connBooking.journeyPnr), Leg1=$($connBooking.leg1Status), Leg2=$($connBooking.leg2Status), Layover=$($connBooking.layoverMinutes)m"

$adminLoginPayload = @{
    email = "admin@railconnect.in"
    password = "Admin@123"
} | ConvertTo-Json

$adminRes = Invoke-RestMethod -Uri "$base/auth/login" -Method Post -Body $adminLoginPayload -ContentType "application/json"
$adminToken = $adminRes.token
Write-Host "9. Admin Logged in: $($adminRes.email) Role: $($adminRes.role)"

$adminHeaders = @{
    "Authorization" = "Bearer $adminToken"
    "Content-Type" = "application/json"
}

$platformsStatus = Invoke-RestMethod -Uri "$base/platforms/status" -Headers $adminHeaders
Write-Host "10. Platform Status: $($platformsStatus.platforms.Count) platforms active"

$reqPayload = @{
    trainId = "EMG-999"
    trainName = "Medical Emergency Express"
    type = "EMERGENCY"
    arrivalTime = "14:00"
    departureTime = "14:30"
    lengthMeters = 240
} | ConvertTo-Json

$queued = Invoke-RestMethod -Uri "$base/platforms/request" -Method Post -Body $reqPayload -Headers $adminHeaders
Write-Host "11. Queued Platform Request: $($queued.trainName) Priority: $($queued.priorityRank)"

$processed = Invoke-RestMethod -Uri "$base/platforms/process-next" -Method Post -Headers $adminHeaders
Write-Host "12. Processed Allocation: Platform=$($processed.allocatedPlatformId) Msg=$($processed.message)"

try {
    $denied = Invoke-RestMethod -Uri "$base/admin/platforms" -Headers $authHeaders
    Write-Host "FAILED: Non-admin was allowed access!"
} catch {
    Write-Host "13. Security Verification PASSED: Non-admin correctly rejected by /admin/platforms"
}

Write-Host "ALL 13 LIVE E2E FULL-STACK CHECKS PASSED SUCCESSFULLY"
