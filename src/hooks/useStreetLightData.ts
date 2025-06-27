
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface StreetLightData {
  id: number;
  pole_id: number;
  location: string;
  latitude: number;
  longitude: number;
  ldr: number;
  current: number;
  anomaly_result: number;
  maintenance_flag: string;
  reading_time: string;
  inference_time: string;
}

export interface MaintenanceAlert {
  id: number;
  street_light_id: number;
  issue_type: string;
  severity: string;
  predicted_date: string;
  description: string;
}

export const useStreetLightData = () => {
  const [streetLights, setStreetLights] = useState<StreetLightData[]>([]);
  const [maintenanceAlerts, setMaintenanceAlerts] = useState<MaintenanceAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStreetLightData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('inference_table')
        .select('*')
        .order('inference_time', { ascending: false });

      if (error) {
        console.error('Error fetching street light data:', error);
        setError(error.message);
        return;
      }

      console.log('Fetched street light data:', data);
      
      if (data) {
        const transformedData: StreetLightData[] = data.map((item: any) => ({
          id: item.id,
          pole_id: item.pole_id || item.id,
          location: item.location || `Location ${item.id}`,
          latitude: item.latitude || (40.7589 + (Math.random() - 0.5) * 0.1),
          longitude: item.longitude || (-73.9851 + (Math.random() - 0.5) * 0.1),
          ldr: item.ldr || 0,
          current: item.current || 0,
          anomaly_result: item.anomaly_result || 0,
          maintenance_flag: item.maintenance_flag || 'normal',
          reading_time: item.reading_time || new Date().toISOString(),
          inference_time: item.inference_time || new Date().toISOString(),
        }));

        setStreetLights(transformedData);

        // Generate maintenance alerts based on anomaly results
        const alerts: MaintenanceAlert[] = transformedData
          .filter(light => light.anomaly_result === 1 || light.current > 3)
          .map(light => ({
            id: light.id,
            street_light_id: light.pole_id,
            issue_type: light.current > 3 ? 'current_leakage' : 'sensor_malfunction',
            severity: light.current > 4 ? 'high' : 'medium',
            predicted_date: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            description: light.current > 3 
              ? `Current leakage detected (${light.current.toFixed(2)}A)` 
              : 'Anomaly detected in sensor readings'
          }));

        setMaintenanceAlerts(alerts);
      }
    } catch (err) {
      console.error('Error in fetchStreetLightData:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStreetLightData();

    // Set up real-time subscription
    const channel = supabase
      .channel('inference_table_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'inference_table'
        },
        (payload) => {
          console.log('Real-time update:', payload);
          fetchStreetLightData();
        }
      )
      .subscribe();

    // Refresh data every 30 seconds
    const interval = setInterval(fetchStreetLightData, 30000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, []);

  return {
    streetLights,
    maintenanceAlerts,
    loading,
    error,
    refetch: fetchStreetLightData
  };
};
