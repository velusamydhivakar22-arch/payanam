import { DEMO_TRAINS } from '../data/trains';
import { DEMO_STATIONS } from '../data/stations';
import type {
  Train,
  Reservation,
  Passenger,
  BookingMode,
  TravelClass,
  Platform,
  PlatformRequest,
  Station,
  ConnectingItinerary
} from '../types/railway';

const STORAGE_KEYS = {
  RESERVATIONS: 'payanam_reservations',
  WAITING_LIST: 'payanam_waiting_list',
  PLATFORMS: 'payanam_platforms',
  PLATFORM_REQUESTS: 'payanam_platform_requests',
  PLATFORM_HISTORY: 'payanam_platform_history',
};

// Initial platform setup matching RailwaySystem.java
const INITIAL_PLATFORMS: Platform[] = [
  { platformId: 1, lengthMeters: 250, occupied: false },
  { platformId: 2, lengthMeters: 300, occupied: false },
  { platformId: 3, lengthMeters: 400, occupied: false },
];

export interface PromotionResult {
  promotedReservation: Reservation | null;
  seatReallocated: string | null;
  message: string;
}

class RailwayService {
  private trains: Train[] = [...DEMO_TRAINS];
  private stations: Station[] = [...DEMO_STATIONS];
  private listeners: Array<() => void> = [];

  constructor() {
    this.initStorage();
  }

  private initStorage() {
    if (!localStorage.getItem(STORAGE_KEYS.PLATFORMS)) {
      localStorage.setItem(STORAGE_KEYS.PLATFORMS, JSON.stringify(INITIAL_PLATFORMS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.RESERVATIONS)) {
      // Seed an initial demo booking to demonstrate My Bookings & Cancellation immediately
      const initialReservation: Reservation = {
        reservationId: 1001,
        pnr: 'PJ-4819284710',
        trainId: 'P101',
        trainNumber: '12638',
        trainName: 'Pandian Superfast Express',
        trainNameTamil: 'பாண்டியன் அதிவிரைவு வண்டி',
        sourceCode: 'MDU',
        sourceName: 'Madurai Junction',
        destinationCode: 'MS',
        destinationName: 'Chennai Egmore',
        travelDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
        bookingMode: 'NORMAL',
        travelClass: '2A',
        passengers: [
          {
            id: 'p-1',
            name: 'Karthik Subramanian',
            age: 32,
            gender: 'Male',
            berthPreference: 'LOWER',
            seatAssigned: 'A1-14 (Lower Berth)'
          }
        ],
        status: 'CONFIRMED',
        totalFare: 1350,
        paymentId: 'PAY-PJ-98324',
        bookingTimestamp: new Date().toISOString()
      };

      // Seed a waiting list passenger to show the waiting list & promotion
      const waitingReservation: Reservation = {
        reservationId: 1002,
        pnr: 'PJ-8492019482',
        trainId: 'P101',
        trainNumber: '12638',
        trainName: 'Pandian Superfast Express',
        trainNameTamil: 'பாண்டியன் அதிவிரைவு வண்டி',
        sourceCode: 'MDU',
        sourceName: 'Madurai Junction',
        destinationCode: 'MS',
        destinationName: 'Chennai Egmore',
        travelDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
        bookingMode: 'EMERGENCY', // High priority!
        travelClass: '2A',
        passengers: [
          {
            id: 'p-2',
            name: 'Priya Sundaram',
            age: 28,
            gender: 'Female',
            berthPreference: 'LOWER',
            emergencyReason: 'Medical Emergency Consultation',
            emergencyId: 'HOSP-MAD-9812'
          }
        ],
        status: 'WAITING_LIST',
        waitingListNumber: 1,
        totalFare: 1350,
        paymentId: 'PAY-PJ-98325',
        bookingTimestamp: new Date(Date.now() - 3600000).toISOString()
      };

      localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify([initialReservation, waitingReservation]));
    }
  }

  public subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  public getStations(): Station[] {
    return this.stations;
  }

  public getTrains(): Train[] {
    return this.trains;
  }

  public searchTrains(sourceCode: string, destinationCode: string): Train[] {
    const direct = this.trains.filter(
      (t) => t.sourceCode === sourceCode && t.destinationCode === destinationCode
    );
    if (direct.length > 0) {
      return direct;
    }

    // Chennai metropolitan twin-terminal intelligence (MAS <-> MS)
    if (sourceCode === 'MAS') {
      const sister = this.trains.filter((t) => t.sourceCode === 'MS' && t.destinationCode === destinationCode);
      if (sister.length > 0) return sister;
    } else if (sourceCode === 'MS') {
      const sister = this.trains.filter((t) => t.sourceCode === 'MAS' && t.destinationCode === destinationCode);
      if (sister.length > 0) return sister;
    }

    if (destinationCode === 'MAS') {
      const sister = this.trains.filter((t) => t.sourceCode === sourceCode && t.destinationCode === 'MS');
      if (sister.length > 0) return sister;
    } else if (destinationCode === 'MS') {
      const sister = this.trains.filter((t) => t.sourceCode === sourceCode && t.destinationCode === 'MAS');
      if (sister.length > 0) return sister;
    }

    return [];
  }

  /**
   * Generates connecting itineraries when no direct train exists or when Connecting Mode is selected
   */
  public searchConnectingItineraries(sourceCode: string, destinationCode: string): ConnectingItinerary[] {
    const itineraries: ConnectingItinerary[] = [];

    // Candidate intermediate junctions across Southern Railway
    const junctionHubs = ['TPJ', 'CBE', 'SA', 'MS', 'MAS', 'SBC', 'MDU'];

    for (const junc of junctionHubs) {
      if (junc === sourceCode || junc === destinationCode) continue;

      let leg1Trains = this.trains.filter((t) => t.sourceCode === sourceCode && t.destinationCode === junc);
      if (leg1Trains.length === 0) {
        if (sourceCode === 'MAS') leg1Trains = this.trains.filter((t) => t.sourceCode === 'MS' && t.destinationCode === junc);
        else if (sourceCode === 'MS') leg1Trains = this.trains.filter((t) => t.sourceCode === 'MAS' && t.destinationCode === junc);
      }

      let leg2Trains = this.trains.filter((t) => t.sourceCode === junc && t.destinationCode === destinationCode);
      if (leg2Trains.length === 0) {
        if (destinationCode === 'MAS') leg2Trains = this.trains.filter((t) => t.sourceCode === junc && t.destinationCode === 'MS');
        else if (destinationCode === 'MS') leg2Trains = this.trains.filter((t) => t.sourceCode === junc && t.destinationCode === 'MAS');
      }

      for (const leg1 of leg1Trains) {
        for (const leg2 of leg2Trains) {
          const layover = this.calculateLayoverMinutes(leg1.arrivalTime, leg2.departureTime);
          if (layover >= 30) {
            const juncStation = this.stations.find((s) => s.code === junc);
            const leg1Fare = leg1.classes[0]?.fare || 400;
            const leg2Fare = leg2.classes[0]?.fare || 400;

            itineraries.push({
              id: `conn-${leg1.id}-${leg2.id}`,
              leg1,
              leg2,
              junctionCode: junc,
              junctionName: juncStation ? juncStation.name : junc,
              junctionNameTamil: juncStation ? juncStation.nameTamil : junc,
              departureTime: leg1.departureTime,
              arrivalTime: leg2.arrivalTime,
              totalDuration: this.formatCombinedDuration(leg1.duration, leg2.duration, layover),
              layoverDuration: `${layover}m Layover`,
              combinedFare: leg1Fare + leg2Fare,
              availableClasses: ['2A', '3A', 'SL', 'CC']
            });
          }
        }
      }
    }

    return itineraries;
  }

  private calculateLayoverMinutes(arrTime: string, depTime: string): number {
    const [arrH, arrM] = arrTime.split(':').map(Number);
    const [depH, depM] = depTime.split(':').map(Number);
    let arrTotal = (arrH || 0) * 60 + (arrM || 0);
    let depTotal = (depH || 0) * 60 + (depM || 0);
    if (depTotal < arrTotal) {
      depTotal += 24 * 60; // Overnight
    }
    return depTotal - arrTotal;
  }

  private formatCombinedDuration(dur1: string, dur2: string, layoverMinutes: number): string {
    const parse = (d: string) => {
      const hm = d.match(/(\d+)\s*h/);
      const mm = d.match(/(\d+)\s*m/);
      return (hm ? parseInt(hm[1], 10) * 60 : 0) + (mm ? parseInt(mm[1], 10) : 0);
    };
    const total = parse(dur1) + parse(dur2) + layoverMinutes;
    const h = Math.floor(total / 60);
    const m = total % 60;
    return `${h}h ${m}m (Combined)`;
  }

  /**
   * Explicit, user-requested location discovery (Haversine calculation).
   * Never runs automatically on page load.
   */
  public getNearestStation(userLat: number, userLng: number): Station | null {
    if (!this.stations.length) return null;

    let nearest: Station = this.stations[0];
    let minDistance = Infinity;

    for (const stn of this.stations) {
      if (stn.lat && stn.lng) {
        const d = this.calculateDistanceKm(userLat, userLng, stn.lat, stn.lng);
        if (d < minDistance) {
          minDistance = d;
          nearest = stn;
        }
      }
    }

    return nearest;
  }

  private calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  public getReservations(): Reservation[] {
    const raw = localStorage.getItem(STORAGE_KEYS.RESERVATIONS);
    return raw ? JSON.parse(raw) : [];
  }

  public getReservationByPnr(pnr: string): Reservation | undefined {
    return this.getReservations().find((r) => r.pnr.trim().toUpperCase() === pnr.trim().toUpperCase());
  }

  /**
   * Core rule: Priority order: Emergency (1) > Connecting (2) > Normal (3).
   * FIFO ordering within each priority.
   * Total seats per class: 100.
   * Confirmed passengers are NEVER displaced by new incoming passengers.
   */
  public createBooking(params: {
    train: Train;
    travelClass: TravelClass;
    bookingMode: BookingMode;
    travelDate: string;
    passengers: Passenger[];
    paymentId: string;
    isConnecting?: boolean;
    connectingLegInfo?: string;
  }): Reservation {
    const allReservations = this.getReservations();
    const sourceStation = this.stations.find((s) => s.code === params.train.sourceCode);
    const destStation = this.stations.find((s) => s.code === params.train.destinationCode);

    // Filter confirmed reservations on this train, class, and date
    const existingForClass = allReservations.filter(
      (r) =>
        r.trainId === params.train.id &&
        r.travelClass === params.travelClass &&
        r.travelDate === params.travelDate &&
        r.status === 'CONFIRMED'
    );

    const totalConfirmedSeatsUsed = existingForClass.reduce(
      (sum, r) => sum + r.passengers.length,
      0
    );

    const classInfo = params.train.classes.find((c) => c.classType === params.travelClass);
    const farePerPerson = classInfo ? classInfo.fare : 500;
    const capacityLimit = classInfo ? classInfo.totalSeats : 100;

    const availableSeats = Math.max(0, capacityLimit - totalConfirmedSeatsUsed);
    const canConfirm = availableSeats >= params.passengers.length;

    // Collect already assigned seat numbers
    const usedSeats = new Set<string>();
    existingForClass.forEach((r) => {
      r.passengers.forEach((p) => {
        if (p.seatAssigned) usedSeats.add(p.seatAssigned);
      });
    });

    const reservationId = Date.now();
    const pnr = `PJ-${Math.floor(1000000000 + Math.random() * 9000000000)}`;

    const coachPrefix = this.getCoachPrefix(params.travelClass);
    const assignedPassengers: Passenger[] = params.passengers.map((p) => {
      if (canConfirm) {
        // Find next free seat in 1..100
        let seatNum = 1;
        while (usedSeats.has(`${coachPrefix}-${seatNum} (${p.berthPreference})`) ||
               usedSeats.has(`${coachPrefix}-${seatNum}`)) {
          seatNum++;
        }
        const seatLabel = `${coachPrefix}-${seatNum} (${this.formatBerthName(p.berthPreference)})`;
        usedSeats.add(seatLabel);
        return { ...p, seatAssigned: seatLabel };
      } else {
        return { ...p, seatAssigned: undefined };
      }
    });

    // If waitlist, calculate waitlist position
    let wlNumber: number | undefined = undefined;
    if (!canConfirm) {
      const existingWaitlist = allReservations.filter(
        (r) =>
          r.trainId === params.train.id &&
          r.travelClass === params.travelClass &&
          r.travelDate === params.travelDate &&
          r.status === 'WAITING_LIST'
      );
      wlNumber = existingWaitlist.length + 1;
    }

    const newReservation: Reservation = {
      reservationId,
      pnr,
      trainId: params.train.id,
      trainNumber: params.train.number,
      trainName: params.train.name,
      trainNameTamil: params.train.nameTamil,
      sourceCode: params.train.sourceCode,
      sourceName: sourceStation ? sourceStation.name : params.train.sourceCode,
      destinationCode: params.train.destinationCode,
      destinationName: destStation ? destStation.name : params.train.destinationCode,
      travelDate: params.travelDate,
      bookingMode: params.bookingMode,
      travelClass: params.travelClass,
      passengers: assignedPassengers,
      status: canConfirm ? 'CONFIRMED' : 'WAITING_LIST',
      waitingListNumber: wlNumber,
      totalFare: farePerPerson * params.passengers.length,
      paymentId: params.paymentId,
      bookingTimestamp: new Date().toISOString(),
      isConnectingItinerary: params.isConnecting,
      connectingLegInfo: params.connectingLegInfo
    };

    allReservations.push(newReservation);
    localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(allReservations));
    this.notify();

    return newReservation;
  }

  /**
   * For connecting itineraries:
   * Rule: Validate and reserve every required leg consistently.
   * Never leave a partially confirmed itinerary.
   * If both legs have confirmed seats available, both get CONFIRMED.
   * If either leg lacks capacity, both are placed into prioritized waiting list.
   */
  public createConnectingBooking(params: {
    itinerary: ConnectingItinerary;
    travelClass: TravelClass;
    bookingMode?: BookingMode;
    travelDate: string;
    passengers: Passenger[];
    paymentId: string;
  }): { resLeg1: Reservation; resLeg2: Reservation } {
    const allReservations = this.getReservations();
    const mode = params.bookingMode || 'NORMAL';

    // Check capacity for Leg 1
    const leg1Confirmed = allReservations.filter(
      (r) =>
        r.trainId === params.itinerary.leg1.id &&
        r.travelClass === params.travelClass &&
        r.travelDate === params.travelDate &&
        r.status === 'CONFIRMED'
    ).reduce((sum, r) => sum + r.passengers.length, 0);

    const leg1ClassInfo = params.itinerary.leg1.classes.find((c) => c.classType === params.travelClass);
    const leg1Limit = leg1ClassInfo ? leg1ClassInfo.totalSeats : 100;
    const leg1Avail = Math.max(0, leg1Limit - leg1Confirmed);

    // Check capacity for Leg 2
    const leg2Confirmed = allReservations.filter(
      (r) =>
        r.trainId === params.itinerary.leg2.id &&
        r.travelClass === params.travelClass &&
        r.travelDate === params.travelDate &&
        r.status === 'CONFIRMED'
    ).reduce((sum, r) => sum + r.passengers.length, 0);

    const leg2ClassInfo = params.itinerary.leg2.classes.find((c) => c.classType === params.travelClass);
    const leg2Limit = leg2ClassInfo ? leg2ClassInfo.totalSeats : 100;
    const leg2Avail = Math.max(0, leg2Limit - leg2Confirmed);

    // Atomic consistency: Both must have confirmed seats
    const bothConfirmed = (leg1Avail >= params.passengers.length) && (leg2Avail >= params.passengers.length);

    // Leg 1 booking
    const leg1Info = `Leg 1 of 2 (${params.itinerary.leg1.sourceCode} ➔ ${params.itinerary.junctionCode}). Connecting to ${params.itinerary.leg2.number} at ${params.itinerary.junctionName}`;
    const leg2Info = `Leg 2 of 2 (${params.itinerary.junctionCode} ➔ ${params.itinerary.leg2.destinationCode}). Connected from ${params.itinerary.leg1.number} at ${params.itinerary.junctionName}`;

    const resLeg1 = this.createBooking({
      train: params.itinerary.leg1,
      travelClass: params.travelClass,
      bookingMode: mode,
      travelDate: params.travelDate,
      passengers: params.passengers,
      paymentId: `${params.paymentId}-L1`,
      isConnecting: true,
      connectingLegInfo: leg1Info
    });

    // Link Leg 1 PNR to passengers for Leg 2
    const passengersWithRef = params.passengers.map(p => ({
      ...p,
      connectingPnr: resLeg1.pnr
    }));

    const resLeg2 = this.createBooking({
      train: params.itinerary.leg2,
      travelClass: params.travelClass,
      bookingMode: mode,
      travelDate: params.travelDate,
      passengers: passengersWithRef,
      paymentId: `${params.paymentId}-L2`,
      isConnecting: true,
      connectingLegInfo: leg2Info
    });

    // Enforce atomic consistency: if not bothConfirmed, ensure neither is partially confirmed
    if (!bothConfirmed) {
      const updated = this.getReservations().map(r => {
        if (r.reservationId === resLeg1.reservationId || r.reservationId === resLeg2.reservationId) {
          return {
            ...r,
            status: 'WAITING_LIST' as const,
            waitingListNumber: r.waitingListNumber || 1,
            passengers: r.passengers.map(p => ({ ...p, seatAssigned: undefined }))
          };
        }
        return r;
      });
      localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(updated));
      this.notify();
    }

    return { resLeg1, resLeg2 };
  }

  /**
   * Cancellation logic:
   * When a confirmed booking is cancelled:
   * 1. Release its seats.
   * 2. Automatically find waiting list passengers on same train & class.
   * 3. Sort waiting list by PRIORITY: Emergency > Connecting > Normal.
   * 4. Within same priority, sort FIFO (bookingTimestamp).
   * 5. Promote highest priority waiting passenger to CONFIRMED and allocate released seat!
   * 6. Recalculate waiting list positions for remaining passengers.
   */
  public cancelReservation(pnr: string): PromotionResult {
    const allReservations = this.getReservations();
    const index = allReservations.findIndex((r) => r.pnr === pnr);

    if (index === -1) {
      return { promotedReservation: null, seatReallocated: null, message: 'Reservation not found.' };
    }

    const targetReservation = allReservations[index];
    if (targetReservation.status === 'CANCELLED') {
      return { promotedReservation: null, seatReallocated: null, message: 'Already cancelled.' };
    }

    const wasConfirmed = targetReservation.status === 'CONFIRMED';
    const releasedSeats = targetReservation.passengers
      .map((p) => p.seatAssigned)
      .filter((s): s is string => Boolean(s));

    // Mark reservation as CANCELLED
    targetReservation.status = 'CANCELLED';

    let promotedReservation: Reservation | null = null;
    let seatReallocated: string | null = null;

    if (wasConfirmed && releasedSeats.length > 0) {
      // Find all waiting list reservations on this train, class, and date
      const waitingList = allReservations.filter(
        (r) =>
          r.trainId === targetReservation.trainId &&
          r.travelClass === targetReservation.travelClass &&
          r.travelDate === targetReservation.travelDate &&
          r.status === 'WAITING_LIST'
      );

      if (waitingList.length > 0) {
        // Sort priority: Emergency (1) > Connecting (2) > Normal (3), then FIFO by timestamp
        const priorityScore = (mode: BookingMode) => {
          if (mode === 'EMERGENCY') return 1;
          if (mode === 'CONNECTING') return 2;
          return 3;
        };

        waitingList.sort((a, b) => {
          const scoreDiff = priorityScore(a.bookingMode) - priorityScore(b.bookingMode);
          if (scoreDiff !== 0) return scoreDiff;
          return new Date(a.bookingTimestamp).getTime() - new Date(b.bookingTimestamp).getTime();
        });

        // Promote the top candidate that can fit into the released seat(s)
        const candidate = waitingList[0];
        const assignedSeat = releasedSeats[0];
        seatReallocated = assignedSeat;

        candidate.status = 'CONFIRMED';
        candidate.waitingListNumber = undefined;
        if (candidate.passengers.length > 0) {
          candidate.passengers[0].seatAssigned = assignedSeat;
        }

        promotedReservation = candidate;

        // Recalculate remaining waiting list positions
        const remainingWaiting = waitingList.slice(1);
        remainingWaiting.forEach((rem, idx) => {
          rem.waitingListNumber = idx + 1;
        });
      }
    } else if (!wasConfirmed) {
      // If waiting list passenger cancelled, recalculate waiting list for others
      const otherWaiting = allReservations.filter(
        (r) =>
          r.trainId === targetReservation.trainId &&
          r.travelClass === targetReservation.travelClass &&
          r.travelDate === targetReservation.travelDate &&
          r.status === 'WAITING_LIST' &&
          r.pnr !== targetReservation.pnr
      );
      otherWaiting.forEach((rem, idx) => {
        rem.waitingListNumber = idx + 1;
      });
    }

    localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(allReservations));
    this.notify();

    const message = promotedReservation
      ? `Booking ${pnr} cancelled. Seat ${seatReallocated} reallocated to waiting passenger ${promotedReservation.passengers[0]?.name} (${promotedReservation.bookingMode} priority promoted to CONFIRMED).`
      : `Booking ${pnr} successfully cancelled. Full refund initiated.`;

    return {
      promotedReservation,
      seatReallocated,
      message
    };
  }

  // --- SMART PLATFORM ALLOCATION (Section 6) ---

  public getPlatforms(): Platform[] {
    const raw = localStorage.getItem(STORAGE_KEYS.PLATFORMS);
    return raw ? JSON.parse(raw) : INITIAL_PLATFORMS;
  }

  public getPlatformRequests(): PlatformRequest[] {
    const raw = localStorage.getItem(STORAGE_KEYS.PLATFORM_REQUESTS);
    if (!raw) {
      // Seed demonstration platform requests mirroring RailwaySystem.java
      const initialRequests: PlatformRequest[] = [
        {
          id: 'req-1',
          trainId: 'P101',
          trainName: 'Payanam Express',
          type: 'NORMAL',
          arrivalTime: '08:00',
          departureTime: '08:30',
          lengthMeters: 280,
          priorityRank: 3,
          requestOrder: 1,
          status: 'PENDING'
        },
        {
          id: 'req-2',
          trainId: 'P202',
          trainName: 'Junction Intercity (Connecting)',
          type: 'CONNECTION',
          arrivalTime: '08:15',
          departureTime: '08:45',
          lengthMeters: 250,
          priorityRank: 2,
          requestOrder: 2,
          status: 'PENDING'
        },
        {
          id: 'req-3',
          trainId: 'P999',
          trainName: 'Emergency Medical Special',
          type: 'EMERGENCY',
          arrivalTime: '08:20',
          departureTime: '08:40',
          lengthMeters: 220,
          priorityRank: 1, // Emergency gets highest rank!
          requestOrder: 3,
          status: 'PENDING'
        }
      ];
      localStorage.setItem(STORAGE_KEYS.PLATFORM_REQUESTS, JSON.stringify(initialRequests));
      return initialRequests;
    }
    return JSON.parse(raw);
  }

  public addPlatformRequest(req: Omit<PlatformRequest, 'id' | 'requestOrder' | 'status' | 'priorityRank'> & { type: 'EMERGENCY' | 'CONNECTION' | 'NORMAL' }): PlatformRequest {
    const requests = this.getPlatformRequests();
    const rank = req.type === 'EMERGENCY' ? 1 : req.type === 'CONNECTION' ? 2 : 3;
    const newRequest: PlatformRequest = {
      ...req,
      id: `req-${Date.now()}`,
      priorityRank: rank,
      requestOrder: requests.length + 1,
      status: 'PENDING'
    };

    requests.push(newRequest);
    localStorage.setItem(STORAGE_KEYS.PLATFORM_REQUESTS, JSON.stringify(requests));
    this.addPlatformHistory(`Platform request queued for ${newRequest.trainId} (${newRequest.trainName}) with Priority Rank ${rank} [${newRequest.type}]`);
    this.notify();
    return newRequest;
  }

  /**
   * Process next request matching DefaultPlatformAllocationPolicy.java:
   * 1. Priority ranking (Emergency: 1 > Connection: 2 > Normal: 3), then requestOrder.
   * 2. Platform selection:
   *    - Must satisfy platform.lengthMeters >= request.lengthMeters
   *    - Platform must not be occupied at request arrival time
   *    - Allocate best-fit platform
   *    - Set release time = departureTime + 5 minutes clearance buffer
   */
  public processPlatformRequest(): { success: boolean; message: string; allocatedPlatform?: Platform } {
    const requests = this.getPlatformRequests();
    const pending = requests.filter((r) => r.status === 'PENDING');

    if (pending.length === 0) {
      return { success: false, message: 'Platform queue is empty. No pending requests.' };
    }

    // Sort by priorityRank (1 is highest), then requestOrder
    pending.sort((a, b) => {
      if (a.priorityRank !== b.priorityRank) return a.priorityRank - b.priorityRank;
      return a.requestOrder - b.requestOrder;
    });

    const targetRequest = pending[0];
    const platforms = this.getPlatforms();

    // Check available platform that fits train length
    const suitablePlatform = platforms.find(
      (p) => !p.occupied && p.lengthMeters >= targetRequest.lengthMeters
    );

    if (!suitablePlatform) {
      return {
        success: false,
        message: `No suitable platform available for train ${targetRequest.trainId} (Length: ${targetRequest.lengthMeters}m). All platforms occupied or insufficient length.`
      };
    }

    // Allocate platform with 5 min buffer
    const releaseTime = this.addMinutes(targetRequest.departureTime, 5);
    suitablePlatform.occupied = true;
    suitablePlatform.currentTrainId = targetRequest.trainId;
    suitablePlatform.currentTrainName = targetRequest.trainName;
    suitablePlatform.arrivalTime = targetRequest.arrivalTime;
    suitablePlatform.releaseTime = releaseTime;

    targetRequest.status = 'ALLOCATED';
    targetRequest.allocatedPlatformId = suitablePlatform.platformId;

    localStorage.setItem(STORAGE_KEYS.PLATFORMS, JSON.stringify(platforms));
    localStorage.setItem(STORAGE_KEYS.PLATFORM_REQUESTS, JSON.stringify(requests));
    this.addPlatformHistory(
      `Platform ${suitablePlatform.platformId} (${suitablePlatform.lengthMeters}m) allocated to ${targetRequest.trainName} [${targetRequest.trainId}]. Occupied until ${releaseTime} (+5 min buffer).`
    );
    this.notify();

    return {
      success: true,
      message: `Platform ${suitablePlatform.platformId} allocated to ${targetRequest.trainName}. Release time: ${releaseTime}`,
      allocatedPlatform: suitablePlatform
    };
  }

  public releasePlatform(platformId: number): void {
    const platforms = this.getPlatforms();
    const platform = platforms.find((p) => p.platformId === platformId);
    if (platform && platform.occupied) {
      const trainName = platform.currentTrainName || platform.currentTrainId;
      platform.occupied = false;
      platform.currentTrainId = undefined;
      platform.currentTrainName = undefined;
      platform.arrivalTime = undefined;
      platform.releaseTime = undefined;

      localStorage.setItem(STORAGE_KEYS.PLATFORMS, JSON.stringify(platforms));
      this.addPlatformHistory(`Platform ${platformId} released and clear for next arrival (Train ${trainName} departed).`);
      this.notify();
    }
  }

  public delayTrainPlatform(trainId: string, delayMinutes: number): boolean {
    const platforms = this.getPlatforms();
    const platform = platforms.find((p) => p.currentTrainId === trainId);
    if (platform && platform.releaseTime) {
      platform.releaseTime = this.addMinutes(platform.releaseTime, delayMinutes);
      localStorage.setItem(STORAGE_KEYS.PLATFORMS, JSON.stringify(platforms));
      this.addPlatformHistory(`Train ${trainId} delayed by ${delayMinutes} minutes. Platform ${platform.platformId} release pushed to ${platform.releaseTime}.`);
      this.notify();
      return true;
    }
    return false;
  }

  public getPlatformHistory(): string[] {
    const raw = localStorage.getItem(STORAGE_KEYS.PLATFORM_HISTORY);
    return raw ? JSON.parse(raw) : [
      'System initialized with Platforms 1 (250m), 2 (300m), 3 (400m)',
      'Platform allocation engine online with 5-minute clearance buffer and Emergency Priority Override'
    ];
  }

  private addPlatformHistory(entry: string) {
    const history = this.getPlatformHistory();
    history.unshift(`[${new Date().toLocaleTimeString()}] ${entry}`);
    if (history.length > 50) history.pop();
    localStorage.setItem(STORAGE_KEYS.PLATFORM_HISTORY, JSON.stringify(history));
  }

  private addMinutes(timeStr: string, minutes: number): string {
    const parts = timeStr.split(':');
    let h = parseInt(parts[0], 10);
    let m = parseInt(parts[1], 10) + minutes;
    while (m >= 60) {
      m -= 60;
      h = (h + 1) % 24;
    }
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  }

  private getCoachPrefix(c: TravelClass): string {
    switch (c) {
      case '1A': return 'H1';
      case '2A': return 'A1';
      case '3A': return 'B1';
      case 'CC': return 'C1';
      case 'EC': return 'E1';
      case 'SL': return 'S1';
      default: return 'C1';
    }
  }

  private formatBerthName(berth: string): string {
    switch (berth) {
      case 'LOWER': return 'Lower Berth';
      case 'MIDDLE': return 'Middle Berth';
      case 'UPPER': return 'Upper Berth';
      case 'SIDE_LOWER': return 'Side Lower';
      case 'SIDE_UPPER': return 'Side Upper';
      case 'WINDOW': return 'Window Seat';
      default: return 'Standard';
    }
  }
}

export const railwayService = new RailwayService();
