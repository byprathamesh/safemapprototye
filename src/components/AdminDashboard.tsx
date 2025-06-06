
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, MapPin, Phone, Users, Camera, Clock } from 'lucide-react';

interface Incident {
  id: string;
  userId: string;
  userName: string;
  location: { lat: number, lng: number };
  address: string;
  status: 'active' | 'resolved' | 'investigating';
  priority: 'high' | 'medium' | 'low';
  timestamp: Date;
  type: 'emergency' | 'safety_report' | 'false_alarm';
  hasVideo: boolean;
  hasAudio: boolean;
  responseTime?: number;
}

const AdminDashboard = () => {
  const [incidents] = useState<Incident[]>([
    {
      id: 'INC001',
      userId: 'USR123',
      userName: 'Priya S.',
      location: { lat: 28.6139, lng: 77.2090 },
      address: 'Connaught Place, New Delhi',
      status: 'active',
      priority: 'high',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      type: 'emergency',
      hasVideo: true,
      hasAudio: true
    },
    {
      id: 'INC002',
      userId: 'USR456',
      userName: 'Anita K.',
      location: { lat: 28.6129, lng: 77.2295 },
      address: 'India Gate, New Delhi',
      status: 'investigating',
      priority: 'medium',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      type: 'safety_report',
      hasVideo: false,
      hasAudio: true,
      responseTime: 3
    },
    {
      id: 'INC003',
      userId: 'USR789',
      userName: 'Rashmi M.',
      location: { lat: 28.6169, lng: 77.2025 },
      address: 'Janpath, New Delhi',
      status: 'resolved',
      priority: 'low',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      type: 'false_alarm',
      hasVideo: false,
      hasAudio: false,
      responseTime: 8
    }
  ]);

  const [stats] = useState({
    activeIncidents: 1,
    totalToday: 12,
    avgResponseTime: 4.2,
    resolvedToday: 11
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-red-100 text-red-800 border-red-200';
      case 'investigating': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - timestamp.getTime()) / 1000 / 60);
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    const hours = Math.floor(diff / 60);
    return `${hours}h ago`;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Safe Map Admin Dashboard</h1>
          <p className="text-gray-600">Real-time incident monitoring and response system</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Incidents</p>
                  <p className="text-2xl font-bold text-red-600">{stats.activeIncidents}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Today's Incidents</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalToday}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.avgResponseTime}m</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Resolved Today</p>
                  <p className="text-2xl font-bold text-green-600">{stats.resolvedToday}</p>
                </div>
                <Users className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Incidents */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5" />
              <span>Recent Incidents</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {incidents.map((incident) => (
                <div
                  key={incident.id}
                  className="border rounded-lg p-4 space-y-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="flex flex-col items-center space-y-1">
                        <div className={`h-3 w-3 rounded-full ${getPriorityColor(incident.priority)}`}></div>
                        <span className="text-xs text-gray-500">{incident.priority}</span>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-semibold text-gray-900">{incident.id}</h4>
                          <Badge className={getStatusColor(incident.status)}>
                            {incident.status}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {formatTimestamp(incident.timestamp)}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-700 mb-1">
                          <strong>User:</strong> {incident.userName} (ID: {incident.userId})
                        </p>
                        
                        <div className="flex items-center space-x-1 text-sm text-gray-600 mb-2">
                          <MapPin className="h-4 w-4" />
                          <span>{incident.address}</span>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>Type: {incident.type.replace('_', ' ')}</span>
                          {incident.responseTime && (
                            <span>Response: {incident.responseTime}m</span>
                          )}
                          <div className="flex items-center space-x-2">
                            {incident.hasVideo && (
                              <div className="flex items-center space-x-1">
                                <Camera className="h-3 w-3" />
                                <span>Video</span>
                              </div>
                            )}
                            {incident.hasAudio && (
                              <div className="flex items-center space-x-1">
                                <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
                                <span>Audio</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      <Button size="sm" variant="outline">
                        <MapPin className="h-4 w-4 mr-1" />
                        View Location
                      </Button>
                      {incident.status === 'active' && (
                        <Button size="sm" variant="destructive">
                          <Phone className="h-4 w-4 mr-1" />
                          Call User
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
