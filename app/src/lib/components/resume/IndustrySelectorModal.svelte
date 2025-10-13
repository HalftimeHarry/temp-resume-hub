<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import {
		Dialog,
		DialogContent,
		DialogDescription,
		DialogFooter,
		DialogHeader,
		DialogTitle
	} from '$lib/components/ui/dialog';
	import { Badge } from '$lib/components/ui/badge';
	import { Search, Briefcase, TrendingUp, Building2, Sparkles } from 'lucide-svelte';

	export let open = false;
	export let currentIndustry: string | undefined = undefined;
	export let resumeTitle: string = '';
	export let mode: 'duplicate' | 'builder' = 'duplicate';

	const dispatch = createEventDispatcher<{
		select: { industry: string; purpose: string };
		close: void;
		quickGenerate: void;
		skip: void;
	}>();

	// Common industries with descriptions
	const industries = [
		{
			name: 'Technology',
			description: 'Software, IT, SaaS, Cloud Computing',
			keywords: ['software', 'development', 'engineering', 'tech'],
			icon: '💻'
		},
		{
			name: 'Healthcare',
			description: 'Medical, Pharmaceutical, Biotech',
			keywords: ['medical', 'health', 'clinical', 'patient'],
			icon: '🏥'
		},
		{
			name: 'Finance',
			description: 'Banking, Investment, Insurance, Fintech',
			keywords: ['financial', 'banking', 'investment', 'accounting'],
			icon: '💰'
		},
		{
			name: 'Education',
			description: 'Schools, Universities, EdTech, Training',
			keywords: ['teaching', 'learning', 'academic', 'education'],
			icon: '📚'
		},
		{
			name: 'Retail',
			description: 'E-commerce, Sales, Consumer Goods',
			keywords: ['sales', 'customer', 'retail', 'commerce'],
			icon: '🛍️'
		},
		{
			name: 'Manufacturing',
			description: 'Production, Supply Chain, Operations',
			keywords: ['production', 'manufacturing', 'operations', 'quality'],
			icon: '🏭'
		},
		{
			name: 'Marketing',
			description: 'Digital Marketing, Advertising, PR',
			keywords: ['marketing', 'advertising', 'brand', 'content'],
			icon: '📢'
		},
		{
			name: 'Consulting',
			description: 'Business Consulting, Strategy, Advisory',
			keywords: ['consulting', 'strategy', 'advisory', 'business'],
			icon: '💼'
		},
		{
			name: 'Real Estate',
			description: 'Property, Construction, Architecture',
			keywords: ['property', 'real estate', 'construction', 'development'],
			icon: '🏢'
		},
		{
			name: 'Hospitality',
			description: 'Hotels, Restaurants, Tourism, Events',
			keywords: ['hospitality', 'service', 'guest', 'customer'],
			icon: '🏨'
		},
		{
			name: 'Legal',
			description: 'Law Firms, Corporate Legal, Compliance',
			keywords: ['legal', 'law', 'compliance', 'regulatory'],
			icon: '⚖️'
		},
		{
			name: 'Media & Entertainment',
			description: 'Publishing, Broadcasting, Gaming, Film',
			keywords: ['media', 'content', 'entertainment', 'creative'],
			icon: '🎬'
		}
	];

	let searchQuery = '';
	let selectedIndustry = '';
	let customPurpose = '';

	$: filteredIndustries = industries.filter(
		(industry) =>
			industry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			industry.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
			industry.keywords.some((kw) => kw.toLowerCase().includes(searchQuery.toLowerCase()))
	);

	$: suggestedPurpose = selectedIndustry
		? `${resumeTitle.split(' - ')[0] || 'Professional'} - ${selectedIndustry}`
		: '';

	function handleSelect(industry: string) {
		selectedIndustry = industry;
		customPurpose = suggestedPurpose;
	}

	function handleConfirm() {
		if (selectedIndustry) {
			dispatch('select', {
				industry: selectedIndustry,
				purpose: customPurpose || suggestedPurpose
			});
			handleClose();
		}
	}

	function handleClose() {
		dispatch('close');
		// Reset state
		searchQuery = '';
		selectedIndustry = '';
		customPurpose = '';
	}

	function handleQuickGenerate() {
		dispatch('quickGenerate');
		handleClose();
	}

	function handleSkip() {
		dispatch('skip');
		handleClose();
	}
</script>

<Dialog bind:open>
	<DialogContent class="max-w-3xl max-h-[90vh] overflow-y-auto">
		<DialogHeader>
			<DialogTitle class="flex items-center gap-2">
				<Sparkles class="w-5 h-5 text-purple-600" />
				{mode === 'builder' ? 'Select Your Target Industry' : 'Duplicate Resume for Different Industry'}
			</DialogTitle>
			<DialogDescription>
				{#if mode === 'builder'}
					Choose your target industry to get started with industry-specific boilerplate content, professional summary, and relevant skills.
				{:else}
					Select a target industry to create a tailored version of your resume. We'll adapt the content, keywords, and focus to match the new industry.
				{/if}
			</DialogDescription>
		</DialogHeader>

		<div class="space-y-6 py-4">
			<!-- Current Industry Info -->
			{#if currentIndustry}
				<div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
					<div class="flex items-center gap-2 text-sm">
						<Building2 class="w-4 h-4 text-blue-600" />
						<span class="text-blue-900">
							Current industry: <strong>{currentIndustry}</strong>
						</span>
					</div>
				</div>
			{/if}

			<!-- Search -->
			<div class="relative">
				<Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
				<Input
					type="text"
					placeholder="Search industries..."
					bind:value={searchQuery}
					class="pl-10"
				/>
			</div>

			<!-- Industry Grid -->
			<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
				{#each filteredIndustries as industry}
					<button
						type="button"
						on:click={() => handleSelect(industry.name)}
						class="text-left p-4 border-2 rounded-lg transition-all hover:border-purple-300 hover:bg-purple-50 {selectedIndustry ===
						industry.name
							? 'border-purple-500 bg-purple-50'
							: 'border-gray-200'}"
					>
						<div class="flex items-start gap-3">
							<span class="text-2xl">{industry.icon}</span>
							<div class="flex-1 min-w-0">
								<div class="font-semibold text-gray-900 flex items-center gap-2">
									{industry.name}
									{#if selectedIndustry === industry.name}
										<Badge variant="default" class="text-xs">Selected</Badge>
									{/if}
								</div>
								<p class="text-sm text-gray-600 mt-1">{industry.description}</p>
							</div>
						</div>
					</button>
				{/each}
			</div>

			{#if filteredIndustries.length === 0}
				<div class="text-center py-8 text-gray-500">
					<p>No industries found matching "{searchQuery}"</p>
					<p class="text-sm mt-2">Try a different search term</p>
				</div>
			{/if}

			<!-- Custom Purpose -->
			{#if selectedIndustry}
				<div class="space-y-3 pt-4 border-t">
					<div class="flex items-center gap-2">
						<Briefcase class="w-4 h-4 text-gray-600" />
						<label for="purpose" class="text-sm font-medium text-gray-700">
							Resume Purpose (Optional)
						</label>
					</div>
					<Input
						id="purpose"
						type="text"
						placeholder={suggestedPurpose}
						bind:value={customPurpose}
					/>
					<p class="text-xs text-gray-500">
						Customize the purpose for this resume version. Leave blank to use the suggested
						purpose.
					</p>
				</div>

				<!-- Preview -->
				<div class="bg-green-50 border border-green-200 rounded-lg p-4">
					<div class="flex items-start gap-3">
						<TrendingUp class="w-5 h-5 text-green-600 mt-0.5" />
						<div class="flex-1">
							<h4 class="font-medium text-green-900 mb-2">What will be adapted:</h4>
							<ul class="text-sm text-green-800 space-y-1">
								<li>• Industry-specific keywords and terminology</li>
								<li>• Professional summary tailored to {selectedIndustry}</li>
								<li>• Experience descriptions optimized for the industry</li>
								<li>• Skills prioritized for {selectedIndustry} roles</li>
								<li>• New title: "{customPurpose || suggestedPurpose}"</li>
							</ul>
						</div>
					</div>
				</div>
			{/if}
		</div>

		<DialogFooter class="flex-col sm:flex-row gap-2">
			{#if mode === 'builder'}
				<div class="flex gap-2 w-full sm:w-auto">
					<Button variant="outline" on:click={handleSkip} class="flex-1 sm:flex-none">
						Skip for Now
					</Button>
					<Button variant="secondary" on:click={handleQuickGenerate} class="flex-1 sm:flex-none">
						<Sparkles class="w-4 h-4 mr-2" />
						Quick Generate
					</Button>
				</div>
			{:else}
				<Button variant="outline" on:click={handleClose}>Cancel</Button>
			{/if}
			<Button on:click={handleConfirm} disabled={!selectedIndustry} class="w-full sm:w-auto">
				<Sparkles class="w-4 h-4 mr-2" />
				{mode === 'builder' ? 'Continue with Industry' : 'Duplicate & Adapt Resume'}
			</Button>
		</DialogFooter>
	</DialogContent>
</Dialog>
