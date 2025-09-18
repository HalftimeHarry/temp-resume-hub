<script lang="ts">
  import { onMount } from 'svelte';
  import { resumeAnalytics, analyticsStore } from '$lib/stores/analytics';
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Badge } from '$lib/components/ui/badge';
  import { Skeleton } from '$lib/components/ui/skeleton';
  import { Button } from '$lib/components/ui/button';
  import { 
    Eye, 
    Download, 
    Share2, 
    Clock,
    Smartphone,
    Monitor,
    Tablet,
    Globe,
    TrendingUp,
    BarChart3,
    Users,
    MousePointer
  } from 'lucide-svelte';
  import type { ResumeAnalytics as ResumeAnalyticsType } from '$lib/stores/analytics';
  
  export let resumeId: string;
  export let resumeTitle: string;
  
  let analytics: ResumeAnalyticsType | null = null;
  let isLoading = true;
  
  $: analyticsMap = $resumeAnalytics;
  
  onMount(async () => {
    await loadAnalytics();
  });
  
  async function loadAnalytics() {
    try {
      analytics = await analyticsStore.loadResumeAnalytics(resumeId);
    } catch (error) {
      console.error('Failed to load resume analytics:', error);
    } finally {
      isLoading = false;
    }
  }
  
  function formatNumber(num: number): string {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  }
  
  function formatPercentage(num: number): string {
    return `${num.toFixed(1)}%`;
  }
  
  function formatTime(seconds: number): string {
    if (seconds < 60) {
      return `${seconds}s`;
    } else if (seconds < 3600) {
      return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    } else {
      return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
    }
  }
  
  function getDeviceIcon(device: string) {
    switch (device.toLowerCase()) {
      case 'mobile':
        return Smartphone;
      case 'tablet':
        return Tablet;
      default:
        return Monitor;
    }
  }
</script>

<div class="space-y-6">
  <!-- Header -->
  <div class="flex items-center justify-between">
    <div>
      <h2 class="text-xl font-semibold text-gray-900">Resume Analytics</h2>
      <p class="text-gray-600">{resumeTitle}</p>
    </div>
    <Button variant="outline" size="sm" on:click={loadAnalytics} disabled={isLoading}>
      {#if isLoading}
        <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-1"></div>
      {/if}
      Refresh
    </Button>
  </div>
  
  <!-- Key Metrics -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <!-- Total Views -->
    <Card>
      <CardContent class="p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Total Views</p>
            {#if isLoading}
              <Skeleton class="h-8 w-16 mt-1" />
            {:else}
              <p class="text-2xl font-bold">{formatNumber(analytics?.views.total || 0)}</p>
            {/if}
          </div>
          <div class="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Eye class="h-6 w-6 text-blue-600" />
          </div>
        </div>
        {#if analytics?.views.unique}
          <p class="text-xs text-gray-500 mt-1">
            {analytics.views.unique} unique viewers
          </p>
        {/if}
      </CardContent>
    </Card>
    
    <!-- Total Downloads -->
    <Card>
      <CardContent class="p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Downloads</p>
            {#if isLoading}
              <Skeleton class="h-8 w-16 mt-1" />
            {:else}
              <p class="text-2xl font-bold">{formatNumber(analytics?.downloads.total || 0)}</p>
            {/if}
          </div>
          <div class="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
            <Download class="h-6 w-6 text-green-600" />
          </div>
        </div>
        {#if analytics?.views.total && analytics?.downloads.total}
          <p class="text-xs text-gray-500 mt-1">
            {formatPercentage((analytics.downloads.total / analytics.views.total) * 100)} conversion rate
          </p>
        {/if}
      </CardContent>
    </Card>
    
    <!-- Total Shares -->
    <Card>
      <CardContent class="p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Shares</p>
            {#if isLoading}
              <Skeleton class="h-8 w-16 mt-1" />
            {:else}
              <p class="text-2xl font-bold">{formatNumber(analytics?.shares.total || 0)}</p>
            {/if}
          </div>
          <div class="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
            <Share2 class="h-6 w-6 text-purple-600" />
          </div>
        </div>
        {#if analytics?.views.total && analytics?.shares.total}
          <p class="text-xs text-gray-500 mt-1">
            {formatPercentage((analytics.shares.total / analytics.views.total) * 100)} share rate
          </p>
        {/if}
      </CardContent>
    </Card>
    
    <!-- Engagement -->
    <Card>
      <CardContent class="p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Avg. Time</p>
            {#if isLoading}
              <Skeleton class="h-8 w-16 mt-1" />
            {:else}
              <p class="text-2xl font-bold">
                {formatTime(analytics?.engagement.averageTimeOnPage || 0)}
              </p>
            {/if}
          </div>
          <div class="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
            <Clock class="h-6 w-6 text-orange-600" />
          </div>
        </div>
        {#if analytics?.engagement.bounceRate}
          <p class="text-xs text-gray-500 mt-1">
            {formatPercentage(analytics.engagement.bounceRate)} bounce rate
          </p>
        {/if}
      </CardContent>
    </Card>
  </div>
  
  <!-- Views Over Time -->
  <Card>
    <CardHeader>
      <CardTitle class="flex items-center space-x-2">
        <BarChart3 class="h-5 w-5" />
        <span>Views Over Time</span>
      </CardTitle>
      <CardDescription>Daily view counts for the past 30 days</CardDescription>
    </CardHeader>
    <CardContent>
      {#if isLoading}
        <div class="space-y-3">
          {#each Array(7) as _}
            <div class="flex items-center space-x-3">
              <Skeleton class="h-4 w-20" />
              <Skeleton class="h-4 flex-1" />
              <Skeleton class="h-4 w-8" />
            </div>
          {/each}
        </div>
      {:else if analytics?.views.byDate.length}
        <div class="space-y-3">
          {#each analytics.views.byDate.slice(-7) as dayData}
            <div class="flex items-center space-x-3">
              <div class="w-20 text-sm text-gray-600">
                {new Date(dayData.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
              <div class="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  class="bg-blue-500 h-2 rounded-full transition-all"
                  style="width: {Math.max(5, (dayData.count / Math.max(...analytics.views.byDate.map(d => d.count))) * 100)}%"
                ></div>
              </div>
              <div class="w-8 text-sm font-medium text-gray-900">
                {dayData.count}
              </div>
            </div>
          {/each}
        </div>
      {:else}
        <div class="text-center py-8 text-gray-500">
          <BarChart3 class="h-12 w-12 mx-auto mb-4" />
          <p>No view data available yet</p>
        </div>
      {/if}
    </CardContent>
  </Card>
  
  <!-- Detailed Analytics -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Download Formats -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center space-x-2">
          <Download class="h-5 w-5" />
          <span>Download Formats</span>
        </CardTitle>
        <CardDescription>Preferred download formats</CardDescription>
      </CardHeader>
      <CardContent>
        {#if isLoading}
          <div class="space-y-3">
            {#each Array(3) as _}
              <div class="flex items-center justify-between">
                <Skeleton class="h-4 w-16" />
                <Skeleton class="h-4 w-8" />
              </div>
            {/each}
          </div>
        {:else if analytics?.downloads.byFormat.length}
          <div class="space-y-3">
            {#each analytics.downloads.byFormat as formatData}
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-900 uppercase">{formatData.format}</span>
                <div class="flex items-center space-x-2">
                  <div class="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      class="bg-green-500 h-2 rounded-full"
                      style="width: {(formatData.count / Math.max(...analytics.downloads.byFormat.map(f => f.count))) * 100}%"
                    ></div>
                  </div>
                  <Badge variant="secondary">{formatData.count}</Badge>
                </div>
              </div>
            {/each}
          </div>
        {:else}
          <div class="text-center py-8 text-gray-500">
            <Download class="h-12 w-12 mx-auto mb-4" />
            <p>No download data available</p>
          </div>
        {/if}
      </CardContent>
    </Card>
    
    <!-- Share Platforms -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center space-x-2">
          <Share2 class="h-5 w-5" />
          <span>Share Platforms</span>
        </CardTitle>
        <CardDescription>Where your resume is being shared</CardDescription>
      </CardHeader>
      <CardContent>
        {#if isLoading}
          <div class="space-y-3">
            {#each Array(4) as _}
              <div class="flex items-center justify-between">
                <Skeleton class="h-4 w-20" />
                <Skeleton class="h-4 w-8" />
              </div>
            {/each}
          </div>
        {:else if analytics?.shares.byPlatform.length}
          <div class="space-y-3">
            {#each analytics.shares.byPlatform as platformData}
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-900 capitalize">{platformData.platform}</span>
                <div class="flex items-center space-x-2">
                  <div class="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      class="bg-purple-500 h-2 rounded-full"
                      style="width: {(platformData.count / Math.max(...analytics.shares.byPlatform.map(p => p.count))) * 100}%"
                    ></div>
                  </div>
                  <Badge variant="secondary">{platformData.count}</Badge>
                </div>
              </div>
            {/each}
          </div>
        {:else}
          <div class="text-center py-8 text-gray-500">
            <Share2 class="h-12 w-12 mx-auto mb-4" />
            <p>No share data available</p>
          </div>
        {/if}
      </CardContent>
    </Card>
    
    <!-- Geographic Distribution -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center space-x-2">
          <Globe class="h-5 w-5" />
          <span>Geographic Distribution</span>
        </CardTitle>
        <CardDescription>Where your viewers are located</CardDescription>
      </CardHeader>
      <CardContent>
        {#if isLoading}
          <div class="space-y-3">
            {#each Array(5) as _}
              <div class="flex items-center justify-between">
                <Skeleton class="h-4 w-24" />
                <Skeleton class="h-4 w-8" />
              </div>
            {/each}
          </div>
        {:else if analytics?.views.byCountry.length}
          <div class="space-y-3">
            {#each analytics.views.byCountry.slice(0, 5) as countryData}
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-900">{countryData.country}</span>
                <Badge variant="secondary">{countryData.count}</Badge>
              </div>
            {/each}
          </div>
        {:else}
          <div class="text-center py-8 text-gray-500">
            <Globe class="h-12 w-12 mx-auto mb-4" />
            <p>No geographic data available</p>
          </div>
        {/if}
      </CardContent>
    </Card>
    
    <!-- Device Types -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center space-x-2">
          <Monitor class="h-5 w-5" />
          <span>Device Types</span>
        </CardTitle>
        <CardDescription>How visitors access your resume</CardDescription>
      </CardHeader>
      <CardContent>
        {#if isLoading}
          <div class="space-y-3">
            {#each Array(3) as _}
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <Skeleton class="h-4 w-4" />
                  <Skeleton class="h-4 w-16" />
                </div>
                <Skeleton class="h-4 w-8" />
              </div>
            {/each}
          </div>
        {:else if analytics?.views.byDevice.length}
          <div class="space-y-3">
            {#each analytics.views.byDevice as deviceData}
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <svelte:component this={getDeviceIcon(deviceData.device)} class="h-4 w-4 text-gray-400" />
                  <span class="text-sm text-gray-900 capitalize">{deviceData.device}</span>
                </div>
                <Badge variant="secondary">{deviceData.count}</Badge>
              </div>
            {/each}
          </div>
        {:else}
          <div class="text-center py-8 text-gray-500">
            <Monitor class="h-12 w-12 mx-auto mb-4" />
            <p>No device data available</p>
          </div>
        {/if}
      </CardContent>
    </Card>
  </div>
  
  <!-- Engagement Metrics -->
  <Card>
    <CardHeader>
      <CardTitle class="flex items-center space-x-2">
        <Users class="h-5 w-5" />
        <span>Engagement Metrics</span>
      </CardTitle>
      <CardDescription>How users interact with your resume</CardDescription>
    </CardHeader>
    <CardContent>
      {#if isLoading}
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          {#each Array(4) as _}
            <div class="text-center p-4 bg-gray-50 rounded-lg">
              <Skeleton class="h-6 w-16 mx-auto mb-2" />
              <Skeleton class="h-4 w-20 mx-auto" />
            </div>
          {/each}
        </div>
      {:else}
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="text-center p-4 bg-gray-50 rounded-lg">
            <div class="text-2xl font-bold text-gray-900 mb-1">
              {formatTime(analytics?.engagement.averageTimeOnPage || 0)}
            </div>
            <div class="text-sm text-gray-600">Avg. Time on Page</div>
          </div>
          
          <div class="text-center p-4 bg-gray-50 rounded-lg">
            <div class="text-2xl font-bold text-gray-900 mb-1">
              {formatPercentage(analytics?.engagement.bounceRate || 0)}
            </div>
            <div class="text-sm text-gray-600">Bounce Rate</div>
          </div>
          
          <div class="text-center p-4 bg-gray-50 rounded-lg">
            <div class="text-2xl font-bold text-gray-900 mb-1">
              {formatPercentage(analytics?.engagement.clickThroughRate || 0)}
            </div>
            <div class="text-sm text-gray-600">Click-through Rate</div>
          </div>
          
          <div class="text-center p-4 bg-gray-50 rounded-lg">
            <div class="text-2xl font-bold text-gray-900 mb-1">
              {formatPercentage(analytics?.engagement.conversionRate || 0)}
            </div>
            <div class="text-sm text-gray-600">Conversion Rate</div>
          </div>
        </div>
      {/if}
    </CardContent>
  </Card>
</div>