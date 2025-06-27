
import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

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
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [isTokenSet, setIsTokenSet] = useState<boolean>(false);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);

  const handleTokenSubmit = () => {
    if (mapboxToken.trim()) {
      setIsTokenSet(true);
      initializeMap();
    }
  };

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    // Calculate center point from street lights
    const centerLat = streetLights.reduce((sum, light) => sum + light.latitude, 0) / streetLights.length;
    const centerLng = streetLights.reduce((sum, light) => sum + light.longitude, 0) / streetLights.length;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [centerLng, centerLat],
      zoom: 12
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add markers for each street light
    addMarkersToMap();
  };

  const addMarkersToMap = () => {
    if (!map.current) return;

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    streetLights.forEach((light) => {
      // Create marker element
      const markerElement = document.createElement('div');
      markerElement.className = 'street-light-marker';
      markerElement.style.cssText = `
        width: 30px;
        height: 30px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        transition: transform 0.2s;
        ${light.status === 'fault' 
          ? 'background: #ef4444; color: white; animation: pulse 2s infinite;' 
          : 'background: #22c55e; color: white;'
        }
      `;
      markerElement.innerHTML = '💡';

      // Add click event
      markerElement.addEventListener('click', () => {
        setSelectedLight(light);
      });

      // Create marker and add to map
      const marker = new mapboxgl.Marker(markerElement)
        .setLngLat([light.longitude, light.latitude])
        .addTo(map.current!);

      markers.current.push(marker);
    });
  };

  useEffect(() => {
    if (isTokenSet && map.current) {
      addMarkersToMap();
    }
  }, [streetLights, isTokenSet]);

  useEffect(() => {
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  if (!isTokenSet) {
    return (
      <div className="w-full h-96 bg-slate-900 rounded-lg border border-slate-700 flex flex-col items-center justify-center p-6">
        <div className="text-center mb-6">
          <h3 className="text-white text-xl font-semibold mb-2">Mapbox Integration Required</h3>
          <p className="text-slate-300 text-sm mb-4">
            To display the real map with street light locations, please enter your Mapbox public token.
          </p>
          <p className="text-slate-400 text-xs mb-4">
            Get your free token at <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">mapbox.com</a>
          </p>
        </div>
        <div className="flex gap-2 w-full max-w-md">
          <Input
            type="text"
            placeholder="Enter Mapbox Public Token"
            value={mapboxToken}
            onChange={(e) => setMapboxToken(e.target.value)}
            className="bg-slate-800 border-slate-600 text-white"
          />
          <Button onClick={handleTokenSubmit} className="bg-green-600 hover:bg-green-700">
            Load Map
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-96 bg-slate-900 rounded-lg border border-slate-700 overflow-hidden">
      {/* Map Container */}
      <div ref={mapContainer} className="absolute inset-0" />

      {/* Add pulsing animation styles */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { 
            opacity: 1; 
            transform: scale(1);
          }
          50% { 
            opacity: 0.7; 
            transform: scale(1.1);
          }
        }
      `}</style>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-slate-800/90 backdrop-blur-sm rounded-lg p-4 border border-slate-700">
        <h4 className="text-white font-semibold mb-2">Legend</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-xs">💡</div>
            <span className="text-slate-300 text-sm">Normal Operation</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-xs animate-pulse">💡</div>
            <span className="text-slate-300 text-sm">Fault Detected (Blinking)</span>
          </div>
        </div>
      </div>

      {/* Info Panel */}
      {selectedLight && (
        <div className="absolute top-4 right-4 bg-slate-800/95 backdrop-blur-sm rounded-lg p-4 border border-slate-700 max-w-xs">
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
