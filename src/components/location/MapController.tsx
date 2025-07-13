import React, { useEffect } from "react";
import { useMap } from "react-leaflet";

export const MapController: React.FC<{
  center: [number, number];
  zoom: number;
  onMapReady: (map: any) => void;
}> = ({ center, zoom, onMapReady }) => {
  const map = useMap();

  useEffect(() => {
    if (map) {
      onMapReady(map);
      map.setView(center, zoom);
    }
  }, [map, center, zoom, onMapReady]);

  return null;
};
