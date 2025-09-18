<script lang="ts">
  import { onMount } from 'svelte';
  import { userAnalytics, analyticsStore, isLoadingAnalytics, analyticsFilters } from '$lib/stores/analytics';
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import { Skeleton } from '$lib/components/ui/skeleton';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '$lib/components/ui/select';
  import { 
    BarChart3, 
    Eye, 
    Download, 
    Share2, 
    TrendingUp,
    TrendingDown,
    Calendar,
    FileText,
    Users,
    Activity,
    Filter,
    Download as DownloadIcon,
    RefreshCw
  } from 'lucide-svelte';
  import { toast } from 'svelte-sonner';
  
  let selectedTimeRange = '30d';
  let showFilters = false;
  let isRefreshing = false;
  
  $: analytics = $userAnalytics;
  $: loading = $isLoadingAnalytics;
  $: filters = $analyticsFilters;
  
  onMount(async () => {
    await loadAnalytics();
  });
  
  async function loadAnalytics() {
    try {
      await analyticsStore.loadUserAnalytics();
    } catch (error) {
      console.error('Failed to load analytics:', error);
      toast.error('Failed to load analytics');
    }
  }
  
  async function refreshAnalytics() {
    isRefreshing = true;
    try {
      await analyticsStore.loadUserAnalytics();
      toast.success('Analytics refreshed');
    } catch (error) {
      console.error('Failed to refresh analytics:', error);
      toast.error('Failed to refresh analytics');
    } finally {
      isRefreshing = false;
    }
  }
  
  function updateTimeRange(range: string) {
    selectedTimeRange = range;
    
    const now = new Date();
    let startDate: Date;
    
    switch (range) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
    
    analyticsStore.updateFilters({
      dateRange: {
        start: startDate.toISOString().split('T')[0],
        end: now.toISOString().split('T')[0]
      }
    });
  }
  
  async function exportAnalytics(format: 'csv' | 'json') {
    try {
      await analyticsStore.exportAnalytics(format);
      toast.success(`Analytics exported as ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Failed to export analytics:', error);
      toast.error('Failed to export analytics');
    }
  }
  
  function formatNumber(num: number): string {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  }
  
  function formatPercentage(num: number): string {
    return `${num >= 0 ? '+' : ''}${num.toFixed(1)}%`;
  }
  
  function getGrowthIcon(growth: number) {
    return growth >= 0 ? TrendingUp : TrendingDown;
  }
  
  function getGrowthColor(growth: number): string {
    return growth >= 0 ? 'text-green-600' : 'text-red-600';
  }
</script>

<div class="space-y-6">
  <!-- Header -->
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
      <p class="text-gray-600">Track your resume performance and engagement</p>
    </div>
    
    <div class="flex items-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        on:click={() => showFilters = !showFilters}
      >
        <Filter class="h-4 w-4 mr-1" />
        Filters
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        on:click={refreshAnalytics}
        disabled={isRefreshing}
      >
        {#if isRefreshing}
          <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-1"></div>
        {:else}
          <RefreshCw class="h-4 w-4 mr-1" />
        {/if}
        Refresh
      </Button>
      
      <select 
        class="w-32 px-3 py-2 border border-input bg-background text-sm rounded-md"
        bind:value={selectedTimeRange}
        on:change={() => updateTimeRange(selectedTimeRange)}
      >
        <option value="7d">Last 7 days</option>
        <option value="30d">Last 30 days</option>
        <option value="90d">Last 90 days</option>
        <option value="1y">Last year</option>
      </select>
    </div>
  </div>
  
  <!-- Filters Panel -->
  {#if showFilters}
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
        <CardDescription>Customize your analytics view</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="space-y-2">
            <Label>Start Date</Label>
            <Input
              type="date"
              value={filters.dateRange.start}
              on:change={(e) => analyticsStore.updateFilters({
                dateRange: { ...filters.dateRange, start: e.currentTarget.value }
              })}
            />
          </div>
          
          <div class="space-y-2">
            <Label>End Date</Label>
            <Input
              type="date"
              value={filters.dateRange.end}
              on:change={(e) => analyticsStore.updateFilters({
                dateRange: { ...filters.dateRange, end: e.currentTarget.value }
              })}
            />
          </div>
          
          <div class="flex items-end space-x-2">
            <Button variant="outline" size="sm" on:click={() => exportAnalytics('csv')}>
              <DownloadIcon class="h-4 w-4 mr-1" />
              Export CSV
            </Button>
            <Button variant="outline" size="sm" on:click={() => exportAnalytics('json')}>
              <DownloadIcon class="h-4 w-4 mr-1" />
              Export JSON
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  {/if}
  
  <!-- Key Metrics -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <!-- Total Views -->
    <Card>
      <CardContent class="p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Total Views</p>
            {#if loading}
              <Skeleton class="h-8 w-16 mt-1" />
            {:else}
              <p class="text-2xl font-bold">{formatNumber(analytics?.totalViews || 0)}</p>
            {/if}
          </div>
          <div class="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Eye class="h-6 w-6 text-blue-600" />
          </div>
        </div>
        {#if analytics?.growthMetrics.viewsGrowth !== undefined}
          <div class="flex items-center mt-2">
            <svelte:component 
              this={getGrowthIcon(analytics.growthMetrics.viewsGrowth)} 
              class="h-4 w-4 {getGrowthColor(analytics.growthMetrics.viewsGrowth)} mr-1" 
            />
            <span class="text-sm {getGrowthColor(analytics.growthMetrics.viewsGrowth)}">
              {formatPercentage(analytics.growthMetrics.viewsGrowth)}
            </span>
            <span class="text-sm text-gray-500 ml-1">vs last period</span>
          </div>
        {/if}
      </CardContent>
    </Card>
    
    <!-- Total Downloads -->
    <Card>
      <CardContent class="p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Total Downloads</p>
            {#if loading}
              <Skeleton class="h-8 w-16 mt-1" />
            {:else}
              <p class="text-2xl font-bold">{formatNumber(analytics?.totalDownloads || 0)}</p>
            {/if}
          </div>
          <div class="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
            <Download class="h-6 w-6 text-green-600" />
          </div>
        </div>
        {#if analytics?.growthMetrics.downloadsGrowth !== undefined}
          <div class="flex items-center mt-2">
            <svelte:component 
              this={getGrowthIcon(analytics.growthMetrics.downloadsGrowth)} 
              class="h-4 w-4 {getGrowthColor(analytics.growthMetrics.downloadsGrowth)} mr-1" 
            />
            <span class="text-sm {getGrowthColor(analytics.growthMetrics.downloadsGrowth)}">
              {formatPercentage(analytics.growthMetrics.downloadsGrowth)}
            </span>
            <span class="text-sm text-gray-500 ml-1">vs last period</span>
          </div>
        {/if}
      </CardContent>
    </Card>
    
    <!-- Total Shares -->
    <Card>
      <CardContent class="p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Total Shares</p>
            {#if loading}
              <Skeleton class="h-8 w-16 mt-1" />
            {:else}
              <p class="text-2xl font-bold">{formatNumber(analytics?.totalShares || 0)}</p>
            {/if}
          </div>
          <div class="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
            <Share2 class="h-6 w-6 text-purple-600" />
          </div>
        </div>
        {#if analytics?.growthMetrics.sharesGrowth !== undefined}
          <div class="flex items-center mt-2">
            <svelte:component 
              this={getGrowthIcon(analytics.growthMetrics.sharesGrowth)} 
              class="h-4 w-4 {getGrowthColor(analytics.growthMetrics.sharesGrowth)} mr-1" 
            />
            <span class="text-sm {getGrowthColor(analytics.growthMetrics.sharesGrowth)}">
              {formatPercentage(analytics.growthMetrics.sharesGrowth)}
            </span>
            <span class="text-sm text-gray-500 ml-1">vs last period</span>
          </div>
        {/if}
      </CardContent>
    </Card>
    
    <!-- Total Resumes -->
    <Card>
      <CardContent class="p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Total Resumes</p>
            {#if loading}
              <Skeleton class="h-8 w-16 mt-1" />
            {:else}
              <p class="text-2xl font-bold">{analytics?.totalResumes || 0}</p>
            {/if}
          </div>
          <div class="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
            <FileText class="h-6 w-6 text-orange-600" />
          </div>
        </div>
        {#if analytics?.averageViewsPerResume}
          <div class="flex items-center mt-2">
            <span class="text-sm text-gray-600">
              {analytics.averageViewsPerResume.toFixed(1)} avg views per resume
            </span>
          </div>
        {/if}
      </CardContent>
    </Card>
  </div>
  
  <!-- Top Performing Resumes -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center space-x-2">
          <BarChart3 class="h-5 w-5" />
          <span>Top Performing Resumes</span>
        </CardTitle>
        <CardDescription>Your most viewed resumes</CardDescription>
      </CardHeader>
      <CardContent>
        {#if loading}
          <div class="space-y-3">
            {#each Array(5) as _}
              <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <Skeleton class="h-4 w-32" />
                <Skeleton class="h-4 w-16" />
              </div>
            {/each}
          </div>
        {:else if analytics?.topPerformingResumes.length}
          <div class="space-y-3">
            {#each analytics.topPerformingResumes as resume, index}
              <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div class="flex items-center space-x-3">
                  <div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600">
                    {index + 1}
                  </div>
                  <span class="font-medium text-gray-900 truncate">{resume.title}</span>
                </div>
                <div class="flex items-center space-x-2">
                  <Badge variant="secondary" class="text-xs">
                    <Eye class="h-3 w-3 mr-1" />
                    {resume.views}
                  </Badge>
                  <Badge variant="outline" class="text-xs">
                    <Download class="h-3 w-3 mr-1" />
                    {resume.downloads}
                  </Badge>
                </div>
              </div>
            {/each}
          </div>
        {:else}
          <div class="text-center py-8 text-gray-500">
            <FileText class="h-12 w-12 mx-auto mb-4" />
            <p>No resume data available</p>
          </div>
        {/if}
      </CardContent>
    </Card>
    
    <!-- Recent Activity -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center space-x-2">
          <Activity class="h-5 w-5" />
          <span>Recent Activity</span>
        </CardTitle>
        <CardDescription>Latest interactions with your resumes</CardDescription>
      </CardHeader>
      <CardContent>
        {#if loading}
          <div class="space-y-3">
            {#each Array(5) as _}
              <div class="flex items-center space-x-3">
                <Skeleton class="h-8 w-8 rounded-full" />
                <div class="flex-1">
                  <Skeleton class="h-4 w-full mb-1" />
                  <Skeleton class="h-3 w-24" />
                </div>
              </div>
            {/each}
          </div>
        {:else if analytics?.recentActivity.length}
          <div class="space-y-3">
            {#each analytics.recentActivity.slice(0, 5) as activity}
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  {#if activity.type === 'view'}
                    <Eye class="h-4 w-4 text-blue-600" />
                  {:else if activity.type === 'download'}
                    <Download class="h-4 w-4 text-green-600" />
                  {:else if activity.type === 'share'}
                    <Share2 class="h-4 w-4 text-purple-600" />
                  {:else}
                    <Activity class="h-4 w-4 text-gray-600" />
                  {/if}
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 truncate">
                    {activity.resumeTitle || 'Unknown Resume'}
                  </p>
                  <div class="flex items-center space-x-2">
                    <Badge variant="outline" class="text-xs capitalize">
                      {activity.type}
                    </Badge>
                    <span class="text-xs text-gray-500">
                      {new Date(activity.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            {/each}
          </div>
        {:else}
          <div class="text-center py-8 text-gray-500">
            <Activity class="h-12 w-12 mx-auto mb-4" />
            <p>No recent activity</p>
          </div>
        {/if}
      </CardContent>
    </Card>
  </div>
  
  <!-- Most Viewed Resume Highlight -->
  {#if analytics?.mostViewedResume}
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center space-x-2">
          <TrendingUp class="h-5 w-5" />
          <span>Most Viewed Resume</span>
        </CardTitle>
        <CardDescription>Your top performing resume</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">
              {analytics.mostViewedResume.title}
            </h3>
            <p class="text-sm text-gray-600">
              This resume has received the most attention from viewers
            </p>
          </div>
          <div class="text-right">
            <div class="text-2xl font-bold text-blue-600">
              {formatNumber(analytics.mostViewedResume.views)}
            </div>
            <div class="text-sm text-gray-600">views</div>
          </div>
        </div>
      </CardContent>
    </Card>
  {/if}
</div>