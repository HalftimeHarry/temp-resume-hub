<script lang="ts">
	import { page } from '$app/stores';
	import { onMount, onDestroy, tick } from 'svelte';
	import { pb, resumes } from '$lib/pocketbase';
	import Logo from '$lib/components/ui/Logo.svelte';
	import type { Resume } from '$lib/types/resume.js';
	import { Menu, X, ArrowLeft, Printer } from 'lucide-svelte';

	let resume: Resume | null = null;
	let loading = true;
	let error = '';
	
	// Mobile menu state
	let mobileMenuOpen = false;
	
	// Styling state
	let showStylingPanel = false;
	let showUpgradeModal = false;

	// Debug reactive statement
	$: {
		console.log('Resume mobile menu state changed:', mobileMenuOpen);
	}

	// Close mobile menu when clicking outside
	function handleClickOutside(event: MouseEvent) {
		if (mobileMenuOpen && 
			!(event.target as Element).closest('.mobile-menu-container') &&
			!(event.target as Element).closest('[data-mobile-menu-button]')) {
			mobileMenuOpen = false;
		}
	}

	// Print function
	function handlePrint() {
		// Close mobile menu if open
		mobileMenuOpen = false;
		
		// Trigger browser print dialog
		window.print();
	}
	let previewSettings = {
		colorScheme: 'orange',
		fontSize: 'medium',
		spacing: 'normal',
		layout: 'single-column',
		headerStyle: 'professional'
	};
	
	// Premium features - in a real app, this would come from user subscription status
	let isPremiumUser = false;

	// Theme presets with enhanced styling
	const themePresets = [
		{
			name: 'professional',
			label: 'Professional',
			description: 'Clean and traditional layout',
			settings: {
				colorScheme: 'blue',
				fontSize: 'medium',
				spacing: 'normal',
				layout: 'single-column',
				headerStyle: 'professional'
			}
		},
		{
			name: 'modern',
			label: 'Modern',
			description: 'Contemporary two-column design',
			settings: {
				colorScheme: 'green',
				fontSize: 'medium',
				spacing: 'compact',
				layout: 'two-column',
				headerStyle: 'modern'
			}
		},
		{
			name: 'creative',
			label: 'Creative',
			description: 'Bold and expressive layout',
			settings: {
				colorScheme: 'purple',
				fontSize: 'large',
				spacing: 'relaxed',
				layout: 'single-column',
				headerStyle: 'creative'
			}
		},
		{
			name: 'minimal',
			label: 'Minimal',
			description: 'Simple and clean design',
			settings: {
				colorScheme: 'black',
				fontSize: 'small',
				spacing: 'compact',
				layout: 'single-column',
				headerStyle: 'minimal'
			}
		},
		{
			name: 'bold',
			label: 'Bold',
			description: 'Striking and impactful layout',
			settings: {
				colorScheme: 'orange',
				fontSize: 'large',
				spacing: 'normal',
				layout: 'two-column',
				headerStyle: 'bold'
			}
		},
		{
			name: 'classic',
			label: 'Classic',
			description: 'Timeless with profile image',
			settings: {
				colorScheme: 'blue',
				fontSize: 'medium',
				spacing: 'relaxed',
				layout: 'with-image',
				headerStyle: 'classic'
			}
		}
	];

	// Color scheme options
	const colorSchemes = [
		{ name: 'blue', label: 'Blue', primary: '#3b82f6', secondary: '#1e40af' },
		{ name: 'green', label: 'Green', primary: '#10b981', secondary: '#047857' },
		{ name: 'purple', label: 'Purple', primary: '#8b5cf6', secondary: '#6d28d9' },
		{ name: 'black', label: 'Black', primary: '#1f2937', secondary: '#111827' },
		{ name: 'orange', label: 'Orange', primary: '#f97316', secondary: '#ea580c' }
	];
	
	// Font size options
	const fontSizes = [
		{ name: 'small', label: 'Small' },
		{ name: 'medium', label: 'Medium' },
		{ name: 'large', label: 'Large' }
	];
	
	// Spacing options
	const spacingOptions = [
		{ name: 'compact', label: 'Compact' },
		{ name: 'normal', label: 'Normal' },
		{ name: 'relaxed', label: 'Relaxed' }
	];
	
	// Layout options
	const layoutOptions = [
		{ name: 'single-column', label: '📄 Single Column', icon: '📄' },
		{ name: 'two-column', label: '📑 Two Columns', icon: '📑' },
		{ name: 'with-image', label: '🖼️ With Image', icon: '🖼️' }
	];

	$: slug = $page.params.slug;
	
	// Reactive dependency to ensure functions re-run when previewSettings changes
	$: previewSettingsDep = JSON.stringify(previewSettings);
	
	// Force template re-render when previewSettings changes
	$: {
		if (previewSettings) {
			console.log('🔄 Template reactive update triggered by previewSettings change:', previewSettings);
		}
	}

	onMount(async () => {
		try {
			// First try to find by slug
			try {
				const record = await pb.collection('resumes').getFirstListItem(`slug="${slug}" && is_public=true`, {
					expand: 'user'
				});
				resume = record as Resume;
			} catch (slugError) {
				// If slug lookup fails, try by ID
				try {
					const record = await pb.collection('resumes').getFirstListItem(`id="${slug}" && is_public=true`, {
						expand: 'user'
					});
					resume = record as Resume;
				} catch (idError) {
					console.error('Failed to load resume by slug or ID:', slugError, idError);
					error = '❌ Resume not found or not public';
				}
			}
		} catch (err) {
			console.error('Failed to load resume:', err);
			error = '❌ Resume not found or not public';
		} finally {
			// Initialize preview settings with resume styling if available
			if (resume && resume.content?.styling) {
				previewSettings = {
					...previewSettings,
					colorScheme: resume.content.styling.colorScheme || 'orange',
					fontSize: resume.content.styling.fontSize || 'medium',
					spacing: resume.content.styling.spacing || 'normal',
					layout: resume.content.styling.layout || 'single-column',
					headerStyle: resume.content.styling.headerStyle || 'professional'
				};
			}
			loading = false;
		}
		
		// Add click outside handler for mobile menu (browser only)
		if (typeof document !== 'undefined') {
			document.addEventListener('click', handleClickOutside);
		}
	});

	onDestroy(() => {
		if (typeof document !== 'undefined') {
			document.removeEventListener('click', handleClickOutside);
		}
	});

	let isApplying = false;
	
	async function applyChanges(): Promise<void> {
		isApplying = true;
		try {
			// Save both styling and resume data to database
			console.log('Applying changes - saving styling and data to server:', previewSettings);
			
			const updatedContent = {
				...resume.content,
				styling: { ...previewSettings }
			};
			
			const result = await resumes.updateResume(resume.id, { content: updatedContent });
			
			if (result.success) {
				resume = result.resume;
				// Update previewSettings to match the saved styling
				if (resume.content?.styling) {
					previewSettings = { ...resume.content.styling };
				}
				console.log('Changes applied successfully');
				
				// Show success feedback
				alert('✅ Changes applied successfully!');
			} else {
				console.error(`Failed to apply changes: ${result.error}`);
				alert('❌ Failed to apply changes. Please try again.');
			}
		} catch (error) {
			console.error('Error applying changes:', error);
			alert('❌ Error applying changes. Please try again.');
		} finally {
			isApplying = false;
		}
	}
	
	function updatePreviewSettings(setting: keyof typeof previewSettings, value: string) {
		previewSettings = { ...previewSettings, [setting]: value };
	}
	
	function applyStyling(): void {
		showStylingPanel = false;
		// Apply styling settings to resume preview (client-side only)
		console.log('Applying styling settings to preview:', previewSettings);
		
		// Force reactivity by creating a new previewSettings object
		// This should trigger the styling functions to re-run
		previewSettings = { ...previewSettings };
		
		console.log('Preview styling applied successfully');
	}
	

	
	function resetToDefault(): void {
		previewSettings = {
			colorScheme: 'orange',
			fontSize: 'medium',
			spacing: 'normal',
			layout: 'single-column',
			headerStyle: 'professional'
		};
		// No alert needed - styling is applied immediately to preview
	}
	
	function applyThemePreset(preset: typeof themePresets[0]) {
		console.log('Applying theme preset:', preset);
		// Update preview settings with proper reactivity
		previewSettings = {
			...previewSettings,
			...preset.settings
		};
		console.log('Updated previewSettings:', previewSettings);
		
		// Don't close the panel immediately so user can see the preview changes
		// and optionally click "Apply Style" to save the changes
		
		// Optionally provide visual feedback that preview has been updated
		// For example, we could add a temporary message or change button state
	}
	
	function getFontSizeClass() {
		const result = ((): string => {
			switch (previewSettings.fontSize) {
				case 'small': return 'text-sm';
				case 'large': return 'text-lg';
				default: return 'text-base';
			}
		})();
		console.log('getFontSizeClass called with:', previewSettings.fontSize, 'returning:', result);
		return result;
	}
	
	function getSpacingClass() {
		const result = ((): string => {
			switch (previewSettings.spacing) {
				case 'compact': return 'space-y-4';
				case 'relaxed': return 'space-y-10';
				default: return 'space-y-6';
			}
		})();
		console.log('getSpacingClass called with:', previewSettings.spacing, 'returning:', result);
		return result;
	}
	
	function getSectionSpacingClass() {
		const result = ((): string => {
			switch (previewSettings.spacing) {
				case 'compact': return 'mb-4';
				case 'relaxed': return 'mb-10';
				default: return 'mb-6';
			}
		})();
		console.log('getSectionSpacingClass called with:', previewSettings.spacing, 'returning:', result);
		return result;
	}
	
	function getColorClasses() {
		const colors = {
			blue: { primary: 'text-blue-600', secondary: 'bg-blue-100 text-blue-800' },
			green: { primary: 'text-green-600', secondary: 'bg-green-100 text-green-800' },
			purple: { primary: 'text-purple-600', secondary: 'bg-purple-100 text-purple-800' },
			black: { primary: 'text-gray-800', secondary: 'bg-gray-100 text-gray-800' },
			orange: { primary: 'text-orange-600', secondary: 'bg-orange-100 text-orange-800' }
		};
		const result = colors[previewSettings.colorScheme] || colors.blue;
		console.log('getColorClasses called with:', previewSettings.colorScheme, 'returning:', result);
		return result;
	}
	
	function getLayoutClass() {
		const result = ((): string => {
			switch (previewSettings.layout) {
				case 'two-column':
					return 'grid grid-cols-1 md:grid-cols-2 gap-8';
				case 'with-image':
					return 'grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8';
				default:
					return '';
			}
		})();
		console.log('getLayoutClass called with:', previewSettings.layout, 'returning:', result);
		return result;
	}
	
	function getHeaderStyle() {
		const headerStyle = previewSettings.headerStyle || 'professional';
		const colors = getColorClasses();
		
		switch (headerStyle) {
			case 'professional':
				return {
					containerClass: 'bg-gradient-to-r from-blue-50 to-blue-100 p-8 rounded-t-lg border-b-4 border-blue-500',
					nameClass: `text-5xl font-bold mb-4 ${colors.primary}`,
					contactClass: 'text-lg text-gray-700'
				};
			case 'modern':
				return {
					containerClass: 'bg-gradient-to-br from-green-50 via-white to-green-50 p-10 rounded-t-lg border-l-8 border-green-500',
					nameClass: `text-6xl font-light mb-6 ${colors.primary} tracking-wide`,
					contactClass: 'text-base text-gray-600 font-medium'
				};
			case 'creative':
				return {
					containerClass: 'bg-gradient-to-r from-purple-100 via-pink-50 to-purple-100 p-12 rounded-t-lg relative overflow-hidden',
					nameClass: `text-6xl font-black mb-6 ${colors.primary} transform -skew-x-3`,
					contactClass: 'text-lg text-gray-700 font-semibold'
				};
			case 'minimal':
				return {
					containerClass: 'bg-white p-6 border-b border-gray-200',
					nameClass: `text-4xl font-thin mb-3 ${colors.primary} uppercase tracking-widest`,
					contactClass: 'text-sm text-gray-500 uppercase tracking-wide'
				};
			case 'bold':
				return {
					containerClass: 'bg-gradient-to-r from-orange-500 to-red-500 text-white p-12 rounded-t-lg shadow-2xl',
					nameClass: 'text-7xl font-black mb-6 text-white drop-shadow-lg',
					contactClass: 'text-xl text-orange-100 font-bold'
				};
			case 'classic':
				return {
					containerClass: 'bg-gradient-to-b from-blue-50 to-white p-10 rounded-t-lg border-t-8 border-blue-600',
					nameClass: `text-5xl font-serif mb-5 ${colors.primary} text-center`,
					contactClass: 'text-lg text-gray-600 text-center font-medium'
				};
			default:
				return {
					containerClass: 'bg-gray-50 p-8 rounded-t-lg',
					nameClass: `text-4xl font-bold mb-4 ${colors.primary}`,
					contactClass: 'text-base text-gray-700'
				};
		}
	}
	
	function getWatermarkStyle() {
		const headerStyle = previewSettings.headerStyle || 'professional';
		
		switch (headerStyle) {
			case 'professional':
				return 'absolute top-4 right-4 opacity-20 transform rotate-12';
			case 'modern':
				return 'absolute top-6 right-6 opacity-15 transform -rotate-6';
			case 'creative':
				return 'absolute top-8 right-8 opacity-25 transform rotate-45 scale-75';
			case 'minimal':
				return 'absolute top-2 right-2 opacity-10 transform rotate-0 scale-50';
			case 'bold':
				return 'absolute top-6 right-6 opacity-30 transform -rotate-12 scale-90';
			case 'classic':
				return 'absolute top-4 right-4 opacity-20 transform rotate-0 scale-75';
			default:
				return 'absolute top-4 right-4 opacity-20 transform rotate-12';
		}
	}
</script>

<svelte:head>
	{#if resume}
		<title>📄 {resume.title} - Dashboard</title>
		<meta name="description" content="📄 Professional resume created with Dashboard" />
	{:else}
		<title>📄 Resume - Dashboard</title>
	{/if}
</svelte:head>

{#if loading}
	<div class="min-h-screen flex items-center justify-center">
		<div class="text-center">
			<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4">🌀</div>
			<p class="text-muted-foreground">⏳ Loading resume...</p>
		</div>
	</div>
{:else if error}
	<div class="min-h-screen flex items-center justify-center">
		<div class="text-center">
			<h1 class="text-2xl font-bold mb-4">❌ Resume Not Found</h1>
			<p class="text-muted-foreground mb-6">{error}</p>
			<a href="/" class="text-primary hover:underline">🏠 ← Back to Home</a>
		</div>
	</div>
{:else if resume}
	<div class="min-h-screen bg-gray-50">
		<!-- Header -->
		<header class="bg-white border-b border-gray-200">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div class="flex items-center justify-between h-16">
					<!-- Left side: Logo and title -->
					<div class="flex items-center space-x-3">
						<div class="hidden sm:block">
							<a href="/" class={`flex items-center gap-2 hover:underline ${getColorClasses().primary}`}>
								<ArrowLeft class="w-4 h-4" />
								Dashboard
							</a>
						</div>
						<Logo size="sm" showText={false} />
						<div class="hidden sm:block">
							<h1 class="text-xl font-semibold">Resume View</h1>
							<p class="text-sm text-gray-600">Public resume preview</p>
						</div>
						<div class="sm:hidden">
							<h1 class="text-xl font-bold text-gray-900">Resume View</h1>
						</div>
					</div>

					<!-- Mobile menu button -->
					<div class="sm:hidden">
						<button
							class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors duration-200"
							data-mobile-menu-button
							on:click={() => {
								console.log('Resume hamburger menu clicked! Current state:', mobileMenuOpen);
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

					<!-- Desktop navigation -->
					<div class="hidden sm:flex items-center gap-2">
						<!-- Demo Premium Toggle (for testing) -->
						<button
							class="px-3 py-2 text-sm rounded-lg transition-colors bg-blue-100 text-blue-800 hover:bg-blue-200 flex items-center gap-2"
							on:click={handlePrint}
							title="Print Resume"
						>
							<Printer class="w-4 h-4" />
							Print
						</button>
						<button
							class="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-secondary/90 transition-colors"
							on:click={() => showStylingPanel = true}
						>
							🎨 Style Resume
						</button>
						<button
							class="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
							on:click={applyChanges}
							disabled={isApplying}
						>
							{#if isApplying}
								<div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
								Applying...
							{:else}
								✅ Apply Changes
							{/if}
						</button>
					</div>
				</div>

				<!-- Mobile menu -->
				{#if mobileMenuOpen}
					<div class="sm:hidden mobile-menu-container transition-all duration-200 ease-in-out">
						<div class="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200 shadow-lg">
							<!-- Back to Dashboard Button -->
							<a
								href="/"
								class="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 active:bg-blue-800 text-center font-medium transition-colors duration-200 shadow-sm flex items-center justify-center"
								on:click={() => { mobileMenuOpen = false; }}
							>
								<ArrowLeft class="h-4 w-4 mr-1" />
								Back to Dashboard
							</a>

							<!-- Premium Status -->
							<button
								class="w-full px-4 py-2 rounded-lg text-center font-medium transition-colors duration-200 bg-blue-100 text-blue-800 hover:bg-blue-200 flex items-center justify-center gap-2"
								on:click={handlePrint}
								title="Print Resume"
							>
								<Printer class="w-4 h-4" />
								Print Resume
							</button>

							<!-- Action Buttons -->
							<div class="space-y-2">
								<button
									class="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 active:bg-gray-300 text-center font-medium transition-colors duration-200"
									on:click={() => { showStylingPanel = true; mobileMenuOpen = false; }}
								>
									🎨 Style Resume
								</button>
								<button
									class="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 active:bg-green-800 text-center font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
									on:click={() => { applyChanges(); mobileMenuOpen = false; }}
									disabled={isApplying}
								>
									{#if isApplying}
										<div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
										Applying...
									{:else}
										✅ Apply Changes
									{/if}
								</button>
							</div>
						</div>
					</div>
				{/if}
			</div>
		</header>

		<!-- Resume Content -->
		<main class="container mx-auto px-4 py-8">
			<div class="max-w-4xl mx-auto">
				{#key previewSettingsDep}
				<div class={`bg-white rounded-lg shadow-lg p-8 md:p-12 ${getSpacingClass()} ${getLayoutClass()}`}>
					<!-- Left column for two-column layout -->
					<div class={previewSettings.layout === 'two-column' ? 'md:pr-8 md:border-r md:border-gray-200' : ''}>
						{#if resume.content?.personalInfo}
							<!-- Enhanced Personal Info Header -->
							<div class={`${getHeaderStyle().containerClass} relative ${getSectionSpacingClass()}`}>
								<!-- Logo Watermark (only for free users) -->
								{#if !isPremiumUser}
									<div class={getWatermarkStyle()}>
										<img src="/logo.svg" alt="Resume Hub" class="w-16 h-16 opacity-50" />
										<div class="text-xs text-gray-400 mt-1 text-center font-bold">FREE</div>
									</div>
								{/if}
								
								<h1 class={getHeaderStyle().nameClass}>{resume.content.personalInfo.fullName}</h1>
								<div class="flex flex-wrap gap-6 mb-4">
									{#if resume.content.personalInfo.email}
										<div class="flex items-center">
											<span class="mr-2">📧</span>
											<span class={getHeaderStyle().contactClass}>{resume.content.personalInfo.email}</span>
										</div>
									{/if}
									{#if resume.content.personalInfo.phone}
										<div class="flex items-center">
											<span class="mr-2">📞</span>
											<span class={getHeaderStyle().contactClass}>{resume.content.personalInfo.phone}</span>
										</div>
									{/if}
									{#if resume.content.personalInfo.location}
										<div class="flex items-center">
											<span class="mr-2">📍</span>
											<span class={getHeaderStyle().contactClass}>{resume.content.personalInfo.location}</span>
										</div>
									{/if}
								</div>
								{#if resume.content.personalInfo.linkedin || resume.content.personalInfo.website}
									<div class="flex flex-wrap gap-6">
										{#if resume.content.personalInfo.linkedin}
											<div class="flex items-center">
												<span class="mr-2">🔗</span>
												<a href="https://{resume.content.personalInfo.linkedin}" target="_blank" class={`hover:underline ${getHeaderStyle().contactClass}`}>
													LinkedIn
												</a>
											</div>
										{/if}
										{#if resume.content.personalInfo.website}
											<div class="flex items-center">
												<span class="mr-2">🌐</span>
												<a href="https://{resume.content.personalInfo.website}" target="_blank" class={`hover:underline ${getHeaderStyle().contactClass}`}>
													Website
												</a>
											</div>
										{/if}
									</div>
								{/if}
							</div>
						{/if}
						
						{#if previewSettings.layout === 'with-image' && resume.content?.personalInfo?.profileImage}
							<!-- Profile Image Column -->
							<div class="flex flex-col items-center">
								<img
									src={resume.content.personalInfo.profileImage}
									alt="Profile Image"
									class="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
								/>
								{#if resume.content.personalInfo.fullName}
									<h2 class="text-xl font-bold mt-4 text-center">{resume.content.personalInfo.fullName}</h2>
								{/if}
							</div>
						{/if}
						
						{#if resume.content?.summary}
							<!-- Summary -->
							<div class={getSectionSpacingClass()}>
								<h2 class={`text-2xl font-bold mb-4 pb-2 border-b-2 ${getColorClasses().primary}`}>📝 Professional Summary</h2>
								<p class={`text-gray-700 leading-relaxed ${getFontSizeClass()}`}>{resume.content.summary}</p>
							</div>
						{/if}
					</div>
					
					<!-- Right column for two-column layout -->
					<div>
						{#if resume.content?.experience && resume.content.experience.length > 0}
							<!-- Experience -->
							<div class={getSectionSpacingClass()}>
								<h2 class={`text-2xl font-bold mb-4 pb-2 border-b-2 ${getColorClasses().primary}`}>💼 Work Experience</h2>
								<div class="space-y-6">
									{#each resume.content.experience as exp}
										<div class="mb-4">
											<div class="flex justify-between items-start mb-1">
												<div>
													<h3 class="font-bold text-lg">{exp.position}</h3>
													<p class={getColorClasses().primary}>{exp.company}</p>
												</div>
												<div class="text-sm text-muted-foreground">
													{exp.startDate} - {exp.current ? 'Present' : exp.endDate}
												</div>
											</div>
											{#if exp.description}
												<p class={`text-gray-700 mt-2 ${getFontSizeClass()}`}>{exp.description}</p>
											{/if}
										</div>
									{/each}
								</div>
							</div>
						{/if}
						
						{#if resume.content?.education && resume.content.education.length > 0}
							<!-- Education -->
							<div class={getSectionSpacingClass()}>
								<h2 class={`text-2xl font-bold mb-4 pb-2 border-b-2 ${getColorClasses().primary}`}>🎓 Education</h2>
								<div class="space-y-4">
									{#each resume.content.education as edu}
										<div class="mb-4">
											<div class="flex justify-between items-start mb-1">
												<div>
													<h3 class="font-bold text-lg">{edu.degree}</h3>
													<p class={getColorClasses().primary}>{edu.institution}</p>
													{#if edu.field}
														<p class={`text-sm text-muted-foreground ${getFontSizeClass()}`}>{edu.field}</p>
													{/if}
												</div>
												<div class="text-sm text-muted-foreground">
													{edu.startDate} - {edu.current ? 'Present' : edu.endDate}
												</div>
											</div>
											{#if edu.gpa}
												<p class={`text-sm text-muted-foreground ${getFontSizeClass()}`}>GPA: {edu.gpa}</p>
											{/if}
										</div>
									{/each}
								</div>
							</div>
						{/if}
						
						{#if resume.content?.skills && resume.content.skills.length > 0}
							<!-- Skills -->
							<div class={getSectionSpacingClass()}>
								<h2 class={`text-2xl font-bold mb-4 pb-2 border-b-2 ${getColorClasses().primary}`}>🛠️ Skills</h2>
								<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
									{#each ['technical', 'soft', 'language'] as category}
										{#if resume.content.skills.filter(skill => skill.category === category).length > 0}
											<div>
												<h3 class="font-semibold mb-3 capitalize">{category} Skills</h3>
												<div class="flex flex-wrap gap-2">
													{#each resume.content.skills.filter(skill => skill.category === category) as skill}
														<span class={`px-3 py-1 ${getColorClasses().secondary} rounded-full text-sm`}>
															{skill.name}
														</span>
													{/each}
												</div>
											</div>
										{/if}
									{/each}
								</div>
							</div>
						{/if}
						
						{#if resume.content?.projects && resume.content.projects.length > 0}
							<!-- Projects -->
							<div class={getSectionSpacingClass()}>
								<h2 class={`text-2xl font-bold mb-4 pb-2 border-b-2 ${getColorClasses().primary}`}>🚀 Projects</h2>
								<div class="space-y-4">
									{#each resume.content.projects as project}
										<div class="mb-4">
											<h3 class="font-bold text-lg">{project.name}</h3>
											<p class={`text-gray-700 mt-1 ${getFontSizeClass()}`}>{project.description}</p>
											{#if project.technologies && project.technologies.trim()}
												<div class="flex flex-wrap gap-2 mt-2">
													{#each project.technologies.split(',').map(tech => tech.trim()).filter(tech => tech) as tech}
														<span class={`px-3 py-1 ${getColorClasses().secondary} rounded-full text-sm`}>
															{tech}
														</span>
													{/each}
												</div>
											{/if}
										</div>
									{/each}
								</div>
							</div>
						{/if}
				</div>
			</div>
			{/key}
		</div>
		</main>

		<!-- Footer -->
		<footer class="bg-white border-t py-6">
			<div class="container mx-auto px-4 text-center">
				<p class="text-muted-foreground">
					Created with ❤️ <a href="/" class={`hover:underline ${getColorClasses().primary}`}>Dashboard</a>
				</p>
			</div>
		</footer>
	</div>
{/if}

<!-- Styling Panel Modal -->
{#if showStylingPanel}
	<div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
		<div class="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
			<div class="p-6">
				<div class="flex items-center justify-between mb-6">
					<h2 class="text-xl font-bold">🎨 Style Your Resume</h2>
					<button
						class="text-gray-500 hover:text-gray-700"
						on:click={() => showStylingPanel = false}
					>
						✕
					</button>
				</div>
				
				<div class="space-y-6">
					<!-- Theme Presets Only -->
					<div>
						<h3 class="font-medium mb-3">🎯 Choose a Theme</h3>
						<div class="grid grid-cols-2 gap-3">
							{#each themePresets as preset}
								<button
									class="p-3 border rounded-lg text-center transition-all hover:bg-gray-50 relative overflow-hidden"
									on:click={() => applyThemePreset(preset)}
								>
									<!-- Color preview bars -->
									<div class="flex justify-center mb-2">
										{#if preset.settings.colorScheme === 'blue'}
											<div class="flex">
												<div class="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
												<div class="w-3 h-3 rounded-full bg-blue-700"></div>
											</div>
										{:else if preset.settings.colorScheme === 'green'}
											<div class="flex">
												<div class="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
												<div class="w-3 h-3 rounded-full bg-green-700"></div>
											</div>
										{:else if preset.settings.colorScheme === 'purple'}
											<div class="flex">
												<div class="w-3 h-3 rounded-full bg-purple-500 mr-1"></div>
												<div class="w-3 h-3 rounded-full bg-purple-700"></div>
											</div>
										{:else if preset.settings.colorScheme === 'black'}
											<div class="flex">
												<div class="w-3 h-3 rounded-full bg-gray-700 mr-1"></div>
												<div class="w-3 h-3 rounded-full bg-gray-900"></div>
											</div>
										{:else if preset.settings.colorScheme === 'orange'}
											<div class="flex">
												<div class="w-3 h-3 rounded-full bg-orange-500 mr-1"></div>
												<div class="w-3 h-3 rounded-full bg-orange-700"></div>
											</div>
										{/if}
									</div>
									<div class="font-medium text-sm mb-1">{preset.label}</div>
									<div class="text-xs text-gray-600">{preset.description}</div>
									<!-- Layout icon -->
									<div class="absolute top-2 right-2 text-xs">
										{#if preset.settings.layout === 'single-column'}
											📄
										{:else if preset.settings.layout === 'two-column'}
											📑
										{:else if preset.settings.layout === 'with-image'}
											🖼️
										{/if}
									</div>
								</button>
							{/each}
						</div>
					</div>
					
					<!-- Preview -->
					<div class="bg-gray-50 p-4 rounded-lg">
						<h4 class="font-medium mb-2">👀 Preview Settings</h4>
						<div class="text-sm space-y-1">
							<div>🎨 Color: <span class="capitalize">{previewSettings.colorScheme}</span></div>
							<div>🔤 Font Size: <span class="capitalize">{previewSettings.fontSize}</span></div>
							<div>📏 Spacing: <span class="capitalize">{previewSettings.spacing}</span></div>
							<div>📋 Layout: <span class="capitalize">{previewSettings.layout.replace('-', ' ')}</span></div>
						</div>
						<div class="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-700">
							💡 Emojis are always enabled for a fun, engaging resume!
						</div>
					</div>
					
					<!-- Premium Features -->
					{#if !isPremiumUser}
						<div class="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-orange-200">
							<h4 class="font-medium mb-2 text-orange-800">✨ Premium Features</h4>
							<div class="text-sm text-orange-700 mb-3">
								• Remove watermark<br>
								• Advanced themes<br>
								• Custom colors<br>
								• Priority support
							</div>
							<button
								class="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all font-semibold"
								on:click={() => showUpgradeModal = true}
							>
								🚀 Upgrade to Premium
							</button>
						</div>
					{/if}
				</div>
				
				<div class="flex justify-between mt-6">
					<button
						class="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
						on:click={resetToDefault}
					>
						🔄 Reset to Default
					</button>
					<button
						class="px-4 py-2 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700"
						on:click={() => showStylingPanel = false}
					>
						Close Preview
					</button>
				</div>
				
				<div class="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
					<p class="text-sm text-blue-700">
						💡 <strong>Preview your changes above</strong>, then click <strong>"Apply Changes"</strong> in the header to save them permanently.
					</p>
				</div>
			</div>
		</div>
	</div>
{/if}



<!-- Premium Upgrade Modal -->
{#if showUpgradeModal}
	<div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
		<div class="bg-white rounded-lg max-w-md w-full">
			<div class="p-6">
				<div class="flex items-center justify-between mb-6">
					<h2 class="text-xl font-bold">🚀 Upgrade to Premium</h2>
					<button
						class="text-gray-500 hover:text-gray-700"
						on:click={() => showUpgradeModal = false}
					>
						✕
					</button>
				</div>
				
				<div class="space-y-4">
					<div class="text-center">
						<div class="text-4xl mb-4">✨</div>
						<h3 class="text-lg font-semibold mb-2">Remove Watermark & Get More</h3>
						<p class="text-gray-600 mb-4">Unlock premium features for professional resumes</p>
					</div>
					
					<div class="bg-gray-50 p-4 rounded-lg">
						<h4 class="font-medium mb-2">Premium Features Include:</h4>
						<ul class="text-sm space-y-1 text-gray-700">
							<li>✅ Remove watermark completely</li>
							<li>✅ 10+ additional premium themes</li>
							<li>✅ Custom color schemes</li>
							<li>✅ Advanced layout options</li>
							<li>✅ Priority customer support</li>
							<li>✅ Export to multiple formats</li>
						</ul>
					</div>
					
					<div class="text-center">
						<div class="text-2xl font-bold text-orange-600 mb-2">$9.99/month</div>
						<div class="text-sm text-gray-500 mb-4">Cancel anytime</div>
					</div>
				</div>
				
				<div class="flex gap-3 mt-6">
					<button
						class="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
						on:click={() => showUpgradeModal = false}
					>
						Maybe Later
					</button>
					<button
						class="flex-1 px-4 py-2 text-sm bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 font-semibold"
						on:click={() => {
							// In a real app, this would redirect to payment processing
							alert(`$🚀 Redirecting to payment... (Demo only)`);
							showUpgradeModal = false;
						}}
					>
						🚀 Upgrade Now
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}


