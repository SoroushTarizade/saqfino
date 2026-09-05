"use client";

import "leaflet/dist/leaflet.css";

import L from "leaflet";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import { useEffect } from "react";

type Property = {
  id: number;
  image: string;
  title: string;
  location: string;
  deposit: number;
  rent: number;
  area: number;
  lat: number;
  lng: number;
};

type RentMapProps = {
  properties: Property[];
  selectedProperty: Property | null;
  onSelectProperty: (property: Property) => void;
};

const propertyIcon = new L.DivIcon({
  className: "custom-property-marker",
  html: `
    <div class="property-marker">
      <span>رهن</span>
    </div>
  `,
  iconSize: [52, 38],
  iconAnchor: [26, 38],
  popupAnchor: [0, -38],
});

function MapController({
  selectedProperty,
}: {
  selectedProperty: Property | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (!selectedProperty) return;

    map.flyTo(
      [selectedProperty.lat, selectedProperty.lng],
      14,
      {
        duration: 0.8,
      }
    );
  }, [selectedProperty, map]);

  return null;
}

export default function RentMap({
  properties,
  selectedProperty,
  onSelectProperty,
}: RentMapProps) {
  const defaultCenter: [number, number] = [
    35.7219,
    51.4078,
  ];

  return (
    <div className="h-full w-full overflow-hidden">
      <MapContainer
        center={defaultCenter}
        zoom={11}
        scrollWheelZoom
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController selectedProperty={selectedProperty} />

        {properties.map((property) => (
          <Marker
            key={property.id}
            position={[property.lat, property.lng]}
            icon={propertyIcon}
            eventHandlers={{
              click: () => onSelectProperty(property),
            }}
          >
            <Popup>
              <div
                dir="rtl"
                className="min-w-[190px] text-right"
              >
                <strong className="block text-sm">
                  {property.title}
                </strong>

                <span className="mt-1 block text-xs text-gray-500">
                  {property.area} متر، {property.location}
                </span>

                <div className="mt-2 space-y-1 text-xs">
                  <p>
                    {property.deposit.toLocaleString("fa-IR")} میلیون
                    تومان رهن
                  </p>

                  <p>
                    {property.rent.toLocaleString("fa-IR")} میلیون
                    تومان اجاره
                  </p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}