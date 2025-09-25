<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { pb, resumes } from '$lib/pocketbase';
	import Logo from '$lib/components/ui/Logo.svelte';
	import type { Resume } from '$lib/types/resume.js';

	let resume: Resume | null = null;
	let loading = true;
	let error = '';
	
	// Styling state
	let showStylingPanel = false;
	let previewSettings = {
		colorScheme: 'orange',
		fontSize: 'medium',
		spacing: 'normal',
		layout: 'single-column'
	};

	// Theme presets
	const themePresets = [
		{
			name: 'professional',
			label: 'Professional',
			description: 'Clean and traditional layout',
			settings: {
				colorScheme: 'blue',
				fontSize: 'medium',
				spacing: 'normal',
				layout: 'single-column'
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
				layout: 'two-column'
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
				layout: 'single-column'
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
				layout: 'single-column'
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
				layout: 'two-column'
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
				layout: 'with-image'
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
	
	// Reactive dependencies for preview settings
	// Create a single reactive dependency on the entire previewSettings object
	$: previewSettingsDep = JSON.stringify(previewSettings);

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
					console.error('❌ Failed to load resume by slug or ID:', slugError, idError);
					error = '❌ Resume not found or not public';
				}
			}
		} catch (err) {
			console.error('❌ Failed to load resume:', err);
			error = '❌ Resume not found or not public';
		} finally {
			// Initialize preview settings with resume styling if available
			if (resume && resume.content?.styling) {
				previewSettings = {
					...previewSettings,
					colorScheme: resume.content.styling.colorScheme || 'orange',
					fontSize: resume.content.styling.fontSize || 'medium',
					spacing: resume.content.styling.spacing || 'normal',
					layout: resume.content.styling.layout || 'single-column'
				};
			}
			loading = false;
		}
	});

	function downloadPDF(): void {
		// TODO: Implement PDF generation
		alert('📄 PDF download will be implemented soon! 🚀');
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
	
	async function saveStyling(): Promise<void> {
		showStylingPanel = false;
		// Save styling settings to server
		console.log('Saving styling settings to server:', previewSettings);
		
		try {
			const updatedContent = {
				...resume.content,
				styling: { ...previewSettings }
			};
			
			console.log('Sending updated content to server:', updatedContent);
			
			const result = await resumes.updateResume(resume.id, { content: updatedContent });
			console.log('Server response:', result);
			
			if (result.success) {
				resume = result.resume;
				// Update previewSettings to match the saved styling
				if (resume.content?.styling) {
					previewSettings = { ...resume.content.styling };
				}
				console.log('Styling saved successfully. Updated previewSettings:', previewSettings);
				
				// Refresh the page to ensure styling is properly applied
				window.location.reload();
			} else {
				console.error(`❌ Failed to save styling: ${result.error}`);
			}
		} catch (error) {
			console.error('Error saving styling:', error);
		}
	}
	
	function resetToDefault(): void {
		previewSettings = {
			colorScheme: 'orange',
			fontSize: 'medium',
			spacing: 'normal',
			layout: 'single-column'
		};
		// No alert needed - styling is applied immediately to preview
	}
	
	async function applyThemePreset(preset: typeof themePresets[0]) {
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
		<header class="bg-white border-b">
			<div class="container mx-auto px-4 py-4">
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-3">
						<a href="/" class={`flex items-center gap-2 hover:underline ${getColorClasses().primary}`}>
							<Logo size="sm" showText={false} />
							← Dashboard
						</a>
					</div>
					<div class="flex items-center gap-2">
						<button
							class="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-secondary/90 transition-colors"
							on:click={() => showStylingPanel = true}
						>
							🎨 Style Resume
						</button>
						<button
							class="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
							on:click={downloadPDF}
						>
							📄 Download PDF
						</button>
					</div>
				</div>
			</div>
		</header>

		<!-- Resume Content -->
		<main class="container mx-auto px-4 py-8">
			<div class="max-w-4xl mx-auto">
				<div class={`bg-white rounded-lg shadow-lg p-8 md:p-12 ${getSpacingClass()} ${getLayoutClass()}`}>
					<!-- Left column for two-column layout -->
					<div class={previewSettings.layout === 'two-column' ? 'md:pr-8 md:border-r md:border-gray-200' : ''}>
						{#if resume.content?.personalInfo}
							<!-- Personal Info -->
							<div class={getSectionSpacingClass()}>
								<h1 class={`text-4xl font-bold mb-2 ${getColorClasses().primary} ${getFontSizeClass()}`}>{resume.content.personalInfo.fullName}</h1>
								<div class="flex flex-wrap gap-6 mb-2">
									{#if resume.content.personalInfo.email}
										<div class="flex items-center">
											<span class="mr-2">📧</span>
											<span class="text-gray-700">{resume.content.personalInfo.email}</span>
										</div>
									{/if}
									{#if resume.content.personalInfo.phone}
										<div class="flex items-center">
											<span class="mr-2">📞</span>
											<span class="text-gray-700">{resume.content.personalInfo.phone}</span>
										</div>
									{/if}
									{#if resume.content.personalInfo.location}
										<div class="flex items-center">
											<span class="mr-2">📍</span>
											<span class="text-gray-700">{resume.content.personalInfo.location}</span>
										</div>
									{/if}
								</div>
								{#if resume.content.personalInfo.linkedin || resume.content.personalInfo.website}
									<div class="flex flex-wrap gap-6">
										{#if resume.content.personalInfo.linkedin}
											<div class="flex items-center">
												<span class="mr-2">🔗</span>
												<a href="https://{resume.content.personalInfo.linkedin}" target="_blank" class={`hover:underline ${getColorClasses().primary}`}>
													LinkedIn
												</a>
											</div>
										{/if}
										{#if resume.content.personalInfo.website}
											<div class="flex items-center">
												<span class="mr-2">🌐</span>
												<a href="https://{resume.content.personalInfo.website}" target="_blank" class={`hover:underline ${getColorClasses().primary}`}>
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
								<h2 class={`text-2xl font-bold mb-4 pb-2 border-b-2 ${getColorClasses().primary}`}>Professional Summary</h2>
								<p class={`text-gray-700 leading-relaxed ${getFontSizeClass()}`}>{resume.content.summary}</p>
							</div>
						{/if}
					</div>
					
					<!-- Right column for two-column layout -->
					<div>
						{#if resume.content?.experience && resume.content.experience.length > 0}
							<!-- Experience -->
							<div class={getSectionSpacingClass()}>
								<h2 class={`text-2xl font-bold mb-4 pb-2 border-b-2 ${getColorClasses().primary}`}>Work Experience</h2>
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
								<h2 class={`text-2xl font-bold mb-4 pb-2 border-b-2 ${getColorClasses().primary}`}>Education</h2>
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
								<h2 class={`text-2xl font-bold mb-4 pb-2 border-b-2 ${getColorClasses().primary}`}>Skills</h2>
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
								<h2 class={`text-2xl font-bold mb-4 pb-2 border-b-2 ${getColorClasses().primary}`}>Projects</h2>
								<div class="space-y-4">
									{#each resume.content.projects as project}
										<div class="mb-4">
											<h3 class="font-bold text-lg">{project.name}</h3>
											<p class={`text-gray-700 mt-1 ${getFontSizeClass()}`}>{project.description}</p>
											{#if project.technologies && project.technologies.length > 0}
												<div class="flex flex-wrap gap-2 mt-2">
													{#each project.technologies as tech}
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
					</div>
				</div>
				
				<div class="flex justify-between mt-6">
					<button
						class="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
						on:click={resetToDefault}
					>
						🔄 Reset to Default
					</button>
					<button
						class="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
						on:click={saveStyling}
					>
						🎨 Set Theme
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}
