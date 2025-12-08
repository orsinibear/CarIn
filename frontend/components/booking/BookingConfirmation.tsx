"use client";

import { useState, useEffect } from "react";
import QRCodeDisplay from "./QRCodeDisplay";

interface Spot {
  id: string;
  location: string;
}

interface BookingConfirmationProps {
  bookingId: string;
  spot: Spot;
}

export default function BookingConfirmation({ bookingId, spot }: BookingConfirmationProps) {
  const [qrValue, setQrValue] = useState("");

  useEffect(() => {
    // Generate QR code data with booking ID and validation info
    const qrData = JSON.stringify({
      bookingId,
      spotId: spot.id,
      timestamp: Date.now(),
    });
    setQrValue(qrData);
  }, [bookingId, spot.id]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 text-center">
      <div className="mb-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
        <p className="text-gray-600">Your parking spot has been successfully booked</p>
      </div>

      {/* QR Code */}
      <div className="mb-6">
        <QRCodeDisplay
          bookingId={bookingId}
          spotId={spot.id}
          spotLocation={spot.location}
        />
      </div>

      {/* Booking Details */}
      <div className="border-t pt-6 space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Booking ID:</span>
          <span className="font-medium">{bookingId}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Spot Location:</span>
          <span className="font-medium">{spot.location}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex gap-4 justify-center">
        <button
          onClick={() => window.location.href = "/bookings"}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          View Booking History
        </button>
        <button
          onClick={() => window.print()}
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Save QR Code
        </button>
      </div>
    </div>
  );
}

