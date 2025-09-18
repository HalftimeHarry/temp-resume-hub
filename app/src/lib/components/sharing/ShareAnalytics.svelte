<script lang="ts">
  import { onMount } from 'svelte';
  import { shareAnalytics, sharingStore } from '$lib/stores/sharing';
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Badge } from '$lib/components/ui/badge';
  import { Skeleton } from '$lib/components/ui/skeleton';
  import { 
    BarChart3, 
    Eye, 
    Download, 
    Share2, 
    TrendingUp,
    Calendar,
    Globe,
    Monitor,
    Smartphone,
    Tablet
  } from 'lucide-svelte';
  import type { ShareLink } from '$lib/stores/sharing';
  
  export let shareLink: ShareLink;
  
  let isLoading = true;
  
  $: analytics = $shareAnalytics;
  
  onMount(async () => {
    try {
      await sharingStore.getShareAnalytics(shareLink.id);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      isLoading = false;
    }
  });
  
  function formatNumber(num: number): string {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
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
  <!-- Overview Stats -->
  <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
    <Card>
      <CardContent class="p-6">
        <div class="flex items-center space-x-2">
          <Eye class="h-4 w-4 text-blue-500" />
          <span class="text-sm font-medium text-gray-600">Total Views</span>
        </div>
        {#if isLoading}
          <Skeleton class="h-8 w-16 mt-2" />
        {:else}
          <div class="text-2xl font-bold mt-2">{formatNumber(analytics?.totalViews || 0)}</div>
        {/if}
      </CardContent>
    </Card>
    
    <Card>
      <CardContent class="p-6">
        <div class="flex items-center space-x-2">
          <TrendingUp class="h-4 w-4 text-green-500" />
          <span class="text-sm font-medium text-gray-600">Unique Views</span>
        </div>
        {#if isLoading}
          <Skeleton class="h-8 w-16 mt-2" />
        {:else}
          <div class="text-2xl font-bold mt-2">{formatNumber(analytics?.uniqueViews || 0)}</div>
        {/if}
      </CardContent>
    </Card>
    
    <Card>
      <CardContent class="p-6">
        <div class="flex items-center space-x-2">
          <Download class="h-4 w-4 text-purple-500" />
          <span class="text-sm font-medium text-gray-600">Downloads</span>
        </div>
        {#if isLoading}
          <Skeleton class="h-8 w-16 mt-2" />
        {:else}
          <div class="text-2xl font-bold mt-2">{formatNumber(analytics?.downloads || 0)}</div>
        {/if}
      </CardContent>
    </Card>
    
    <Card>
      <CardContent class="p-6">
        <div class="flex items-center space-x-2">
          <Share2 class="h-4 w-4 text-orange-500" />
          <span class="text-sm font-medium text-gray-600">Shares</span>
        </div>
        {#if isLoading}
          <Skeleton class="h-8 w-16 mt-2" />
        {:else}
          <div class="text-2xl font-bold mt-2">{formatNumber(analytics?.shares || 0)}</div>
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
      <CardDescription>
        Daily view counts for the past 30 days
      </CardDescription>
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
      {:else if analytics?.viewsByDate.length}
        <div class="space-y-3">
          {#each analytics.viewsByDate.slice(-7) as dayData}
            <div class="flex items-center space-x-3">
              <div class="w-20 text-sm text-gray-600">
                {new Date(dayData.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
              <div class="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  class="bg-blue-500 h-2 rounded-full transition-all"
                  style="width: {Math.max(5, (dayData.views / Math.max(...analytics.viewsByDate.map(d => d.views))) * 100)}%"
                ></div>
              </div>
              <div class="w-8 text-sm font-medium text-gray-900">
                {dayData.views}
              </div>
            </div>
          {/each}
        </div>
      {:else}
        <div class="text-center py-8 text-gray-500">
          <Calendar class="h-12 w-12 mx-auto mb-4" />
          <p>No view data available yet</p>
        </div>
      {/if}
    </CardContent>
  </Card>
  
  <!-- Geographic Distribution -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center space-x-2">
          <Globe class="h-5 w-5" />
          <span>Top Countries</span>
        </CardTitle>
        <CardDescription>
          Where your resume is being viewed from
        </CardDescription>
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
        {:else if analytics?.viewsByCountry.length}
          <div class="space-y-3">
            {#each analytics.viewsByCountry.slice(0, 5) as countryData}
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-900">{countryData.country}</span>
                <Badge variant="secondary">{countryData.views}</Badge>
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
        <CardDescription>
          How visitors are accessing your resume
        </CardDescription>
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
        {:else if analytics?.viewsByDevice.length}
          <div class="space-y-3">
            {#each analytics.viewsByDevice as deviceData}
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <svelte:component this={getDeviceIcon(deviceData.device)} class="h-4 w-4 text-gray-400" />
                  <span class="text-sm text-gray-900 capitalize">{deviceData.device}</span>
                </div>
                <Badge variant="secondary">{deviceData.views}</Badge>
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
  
  <!-- Referrer Sources -->
  <Card>
    <CardHeader>
      <CardTitle class="flex items-center space-x-2">
        <TrendingUp class="h-5 w-5" />
        <span>Traffic Sources</span>
      </CardTitle>
      <CardDescription>
        Where your visitors are coming from
      </CardDescription>
    </CardHeader>
    <CardContent>
      {#if isLoading}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          {#each Array(6) as _}
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <Skeleton class="h-4 w-24" />
              <Skeleton class="h-4 w-8" />
            </div>
          {/each}
        </div>
      {:else if analytics?.viewsByReferrer.length}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          {#each analytics.viewsByReferrer as referrerData}
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span class="text-sm text-gray-900 truncate">
                {referrerData.referrer || 'Direct'}
              </span>
              <Badge variant="secondary">{referrerData.views}</Badge>
            </div>
          {/each}
        </div>
      {:else}
        <div class="text-center py-8 text-gray-500">
          <TrendingUp class="h-12 w-12 mx-auto mb-4" />
          <p>No referrer data available</p>
        </div>
      {/if}
    </CardContent>
  </Card>
</div>