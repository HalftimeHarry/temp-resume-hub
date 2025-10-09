<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import { Users, UserCheck, Crown, FileText, TrendingUp, Shield } from 'lucide-svelte';
  import type { PageData } from './$types';
  
  export let data: PageData;
  
  $: stats = data.stats;
  $: users = data.users;
  $: profiles = data.profiles;
  $: recentActivity = data.recentActivity;
  
  onMount(() => {
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
            <div class="flex items-center gap-2">
              <h1 class="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              {#if data.profile}
                <span class="text-xs px-2 py-1 rounded border bg-red-100 text-red-800 border-red-300 font-medium">
                  Role: {data.profile.role}
                </span>
                <span class="text-xs px-2 py-1 rounded border bg-gray-100 text-gray-800 border-gray-300">
                  Plan: {data.profile.plan}
                </span>
              {/if}
            </div>
            <p class="text-sm text-gray-600">System management and analytics</p>
          </div>
        </div>
        <Button variant="outline" on:click={() => goto('/dashboard')}>
          Back to Dashboard
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
      <!-- Recent Users -->
      <Card>
        <CardHeader>
          <CardTitle>Recent Users</CardTitle>
          <CardDescription>Latest registered users</CardDescription>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      <!-- Recent Activity -->
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest resume updates</CardDescription>
        </CardHeader>
        <CardContent>
          {#if recentActivity.length > 0}
            <div class="space-y-4">
              {#each recentActivity.slice(0, 10) as resume}
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div class="flex-1">
                    <div class="font-medium">{resume.title}</div>
                    <div class="text-sm text-gray-500">
                      by {resume.expand?.user?.name || 'Unknown'}
                    </div>
                  </div>
                  <div class="text-xs text-gray-500">
                    {formatDate(resume.updated)}
                  </div>
                </div>
              {/each}
            </div>
          {:else}
            <div class="text-center py-8 text-gray-500">
              <FileText class="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No recent activity</p>
            </div>
          {/if}
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
