<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { pb } from '$lib/pocketbase';
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
			loading = false;
		}
	});

	function downloadPDF() {
		// TODO: Implement PDF generation
		alert('📄 PDF download will be implemented soon! 🚀');
	}
	
	function updatePreviewSettings(setting: string, value: string) {
		previewSettings = { ...previewSettings, [setting]: value };
	}
	
	function applyStyling() {
		showStylingPanel = false;
		// In a real implementation, this would update the resume with the new styling
		alert(`✅ Styling applied: ${previewSettings.colorScheme} theme, ${previewSettings.fontSize} font, ${previewSettings.spacing} spacing, ${previewSettings.layout} layout 🎨`);
	}
	
	function resetToDefault() {
		previewSettings = {
			colorScheme: 'orange',
			fontSize: 'medium',
			spacing: 'normal',
			layout: 'single-column'
		};
		alert('🔄 Settings reset to default values! 🎨');
	}
	
	function getFontSizeClass() {
		switch (previewSettings.fontSize) {
			case 'small': return 'text-sm';
			case 'large': return 'text-lg';
			default: return 'text-base';
		}
	}
	
	function getSpacingClass() {
		switch (previewSettings.spacing) {
			case 'compact': return 'space-y-4';
			case 'relaxed': return 'space-y-10';
			default: return 'space-y-6';
		}
	}
	
	function getSectionSpacingClass() {
		switch (previewSettings.spacing) {
			case 'compact': return 'mb-4';
			case 'relaxed': return 'mb-10';
			default: return 'mb-6';
		}
	}
	
	function getColorClasses() {
		const colors = {
			blue: { primary: 'text-blue-600', secondary: 'bg-blue-100 text-blue-800' },
			green: { primary: 'text-green-600', secondary: 'bg-green-100 text-green-800' },
			purple: { primary: 'text-purple-600', secondary: 'bg-purple-100 text-purple-800' },
			black: { primary: 'text-gray-800', secondary: 'bg-gray-100 text-gray-800' },
			orange: { primary: 'text-orange-600', secondary: 'bg-orange-100 text-orange-800' }
		};
		return colors[previewSettings.colorScheme] || colors.blue;
	}
	
	function getLayoutClass() {
		switch (previewSettings.layout) {
			case 'two-column':
				return 'grid grid-cols-1 md:grid-cols-2 gap-8';
			case 'with-image':
				return 'grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8';
			default:
				return '';
		}
	}
</script>

<svelte:head>
	{#if resume}
		<title>📄 {resume.title} - Digital Resume Hub</title>
		<meta name="description" content="📄 Professional resume created with Digital Resume Hub" />
	{:else}
		<title>📄 Resume - Digital Resume Hub</title>
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
						<a href="/" class="text-primary hover:underline">← 🏠 Digital Resume Hub</a>
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
												<a href="https://{resume.content.personalInfo.linkedin}" target="_blank" class="text-primary hover:underline">
													LinkedIn
												</a>
											</div>
										{/if}
										{#if resume.content.personalInfo.website}
											<div class="flex items-center">
												<span class="mr-2">🌐</span>
												<a href="https://{resume.content.personalInfo.website}" target="_blank" class="text-primary hover:underline">
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
					Created with ❤️ <a href="/" class="text-primary hover:underline">Digital Resume Hub</a>
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
						❌
					</button>
				</div>
				
				<div class="space-y-6">
					<!-- Color Scheme -->
					<div>
						<h3 class="font-medium mb-3">🎨 Color Scheme</h3>
						<div class="grid grid-cols-2 gap-3">
							{#each colorSchemes as scheme}
								<button
									class="p-3 border rounded-lg text-center transition-all {previewSettings.colorScheme === scheme.name ? 'border-orange-600 ring-2 ring-orange-600/20' : 'border-gray-200'}"
									on:click={() => updatePreviewSettings('colorScheme', scheme.name)}
								>
									<div class="flex items-center justify-center gap-2 mb-2">
										<div class="w-4 h-4 rounded-full" style="background-color: {scheme.primary}"></div>
										<div class="w-4 h-4 rounded-full" style="background-color: {scheme.secondary}"></div>
									</div>
									<div class="text-sm">{scheme.label}</div>
								</button>
							{/each}
						</div>
					</div>
					
					<!-- Font Size -->
					<div>
						<h3 class="font-medium mb-3">🔤 Font Size</h3>
						<div class="grid grid-cols-3 gap-2">
							{#each fontSizes as size}
								<button
									class="p-2 border rounded-lg text-center transition-all {previewSettings.fontSize === size.name ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200'}"
									on:click={() => updatePreviewSettings('fontSize', size.name)}
								>
									<div class="text-sm">{size.label}</div>
								</button>
							{/each}
						</div>
					</div>
					
					<!-- Spacing -->
					<div>
						<h3 class="font-medium mb-3">📏 Spacing</h3>
						<div class="grid grid-cols-3 gap-2">
							{#each spacingOptions as spacing}
								<button
									class="p-2 border rounded-lg text-center transition-all {previewSettings.spacing === spacing.name ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200'}"
									on:click={() => updatePreviewSettings('spacing', spacing.name)}
								>
									<div class="text-sm">{spacing.label}</div>
								</button>
							{/each}
						</div>
					</div>
					
					<!-- Layout -->
					<div>
						<h3 class="font-medium mb-3">📋 Layout</h3>
						<div class="grid grid-cols-1 gap-2">
							{#each layoutOptions as layout}
								<button
									class="p-3 border rounded-lg text-left transition-all flex items-center gap-2 {previewSettings.layout === layout.name ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200'}"
									on:click={() => updatePreviewSettings('layout', layout.name)}
								>
									<span class="text-lg">{layout.icon}</span>
									<span>{layout.label}</span>
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
					<div class="flex gap-2">
						<button
							class="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
							on:click={() => showStylingPanel = false}
						>
							❌ Cancel
						</button>
						<button
							class="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
							on:click={applyStyling}
						>
							✅ Apply Style
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
