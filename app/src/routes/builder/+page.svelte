<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { currentUser, isAuthenticated, isLoading, auth } from '$lib/stores/auth.js';
	import { currentStep, goToStep, nextStep, previousStep, completionProgress, saveResume, publishResume, hasUnsavedChanges, isStepComplete } from '$lib/stores/resumeBuilder.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { FileText, User, FileCheck, Briefcase, Award, Code, Settings, Eye, ArrowLeft, LogOut, ChevronDown } from 'lucide-svelte';
	import Logo from '$lib/components/ui/Logo.svelte';
	
	// Tab Components
	import PersonalInfoTab from '$lib/components/builder/PersonalInfoTab.svelte';
	import SummaryTab from '$lib/components/builder/SummaryTab.svelte';
	import ExperienceTab from '$lib/components/builder/ExperienceTab.svelte';
	import EducationTab from '$lib/components/builder/EducationTab.svelte';
	import SkillsTab from '$lib/components/builder/SkillsTab.svelte';
	import SettingsTab from '$lib/components/builder/SettingsTab.svelte';

	$: activeTab = $currentStep;
	$: console.log('activeTab updated to:', activeTab);
	$: progress = $completionProgress;
	$: unsavedChanges = $hasUnsavedChanges;
	$: user = $currentUser;
	$: authenticated = $isAuthenticated;
	$: loading = $isLoading;

	// Reactive statement to handle auth redirect - only redirect if auth is loaded and user is not authenticated
	$: {
		console.log('🔐 Builder Auth Debug - Loading:', $isLoading, 'User:', $currentUser, 'Authenticated:', $isAuthenticated);
		// Only redirect if we're sure the user is not authenticated (loading is complete)
		if (!$isLoading && !$isAuthenticated) {
			console.log('🔐 Builder: Redirecting to login - not authenticated');
			goto('/auth/login');
		}
	}

	const tabs = [
		{ id: 'personal', label: 'Personal Info', icon: User, description: 'Basic contact details' },
		{ id: 'summary', label: 'Summary', icon: FileCheck, description: 'Professional summary' },
		{ id: 'experience', label: 'Experience', icon: Briefcase, description: 'Work history' },
		{ id: 'education', label: 'Education', icon: Award, description: 'Academic background' },
		{ id: 'skills', label: 'Skills', icon: Code, description: 'Technical & soft skills' },
		{ id: 'settings', label: 'Settings', icon: Settings, description: 'Layout & formatting' },
		{ id: 'preview', label: 'Preview', icon: Eye, description: 'Review & publish' }
	];

	function handleTabChange(tabId: string) {
		console.log('handleTabChange called with:', tabId);
		console.log('Calling goToStep with:', tabId);
		goToStep(tabId);
		console.log('handleTabChange finished');
	}

	async function handleSave() {
		try {
			await saveResume();
		} catch (error) {
			console.error('Failed to save:', error);
		}
	}

	async function handlePublish() {
		try {
			const result = await publishResume();
			console.log('Published:', result);
		} catch (error) {
			console.error('Failed to publish:', error);
		}
	}

	function handleBackToDashboard() {
		console.log('🔄 Navigating to dashboard');
		goto('/dashboard');
	}

	async function handleLogout() {
		console.log('🔓 Attempting logout');
		try {
			const result = await auth.logout();
			console.log('🔓 Logout result:', result);
			goto('/');
		} catch (error) {
			console.error('Failed to logout:', error);
		}
	}
</script>

<svelte:head>
	<title>Resume Builder - Create Your Professional Resume</title>
</svelte:head>

{#if loading}
	<div class="min-h-screen flex items-center justify-center">
		<div class="text-center">
			<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
			<p class="text-muted-foreground">Loading...</p>
		</div>
	</div>
{:else if authenticated}
	<div class="min-h-screen bg-gray-50">
		<!-- Header -->
		<header class="bg-white border-b">
			<div class="container mx-auto px-4 py-4">
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-3">
						<button 
							class="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
							on:click={handleBackToDashboard}
						>
							<ArrowLeft class="w-4 h-4" />
							Dashboard
						</button>
						<Logo size="sm" showText={false} />
						<div>
							<h1 class="text-xl font-semibold">Resume Builder</h1>
							<p class="text-sm text-muted-foreground">Create your professional resume step by step</p>
						</div>
					</div>
					<div class="flex items-center gap-2">
						<Button 
							variant="outline" 
							size="sm"
							on:click={handleSave}
							disabled={!unsavedChanges}
						>
							{unsavedChanges ? 'Save Draft' : 'Saved'}
						</Button>
						<Button size="sm" on:click={handlePublish}>
							Publish Resume
						</Button>
						{#if $currentUser}
							<div class="flex items-center gap-2 text-sm text-muted-foreground ml-4">
								<User class="w-4 h-4" />
								<span>{$currentUser.email}</span>
							</div>
							<button 
								class="flex items-center justify-center p-2 text-gray-600 hover:bg-gray-100 rounded-md"
								on:click={handleLogout}
							>
								<LogOut class="w-4 h-4" />
							</button>
						{/if}
					</div>
				</div>
			</div>
		</header>

		<!-- Main Content -->
		<div class="container mx-auto px-4 py-6">
			<div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
				<!-- Sidebar Navigation -->
				<div class="lg:col-span-1">
					<div class="bg-white rounded-lg border p-4 sticky top-6">
						<h3 class="font-semibold mb-4">Resume Sections</h3>
						<nav class="space-y-2">
							{#each tabs as tab}
								<button
									class="w-full flex items-center gap-3 px-3 py-2 text-left rounded-md transition-colors
										{activeTab === tab.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}"
									on:click={() => handleTabChange(tab.id)}
								>
									<svelte:component this={tab.icon} class="w-4 h-4" />
									<div class="flex-1">
										<div class="font-medium text-sm">{tab.label}</div>
										<div class="text-xs opacity-75">{tab.description}</div>
									</div>
								</button>
							{/each}
						</nav>

						<!-- Progress Indicator -->
						<div class="mt-6 pt-4 border-t">
							<div class="flex justify-between text-sm text-muted-foreground mb-2">
								<span>Progress</span>
								<span>{progress}% Complete</span>
							</div>
							<div class="w-full bg-secondary rounded-full h-2">
								<div class="bg-primary h-2 rounded-full transition-all duration-300" style="width: {progress}%"></div>
							</div>
						</div>
					</div>
				</div>

				<!-- Content Area -->
				<div class="lg:col-span-3">
					<div class="bg-white rounded-lg border p-6">
						{#if activeTab === 'personal'}
							<div class="mb-6">
								<h2 class="text-2xl font-bold mb-2">Personal Information</h2>
								<p class="text-muted-foreground">Add your basic contact details and professional links</p>
							</div>
							<PersonalInfoTab onNext={() => handleTabChange('summary')} />
						{:else if activeTab === 'summary'}
							<div class="mb-6">
								<h2 class="text-2xl font-bold mb-2">Professional Summary</h2>
								<p class="text-muted-foreground">Write a compelling summary that highlights your strengths and career goals</p>
							</div>
							<SummaryTab 
								onNext={() => handleTabChange('experience')} 
								onPrevious={() => handleTabChange('personal')} 
							/>
						{:else if activeTab === 'experience'}
							<div class="mb-6">
								<h2 class="text-2xl font-bold mb-2">Work Experience</h2>
								<p class="text-muted-foreground">Add your work history, internships, and relevant experience</p>
							</div>
							<ExperienceTab 
								onNext={() => handleTabChange('education')} 
								onPrevious={() => handleTabChange('summary')} 
							/>
						{:else if activeTab === 'education'}
							<div class="mb-6">
								<h2 class="text-2xl font-bold mb-2">Education</h2>
								<p class="text-muted-foreground">Add your educational background and qualifications</p>
							</div>
							<EducationTab 
								onNext={() => handleTabChange('skills')} 
								onPrevious={() => handleTabChange('experience')} 
							/>
						{:else if activeTab === 'skills'}
							<div class="mb-6">
								<h2 class="text-2xl font-bold mb-2">Skills</h2>
								<p class="text-muted-foreground">Add your technical skills, soft skills, and languages</p>
							</div>
							<SkillsTab 
								onNext={() => handleTabChange('settings')} 
								onPrevious={() => handleTabChange('education')} 
							/>
						{:else if activeTab === 'settings'}
							<div class="mb-6">
								<h2 class="text-2xl font-bold mb-2">Resume Settings</h2>
								<p class="text-muted-foreground">Customize your resume layout and formatting</p>
							</div>
							
							<div class="space-y-8">
								<!-- Layout Toggle -->
								<div class="space-y-4">
									<h3 class="text-lg font-semibold">Resume Length</h3>
									<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
										<button class="p-4 border-2 border-primary bg-primary/5 rounded-lg text-left">
											<div class="font-medium mb-2">1 Page</div>
											<p class="text-sm text-muted-foreground">
												Perfect for entry-level positions. Concise and focused.
											</p>
										</button>
										
										<button class="p-4 border rounded-lg text-left hover:border-primary">
											<div class="font-medium mb-2">2 Pages Max</div>
											<p class="text-sm text-muted-foreground">
												More space for experience and projects.
											</p>
										</button>
									</div>
								</div>

								<!-- Template Selection -->
								<div class="space-y-4">
									<h3 class="text-lg font-semibold">Template Style</h3>
									<div class="grid grid-cols-3 gap-4">
										<button class="p-4 border-2 border-primary bg-primary/5 rounded-lg text-center">
											<div class="font-medium">Modern</div>
										</button>
										<button class="p-4 border rounded-lg text-center hover:border-primary">
											<div class="font-medium">Classic</div>
										</button>
										<button class="p-4 border rounded-lg text-center hover:border-primary">
											<div class="font-medium">Minimal</div>
										</button>
									</div>
								</div>

								<!-- Color Scheme -->
								<div class="space-y-4">
									<h3 class="text-lg font-semibold">Color Scheme</h3>
									<div class="grid grid-cols-4 gap-4">
										<button class="p-3 border-2 border-primary bg-primary/5 rounded-lg text-center">
											<div class="w-6 h-6 bg-blue-500 rounded mx-auto mb-1"></div>
											<div class="text-sm">Blue</div>
										</button>
										<button class="p-3 border rounded-lg text-center hover:border-primary">
											<div class="w-6 h-6 bg-green-500 rounded mx-auto mb-1"></div>
											<div class="text-sm">Green</div>
										</button>
										<button class="p-3 border rounded-lg text-center hover:border-primary">
											<div class="w-6 h-6 bg-purple-500 rounded mx-auto mb-1"></div>
											<div class="text-sm">Purple</div>
										</button>
										<button class="p-3 border rounded-lg text-center hover:border-primary">
											<div class="w-6 h-6 bg-gray-800 rounded mx-auto mb-1"></div>
											<div class="text-sm">Black</div>
										</button>
									</div>
								</div>
							</div>

							<div class="mt-8 flex justify-between">
								<Button variant="outline" on:click={() => handleTabChange('skills')}>
									Previous
								</Button>
								<Button on:click={() => handleTabChange('preview')}>
									Next: Preview
								</Button>
							</div>

						{:else if activeTab === 'preview'}
							<div class="mb-6">
								<h2 class="text-2xl font-bold mb-2">Preview & Publish</h2>
								<p class="text-muted-foreground">Review your resume and publish it to share with employers</p>
							</div>

							<div class="space-y-6">
								<!-- Completion Status -->
								<div class="bg-muted p-4 rounded-lg">
									<h3 class="font-semibold mb-3">Resume Completion Status</h3>
									<div class="space-y-2">
										<div class="flex justify-between">
											<span>Personal Information</span>
											<span class={isStepComplete('personal') ? 'text-green-600' : 'text-yellow-600'}>
												{isStepComplete('personal') ? '✅ Complete' : '⏳ In Progress'}
											</span>
										</div>
										<div class="flex justify-between">
											<span>Professional Summary</span>
											<span class={isStepComplete('summary') ? 'text-green-600' : 'text-yellow-600'}>
												{isStepComplete('summary') ? '✅ Complete' : '⏳ In Progress'}
											</span>
										</div>
										<div class="flex justify-between">
											<span>Work Experience</span>
											<span class={isStepComplete('experience') ? 'text-green-600' : 'text-yellow-600'}>
												{isStepComplete('experience') ? '✅ Complete' : '⏳ In Progress'}
											</span>
										</div>
										<div class="flex justify-between">
											<span>Education</span>
											<span class={isStepComplete('education') ? 'text-green-600' : 'text-yellow-600'}>
												{isStepComplete('education') ? '✅ Complete' : '⏳ In Progress'}
											</span>
										</div>
										<div class="flex justify-between">
											<span>Skills</span>
											<span class={isStepComplete('skills') ? 'text-green-600' : 'text-yellow-600'}>
												{isStepComplete('skills') ? '✅ Complete' : '⏳ In Progress'}
											</span>
										</div>
									</div>
								</div>

								<!-- Preview Actions -->
								<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
									<Button variant="outline" class="h-auto p-4 flex flex-col items-center gap-2">
										<Eye class="w-6 h-6" />
										<span>Preview Resume</span>
									</Button>

									<Button variant="outline" class="h-auto p-4 flex flex-col items-center gap-2">
										<FileText class="w-6 h-6" />
										<span>Download PDF</span>
									</Button>

									<Button class="h-auto p-4 flex flex-col items-center gap-2" on:click={handlePublish}>
										<FileCheck class="w-6 h-6" />
										<span>Publish Resume</span>
									</Button>
								</div>

								<div class="bg-green-50 border border-green-200 p-4 rounded-lg">
									<h4 class="font-medium text-green-800 mb-2">🎉 Almost Ready!</h4>
									<p class="text-sm text-green-700">
										Complete the remaining sections and your resume will be ready to publish and share with employers.
									</p>
								</div>
							</div>

							<div class="mt-8 flex justify-between">
								<Button variant="outline" on:click={() => handleTabChange('settings')}>
									Previous
								</Button>
								<Button on:click={handlePublish}>
									Publish Resume
								</Button>
							</div>
						{/if}
					</div>


				</div>
			</div>
		</div>
	</div>
{:else}
	<div class="min-h-screen flex items-center justify-center">
		<div class="text-center">
			<h1 class="text-2xl font-bold mb-4">Authentication Required</h1>
			<p class="text-muted-foreground mb-6">Please log in to access the resume builder.</p>
			<a href="/auth/login" class="text-primary hover:underline">Go to Login</a>
		</div>
	</div>
{/if}