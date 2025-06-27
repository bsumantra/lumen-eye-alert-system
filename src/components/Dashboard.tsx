
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StatsCards from './StatsCards';
import DataTable from './DataTable';
import ChartsSection from './ChartsSection';
import StreetLightMap from './StreetLightMap';
import MaintenanceAlerts from './MaintenanceAlerts';
import { useStreetLightData } from '@/hooks/useStreetLightData';
import { Lightbulb, Loader2 } from 'lucide-react';

const Dashboard = () => {
  const { streetLights, maintenanceAlerts, loading, error } = useStreetLightData();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-white mx-auto mb-4" />
          <p className="text-white text-lg">Loading street light data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">Error loading data</div>
          <p className="text-slate-300">{error}</p>
        </div>
      </div>
    );
  }

  // Transform data for components
  const transformedStreetLights = streetLights.map(light => ({
    id: light.id,
    location: light.location,
    latitude: light.latitude,
    longitude: light.longitude,
    status: light.anomaly_result === 1 || light.current > 3 ? 'fault' : 'normal',
    ldr_value: light.ldr,
    current_value: light.current,
    last_updated: light.reading_time
  }));

  const totalLights = transformedStreetLights.length;
  const faultyLights = transformedStreetLights.filter(light => light.status === 'fault').length;
  const normalLights = totalLights - faultyLights;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Lightbulb className="text-yellow-400" size={40} />
            Smart Street Light Monitoring System
          </h1>
          <p className="text-slate-300 text-lg">Real-time fault detection and predictive maintenance</p>
          <p className="text-slate-400 text-sm mt-2">
            Data refreshed: {new Date().toLocaleTimeString()}
          </p>
        </div>

        {/* Stats Cards */}
        <StatsCards 
          totalLights={totalLights}
          normalLights={normalLights}
          faultyLights={faultyLights}
          maintenanceAlerts={maintenanceAlerts.length}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Map Section */}
          <div className="xl:col-span-2">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  Live Street Light Locations ({totalLights} lights)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <StreetLightMap streetLights={transformedStreetLights} />
              </CardContent>
            </Card>
          </div>

          {/* Maintenance Alerts */}
          <div>
            <MaintenanceAlerts alerts={maintenanceAlerts} />
          </div>
        </div>

        {/* Charts Section */}
        <ChartsSection data={transformedStreetLights} />

        {/* Data Table */}
        <DataTable data={transformedStreetLights} />
      </div>
    </div>
  );
};

export default Dashboard;
