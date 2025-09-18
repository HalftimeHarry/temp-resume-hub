// Analytics store for tracking user behavior and resume performance
import { writable, derived } from 'svelte/store';
import { pb } from '$lib/pocketbase';

// Analytics data types
export interface UserAnalytics {
  userId: string;
  totalResumes: number;
  totalViews: number;
  totalDownloads: number;
  totalShares: number;
  averageViewsPerResume: number;
  mostViewedResume: {
    id: string;
    title: string;
    views: number;
  } | null;
  recentActivity: ActivityEvent[];
  growthMetrics: {
    viewsGrowth: number;
    downloadsGrowth: number;
    sharesGrowth: number;
  };
  topPerformingResumes: {
    id: string;
    title: string;
    views: number;
    downloads: number;
    shares: number;
  }[];
}

export interface ResumeAnalytics {
  resumeId: string;
  views: {
    total: number;
    unique: number;
    byDate: { date: string; count: number }[];
    byCountry: { country: string; count: number }[];
    byReferrer: { referrer: string; count: number }[];
    byDevice: { device: string; count: number }[];
  };
  downloads: {
    total: number;
    byFormat: { format: string; count: number }[];
    byDate: { date: string; count: number }[];
  };
  shares: {
    total: number;
    byPlatform: { platform: string; count: number }[];
    byDate: { date: string; count: number }[];
  };
  engagement: {
    averageTimeOnPage: number;
    bounceRate: number;
    clickThroughRate: number;
    conversionRate: number;
  };
  demographics: {
    ageGroups: { range: string; count: number }[];
    industries: { industry: string; count: number }[];
    jobTitles: { title: string; count: number }[];
  };
  performance: {
    loadTime: number;
    errorRate: number;
    mobileOptimization: number;
  };
}

export interface ActivityEvent {
  id: string;
  type: 'view' | 'download' | 'share' | 'edit' | 'create' | 'delete';
  resumeId?: string;
  resumeTitle?: string;
  metadata?: any;
  timestamp: string;
  userAgent?: string;
  ipAddress?: string;
  location?: {
    country: string;
    city: string;
    region: string;
  };
}

export interface AnalyticsFilters {
  dateRange: {
    start: string;
    end: string;
  };
  resumeIds?: string[];
  eventTypes?: string[];
  countries?: string[];
  devices?: string[];
}

// Stores
export const userAnalytics = writable<UserAnalytics | null>(null);
export const resumeAnalytics = writable<Map<string, ResumeAnalytics>>(new Map());
export const recentActivity = writable<ActivityEvent[]>([]);
export const analyticsFilters = writable<AnalyticsFilters>({
  dateRange: {
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  }
});
export const isLoadingAnalytics = writable(false);

// Derived stores
export const filteredActivity = derived(
  [recentActivity, analyticsFilters],
  ([$activity, $filters]) => {
    let filtered = [...$activity];
    
    // Filter by date range
    const startDate = new Date($filters.dateRange.start);
    const endDate = new Date($filters.dateRange.end);
    filtered = filtered.filter(event => {
      const eventDate = new Date(event.timestamp);
      return eventDate >= startDate && eventDate <= endDate;
    });
    
    // Filter by event types
    if ($filters.eventTypes && $filters.eventTypes.length > 0) {
      filtered = filtered.filter(event => $filters.eventTypes!.includes(event.type));
    }
    
    // Filter by resume IDs
    if ($filters.resumeIds && $filters.resumeIds.length > 0) {
      filtered = filtered.filter(event => 
        event.resumeId && $filters.resumeIds!.includes(event.resumeId)
      );
    }
    
    return filtered.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }
);

// Analytics operations
export const analyticsStore = {
  // Track user activity
  async trackEvent(event: Omit<ActivityEvent, 'id' | 'timestamp'>): Promise<void> {
    try {
      const eventData = {
        ...event,
        timestamp: new Date().toISOString(),
        userId: pb.authStore.model?.id,
        userAgent: navigator.userAgent,
        ipAddress: await getClientIP()
      };
      
      await pb.collection('analytics_events').create(eventData);
      
      // Update local activity store
      recentActivity.update(activities => [
        { ...eventData, id: Date.now().toString() },
        ...activities.slice(0, 99) // Keep last 100 events
      ]);
    } catch (error) {
      console.error('Failed to track event:', error);
    }
  },
  
  // Load user analytics
  async loadUserAnalytics(): Promise<UserAnalytics> {
    isLoadingAnalytics.set(true);
    try {
      const userId = pb.authStore.model?.id;
      if (!userId) throw new Error('User not authenticated');
      
      // Get user's resumes
      const resumes = await pb.collection('resumes').getFullList({
        filter: `userId = "${userId}"`,
        fields: 'id,title,viewCount,downloadCount,shareCount'
      });
      
      // Get analytics events
      const events = await pb.collection('analytics_events').getFullList({
        filter: `userId = "${userId}"`,
        sort: '-timestamp'
      });
      
      // Calculate metrics
      const totalViews = resumes.reduce((sum, r) => sum + (r.viewCount || 0), 0);
      const totalDownloads = resumes.reduce((sum, r) => sum + (r.downloadCount || 0), 0);
      const totalShares = resumes.reduce((sum, r) => sum + (r.shareCount || 0), 0);
      
      const mostViewedResume = resumes.length > 0 
        ? resumes.reduce((max, r) => (r.viewCount || 0) > (max.viewCount || 0) ? r : max)
        : null;
      
      // Calculate growth metrics (simplified)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const recentEvents = events.filter(e => new Date(e.timestamp) >= thirtyDaysAgo);
      const previousEvents = events.filter(e => new Date(e.timestamp) < thirtyDaysAgo);
      
      const recentViews = recentEvents.filter(e => e.type === 'view').length;
      const previousViews = previousEvents.filter(e => e.type === 'view').length;
      const viewsGrowth = previousViews > 0 ? ((recentViews - previousViews) / previousViews) * 100 : 0;
      
      const analytics: UserAnalytics = {
        userId,
        totalResumes: resumes.length,
        totalViews,
        totalDownloads,
        totalShares,
        averageViewsPerResume: resumes.length > 0 ? totalViews / resumes.length : 0,
        mostViewedResume: mostViewedResume ? {
          id: mostViewedResume.id,
          title: mostViewedResume.title,
          views: mostViewedResume.viewCount || 0
        } : null,
        recentActivity: events.slice(0, 20).map(mapEventRecord),
        growthMetrics: {
          viewsGrowth,
          downloadsGrowth: 0, // Simplified
          sharesGrowth: 0 // Simplified
        },
        topPerformingResumes: resumes
          .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
          .slice(0, 5)
          .map(r => ({
            id: r.id,
            title: r.title,
            views: r.viewCount || 0,
            downloads: r.downloadCount || 0,
            shares: r.shareCount || 0
          }))
      };
      
      userAnalytics.set(analytics);
      recentActivity.set(analytics.recentActivity);
      
      return analytics;
    } catch (error) {
      console.error('Failed to load user analytics:', error);
      throw error;
    } finally {
      isLoadingAnalytics.set(false);
    }
  },
  
  // Load resume-specific analytics
  async loadResumeAnalytics(resumeId: string): Promise<ResumeAnalytics> {
    try {
      // Get analytics events for this resume
      const events = await pb.collection('analytics_events').getFullList({
        filter: `resumeId = "${resumeId}"`,
        sort: '-timestamp'
      });
      
      // Get share analytics
      const shareEvents = await pb.collection('share_analytics').getFullList({
        filter: `resumeId = "${resumeId}"`,
        sort: '-timestamp'
      });
      
      const allEvents = [...events, ...shareEvents];
      
      // Process analytics data
      const analytics = processResumeAnalytics(resumeId, allEvents);
      
      // Update store
      resumeAnalytics.update(map => {
        map.set(resumeId, analytics);
        return map;
      });
      
      return analytics;
    } catch (error) {
      console.error('Failed to load resume analytics:', error);
      throw error;
    }
  },
  
  // Get analytics summary for dashboard
  async getAnalyticsSummary(): Promise<{
    totalUsers: number;
    totalResumes: number;
    totalViews: number;
    totalDownloads: number;
    activeUsers: number;
    popularTemplates: { id: string; name: string; usage: number }[];
  }> {
    try {
      // This would typically be an admin-only endpoint
      const [users, resumes, events] = await Promise.all([
        pb.collection('users').getFullList({ fields: 'id' }),
        pb.collection('resumes').getFullList({ fields: 'id,viewCount,downloadCount' }),
        pb.collection('analytics_events').getFullList({
          filter: `timestamp >= "${new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()}"`,
          fields: 'userId'
        })
      ]);
      
      const totalViews = resumes.reduce((sum, r) => sum + (r.viewCount || 0), 0);
      const totalDownloads = resumes.reduce((sum, r) => sum + (r.downloadCount || 0), 0);
      const activeUsers = new Set(events.map(e => e.userId)).size;
      
      return {
        totalUsers: users.length,
        totalResumes: resumes.length,
        totalViews,
        totalDownloads,
        activeUsers,
        popularTemplates: [] // Would need template usage data
      };
    } catch (error) {
      console.error('Failed to get analytics summary:', error);
      throw error;
    }
  },
  
  // Export analytics data
  async exportAnalytics(format: 'csv' | 'json' = 'csv'): Promise<void> {
    try {
      const analytics = await analyticsStore.loadUserAnalytics();
      
      if (format === 'csv') {
        const csvData = convertToCSV(analytics);
        downloadFile(csvData, 'analytics.csv', 'text/csv');
      } else {
        const jsonData = JSON.stringify(analytics, null, 2);
        downloadFile(jsonData, 'analytics.json', 'application/json');
      }
    } catch (error) {
      console.error('Failed to export analytics:', error);
      throw error;
    }
  },
  
  // Update analytics filters
  updateFilters(filters: Partial<AnalyticsFilters>): void {
    analyticsFilters.update(current => ({ ...current, ...filters }));
  },
  
  // Get real-time analytics (simplified)
  async getRealTimeAnalytics(): Promise<{
    activeUsers: number;
    currentViews: number;
    recentEvents: ActivityEvent[];
  }> {
    try {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      const events = await pb.collection('analytics_events').getFullList({
        filter: `timestamp >= "${fiveMinutesAgo.toISOString()}"`,
        sort: '-timestamp'
      });
      
      const activeUsers = new Set(events.map(e => e.userId)).size;
      const currentViews = events.filter(e => e.type === 'view').length;
      
      return {
        activeUsers,
        currentViews,
        recentEvents: events.slice(0, 10).map(mapEventRecord)
      };
    } catch (error) {
      console.error('Failed to get real-time analytics:', error);
      throw error;
    }
  }
};

// Helper functions
function mapEventRecord(record: any): ActivityEvent {
  return {
    id: record.id,
    type: record.type,
    resumeId: record.resumeId,
    resumeTitle: record.resumeTitle,
    metadata: record.metadata,
    timestamp: record.timestamp || record.created,
    userAgent: record.userAgent,
    ipAddress: record.ipAddress,
    location: record.location
  };
}

function processResumeAnalytics(resumeId: string, events: any[]): ResumeAnalytics {
  const views = events.filter(e => e.type === 'view');
  const downloads = events.filter(e => e.type === 'download');
  const shares = events.filter(e => e.type === 'share');
  
  // Process views by date
  const viewsByDate = views.reduce((acc, view) => {
    const date = new Date(view.timestamp).toISOString().split('T')[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Process downloads by format
  const downloadsByFormat = downloads.reduce((acc, download) => {
    const format = download.metadata?.format || 'pdf';
    acc[format] = (acc[format] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Process shares by platform
  const sharesByPlatform = shares.reduce((acc, share) => {
    const platform = share.metadata?.platform || 'unknown';
    acc[platform] = (acc[platform] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return {
    resumeId,
    views: {
      total: views.length,
      unique: new Set(views.map(v => v.userAgent || v.ipAddress)).size,
      byDate: Object.entries(viewsByDate).map(([date, count]) => ({ date, count: count as number })),
      byCountry: [], // Would need IP geolocation
      byReferrer: [], // Would process referrer data
      byDevice: [] // Would process user agent data
    },
    downloads: {
      total: downloads.length,
      byFormat: Object.entries(downloadsByFormat).map(([format, count]) => ({ format, count: count as number })),
      byDate: [] // Similar processing as views
    },
    shares: {
      total: shares.length,
      byPlatform: Object.entries(sharesByPlatform).map(([platform, count]) => ({ platform, count: count as number })),
      byDate: [] // Similar processing as views
    },
    engagement: {
      averageTimeOnPage: 0, // Would need session tracking
      bounceRate: 0, // Would need page navigation tracking
      clickThroughRate: 0, // Would need click tracking
      conversionRate: 0 // Would need conversion goal tracking
    },
    demographics: {
      ageGroups: [],
      industries: [],
      jobTitles: []
    },
    performance: {
      loadTime: 0, // Would need performance monitoring
      errorRate: 0, // Would need error tracking
      mobileOptimization: 0 // Would need mobile metrics
    }
  };
}

async function getClientIP(): Promise<string> {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    return 'unknown';
  }
}

function convertToCSV(data: any): string {
  // Simplified CSV conversion
  const headers = ['Date', 'Event Type', 'Resume Title', 'Metadata'];
  const rows = data.recentActivity.map((event: ActivityEvent) => [
    new Date(event.timestamp).toLocaleDateString(),
    event.type,
    event.resumeTitle || '',
    JSON.stringify(event.metadata || {})
  ]);
  
  return [headers, ...rows].map(row => row.join(',')).join('\n');
}

function downloadFile(content: string, filename: string, contentType: string): void {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}