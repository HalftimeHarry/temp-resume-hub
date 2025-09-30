<script lang="ts">
	import { builderData, addProject, updateProject, removeProject, markStepComplete, markStepIncomplete } from '$lib/stores/resumeBuilder.js';
	import { userProfile } from '$lib/stores/userProfile.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { Trash2, Plus, User, BookOpen, Heart, Code } from 'lucide-svelte';

	$: projects = $builderData.projects;
	$: profile = $userProfile;
	$: isFirstTimeJobSeeker = profile && ['student', 'entry'].includes(profile.experience_level);
	
	$: isValid = projects.length > 0 && projects.some(project =>
		project.name?.trim() !== '' &&
		project.description?.trim() !== ''
	);

	// Update step completion status based on validation
	$: {
		if (isValid) {
			markStepComplete('projects');
		} else {
			markStepIncomplete('projects');
		}
	}
	
	function addNewProject() {
		addProject({
			name: '',
			description: '',
			technologies: '',
			url: '',
			startDate: '',
			endDate: '',
			current: false
		});
	}

	function handleProjectUpdate(id: string, field: string, value: any) {
		updateProject(id, { [field]: value });
	}

	function handleCurrentToggle(id: string, current: boolean) {
		updateProject(id, { 
			current, 
			endDate: current ? '' : projects.find(p => p.id === id)?.endDate || ''
		});
	}

	// Auto-populate from profile for first-time job seekers
	function populateFromProfile() {
		if (!profile) return;
		
		// Add academic projects if available
		if (profile.academic_projects?.trim()) {
			addProject({
				name: 'Academic Project',
				description: profile.academic_projects,
				technologies: '',
				url: '',
				startDate: '',
				endDate: '',
				current: false
			});
		}
		
		// Add personal projects if available
		if (profile.personal_projects?.trim()) {
			addProject({
				name: 'Personal Project',
				description: profile.personal_projects,
				technologies: '',
				url: '',
				startDate: '',
				endDate: '',
				current: false
			});
		}
		
		// Add volunteer experience as a project if available
		if (profile.volunteer_experience?.trim()) {
			addProject({
				name: 'Volunteer Experience',
				description: profile.volunteer_experience,
				technologies: '',
				url: '',
				startDate: '',
				endDate: '',
				current: false
			});
		}
		
		// Add extracurricular activities if available
		if (profile.extracurricular_activities?.trim()) {
			addProject({
				name: 'Extracurricular Activities',
				description: profile.extracurricular_activities,
				technologies: '',
				url: '',
				startDate: '',
				endDate: '',
				current: false
			});
		}
	}

	// Check if profile data is available for import
	$: hasProfileData = profile && (
		profile.academic_projects?.trim() ||
		profile.personal_projects?.trim() ||
		profile.volunteer_experience?.trim() ||
		profile.extracurricular_activities?.trim()
	);
</script>

<div class="space-y-6">
	<!-- First-time job seeker help -->
	{#if isFirstTimeJobSeeker}
		<div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
			<div class="flex items-start gap-3">
				<BookOpen class="w-5 h-5 text-blue-600 mt-0.5" />
				<div>
					<h3 class="font-medium text-blue-900 mb-2">Projects & Activities for First-Time Job Seekers</h3>
					<p class="text-sm text-blue-800 mb-3">
						Showcase your academic projects, volunteer work, personal projects, and extracurricular activities. 
						These demonstrate your skills and initiative to potential employers.
					</p>
					{#if hasProfileData && projects.length === 0}
						<Button 
							variant="outline" 
							size="sm" 
							on:click={populateFromProfile}
							class="text-blue-700 border-blue-300 hover:bg-blue-100"
						>
							<User class="w-4 h-4 mr-2" />
							Import from Profile
						</Button>
					{/if}
				</div>
			</div>
		</div>
	{/if}

	<!-- Projects List -->
	{#if projects.length === 0}
		<div class="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
			<div class="flex flex-col items-center gap-3">
				{#if isFirstTimeJobSeeker}
					<div class="flex gap-2">
						<Code class="w-8 h-8 text-gray-400" />
						<Heart class="w-8 h-8 text-gray-400" />
						<BookOpen class="w-8 h-8 text-gray-400" />
					</div>
					<h3 class="text-lg font-medium text-gray-900">Add Your Projects & Activities</h3>
					<p class="text-gray-600 max-w-md">
						Include academic projects, personal coding projects, volunteer work, or extracurricular activities that showcase your skills.
					</p>
				{:else}
					<Code class="w-8 h-8 text-gray-400" />
					<h3 class="text-lg font-medium text-gray-900">Add Your Projects</h3>
					<p class="text-gray-600">
						Showcase your personal projects, open source contributions, or side projects.
					</p>
				{/if}
				<Button on:click={addNewProject} class="mt-2">
					<Plus class="w-4 h-4 mr-2" />
					Add {isFirstTimeJobSeeker ? 'Project/Activity' : 'Project'}
				</Button>
			</div>
		</div>
	{:else}
		{#each projects as project, index (project.id)}
			<div class="border border-gray-200 rounded-lg p-4 space-y-4">
				<div class="flex justify-between items-start">
					<h3 class="text-lg font-medium">
						{isFirstTimeJobSeeker ? 'Project/Activity' : 'Project'} {index + 1}
					</h3>
					<Button
						variant="ghost"
						size="sm"
						on:click={() => removeProject(project.id)}
						class="text-red-600 hover:text-red-700 hover:bg-red-50"
					>
						<Trash2 class="w-4 h-4" />
					</Button>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div class="space-y-2">
						<label for="name-{project.id}" class="text-sm font-medium">
							{isFirstTimeJobSeeker ? 'Project/Activity Name' : 'Project Name'} *
						</label>
						<Input
							id="name-{project.id}"
							placeholder={isFirstTimeJobSeeker ? "e.g., Student Government, Personal Website, Volunteer Tutoring" : "e.g., Personal Portfolio Website"}
							bind:value={project.name}
							on:input={(e) => handleProjectUpdate(project.id, 'name', e.target.value)}
						/>
					</div>

					<div class="space-y-2">
						<label for="technologies-{project.id}" class="text-sm font-medium">
							{isFirstTimeJobSeeker ? 'Skills/Technologies Used' : 'Technologies Used'}
						</label>
						<Input
							id="technologies-{project.id}"
							placeholder={isFirstTimeJobSeeker ? "e.g., Leadership, JavaScript, Communication, Python" : "e.g., React, Node.js, MongoDB"}
							bind:value={project.technologies}
							on:input={(e) => handleProjectUpdate(project.id, 'technologies', e.target.value)}
						/>
					</div>
				</div>

				<div class="space-y-2">
					<label for="description-{project.id}" class="text-sm font-medium">Description *</label>
					<Textarea
						id="description-{project.id}"
						placeholder={isFirstTimeJobSeeker ? 
							"Describe what you did, what you learned, and the impact you made. Focus on transferable skills and achievements." :
							"Describe the project, your role, and key achievements. What problem did it solve?"
						}
						bind:value={project.description}
						on:input={(e) => handleProjectUpdate(project.id, 'description', e.target.value)}
						rows="3"
					/>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div class="space-y-2">
						<label for="url-{project.id}" class="text-sm font-medium">
							{isFirstTimeJobSeeker ? 'Link/Portfolio (if applicable)' : 'Project URL'}
						</label>
						<Input
							id="url-{project.id}"
							type="url"
							placeholder="https://..."
							bind:value={project.url}
							on:input={(e) => handleProjectUpdate(project.id, 'url', e.target.value)}
						/>
					</div>

					<div class="space-y-2">
						<label for="startDate-{project.id}" class="text-sm font-medium">Start Date</label>
						<Input
							id="startDate-{project.id}"
							type="month"
							bind:value={project.startDate}
							on:input={(e) => handleProjectUpdate(project.id, 'startDate', e.target.value)}
						/>
					</div>

					<div class="space-y-2">
						<label for="endDate-{project.id}" class="text-sm font-medium">End Date</label>
						<div class="space-y-2">
							<Input
								id="endDate-{project.id}"
								type="month"
								bind:value={project.endDate}
								disabled={project.current}
								on:input={(e) => handleProjectUpdate(project.id, 'endDate', e.target.value)}
							/>
							<label class="flex items-center gap-2 text-sm">
								<input
									type="checkbox"
									bind:checked={project.current}
									on:change={(e) => handleCurrentToggle(project.id, e.target.checked)}
									class="rounded"
								/>
								Currently working on this
							</label>
						</div>
					</div>
				</div>
			</div>
		{/each}

		<div class="flex justify-center">
			<Button variant="outline" on:click={addNewProject}>
				<Plus class="w-4 h-4 mr-2" />
				Add Another {isFirstTimeJobSeeker ? 'Project/Activity' : 'Project'}
			</Button>
		</div>
	{/if}
</div>