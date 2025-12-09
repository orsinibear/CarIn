/**
 * Parking spot marker component for map display
 */

'use client';

import { Marker, Popup } from 'react-leaflet';
import { Icon, LatLngExpression, divIcon } from 'leaflet';
import { ParkingSpot } from '@/lib/hooks/useParkingSpots';
import SpotInfoWindow from './SpotInfoWindow';

// Custom marker icons using inline SVG
const createMarkerIcon = (isAvailable: boolean) => {
  const color = isAvailable ? '#10b981' : '#ef4444';
  const svg = `
    <svg width="32" height="40" viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 0C10.5 0 6 4.5 6 10c0 6 10 18 10 18s10-12 10-18c0-5.5-4.5-10-10-10z" fill="${color}" stroke="white" stroke-width="2"/>
      <circle cx="16" cy="10" r="4" fill="white"/>
    </svg>
  `;
  
  return divIcon({
    html: svg,
    className: 'custom-marker',
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -40],
  });
};

interface ParkingSpotMarkerProps {
  spot: ParkingSpot;
  onClick?: (spot: ParkingSpot) => void;
}

export default function ParkingSpotMarker({
  spot,
  onClick,
}: ParkingSpotMarkerProps) {
  if (!spot.coordinates) {
    return null;
  }

  const position: LatLngExpression = [
    spot.coordinates.lat,
    spot.coordinates.lng,
  ];

  const icon = createMarkerIcon(spot.isAvailable);

  return (
    <Marker
      position={position}
      icon={icon}
      eventHandlers={{
        click: () => {
          onClick?.(spot);
        },
      }}
    >
      <Popup maxWidth={300} className="spot-popup">
        <SpotInfoWindow spot={spot} />
      </Popup>
    </Marker>
  );
}
