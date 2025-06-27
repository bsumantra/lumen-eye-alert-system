
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, MapPin } from 'lucide-react';

interface StreetLight {
  id: number;
  location: string;
  ldr_value: number;
  current_value: number;
  status: string;
  latitude: number;
  longitude: number;
  last_updated: string;
}

interface DataTableProps {
  data: StreetLight[];
}

const DataTable = ({ data }: DataTableProps) => {
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
          Live Street Light Data
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700">
                <TableHead className="text-slate-300">ID</TableHead>
                <TableHead className="text-slate-300">Location</TableHead>
                <TableHead className="text-slate-300">LDR Value</TableHead>
                <TableHead className="text-slate-300">Current (A)</TableHead>
                <TableHead className="text-slate-300">Status</TableHead>
                <TableHead className="text-slate-300">Coordinates</TableHead>
                <TableHead className="text-slate-300">Last Updated</TableHead>
                <TableHead className="text-slate-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((light) => (
                <TableRow key={light.id} className="border-slate-700 hover:bg-slate-700/30">
                  <TableCell className="text-white font-medium">#{light.id}</TableCell>
                  <TableCell className="text-slate-300">{light.location}</TableCell>
                  <TableCell className="text-slate-300">
                    <div className="flex items-center gap-2">
                      <span>{light.ldr_value.toFixed(1)}</span>
                      <div className={`w-2 h-2 rounded-full ${
                        light.ldr_value > 200 ? 'bg-green-400' :
                        light.ldr_value > 100 ? 'bg-yellow-400' : 'bg-red-400'
                      }`}></div>
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-300">
                    <div className="flex items-center gap-2">
                      <span>{light.current_value.toFixed(2)}</span>
                      <div className={`w-2 h-2 rounded-full ${
                        light.current_value <= 3 ? 'bg-green-400' :
                        light.current_value <= 4 ? 'bg-yellow-400' : 'bg-red-400'
                      }`}></div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={light.status === 'fault' ? 'destructive' : 'secondary'}
                      className={light.status === 'fault' ? 'animate-pulse' : ''}
                    >
                      {light.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-300 text-xs">
                    {light.latitude.toFixed(4)}, {light.longitude.toFixed(4)}
                  </TableCell>
                  <TableCell className="text-slate-300 text-xs">
                    {formatTime(light.last_updated)}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <button className="p-1 rounded text-blue-400 hover:bg-blue-400/20 transition-colors">
                        <Eye size={16} />
                      </button>
                      <button className="p-1 rounded text-green-400 hover:bg-green-400/20 transition-colors">
                        <MapPin size={16} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataTable;
