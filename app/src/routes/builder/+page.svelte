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
	import { FileText, User, FileCheck, Briefcase, Award, Code, Settings, Eye, ArrowLeft, LogOut, ChevronDown, Download, UserPlus, Menu, X, Sparkles, Target } from 'lucide-svelte';
	import Logo from '$lib/components/ui/Logo.svelte';
	import { toast } from 'svelte-sonner';
	import QuickGenerateModal from '$lib/components/builder/QuickGenerateModal.svelte';
	import { Badge } from '$lib/components/ui/badge';
	
	let mobileMenuOpen = false;
	let showQuickGenerateModal = false;

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
				
				// If user has selected an industry, ALWAYS preserve industry-specific content
				// Don't let template selection overwrite industry boilerplate
				const hasIndustryContent = !!d.target_industry;
				
				console.log('🎨 Template selection - Has industry:', d.target_industry, 'Will preserve content:', hasIndustryContent);
				console.log('🎨 Current skills before template:', d.skills.map(s => `${s.name} (${s.category})`));
				
				const newSkills = hasIndustryContent ? d.skills : (
					Array.isArray(mergedData.skills) && mergedData.skills.length > 0 
						? mergedData.skills 
						: getDefaultSkills(full)
				);
				
				console.log('🎨 Skills after template decision:', newSkills.map(s => `${s.name} (${s.category})`));
				
				// Apply merged data to builder - preserve industry content if it exists
				return {
					...d,
					personalInfo: mergedData.personalInfo ? { ...d.personalInfo, ...mergedData.personalInfo } : d.personalInfo,
					// Preserve industry summary if it exists
					summary: hasIndustryContent ? d.summary : (mergedData.summary || getDefaultSummary(full)),
					// Preserve industry experience if it exists
					experience: hasIndustryContent ? d.experience : (
						Array.isArray(mergedData.experience) && mergedData.experience.length > 0 
							? mergedData.experience 
							: getDefaultExperience(full)
					),
					// Preserve industry education if it exists
					education: hasIndustryContent ? d.education : (
						Array.isArray(mergedData.education) && mergedData.education.length > 0 
							? mergedData.education 
							: getDefaultEducation(full)
					),
					// Preserve industry skills if they exist
					skills: newSkills,
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
			
			// Start on personal info step instead of settings
			currentStep.set('personal');
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
				
				// Start on personal info step instead of settings
				currentStep.set('personal');
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
	
	// Debug: Log whenever skills change
	$: if ($builderData.skills) {
		console.log('🔍 Builder skills changed:', $builderData.skills.map(s => `${s.name} (${s.category})`));
	}

	// Auto-show Smart Generate modal when landing on builder without content
	let hasShownQuickGenerate = false;
	
	$: if (activeTab === 'personal' && !$builderData.target_industry && !showQuickGenerateModal && !hasShownQuickGenerate) {
		// Small delay to ensure UI is ready
		setTimeout(() => {
			showQuickGenerateModal = true;
			hasShownQuickGenerate = true;
			toast.info('Smart Generate', {
				description: 'Generate your resume from your profile or choose an industry template.'
			});
		}, 500);
	}

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
		{ id: 'personal', label: 'Personal Info', icon: User, description: 'Basic contact details' },
		{ id: 'summary', label: 'Summary', icon: FileCheck, description: 'Professional summary' },
		{ id: 'education', label: 'Education', icon: Award, description: 'Academic background' },
		{ id: 'projects', label: 'Projects', icon: FileText, description: 'Projects & activities' },
		{ id: 'skills', label: 'Skills', icon: Code, description: 'Technical & soft skills' },
		{ id: 'experience', label: 'Experience', icon: Briefcase, description: 'Work history (optional)' },
		{ id: 'preview', label: 'Preview', icon: Eye, description: 'Review & publish' }
	] : [
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
			// Show loading toast
			toast.loading('Publishing your resume...', {
				description: 'Please wait while we save and publish your resume.',
				id: 'publish-loading'
			});

			const result = await publishResume();
			console.log('Published:', result);
			
			// Dismiss loading toast
			toast.dismiss('publish-loading');
			
			// Show success with more details
			toast.success('🎉 Resume Published Successfully!', {
				description: `Your ${$builderData.target_industry || ''} resume is now live! Redirecting to dashboard...`,
				duration: 3000
			});

			// Show a second toast with next steps
			setTimeout(() => {
				toast.info('Next Steps', {
					description: 'View your resume in the dashboard, share it with employers, or create more versions.',
					duration: 4000
				});
			}, 500);

			// Redirect to dashboard after showing messages with success indicator
			setTimeout(() => {
				goto('/dashboard?published=true');
			}, 2000);
		} catch (error) {
			console.error('Failed to publish:', error);
			toast.dismiss('publish-loading');
			toast.error('Failed to publish resume', {
				description: error instanceof Error ? error.message : 'Please try again or contact support.'
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
								variant="default"
								size="sm"
								on:click={() => showQuickGenerateModal = true}
								title="Smart generate resume from profile or industry template"
								class="bg-purple-600 hover:bg-purple-700"
							>
								<Sparkles class="w-4 h-4 mr-1" />
								Smart Generate
							</Button>
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
										class="w-full bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 active:bg-purple-800 text-center font-medium transition-colors duration-200 shadow-sm"
										on:click={() => { showQuickGenerateModal = true; mobileMenuOpen = false; }}
									>
										<Sparkles class="h-4 w-4 mr-1 inline" />
										Smart Generate
									</button>
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

								<!-- Resume Metadata -->
								{#if $builderData.purpose || $builderData.target_industry}
									<div class="bg-blue-50 border border-blue-200 p-4 rounded-lg">
										<h3 class="font-semibold text-blue-900 mb-3 flex items-center gap-2">
											<Target class="w-5 h-5" />
											Resume Metadata
										</h3>
										<div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
											{#if $builderData.purpose}
												<div>
													<div class="text-xs text-blue-600 font-medium mb-1 flex items-center gap-1">
														<Briefcase class="w-3 h-3" />
														Purpose
													</div>
													<p class="text-sm text-blue-900">{$builderData.purpose}</p>
												</div>
											{/if}
											{#if $builderData.target_industry}
												<div>
													<div class="text-xs text-blue-600 font-medium mb-1 flex items-center gap-1">
														<Target class="w-3 h-3" />
														Target Industry
													</div>
													<p class="text-sm text-blue-900">{$builderData.target_industry}</p>
												</div>
											{/if}
										</div>
										
										<!-- Quick Publish Button -->
										{#if $isStepComplete('personal') && $isStepComplete('summary') && $isStepComplete('experience') && $isStepComplete('education') && $isStepComplete('skills')}
											<div class="pt-3 border-t border-blue-200">
												<Button 
													class="w-full bg-green-600 hover:bg-green-700 text-white"
													on:click={handlePublish}
													disabled={!$isStepComplete('personal') || !$isStepComplete('summary') || !$isStepComplete('experience') || !$isStepComplete('education') || !$isStepComplete('skills')}
												>
													<Sparkles class="w-4 h-4 mr-2" />
													Publish Resume Now
												</Button>
												<p class="text-xs text-blue-600 text-center mt-2">
													Your resume is ready! Click to publish and share with employers.
												</p>
											</div>
										{/if}
									</div>
								{/if}

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

							<div class="mt-8 flex justify-between items-center">
								<Button variant="outline" on:click={() => handleTabChange(getPreviousTab('preview'))}>
									← Previous
								</Button>
								<div class="flex flex-col items-end gap-2">
									<Button
										class="bg-green-600 hover:bg-green-700 text-white"
										on:click={handlePublish}
										disabled={!($isStepComplete('personal') && $isStepComplete('summary') && $isStepComplete('experience') && $isStepComplete('education') && $isStepComplete('skills'))}
									>
										<Sparkles class="w-4 h-4 mr-2" />
										Publish Resume
									</Button>
									{#if $isStepComplete('personal') && $isStepComplete('summary') && $isStepComplete('experience') && $isStepComplete('education') && $isStepComplete('skills')}
										<p class="text-xs text-muted-foreground">
											All sections complete ✓
										</p>
									{/if}
								</div>
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

<!-- Smart Generate Modal -->
<QuickGenerateModal
	bind:open={showQuickGenerateModal}
	currentTemplate={selectedTemplate}
	on:close={() => showQuickGenerateModal = false}
/>

<!-- Industry Selector Modal -->
