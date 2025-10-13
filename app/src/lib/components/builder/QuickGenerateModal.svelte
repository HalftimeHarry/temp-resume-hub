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
	import { getIndustryBoilerplate, mergeSkillsWithBoilerplate } from '$lib/services/IndustryBoilerplates';
	import { builderData } from '$lib/stores/resumeBuilder';

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

	// Industry options - matching IndustryBoilerplates
	const industries = [
		{ value: '', label: 'Auto-detect from profile', icon: '🤖' },
		{ value: 'Technology', label: 'Technology', icon: '💻', description: 'Software, IT, SaaS' },
		{ value: 'Healthcare', label: 'Healthcare', icon: '🏥', description: 'Medical, Pharmaceutical' },
		{ value: 'Finance', label: 'Finance', icon: '💰', description: 'Banking, Investment' },
		{ value: 'Education', label: 'Education', icon: '📚', description: 'Teaching, Training' },
		{ value: 'Retail', label: 'Retail', icon: '🛍️', description: 'Sales, E-commerce' },
		{ value: 'Manufacturing', label: 'Manufacturing', icon: '🏭', description: 'Production, Operations' },
		{ value: 'Marketing', label: 'Marketing', icon: '📢', description: 'Digital, Advertising' },
		{ value: 'Consulting', label: 'Consulting', icon: '💼', description: 'Strategy, Advisory' },
		{ value: 'Real Estate', label: 'Real Estate', icon: '🏢', description: 'Property, Construction' },
		{ value: 'Hospitality', label: 'Hospitality', icon: '🏨', description: 'Hotels, Restaurants' },
		{ value: 'Legal', label: 'Legal', icon: '⚖️', description: 'Law, Compliance' },
		{ value: 'Media & Entertainment', label: 'Media & Entertainment', icon: '🎬', description: 'Publishing, Broadcasting' }
	];

	let targetIndustry = '';
	let strategyInfo: { name: string; confidence: number; reasons: string[] } | null = null;
	let useBoilerplate = false; // Toggle between profile generation and industry boilerplate

	// Load preferences when modal opens
	$: if (open && $generationPreferences) {
		selectedSections = { ...$generationPreferences.selectedSections };
		targetIndustry = $generationPreferences.targetIndustry;
	}

	// Get strategy recommendation and analyze profile when modal opens
	$: if ($userProfile && open) {
		updateStrategyRecommendation($userProfile);
		analyzeUserProfile($userProfile);
		
		// Auto-suggest boilerplate if profile is incomplete
		if (profileAnalysis && !profileAnalysis.isReadyForGeneration) {
			useBoilerplate = true;
		}
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

		// Save current preferences before generating
		generationPreferences.set({
			selectedSections,
			targetIndustry,
			strategy: (strategyInfo?.name as 'auto' | 'experienced' | 'first-time' | 'career-change') || ''
		});

		try {
			// If using boilerplate or no profile, apply industry boilerplate
			if (useBoilerplate || !$userProfile) {
				if (!targetIndustry) {
					toast.error('Please select an industry');
					return;
				}
				
				const boilerplate = getIndustryBoilerplate(targetIndustry);
				if (!boilerplate) {
					toast.error('Industry template not found');
					return;
				}

				builderData.update(d => {
					const updates: any = { ...d, target_industry: targetIndustry };
					
					if (selectedSections.summary) {
						updates.summary = boilerplate.summary;
					}
					if (selectedSections.skills) {
						updates.skills = mergeSkillsWithBoilerplate(d.skills, boilerplate.skills);
					}
					if (selectedSections.experience) {
						updates.experience = boilerplate.experience;
					}
					if (selectedSections.education) {
						updates.education = boilerplate.education;
					}
					
					return updates;
				});

				toast.success('Industry template applied successfully!');
				handleClose();
			} else {
				// Use profile-based generation
				if (!$userProfile) {
					toast.error('No profile data available');
					return;
				}

				await generateFromProfile({
					sections,
					targetIndustry: targetIndustry || $userProfile.target_industry || '',
					strategy: strategyInfo?.name as 'auto' | 'experienced' | 'first-time' | 'career-change' | undefined
				});

				toast.success('Resume sections generated successfully!');
				handleClose();
			}
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
							Smart Generate Resume
						</h2>
						<p class="text-sm text-gray-500 mt-0.5">
							Generate from your profile or use an industry template
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
				<!-- Generation Mode Toggle -->
				<div class="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
					<label class="flex items-start gap-3 cursor-pointer">
						<input
							type="checkbox"
							bind:checked={useBoilerplate}
							disabled={$storeIsGenerating}
							class="mt-1 w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
						/>
						<div class="flex-1">
							<div class="font-medium text-gray-900">Use Industry Template</div>
							<p class="text-sm text-gray-600 mt-1">
								{#if useBoilerplate}
									Generate using industry-specific boilerplate content (recommended if your profile is incomplete)
								{:else}
									Generate from your profile data (recommended if your profile is complete)
								{/if}
							</p>
						</div>
					</label>
				</div>

				<!-- Strategy Recommendation -->
				{#if strategyInfo && !useBoilerplate}
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
				{#if showProfileWarning && $userProfile && !useBoilerplate}
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
					<label class="block text-sm font-medium text-gray-700 mb-3">
						Target Industry {useBoilerplate ? '(Required)' : '(Optional)'}
					</label>
					<div class="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
						{#each industries as industry}
							<button
								type="button"
								on:click={() => {
									targetIndustry = industry.value;
									handleIndustryChange();
								}}
								disabled={$storeIsGenerating}
								class="text-left p-3 border-2 rounded-lg transition-all hover:border-purple-300 hover:bg-purple-50 disabled:opacity-50 {targetIndustry === industry.value
									? 'border-purple-500 bg-purple-50'
									: 'border-gray-200'}"
							>
								<div class="flex items-center gap-2">
									<span class="text-xl">{industry.icon}</span>
									<div class="flex-1 min-w-0">
										<div class="text-sm font-medium text-gray-900 truncate">
											{industry.label}
										</div>
										{#if industry.description}
											<div class="text-xs text-gray-500 truncate">
												{industry.description}
											</div>
										{/if}
									</div>
								</div>
							</button>
						{/each}
					</div>
					<p class="mt-2 text-xs text-gray-500">
						{#if useBoilerplate}
							Select an industry to use its template content
						{:else}
							Select to tailor content, or leave as "Auto-detect" to use your profile's industry
						{/if}
					</p>
				</div>

				<!-- Info Box -->
				<div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
					<p class="text-sm text-gray-600">
						<strong class="text-gray-900">Note:</strong> 
						{#if useBoilerplate}
							This will populate the selected sections with industry-specific template content. You can edit everything afterwards.
						{:else}
							This will populate the selected sections with data from your profile. Empty fields will be filled, but existing content you've edited will be preserved.
						{/if}
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
