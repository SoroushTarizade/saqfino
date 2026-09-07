"use client";

import {
  MapContainer,
  Marker,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";

type SubmitMapProps = {
  position: [number, number] | null;

  onPositionChange: (
    position: [number, number],
  ) => void;
};

const markerIcon = L.divIcon({
  className: "custom-submit-marker",

  html: `
    <div class="submit-map-marker">
      <span></span>
    </div>
  `,

  iconSize: [34, 44],
  iconAnchor: [17, 44],
});

function LocationPicker({
  onPositionChange,
}: {
  onPositionChange: (
    position: [number, number],
  ) => void;
}) {
  useMapEvents({
    click(event) {
      onPositionChange([
        event.latlng.lat,
        event.latlng.lng,
      ]);
    },
  });

  return null;
}

export default function SubmitMap({
  position,
  onPositionChange,
}: SubmitMapProps) {
  const defaultPosition:
    [number, number] = [
    35.7219,
    51.3347,
  ];

  return (
    <div className="relative h-[360px] w-full overflow-hidden rounded-2xl border border-[var(--color-gray-4)]">
      <MapContainer
        center={
          position ?? defaultPosition
        }
        zoom={12}
        scrollWheelZoom
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <LocationPicker
          onPositionChange={
            onPositionChange
          }
        />

        {position && (
          <Marker
            position={position}
            icon={markerIcon}
          />
        )}
      </MapContainer>

      <div className="pointer-events-none absolute right-4 top-4 z-[1000] rounded-xl bg-white px-4 py-3 text-xs font-bold text-[var(--color-gray-10)] shadow-lg">
        برای انتخاب موقعیت روی نقشه
        کلیک کنید
      </div>
    </div>
  );
}