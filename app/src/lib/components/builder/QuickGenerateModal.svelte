<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import { Sparkles, X, Loader2, RotateCcw, AlertCircle } from 'lucide-svelte';
	import { userProfile } from '$lib/stores/userProfile';
	import { generateFromProfile, isGenerating as storeIsGenerating } from '$lib/stores/resumeBuilder';
	import { generationPreferences } from '$lib/stores/generationPreferences';
	import { ResumeStrategyFactory } from '$lib/services/ResumeStrategies';
	import { analyzeProfile, type ProfileAnalysisResult } from '$lib/services/ProfileAnalysis';
	import ProfileCompleteness from '$lib/components/profile/ProfileCompleteness.svelte';
	import type { UserProfile } from '$lib/types';
	import type { ExtendedResumeTemplate } from '$lib/templates/types';
	import { toast } from 'svelte-sonner';

	export let open = false;
	export let currentTemplate: ExtendedResumeTemplate | null = null;

	const dispatch = createEventDispatcher<{
		close: void;
	}>();
	
	// Profile analysis
	let profileAnalysis: ProfileAnalysisResult | null = null;
	let showProfileWarning = false;

	// Section selection - map to actual section names used in builder
	let selectedSections = {
		personal: true,
		summary: true,
		experience: true,
		education: true,
		skills: true,
		projects: true
	};

	// Industry options
	const industries = [
		{ value: '', label: 'Auto-detect from profile' },
		{ value: 'software-engineering', label: 'Software Engineering' },
		{ value: 'web-development', label: 'Web Development' },
		{ value: 'data-science', label: 'Data Science' },
		{ value: 'design', label: 'Design' },
		{ value: 'marketing', label: 'Marketing' },
		{ value: 'sales', label: 'Sales' },
		{ value: 'finance', label: 'Finance' },
		{ value: 'healthcare', label: 'Healthcare' },
		{ value: 'education', label: 'Education' },
		{ value: 'other', label: 'Other' }
	];

	let targetIndustry = '';
	let strategyInfo: { name: string; confidence: number; reasons: string[] } | null = null;

	// Load preferences when modal opens
	$: if (open && $generationPreferences) {
		selectedSections = { ...$generationPreferences.selectedSections };
		targetIndustry = $generationPreferences.targetIndustry;
	}

	// Get strategy recommendation and analyze profile when modal opens
	$: if ($userProfile && open) {
		updateStrategyRecommendation($userProfile);
		analyzeUserProfile($userProfile);
	}

	function updateStrategyRecommendation(profile: UserProfile) {
		try {
			const selection = ResumeStrategyFactory.selectStrategy(profile, undefined);
			strategyInfo = {
				name: selection.strategyName,
				confidence: selection.confidence,
				reasons: selection.reasons
			};
		} catch (error) {
			console.error('Failed to get strategy recommendation:', error);
			strategyInfo = null;
		}
	}
	
	function analyzeUserProfile(profile: UserProfile) {
		try {
			profileAnalysis = analyzeProfile(profile);
			showProfileWarning = !profileAnalysis.isReadyForGeneration;
		} catch (error) {
			console.error('Failed to analyze profile:', error);
			profileAnalysis = null;
			showProfileWarning = false;
		}
	}

	function toggleSection(section: keyof typeof selectedSections) {
		selectedSections[section] = !selectedSections[section];
		// Save preference immediately
		generationPreferences.updateSections({ [section]: selectedSections[section] });
	}

	function selectAll() {
		Object.keys(selectedSections).forEach((key) => {
			selectedSections[key as keyof typeof selectedSections] = true;
		});
		// Save all sections as selected
		generationPreferences.updateSections(selectedSections);
	}

	function deselectAll() {
		Object.keys(selectedSections).forEach((key) => {
			selectedSections[key as keyof typeof selectedSections] = false;
		});
		// Save all sections as deselected
		generationPreferences.updateSections(selectedSections);
	}

	function resetToDefaults() {
		generationPreferences.reset();
		selectedSections = { ...$generationPreferences.selectedSections };
		targetIndustry = $generationPreferences.targetIndustry;
		toast.success('Preferences reset to defaults');
	}

	// Save industry preference when changed
	function handleIndustryChange() {
		generationPreferences.updateIndustry(targetIndustry);
	}

	async function handleGenerate() {
		const sections = Object.entries(selectedSections)
			.filter(([_, selected]) => selected)
			.map(([section]) => section);

		if (sections.length === 0) {
			toast.error('Please select at least one section to generate');
			return;
		}

		if (!$userProfile) {
			toast.error('No profile data available');
			return;
		}

		// Save current preferences before generating
		generationPreferences.set({
			selectedSections,
			targetIndustry,
			strategy: (strategyInfo?.name as 'auto' | 'experienced' | 'first-time' | 'career-change') || ''
		});

		try {
			await generateFromProfile({
				sections,
				targetIndustry: targetIndustry || $userProfile.target_industry || '',
				strategy: strategyInfo?.name as 'auto' | 'experienced' | 'first-time' | 'career-change' | undefined
			});

			toast.success('Resume sections generated successfully!');
			handleClose();
		} catch (error) {
			console.error('Generation error:', error);
			const errorMessage = error instanceof Error ? error.message : 'Failed to generate resume';
			toast.error(errorMessage);
		}
	}

	function handleClose() {
		if (!$storeIsGenerating) {
			dispatch('close');
		}
	}

	// Close on escape key
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && !$storeIsGenerating) {
			handleClose();
		}
	}

	// Format confidence as percentage
	function formatConfidence(confidence: number): string {
		return `${Math.round(confidence * 100)}%`;
	}

	// Get confidence color
	function getConfidenceColor(confidence: number): string {
		if (confidence >= 0.9) return 'text-green-600';
		if (confidence >= 0.7) return 'text-blue-600';
		if (confidence >= 0.5) return 'text-yellow-600';
		return 'text-gray-600';
	}
</script>

<svelte:window on:keydown={handleKeydown} />

{#if open}
	<!-- Modal Overlay -->
	<div
		class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
		on:click={handleClose}
		on:keydown={(e) => e.key === 'Enter' && handleClose()}
		role="button"
		tabindex="0"
		aria-label="Close modal"
	/>

	<!-- Modal Content -->
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
		<div
			class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto"
			on:click|stopPropagation
			on:keydown|stopPropagation
			role="dialog"
			aria-modal="true"
			aria-labelledby="modal-title"
		>
			<!-- Header -->
			<div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
				<div class="flex items-center gap-3">
					<div class="p-2 bg-purple-100 rounded-lg">
						<Sparkles class="w-5 h-5 text-purple-600" />
					</div>
					<div>
						<h2 id="modal-title" class="text-xl font-semibold text-gray-900">
							Quick Generate from Profile
						</h2>
						<p class="text-sm text-gray-500 mt-0.5">
							Automatically populate your resume using your profile data
						</p>
					</div>
				</div>
				<button
					on:click={handleClose}
					disabled={$storeIsGenerating}
					class="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
					aria-label="Close"
				>
					<X class="w-5 h-5 text-gray-500" />
				</button>
			</div>

			<!-- Content -->
			<div class="px-6 py-6 space-y-6">
				<!-- Strategy Recommendation -->
				{#if strategyInfo}
					<div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
						<div class="flex items-start gap-3">
							<div class="flex-1">
								<div class="flex items-center gap-2 mb-2">
									<h3 class="font-medium text-blue-900">Recommended Strategy</h3>
									<span class="text-sm {getConfidenceColor(strategyInfo.confidence)} font-medium">
										{formatConfidence(strategyInfo.confidence)} confidence
									</span>
								</div>
								<p class="text-sm text-blue-800 font-medium mb-2">
									{strategyInfo.name}
								</p>
								<ul class="text-sm text-blue-700 space-y-1">
									{#each strategyInfo.reasons as reason}
										<li class="flex items-start gap-2">
											<span class="text-blue-400 mt-0.5">•</span>
											<span>{reason}</span>
										</li>
									{/each}
								</ul>
							</div>
						</div>
					</div>
				{/if}

				<!-- Profile Completeness Warning -->
				{#if showProfileWarning && $userProfile}
					<ProfileCompleteness profile={$userProfile} compact={true} showActions={true} />
				{/if}

				<!-- Sections to Generate -->
				<div>
					<div class="flex items-center justify-between mb-3">
						<label class="block text-sm font-medium text-gray-700">
							Sections to Generate
						</label>
						<div class="flex gap-2">
							<button
								on:click={selectAll}
								class="text-xs text-purple-600 hover:text-purple-700 font-medium"
								disabled={$storeIsGenerating}
							>
								Select All
							</button>
							<span class="text-gray-300">|</span>
							<button
								on:click={deselectAll}
								class="text-xs text-gray-600 hover:text-gray-700 font-medium"
								disabled={$storeIsGenerating}
							>
								Deselect All
							</button>
							<span class="text-gray-300">|</span>
							<button
								on:click={resetToDefaults}
								class="text-xs text-gray-600 hover:text-gray-700 font-medium flex items-center gap-1"
								disabled={$storeIsGenerating}
								title="Reset to default preferences"
							>
								<RotateCcw class="w-3 h-3" />
								Reset
							</button>
						</div>
					</div>

					<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
						{#each Object.entries(selectedSections) as [section, selected]}
							<label class="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
								<input
									type="checkbox"
									checked={selected}
									on:change={() => toggleSection(section as keyof typeof selectedSections)}
									disabled={$storeIsGenerating}
									class="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
								/>
								<span class="text-sm font-medium text-gray-700 capitalize">
									{section.replace(/([A-Z])/g, ' $1').trim()}
								</span>
							</label>
						{/each}
					</div>
				</div>

				<!-- Target Industry -->
				<div>
					<label for="industry" class="block text-sm font-medium text-gray-700 mb-2">
						Target Industry
					</label>
					<select
						id="industry"
						bind:value={targetIndustry}
						on:change={handleIndustryChange}
						disabled={$storeIsGenerating}
						class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{#each industries as industry}
							<option value={industry.value}>{industry.label}</option>
						{/each}
					</select>
					<p class="mt-1.5 text-xs text-gray-500">
						Leave as "Auto-detect" to use your profile's target industry
					</p>
				</div>

				<!-- Info Box -->
				<div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
					<p class="text-sm text-gray-600">
						<strong class="text-gray-900">Note:</strong> This will populate the selected sections with data from your profile. Empty fields will be filled, but existing content you've edited will be preserved.
					</p>
				</div>
			</div>

			<!-- Footer -->
			<div class="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3">
				<Button
					variant="outline"
					on:click={handleClose}
					disabled={$storeIsGenerating}
					class="min-w-[100px]"
				>
					Cancel
				</Button>
				<Button
					on:click={handleGenerate}
					disabled={$storeIsGenerating}
					class="min-w-[120px] bg-purple-600 hover:bg-purple-700"
				>
					{#if $storeIsGenerating}
						<Loader2 class="w-4 h-4 mr-2 animate-spin" />
						Generating...
					{:else}
						<Sparkles class="w-4 h-4 mr-2" />
						Generate
					{/if}
				</Button>
			</div>
		</div>
	</div>
{/if}

<style>
	/* Smooth scrolling for modal content */
	.overflow-y-auto {
		scrollbar-width: thin;
		scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
	}

	.overflow-y-auto::-webkit-scrollbar {
		width: 6px;
	}

	.overflow-y-auto::-webkit-scrollbar-track {
		background: transparent;
	}

	.overflow-y-auto::-webkit-scrollbar-thumb {
		background-color: rgba(156, 163, 175, 0.5);
		border-radius: 3px;
	}

	.overflow-y-auto::-webkit-scrollbar-thumb:hover {
		background-color: rgba(156, 163, 175, 0.7);
	}
</style>
