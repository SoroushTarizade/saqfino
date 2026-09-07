"use client";

import "leaflet/dist/leaflet.css";
import { formatPrice } from "@/lib/formatPrice";
import L from "leaflet";
import { useEffect } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";

import type { BuyProperty } from "@/data/buyProperties";

type BuyMapProps = {
  properties: BuyProperty[];
  selectedProperty: BuyProperty | null;
  onSelectProperty: (property: BuyProperty) => void;
};

const propertyIcon = new L.DivIcon({
  className: "custom-buy-marker",
  html: `
    <div class="buy-property-marker">
      <span>خرید</span>
    </div>
  `,
  iconSize: [52, 38],
  iconAnchor: [26, 38],
  popupAnchor: [0, -38],
});

function MapController({
  selectedProperty,
}: {
  selectedProperty: BuyProperty | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (!selectedProperty) {
      return;
    }

    map.flyTo(
      [selectedProperty.lat, selectedProperty.lng],
      14,
      {
        duration: 0.8,
      },
    );
  }, [selectedProperty, map]);

  return null;
}

function BuyMap({
  properties,
  selectedProperty,
  onSelectProperty,
}: BuyMapProps) {
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
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController
          selectedProperty={selectedProperty}
        />

        {properties.map((property) => (
          <Marker
            key={property.id}
            position={[
              property.lat,
              property.lng,
            ]}
            icon={propertyIcon}
            eventHandlers={{
              click: () => {
                onSelectProperty(property);
              },
            }}
          >
            <Popup>
              <div
                dir="rtl"
                className="min-w-[200px] text-right"
              >
                <strong className="block text-sm">
                  {property.title}
                </strong>

                <span className="mt-1 block text-xs text-gray-500">
                  {property.area.toLocaleString("fa-IR")} متر،{" "}
                  {property.location}
                </span>

                <div className="mt-2 space-y-1 text-xs">
                  <p>
                    قیمت کل:{" "}
                    {formatPrice(property.price)}
                  </p>

                  <p>
                    قیمت هر متر:{" "}
                    {Math.round(
                      property.price / property.area,
                    ).toLocaleString("fa-IR")}{" "}
                    میلیون تومان
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

export default BuyMap;