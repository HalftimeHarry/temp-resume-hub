<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { pb } from '$lib/pocketbase';
	import type { Resume } from '$lib/types/resume.js';

	let resume: Resume | null = null;
	let loading = true;
	let error = '';

	$: slug = $page.params.slug;

	onMount(async () => {
		try {
			const record = await pb.collection('resumes').getFirstListItem(`slug="${slug}" && is_public=true`, {
				expand: 'user'
			});
			
			resume = record as Resume;
		} catch (err) {
			console.error('Failed to load resume:', err);
			error = 'Resume not found or not public';
		} finally {
			loading = false;
		}
	});

	function downloadPDF() {
		// TODO: Implement PDF generation
		alert('PDF download will be implemented soon!');
	}
</script>

<svelte:head>
	{#if resume}
		<title>{resume.title} - Digital Resume Hub</title>
		<meta name="description" content="Professional resume created with Digital Resume Hub" />
	{:else}
		<title>Resume - Digital Resume Hub</title>
	{/if}
</svelte:head>

{#if loading}
	<div class="min-h-screen flex items-center justify-center">
		<div class="text-center">
			<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
			<p class="text-muted-foreground">Loading resume...</p>
		</div>
	</div>
{:else if error}
	<div class="min-h-screen flex items-center justify-center">
		<div class="text-center">
			<h1 class="text-2xl font-bold mb-4">Resume Not Found</h1>
			<p class="text-muted-foreground mb-6">{error}</p>
			<a href="/" class="text-primary hover:underline">← Back to Home</a>
		</div>
	</div>
{:else if resume}
	<div class="min-h-screen bg-gray-50">
		<!-- Header -->
		<header class="bg-white border-b">
			<div class="container mx-auto px-4 py-4">
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-3">
						<a href="/" class="text-primary hover:underline">← Digital Resume Hub</a>
					</div>
					<div class="flex items-center gap-2">
						<button 
							class="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
							on:click={downloadPDF}
						>
							Download PDF
						</button>
					</div>
				</div>
			</div>
		</header>

		<!-- Resume Content -->
		<main class="container mx-auto px-4 py-8">
			<div class="max-w-4xl mx-auto">
				<div class="bg-white rounded-lg shadow-lg p-8">
					{#if resume.content?.personalInfo}
						<!-- Personal Info -->
						<div class="mb-8">
							<h1 class="text-3xl font-bold mb-2">{resume.content.personalInfo.fullName}</h1>
							<div class="flex flex-wrap gap-4 text-muted-foreground">
								{#if resume.content.personalInfo.email}
									<span>{resume.content.personalInfo.email}</span>
								{/if}
								{#if resume.content.personalInfo.phone}
									<span>{resume.content.personalInfo.phone}</span>
								{/if}
								{#if resume.content.personalInfo.location}
									<span>{resume.content.personalInfo.location}</span>
								{/if}
							</div>
							{#if resume.content.personalInfo.linkedin || resume.content.personalInfo.website}
								<div class="flex flex-wrap gap-4 mt-2">
									{#if resume.content.personalInfo.linkedin}
										<a href="https://{resume.content.personalInfo.linkedin}" target="_blank" class="text-primary hover:underline">
											LinkedIn
										</a>
									{/if}
									{#if resume.content.personalInfo.website}
										<a href="https://{resume.content.personalInfo.website}" target="_blank" class="text-primary hover:underline">
											Website
										</a>
									{/if}
								</div>
							{/if}
						</div>
					{/if}

					{#if resume.content?.summary}
						<!-- Summary -->
						<div class="mb-8">
							<h2 class="text-xl font-bold mb-3">Professional Summary</h2>
							<p class="text-gray-700">{resume.content.summary}</p>
						</div>
					{/if}

					{#if resume.content?.experience && resume.content.experience.length > 0}
						<!-- Experience -->
						<div class="mb-8">
							<h2 class="text-xl font-bold mb-4">Work Experience</h2>
							<div class="space-y-6">
								{#each resume.content.experience as exp}
									<div>
										<div class="flex justify-between items-start mb-2">
											<div>
												<h3 class="font-semibold">{exp.position}</h3>
												<p class="text-primary">{exp.company}</p>
											</div>
											<div class="text-sm text-muted-foreground">
												{exp.startDate} - {exp.current ? 'Present' : exp.endDate}
											</div>
										</div>
										{#if exp.description}
											<p class="text-gray-700">{exp.description}</p>
										{/if}
									</div>
								{/each}
							</div>
						</div>
					{/if}

					{#if resume.content?.education && resume.content.education.length > 0}
						<!-- Education -->
						<div class="mb-8">
							<h2 class="text-xl font-bold mb-4">Education</h2>
							<div class="space-y-4">
								{#each resume.content.education as edu}
									<div>
										<div class="flex justify-between items-start mb-1">
											<div>
												<h3 class="font-semibold">{edu.degree}</h3>
												<p class="text-primary">{edu.institution}</p>
												{#if edu.field}
													<p class="text-sm text-muted-foreground">{edu.field}</p>
												{/if}
											</div>
											<div class="text-sm text-muted-foreground">
												{edu.startDate} - {edu.current ? 'Present' : edu.endDate}
											</div>
										</div>
										{#if edu.gpa}
											<p class="text-sm text-muted-foreground">GPA: {edu.gpa}</p>
										{/if}
									</div>
								{/each}
							</div>
						</div>
					{/if}

					{#if resume.content?.skills && resume.content.skills.length > 0}
						<!-- Skills -->
						<div class="mb-8">
							<h2 class="text-xl font-bold mb-4">Skills</h2>
							<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
								{#each ['technical', 'soft', 'language'] as category}
									{@const categorySkills = resume.content.skills.filter(skill => skill.category === category)}
									{#if categorySkills.length > 0}
										<div>
											<h3 class="font-semibold mb-2 capitalize">{category} Skills</h3>
											<div class="flex flex-wrap gap-2">
												{#each categorySkills as skill}
													<span class="px-2 py-1 bg-muted text-muted-foreground rounded text-sm">
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
						<div class="mb-8">
							<h2 class="text-xl font-bold mb-4">Projects</h2>
							<div class="space-y-4">
								{#each resume.content.projects as project}
									<div>
										<h3 class="font-semibold">{project.name}</h3>
										<p class="text-gray-700 mb-2">{project.description}</p>
										{#if project.technologies && project.technologies.length > 0}
											<div class="flex flex-wrap gap-2">
												{#each project.technologies as tech}
													<span class="px-2 py-1 bg-primary/10 text-primary rounded text-sm">
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
		</main>

		<!-- Footer -->
		<footer class="bg-white border-t py-6">
			<div class="container mx-auto px-4 text-center">
				<p class="text-muted-foreground">
					Created with <a href="/" class="text-primary hover:underline">Digital Resume Hub</a>
				</p>
			</div>
		</footer>
	</div>
{/if}