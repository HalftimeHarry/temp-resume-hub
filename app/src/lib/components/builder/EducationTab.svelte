<script lang="ts">
	import { builderData, addEducation, updateEducation, removeEducation, markStepComplete, markStepIncomplete } from '$lib/stores/resumeBuilder.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Trash2, Plus } from 'lucide-svelte';

	$: education = $builderData.education;
	$: isValid = education.length > 0 && education.every(edu => 
		edu.institution.trim() !== '' && 
		edu.degree.trim() !== '' && 
		edu.field?.trim() !== '' &&
		edu.startDate.trim() !== ''
	);

	$: {
		if (isValid) {
			markStepComplete('education');
		} else {
			markStepIncomplete('education');
		}
	}

	function addNewEducation() {
		addEducation({
			institution: '',
			degree: '',
			field: '',
			location: '',
			startDate: '',
			endDate: '',
			current: false,
			gpa: '',
			honors: [],
			description: ''
		});
	}

	function handleEducationUpdate(id: string, field: string, value: any) {
		updateEducation(id, { [field]: value });
	}

	function handleCurrentToggle(id: string, current: boolean) {
		updateEducation(id, { 
			current, 
			endDate: current ? '' : education.find(edu => edu.id === id)?.endDate || ''
		});
	}

	export let onNext: () => void;
	export let onPrevious: () => void;
</script>

<div class="space-y-6">
	<div class="flex justify-between items-center">
		<div>
			<h3 class="text-lg font-semibold">Education</h3>
			<p class="text-sm text-muted-foreground">Add your educational background and qualifications</p>
		</div>
		<Button variant="outline" size="sm" on:click={addNewEducation}>
			<Plus class="w-4 h-4 mr-2" />
			Add Education
		</Button>
	</div>

	{#if education.length === 0}
		<div class="border-2 border-dashed border-muted rounded-lg p-8 text-center">
			<p class="text-muted-foreground mb-4">No education added yet</p>
			<Button on:click={addNewEducation}>Add Your Education</Button>
		</div>
	{:else}
		<div class="space-y-6">
			{#each education as edu (edu.id)}
				<div class="border rounded-lg p-4 space-y-4">
					<div class="flex justify-between items-start">
						<h4 class="font-medium">Education {education.indexOf(edu) + 1}</h4>
						<Button 
							variant="ghost" 
							size="sm" 
							on:click={() => removeEducation(edu.id)}
							class="text-destructive hover:text-destructive"
						>
							<Trash2 class="w-4 h-4" />
						</Button>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div class="space-y-2">
							<label for="institution-{edu.id}" class="text-sm font-medium">School/University *</label>
							<Input
								id="institution-{edu.id}"
								placeholder="University of Technology"
								value={edu.institution}
								on:input={(e) => handleEducationUpdate(edu.id, 'institution', e.target.value)}
								required
							/>
						</div>
						<div class="space-y-2">
							<label for="degree-{edu.id}" class="text-sm font-medium">Degree *</label>
							<Input
								id="degree-{edu.id}"
								placeholder="Bachelor of Science"
								value={edu.degree}
								on:input={(e) => handleEducationUpdate(edu.id, 'degree', e.target.value)}
								required
							/>
						</div>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div class="space-y-2">
							<label for="field-{edu.id}" class="text-sm font-medium">Field of Study *</label>
							<Input
								id="field-{edu.id}"
								placeholder="Computer Science"
								value={edu.field || ''}
								on:input={(e) => handleEducationUpdate(edu.id, 'field', e.target.value)}
								required
							/>
						</div>
						<div class="space-y-2">
							<label for="location-{edu.id}" class="text-sm font-medium">Location</label>
							<Input
								id="location-{edu.id}"
								placeholder="City, State"
								value={edu.location || ''}
								on:input={(e) => handleEducationUpdate(edu.id, 'location', e.target.value)}
							/>
						</div>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div class="space-y-2">
							<label for="start-date-{edu.id}" class="text-sm font-medium">Start Date *</label>
							<Input
								id="start-date-{edu.id}"
								type="month"
								value={edu.startDate}
								on:input={(e) => handleEducationUpdate(edu.id, 'startDate', e.target.value)}
								required
							/>
						</div>
						<div class="space-y-2">
							<label for="end-date-{edu.id}" class="text-sm font-medium">End Date</label>
							<Input
								id="end-date-{edu.id}"
								type="month"
								value={edu.endDate || ''}
								disabled={edu.current}
								on:input={(e) => handleEducationUpdate(edu.id, 'endDate', e.target.value)}
							/>
						</div>
						<div class="flex items-end">
							<label class="flex items-center gap-2">
								<input 
									type="checkbox" 
									class="rounded"
									checked={edu.current}
									on:change={(e) => handleCurrentToggle(edu.id, e.target.checked)}
								/>
								<span class="text-sm">Currently enrolled</span>
							</label>
						</div>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div class="space-y-2">
							<label for="gpa-{edu.id}" class="text-sm font-medium">GPA (Optional)</label>
							<Input
								id="gpa-{edu.id}"
								placeholder="3.8/4.0"
								value={edu.gpa || ''}
								on:input={(e) => handleEducationUpdate(edu.id, 'gpa', e.target.value)}
							/>
						</div>
						<div class="space-y-2">
							<label for="honors-{edu.id}" class="text-sm font-medium">Honors (Optional)</label>
							<Input
								id="honors-{edu.id}"
								placeholder="Magna Cum Laude, Dean's List"
								value={edu.honors?.join(', ') || ''}
								on:input={(e) => handleEducationUpdate(edu.id, 'honors', e.target.value.split(',').map(h => h.trim()).filter(h => h))}
							/>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}

	<div class="bg-muted p-4 rounded-lg">
		<h4 class="font-medium mb-2">💡 Education Tips</h4>
		<ul class="text-sm text-muted-foreground space-y-1">
			<li>• List your most recent education first</li>
			<li>• Include relevant coursework if you're a recent graduate</li>
			<li>• Only include GPA if it's 3.5 or higher</li>
			<li>• Mention honors, awards, or relevant activities</li>
			<li>• For high school, only include if you don't have college education</li>
		</ul>
	</div>

	<div class="flex justify-between">
		<Button variant="outline" on:click={onPrevious}>
			Previous
		</Button>
		<Button disabled={!isValid} on:click={onNext}>
			Next: Skills
		</Button>
	</div>
</div>