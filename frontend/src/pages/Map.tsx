import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { DiscountItem } from '../components/DiscountCard';
import { getDiscounts } from '../api';
import L from 'leaflet';

// Fix for default marker icons in vite + react-leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

export default function MapView() {
  const [discounts, setDiscounts] = useState<DiscountItem[]>([]);
  
  useEffect(() => {
    getDiscounts().then(setDiscounts);
  }, []);

  // Lviv, Ukraine Default Coordinates
  const position: [number, number] = [49.8397, 24.0297];

  return (
    <div className="h-[calc(100vh-4rem)] w-full flex flex-col pt-4">
      <div className="max-w-7xl mx-auto px-4 w-full mb-4">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-amber-600">Deals Near You</h1>
      </div>
      <div className="flex-1 bg-slate-200 z-0 border-t border-slate-300">
        <MapContainer center={position} zoom={13} scrollWheelZoom={true} className="h-full w-full">
          <TileLayer
            attribution='Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
          />
          {discounts.map(discount => (
            <Marker key={discount.id} position={[discount.latitude, discount.longitude]}>
              <Popup>
                <div className="p-1">
                  <h3 className="font-bold text-lg mb-1">{discount.title}</h3>
                  <p className="text-sm text-slate-500 mb-2">{discount.category?.name || 'Deal'}</p>
                  <p className="text-primary-600 font-extrabold">₴ {discount.discountPrice}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
