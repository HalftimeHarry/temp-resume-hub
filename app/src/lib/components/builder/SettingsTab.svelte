<script lang="ts">
	import { builderData, markStepComplete } from '$lib/stores/resumeBuilder.js';
	import { generateId } from '$lib/utils.js';
	import { INDUSTRY_SEED_DATA, getSeedDataByCategory } from '$lib/seed-data';
	import { TEMPLATE_CONFIGURATIONS } from '$lib/templates/configurations';
	import type { IndustrySeedData } from '$lib/seed-data';
	import { toast } from 'svelte-sonner';
	import { Briefcase, Check } from 'lucide-svelte';
	import { Badge } from '$lib/components/ui/badge';

	interface Props {
		onNext?: () => void;
		onPrevious?: () => void;
	}

	let { onNext, onPrevious }: Props = $props();

	let selectedIndustryId: string | null = null;
	let hasAppliedSelection = false;

	let entryLevelIndustries = $derived(getSeedDataByCategory('entry-level'));
	let professionalIndustries = $derived(getSeedDataByCategory('professional'));

	function handleIndustrySelection(industry: IndustrySeedData) {
		console.log('Selected industry:', industry.name);

		// Use default template (first one available)
		const defaultTemplate = Object.values(TEMPLATE_CONFIGURATIONS)[0];

		// Merge seed data with default template
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
					category: s.category === 'technical' ? 'technical' : s.category === 'soft' ? 'soft' : 'technical'
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
				target_industry: industry.name,
				settings: {
					...data.settings,
					template: defaultTemplate.id
				}
			};
		});

		selectedIndustryId = industry.id;
		hasAppliedSelection = true;

		// Mark step as complete
		markStepComplete('settings');

		toast.success(`Applied ${industry.name} content!`, {
			description: 'Your resume has been populated with starter content. Customize it in the next steps.'
		});

		// Auto-advance to next step after a brief delay
		setTimeout(() => {
			onNext?.();
		}, 1500);
	}
</script>

<div class="space-y-6">
	{#if !hasAppliedSelection}
		<div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
			<h3 class="font-semibold text-blue-900 mb-2">👋 Welcome to Resume Builder!</h3>
			<p class="text-blue-800 text-sm">
				Let's get started by choosing the type of job you're applying for.
				We'll provide relevant content and examples to help you build a great resume quickly.
			</p>
		</div>

		<!-- Industry Selection -->
		<div class="space-y-6">
			<div class="text-center">
				<Briefcase class="w-12 h-12 mx-auto mb-4 text-blue-600" />
				<h2 class="text-2xl font-bold mb-2">What type of job are you applying for?</h2>
				<p class="text-gray-600">We'll provide relevant content and examples to help you get started.</p>
			</div>

			<!-- Entry Level Roles -->
			<div class="space-y-4">
				<h3 class="text-lg font-semibold flex items-center gap-2">
					<Badge variant="secondary">Entry Level</Badge>
					Starting Your Career
				</h3>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					{#each entryLevelIndustries as industry}
						<button
							on:click={() => handleIndustrySelection(industry)}
							class="text-left p-4 border-2 rounded-lg transition-all hover:border-blue-500 hover:bg-blue-50 {selectedIndustryId === industry.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}"
						>
							<div class="flex items-start justify-between">
								<div class="flex-1">
									<h4 class="font-semibold text-gray-900 mb-1">{industry.name}</h4>
									<p class="text-sm text-gray-600 mb-2">{industry.description}</p>
									<div class="flex flex-wrap gap-1">
										{#each industry.keywords.slice(0, 3) as keyword}
											<span class="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
												{keyword}
											</span>
										{/each}
									</div>
								</div>
								{#if selectedIndustryId === industry.id}
									<Check class="w-5 h-5 text-blue-600 flex-shrink-0 ml-2" />
								{/if}
							</div>
						</button>
					{/each}
				</div>
			</div>

			<!-- Professional Roles -->
			<div class="space-y-4">
				<h3 class="text-lg font-semibold flex items-center gap-2">
					<Badge variant="default">Professional</Badge>
					Experienced Roles
				</h3>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					{#each professionalIndustries as industry}
						<button
							on:click={() => handleIndustrySelection(industry)}
							class="text-left p-4 border-2 rounded-lg transition-all hover:border-blue-500 hover:bg-blue-50 {selectedIndustryId === industry.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}"
						>
							<div class="flex items-start justify-between">
								<div class="flex-1">
									<h4 class="font-semibold text-gray-900 mb-1">{industry.name}</h4>
									<p class="text-sm text-gray-600 mb-2">{industry.description}</p>
									<div class="flex flex-wrap gap-1">
										{#each industry.keywords.slice(0, 3) as keyword}
											<span class="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
												{keyword}
											</span>
										{/each}
									</div>
								</div>
								{#if selectedIndustryId === industry.id}
									<Check class="w-5 h-5 text-blue-600 flex-shrink-0 ml-2" />
								{/if}
							</div>
						</button>
					{/each}
				</div>
			</div>
		</div>
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
