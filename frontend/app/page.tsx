'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import ViewToggle, { ViewMode } from '@/components/map/ViewToggle';
import SpotList from '@/components/map/SpotList';
import { useParkingSpots } from '@/lib/hooks/useParkingSpots';
import { useGeolocation } from '@/lib/hooks/useGeolocation';
import { ParkingSpot } from '@/lib/hooks/useParkingSpots';

// Dynamically import MapView to avoid SSR issues
const MapView = dynamic(() => import('@/components/map/MapView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading map...</p>
      </div>
    </div>
  ),
});

export default function Home() {
  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const { spots, loading } = useParkingSpots();
  const { location: userLocation } = useGeolocation();

  const handleSpotClick = (spot: ParkingSpot) => {
    // Navigate to booking page or show details
    window.location.href = `/booking/${spot.id}`;
  };

  return (
    <main className="min-h-screen">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">CarIn</h1>
              <p className="text-gray-600 mt-1">
                Decentralized parking spot booking on Celo blockchain
              </p>
            </div>
            <ViewToggle currentView={viewMode} onViewChange={setViewMode} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {viewMode === 'map' ? (
          <div className="h-[calc(100vh-200px)] min-h-[600px]">
            <MapView onSpotClick={handleSpotClick} />
          </div>
        ) : (
          <div>
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading parking spots...</p>
              </div>
            ) : (
              <SpotList
                spots={spots}
                userLocation={userLocation}
                onSpotClick={handleSpotClick}
              />
            )}
          </div>
        )}
      </div>
    </main>
  );
}





