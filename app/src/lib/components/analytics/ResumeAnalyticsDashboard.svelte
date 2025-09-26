<!--
  Resume Analytics Dashboard Component
  Displays comprehensive analytics for resume performance
-->

<script lang="ts">
  import { onMount } from 'svelte';
  import type { Resume } from '$lib/types/resume';
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Badge } from '$lib/components/ui/badge';
  import { Button } from '$lib/components/ui/button';
  import { Progress } from '$lib/components/ui/progress';
  import { 
    Eye, 
    Download, 
    Share2, 
    TrendingUp, 
    TrendingDown,
    Target,
    Award,
    Calendar,
    MapPin,
    Briefcase,
    Star,
    AlertCircle,
    CheckCircle,
    Lightbulb
  } from 'lucide-svelte';
  import { resumeStore } from '$lib/stores/resume';

  export let resumes: Resume[] = [];
  
  let selectedResume: Resume | null = null;
  let timeRange: '7d' | '30d' | '90d' | 'all' = '30d';
  
  // Calculate overall analytics
  $: overallAnalytics = calculateOverallAnalytics(resumes);
  $: topPerformingResumes = getTopPerformingResumes(resumes);
  $: industryBreakdown = getIndustryBreakdown(resumes);
  $: successMetrics = getSuccessMetrics(resumes);
  
  function calculateOverallAnalytics(resumes: Resume[]) {
    const total = resumes.length;
    const totalViews = resumes.reduce((sum, r) => sum + (r.view_count || 0), 0);
    const totalDownloads = resumes.reduce((sum, r) => sum + (r.download_count || 0), 0);
    const totalShares = resumes.reduce((sum, r) => sum + (r.share_count || 0), 0);
    
    const avgCompletion = total > 0 
      ? Math.round(resumes.reduce((sum, r) => sum + (r.completion_percentage || 0), 0) / total)
      : 0;
    
    const avgOptimization = total > 0
      ? Math.round(resumes.reduce((sum, r) => sum + (r.optimization_score || 0), 0) / total)
      : 0;
    
    const statusBreakdown = resumes.reduce((acc, r) => {
      const status = r.status || 'draft';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      total,
      totalViews,
      totalDownloads,
      totalShares,
      avgCompletion,
      avgOptimization,
      statusBreakdown,
      engagementRate: totalViews > 0 ? Math.round((totalDownloads / totalViews) * 100) : 0
    };
  }
  
  function getTopPerformingResumes(resumes: Resume[]) {
    return resumes
      .filter(r => (r.view_count || 0) > 0)
      .sort((a, b) => {
        const aScore = (a.view_count || 0) + (a.download_count || 0) * 2 + (a.share_count || 0) * 3;
        const bScore = (b.view_count || 0) + (b.download_count || 0) * 2 + (b.share_count || 0) * 3;
        return bScore - aScore;
      })
      .slice(0, 5);
  }
  
  function getIndustryBreakdown(resumes: Resume[]) {
    const breakdown = resumes.reduce((acc, r) => {
      const industry = r.industry_focus || 'Other';
      if (!acc[industry]) {
        acc[industry] = { count: 0, views: 0, downloads: 0 };
      }
      acc[industry].count++;
      acc[industry].views += r.view_count || 0;
      acc[industry].downloads += r.download_count || 0;
      return acc;
    }, {} as Record<string, { count: number; views: number; downloads: number }>);
    
    return Object.entries(breakdown)
      .map(([industry, data]) => ({
        industry,
        ...data,
        avgViews: data.count > 0 ? Math.round(data.views / data.count) : 0
      }))
      .sort((a, b) => b.views - a.views);
  }
  
  function getSuccessMetrics(resumes: Resume[]) {
    const totalApplications = resumes.reduce((sum, r) => sum + (r.success_metrics?.applications_sent || 0), 0);
    const totalResponses = resumes.reduce((sum, r) => sum + (r.success_metrics?.responses_received || 0), 0);
    const totalInterviews = resumes.reduce((sum, r) => sum + (r.success_metrics?.interviews_scheduled || 0), 0);
    const totalOffers = resumes.reduce((sum, r) => sum + (r.success_metrics?.offers_received || 0), 0);
    
    return {
      totalApplications,
      totalResponses,
      totalInterviews,
      totalOffers,
      responseRate: totalApplications > 0 ? Math.round((totalResponses / totalApplications) * 100) : 0,
      interviewRate: totalApplications > 0 ? Math.round((totalInterviews / totalApplications) * 100) : 0,
      offerRate: totalApplications > 0 ? Math.round((totalOffers / totalApplications) * 100) : 0
    };
  }
  
  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  }
  
  function getScoreColor(score: number): string {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  }
  
  function getScoreBgColor(score: number): string {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  }
</script>

<div class="space-y-6">
  <!-- Overview Cards -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <Card>
      <CardContent class="p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Total Resumes</p>
            <p class="text-2xl font-bold">{overallAnalytics.total}</p>
          </div>
          <div class="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Briefcase class="h-6 w-6 text-blue-600" />
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm">
          <div class="flex space-x-2">
            <Badge variant="outline" class="text-xs">
              {overallAnalytics.statusBreakdown.active || 0} Active
            </Badge>
            <Badge variant="secondary" class="text-xs">
              {overallAnalytics.statusBreakdown.draft || 0} Draft
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
    
    <Card>
      <CardContent class="p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Total Views</p>
            <p class="text-2xl font-bold">{overallAnalytics.totalViews}</p>
          </div>
          <div class="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
            <Eye class="h-6 w-6 text-green-600" />
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm">
          <span class="text-gray-600">
            Avg: {overallAnalytics.total > 0 ? Math.round(overallAnalytics.totalViews / overallAnalytics.total) : 0} per resume
          </span>
        </div>
      </CardContent>
    </Card>
    
    <Card>
      <CardContent class="p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Downloads</p>
            <p class="text-2xl font-bold">{overallAnalytics.totalDownloads}</p>
          </div>
          <div class="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
            <Download class="h-6 w-6 text-purple-600" />
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm">
          <span class="text-gray-600">
            {overallAnalytics.engagementRate}% engagement rate
          </span>
        </div>
      </CardContent>
    </Card>
    
    <Card>
      <CardContent class="p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Avg Quality</p>
            <p class="text-2xl font-bold {getScoreColor(overallAnalytics.avgOptimization)}">{overallAnalytics.avgOptimization}%</p>
          </div>
          <div class="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
            <Award class="h-6 w-6 text-orange-600" />
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm">
          <span class="text-gray-600">
            {overallAnalytics.avgCompletion}% completion
          </span>
        </div>
      </CardContent>
    </Card>
  </div>
  
  <!-- Success Metrics -->
  {#if successMetrics.totalApplications > 0}
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <Target class="h-5 w-5" />
          Job Application Success
        </CardTitle>
        <CardDescription>Track your resume's real-world performance</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-600">{successMetrics.totalApplications}</div>
            <div class="text-sm text-gray-600">Applications Sent</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600">{successMetrics.responseRate}%</div>
            <div class="text-sm text-gray-600">Response Rate</div>
            <div class="text-xs text-gray-500">{successMetrics.totalResponses} responses</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-purple-600">{successMetrics.interviewRate}%</div>
            <div class="text-sm text-gray-600">Interview Rate</div>
            <div class="text-xs text-gray-500">{successMetrics.totalInterviews} interviews</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-orange-600">{successMetrics.offerRate}%</div>
            <div class="text-sm text-gray-600">Offer Rate</div>
            <div class="text-xs text-gray-500">{successMetrics.totalOffers} offers</div>
          </div>
        </div>
      </CardContent>
    </Card>
  {/if}
  
  <!-- Top Performing Resumes -->
  {#if topPerformingResumes.length > 0}
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <Star class="h-5 w-5" />
          Top Performing Resumes
        </CardTitle>
        <CardDescription>Your most viewed and downloaded resumes</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          {#each topPerformingResumes as resume, index}
            <div class="flex items-center justify-between p-4 border rounded-lg">
              <div class="flex items-center gap-3">
                <div class="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full text-blue-600 font-bold text-sm">
                  {index + 1}
                </div>
                <div>
                  <h4 class="font-medium">{resume.title}</h4>
                  {#if resume.target_job}
                    <p class="text-sm text-gray-600">{resume.target_job}</p>
                  {/if}
                  {#if resume.industry_focus}
                    <Badge variant="outline" class="text-xs mt-1">{resume.industry_focus}</Badge>
                  {/if}
                </div>
              </div>
              
              <div class="flex items-center gap-6 text-sm">
                <div class="text-center">
                  <div class="font-medium">{resume.view_count || 0}</div>
                  <div class="text-gray-500">Views</div>
                </div>
                <div class="text-center">
                  <div class="font-medium">{resume.download_count || 0}</div>
                  <div class="text-gray-500">Downloads</div>
                </div>
                <div class="text-center">
                  <div class="font-medium">{resume.share_count || 0}</div>
                  <div class="text-gray-500">Shares</div>
                </div>
                {#if resume.optimization_score}
                  <div class="text-center">
                    <div class="font-medium {getScoreColor(resume.optimization_score)}">{resume.optimization_score}%</div>
                    <div class="text-gray-500">Quality</div>
                  </div>
                {/if}
              </div>
            </div>
          {/each}
        </div>
      </CardContent>
    </Card>
  {/if}
  
  <!-- Resume Quality Overview -->
  <Card>
    <CardHeader>
      <CardTitle class="flex items-center gap-2">
        <Lightbulb class="h-5 w-5" />
        Resume Quality Overview
      </CardTitle>
      <CardDescription>Completion and optimization status of your resumes</CardDescription>
    </CardHeader>
    <CardContent>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Completion Status -->
        <div>
          <h4 class="font-medium mb-3">Completion Status</h4>
          <div class="space-y-3">
            {#each resumes.slice(0, 5) as resume}
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <div class="font-medium text-sm truncate">{resume.title}</div>
                  <div class="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      class="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style="width: {resume.completion_percentage || 0}%"
                    ></div>
                  </div>
                </div>
                <div class="ml-3 text-sm font-medium">
                  {resume.completion_percentage || 0}%
                </div>
              </div>
            {/each}
          </div>
        </div>
        
        <!-- Optimization Scores -->
        <div>
          <h4 class="font-medium mb-3">Optimization Scores</h4>
          <div class="space-y-3">
            {#each resumes.slice(0, 5) as resume}
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <div class="font-medium text-sm truncate">{resume.title}</div>
                  <div class="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      class="{getScoreBgColor(resume.optimization_score || 0)} h-2 rounded-full transition-all duration-300"
                      style="width: {resume.optimization_score || 0}%"
                    ></div>
                  </div>
                </div>
                <div class="ml-3 text-sm font-medium {getScoreColor(resume.optimization_score || 0)}">
                  {resume.optimization_score || 0}%
                </div>
              </div>
            {/each}
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
  
  <!-- Insights and Recommendations -->
  <Card>
    <CardHeader>
      <CardTitle class="flex items-center gap-2">
        <AlertCircle class="h-5 w-5" />
        Insights & Recommendations
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div class="space-y-4">
        {#if overallAnalytics.avgCompletion < 80}
          <div class="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertCircle class="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <h4 class="font-medium text-amber-900">Improve Resume Completion</h4>
              <p class="text-sm text-amber-800">Your average completion rate is {overallAnalytics.avgCompletion}%. Complete more sections to improve your resume's effectiveness.</p>
            </div>
          </div>
        {/if}
        
        {#if overallAnalytics.avgOptimization < 70}
          <div class="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle class="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <h4 class="font-medium text-red-900">Optimize Your Resumes</h4>
              <p class="text-sm text-red-800">Your average optimization score is {overallAnalytics.avgOptimization}%. Consider using AI suggestions to improve your content.</p>
            </div>
          </div>
        {/if}
        
        {#if overallAnalytics.engagementRate < 10 && overallAnalytics.totalViews > 0}
          <div class="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <Lightbulb class="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 class="font-medium text-blue-900">Improve Engagement</h4>
              <p class="text-sm text-blue-800">Your download rate is {overallAnalytics.engagementRate}%. Consider updating your resume content or targeting to increase downloads.</p>
            </div>
          </div>
        {/if}
        
        {#if overallAnalytics.statusBreakdown.draft > overallAnalytics.statusBreakdown.active}
          <div class="flex items-start gap-3 p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <CheckCircle class="h-5 w-5 text-purple-600 mt-0.5" />
            <div>
              <h4 class="font-medium text-purple-900">Activate Your Resumes</h4>
              <p class="text-sm text-purple-800">You have {overallAnalytics.statusBreakdown.draft} draft resumes. Consider completing and activating them to start tracking their performance.</p>
            </div>
          </div>
        {/if}
      </div>
    </CardContent>
  </Card>
</div>