import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { SearchForm } from './components/SearchForm';
import { SearchResults } from './components/SearchResults';
import { SeatSelectionModal } from './components/SeatSelectionModal';
import { PassengerDetailsModal } from './components/PassengerDetailsModal';
import { PaymentModal } from './components/PaymentModal';
import { BookingConfirmationView } from './components/BookingConfirmationView';
import { MyBookingsView } from './components/MyBookingsView';
import { OperationsDashboard } from './components/OperationsDashboard';
import { NearbyStationsView } from './components/NearbyStationsView';
import { HelpView } from './components/HelpView';
import { AuthModal } from './components/AuthModal';
import { UserProfileView } from './components/UserProfileView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { NotFoundView } from './components/NotFoundView';
import { Footer } from './components/Footer';

import type {
  Train,
  TravelClass,
  Passenger,
  Reservation,
  SearchParams,
  Language,
  ConnectingItinerary,
  Station
} from './types/railway';
import { railwayService } from './services/railwayService';
import { apiClient } from './services/apiClient';

export function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [currentTab, setCurrentTab] = useState<string>('home');

  // Search state
  const [stations, setStations] = useState<Station[]>(railwayService.getStations());
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const [searchResults, setSearchResults] = useState<Train[]>([]);
  const [connectingResults, setConnectingResults] = useState<ConnectingItinerary[]>([]);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Booking Flow state
  const [selectedTrain, setSelectedTrain] = useState<Train | null>(null);
  const [selectedConnectingItinerary, setSelectedConnectingItinerary] = useState<ConnectingItinerary | null>(null);
  const [selectedClass, setSelectedClass] = useState<TravelClass | null>(null);
  const [selectedBerths, setSelectedBerths] = useState<Array<{ berth: any; label: string }>>([]);

  const [isSeatModalOpen, setIsSeatModalOpen] = useState<boolean>(false);
  const [isPassengerModalOpen, setIsPassengerModalOpen] = useState<boolean>(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);

  const [pendingPassengers, setPendingPassengers] = useState<Passenger[]>([]);
  const [lastConfirmedReservation, setLastConfirmedReservation] = useState<Reservation | null>(null);

  // Bookings list state
  const [reservations, setReservations] = useState<Reservation[]>(railwayService.getReservations());

  // User auth state
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Load live stations from backend on mount
  useEffect(() => {
    async function loadStations() {
      try {
        const backendStations = await apiClient.getStations();
        if (backendStations && backendStations.length > 0) {
          setStations(backendStations);
        }
      } catch (err) {
        console.warn('Backend stations endpoint unavailable, falling back to local dataset', err);
      }
    }
    loadStations();
  }, []);

  // Subscribe to service changes (for cancellations, reallocations, new bookings)
  useEffect(() => {
    const unsubscribe = railwayService.subscribe(() => {
      setReservations(railwayService.getReservations());
    });
    return unsubscribe;
  }, []);

  const activeBookingsCount = reservations.filter((r) => r.status === 'CONFIRMED').length;

  // Search handler (fetches direct and connecting trains from backend with fallback)
  const handleSearch = async (params: SearchParams) => {
    setIsSearching(true);
    setSearchParams(params);

    try {
      const [directResults, connecting] = await Promise.all([
        apiClient.searchTrains(params.source, params.destination, params.bookingMode),
        apiClient.searchConnectingRoutes(params.source, params.destination, params.bookingMode)
      ]);
      setSearchResults(directResults);
      setConnectingResults(connecting);
      setHasSearched(true);
      setIsSearching(false);
      setCurrentTab('search');
    } catch (e) {
      console.warn('Backend search error, falling back to local service', e);
      const results = railwayService.searchTrains(params.source, params.destination);
      const connecting = railwayService.searchConnectingItineraries(params.source, params.destination);
      setSearchResults(results);
      setConnectingResults(connecting);
      setHasSearched(true);
      setIsSearching(false);
      setCurrentTab('search');
    }

    setTimeout(() => {
      const resultsEl = document.getElementById('search-results-section');
      if (resultsEl) {
        resultsEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  // Step 1: User selects train and travel class from search results
  const handleSelectTrainClass = (train: Train, travelClass: TravelClass) => {
    setSelectedConnectingItinerary(null);
    setSelectedTrain(train);
    setSelectedClass(travelClass);
    setIsSeatModalOpen(true);
  };

  // Step 1b: User selects connecting itinerary (atomic multi-leg journey)
  const handleSelectConnectingItinerary = (itinerary: ConnectingItinerary, travelClass: TravelClass) => {
    setSelectedConnectingItinerary(itinerary);
    setSelectedTrain(itinerary.leg1);
    setSelectedClass(travelClass);
    setIsSeatModalOpen(true);
  };

  // Step 2: User confirms berths in seat modal
  const handleConfirmSeats = (berths: Array<{ berth: any; label: string }>) => {
    setSelectedBerths(berths);
    setIsSeatModalOpen(false);
    setIsPassengerModalOpen(true);
  };

  // Step 3: User submits passenger details
  const handlePassengerSubmit = (passengers: Passenger[]) => {
    setPendingPassengers(passengers);
    setIsPassengerModalOpen(false);
    setIsPaymentModalOpen(true);
  };

  // Step 4: User completes simulated payment -> creates reservation
  const handlePaymentSuccess = async (paymentId: string) => {
    if (!selectedTrain || !selectedClass || !searchParams) return;

    if (selectedConnectingItinerary) {
      // First try backend connecting booking
      try {
        await apiClient.createConnectingBooking({
          leg1TrainId: selectedConnectingItinerary.leg1.id,
          leg2TrainId: selectedConnectingItinerary.leg2.id,
          junctionCode: selectedConnectingItinerary.junctionCode,
          travelClass: selectedClass,
          travelDate: searchParams.date,
          bookingMode: searchParams.bookingMode,
          passengers: pendingPassengers,
          totalFare: selectedConnectingItinerary.combinedFare * searchParams.passengerCount,
          paymentId
        });
      } catch (e) {
        console.warn('Backend connecting booking error', e);
      }

      // Atomic booking of both Leg 1 and Leg 2 in local reactive store
      const { resLeg1 } = railwayService.createConnectingBooking({
        itinerary: selectedConnectingItinerary,
        travelClass: selectedClass,
        bookingMode: searchParams.bookingMode,
        travelDate: searchParams.date,
        passengers: pendingPassengers,
        paymentId
      });

      setIsPaymentModalOpen(false);
      setSelectedConnectingItinerary(null);
      setLastConfirmedReservation(resLeg1);
      setCurrentTab('confirmation');
    } else {
      // First try backend direct booking
      try {
        await apiClient.createBooking({
          train: selectedTrain,
          travelClass: selectedClass,
          bookingMode: searchParams.bookingMode,
          travelDate: searchParams.date,
          passengers: pendingPassengers,
          paymentId
        });
      } catch (e) {
        console.warn('Backend booking error', e);
      }

      const newRes = railwayService.createBooking({
        train: selectedTrain,
        travelClass: selectedClass,
        bookingMode: searchParams.bookingMode,
        travelDate: searchParams.date,
        passengers: pendingPassengers,
        paymentId
      });

      setIsPaymentModalOpen(false);
      setLastConfirmedReservation(newRes);
      setCurrentTab('confirmation');
    }
  };

  const handleSelectStationAsSource = (_stationCode: string) => {
    setCurrentTab('home');
    window.scrollTo({ top: 350, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-railway-500 selection:text-white">
      
      {/* Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        language={language}
        onLanguageChange={setLanguage}
        activeBookingsCount={activeBookingsCount}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        user={user}
        onLogout={() => setUser(null)}
      />

      {/* Main Content Areas based on currentTab */}
      <main className="flex-1">
        
        {/* HOME & BOOKING TAB */}
        {(currentTab === 'home' || currentTab === 'search') && (
          <div>
            {/* Hero Section */}
            <HeroSection
              language={language}
              onExploreClick={() => {
                const searchEl = document.getElementById('booking-search-form');
                if (searchEl) {
                  searchEl.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            />

            {/* Functional Homepage Search Form */}
            <div id="booking-search-form">
              <SearchForm
                stations={stations}
                language={language}
                onSearch={handleSearch}
                isLoading={isSearching}
                initialMode={searchParams?.bookingMode}
              />
            </div>

            {/* Search Results Displayed ONLY after valid search */}
            <div id="search-results-section">
              {hasSearched && searchParams && (
                <SearchResults
                  trains={searchResults}
                  connectingRoutes={connectingResults}
                  selectedMode={searchParams.bookingMode}
                  travelDate={searchParams.date}
                  sourceCode={searchParams.source}
                  destinationCode={searchParams.destination}
                  passengerCount={searchParams.passengerCount}
                  language={language}
                  onSelectTrainClass={handleSelectTrainClass}
                  onSelectConnectingItinerary={handleSelectConnectingItinerary}
                />
              )}
            </div>
          </div>
        )}

        {/* BOOKING CONFIRMATION SCREEN */}
        {currentTab === 'confirmation' && lastConfirmedReservation && (
          <BookingConfirmationView
            reservation={lastConfirmedReservation}
            language={language}
            onBookAnother={() => {
              setCurrentTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onViewMyBookings={() => {
              setCurrentTab('bookings');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* MY BOOKINGS & CANCELLATION TAB */}
        {currentTab === 'bookings' && (
          <MyBookingsView
            reservations={reservations}
            language={language}
            onRefresh={() => setReservations(railwayService.getReservations())}
            onSelectReservationForPrint={(res) => {
              setLastConfirmedReservation(res);
              setCurrentTab('confirmation');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* SMART PLATFORM ALLOCATION DASHBOARD */}
        {currentTab === 'operations' && (
          <OperationsDashboard language={language} />
        )}

        {/* NEARBY STATIONS DIRECTORY */}
        {currentTab === 'stations' && (
          <NearbyStationsView
            language={language}
            onSelectStationAsSource={handleSelectStationAsSource}
          />
        )}

        {/* HELP & GUIDELINES TAB */}
        {currentTab === 'help' && (
          <HelpView language={language} />
        )}

        {/* USER PROFILE TAB */}
        {currentTab === 'profile' && (
          <UserProfileView
            user={user}
            reservations={reservations}
            language={language}
            onViewBookings={() => {
              setCurrentTab('bookings');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* ADMIN DASHBOARD TAB */}
        {currentTab === 'admin' && (
          <AdminDashboardView
            language={language}
            onNavigateToOperations={() => {
              setCurrentTab('operations');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* NOT FOUND / ERROR FALLBACK */}
        {currentTab === '404' && (
          <NotFoundView
            language={language}
            onGoHome={() => {
              setCurrentTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

      </main>

      {/* Modals for Booking Workflow */}
      {selectedTrain && selectedClass && searchParams && (
        <>
          <SeatSelectionModal
            isOpen={isSeatModalOpen}
            onClose={() => setIsSeatModalOpen(false)}
            train={selectedTrain}
            travelClass={selectedClass}
            passengerCount={searchParams.passengerCount}
            language={language}
            onConfirmSeats={handleConfirmSeats}
          />

          <PassengerDetailsModal
            isOpen={isPassengerModalOpen}
            onClose={() => setIsPassengerModalOpen(false)}
            train={selectedTrain}
            travelClass={selectedClass}
            bookingMode={searchParams.bookingMode}
            passengerCount={searchParams.passengerCount}
            initialBerths={selectedBerths}
            language={language}
            onSubmit={handlePassengerSubmit}
          />

          <PaymentModal
            isOpen={isPaymentModalOpen}
            onClose={() => setIsPaymentModalOpen(false)}
            train={selectedTrain}
            travelClass={selectedClass}
            bookingMode={searchParams.bookingMode}
            passengerCount={searchParams.passengerCount}
            totalFare={
              (selectedTrain.classes.find((c) => c.classType === selectedClass)?.fare || 500) *
              searchParams.passengerCount
            }
            language={language}
            onPaymentSuccess={handlePaymentSuccess}
          />
        </>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        language={language}
        onLoginSuccess={(u) => setUser(u)}
      />

      {/* Footer */}
      <Footer language={language} />

    </div>
  );
}

export default App;
