<script lang="ts">
	import { builderData, addSkill, removeSkill, markStepComplete, markStepIncomplete, characterLimits } from '$lib/stores/resumeBuilder.js';
	import { templates as allTemplates } from '$lib/stores/templates.js';
	import { userProfile } from '$lib/stores/userProfile.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { X, Sparkles } from 'lucide-svelte';

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

	// Enhanced skill suggestions with profile and template awareness
	$: selectedTemplate = $allTemplates?.find?.(t => t.id === $builderData?.settings?.template);
	$: templateName = (selectedTemplate?.name || '').toLowerCase();
	$: profile = $userProfile;
	
	const technicalBase = [
	 'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'HTML/CSS', 'SQL', 'Git', 'Microsoft Office'
	];
	const softBase = [
	'Communication', 'Teamwork', 'Problem Solving', 'Leadership', 'Time Management', 'Customer Service'
	];
	const langBase = ['Spanish', 'French', 'German', 'Mandarin'];
	
	// Get profile-based skill suggestions
	$: profileSkills = (() => {
		if (!profile?.key_skills) return [];
		try {
			const skillsString = typeof profile.key_skills === 'string' 
				? profile.key_skills 
				: JSON.stringify(profile.key_skills);
			return skillsString.split(',').map(s => s.trim()).filter(s => s.length > 0);
		} catch {
			return [];
		}
	})();
	
	// Industry-specific skills based on profile
	$: industrySkills = (() => {
		if (!profile?.target_industry) return [];
		
		const industry = profile.target_industry.toLowerCase();
		
		if (industry.includes('tech') || industry.includes('software') || industry.includes('it')) {
			return ['JavaScript', 'Python', 'React', 'AWS', 'Docker', 'Git', 'Agile', 'API Development'];
		}
		if (industry.includes('marketing') || industry.includes('digital')) {
			return ['Google Analytics', 'SEO', 'Social Media', 'Content Marketing', 'Adobe Creative Suite', 'Email Marketing'];
		}
		if (industry.includes('finance') || industry.includes('accounting')) {
			return ['Excel', 'QuickBooks', 'Financial Analysis', 'SAP', 'Bloomberg Terminal', 'Risk Management'];
		}
		if (industry.includes('healthcare') || industry.includes('medical')) {
			return ['EMR Systems', 'HIPAA Compliance', 'Medical Terminology', 'Patient Care', 'Clinical Documentation'];
		}
		if (industry.includes('education') || industry.includes('teaching')) {
			return ['Curriculum Development', 'Classroom Management', 'Learning Management Systems', 'Assessment Design'];
		}
		if (industry.includes('sales') || industry.includes('retail')) {
			return ['CRM Software', 'Lead Generation', 'Customer Service', 'POS Systems', 'Sales Analytics'];
		}
		
		return [];
	})();
	
	$: technicalSuggestions = (() => {
		// Combine profile skills, industry skills, and template-specific skills
		let suggestions = [...technicalBase];
		
		// Add profile skills first (highest priority)
		if (profileSkills.length > 0) {
			suggestions = [...profileSkills.slice(0, 6), ...suggestions];
		}
		
		// Add industry-specific skills
		if (industrySkills.length > 0) {
			suggestions = [...industrySkills.slice(0, 4), ...suggestions];
		}
		
		// Template-specific overrides
		if (templateName.includes('retail') || templateName.includes('service') || templateName.includes('star')) {
			suggestions = ['POS Systems', 'Cash Handling', 'Merchandising', 'Inventory', 'Barcode Scanners', 'Stocking', 'Cleaning', 'Microsoft Office', ...suggestions];
		} else if (templateName.includes('hospitality')) {
			suggestions = ['POS Systems', 'Table Service', 'Scheduling', 'Food Safety', 'Reservations', 'Host/Server Tools', ...suggestions];
		} else if (templateName.includes('lifeguard')) {
			suggestions = ['CPR/First Aid', 'Water Safety', 'Rescue Techniques', 'Incident Reporting', 'Two-Way Radios', ...suggestions];
		}
		
		// Remove duplicates and limit to 12 suggestions
		return [...new Set(suggestions)].slice(0, 12);
	})();
	
	$: softSuggestions = (() => {
		let suggestions = [...softBase];
		
		// Industry-specific soft skills
		if (profile?.target_industry) {
			const industry = profile.target_industry.toLowerCase();
			
			if (industry.includes('tech') || industry.includes('software')) {
				suggestions = ['Problem Solving', 'Analytical Thinking', 'Collaboration', 'Adaptability', ...suggestions];
			} else if (industry.includes('sales') || industry.includes('customer')) {
				suggestions = ['Communication', 'Persuasion', 'Relationship Building', 'Negotiation', ...suggestions];
			} else if (industry.includes('management') || industry.includes('leadership')) {
				suggestions = ['Leadership', 'Team Management', 'Strategic Planning', 'Decision Making', ...suggestions];
			}
		}
		
		// Template-specific overrides
		if (templateName.includes('retail') || templateName.includes('service') || templateName.includes('star')) {
			suggestions = ['Customer Service', 'Communication', 'Reliability', 'Attention to Detail', 'Teamwork', 'Problem Solving', ...suggestions];
		} else if (templateName.includes('hospitality')) {
			suggestions = ['Customer Service', 'Multitasking', 'Communication', 'Teamwork', 'Adaptability', ...suggestions];
		} else if (templateName.includes('lifeguard')) {
			suggestions = ['Attention to Detail', 'Calm Under Pressure', 'Communication', 'Teamwork', 'Responsibility', ...suggestions];
		}
		
		// Remove duplicates and limit to 10 suggestions
		return [...new Set(suggestions)].slice(0, 10);
	})();
	
	$: languageSuggestions = langBase;

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
					placeholder={templateName.includes('retail') || templateName.includes('service') || templateName.includes('star') ? 'e.g., POS Systems, Cash Handling, Merchandising' : templateName.includes('hospitality') ? 'e.g., POS Systems, Table Service, Reservations' : templateName.includes('lifeguard') ? 'e.g., CPR/First Aid, Water Safety' : 'e.g., JavaScript, Python, React'}
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