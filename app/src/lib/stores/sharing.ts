// Sharing store for managing resume sharing and public access
import { writable, derived } from 'svelte/store';
import type { Resume } from '$lib/types/resume';
import { pb } from '$lib/pocketbase';
import { generateId } from '$lib/utils';

// Share link types
export interface ShareLink {
  id: string;
  resumeId: string;
  token: string;
  isPublic: boolean;
  isPasswordProtected: boolean;
  password?: string;
  expiresAt?: string;
  allowDownload: boolean;
  allowComments: boolean;
  customDomain?: string;
  viewCount: number;
  lastViewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShareSettings {
  isPublic: boolean;
  allowDownload: boolean;
  allowComments: boolean;
  isPasswordProtected: boolean;
  password?: string;
  expiresAt?: string;
  customDomain?: string;
}

export interface ShareAnalytics {
  totalViews: number;
  uniqueViews: number;
  downloads: number;
  shares: number;
  viewsByDate: { date: string; views: number }[];
  viewsByCountry: { country: string; views: number }[];
  viewsByReferrer: { referrer: string; views: number }[];
  viewsByDevice: { device: string; views: number }[];
}

// Stores
export const shareLinks = writable<ShareLink[]>([]);
export const currentShareLink = writable<ShareLink | null>(null);
export const shareAnalytics = writable<ShareAnalytics | null>(null);
export const isLoadingShare = writable(false);

// Sharing operations
export const sharingStore = {
  // Create or update share link
  async createShareLink(resumeId: string, settings: ShareSettings): Promise<ShareLink> {
    isLoadingShare.set(true);
    try {
      const token = generateId(32); // Generate secure token
      
      const shareData = {
        resumeId,
        token,
        isPublic: settings.isPublic,
        isPasswordProtected: settings.isPasswordProtected,
        password: settings.password,
        expiresAt: settings.expiresAt,
        allowDownload: settings.allowDownload,
        allowComments: settings.allowComments,
        customDomain: settings.customDomain,
        viewCount: 0
      };
      
      const record = await pb.collection('share_links').create(shareData);
      const shareLink = mapRecordToShareLink(record);
      
      // Update resume to mark as public if needed
      if (settings.isPublic) {
        await pb.collection('resumes').update(resumeId, { isPublic: true });
      }
      
      currentShareLink.set(shareLink);
      shareLinks.update(links => [shareLink, ...links]);
      
      return shareLink;
    } catch (error) {
      console.error('Failed to create share link:', error);
      throw error;
    } finally {
      isLoadingShare.set(false);
    }
  },
  
  // Get share link for resume
  async getShareLink(resumeId: string): Promise<ShareLink | null> {
    try {
      const records = await pb.collection('share_links').getFullList({
        filter: `resumeId = "${resumeId}"`,
        sort: '-created'
      });
      
      if (records.length > 0) {
        const shareLink = mapRecordToShareLink(records[0]);
        currentShareLink.set(shareLink);
        return shareLink;
      }
      
      return null;
    } catch (error) {
      console.error('Failed to get share link:', error);
      return null;
    }
  },
  
  // Update share settings
  async updateShareSettings(shareId: string, settings: Partial<ShareSettings>): Promise<ShareLink> {
    try {
      const record = await pb.collection('share_links').update(shareId, settings);
      const shareLink = mapRecordToShareLink(record);
      
      currentShareLink.set(shareLink);
      shareLinks.update(links => 
        links.map(link => link.id === shareId ? shareLink : link)
      );
      
      return shareLink;
    } catch (error) {
      console.error('Failed to update share settings:', error);
      throw error;
    }
  },
  
  // Delete share link
  async deleteShareLink(shareId: string): Promise<void> {
    try {
      await pb.collection('share_links').delete(shareId);
      
      currentShareLink.set(null);
      shareLinks.update(links => links.filter(link => link.id !== shareId));
    } catch (error) {
      console.error('Failed to delete share link:', error);
      throw error;
    }
  },
  
  // Get public resume by token
  async getPublicResume(token: string, password?: string): Promise<{ resume: Resume; shareLink: ShareLink }> {
    try {
      const shareRecord = await pb.collection('share_links').getFirstListItem(
        `token = "${token}"`,
        { expand: 'resumeId' }
      );
      
      const shareLink = mapRecordToShareLink(shareRecord);
      
      // Check if link is expired
      if (shareLink.expiresAt && new Date(shareLink.expiresAt) < new Date()) {
        throw new Error('Share link has expired');
      }
      
      // Check password if required
      if (shareLink.isPasswordProtected && shareLink.password !== password) {
        throw new Error('Invalid password');
      }
      
      // Get resume data
      const resumeRecord = await pb.collection('resumes').getOne(shareLink.resumeId);
      const resume = mapRecordToResume(resumeRecord);
      
      // Increment view count
      await pb.collection('share_links').update(shareLink.id, {
        viewCount: shareLink.viewCount + 1,
        lastViewedAt: new Date().toISOString()
      });
      
      // Track analytics
      await sharingStore.trackView(shareLink.id);
      
      return { resume, shareLink };
    } catch (error) {
      console.error('Failed to get public resume:', error);
      throw error;
    }
  },
  
  // Track view analytics
  async trackView(shareId: string, metadata?: any): Promise<void> {
    try {
      await pb.collection('share_analytics').create({
        shareId,
        type: 'view',
        metadata: metadata || {},
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        referrer: document.referrer
      });
    } catch (error) {
      console.error('Failed to track view:', error);
    }
  },
  
  // Track download
  async trackDownload(shareId: string, format: string): Promise<void> {
    try {
      await pb.collection('share_analytics').create({
        shareId,
        type: 'download',
        metadata: { format },
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
      });
    } catch (error) {
      console.error('Failed to track download:', error);
    }
  },
  
  // Track share
  async trackShare(shareId: string, platform: string): Promise<void> {
    try {
      await pb.collection('share_analytics').create({
        shareId,
        type: 'share',
        metadata: { platform },
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
      });
    } catch (error) {
      console.error('Failed to track share:', error);
    }
  },
  
  // Get share analytics
  async getShareAnalytics(shareId: string): Promise<ShareAnalytics> {
    try {
      const records = await pb.collection('share_analytics').getFullList({
        filter: `shareId = "${shareId}"`,
        sort: '-timestamp'
      });
      
      const analytics = processAnalyticsData(records);
      shareAnalytics.set(analytics);
      
      return analytics;
    } catch (error) {
      console.error('Failed to get share analytics:', error);
      throw error;
    }
  },
  
  // Generate share URL
  getShareUrl(token: string, customDomain?: string): string {
    const baseUrl = customDomain || window.location.origin;
    return `${baseUrl}/r/${token}`;
  },
  
  // Share to social platforms
  shareToSocial(platform: string, url: string, title: string): void {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    
    let shareUrl = '';
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodedTitle}&body=Check out this resume: ${encodedUrl}`;
        break;
      default:
        return;
    }
    
    if (platform === 'email') {
      window.location.href = shareUrl;
    } else {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  },
  
  // Copy to clipboard
  async copyToClipboard(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textArea);
      return success;
    }
  }
};

// Helper functions
function mapRecordToShareLink(record: any): ShareLink {
  return {
    id: record.id,
    resumeId: record.resumeId,
    token: record.token,
    isPublic: record.isPublic,
    isPasswordProtected: record.isPasswordProtected,
    password: record.password,
    expiresAt: record.expiresAt,
    allowDownload: record.allowDownload,
    allowComments: record.allowComments,
    customDomain: record.customDomain,
    viewCount: record.viewCount || 0,
    lastViewedAt: record.lastViewedAt,
    createdAt: record.created,
    updatedAt: record.updated
  };
}

function mapRecordToResume(record: any): Resume {
  return {
    id: record.id,
    userId: record.userId,
    title: record.title,
    slug: record.slug,
    personalInfo: record.personalInfo || { fullName: '', email: '' },
    sections: record.sections || [],
    settings: record.settings || {},
    isPublic: record.isPublic || false,
    isTemplate: record.isTemplate || false,
    templateId: record.templateId,
    createdAt: record.created,
    updatedAt: record.updated,
    lastViewedAt: record.lastViewedAt,
    viewCount: record.viewCount || 0,
    downloadCount: record.downloadCount || 0,
    shareCount: record.shareCount || 0,
    tags: record.tags || [],
    metadata: record.metadata || {
      version: '1.0',
      exportFormats: ['pdf', 'docx']
    }
  };
}

function processAnalyticsData(records: any[]): ShareAnalytics {
  const views = records.filter(r => r.type === 'view');
  const downloads = records.filter(r => r.type === 'download');
  const shares = records.filter(r => r.type === 'share');
  
  // Process views by date
  const viewsByDate = views.reduce((acc, view) => {
    const date = new Date(view.timestamp).toISOString().split('T')[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Process unique views (simplified - by user agent)
  const uniqueViews = new Set(views.map(v => v.userAgent)).size;
  
  return {
    totalViews: views.length,
    uniqueViews,
    downloads: downloads.length,
    shares: shares.length,
    viewsByDate: Object.entries(viewsByDate).map(([date, views]) => ({ date, views: views as number })),
    viewsByCountry: [], // Would need IP geolocation
    viewsByReferrer: [], // Would process referrer data
    viewsByDevice: [] // Would process user agent data
  };
}