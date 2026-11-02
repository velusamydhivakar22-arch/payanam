import type { Train, Reservation, Station, Platform, BookingMode, TravelClass, Passenger } from '../types/railway';
import { railwayService } from './railwayService';

const BACKEND_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || '/api/v1';

class ApiClient {
  private backendAvailable: boolean | null = null;
  private token: string | null = localStorage.getItem('payanam_auth_token');

  public setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('payanam_auth_token', token);
    } else {
      localStorage.removeItem('payanam_auth_token');
    }
  }

  public getToken(): string | null {
    return this.token;
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  public async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/stations`, { method: 'GET', signal: AbortSignal.timeout(8000) });
      this.backendAvailable = res.ok;
      return res.ok;
    } catch {
      this.backendAvailable = false;
      return false;
    }
  }

  public isBackendOnline(): boolean {
    return Boolean(this.backendAvailable);
  }

  public async login(email: string, password: string): Promise<{ success: boolean; token?: string; user?: any; error?: string }> {
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        signal: AbortSignal.timeout(10000)
      });
      if (res.ok) {
        const data = await res.json();
        this.setToken(data.token);
        this.backendAvailable = true;
        return { success: true, token: data.token, user: { name: data.fullName, email: data.email, role: data.role } };
      }
      const err = await res.json().catch(() => ({}));
      return { success: false, error: err.message || 'Invalid credentials' };
    } catch {
      // Local fallback
      return { success: true, user: { name: email.split('@')[0], email } };
    }
  }

  public async register(email: string, password: string, fullName: string, phone?: string): Promise<{ success: boolean; token?: string; user?: any; error?: string }> {
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, fullName, phone }),
        signal: AbortSignal.timeout(10000)
      });
      if (res.ok) {
        const data = await res.json();
        this.setToken(data.token);
        this.backendAvailable = true;
        return { success: true, token: data.token, user: { name: data.fullName, email: data.email, role: data.role } };
      }
      const err = await res.json().catch(() => ({}));
      return { success: false, error: err.message || 'Registration failed' };
    } catch {
      // Local fallback
      return { success: true, user: { name: fullName, email } };
    }
  }

  public async getStations(): Promise<Station[]> {
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/stations`, { signal: AbortSignal.timeout(10000) });
      if (res.ok) {
        this.backendAvailable = true;
        const data = await res.json();
        return data.map((d: any) => ({
          code: d.code,
          name: d.name,
          nameTamil: d.nameTamil,
          state: d.state,
          junctionType: d.junctionType,
          platformsCount: d.platformsCount,
          lat: d.lat || 13.08,
          lng: d.lng || 80.27
        }));
      }
    } catch {
      this.backendAvailable = false;
    }
    return railwayService.getStations();
  }

  public async searchTrains(sourceCode: string, destinationCode: string, mode?: BookingMode): Promise<Train[]> {
    try {
      const modeParam = mode ? `&mode=${encodeURIComponent(mode)}` : '';
      const res = await fetch(
        `${BACKEND_BASE_URL}/trains/search?source=${encodeURIComponent(sourceCode)}&destination=${encodeURIComponent(destinationCode)}${modeParam}`,
        { signal: AbortSignal.timeout(10000) }
      );
      if (res.ok) {
        this.backendAvailable = true;
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          return data.map((t: any) => ({
            id: t.id,
            number: t.number,
            name: t.name,
            nameTamil: t.nameTamil || t.name,
            sourceCode: t.sourceCode,
            destinationCode: t.destinationCode,
            departureTime: t.departureTime,
            arrivalTime: t.arrivalTime,
            duration: t.duration,
            runsOn: t.runsOn || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            trainLengthMeters: t.trainLengthMeters || 300,
            classes: (t.classes || []).map((c: any) => ({
              classType: c.classType,
              className: c.className,
              classNameTamil: c.classNameTamil || c.className,
              fare: Number(c.fare),
              totalSeats: c.totalSeats || 100,
              availableSeats: c.availableSeats,
              waitingListCount: c.waitingListCount || 0,
              statusText: c.statusText || (c.availableSeats > 0 ? `AVAILABLE-${c.availableSeats}` : `WL-${c.waitingListCount}`)
            }))
          }));
        }
      }
    } catch {
      this.backendAvailable = false;
    }
    return railwayService.searchTrains(sourceCode, destinationCode);
  }

  public async searchConnectingRoutes(sourceCode: string, destinationCode: string, mode?: BookingMode): Promise<any[]> {
    try {
      const modeParam = mode ? `&mode=${encodeURIComponent(mode)}` : '';
      const res = await fetch(
        `${BACKEND_BASE_URL}/trains/connecting?source=${encodeURIComponent(sourceCode)}&destination=${encodeURIComponent(destinationCode)}${modeParam}`,
        { signal: AbortSignal.timeout(10000) }
      );
      if (res.ok) {
        this.backendAvailable = true;
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          return data.map((item: any) => ({
            ...item,
            combinedFare: Number(item.combinedFare) || 600,
            leg1: {
              ...item.leg1,
              runsOn: item.leg1?.runsOn || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
              trainLengthMeters: item.leg1?.trainLengthMeters || 300,
              classes: (item.leg1?.classes || []).map((c: any) => ({
                ...c,
                fare: Number(c.fare),
                statusText: c.statusText || (c.availableSeats > 0 ? `AVAILABLE-${c.availableSeats}` : `WL-${c.waitingListCount}`)
              }))
            },
            leg2: {
              ...item.leg2,
              runsOn: item.leg2?.runsOn || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
              trainLengthMeters: item.leg2?.trainLengthMeters || 300,
              classes: (item.leg2?.classes || []).map((c: any) => ({
                ...c,
                fare: Number(c.fare),
                statusText: c.statusText || (c.availableSeats > 0 ? `AVAILABLE-${c.availableSeats}` : `WL-${c.waitingListCount}`)
              }))
            }
          }));
        }
      }
    } catch {
      this.backendAvailable = false;
    }
    return railwayService.searchConnectingItineraries(sourceCode, destinationCode);
  }

  public async createBooking(params: {
    train: Train;
    travelClass: TravelClass;
    bookingMode: BookingMode;
    travelDate: string;
    passengers: Passenger[];
    paymentId: string;
    isConnecting?: boolean;
    connectingLegInfo?: string;
  }): Promise<Reservation> {
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/reservations/book`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          trainId: params.train.id,
          travelClass: params.travelClass,
          travelDate: params.travelDate,
          bookingMode: params.bookingMode,
          totalFare: (params.train.classes.find((c) => c.classType === params.travelClass)?.fare || 500) * params.passengers.length,
          paymentId: params.paymentId,
          passengers: params.passengers.map((p) => ({
            name: p.name,
            age: p.age,
            gender: p.gender,
            berthPreference: p.berthPreference,
            emergencyReason: p.emergencyReason,
            emergencyId: p.emergencyId,
            connectingPnr: p.connectingPnr
          }))
        }),
        signal: AbortSignal.timeout(10000)
      });
      if (res.ok) {
        this.backendAvailable = true;
        return await res.json();
      }
    } catch {
      this.backendAvailable = false;
    }
    return railwayService.createBooking(params);
  }

  public async cancelBooking(pnr: string): Promise<{ success: boolean; message: string }> {
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/reservations/cancel/${encodeURIComponent(pnr)}`, {
        method: 'POST',
        headers: this.getHeaders(),
        signal: AbortSignal.timeout(10000)
      });
      if (res.ok) {
        this.backendAvailable = true;
        const data = await res.json();
        return { success: true, message: data.message };
      }
    } catch {
      this.backendAvailable = false;
    }
    const local = railwayService.cancelReservation(pnr);
    return { success: true, message: local.message };
  }

  public async createConnectingBooking(params: {
    leg1TrainId: string;
    leg2TrainId: string;
    junctionCode: string;
    travelClass: TravelClass;
    travelDate: string;
    bookingMode?: BookingMode;
    passengers: Passenger[];
    totalFare: number;
    paymentId: string;
  }): Promise<any> {
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/reservations/book-connecting`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          ...params,
          bookingMode: params.bookingMode || 'NORMAL'
        }),
        signal: AbortSignal.timeout(10000)
      });
      if (res.ok) {
        this.backendAvailable = true;
        return await res.json();
      }
    } catch {
      this.backendAvailable = false;
    }
    return null;
  }

  public async getMyBookings(): Promise<Reservation[]> {
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/reservations/my-bookings`, {
        method: 'GET',
        headers: this.getHeaders(),
        signal: AbortSignal.timeout(10000)
      });
      if (res.ok) {
        this.backendAvailable = true;
        return await res.json();
      }
    } catch {
      this.backendAvailable = false;
    }
    return railwayService.getReservations();
  }

  public async getPlatforms(): Promise<Platform[]> {
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/platforms`, { signal: AbortSignal.timeout(10000) });
      if (res.ok) {
        this.backendAvailable = true;
        return await res.json();
      }
    } catch {
      this.backendAvailable = false;
    }
    return railwayService.getPlatforms();
  }
}

export const apiClient = new ApiClient();
