import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';


import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

function LocationMarker({ position, setPosition }) {
  const map = useMap();

  const lat = parseFloat(position?.lat);
  const lng = parseFloat(position?.lng);
  const isValidPosition = !isNaN(lat) && !isNaN(lng);

  useEffect(() => {
    if (isValidPosition) {
      map.flyTo({ lat, lng }, map.getZoom());
    }
  }, [lat, lng, isValidPosition, map]);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return isValidPosition ? (
    <Marker position={{ lat, lng }}></Marker>
  ) : null;
}

export function MapPicker({ position, setPosition, className }) {
  const lat = parseFloat(position?.lat);
  const lng = parseFloat(position?.lng);
  const isValidPosition = !isNaN(lat) && !isNaN(lng);

  const center = isValidPosition ? { lat, lng } : { lat: 22.10, lng: 10.22 };

  return (
    <div className={className}>
      <MapContainer 
        center={center} 
        zoom={13} 
        scrollWheelZoom={true} 
        className="h-full w-full rounded-2xl z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker position={position} setPosition={setPosition} />
      </MapContainer>
    </div>
  );
}
