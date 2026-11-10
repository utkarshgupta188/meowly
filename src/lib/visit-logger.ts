import fs from 'fs';
import path from 'path';

export interface VisitEvent {
  path: string;
  visitorId: string;
  userAgent: string;
  timestamp: string;
}

export interface VisitStatsData {
  totalPageViews: number;
  uniqueVisitors: string[];
  visits: VisitEvent[];
}

const getLogPath = () => path.join(process.cwd(), 'logs', 'visits.json');

export const logVisit = (pathName: string, visitorId: string, userAgent: string) => {
  try {
    const logDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    const logPath = getLogPath();
    let data: VisitStatsData = {
      totalPageViews: 0,
      uniqueVisitors: [],
      visits: []
    };

    if (fs.existsSync(logPath)) {
      try {
        data = JSON.parse(fs.readFileSync(logPath, 'utf8'));
      } catch (e) {
        // Reset if corrupt
      }
    }

    // Ensure properties exist
    data.totalPageViews = (data.totalPageViews || 0) + 1;
    data.uniqueVisitors = data.uniqueVisitors || [];
    data.visits = data.visits || [];

    if (visitorId && !data.uniqueVisitors.includes(visitorId)) {
      data.uniqueVisitors.push(visitorId);
    }

    const event: VisitEvent = {
      path: pathName,
      visitorId,
      userAgent,
      timestamp: new Date().toISOString()
    };

    data.visits.unshift(event);
    if (data.visits.length > 200) {
      data.visits.length = 200; // Cap to prevent infinite growth
    }

    fs.writeFileSync(logPath, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Failed to log visit:', e);
  }
};

export const getVisitStats = () => {
  try {
    const logPath = getLogPath();
    if (fs.existsSync(logPath)) {
      const data: VisitStatsData = JSON.parse(fs.readFileSync(logPath, 'utf8'));
      
      // Calculate top paths
      const pathCounts: Record<string, number> = {};
      (data.visits || []).forEach(v => {
        pathCounts[v.path] = (pathCounts[v.path] || 0) + 1;
      });

      return {
        totalPageViews: data.totalPageViews || 0,
        totalUniqueVisitors: (data.uniqueVisitors || []).length,
        topPaths: Object.entries(pathCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([pathName, count]) => ({ path: pathName, viewsInLog: count })),
        recentVisits: (data.visits || []).slice(0, 15)
      };
    }
  } catch (e) {
    console.error('Failed to get visit stats:', e);
  }

  return {
    totalPageViews: 0,
    totalUniqueVisitors: 0,
    topPaths: [],
    recentVisits: []
  };
};
