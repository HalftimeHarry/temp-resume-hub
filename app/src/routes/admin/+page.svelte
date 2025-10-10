<script lang="ts">
  import { goto, afterNavigate } from '$app/navigation';
  import { onMount } from 'svelte';
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import { Users, UserCheck, Crown, FileText, TrendingUp, Shield, DollarSign } from 'lucide-svelte';
  import type { PageData } from './$types';
  import { PLAN_PRICING } from '$lib/utils/plan-upgrade';
  
  export let data: PageData;
  
  // Tab state for Recent Users section
  let activeTab: 'users' | 'revenue' = 'users';
  let isNavigating = false;
  
  $: stats = data.stats;
  $: users = data.users;
  $: profiles = data.profiles;
  $: recentActivity = data.recentActivity;
  
  // Reset navigation state after any navigation
  afterNavigate(() => {
    isNavigating = false;
  });
  
  onMount(() => {
    // Reset navigation state
    isNavigating = false;
    
    console.log('🎨 Admin Dashboard Client: Component mounted');
    console.log('🎨 Admin Dashboard Client: Data received:', data);
    console.log('🎨 Admin Dashboard Client: Profile:', data.profile);
    console.log('🎨 Admin Dashboard Client: User role:', data.profile?.role);
    console.log('🎨 Admin Dashboard Client: User plan:', data.profile?.plan);
    console.log('🎨 Admin Dashboard Client: Stats:', stats);
    console.log('🎨 Admin Dashboard Client: Total users:', users?.length);
    console.log('🎨 Admin Dashboard Client: Total profiles:', profiles?.length);
  });
  
  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
  
  function getRoleBadgeClass(role: string) {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'moderator':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  }
  
  function getPlanBadgeClass(plan: string) {
    switch (plan) {
      case 'enterprise':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'pro':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }
  
  // Calculate revenue metrics
  $: revenueMetrics = (() => {
    const proUsers = profiles.filter(p => p.plan === 'pro').length;
    const enterpriseUsers = profiles.filter(p => p.plan === 'enterprise').length;
    
    // Assuming monthly billing for simplicity (in production, track actual billing cycles)
    const proMRR = proUsers * PLAN_PRICING.pro.monthly;
    const enterpriseMRR = enterpriseUsers * PLAN_PRICING.enterprise.monthly;
    const totalMRR = proMRR + enterpriseMRR;
    const totalARR = totalMRR * 12;
    
    return {
      proUsers,
      enterpriseUsers,
      proMRR,
      enterpriseMRR,
      totalMRR,
      totalARR
    };
  })();
  
  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }
</script>

<svelte:head>
  <title>Admin Dashboard - Digital Resume Hub</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
  <!-- Header -->
  <div class="bg-white border-b">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <Shield class="w-8 h-8 text-red-600" />
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p class="text-sm text-gray-600">System management and analytics</p>
          </div>
        </div>
        <Button 
          variant="outline"
          disabled={isNavigating}
          on:click={async () => {
            if (isNavigating) return;
            isNavigating = true;
            try {
              await goto('/dashboard');
            } catch (e) {
              console.error('Navigation error:', e);
              isNavigating = false;
            }
          }}
        >
          {isNavigating ? 'Loading...' : 'Back to Dashboard'}
        </Button>
      </div>
    </div>
  </div>

  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-sm font-medium text-gray-600">Total Users</CardTitle>
          <Users class="w-4 h-4 text-gray-400" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{stats.totalUsers}</div>
          <p class="text-xs text-gray-500 mt-1">Registered accounts</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-sm font-medium text-gray-600">Active Users</CardTitle>
          <UserCheck class="w-4 h-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{stats.activeUsers}</div>
          <p class="text-xs text-gray-500 mt-1">
            {stats.verifiedUsers} verified
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-sm font-medium text-gray-600">Premium Users</CardTitle>
          <Crown class="w-4 h-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{stats.proUsers + stats.enterpriseUsers}</div>
          <p class="text-xs text-gray-500 mt-1">
            {stats.proUsers} Pro, {stats.enterpriseUsers} Enterprise
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-sm font-medium text-gray-600">Total Resumes</CardTitle>
          <FileText class="w-4 h-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{stats.totalResumes}</div>
          <p class="text-xs text-gray-500 mt-1">Created resumes</p>
        </CardContent>
      </Card>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Users / Revenue -->
      <Card>
        <CardHeader>
          <div class="flex items-center justify-between">
            <div>
              <CardTitle>User Insights</CardTitle>
              <CardDescription>Latest users and revenue metrics</CardDescription>
            </div>
            <div class="flex gap-1 bg-gray-100 rounded-lg p-1">
              <button
                class="px-3 py-1.5 text-sm font-medium rounded transition-colors {activeTab === 'users' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}"
                on:click={() => activeTab = 'users'}
              >
                Users
              </button>
              <button
                class="px-3 py-1.5 text-sm font-medium rounded transition-colors {activeTab === 'revenue' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}"
                on:click={() => activeTab = 'revenue'}
              >
                Revenue
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {#if activeTab === 'users'}
            <div class="space-y-4">
              {#each profiles.slice(0, 10) as profile}
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div class="flex-1">
                    <div class="font-medium">
                      {profile.first_name} {profile.last_name}
                    </div>
                    <div class="text-sm text-gray-500">
                      {profile.expand?.user?.email || 'No email'}
                    </div>
                    <div class="flex gap-2 mt-1">
                      <span class="text-xs px-2 py-0.5 rounded border {getRoleBadgeClass(profile.role)}">
                        {profile.role}
                      </span>
                      <span class="text-xs px-2 py-0.5 rounded border {getPlanBadgeClass(profile.plan)}">
                        {profile.plan}
                      </span>
                      {#if profile.verified}
                        <span class="text-xs px-2 py-0.5 rounded border bg-green-100 text-green-800 border-green-200">
                          ✓ Verified
                        </span>
                      {/if}
                    </div>
                  </div>
                  <div class="text-xs text-gray-500">
                    {formatDate(profile.created)}
                  </div>
                </div>
              {/each}
            </div>
          {:else}
            <!-- Revenue Tab -->
            <div class="space-y-6">
              <!-- MRR & ARR Overview -->
              <div class="grid grid-cols-2 gap-4">
                <div class="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <div class="flex items-center gap-2 mb-2">
                    <DollarSign class="w-5 h-5 text-green-600" />
                    <span class="text-sm font-medium text-green-900">Monthly Recurring Revenue</span>
                  </div>
                  <div class="text-3xl font-bold text-green-900">
                    {formatCurrency(revenueMetrics.totalMRR)}
                  </div>
                  <div class="text-xs text-green-700 mt-1">
                    MRR from {revenueMetrics.proUsers + revenueMetrics.enterpriseUsers} paid users
                  </div>
                </div>
                
                <div class="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                  <div class="flex items-center gap-2 mb-2">
                    <TrendingUp class="w-5 h-5 text-blue-600" />
                    <span class="text-sm font-medium text-blue-900">Annual Recurring Revenue</span>
                  </div>
                  <div class="text-3xl font-bold text-blue-900">
                    {formatCurrency(revenueMetrics.totalARR)}
                  </div>
                  <div class="text-xs text-blue-700 mt-1">
                    Projected annual revenue
                  </div>
                </div>
              </div>
              
              <!-- Revenue Breakdown -->
              <div>
                <h4 class="text-sm font-semibold text-gray-900 mb-3">Revenue by Plan</h4>
                <div class="space-y-3">
                  <div class="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div>
                      <div class="font-medium text-green-900">Pro Plan</div>
                      <div class="text-sm text-green-700">
                        {revenueMetrics.proUsers} users × {formatCurrency(PLAN_PRICING.pro.monthly)}/mo
                      </div>
                    </div>
                    <div class="text-right">
                      <div class="text-lg font-bold text-green-900">
                        {formatCurrency(revenueMetrics.proMRR)}
                      </div>
                      <div class="text-xs text-green-700">per month</div>
                    </div>
                  </div>
                  
                  <div class="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <div>
                      <div class="font-medium text-purple-900">Enterprise Plan</div>
                      <div class="text-sm text-purple-700">
                        {revenueMetrics.enterpriseUsers} users × {formatCurrency(PLAN_PRICING.enterprise.monthly)}/mo
                      </div>
                    </div>
                    <div class="text-right">
                      <div class="text-lg font-bold text-purple-900">
                        {formatCurrency(revenueMetrics.enterpriseMRR)}
                      </div>
                      <div class="text-xs text-purple-700">per month</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Quick Stats -->
              <div class="pt-4 border-t">
                <div class="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div class="text-2xl font-bold text-gray-900">{stats.totalUsers}</div>
                    <div class="text-xs text-gray-600">Total Users</div>
                  </div>
                  <div>
                    <div class="text-2xl font-bold text-green-600">{revenueMetrics.proUsers + revenueMetrics.enterpriseUsers}</div>
                    <div class="text-xs text-gray-600">Paid Users</div>
                  </div>
                  <div>
                    <div class="text-2xl font-bold text-blue-600">
                      {stats.totalUsers > 0 ? Math.round(((revenueMetrics.proUsers + revenueMetrics.enterpriseUsers) / stats.totalUsers) * 100) : 0}%
                    </div>
                    <div class="text-xs text-gray-600">Conversion Rate</div>
                  </div>
                </div>
              </div>
            </div>
          {/if}
        </CardContent>
      </Card>

      <!-- Subscription Management -->
      <Card>
        <CardHeader>
          <CardTitle>Subscription Management</CardTitle>
          <CardDescription>Manage pricing plans and special events</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="text-center py-12 text-gray-500">
            <Crown class="w-16 h-16 mx-auto mb-4 opacity-50 text-yellow-600" />
            <h3 class="text-lg font-medium text-gray-900 mb-2">Pricing & Plans</h3>
            <p class="text-sm mb-6">Configure subscription rates, special promotions, and plan features</p>
            <Button variant="outline" disabled>
              Coming Soon
            </Button>
            <div class="mt-6 text-xs text-gray-400">
              <p>Future features:</p>
              <ul class="mt-2 space-y-1">
                <li>• Set Free, Pro, and Enterprise pricing</li>
                <li>• Create promotional discounts</li>
                <li>• Manage special event pricing</li>
                <li>• Configure plan features and limits</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- User Management Section -->
    <Card class="mt-6">
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>Manage user accounts and permissions</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b">
                <th class="text-left py-3 px-4 font-medium text-gray-600">User</th>
                <th class="text-left py-3 px-4 font-medium text-gray-600">Email</th>
                <th class="text-left py-3 px-4 font-medium text-gray-600">Role</th>
                <th class="text-left py-3 px-4 font-medium text-gray-600">Plan</th>
                <th class="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                <th class="text-left py-3 px-4 font-medium text-gray-600">Joined</th>
                <th class="text-right py-3 px-4 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {#each profiles as profile}
                <tr class="border-b hover:bg-gray-50">
                  <td class="py-3 px-4">
                    <div class="font-medium">
                      {profile.first_name} {profile.last_name}
                    </div>
                  </td>
                  <td class="py-3 px-4 text-sm text-gray-600">
                    {profile.expand?.user?.email || 'N/A'}
                  </td>
                  <td class="py-3 px-4">
                    <span class="text-xs px-2 py-1 rounded border {getRoleBadgeClass(profile.role)}">
                      {profile.role}
                    </span>
                  </td>
                  <td class="py-3 px-4">
                    <span class="text-xs px-2 py-1 rounded border {getPlanBadgeClass(profile.plan)}">
                      {profile.plan}
                    </span>
                  </td>
                  <td class="py-3 px-4">
                    <div class="flex gap-1">
                      {#if profile.active}
                        <span class="text-xs px-2 py-1 rounded border bg-green-100 text-green-800 border-green-200">
                          Active
                        </span>
                      {:else}
                        <span class="text-xs px-2 py-1 rounded border bg-red-100 text-red-800 border-red-200">
                          Inactive
                        </span>
                      {/if}
                      {#if profile.verified}
                        <span class="text-xs px-2 py-1 rounded border bg-blue-100 text-blue-800 border-blue-200">
                          ✓
                        </span>
                      {/if}
                    </div>
                  </td>
                  <td class="py-3 px-4 text-sm text-gray-600">
                    {formatDate(profile.created)}
                  </td>
                  <td class="py-3 px-4 text-right">
                    <Button variant="ghost" size="sm">
                      Manage
                    </Button>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  </div>
</div>

<style>
  table {
    border-collapse: collapse;
  }
</style>
