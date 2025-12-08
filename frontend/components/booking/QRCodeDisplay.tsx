"use client";

import { useState } from "react";
import QRCode from "qrcode.react";

interface QRCodeDisplayProps {
  bookingId: string;
  spotId: string;
  spotLocation: string;
  onSave?: () => void;
}

export default function QRCodeDisplay({
  bookingId,
  spotId,
  spotLocation,
  onSave,
}: QRCodeDisplayProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const qrData = JSON.stringify({
    bookingId,
    spotId,
    location: spotLocation,
    timestamp: Date.now(),
    type: "parking_access",
  });

  const handleDownload = () => {
    setIsDownloading(true);
    const canvas = document.getElementById("qr-code-canvas") as HTMLCanvasElement;
    if (canvas) {
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `booking-${bookingId}-qr.png`;
      link.href = url;
      link.click();
    }
    setIsDownloading(false);
    if (onSave) onSave();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 text-center">
      <h3 className="text-xl font-semibold mb-4">Your Booking QR Code</h3>
      <p className="text-sm text-gray-600 mb-6">
        Show this QR code at the parking location for access
      </p>

      <div className="bg-gray-50 rounded-lg p-6 inline-block mb-6">
        <div className="bg-white p-4 rounded-lg inline-block border-2 border-gray-300">
          <QRCode
            id="qr-code-canvas"
            value={qrData}
            size={256}
            level="H"
            includeMargin={true}
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="text-sm text-gray-600">
          <p>Booking ID: <span className="font-mono font-medium">{bookingId}</span></p>
        </div>

        <div className="flex gap-4 justify-center pt-4">
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            {isDownloading ? "Downloading..." : "Save QR Code"}
          </button>
          <button
            onClick={() => window.print()}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Print
          </button>
        </div>
      </div>
    </div>
  );
}

