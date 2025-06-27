
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface StreetLight {
  id: number;
  location: string;
  latitude: number;
  longitude: number;
  status: string;
  ldr_value: number;
  current_value: number;
  last_updated: string;
}

interface StreetLightMapProps {
  streetLights: StreetLight[];
}

const StreetLightMap = ({ streetLights }: StreetLightMapProps) => {
  const [selectedLight, setSelectedLight] = useState<StreetLight | null>(null);

  // Calculate center point from street lights
  const centerLat = streetLights.length > 0 
    ? streetLights.reduce((sum, light) => sum + light.latitude, 0) / streetLights.length 
    : 51.505;
  const centerLng = streetLights.length > 0 
    ? streetLights.reduce((sum, light) => sum + light.longitude, 0) / streetLights.length 
    : -0.09;

  // Create custom icons for different statuses
  const createCustomIcon = (status: string) => {
    const color = status === 'fault' ? '#ef4444' : '#22c55e';
    const pulseClass = status === 'fault' ? 'animate-pulse' : '';
    
    return L.divIcon({
      html: `<div class="w-8 h-8 rounded-full ${pulseClass}" style="background-color: ${color}; display: flex; align-items: center; justify-content: center; color: white; font-size: 16px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">💡</div>`,
      className: 'custom-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
  };

  return (
    <div className="relative w-full h-96 bg-slate-900 rounded-lg border border-slate-700 overflow-hidden">
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {streetLights.map((light) => (
          <Marker
            key={light.id}
            position={[light.latitude, light.longitude]}
            icon={createCustomIcon(light.status)}
            eventHandlers={{
              click: () => setSelectedLight(light),
            }}
          >
            <Popup>
              <div className="p-2">
                <h4 className="font-semibold">Light #{light.id}</h4>
                <p className="text-sm text-gray-600 mb-2">{light.location}</p>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <Badge variant={light.status === 'fault' ? 'destructive' : 'secondary'} className="text-xs">
                      {light.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>LDR:</span>
                    <span>{light.ldr_value.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Current:</span>
                    <span>{light.current_value.toFixed(2)}A</span>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-slate-800/90 backdrop-blur-sm rounded-lg p-4 border border-slate-700 z-10">
        <h4 className="text-white font-semibold mb-2">Legend</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-xs">💡</div>
            <span className="text-slate-300 text-sm">Normal Operation</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-xs animate-pulse">💡</div>
            <span className="text-slate-300 text-sm">Fault Detected</span>
          </div>
        </div>
      </div>

      {/* Info Panel */}
      {selectedLight && (
        <div className="absolute top-4 right-4 bg-slate-800/95 backdrop-blur-sm rounded-lg p-4 border border-slate-700 max-w-xs z-10">
          <div className="flex justify-between items-start mb-2">
            <h4 className="text-white font-semibold">Light #{selectedLight.id}</h4>
            <button
              onClick={() => setSelectedLight(null)}
              className="text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          <p className="text-slate-300 text-sm mb-3">{selectedLight.location}</p>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400 text-xs">Status:</span>
              <Badge variant={selectedLight.status === 'fault' ? 'destructive' : 'secondary'}>
                {selectedLight.status}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 text-xs">Coordinates:</span>
              <span className="text-white text-xs">{selectedLight.latitude.toFixed(4)}, {selectedLight.longitude.toFixed(4)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 text-xs">LDR Value:</span>
              <span className="text-white text-xs">{selectedLight.ldr_value.toFixed(1)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 text-xs">Current:</span>
              <span className="text-white text-xs">{selectedLight.current_value.toFixed(2)}A</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StreetLightMap;
