import { NextResponse } from 'next/server';

export const runtime = 'edge';

interface UptimeRecord {
  timestamp: string;
  status: 'up' | 'down' | 'degraded';
  responseTime: number;
  location: string;
}

interface UptimeStats {
  current: {
    status: 'operational' | 'degraded' | 'outage';
    uptime: number;
    responseTime: number;
    lastCheck: string;
  };
  history: {
    '24h': { uptime: number; avgResponseTime: number; incidents: number };
    '7d': { uptime: number; avgResponseTime: number; incidents: number };
    '30d': { uptime: number; avgResponseTime: number; incidents: number };
    '90d': { uptime: number; avgResponseTime: number; incidents: number };
  };
  incidents: Array<{
    id: string;
    title: string;
    description: string;
    status: 'resolved' | 'investigating' | 'monitoring';
    impact: 'minor' | 'major' | 'critical';
    startTime: string;
    endTime?: string;
    duration?: string;
    affectedServices: string[];
  }>;
  services: Array<{
    name: string;
    status: 'operational' | 'degraded' | 'outage';
    uptime: number;
    responseTime: number;
    description: string;
  }>;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '24h';
    const format = searchParams.get('format') || 'json';

    // Simulate uptime data (in production, this would come from monitoring infrastructure)
    const currentTime = new Date().toISOString();
    const uptimeStats: UptimeStats = {
      current: {
        status: 'operational',
        uptime: 99.97,
        responseTime: 156,
        lastCheck: currentTime
      },
      history: {
        '24h': { 
          uptime: 100.0, 
          avgResponseTime: 143, 
          incidents: 0 
        },
        '7d': { 
          uptime: 99.98, 
          avgResponseTime: 151, 
          incidents: 0 
        },
        '30d': { 
          uptime: 99.97, 
          avgResponseTime: 158, 
          incidents: 1 
        },
        '90d': { 
          uptime: 99.95, 
          avgResponseTime: 162, 
          incidents: 2 
        }
      },
      incidents: [
        {
          id: 'inc-2024-03-15',
          title: 'Scheduled Maintenance - Security Updates',
          description: 'Routine security patches and SSL certificate renewal',
          status: 'resolved',
          impact: 'minor',
          startTime: '2024-03-15T02:00:00Z',
          endTime: '2024-03-15T02:15:00Z',
          duration: '15 minutes',
          affectedServices: ['Website', 'API Endpoints']
        },
        {
          id: 'inc-2024-02-28',
          title: 'Database Performance Optimization', 
          description: 'Database index rebuilding caused temporary response delays',
          status: 'resolved',
          impact: 'minor',
          startTime: '2024-02-28T10:30:00Z',
          endTime: '2024-02-28T10:45:00Z',
          duration: '15 minutes',
          affectedServices: ['API Endpoints']
        }
      ],
      services: [
        {
          name: 'Website',
          status: 'operational',
          uptime: 99.98,
          responseTime: 142,
          description: 'Main website and static assets'
        },
        {
          name: 'API Endpoints',
          status: 'operational', 
          uptime: 99.96,
          responseTime: 178,
          description: 'Security, Performance, and Metrics APIs'
        },
        {
          name: 'Performance Monitor',
          status: 'operational',
          uptime: 99.99,
          responseTime: 134,
          description: 'Real-time performance tracking dashboard'
        },
        {
          name: 'Security System',
          status: 'operational',
          uptime: 100.0,
          responseTime: 89,
          description: 'Threat detection and rate limiting'
        },
        {
          name: 'Database',
          status: 'operational',
          uptime: 99.97,
          responseTime: 23,
          description: 'PostgreSQL database cluster'
        }
      ]
    };

    if (format === 'prometheus') {
      // Prometheus metrics format for monitoring integration
      const prometheusMetrics = `
# HELP uptime_percentage Current system uptime percentage
# TYPE uptime_percentage gauge
uptime_percentage{service="overall"} ${uptimeStats.current.uptime}

# HELP response_time_milliseconds Average response time in milliseconds  
# TYPE response_time_milliseconds gauge
response_time_milliseconds{service="overall"} ${uptimeStats.current.responseTime}

# HELP incidents_total Total number of incidents
# TYPE incidents_total counter
incidents_total{period="30d"} ${uptimeStats.history['30d'].incidents}

# HELP service_uptime_percentage Service-specific uptime percentage
# TYPE service_uptime_percentage gauge
${uptimeStats.services.map(service => 
  `service_uptime_percentage{service="${service.name.toLowerCase().replace(' ', '_')}"} ${service.uptime}`
).join('\n')}

# HELP service_response_time_milliseconds Service-specific response time  
# TYPE service_response_time_milliseconds gauge
${uptimeStats.services.map(service => 
  `service_response_time_milliseconds{service="${service.name.toLowerCase().replace(' ', '_')}"} ${service.responseTime}`
).join('\n')}
      `.trim();

      return new Response(prometheusMetrics, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      });
    }

    return NextResponse.json(uptimeStats, {
      headers: {
        'Cache-Control': 'public, max-age=60', // Cache for 1 minute
        'X-Uptime-Check': currentTime,
        'X-Response-Source': 'uptime-api'
      }
    });

  } catch (error) {
    console.error('Uptime API Error:', error);
    
    return NextResponse.json({
      error: 'Failed to fetch uptime data',
      timestamp: new Date().toISOString(),
      services: []
    }, { 
      status: 500,
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
  }
}