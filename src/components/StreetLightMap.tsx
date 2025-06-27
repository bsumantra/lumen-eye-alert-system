
import React, { useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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

  // Simple map representation (you can replace with actual map integration)
  return (
    <div className="relative w-full h-96 bg-slate-900 rounded-lg border border-slate-700 overflow-hidden">
      {/* Map Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900">
        <div className="absolute inset-0 opacity-20">
          <div className="grid grid-cols-8 grid-rows-6 h-full gap-1 p-4">
            {Array.from({ length: 48 }).map((_, i) => (
              <div key={i} className="bg-slate-600 rounded-sm opacity-30"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Street Light Markers */}
      {streetLights.map((light, index) => (
        <div
          key={light.id}
          className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${
            light.status === 'fault' ? 'animate-pulse' : ''
          }`}
          style={{
            left: `${20 + (index * 25) + Math.random() * 20}%`,
            top: `${30 + (index * 15) + Math.random() * 20}%`
          }}
          onClick={() => setSelectedLight(light)}
        >
          <div className={`relative`}>
            <MapPin
              size={32}
              className={`${
                light.status === 'fault' 
                  ? 'text-red-500 drop-shadow-[0_0_8px_rgb(239,68,68)]' 
                  : 'text-green-500 drop-shadow-[0_0_8px_rgb(34,197,94)]'
              } hover:scale-110 transition-transform`}
            />
            {light.status === 'fault' && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
            )}
          </div>
        </div>
      ))}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-slate-800/90 backdrop-blur-sm rounded-lg p-4 border border-slate-700">
        <h4 className="text-white font-semibold mb-2">Legend</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-green-500" />
            <span className="text-slate-300 text-sm">Normal Operation</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-red-500" />
            <span className="text-slate-300 text-sm">Fault Detected</span>
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
