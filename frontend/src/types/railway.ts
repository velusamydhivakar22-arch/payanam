export type BookingMode = 'NORMAL' | 'CONNECTING' | 'EMERGENCY';

export type TravelClass = '1A' | '2A' | '3A' | 'CC' | 'EC' | 'SL';

export interface Station {
  code: string;
  name: string;
  nameTamil: string;
  state: string;
  junctionType: string;
  platformsCount: number;
  lat: number;
  lng: number;
}

export interface ClassAvailability {
  classType: TravelClass;
  className: string;
  classNameTamil: string;
  fare: number;
  totalSeats: number;
  availableSeats: number;
  waitingListCount: number;
  statusText: string;
}

export interface Train {
  id: string;
  number: string;
  name: string;
  nameTamil: string;
  sourceCode: string;
  destinationCode: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  runsOn: string[];
  classes: ClassAvailability[];
  trainLengthMeters: number;
}

export interface ConnectingItinerary {
  id: string;
  leg1: Train;
  leg2: Train;
  junctionCode: string;
  junctionName: string;
  junctionNameTamil: string;
  departureTime: string;
  arrivalTime: string;
  totalDuration: string;
  layoverDuration: string;
  combinedFare: number;
  availableClasses: TravelClass[];
}

export interface Passenger {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Transgender';
  berthPreference: 'LOWER' | 'MIDDLE' | 'UPPER' | 'SIDE_LOWER' | 'SIDE_UPPER' | 'WINDOW' | 'NO_PREF';
  seatAssigned?: string;
  emergencyReason?: string;
  emergencyId?: string;
  connectingPnr?: string;
}

export interface Reservation {
  reservationId: number;
  pnr: string;
  trainId: string;
  trainNumber: string;
  trainName: string;
  trainNameTamil: string;
  sourceCode: string;
  sourceName: string;
  destinationCode: string;
  destinationName: string;
  travelDate: string;
  bookingMode: BookingMode;
  travelClass: TravelClass;
  passengers: Passenger[];
  status: 'CONFIRMED' | 'WAITING_LIST' | 'CANCELLED';
  waitingListNumber?: number;
  totalFare: number;
  paymentId: string;
  bookingTimestamp: string;
  isConnectingItinerary?: boolean;
  connectingLegInfo?: string;
}

export interface Platform {
  platformId: number;
  lengthMeters: number;
  occupied: boolean;
  currentTrainId?: string;
  currentTrainName?: string;
  arrivalTime?: string;
  releaseTime?: string;
}

export interface PlatformRequest {
  id: string;
  trainId: string;
  trainName: string;
  type: 'EMERGENCY' | 'CONNECTION' | 'NORMAL';
  arrivalTime: string;
  departureTime: string;
  lengthMeters: number;
  priorityRank: number; // 1: Emergency, 2: Connection, 3: Normal
  requestOrder: number;
  status: 'PENDING' | 'ALLOCATED' | 'DELAYED';
  allocatedPlatformId?: number;
}

export type Language = 'en' | 'ta';

export interface SearchParams {
  source: string;
  destination: string;
  date: string;
  passengerCount: number;
  bookingMode: BookingMode;
}
