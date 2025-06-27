
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Clock, Wrench } from 'lucide-react';

interface MaintenanceAlert {
  id: number;
  street_light_id: number;
  issue_type: string;
  severity: string;
  predicted_date: string;
  description: string;
}

interface MaintenanceAlertsProps {
  alerts: MaintenanceAlert[];
}

const MaintenanceAlerts = ({ alerts }: MaintenanceAlertsProps) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500/20 border-red-500/50 text-red-300';
      case 'medium': return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300';
      case 'low': return 'bg-blue-500/20 border-blue-500/50 text-blue-300';
      default: return 'bg-gray-500/20 border-gray-500/50 text-gray-300';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'medium': return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'low': return <Wrench className="w-4 h-4 text-blue-400" />;
      default: return <Wrench className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
          Maintenance Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.length === 0 ? (
          <div className="text-center text-slate-400 py-8">
            <Wrench className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No maintenance alerts at this time</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border ${getSeverityColor(alert.severity)} ${
                alert.severity === 'high' ? 'animate-pulse' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getSeverityIcon(alert.severity)}
                  <span className="text-white font-semibold text-sm">
                    Light #{alert.street_light_id}
                  </span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {alert.severity}
                </Badge>
              </div>
              
              <p className="text-slate-300 text-sm mb-3">
                {alert.description}
              </p>
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  Type: {alert.issue_type.replace('_', ' ')}
                </span>
                <span className="text-slate-400">
                  Due: {new Date(alert.predicted_date).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default MaintenanceAlerts;
