<script lang="ts">
	import { builderData, updateSettings, markStepComplete } from '$lib/stores/resumeBuilder.js';
	import { generateId } from '$lib/utils.js';
	import IndustryTemplateSelector from './IndustryTemplateSelector.svelte';
	import type { IndustrySeedData } from '$lib/seed-data';
	import type { ClientTemplateConfig } from '$lib/templates/types';
	import { toast } from 'svelte-sonner';

	interface Props {
		onNext?: () => void;
		onPrevious?: () => void;
	}

	let { onNext, onPrevious }: Props = $props();

	let selectedIndustryId: string | null = null;
	let selectedTemplateId: string | null = null;
	let hasAppliedSelection = false;

	function handleSelection(industry: IndustrySeedData, template: ClientTemplateConfig) {
		console.log('Selected industry:', industry.name);
		console.log('Selected template:', template.name);

		// Merge seed data with template
		builderData.update(data => {
			// Use first summary template
			const summary = industry.summaryTemplates[0] || '';
			
			// Convert skill suggestions to builder format
			const skills = industry.skillSuggestions
				.filter(s => s.priority === 'high')
				.slice(0, 6)
				.map(s => ({
					id: generateId(),
					name: s.name,
					level: s.level as 'beginner' | 'intermediate' | 'advanced',
					category: s.category === 'technical' ? 'Technical' : s.category === 'soft' ? 'Soft Skills' : 'Professional'
				}));

			// Use experience examples if available
			const experience = industry.experienceExamples || [];

			// Use education examples if available
			const education = industry.educationExamples || [];

			return {
				...data,
				summary,
				skills,
				experience,
				education,
				settings: {
					...data.settings,
					template: template.id,
					colorScheme: template.settings.colorScheme,
					fontSize: template.settings.fontSize,
					spacing: template.settings.spacing,
					showProfileImage: template.settings.showProfileImage,
					sectionOrder: template.settings.sectionOrder
				}
			};
		});

		selectedIndustryId = industry.id;
		selectedTemplateId = template.id;
		hasAppliedSelection = true;

		// Mark step as complete
		markStepComplete('settings');

		toast.success(`Applied ${industry.name} content with ${template.name} design!`, {
			description: 'Your resume has been populated with starter content. Customize it in the next steps.'
		});

		// Auto-advance to next step after a brief delay
		setTimeout(() => {
			onNext();
		}, 1500);
	}
</script>

<div class="space-y-6">
	{#if !hasAppliedSelection}
		<div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
			<h3 class="font-semibold text-blue-900 mb-2">👋 Welcome to Resume Builder!</h3>
			<p class="text-blue-800 text-sm">
				Let's get started by choosing the type of job you're applying for and how you want your resume to look.
				We'll provide relevant content and examples to help you build a great resume quickly.
			</p>
		</div>

		<IndustryTemplateSelector 
			onSelect={handleSelection}
			{selectedIndustryId}
			{selectedTemplateId}
		/>
	{:else}
		<div class="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
			<div class="text-4xl mb-4">✅</div>
			<h3 class="font-semibold text-green-900 mb-2">Your resume is ready to customize!</h3>
			<p class="text-green-800 text-sm mb-4">
				We've populated your resume with starter content. Click "Next" to begin customizing it with your information.
			</p>
			<button
				on:click={onNext}
				class="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
			>
				Continue to Personal Info →
			</button>
		</div>
	{/if}
</div>

<!-- Navigation buttons -->
<div class="flex justify-between mt-8 pt-6 border-t">
	<button
		class="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50"
		on:click={onPrevious}
		disabled={true}
	>
		← Previous
	</button>
	<button
		class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
		on:click={onNext}
		disabled={!hasAppliedSelection}
	>
		Continue →
	</button>
</div>
