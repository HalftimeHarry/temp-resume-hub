<script lang="ts">
	import { onMount } from 'svelte';
import { builderData } from '$lib/stores/resumeBuilder.js';
	import { goto } from '$app/navigation';
	import { currentUser, isAuthenticated, isLoading, auth } from '$lib/stores/auth.js';
	import { currentStep, goToStep, nextStep, previousStep, completionProgress, saveResume, publishResume, hasUnsavedChanges, isStepComplete, updateSettings, markStepComplete, markStepIncomplete, autoPopulateFromProfile, smartMergeProfileAndTemplate, importFromProfile, syncProfileFromBuilder, enableAutoSync, loadResumeForEditing, resetBuilderForNewResume } from '$lib/stores/resumeBuilder.js';
	import { userProfile } from '$lib/stores/userProfile.js';
	import { generateId } from '$lib/utils.js';
	import { templates as allTemplates, templateStore } from '$lib/stores/templates.js';
	import type { ExtendedResumeTemplate } from '$lib/templates';
	import { Button } from '$lib/components/ui/button/index.js';
	import { FileText, User, FileCheck, Briefcase, Award, Code, Settings, Eye, ArrowLeft, LogOut, ChevronDown, Download, UserPlus, Menu, X } from 'lucide-svelte';
	import Logo from '$lib/components/ui/Logo.svelte';
	import { toast } from 'svelte-sonner';
	
	let mobileMenuOpen = false;

	// Debug reactive statement
	$: {
		console.log('Builder mobile menu state changed:', mobileMenuOpen);
	}

	// Close mobile menu when clicking outside
	function handleClickOutside(event: MouseEvent) {
		if (mobileMenuOpen && 
			!(event.target as Element).closest('.mobile-menu-container') &&
			!(event.target as Element).closest('[data-mobile-menu-button]')) {
			mobileMenuOpen = false;
		}
	}
	
	// Selected template/color display (prioritize client-side templates)
	$: selectedTemplate = $allTemplates?.find?.(t => t.id === $builderData?.settings?.template);
	$: selectedColorScheme = $builderData?.settings?.colorScheme || selectedTemplate?.settings?.colorScheme || '—';
	const colorClassMap: Record<string, string> = {
		blue: 'bg-blue-500',
		green: 'bg-green-500',
		purple: 'bg-purple-500',
		orange: 'bg-orange-500',
		teal: 'bg-teal-500',
		black: 'bg-gray-800'
	};
	$: colorClass = colorClassMap[selectedColorScheme] || 'bg-gray-400';
	
	// Tab Components
	import PersonalInfoTab from '$lib/components/builder/PersonalInfoTab.svelte';
	import SummaryTab from '$lib/components/builder/SummaryTab.svelte';
	import ExperienceTab from '$lib/components/builder/ExperienceTab.svelte';
	import EducationTab from '$lib/components/builder/EducationTab.svelte';
	import SkillsTab from '$lib/components/builder/SkillsTab.svelte';
	import ProjectsTab from '$lib/components/builder/ProjectsTab.svelte';
	import SettingsTab from '$lib/components/builder/SettingsTab.svelte';
	
	// Preview Component
	import ResumePreview from '$lib/components/resume/ResumePreview.svelte';

	async function selectTemplate(t: ExtendedResumeTemplate) {
		try {
			const full = await templateStore.getTemplate(t.id);
			const profile = $userProfile;
			
			builderData.update(d => {
				// Get template starter data (client-side templates have comprehensive starter data)
				const templateData = full.starterData || getDefaultBootstrapContent(full);
				
				// Smart merge profile data with template data
				const mergedData = profile 
					? smartMergeProfileAndTemplate(templateData, profile)
					: templateData;
				
				// Apply merged data to builder - template data takes precedence for content
				return {
					...d,
					personalInfo: mergedData.personalInfo ? { ...d.personalInfo, ...mergedData.personalInfo } : d.personalInfo,
					summary: mergedData.summary || getDefaultSummary(full),
					experience: Array.isArray(mergedData.experience) && mergedData.experience.length > 0 
						? mergedData.experience 
						: getDefaultExperience(full),
					education: Array.isArray(mergedData.education) && mergedData.education.length > 0 
						? mergedData.education 
						: getDefaultEducation(full),
					skills: Array.isArray(mergedData.skills) && mergedData.skills.length > 0 
						? mergedData.skills 
						: getDefaultSkills(full),
					projects: Array.isArray(mergedData.projects) ? mergedData.projects : d.projects,
					settings: { ...d.settings, ...(mergedData.settings || {}), template: full.id }
				};
			});
			
			// Update step completion status - templates now provide bootstrap content
			// Personal info step - will be completed by profile import or user input
			// Don't auto-complete personal info since it needs user's actual data
			
			// Summary step - templates provide default summary
			markStepComplete('summary');
			
			// Experience step - templates provide example experience
			markStepComplete('experience');
			
			// Education step - templates provide example education
			markStepComplete('education');
			
			// Skills step - templates provide example skills
			markStepComplete('skills');
			
			currentStep.set('settings');
		} catch (e) {
			console.error('Failed to apply template:', e);
		}
	}

	// Prefill from template starter data if provided via localStorage & ensure templates list loaded
	onMount(async () => {
		// Add click outside handler for mobile menu (browser only)
		if (typeof document !== 'undefined') {
			document.addEventListener('click', handleClickOutside);
		}
		
		// Check if we're editing an existing resume
		const urlParams = new URLSearchParams(window.location.search);
		const editResumeId = urlParams.get('edit');
		
		if (editResumeId) {
			try {
				console.log('Loading resume for editing:', editResumeId);
				await loadResumeForEditing(editResumeId);
				console.log('Resume loaded successfully for editing');
			} catch (error) {
				console.error('Failed to load resume for editing:', error);
				toast.error('Failed to load resume for editing');
			}
		} else {
			// Reset builder for new resume
			console.log('No edit parameter, resetting builder for new resume');
			resetBuilderForNewResume();
		}
		try {
			if (!$allTemplates || $allTemplates.length === 0) {
				templateStore.loadTemplates();
			}
			const raw = localStorage.getItem('builderDraft');
			if (raw) {
				const draft = JSON.parse(raw);
				builderData.update(data => ({
					...data,
					personalInfo: draft.personalInfo || data.personalInfo,
					summary: draft.summary ?? data.summary,
					experience: Array.isArray(draft.experience) && draft.experience.some(exp => exp.company?.trim() || exp.position?.trim()) ? draft.experience : data.experience,
					education: Array.isArray(draft.education) && draft.education.some(edu => edu.institution?.trim() || edu.degree?.trim()) ? draft.education : data.education,
					skills: Array.isArray(draft.skills) && draft.skills.length ? draft.skills : data.skills,
					projects: Array.isArray(draft.projects) ? draft.projects : data.projects,
					settings: { ...data.settings, ...(draft.settings || {}) }
				}));
				
				// Update step completion status based on the loaded data
				if (draft.personalInfo?.fullName && draft.personalInfo?.email) {
					markStepComplete('personal');
				} else {
					markStepIncomplete('personal');
				}
				
				if (draft.summary) {
					markStepComplete('summary');
				} else {
					markStepIncomplete('summary');
				}
				
				if (Array.isArray(draft.experience) && draft.experience.some(exp => 
					exp.company?.trim() !== '' && 
					exp.position?.trim() !== '' && 
					exp.startDate?.trim() !== '')) {
					markStepComplete('experience');
				} else {
					markStepIncomplete('experience');
				}
				
				if (Array.isArray(draft.education) && draft.education.some(edu => 
					edu.institution?.trim() !== '' && 
					edu.degree?.trim() !== '' && 
					edu.startDate?.trim() !== '')) {
					markStepComplete('education');
				} else {
					markStepIncomplete('education');
				}
				
				if (Array.isArray(draft.skills) && draft.skills.length >= 3) {
					markStepComplete('skills');
				} else {
					markStepIncomplete('skills');
				}
				
				currentStep.set('settings');
				localStorage.removeItem('builderDraft');
			} else {
				// Try to auto-populate from profile first
				const profilePopulated = autoPopulateFromProfile();
				
				// Default to the first template if none selected yet (prioritize client-side templates)
				if ($allTemplates && $allTemplates.length > 0 && (!$builderData.settings?.template || $builderData.settings?.template === 'default-template-id')) {
					// Prefer client-side templates, especially first-job-starter for new users
					const preferredTemplate = $allTemplates.find(t => t.id === 'first-job-starter') || $allTemplates[0];
					await selectTemplate(preferredTemplate);
				} else if (!profilePopulated) {
					// If no template and no profile data, try auto-populate anyway
					autoPopulateFromProfile();
				}
			}
		} catch (e) {
			console.warn('Failed to initialize builder:', e);
		}
	});

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
	
	// Mark Settings step as complete when navigating to Preview
	$: if (activeTab === 'preview') {
		markStepComplete('settings');
	}

	// Smart section ordering based on experience level
	$: profile = $userProfile;
	$: isFirstTimeJobSeeker = profile && ['student', 'entry'].includes(profile.experience_level);
	
	$: tabs = isFirstTimeJobSeeker ? [
		{ id: 'settings', label: 'Get Started', icon: Settings, description: 'Choose industry & design' },
		{ id: 'personal', label: 'Personal Info', icon: User, description: 'Basic contact details' },
		{ id: 'summary', label: 'Summary', icon: FileCheck, description: 'Professional summary' },
		{ id: 'education', label: 'Education', icon: Award, description: 'Academic background' },
		{ id: 'projects', label: 'Projects', icon: FileText, description: 'Projects & activities' },
		{ id: 'skills', label: 'Skills', icon: Code, description: 'Technical & soft skills' },
		{ id: 'experience', label: 'Experience', icon: Briefcase, description: 'Work history (optional)' },
		{ id: 'preview', label: 'Preview', icon: Eye, description: 'Review & publish' }
	] : [
		{ id: 'settings', label: 'Get Started', icon: Settings, description: 'Choose industry & design' },
		{ id: 'personal', label: 'Personal Info', icon: User, description: 'Basic contact details' },
		{ id: 'summary', label: 'Summary', icon: FileCheck, description: 'Professional summary' },
		{ id: 'experience', label: 'Experience', icon: Briefcase, description: 'Work history' },
		{ id: 'education', label: 'Education', icon: Award, description: 'Academic background' },
		{ id: 'skills', label: 'Skills', icon: Code, description: 'Technical & soft skills' },
		{ id: 'projects', label: 'Projects', icon: FileText, description: 'Projects & activities' },
		{ id: 'preview', label: 'Preview', icon: Eye, description: 'Review & publish' }
	];

	function handleTabChange(tabId: string) {
		console.log('🔄 Tab change requested:', tabId);
		console.log('🔄 Current activeTab:', activeTab);
		
		// Ensure we can navigate to any step directly
		goToStep(tabId);
		
		// Add visual feedback
		toast.success(`Switched to ${tabs.find(t => t.id === tabId)?.label || tabId}`, {
			duration: 1500
		});
	}
	
	// Get next/previous tab based on current ordering
	function getNextTab(currentTab: string): string {
		const currentIndex = tabs.findIndex(tab => tab.id === currentTab);
		const nextIndex = currentIndex + 1;
		return nextIndex < tabs.length ? tabs[nextIndex].id : 'preview';
	}
	
	function getPreviousTab(currentTab: string): string {
		const currentIndex = tabs.findIndex(tab => tab.id === currentTab);
		const prevIndex = currentIndex - 1;
		return prevIndex >= 0 ? tabs[prevIndex].id : 'personal';
		
		console.log('✅ Tab change completed');
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
			toast.success('Resume published successfully!', {
				description: 'Your resume is now live and ready to share.'
			});
			// Redirect to dashboard after successful publish
			setTimeout(() => {
				goto('/dashboard');
			}, 1500);
		} catch (error) {
			console.error('Failed to publish:', error);
			toast.error('Failed to publish resume', {
				description: error instanceof Error ? error.message : 'Please try again.'
			});
		}
	}

	// Helper functions to generate default bootstrap content
	function getDefaultBootstrapContent(template: any) {
		return {
			personalInfo: {},
			summary: getDefaultSummary(template),
			experience: getDefaultExperience(template),
			education: getDefaultEducation(template),
			skills: getDefaultSkills(template),
			projects: [],
			settings: template.settings || {}
		};
	}

	function getDefaultSummary(template: any) {
		const templateName = template.name?.toLowerCase() || '';
		
		if (templateName.includes('retail') || templateName.includes('service')) {
			return 'Dedicated customer service professional with strong communication skills and a passion for helping others. Experienced in fast-paced retail environments with a focus on customer satisfaction and team collaboration.';
		} else if (templateName.includes('tech') || templateName.includes('software')) {
			return 'Motivated software developer with experience in modern web technologies. Passionate about creating user-friendly applications and solving complex problems through code. Eager to contribute to innovative projects and continue learning new technologies.';
		} else if (templateName.includes('hospitality')) {
			return 'Enthusiastic hospitality professional with excellent interpersonal skills and attention to detail. Experienced in providing exceptional customer service in fast-paced environments while maintaining high standards of quality.';
		} else if (templateName.includes('student') || templateName.includes('entry')) {
			return 'Recent graduate with strong academic background and eagerness to apply learned skills in a professional environment. Quick learner with excellent problem-solving abilities and strong work ethic.';
		}
		
		return 'Professional with strong work ethic and excellent communication skills. Experienced in collaborative environments with a focus on achieving results and continuous improvement. Eager to contribute to team success and professional growth.';
	}

	function getDefaultExperience(template: any) {
		const templateName = template.name?.toLowerCase() || '';
		
		if (templateName.includes('retail') || templateName.includes('service')) {
			return [
				{
					id: generateId(),
					company: 'ABC Retail Store',
					position: 'Sales Associate',
					location: 'City, State',
					startDate: '2023-06',
					endDate: '2024-01',
					current: false,
					description: 'Provided excellent customer service, processed transactions, and maintained store appearance. Consistently met sales targets and received positive customer feedback.',
					highlights: []
				}
			];
		} else if (templateName.includes('tech') || templateName.includes('software')) {
			return [
				{
					id: generateId(),
					company: 'Tech Solutions Inc.',
					position: 'Junior Developer',
					location: 'City, State',
					startDate: '2023-08',
					endDate: '',
					current: true,
					description: 'Developed and maintained web applications using modern frameworks. Collaborated with cross-functional teams to deliver high-quality software solutions.',
					highlights: []
				}
			];
		} else if (templateName.includes('hospitality')) {
			return [
				{
					id: generateId(),
					company: 'Grand Hotel',
					position: 'Front Desk Associate',
					location: 'City, State',
					startDate: '2023-05',
					endDate: '2024-02',
					current: false,
					description: 'Managed guest check-ins and check-outs, handled reservations, and provided exceptional customer service. Resolved guest concerns promptly and professionally.',
					highlights: []
				}
			];
		}
		
		return [
			{
				id: generateId(),
				company: 'Example Company',
				position: 'Team Member',
				location: 'City, State',
				startDate: '2023-06',
				endDate: '2024-01',
				current: false,
				description: 'Contributed to team objectives through effective collaboration and strong work ethic. Developed skills in problem-solving and communication.',
				highlights: []
			}
		];
	}

	function getDefaultEducation(template: any) {
		const templateName = template.name?.toLowerCase() || '';
		
		if (templateName.includes('tech') || templateName.includes('software')) {
			return [
				{
					id: generateId(),
					institution: 'State University',
					degree: 'Bachelor of Science',
					field: 'Computer Science',
					location: 'City, State',
					startDate: '2020-09',
					endDate: '2024-05',
					current: false,
					gpa: '3.5/4.0',
					honors: [],
					description: ''
				}
			];
		} else if (templateName.includes('business')) {
			return [
				{
					id: generateId(),
					institution: 'Business College',
					degree: 'Bachelor of Business Administration',
					field: 'Business Management',
					location: 'City, State',
					startDate: '2020-09',
					endDate: '2024-05',
					current: false,
					gpa: '3.4/4.0',
					honors: [],
					description: ''
				}
			];
		}
		
		return [
			{
				id: generateId(),
				institution: 'Local University',
				degree: 'Bachelor of Arts',
				field: 'General Studies',
				location: 'City, State',
				startDate: '2020-09',
				endDate: '2024-05',
				current: false,
				gpa: '3.3/4.0',
				honors: [],
				description: ''
			}
		];
	}

	function getDefaultSkills(template: any) {
		const templateName = template.name?.toLowerCase() || '';
		
		if (templateName.includes('retail') || templateName.includes('service')) {
			return [
				{ id: generateId(), name: 'Customer Service', level: 'advanced', category: 'soft' },
				{ id: generateId(), name: 'POS Systems', level: 'intermediate', category: 'technical' },
				{ id: generateId(), name: 'Communication', level: 'advanced', category: 'soft' },
				{ id: generateId(), name: 'Team Collaboration', level: 'intermediate', category: 'soft' },
				{ id: generateId(), name: 'Problem Solving', level: 'intermediate', category: 'soft' }
			];
		} else if (templateName.includes('tech') || templateName.includes('software')) {
			return [
				{ id: generateId(), name: 'JavaScript', level: 'intermediate', category: 'technical' },
				{ id: generateId(), name: 'HTML/CSS', level: 'advanced', category: 'technical' },
				{ id: generateId(), name: 'React', level: 'intermediate', category: 'technical' },
				{ id: generateId(), name: 'Problem Solving', level: 'advanced', category: 'soft' },
				{ id: generateId(), name: 'Team Collaboration', level: 'intermediate', category: 'soft' }
			];
		} else if (templateName.includes('hospitality')) {
			return [
				{ id: generateId(), name: 'Customer Service', level: 'advanced', category: 'soft' },
				{ id: generateId(), name: 'Multitasking', level: 'intermediate', category: 'soft' },
				{ id: generateId(), name: 'Communication', level: 'advanced', category: 'soft' },
				{ id: generateId(), name: 'Reservation Systems', level: 'intermediate', category: 'technical' },
				{ id: generateId(), name: 'Attention to Detail', level: 'advanced', category: 'soft' }
			];
		}
		
		return [
			{ id: generateId(), name: 'Communication', level: 'intermediate', category: 'soft' },
			{ id: generateId(), name: 'Teamwork', level: 'intermediate', category: 'soft' },
			{ id: generateId(), name: 'Problem Solving', level: 'intermediate', category: 'soft' },
			{ id: generateId(), name: 'Microsoft Office', level: 'intermediate', category: 'technical' },
			{ id: generateId(), name: 'Time Management', level: 'intermediate', category: 'soft' }
		];
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

	function handleImportProfile() {
		if (!$userProfile) {
			console.warn('No user profile available to import');
			toast.error('No profile data available to import');
			return;
		}
		
		console.log('📥 Importing personal information from profile');
		importFromProfile({
			includePersonalInfo: true,
			includeExperience: false,
			includeEducation: false,
			includeSkills: false,
			mergingStrategy: 'merge'
		});
		
		toast.success('Contact information imported from your profile', {
			description: 'Only empty fields were updated to preserve your existing data'
		});
	}

	async function handleSyncToProfile() {
		if (!$userProfile) {
			console.warn('No user profile available to sync to');
			return;
		}
		
		console.log('📤 Syncing contact info to profile');
		const success = await syncProfileFromBuilder({
			syncPersonalInfo: true,
			syncSummary: false,
			syncExperience: false,
			syncEducation: false,
			syncSkills: false
		});
		
		if (success) {
			console.log('✅ Successfully synced contact info to profile');
		} else {
			console.error('❌ Failed to sync to profile');
		}
	}

	// Optional: Enable auto-sync for personal info only (less intrusive)
	let autoSyncUnsubscribe: (() => void) | null = null;
	
	onMount(() => {
		// Enable auto-sync for personal info only to keep profile updated
		// This is conservative - only syncs contact information
		if ($userProfile) {
			autoSyncUnsubscribe = enableAutoSync({
				personalInfo: true, // Auto-sync contact info
				summary: false,     // Don't auto-sync content
				experience: false,  // Don't auto-sync content  
				education: false,   // Don't auto-sync content
				skills: false       // Don't auto-sync content
			});
		}
		
		return () => {
			if (autoSyncUnsubscribe) {
				autoSyncUnsubscribe();
			}
			if (typeof document !== 'undefined') {
				document.removeEventListener('click', handleClickOutside);
			}
		};
	});
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
		<header class="bg-white border-b border-gray-200">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div class="flex items-center justify-between h-16">
					<!-- Left side: Logo and title -->
					<div class="flex items-center space-x-3">
						<div class="hidden sm:block">
							<button 
								class="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
								on:click={handleBackToDashboard}
							>
								<ArrowLeft class="w-4 h-4" />
								Dashboard
							</button>
						</div>
						<Logo size="sm" showText={false} />
						<div class="hidden sm:block">
							<h1 class="text-xl font-semibold">Resume Builder</h1>
							<p class="text-sm text-muted-foreground">Create your professional resume step by step</p>
						</div>
						<div class="sm:hidden">
							<h1 class="text-xl font-bold text-gray-900">Resume Builder</h1>
						</div>
					</div>

					<!-- Mobile/Medium menu button -->
					<div class="lg:hidden">
						<button
							class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors duration-200"
							data-mobile-menu-button
							on:click={() => {
								console.log('Builder hamburger menu clicked! Current state:', mobileMenuOpen);
								mobileMenuOpen = !mobileMenuOpen;
								console.log('New state:', mobileMenuOpen);
							}}
							aria-expanded={mobileMenuOpen}
						>
							<span class="sr-only">Open main menu</span>
							<div class="relative w-6 h-6">
								<Menu class="h-6 w-6 transition-all duration-300 {mobileMenuOpen ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'}" />
								<X class="h-6 w-6 absolute inset-0 transition-all duration-300 {mobileMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'}" />
							</div>
						</button>
					</div>

					<!-- Desktop navigation (large screens only) -->
					<div class="hidden lg:flex items-center gap-2">
						{#if $userProfile}
							<Button 
								variant="ghost" 
								size="sm"
								on:click={handleImportProfile}
								title="Import contact information from your profile"
							>
								<Download class="w-4 h-4 mr-1" />
								Import Contact Info
							</Button>
							<Button 
								variant="ghost" 
								size="sm"
								on:click={handleSyncToProfile}
								title="Sync contact information back to your profile"
							>
								<UserPlus class="w-4 h-4 mr-1" />
								Sync Contact Info
							</Button>
						{/if}
						<Button 
							variant="outline" 
							size="sm"
							on:click={handleSave}
							disabled={!unsavedChanges}
						>
							{unsavedChanges ? 'Save Draft' : 'Saved'}
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

				<!-- Mobile/Medium menu -->
				{#if mobileMenuOpen}
					<div class="lg:hidden mobile-menu-container transition-all duration-200 ease-in-out">
						<div class="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200 shadow-lg">
							<!-- Back to Dashboard Button -->
							<button
								class="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 active:bg-blue-800 text-center font-medium transition-colors duration-200 shadow-sm"
								on:click={() => { handleBackToDashboard(); mobileMenuOpen = false; }}
							>
								<ArrowLeft class="h-4 w-4 mr-1 inline" />
								Back to Dashboard
							</button>

							<!-- Action Buttons -->
							<div class="space-y-2">
								{#if $userProfile}
									<button
										class="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 active:bg-gray-300 text-center font-medium transition-colors duration-200"
										on:click={() => { handleImportProfile(); mobileMenuOpen = false; }}
									>
										<Download class="h-4 w-4 mr-1 inline" />
										Import Contact Info
									</button>
									<button
										class="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 active:bg-gray-300 text-center font-medium transition-colors duration-200"
										on:click={() => { handleSyncToProfile(); mobileMenuOpen = false; }}
									>
										<UserPlus class="h-4 w-4 mr-1 inline" />
										Sync Contact Info
									</button>
								{/if}
								<button
									class="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 active:bg-gray-300 text-center font-medium transition-colors duration-200"
									on:click={() => { handleSave(); mobileMenuOpen = false; }}
									disabled={!unsavedChanges}
								>
									{unsavedChanges ? 'Save Draft' : 'Saved'}
								</button>
							</div>

							<!-- User info -->
							{#if $currentUser}
								<div class="flex items-center justify-between py-3 px-3 bg-gray-50 rounded-lg mt-3 border border-gray-100">
									<div class="flex items-center gap-2">
										<div class="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
											{$currentUser?.name?.charAt(0)?.toUpperCase() || 'U'}
										</div>
										<span class="text-sm text-gray-700 font-medium">{$currentUser.email}</span>
									</div>
									<div class="flex items-center gap-1">
										<button
											class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
											title="Sign out"
											on:click={() => { handleLogout(); mobileMenuOpen = false; }}
										>
											<LogOut class="h-4 w-4" />
										</button>
									</div>
								</div>
							{/if}
						</div>
					</div>
				{/if}
			</div>
		</header>

		<!-- Main Content -->
		<div class="container mx-auto px-4 py-6 min-h-screen">
			<!-- Mobile Tab Navigation -->
			<div class="lg:hidden mb-4">
				<div class="bg-white rounded-lg border p-2">
					<div class="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
						{#each tabs as tab}
							<button
								class="flex-shrink-0 flex flex-col items-center gap-1 px-4 py-2 rounded-md transition-all
									{activeTab === tab.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}"
								on:click={() => handleTabChange(tab.id)}
							>
								<svelte:component this={tab.icon} class="w-4 h-4" />
								<span class="text-xs font-medium whitespace-nowrap">{tab.label}</span>
								{#if $isStepComplete(tab.id)}
									<div class="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
								{/if}
							</button>
						{/each}
					</div>
				</div>
			</div>

			<div class="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[calc(100vh-200px)]">
				<!-- Sidebar Navigation - Desktop only -->
				<div class="hidden lg:block lg:col-span-1">
					<div class="bg-white rounded-lg border p-4 sticky top-6">
						<h3 class="font-semibold mb-4">Resume Sections</h3>
						<nav class="space-y-2">
							{#each tabs as tab}
								<button
									class="w-full flex items-center gap-3 px-3 py-2 text-left rounded-md transition-all duration-200 cursor-pointer
										{activeTab === tab.id ? 'bg-primary text-primary-foreground shadow-md' : 'hover:bg-muted hover:shadow-sm'}"
									on:click={() => handleTabChange(tab.id)}
									title="Click to go to {tab.label}"
								>
									<div class="relative">
										<svelte:component this={tab.icon} class="w-4 h-4" />
										{#if $isStepComplete(tab.id)}
											<div class="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
												<svg class="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
												</svg>
											</div>
										{:else}
											<div class="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full"></div>
										{/if}
									</div>
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
							 <!-- Selected Template/Color info -->
							  <div class="mt-3 text-xs text-muted-foreground">
							    <div><span class="font-medium text-foreground">Template:</span> {selectedTemplate ? selectedTemplate.name : 'Not selected'}</div>
											<div class="flex items-center gap-2">
												<span class="font-medium text-foreground">Color:</span>
												<span class={`inline-block w-3 h-3 rounded-full ${colorClass}`}></span>
												<span>{selectedColorScheme}</span>
											</div>
										</div>
									</div>
								</div>
							</div>

				<!-- Content Area -->
				<div class="col-span-1 lg:col-span-3 flex flex-col">
					<div class="bg-white rounded-lg border flex-1 flex flex-col max-h-[calc(100vh-200px)]">
						<!-- Header Section (Fixed) -->
						<div class="p-6 border-b bg-white rounded-t-lg flex-shrink-0">
							<!-- Active Section Indicator -->
							<div class="p-3 bg-blue-50 border border-blue-200 rounded-lg">
								<div class="flex items-center gap-2 text-blue-800">
									<svelte:component this={tabs.find(t => t.id === activeTab)?.icon || User} class="w-4 h-4" />
									<span class="font-medium">Current Section: {tabs.find(t => t.id === activeTab)?.label || 'Unknown'}</span>
								</div>
								<p class="text-sm text-blue-600 mt-1">{tabs.find(t => t.id === activeTab)?.description || ''}</p>
							</div>
						</div>
						
						<!-- Scrollable Content Area -->
						<div class="flex-1 overflow-y-auto p-6">
						
						<!-- First-time job seeker guidance -->
						{#if isFirstTimeJobSeeker && activeTab !== 'preview'}
							<div class="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
								<div class="flex items-start gap-3">
									<div class="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
										<User class="w-4 h-4 text-blue-600" />
									</div>
									<div>
										<h3 class="font-medium text-blue-900 mb-1">Smart Resume Builder for First-Time Job Seekers</h3>
										<p class="text-sm text-blue-800 mb-2">
											We've optimized the section order for your experience level. Education and projects come first to highlight your academic achievements and personal initiatives.
										</p>
										<div class="text-xs text-blue-700">
											<strong>Tip:</strong> Experience is optional for students and entry-level candidates. Focus on your education, projects, and transferable skills.
										</div>
									</div>
								</div>
							</div>
						{/if}
						
						{#if activeTab === 'personal'}
							<PersonalInfoTab onNext={() => handleTabChange(getNextTab('personal'))} />
						{:else if activeTab === 'summary'}
							<SummaryTab 
								onNext={() => handleTabChange(getNextTab('summary'))} 
								onPrevious={() => handleTabChange(getPreviousTab('summary'))} 
							/>
						{:else if activeTab === 'experience'}
							<ExperienceTab 
								onNext={() => handleTabChange(getNextTab('experience'))} 
								onPrevious={() => handleTabChange(getPreviousTab('experience'))} 
							/>
						{:else if activeTab === 'education'}
							<EducationTab 
								onNext={() => handleTabChange(getNextTab('education'))} 
								onPrevious={() => handleTabChange(getPreviousTab('education'))} 
							/>
						{:else if activeTab === 'skills'}
							<SkillsTab 
								onNext={() => handleTabChange(getNextTab('skills'))} 
								onPrevious={() => handleTabChange(getPreviousTab('skills'))} 
							/>
						{:else if activeTab === 'projects'}
							<ProjectsTab 
								onNext={() => handleTabChange(getNextTab('projects'))} 
								onPrevious={() => handleTabChange(getPreviousTab('projects'))} 
							/>
						{:else if activeTab === 'settings'}
							
							<div class="space-y-8">
								<!-- Layout Toggle -->
								<div class="space-y-4">
									<h3 class="text-lg font-semibold">Resume Length</h3>
									<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
										<button class={`p-4 rounded-lg text-left ${$builderData.settings?.layout === '1-page' ? 'border-2 border-primary bg-primary/5' : 'border hover:border-primary'}`} on:click={() => updateSettings({ layout: '1-page' })}>
											<div class="font-medium mb-2">1 Page</div>
											<p class="text-sm text-muted-foreground">
												Perfect for entry-level positions. Concise and focused.
											</p>
										</button>
										
										<button class={`p-4 rounded-lg text-left ${$builderData.settings?.layout === '2-page' ? 'border-2 border-primary bg-primary/5' : 'border hover:border-primary'}`} on:click={() => updateSettings({ layout: '2-page' })}>
											<div class="font-medium mb-2">2 Pages Max</div>
											<p class="text-sm text-muted-foreground">
												More space for experience and projects.
											</p>
										</button>
									</div>
								</div>

											<!-- Template Selection (from database) -->
								<div class="space-y-4">
									<h3 class="text-lg font-semibold">Choose a Template</h3>
									<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
										{#each $allTemplates as t}
											<button class="p-3 border rounded-lg text-left hover:border-primary { $builderData.settings?.template === t.id ? 'border-primary bg-primary/5' : '' }" on:click={() => selectTemplate(t)}>
												<div class="flex items-center gap-3">
													<img src={t.thumbnail} alt={t.name} class="w-12 h-16 object-cover rounded border" />
													<div>
														<div class="font-medium">{t.name}</div>
														<div class="text-xs text-muted-foreground line-clamp-1">{t.category}</div>
														{#if t.isClientSide}
															<div class="text-xs text-green-600 font-medium">✨ Enhanced</div>
														{/if}
													</div>
												</div>
												<div class="mt-2 text-xs text-blue-600 hover:underline" on:click|stopPropagation={() => goto(`/templates/${t.id}/preview`)}>Preview</div>
											</button>
										{/each}
									</div>
								</div>

								<!-- Color Scheme -->
								<div class="space-y-4">
									<h3 class="text-lg font-semibold">Color Scheme</h3>
									<div class="grid grid-cols-4 gap-4">
									<button class={`p-3 rounded-lg text-center ${$builderData.settings?.colorScheme === 'blue' ? 'border-2 border-primary bg-primary/5' : 'border hover:border-primary'}`} on:click={() => updateSettings({ colorScheme: 'blue' })}>
									<div class="w-6 h-6 bg-blue-500 rounded mx-auto mb-1"></div>
									<div class="text-sm">Blue</div>
									</button>
									<button class={`p-3 rounded-lg text-center ${$builderData.settings?.colorScheme === 'green' ? 'border-2 border-primary bg-primary/5' : 'border hover:border-primary'}`} on:click={() => updateSettings({ colorScheme: 'green' })}>
									<div class="w-6 h-6 bg-green-500 rounded mx-auto mb-1"></div>
									<div class="text-sm">Green</div>
									</button>
									<button class={`p-3 rounded-lg text-center ${$builderData.settings?.colorScheme === 'purple' ? 'border-2 border-primary bg-primary/5' : 'border hover:border-primary'}`} on:click={() => updateSettings({ colorScheme: 'purple' })}>
									<div class="w-6 h-6 bg-purple-500 rounded mx-auto mb-1"></div>
									<div class="text-sm">Purple</div>
									</button>
									<button class={`p-3 rounded-lg text-center ${$builderData.settings?.colorScheme === 'black' ? 'border-2 border-primary bg-primary/5' : 'border hover:border-primary'}`} on:click={() => updateSettings({ colorScheme: 'black' })}>
									<div class="w-6 h-6 bg-gray-800 rounded mx-auto mb-1"></div>
									<div class="text-sm">Black</div>
									</button>
									</div>
								</div>
							</div>

							<div class="mt-8 flex justify-between">
								<Button variant="outline" on:click={() => handleTabChange(getPreviousTab('settings'))}>
									← Previous
								</Button>
								<Button on:click={() => handleTabChange('preview')} disabled={!$isStepComplete('personal') || !$isStepComplete('summary') || !$isStepComplete('experience') || !$isStepComplete('education') || !$isStepComplete('skills')}>
									Next: Preview
								</Button>
							</div>

						{:else if activeTab === 'preview'}

							<div class="space-y-6">
								<!-- Completion Status -->
								<div class="bg-muted p-4 rounded-lg">
									<h3 class="font-semibold mb-3">Resume Completion Status</h3>
									<div class="space-y-2">
										<div class="flex justify-between">
											<span>Personal Information</span>
											<span class={$isStepComplete('personal') ? 'text-green-600' : 'text-yellow-600'}>
												{$isStepComplete('personal') ? '✅ Complete' : '⏳ In Progress'}
											</span>
										</div>
										<div class="flex justify-between">
											<span>Professional Summary</span>
											<span class={$isStepComplete('summary') ? 'text-green-600' : 'text-yellow-600'}>
												{$isStepComplete('summary') ? '✅ Complete' : '⏳ In Progress'}
											</span>
										</div>
										<div class="flex justify-between">
											<span>Work Experience</span>
											<span class={$isStepComplete('experience') ? 'text-green-600' : 'text-yellow-600'}>
												{$isStepComplete('experience') ? '✅ Complete' : '⏳ In Progress'}
											</span>
										</div>
										<div class="flex justify-between">
											<span>Education</span>
											<span class={$isStepComplete('education') ? 'text-green-600' : 'text-yellow-600'}>
												{$isStepComplete('education') ? '✅ Complete' : '⏳ In Progress'}
											</span>
										</div>
										<div class="flex justify-between">
											<span>Skills</span>
											<span class={$isStepComplete('skills') ? 'text-green-600' : 'text-yellow-600'}>
												{$isStepComplete('skills') ? '✅ Complete' : '⏳ In Progress'}
											</span>
										</div>
									</div>
								</div>

								{#if $isStepComplete('personal') && $isStepComplete('summary') && $isStepComplete('experience') && $isStepComplete('education') && $isStepComplete('skills')}
									<!-- Resume Preview -->
									<div class="border rounded-lg overflow-hidden bg-white">
										<ResumePreview resume={{
											id: 'preview',
											title: 'Resume Preview',
											user: '',
											content: {
												personalInfo: $builderData.personalInfo,
												summary: $builderData.summary,
												experience: $builderData.experience,
												education: $builderData.education,
												skills: $builderData.skills,
												projects: $builderData.projects,
												settings: $builderData.settings
											},
											template: $builderData.settings.template,
											is_public: false,
											created: new Date().toISOString(),
											updated: new Date().toISOString(),
											sections: [
												{ id: 'experience', type: 'experience', title: 'Work Experience', visible: true, order: 0, data: $builderData.experience },
												{ id: 'education', type: 'education', title: 'Education', visible: true, order: 1, data: $builderData.education },
												{ id: 'skills', type: 'skills', title: 'Skills', visible: true, order: 2, data: $builderData.skills },
												{ id: 'projects', type: 'projects', title: 'Projects', visible: $builderData.projects.length > 0, order: 3, data: $builderData.projects }
											]
										}} />
									</div>
								{:else}
									<div class="bg-green-50 border border-green-200 p-4 rounded-lg">
										<h4 class="font-medium text-green-800 mb-2">🎉 Almost Ready!</h4>
										<p class="text-sm text-green-700">
											Complete the remaining sections and your resume will be ready to publish and share with employers.
										</p>
									</div>
								{/if}
							</div>

							<div class="mt-8 flex justify-between">
								<Button variant="outline" on:click={() => handleTabChange(getPreviousTab('preview'))}>
									← Previous
								</Button>
								<Button
									on:click={handlePublish}
									disabled={!($isStepComplete('personal') && $isStepComplete('summary') && $isStepComplete('experience') && $isStepComplete('education') && $isStepComplete('skills'))}
								>
									Publish Resume
								</Button>
							</div>
						{/if}
						</div>
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

<style>
	/* Hide scrollbar for mobile tab navigation */
	.scrollbar-hide::-webkit-scrollbar {
		display: none;
	}
	.scrollbar-hide {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
</style>