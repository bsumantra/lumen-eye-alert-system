
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb, CheckCircle, AlertTriangle, Wrench } from 'lucide-react';

interface StatsCardsProps {
  totalLights: number;
  normalLights: number;
  faultyLights: number;
  maintenanceAlerts: number;
}

const StatsCards = ({ totalLights, normalLights, faultyLights, maintenanceAlerts }: StatsCardsProps) => {
  const stats = [
    {
      title: 'Total Street Lights',
      value: totalLights,
      icon: Lightbulb,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-500/50'
    },
    {
      title: 'Normal Operation',
      value: normalLights,
      icon: CheckCircle,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      borderColor: 'border-green-500/50'
    },
    {
      title: 'Faulty Lights',
      value: faultyLights,
      icon: AlertTriangle,
      color: 'text-red-400',
      bgColor: 'bg-red-500/20',
      borderColor: 'border-red-500/50'
    },
    {
      title: 'Maintenance Alerts',
      value: maintenanceAlerts,
      icon: Wrench,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20',
      borderColor: 'border-orange-500/50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className={`bg-slate-800/50 border backdrop-blur-sm ${stat.borderColor} hover:scale-105 transition-transform duration-300`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">{stat.title}</p>
                <p className={`text-3xl font-bold ${stat.color} mt-2`}>{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;
