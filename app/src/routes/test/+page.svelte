<script lang="ts">
  import { onMount } from 'svelte';
  import { Button } from '$lib/components/ui/button';
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Badge } from '$lib/components/ui/badge';
  import { Separator } from '$lib/components/ui/separator';
  import { 
    Play, 
    CheckCircle, 
    XCircle, 
    AlertCircle,
    Clock,
    TestTube,
    Zap,
    Shield,
    Smartphone,
    Database
  } from 'lucide-svelte';
  import { runAllTests, testScenarios } from '$lib/test-utils';
  
  let testResults: Array<{
    name: string;
    status: 'pending' | 'running' | 'passed' | 'failed' | 'warning';
    duration?: number;
    message?: string;
    icon: any;
  }> = [
    { name: 'Authentication Flow', status: 'pending', icon: Shield },
    { name: 'Resume CRUD Operations', status: 'pending', icon: Database },
    { name: 'Form Validation', status: 'pending', icon: CheckCircle },
    { name: 'Responsive Design', status: 'pending', icon: Smartphone },
    { name: 'Data Persistence', status: 'pending', icon: Database },
    { name: 'Performance', status: 'pending', icon: Zap },
    { name: 'Accessibility', status: 'pending', icon: Shield }
  ];
  
  let isRunningTests = false;
  let overallStatus: 'idle' | 'running' | 'completed' = 'idle';
  let testOutput: string[] = [];
  
  async function runIndividualTest(testName: string, testFunction: () => Promise<void> | void) {
    const testIndex = testResults.findIndex(t => t.name === testName);
    if (testIndex === -1) return;
    
    // Update status to running
    testResults[testIndex] = { ...testResults[testIndex], status: 'running' };
    testResults = [...testResults];
    
    const startTime = performance.now();
    
    try {
      // Capture console output
      const originalLog = console.log;
      const originalError = console.error;
      const originalWarn = console.warn;
      
      let output: string[] = [];
      
      console.log = (...args) => {
        output.push(args.join(' '));
        originalLog(...args);
      };
      
      console.error = (...args) => {
        output.push(`ERROR: ${args.join(' ')}`);
        originalError(...args);
      };
      
      console.warn = (...args) => {
        output.push(`WARNING: ${args.join(' ')}`);
        originalWarn(...args);
      };
      
      await testFunction();
      
      // Restore console
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
      
      const duration = performance.now() - startTime;
      
      // Determine status based on output
      const hasErrors = output.some(line => line.includes('❌') || line.includes('ERROR:'));
      const hasWarnings = output.some(line => line.includes('⚠️') || line.includes('WARNING:'));
      
      let status: 'passed' | 'failed' | 'warning' = 'passed';
      if (hasErrors) status = 'failed';
      else if (hasWarnings) status = 'warning';
      
      testResults[testIndex] = {
        ...testResults[testIndex],
        status,
        duration,
        message: output.join('\n')
      };
      
      testOutput = [...testOutput, ...output];
      
    } catch (error) {
      const duration = performance.now() - startTime;
      testResults[testIndex] = {
        ...testResults[testIndex],
        status: 'failed',
        duration,
        message: `Test failed: ${error}`
      };
      
      testOutput = [...testOutput, `ERROR: ${testName} failed - ${error}`];
    }
    
    testResults = [...testResults];
  }
  
  async function runAllTestsSequentially() {
    if (isRunningTests) return;
    
    isRunningTests = true;
    overallStatus = 'running';
    testOutput = [];
    
    // Reset all test statuses
    testResults = testResults.map(test => ({ ...test, status: 'pending', duration: undefined, message: undefined }));
    
    try {
      await runIndividualTest('Authentication Flow', testScenarios.testAuthenticationFlow);
      await new Promise(resolve => setTimeout(resolve, 500)); // Small delay between tests
      
      await runIndividualTest('Resume CRUD Operations', testScenarios.testResumeCRUD);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      await runIndividualTest('Form Validation', () => testScenarios.testFormValidation());
      await new Promise(resolve => setTimeout(resolve, 500));
      
      await runIndividualTest('Responsive Design', () => testScenarios.testResponsiveDesign());
      await new Promise(resolve => setTimeout(resolve, 500));
      
      await runIndividualTest('Data Persistence', () => testScenarios.testDataPersistence());
      await new Promise(resolve => setTimeout(resolve, 500));
      
      await runIndividualTest('Performance', () => testScenarios.testPerformance());
      await new Promise(resolve => setTimeout(resolve, 500));
      
      await runIndividualTest('Accessibility', () => testScenarios.testAccessibility());
      
    } catch (error) {
      console.error('Test suite failed:', error);
    } finally {
      isRunningTests = false;
      overallStatus = 'completed';
    }
  }
  
  function getStatusIcon(status: string) {
    switch (status) {
      case 'running':
        return Clock;
      case 'passed':
        return CheckCircle;
      case 'failed':
        return XCircle;
      case 'warning':
        return AlertCircle;
      default:
        return Clock;
    }
  }
  
  function getStatusColor(status: string) {
    switch (status) {
      case 'running':
        return 'text-blue-500';
      case 'passed':
        return 'text-green-500';
      case 'failed':
        return 'text-red-500';
      case 'warning':
        return 'text-yellow-500';
      default:
        return 'text-gray-400';
    }
  }
  
  function getOverallStatus() {
    if (overallStatus === 'running') return { status: 'Running...', color: 'text-blue-600' };
    if (overallStatus === 'idle') return { status: 'Ready to run', color: 'text-gray-600' };
    
    const failed = testResults.filter(t => t.status === 'failed').length;
    const warnings = testResults.filter(t => t.status === 'warning').length;
    const passed = testResults.filter(t => t.status === 'passed').length;
    
    if (failed > 0) {
      return { status: `${failed} failed, ${warnings} warnings, ${passed} passed`, color: 'text-red-600' };
    } else if (warnings > 0) {
      return { status: `${warnings} warnings, ${passed} passed`, color: 'text-yellow-600' };
    } else {
      return { status: `All ${passed} tests passed`, color: 'text-green-600' };
    }
  }
  
  onMount(() => {
    // Auto-run tests in development
    if (import.meta.env.DEV) {
      setTimeout(() => {
        runAllTestsSequentially();
      }, 1000);
    }
  });
</script>

<svelte:head>
  <title>Test Suite - Digital Resume Hub</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 p-4 md:p-8">
  <div class="max-w-4xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center space-x-3 mb-4">
        <TestTube class="h-8 w-8 text-blue-600" />
        <h1 class="text-3xl font-bold text-gray-900">Test Suite</h1>
      </div>
      <p class="text-gray-600">
        Comprehensive testing for the Digital Resume Hub application
      </p>
    </div>
    
    <!-- Overall Status -->
    <Card class="mb-6">
      <CardHeader>
        <div class="flex items-center justify-between">
          <div>
            <CardTitle>Test Status</CardTitle>
            <CardDescription class={getOverallStatus().color}>
              {getOverallStatus().status}
            </CardDescription>
          </div>
          <Button 
            on:click={runAllTestsSequentially}
            disabled={isRunningTests}
            class="min-w-[120px]"
          >
            {#if isRunningTests}
              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Running...
            {:else}
              <Play class="h-4 w-4 mr-2" />
              Run Tests
            {/if}
          </Button>
        </div>
      </CardHeader>
    </Card>
    
    <!-- Test Results -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {#each testResults as test}
        <Card>
          <CardContent class="p-4">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center space-x-2">
                <svelte:component this={test.icon} class="h-5 w-5 text-gray-600" />
                <h3 class="font-medium text-gray-900">{test.name}</h3>
              </div>
              <div class="flex items-center space-x-2">
                {#if test.duration}
                  <span class="text-xs text-gray-500">{test.duration.toFixed(0)}ms</span>
                {/if}
                <svelte:component 
                  this={getStatusIcon(test.status)} 
                  class="h-5 w-5 {getStatusColor(test.status)}" 
                />
              </div>
            </div>
            
            <div class="flex items-center space-x-2">
              <Badge 
                variant={test.status === 'passed' ? 'default' : test.status === 'failed' ? 'destructive' : 'secondary'}
                class="text-xs"
              >
                {test.status}
              </Badge>
              
              {#if test.status === 'running'}
                <div class="flex space-x-1">
                  <div class="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div class="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                  <div class="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                </div>
              {/if}
            </div>
          </CardContent>
        </Card>
      {/each}
    </div>
    
    <!-- Test Output -->
    {#if testOutput.length > 0}
      <Card>
        <CardHeader>
          <CardTitle>Test Output</CardTitle>
          <CardDescription>Detailed test results and logs</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
            {#each testOutput as line}
              <div class="mb-1">
                {#if line.includes('✅')}
                  <span class="text-green-400">{line}</span>
                {:else if line.includes('❌') || line.includes('ERROR:')}
                  <span class="text-red-400">{line}</span>
                {:else if line.includes('⚠️') || line.includes('WARNING:')}
                  <span class="text-yellow-400">{line}</span>
                {:else}
                  <span class="text-gray-300">{line}</span>
                {/if}
              </div>
            {/each}
          </div>
        </CardContent>
      </Card>
    {/if}
    
    <!-- Test Information -->
    <Card class="mt-6">
      <CardHeader>
        <CardTitle>About These Tests</CardTitle>
        <CardDescription>What each test validates</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div>
          <h4 class="font-medium text-gray-900 mb-2">Authentication Flow</h4>
          <p class="text-sm text-gray-600">Tests user login, logout, and registration functionality</p>
        </div>
        
        <Separator />
        
        <div>
          <h4 class="font-medium text-gray-900 mb-2">Resume CRUD Operations</h4>
          <p class="text-sm text-gray-600">Tests creating, reading, updating, and deleting resumes</p>
        </div>
        
        <Separator />
        
        <div>
          <h4 class="font-medium text-gray-900 mb-2">Form Validation</h4>
          <p class="text-sm text-gray-600">Tests email, password, and other form field validation</p>
        </div>
        
        <Separator />
        
        <div>
          <h4 class="font-medium text-gray-900 mb-2">Responsive Design</h4>
          <p class="text-sm text-gray-600">Tests layout adaptation across different screen sizes</p>
        </div>
        
        <Separator />
        
        <div>
          <h4 class="font-medium text-gray-900 mb-2">Data Persistence</h4>
          <p class="text-sm text-gray-600">Tests localStorage and data storage functionality</p>
        </div>
        
        <Separator />
        
        <div>
          <h4 class="font-medium text-gray-900 mb-2">Performance</h4>
          <p class="text-sm text-gray-600">Tests component rendering speed and optimization</p>
        </div>
        
        <Separator />
        
        <div>
          <h4 class="font-medium text-gray-900 mb-2">Accessibility</h4>
          <p class="text-sm text-gray-600">Tests WCAG compliance and screen reader compatibility</p>
        </div>
      </CardContent>
    </Card>
  </div>
</div>