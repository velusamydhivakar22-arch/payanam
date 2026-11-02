import type { Train } from '../types/railway';

export const DEMO_TRAINS: Train[] = [
  // 1. Pandian SF MDU -> MS
  {
    id: 'P101',
    number: '12638',
    name: 'Pandian Superfast Express',
    nameTamil: 'பாண்டியன் அதிவிரைவு வண்டி',
    sourceCode: 'MDU',
    destinationCode: 'MS',
    departureTime: '21:35',
    arrivalTime: '05:10',
    duration: '7h 35m',
    runsOn: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    trainLengthMeters: 300,
    classes: [
      { classType: '1A', className: 'AC First Class (1A)', classNameTamil: 'ஏசி முதல் வகுப்பு', fare: 2150, totalSeats: 100, availableSeats: 18, waitingListCount: 0, statusText: 'AVAILABLE-18' },
      { classType: '2A', className: 'AC 2 Tier (2A)', classNameTamil: 'ஏசி 2 அடுக்கு', fare: 1350, totalSeats: 100, availableSeats: 32, waitingListCount: 0, statusText: 'AVAILABLE-32' },
      { classType: '3A', className: 'AC 3 Tier (3A)', classNameTamil: 'ஏசி 3 அடுக்கு', fare: 960, totalSeats: 100, availableSeats: 6, waitingListCount: 0, statusText: 'AVAILABLE-06' },
      { classType: 'SL', className: 'Sleeper Class (SL)', classNameTamil: 'படுக்கை வசதி', fare: 365, totalSeats: 100, availableSeats: 0, waitingListCount: 3, statusText: 'WL-3' }
    ]
  },
  // 2. Pandian SF MS -> MDU
  {
    id: 'P102',
    number: '12637',
    name: 'Pandian Superfast Express',
    nameTamil: 'பாண்டியன் அதிவிரைவு வண்டி',
    sourceCode: 'MS',
    destinationCode: 'MDU',
    departureTime: '21:40',
    arrivalTime: '05:35',
    duration: '7h 55m',
    runsOn: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    trainLengthMeters: 300,
    classes: [
      { classType: '1A', className: 'AC First Class (1A)', classNameTamil: 'ஏசி முதல் வகுப்பு', fare: 2150, totalSeats: 100, availableSeats: 20, waitingListCount: 0, statusText: 'AVAILABLE-20' },
      { classType: '2A', className: 'AC 2 Tier (2A)', classNameTamil: 'ஏசி 2 அடுக்கு', fare: 1350, totalSeats: 100, availableSeats: 45, waitingListCount: 0, statusText: 'AVAILABLE-45' },
      { classType: '3A', className: 'AC 3 Tier (3A)', classNameTamil: 'ஏசி 3 அடுக்கு', fare: 960, totalSeats: 100, availableSeats: 12, waitingListCount: 0, statusText: 'AVAILABLE-12' },
      { classType: 'SL', className: 'Sleeper Class (SL)', classNameTamil: 'படுக்கை வசதி', fare: 365, totalSeats: 100, availableSeats: 5, waitingListCount: 0, statusText: 'AVAILABLE-05' }
    ]
  },
  // 3. Chennai Central - Madurai AC SF MAS -> MDU (Train 20601)
  {
    id: 'P103',
    number: '20601',
    name: 'Chennai Central - Madurai AC Superfast',
    nameTamil: 'சென்னை சென்ட்ரல் - மதுரை ஏசி அதிவிரைவு வண்டி',
    sourceCode: 'MAS',
    destinationCode: 'MDU',
    departureTime: '22:30',
    arrivalTime: '07:20',
    duration: '8h 50m',
    runsOn: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    trainLengthMeters: 300,
    classes: [
      { classType: '1A', className: 'AC First Class (1A)', classNameTamil: 'ஏசி முதல் வகுப்பு', fare: 2250, totalSeats: 100, availableSeats: 14, waitingListCount: 0, statusText: 'AVAILABLE-14' },
      { classType: '2A', className: 'AC 2 Tier (2A)', classNameTamil: 'ஏசி 2 அடுக்கு', fare: 1420, totalSeats: 100, availableSeats: 28, waitingListCount: 0, statusText: 'AVAILABLE-28' },
      { classType: '3A', className: 'AC 3 Tier (3A)', classNameTamil: 'ஏசி 3 அடுக்கு', fare: 1020, totalSeats: 100, availableSeats: 42, waitingListCount: 0, statusText: 'AVAILABLE-42' }
    ]
  },
  // 4. Madurai - Chennai Central AC SF MDU -> MAS (Train 20602)
  {
    id: 'P104',
    number: '20602',
    name: 'Madurai - Chennai Central AC Superfast',
    nameTamil: 'மதுரை - சென்னை சென்ட்ரல் ஏசி அதிவிரைவு வண்டி',
    sourceCode: 'MDU',
    destinationCode: 'MAS',
    departureTime: '22:45',
    arrivalTime: '07:50',
    duration: '9h 05m',
    runsOn: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    trainLengthMeters: 300,
    classes: [
      { classType: '1A', className: 'AC First Class (1A)', classNameTamil: 'ஏசி முதல் வகுப்பு', fare: 2250, totalSeats: 100, availableSeats: 16, waitingListCount: 0, statusText: 'AVAILABLE-16' },
      { classType: '2A', className: 'AC 2 Tier (2A)', classNameTamil: 'ஏசி 2 அடுக்கு', fare: 1420, totalSeats: 100, availableSeats: 35, waitingListCount: 0, statusText: 'AVAILABLE-35' },
      { classType: '3A', className: 'AC 3 Tier (3A)', classNameTamil: 'ஏசி 3 அடுக்கு', fare: 1020, totalSeats: 100, availableSeats: 50, waitingListCount: 0, statusText: 'AVAILABLE-50' }
    ]
  },
  // 5. Vande Bharat MAS -> SBC
  {
    id: 'P201',
    number: '20607',
    name: 'Vande Bharat Express',
    nameTamil: 'வந்தே பாரத் எக்ஸ்பிரஸ்',
    sourceCode: 'MAS',
    destinationCode: 'SBC',
    departureTime: '05:50',
    arrivalTime: '10:20',
    duration: '4h 30m',
    runsOn: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sun'],
    trainLengthMeters: 250,
    classes: [
      { classType: 'EC', className: 'Executive Chair Car (EC)', classNameTamil: 'நிர்வாக நாற்காலி கார்', fare: 1880, totalSeats: 100, availableSeats: 14, waitingListCount: 0, statusText: 'AVAILABLE-14' },
      { classType: 'CC', className: 'AC Chair Car (CC)', classNameTamil: 'ஏசி நாற்காலி கார்', fare: 995, totalSeats: 100, availableSeats: 28, waitingListCount: 0, statusText: 'AVAILABLE-28' }
    ]
  },
  // 6. Vande Bharat SBC -> MAS
  {
    id: 'P202',
    number: '20608',
    name: 'Vande Bharat Express',
    nameTamil: 'வந்தே பாரத் எக்ஸ்பிரஸ்',
    sourceCode: 'SBC',
    destinationCode: 'MAS',
    departureTime: '14:50',
    arrivalTime: '19:20',
    duration: '4h 30m',
    runsOn: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sun'],
    trainLengthMeters: 250,
    classes: [
      { classType: 'EC', className: 'Executive Chair Car (EC)', classNameTamil: 'நிர்வாக நாற்காலி கார்', fare: 1880, totalSeats: 100, availableSeats: 16, waitingListCount: 0, statusText: 'AVAILABLE-16' },
      { classType: 'CC', className: 'AC Chair Car (CC)', classNameTamil: 'ஏசி நாற்காலி கார்', fare: 995, totalSeats: 100, availableSeats: 34, waitingListCount: 0, statusText: 'AVAILABLE-34' }
    ]
  },
  // 7. Lalbagh SF MAS -> SBC
  {
    id: 'P203',
    number: '12607',
    name: 'Lalbagh Superfast Express',
    nameTamil: 'லால்பாக் அதிவிரைவு வண்டி',
    sourceCode: 'MAS',
    destinationCode: 'SBC',
    departureTime: '15:30',
    arrivalTime: '21:35',
    duration: '6h 05m',
    runsOn: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    trainLengthMeters: 280,
    classes: [
      { classType: 'CC', className: 'AC Chair Car (CC)', classNameTamil: 'ஏசி நாற்காலி கார்', fare: 650, totalSeats: 100, availableSeats: 30, waitingListCount: 0, statusText: 'AVAILABLE-30' },
      { classType: 'SL', className: 'Second Sitting (2S)', classNameTamil: 'இரண்டாம் வகுப்பு', fare: 170, totalSeats: 100, availableSeats: 65, waitingListCount: 0, statusText: 'AVAILABLE-65' }
    ]
  },
  // 8. Lalbagh SF SBC -> MAS
  {
    id: 'P204',
    number: '12608',
    name: 'Lalbagh Superfast Express',
    nameTamil: 'லால்பாக் அதிவிரைவு வண்டி',
    sourceCode: 'SBC',
    destinationCode: 'MAS',
    departureTime: '06:30',
    arrivalTime: '12:15',
    duration: '5h 45m',
    runsOn: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    trainLengthMeters: 280,
    classes: [
      { classType: 'CC', className: 'AC Chair Car (CC)', classNameTamil: 'ஏசி நாற்காலி கார்', fare: 650, totalSeats: 100, availableSeats: 25, waitingListCount: 0, statusText: 'AVAILABLE-25' },
      { classType: 'SL', className: 'Second Sitting (2S)', classNameTamil: 'இரண்டாம் வகுப்பு', fare: 170, totalSeats: 100, availableSeats: 55, waitingListCount: 0, statusText: 'AVAILABLE-55' }
    ]
  },
  // 9. Kovai SF MAS -> CBE
  {
    id: 'P301',
    number: '12675',
    name: 'Kovai Superfast Express',
    nameTamil: 'கோவை அதிவிரைவு வண்டி',
    sourceCode: 'MAS',
    destinationCode: 'CBE',
    departureTime: '06:10',
    arrivalTime: '14:05',
    duration: '7h 55m',
    runsOn: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    trainLengthMeters: 280,
    classes: [
      { classType: 'CC', className: 'AC Chair Car (CC)', classNameTamil: 'ஏசி நாற்காலி கார்', fare: 710, totalSeats: 100, availableSeats: 39, waitingListCount: 0, statusText: 'AVAILABLE-39' },
      { classType: '2A', className: 'AC 2 Tier (2A)', classNameTamil: 'ஏசி 2 அடுக்கு', fare: 1280, totalSeats: 100, availableSeats: 15, waitingListCount: 0, statusText: 'AVAILABLE-15' },
      { classType: 'SL', className: 'Second Sitting / Sleeper', classNameTamil: 'படுக்கை வசதி', fare: 220, totalSeats: 100, availableSeats: 74, waitingListCount: 0, statusText: 'AVAILABLE-74' }
    ]
  },
  // 10. Kovai SF CBE -> MAS
  {
    id: 'P302',
    number: '12676',
    name: 'Kovai Superfast Express',
    nameTamil: 'கோவை அதிவிரைவு வண்டி',
    sourceCode: 'CBE',
    destinationCode: 'MAS',
    departureTime: '15:15',
    arrivalTime: '22:50',
    duration: '7h 35m',
    runsOn: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    trainLengthMeters: 280,
    classes: [
      { classType: 'CC', className: 'AC Chair Car (CC)', classNameTamil: 'ஏசி நாற்காலி கார்', fare: 710, totalSeats: 100, availableSeats: 42, waitingListCount: 0, statusText: 'AVAILABLE-42' },
      { classType: '2A', className: 'AC 2 Tier (2A)', classNameTamil: 'ஏசி 2 அடுக்கு', fare: 1280, totalSeats: 100, availableSeats: 18, waitingListCount: 0, statusText: 'AVAILABLE-18' },
      { classType: 'SL', className: 'Second Sitting / Sleeper', classNameTamil: 'படுக்கை வசதி', fare: 220, totalSeats: 100, availableSeats: 60, waitingListCount: 0, statusText: 'AVAILABLE-60' }
    ]
  },
  // 11. Chemmozhi Express CBE -> MDU
  {
    id: 'P303',
    number: '16617',
    name: 'Chemmozhi Express',
    nameTamil: 'செம்மொழி விரைவு வண்டி',
    sourceCode: 'CBE',
    destinationCode: 'MDU',
    departureTime: '06:15',
    arrivalTime: '10:30',
    duration: '4h 15m',
    runsOn: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    trainLengthMeters: 260,
    classes: [
      { classType: '2A', className: 'AC 2 Tier (2A)', classNameTamil: 'ஏசி 2 அடுக்கு', fare: 820, totalSeats: 100, availableSeats: 20, waitingListCount: 0, statusText: 'AVAILABLE-20' },
      { classType: '3A', className: 'AC 3 Tier (3A)', classNameTamil: 'ஏசி 3 அடுக்கு', fare: 580, totalSeats: 100, availableSeats: 35, waitingListCount: 0, statusText: 'AVAILABLE-35' },
      { classType: 'SL', className: 'Sleeper Class (SL)', classNameTamil: 'படுக்கை வசதி', fare: 190, totalSeats: 100, availableSeats: 55, waitingListCount: 0, statusText: 'AVAILABLE-55' }
    ]
  },
  // 12. Chemmozhi Express MDU -> CBE
  {
    id: 'P304',
    number: '16618',
    name: 'Chemmozhi Express',
    nameTamil: 'செம்மொழி விரைவு வண்டி',
    sourceCode: 'MDU',
    destinationCode: 'CBE',
    departureTime: '16:30',
    arrivalTime: '21:00',
    duration: '4h 30m',
    runsOn: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    trainLengthMeters: 260,
    classes: [
      { classType: '2A', className: 'AC 2 Tier (2A)', classNameTamil: 'ஏசி 2 அடுக்கு', fare: 820, totalSeats: 100, availableSeats: 24, waitingListCount: 0, statusText: 'AVAILABLE-24' },
      { classType: '3A', className: 'AC 3 Tier (3A)', classNameTamil: 'ஏசி 3 அடுக்கு', fare: 580, totalSeats: 100, availableSeats: 40, waitingListCount: 0, statusText: 'AVAILABLE-40' },
      { classType: 'SL', className: 'Sleeper Class (SL)', classNameTamil: 'படுக்கை வசதி', fare: 190, totalSeats: 100, availableSeats: 62, waitingListCount: 0, statusText: 'AVAILABLE-62' }
    ]
  },
  // 13. Vaigai SF MS -> MDU
  {
    id: 'P401',
    number: '12635',
    name: 'Vaigai Superfast Express',
    nameTamil: 'வைகை அதிவிரைவு வண்டி',
    sourceCode: 'MS',
    destinationCode: 'MDU',
    departureTime: '13:50',
    arrivalTime: '21:30',
    duration: '7h 40m',
    runsOn: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    trainLengthMeters: 320,
    classes: [
      { classType: 'CC', className: 'AC Chair Car (CC)', classNameTamil: 'ஏசி நாற்காலி கார்', fare: 650, totalSeats: 100, availableSeats: 22, waitingListCount: 0, statusText: 'AVAILABLE-22' },
      { classType: 'SL', className: 'Second Sitting (2S)', classNameTamil: 'இரண்டாம் வகுப்பு அமரும் வசதி', fare: 185, totalSeats: 100, availableSeats: 50, waitingListCount: 0, statusText: 'AVAILABLE-50' }
    ]
  },
  // 14. Vaigai SF MDU -> MS
  {
    id: 'P402',
    number: '12636',
    name: 'Vaigai Superfast Express',
    nameTamil: 'வைகை அதிவிரைவு வண்டி',
    sourceCode: 'MDU',
    destinationCode: 'MS',
    departureTime: '07:10',
    arrivalTime: '14:40',
    duration: '7h 30m',
    runsOn: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    trainLengthMeters: 320,
    classes: [
      { classType: 'CC', className: 'AC Chair Car (CC)', classNameTamil: 'ஏசி நாற்காலி கார்', fare: 650, totalSeats: 100, availableSeats: 30, waitingListCount: 0, statusText: 'AVAILABLE-30' },
      { classType: 'SL', className: 'Second Sitting (2S)', classNameTamil: 'இரண்டாம் வகுப்பு அமரும் வசதி', fare: 185, totalSeats: 100, availableSeats: 65, waitingListCount: 0, statusText: 'AVAILABLE-65' }
    ]
  },
  // 15. Rockfort SF MS -> TPJ
  {
    id: 'P501',
    number: '12653',
    name: 'Rockfort Superfast Express',
    nameTamil: 'மலைக்கோட்டை அதிவிரைவு வண்டி',
    sourceCode: 'MS',
    destinationCode: 'TPJ',
    departureTime: '23:15',
    arrivalTime: '05:05',
    duration: '5h 50m',
    runsOn: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    trainLengthMeters: 300,
    classes: [
      { classType: '1A', className: 'AC First Class (1A)', classNameTamil: 'ஏசி முதல் வகுப்பு', fare: 1750, totalSeats: 100, availableSeats: 12, waitingListCount: 0, statusText: 'AVAILABLE-12' },
      { classType: '2A', className: 'AC 2 Tier (2A)', classNameTamil: 'ஏசி 2 அடுக்கு', fare: 1080, totalSeats: 100, availableSeats: 28, waitingListCount: 0, statusText: 'AVAILABLE-28' },
      { classType: '3A', className: 'AC 3 Tier (3A)', classNameTamil: 'ஏசி 3 அடுக்கு', fare: 760, totalSeats: 100, availableSeats: 45, waitingListCount: 0, statusText: 'AVAILABLE-45' },
      { classType: 'SL', className: 'Sleeper Class (SL)', classNameTamil: 'படுக்கை வசதி', fare: 275, totalSeats: 100, availableSeats: 60, waitingListCount: 0, statusText: 'AVAILABLE-60' }
    ]
  },
  // 16. Rockfort SF TPJ -> MS
  {
    id: 'P502',
    number: '12654',
    name: 'Rockfort Superfast Express',
    nameTamil: 'மலைக்கோட்டை அதிவிரைவு வண்டி',
    sourceCode: 'TPJ',
    destinationCode: 'MS',
    departureTime: '22:45',
    arrivalTime: '04:40',
    duration: '5h 55m',
    runsOn: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    trainLengthMeters: 300,
    classes: [
      { classType: '1A', className: 'AC First Class (1A)', classNameTamil: 'ஏசி முதல் வகுப்பு', fare: 1750, totalSeats: 100, availableSeats: 15, waitingListCount: 0, statusText: 'AVAILABLE-15' },
      { classType: '2A', className: 'AC 2 Tier (2A)', classNameTamil: 'ஏசி 2 அடுக்கு', fare: 1080, totalSeats: 100, availableSeats: 32, waitingListCount: 0, statusText: 'AVAILABLE-32' },
      { classType: '3A', className: 'AC 3 Tier (3A)', classNameTamil: 'ஏசி 3 அடுக்கு', fare: 760, totalSeats: 100, availableSeats: 40, waitingListCount: 0, statusText: 'AVAILABLE-40' },
      { classType: 'SL', className: 'Sleeper Class (SL)', classNameTamil: 'படுக்கை வசதி', fare: 275, totalSeats: 100, availableSeats: 55, waitingListCount: 0, statusText: 'AVAILABLE-55' }
    ]
  },
  // 17. Cholan SF MS -> TPJ
  {
    id: 'P503',
    number: '22675',
    name: 'Cholan Superfast Express',
    nameTamil: 'சோழன் அதிவிரைவு வண்டி',
    sourceCode: 'MS',
    destinationCode: 'TPJ',
    departureTime: '07:15',
    arrivalTime: '13:45',
    duration: '6h 30m',
    runsOn: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    trainLengthMeters: 280,
    classes: [
      { classType: 'CC', className: 'AC Chair Car (CC)', classNameTamil: 'ஏசி நாற்காலி கார்', fare: 580, totalSeats: 100, availableSeats: 26, waitingListCount: 0, statusText: 'AVAILABLE-26' },
      { classType: 'SL', className: 'Second Sitting (2S)', classNameTamil: 'இரண்டாம் வகுப்பு', fare: 165, totalSeats: 100, availableSeats: 58, waitingListCount: 0, statusText: 'AVAILABLE-58' }
    ]
  },
  // 18. Cholan SF TPJ -> MS
  {
    id: 'P504',
    number: '22676',
    name: 'Cholan Superfast Express',
    nameTamil: 'சோழன் அதிவிரைவு வண்டி',
    sourceCode: 'TPJ',
    destinationCode: 'MS',
    departureTime: '10:15',
    arrivalTime: '17:30',
    duration: '7h 15m',
    runsOn: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    trainLengthMeters: 280,
    classes: [
      { classType: 'CC', className: 'AC Chair Car (CC)', classNameTamil: 'ஏசி நாற்காலி கார்', fare: 580, totalSeats: 100, availableSeats: 30, waitingListCount: 0, statusText: 'AVAILABLE-30' },
      { classType: 'SL', className: 'Second Sitting (2S)', classNameTamil: 'இரண்டாம் வகுப்பு', fare: 165, totalSeats: 100, availableSeats: 60, waitingListCount: 0, statusText: 'AVAILABLE-60' }
    ]
  },
  // 19. Tiruchirappalli - Madurai Express TPJ -> MDU
  {
    id: 'P601',
    number: '16843',
    name: 'Tiruchirappalli - Madurai Express',
    nameTamil: 'திருச்சிராப்பள்ளி - மதுரை விரைவு வண்டி',
    sourceCode: 'TPJ',
    destinationCode: 'MDU',
    departureTime: '14:30',
    arrivalTime: '16:45',
    duration: '2h 15m',
    runsOn: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    trainLengthMeters: 260,
    classes: [
      { classType: 'CC', className: 'AC Chair Car (CC)', classNameTamil: 'ஏசி நாற்காலி கார்', fare: 340, totalSeats: 100, availableSeats: 22, waitingListCount: 0, statusText: 'AVAILABLE-22' },
      { classType: 'SL', className: 'Second Sitting (2S)', classNameTamil: 'இரண்டாம் வகுப்பு', fare: 95, totalSeats: 100, availableSeats: 70, waitingListCount: 0, statusText: 'AVAILABLE-70' }
    ]
  },
  // 20. Madurai - Tiruchirappalli Express MDU -> TPJ
  {
    id: 'P602',
    number: '16844',
    name: 'Madurai - Tiruchirappalli Express',
    nameTamil: 'மதுரை - திருச்சிராப்பள்ளி விரைவு வண்டி',
    sourceCode: 'MDU',
    destinationCode: 'TPJ',
    departureTime: '09:15',
    arrivalTime: '11:30',
    duration: '2h 15m',
    runsOn: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    trainLengthMeters: 260,
    classes: [
      { classType: 'CC', className: 'AC Chair Car (CC)', classNameTamil: 'ஏசி நாற்காலி கார்', fare: 340, totalSeats: 100, availableSeats: 25, waitingListCount: 0, statusText: 'AVAILABLE-25' },
      { classType: 'SL', className: 'Second Sitting (2S)', classNameTamil: 'இரண்டாம் வகுப்பு', fare: 95, totalSeats: 100, availableSeats: 65, waitingListCount: 0, statusText: 'AVAILABLE-65' }
    ]
  },
  // 21. West Coast SF MAS -> SA
  {
    id: 'P701',
    number: '22637',
    name: 'West Coast Superfast Express',
    nameTamil: 'மேற்கு கடற்கரை அதிவிரைவு வண்டி',
    sourceCode: 'MAS',
    destinationCode: 'SA',
    departureTime: '13:15',
    arrivalTime: '18:30',
    duration: '5h 15m',
    runsOn: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    trainLengthMeters: 300,
    classes: [
      { classType: '2A', className: 'AC 2 Tier (2A)', classNameTamil: 'ஏசி 2 அடுக்கு', fare: 980, totalSeats: 100, availableSeats: 20, waitingListCount: 0, statusText: 'AVAILABLE-20' },
      { classType: '3A', className: 'AC 3 Tier (3A)', classNameTamil: 'ஏசி 3 அடுக்கு', fare: 690, totalSeats: 100, availableSeats: 35, waitingListCount: 0, statusText: 'AVAILABLE-35' },
      { classType: 'SL', className: 'Sleeper Class (SL)', classNameTamil: 'படுக்கை வசதி', fare: 240, totalSeats: 100, availableSeats: 65, waitingListCount: 0, statusText: 'AVAILABLE-65' }
    ]
  },
  // 22. West Coast SF SA -> MAS
  {
    id: 'P702',
    number: '22638',
    name: 'West Coast Superfast Express',
    nameTamil: 'மேற்கு கடற்கரை அதிவிரைவு வண்டி',
    sourceCode: 'SA',
    destinationCode: 'MAS',
    departureTime: '06:00',
    arrivalTime: '11:45',
    duration: '5h 45m',
    runsOn: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    trainLengthMeters: 300,
    classes: [
      { classType: '2A', className: 'AC 2 Tier (2A)', classNameTamil: 'ஏசி 2 அடுக்கு', fare: 980, totalSeats: 100, availableSeats: 18, waitingListCount: 0, statusText: 'AVAILABLE-18' },
      { classType: '3A', className: 'AC 3 Tier (3A)', classNameTamil: 'ஏசி 3 அடுக்கு', fare: 690, totalSeats: 100, availableSeats: 30, waitingListCount: 0, statusText: 'AVAILABLE-30' },
      { classType: 'SL', className: 'Sleeper Class (SL)', classNameTamil: 'படுக்கை வசதி', fare: 240, totalSeats: 100, availableSeats: 58, waitingListCount: 0, statusText: 'AVAILABLE-58' }
    ]
  },
  // 23. Salem - Madurai SA -> MDU
  {
    id: 'P703',
    number: '16353',
    name: 'Salem - Madurai Passenger Express',
    nameTamil: 'சேலம் - மதுரை பயணிகள் விரைவு வண்டி',
    sourceCode: 'SA',
    destinationCode: 'MDU',
    departureTime: '19:15',
    arrivalTime: '22:45',
    duration: '3h 30m',
    runsOn: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    trainLengthMeters: 260,
    classes: [
      { classType: 'SL', className: 'Second Sitting (2S)', classNameTamil: 'இரண்டாம் வகுப்பு', fare: 120, totalSeats: 100, availableSeats: 60, waitingListCount: 0, statusText: 'AVAILABLE-60' },
      { classType: 'SL', className: 'Sleeper Class (SL)', classNameTamil: 'படுக்கை வசதி', fare: 160, totalSeats: 100, availableSeats: 45, waitingListCount: 0, statusText: 'AVAILABLE-45' }
    ]
  },
  // 24. Madurai - Salem MDU -> SA
  {
    id: 'P704',
    number: '16354',
    name: 'Madurai - Salem Passenger Express',
    nameTamil: 'மதுரை - சேலம் பயணிகள் விரைவு வண்டி',
    sourceCode: 'MDU',
    destinationCode: 'SA',
    departureTime: '05:30',
    arrivalTime: '09:00',
    duration: '3h 30m',
    runsOn: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    trainLengthMeters: 260,
    classes: [
      { classType: 'SL', className: 'Second Sitting (2S)', classNameTamil: 'இரண்டாம் வகுப்பு', fare: 120, totalSeats: 100, availableSeats: 55, waitingListCount: 0, statusText: 'AVAILABLE-55' },
      { classType: 'SL', className: 'Sleeper Class (SL)', classNameTamil: 'படுக்கை வசதி', fare: 160, totalSeats: 100, availableSeats: 50, waitingListCount: 0, statusText: 'AVAILABLE-50' }
    ]
  },
  // 25. Uday Express SBC -> CBE
  {
    id: 'P801',
    number: '22665',
    name: 'Uday Express',
    nameTamil: 'உதய் டபுள் டெக்கர் எக்ஸ்பிரஸ்',
    sourceCode: 'SBC',
    destinationCode: 'CBE',
    departureTime: '14:15',
    arrivalTime: '21:00',
    duration: '6h 45m',
    runsOn: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    trainLengthMeters: 280,
    classes: [
      { classType: 'CC', className: 'AC Chair Car (CC)', classNameTamil: 'ஏசி நாற்காலி கார்', fare: 610, totalSeats: 100, availableSeats: 34, waitingListCount: 0, statusText: 'AVAILABLE-34' },
      { classType: 'SL', className: 'Second Sitting (2S)', classNameTamil: 'இரண்டாம் வகுப்பு', fare: 180, totalSeats: 100, availableSeats: 60, waitingListCount: 0, statusText: 'AVAILABLE-60' }
    ]
  },
  // 26. Uday Express CBE -> SBC
  {
    id: 'P802',
    number: '22666',
    name: 'Uday Express',
    nameTamil: 'உதய் டபுள் டெக்கர் எக்ஸ்பிரஸ்',
    sourceCode: 'CBE',
    destinationCode: 'SBC',
    departureTime: '05:45',
    arrivalTime: '12:30',
    duration: '6h 45m',
    runsOn: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    trainLengthMeters: 280,
    classes: [
      { classType: 'CC', className: 'AC Chair Car (CC)', classNameTamil: 'ஏசி நாற்காலி கார்', fare: 610, totalSeats: 100, availableSeats: 30, waitingListCount: 0, statusText: 'AVAILABLE-30' },
      { classType: 'SL', className: 'Second Sitting (2S)', classNameTamil: 'இரண்டாம் வகுப்பு', fare: 180, totalSeats: 100, availableSeats: 58, waitingListCount: 0, statusText: 'AVAILABLE-58' }
    ]
  },
  // 27. Bengaluru - Madurai Express SBC -> MDU
  {
    id: 'P803',
    number: '17235',
    name: 'Bengaluru - Madurai Express',
    nameTamil: 'பெங்களூரு - மதுரை விரைவு வண்டி',
    sourceCode: 'SBC',
    destinationCode: 'MDU',
    departureTime: '07:30',
    arrivalTime: '14:45',
    duration: '7h 15m',
    runsOn: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    trainLengthMeters: 290,
    classes: [
      { classType: '2A', className: 'AC 2 Tier (2A)', classNameTamil: 'ஏசி 2 அடுக்கு', fare: 1150, totalSeats: 100, availableSeats: 22, waitingListCount: 0, statusText: 'AVAILABLE-22' },
      { classType: '3A', className: 'AC 3 Tier (3A)', classNameTamil: 'ஏசி 3 அடுக்கு', fare: 810, totalSeats: 100, availableSeats: 38, waitingListCount: 0, statusText: 'AVAILABLE-38' },
      { classType: 'SL', className: 'Sleeper Class (SL)', classNameTamil: 'படுக்கை வசதி', fare: 280, totalSeats: 100, availableSeats: 52, waitingListCount: 0, statusText: 'AVAILABLE-52' }
    ]
  },
  // 28. Madurai - Bengaluru Express MDU -> SBC
  {
    id: 'P804',
    number: '17236',
    name: 'Madurai - Bengaluru Express',
    nameTamil: 'மதுரை - பெங்களூரு விரைவு வண்டி',
    sourceCode: 'MDU',
    destinationCode: 'SBC',
    departureTime: '15:30',
    arrivalTime: '22:50',
    duration: '7h 20m',
    runsOn: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    trainLengthMeters: 290,
    classes: [
      { classType: '2A', className: 'AC 2 Tier (2A)', classNameTamil: 'ஏசி 2 அடுக்கு', fare: 1150, totalSeats: 100, availableSeats: 20, waitingListCount: 0, statusText: 'AVAILABLE-20' },
      { classType: '3A', className: 'AC 3 Tier (3A)', classNameTamil: 'ஏசி 3 அடுக்கு', fare: 810, totalSeats: 100, availableSeats: 35, waitingListCount: 0, statusText: 'AVAILABLE-35' },
      { classType: 'SL', className: 'Sleeper Class (SL)', classNameTamil: 'படுக்கை வசதி', fare: 280, totalSeats: 100, availableSeats: 48, waitingListCount: 0, statusText: 'AVAILABLE-48' }
    ]
  },
  // 29. Thiruvananthapuram Mail MAS -> TVC
  {
    id: 'P901',
    number: '12623',
    name: 'Thiruvananthapuram Mail',
    nameTamil: 'திருவனந்தபுரம் மெயில்',
    sourceCode: 'MAS',
    destinationCode: 'TVC',
    departureTime: '15:20',
    arrivalTime: '06:50',
    duration: '15h 30m',
    runsOn: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    trainLengthMeters: 320,
    classes: [
      { classType: '1A', className: 'AC First Class (1A)', classNameTamil: 'ஏசி முதல் வகுப்பு', fare: 2850, totalSeats: 100, availableSeats: 10, waitingListCount: 0, statusText: 'AVAILABLE-10' },
      { classType: '2A', className: 'AC 2 Tier (2A)', classNameTamil: 'ஏசி 2 அடுக்கு', fare: 1720, totalSeats: 100, availableSeats: 25, waitingListCount: 0, statusText: 'AVAILABLE-25' },
      { classType: '3A', className: 'AC 3 Tier (3A)', classNameTamil: 'ஏசி 3 அடுக்கு', fare: 1210, totalSeats: 100, availableSeats: 35, waitingListCount: 0, statusText: 'AVAILABLE-35' },
      { classType: 'SL', className: 'Sleeper Class (SL)', classNameTamil: 'படுக்கை வசதி', fare: 445, totalSeats: 100, availableSeats: 55, waitingListCount: 0, statusText: 'AVAILABLE-55' }
    ]
  },
  // 30. Thiruvananthapuram Mail TVC -> MAS
  {
    id: 'P902',
    number: '12624',
    name: 'Thiruvananthapuram Mail',
    nameTamil: 'திருவனந்தபுரம் மெயில்',
    sourceCode: 'TVC',
    destinationCode: 'MAS',
    departureTime: '17:15',
    arrivalTime: '08:35',
    duration: '15h 20m',
    runsOn: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    trainLengthMeters: 320,
    classes: [
      { classType: '1A', className: 'AC First Class (1A)', classNameTamil: 'ஏசி முதல் வகுப்பு', fare: 2850, totalSeats: 100, availableSeats: 12, waitingListCount: 0, statusText: 'AVAILABLE-12' },
      { classType: '2A', className: 'AC 2 Tier (2A)', classNameTamil: 'ஏசி 2 அடுக்கு', fare: 1720, totalSeats: 100, availableSeats: 22, waitingListCount: 0, statusText: 'AVAILABLE-22' },
      { classType: '3A', className: 'AC 3 Tier (3A)', classNameTamil: 'ஏசி 3 அடுக்கு', fare: 1210, totalSeats: 100, availableSeats: 40, waitingListCount: 0, statusText: 'AVAILABLE-40' },
      { classType: 'SL', className: 'Sleeper Class (SL)', classNameTamil: 'படுக்கை வசதி', fare: 445, totalSeats: 100, availableSeats: 60, waitingListCount: 0, statusText: 'AVAILABLE-60' }
    ]
  },
  // 31. Grand Trunk Superfast MAS -> NDLS
  {
    id: 'P903',
    number: '12615',
    name: 'Grand Trunk Superfast Express',
    nameTamil: 'கிராண்ட் டிரங்க் அதிவிரைவு வண்டி',
    sourceCode: 'MAS',
    destinationCode: 'NDLS',
    departureTime: '22:00',
    arrivalTime: '06:15',
    duration: '32h 15m',
    runsOn: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    trainLengthMeters: 340,
    classes: [
      { classType: '1A', className: 'AC First Class (1A)', classNameTamil: 'ஏசி முதல் வகுப்பு', fare: 4200, totalSeats: 100, availableSeats: 8, waitingListCount: 0, statusText: 'AVAILABLE-08' },
      { classType: '2A', className: 'AC 2 Tier (2A)', classNameTamil: 'ஏசி 2 அடுக்கு', fare: 2650, totalSeats: 100, availableSeats: 20, waitingListCount: 0, statusText: 'AVAILABLE-20' },
      { classType: '3A', className: 'AC 3 Tier (3A)', classNameTamil: 'ஏசி 3 அடுக்கு', fare: 1850, totalSeats: 100, availableSeats: 35, waitingListCount: 0, statusText: 'AVAILABLE-35' },
      { classType: 'SL', className: 'Sleeper Class (SL)', classNameTamil: 'படுக்கை வசதி', fare: 710, totalSeats: 100, availableSeats: 45, waitingListCount: 0, statusText: 'AVAILABLE-45' }
    ]
  },
  // 32. Grand Trunk Superfast NDLS -> MAS
  {
    id: 'P904',
    number: '12616',
    name: 'Grand Trunk Superfast Express',
    nameTamil: 'கிராண்ட் டிரங்க் அதிவிரைவு வண்டி',
    sourceCode: 'NDLS',
    destinationCode: 'MAS',
    departureTime: '22:30',
    arrivalTime: '07:10',
    duration: '32h 40m',
    runsOn: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    trainLengthMeters: 340,
    classes: [
      { classType: '1A', className: 'AC First Class (1A)', classNameTamil: 'ஏசி முதல் வகுப்பு', fare: 4200, totalSeats: 100, availableSeats: 10, waitingListCount: 0, statusText: 'AVAILABLE-10' },
      { classType: '2A', className: 'AC 2 Tier (2A)', classNameTamil: 'ஏசி 2 அடுக்கு', fare: 2650, totalSeats: 100, availableSeats: 18, waitingListCount: 0, statusText: 'AVAILABLE-18' },
      { classType: '3A', className: 'AC 3 Tier (3A)', classNameTamil: 'ஏசி 3 அடுக்கு', fare: 1850, totalSeats: 100, availableSeats: 30, waitingListCount: 0, statusText: 'AVAILABLE-30' },
      { classType: 'SL', className: 'Sleeper Class (SL)', classNameTamil: 'படுக்கை வசதி', fare: 710, totalSeats: 100, availableSeats: 50, waitingListCount: 0, statusText: 'AVAILABLE-50' }
    ]
  },
  // 33. Chennai - Mumbai CSMT MAS -> CSTM
  {
    id: 'P905',
    number: '22158',
    name: 'Chennai - Mumbai CSMT Express',
    nameTamil: 'சென்னை - மும்பை சி.எஸ்.எம்.டி எக்ஸ்பிரஸ்',
    sourceCode: 'MAS',
    destinationCode: 'CSTM',
    departureTime: '18:25',
    arrivalTime: '13:30',
    duration: '19h 05m',
    runsOn: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    trainLengthMeters: 320,
    classes: [
      { classType: '2A', className: 'AC 2 Tier (2A)', classNameTamil: 'ஏசி 2 அடுக்கு', fare: 2250, totalSeats: 100, availableSeats: 16, waitingListCount: 0, statusText: 'AVAILABLE-16' },
      { classType: '3A', className: 'AC 3 Tier (3A)', classNameTamil: 'ஏசி 3 அடுக்கு', fare: 1550, totalSeats: 100, availableSeats: 30, waitingListCount: 0, statusText: 'AVAILABLE-30' },
      { classType: 'SL', className: 'Sleeper Class (SL)', classNameTamil: 'படுக்கை வசதி', fare: 590, totalSeats: 100, availableSeats: 52, waitingListCount: 0, statusText: 'AVAILABLE-52' }
    ]
  },
  // 34. Mumbai CSMT - Chennai CSTM -> MAS
  {
    id: 'P906',
    number: '22157',
    name: 'Mumbai CSMT - Chennai Express',
    nameTamil: 'மும்பை சி.எஸ்.எம்.டி - சென்னை எக்ஸ்பிரஸ்',
    sourceCode: 'CSTM',
    destinationCode: 'MAS',
    departureTime: '14:00',
    arrivalTime: '09:15',
    duration: '19h 15m',
    runsOn: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    trainLengthMeters: 320,
    classes: [
      { classType: '2A', className: 'AC 2 Tier (2A)', classNameTamil: 'ஏசி 2 அடுக்கு', fare: 2250, totalSeats: 100, availableSeats: 14, waitingListCount: 0, statusText: 'AVAILABLE-14' },
      { classType: '3A', className: 'AC 3 Tier (3A)', classNameTamil: 'ஏசி 3 அடுக்கு', fare: 1550, totalSeats: 100, availableSeats: 28, waitingListCount: 0, statusText: 'AVAILABLE-28' },
      { classType: 'SL', className: 'Sleeper Class (SL)', classNameTamil: 'படுக்கை வசதி', fare: 590, totalSeats: 100, availableSeats: 48, waitingListCount: 0, statusText: 'AVAILABLE-48' }
    ]
  }
];
