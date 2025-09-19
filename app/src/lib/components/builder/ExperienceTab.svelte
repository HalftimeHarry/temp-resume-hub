<script lang="ts">
	import { builderData, addExperience, updateExperience, removeExperience, markStepComplete, markStepIncomplete, characterLimits } from '$lib/stores/resumeBuilder.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Trash2, Plus } from 'lucide-svelte';
	import { generateId } from '$lib/utils.js';

	$: experiences = $builderData.experience;
	$: isValid = experiences.length > 0 && experiences.every(exp => 
		exp.company.trim() !== '' && 
		exp.position.trim() !== '' && 
		exp.startDate.trim() !== '' &&
		exp.description.trim() !== ''
	);

	$: {
		if (isValid) {
			markStepComplete('experience');
		} else {
			markStepIncomplete('experience');
		}
	}

	function addNewExperience() {
		addExperience({
			company: '',
			position: '',
			location: '',
			startDate: '',
			endDate: '',
			current: false,
			description: '',
			highlights: []
		});
	}

	function handleExperienceUpdate(id: string, field: string, value: any) {
		updateExperience(id, { [field]: value });
	}

	function handleCurrentToggle(id: string, current: boolean) {
		updateExperience(id, { 
			current, 
			endDate: current ? '' : experiences.find(exp => exp.id === id)?.endDate || ''
		});
	}

	export let onNext: () => void;
	export let onPrevious: () => void;
</script>

<div class="space-y-6">
	<div class="flex justify-between items-center">
		<div>
			<h3 class="text-lg font-semibold">Work Experience</h3>
			<p class="text-sm text-muted-foreground">Include internships, part-time jobs, and volunteer work</p>
		</div>
		<Button variant="outline" size="sm" on:click={addNewExperience}>
			<Plus class="w-4 h-4 mr-2" />
			Add Experience
		</Button>
	</div>

	{#if experiences.length === 0}
		<div class="border-2 border-dashed border-muted rounded-lg p-8 text-center">
			<p class="text-muted-foreground mb-4">No work experience added yet</p>
			<Button on:click={addNewExperience}>Add Your First Experience</Button>
		</div>
	{:else}
		<div class="space-y-6">
			{#each experiences as experience (experience.id)}
				<div class="border rounded-lg p-4 space-y-4">
					<div class="flex justify-between items-start">
						<h4 class="font-medium">Experience {experiences.indexOf(experience) + 1}</h4>
						<Button 
							variant="ghost" 
							size="sm" 
							on:click={() => removeExperience(experience.id)}
							class="text-destructive hover:text-destructive"
						>
							<Trash2 class="w-4 h-4" />
						</Button>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div class="space-y-2">
							<label for="position-{experience.id}" class="text-sm font-medium">Job Title *</label>
							<Input
								id="position-{experience.id}"
								placeholder="Software Developer Intern"
								value={experience.position}
								on:input={(e) => handleExperienceUpdate(experience.id, 'position', e.target.value)}
								required
							/>
						</div>
						<div class="space-y-2">
							<label for="company-{experience.id}" class="text-sm font-medium">Company *</label>
							<Input
								id="company-{experience.id}"
								placeholder="Tech Company Inc."
								value={experience.company}
								on:input={(e) => handleExperienceUpdate(experience.id, 'company', e.target.value)}
								required
							/>
						</div>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div class="space-y-2">
							<label for="start-date-{experience.id}" class="text-sm font-medium">Start Date *</label>
							<Input
								id="start-date-{experience.id}"
								type="month"
								value={experience.startDate}
								on:input={(e) => handleExperienceUpdate(experience.id, 'startDate', e.target.value)}
								required
							/>
						</div>
						<div class="space-y-2">
							<label for="end-date-{experience.id}" class="text-sm font-medium">End Date</label>
							<Input
								id="end-date-{experience.id}"
								type="month"
								value={experience.endDate || ''}
								disabled={experience.current}
								on:input={(e) => handleExperienceUpdate(experience.id, 'endDate', e.target.value)}
							/>
						</div>
						<div class="flex items-end">
							<label class="flex items-center gap-2">
								<input 
									type="checkbox" 
									class="rounded"
									checked={experience.current}
									on:change={(e) => handleCurrentToggle(experience.id, e.target.checked)}
								/>
								<span class="text-sm">Currently working here</span>
							</label>
						</div>
					</div>

					<div class="space-y-2">
						<label for="description-{experience.id}" class="text-sm font-medium">
							Description * 
							<span class="text-muted-foreground">({characterLimits.experienceDescription} characters max)</span>
						</label>
						<Textarea
							id="description-{experience.id}"
							placeholder="Describe your key responsibilities and achievements..."
							value={experience.description}
							maxlength={characterLimits.experienceDescription}
							rows={3}
							on:input={(e) => handleExperienceUpdate(experience.id, 'description', e.target.value)}
							required
						/>
					</div>
				</div>
			{/each}
		</div>
	{/if}

	<div class="bg-muted p-4 rounded-lg">
		<h4 class="font-medium mb-2">💡 Experience Tips</h4>
		<ul class="text-sm text-muted-foreground space-y-1">
			<li>• Include internships, part-time jobs, and relevant volunteer work</li>
			<li>• Focus on achievements and impact, not just duties</li>
			<li>• Use action verbs (developed, managed, created, improved)</li>
			<li>• Quantify results when possible (increased sales by 20%)</li>
			<li>• Keep descriptions concise but informative</li>
		</ul>
	</div>

	<div class="flex justify-between">
		<Button variant="outline" on:click={onPrevious}>
			Previous
		</Button>
		<Button disabled={!isValid} on:click={onNext}>
			Next: Education
		</Button>
	</div>
</div>