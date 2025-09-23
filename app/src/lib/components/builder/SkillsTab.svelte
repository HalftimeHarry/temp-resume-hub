<script lang="ts">
	import { builderData, addSkill, removeSkill, markStepComplete, markStepIncomplete, characterLimits } from '$lib/stores/resumeBuilder.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { X } from 'lucide-svelte';

	$: skills = $builderData.skills;
	$: technicalSkills = skills.filter(skill => skill.category === 'technical');
	$: softSkills = skills.filter(skill => skill.category === 'soft');
	$: languageSkills = skills.filter(skill => skill.category === 'language');
	
	$: isValid = skills.length >= 3; // Minimum 3 skills required

	$: {
		if (isValid) {
			markStepComplete('skills');
		} else {
			markStepIncomplete('skills');
		}
	}

	let newTechnicalSkill = '';
	let newSoftSkill = '';
	let newLanguageSkill = '';

	function addTechnicalSkill() {
		if (newTechnicalSkill.trim() && newTechnicalSkill.length <= characterLimits.skillName) {
			addSkill({
				name: newTechnicalSkill.trim(),
				category: 'technical',
				level: 'intermediate'
			});
			newTechnicalSkill = '';
		}
	}

	function addSoftSkillHandler() {
		if (newSoftSkill.trim() && newSoftSkill.length <= characterLimits.skillName) {
			addSkill({
				name: newSoftSkill.trim(),
				category: 'soft',
				level: 'intermediate'
			});
			newSoftSkill = '';
		}
	}

	function addLanguageSkillHandler() {
		if (newLanguageSkill.trim() && newLanguageSkill.length <= characterLimits.skillName) {
			addSkill({
				name: newLanguageSkill.trim(),
				category: 'language',
				level: 'intermediate'
			});
			newLanguageSkill = '';
		}
	}

	function handleKeyPress(event: KeyboardEvent, handler: () => void) {
		if (event.key === 'Enter') {
			event.preventDefault();
			handler();
		}
	}

	// Predefined skill suggestions
	const technicalSuggestions = [
		'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'HTML/CSS', 'SQL', 'Git',
		'Microsoft Office', 'Excel', 'PowerPoint', 'Photoshop', 'WordPress', 'Google Analytics'
	];

	const softSuggestions = [
		'Communication', 'Teamwork', 'Problem Solving', 'Leadership', 'Time Management',
		'Critical Thinking', 'Adaptability', 'Customer Service', 'Project Management', 'Creativity'
	];

	const languageSuggestions = [
		'Spanish', 'French', 'German', 'Mandarin', 'Japanese', 'Portuguese', 'Italian', 'Arabic'
	];

	export let onNext: () => void;
</script>

<div class="space-y-6">
	<div>
		<h3 class="text-lg font-semibold">Skills</h3>
		<p class="text-sm text-muted-foreground">Add your technical skills, soft skills, and languages (minimum 3 skills required)</p>
	</div>

	<!-- Technical Skills -->
	<div class="space-y-4">
		<h4 class="font-medium">Technical Skills</h4>
		<div class="space-y-2">
			<div class="flex gap-2">
				<Input
					placeholder="e.g., JavaScript, Python, React"
					bind:value={newTechnicalSkill}
					maxlength={characterLimits.skillName}
					on:keypress={(e) => handleKeyPress(e, addTechnicalSkill)}
					class="flex-1"
				/>
				<Button 
					variant="outline" 
					on:click={addTechnicalSkill}
					disabled={!newTechnicalSkill.trim()}
				>
					Add
				</Button>
			</div>
			
			{#if technicalSkills.length > 0}
				<div class="flex flex-wrap gap-2">
					{#each technicalSkills as skill (skill.id)}
						<Badge variant="default" class="flex items-center gap-1">
													{skill.name}
													<button
														on:click={() => removeSkill(skill.id)}
														class="ml-1 hover:text-destructive"
													>
														<X class="w-3 h-3" />
													</button>
												</Badge>
					{/each}
				</div>
			{/if}

			<div class="text-xs text-muted-foreground">
				<span class="font-medium">Suggestions:</span>
				{#each technicalSuggestions.slice(0, 6) as suggestion}
					<button 
						class="ml-2 text-primary hover:underline"
						on:click={() => {
							if (!technicalSkills.find(s => s.name === suggestion)) {
								addSkill({ name: suggestion, category: 'technical', level: 'intermediate' });
							}
						}}
					>
						{suggestion}
					</button>
				{/each}
			</div>
		</div>
	</div>

	<!-- Soft Skills -->
	<div class="space-y-4">
		<h4 class="font-medium">Soft Skills</h4>
		<div class="space-y-2">
			<div class="flex gap-2">
				<Input
					placeholder="e.g., Communication, Teamwork"
					bind:value={newSoftSkill}
					maxlength={characterLimits.skillName}
					on:keypress={(e) => handleKeyPress(e, addSoftSkillHandler)}
					class="flex-1"
				/>
				<Button 
					variant="outline" 
					on:click={addSoftSkillHandler}
					disabled={!newSoftSkill.trim()}
				>
					Add
				</Button>
			</div>
			
			{#if softSkills.length > 0}
				<div class="flex flex-wrap gap-2">
					{#each softSkills as skill (skill.id)}
						<Badge variant="default" class="flex items-center gap-1">
													{skill.name}
													<button
														on:click={() => removeSkill(skill.id)}
														class="ml-1 hover:text-destructive"
													>
														<X class="w-3 h-3" />
													</button>
												</Badge>
					{/each}
				</div>
			{/if}

			<div class="text-xs text-muted-foreground">
				<span class="font-medium">Suggestions:</span>
				{#each softSuggestions.slice(0, 6) as suggestion}
					<button 
						class="ml-2 text-primary hover:underline"
						on:click={() => {
							if (!softSkills.find(s => s.name === suggestion)) {
								addSkill({ name: suggestion, category: 'soft', level: 'intermediate' });
							}
						}}
					>
						{suggestion}
					</button>
				{/each}
			</div>
		</div>
	</div>

	<!-- Languages -->
	<div class="space-y-4">
		<h4 class="font-medium">Languages</h4>
		<div class="space-y-2">
			<div class="flex gap-2">
				<Input
					placeholder="e.g., Spanish, French"
					bind:value={newLanguageSkill}
					maxlength={characterLimits.skillName}
					on:keypress={(e) => handleKeyPress(e, addLanguageSkillHandler)}
					class="flex-1"
				/>
				<Button 
					variant="outline" 
					on:click={addLanguageSkillHandler}
					disabled={!newLanguageSkill.trim()}
				>
					Add
				</Button>
			</div>
			
			{#if languageSkills.length > 0}
				<div class="flex flex-wrap gap-2">
					{#each languageSkills as skill (skill.id)}
						<Badge variant="default" class="flex items-center gap-1">
							{skill.name}
							<button 
								on:click={() => removeSkill(skill.id)}
								class="ml-1 hover:text-destructive"
							>
								<X class="w-3 h-3" />
							</button>
						</Badge>
					{/each}
				</div>
			{/if}

			<div class="text-xs text-muted-foreground">
				<span class="font-medium">Suggestions:</span>
				{#each languageSuggestions.slice(0, 4) as suggestion}
					<button 
						class="ml-2 text-primary hover:underline"
						on:click={() => {
							if (!languageSkills.find(s => s.name === suggestion)) {
								addSkill({ name: suggestion, category: 'language', level: 'intermediate' });
							}
						}}
					>
						{suggestion}
					</button>
				{/each}
			</div>
		</div>
	</div>

	<div class="bg-muted p-4 rounded-lg">
		<h4 class="font-medium mb-2">💡 Skill Tips</h4>
		<ul class="text-sm text-muted-foreground space-y-1">
			<li>• Focus on skills relevant to your target job</li>
			<li>• Include both technical and soft skills</li>
			<li>• Be honest about your skill level</li>
			<li>• Use industry-standard terminology</li>
			<li>• Add at least 3-5 skills for a complete profile</li>
		</ul>
	</div>

	{#if skills.length < 3}
		<div class="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
			<p class="text-sm text-yellow-800">
				Add at least {3 - skills.length} more skill{3 - skills.length === 1 ? '' : 's'} to continue.
			</p>
		</div>
	{/if}

	<div class="flex justify-between">
		<Button variant="outline" on:click={onPrevious}>
			Previous
		</Button>
		<Button disabled={!isValid} on:click={onNext}>
			Next: Settings
		</Button>
	</div>
</div>