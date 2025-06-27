
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import StatsCards from './StatsCards';
import DataTable from './DataTable';
import ChartsSection from './ChartsSection';
import StreetLightMap from './StreetLightMap';
import MaintenanceAlerts from './MaintenanceAlerts';
import { Lightbulb, Zap, AlertTriangle, CheckCircle } from 'lucide-react';

// Mock data - replace with actual Supabase data
const mockStreetLightData = [
  {
    id: 1,
    location: 'Main Street & 5th Ave',
    ldr_value: 250,
    current_value: 2.3,
    status: 'normal',
    latitude: 40.7589,
    longitude: -73.9851,
    last_updated: '2024-06-27T10:30:00Z'
  },
  {
    id: 2,
    location: 'Park Avenue & 2nd St',
    ldr_value: 180,
    current_value: 4.2,
    status: 'fault',
    latitude: 40.7614,
    longitude: -73.9776,
    last_updated: '2024-06-27T10:28:00Z'
  },
  {
    id: 3,
    location: 'Broadway & 8th St',
    ldr_value: 320,
    current_value: 2.1,
    status: 'normal',
    latitude: 40.7505,
    longitude: -73.9934,
    last_updated: '2024-06-27T10:29:00Z'
  }
];

const mockMaintenanceData = [
  {
    id: 1,
    street_light_id: 2,
    issue_type: 'current_leakage',
    severity: 'high',
    predicted_date: '2024-06-28',
    description: 'Current leakage detected - immediate attention required'
  },
  {
    id: 2,
    street_light_id: 1,
    issue_type: 'ldr_malfunction',
    severity: 'medium',
    predicted_date: '2024-06-30',
    description: 'LDR sensor showing irregular readings'
  }
];

const Dashboard = () => {
  const [streetLightData, setStreetLightData] = useState(mockStreetLightData);
  const [maintenanceData, setMaintenanceData] = useState(mockMaintenanceData);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStreetLightData(prev => 
        prev.map(light => ({
          ...light,
          ldr_value: Math.max(0, light.ldr_value + (Math.random() - 0.5) * 20),
          current_value: Math.max(0, light.current_value + (Math.random() - 0.5) * 0.5),
          last_updated: new Date().toISOString()
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const totalLights = streetLightData.length;
  const faultyLights = streetLightData.filter(light => light.status === 'fault').length;
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
        </div>

        {/* Stats Cards */}
        <StatsCards 
          totalLights={totalLights}
          normalLights={normalLights}
          faultyLights={faultyLights}
          maintenanceAlerts={maintenanceData.length}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Map Section */}
          <div className="xl:col-span-2">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  Live Street Light Locations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <StreetLightMap streetLights={streetLightData} />
              </CardContent>
            </Card>
          </div>

          {/* Maintenance Alerts */}
          <div>
            <MaintenanceAlerts alerts={maintenanceData} />
          </div>
        </div>

        {/* Charts Section */}
        <ChartsSection data={streetLightData} />

        {/* Data Table */}
        <DataTable data={streetLightData} />
      </div>
    </div>
  );
};

export default Dashboard;
