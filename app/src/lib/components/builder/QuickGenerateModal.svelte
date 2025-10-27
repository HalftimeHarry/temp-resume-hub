<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import { Sparkles, X, Loader2, RotateCcw, AlertCircle } from 'lucide-svelte';
	import { userProfile } from '$lib/stores/userProfile';
	import { generateFromProfile, isGenerating as storeIsGenerating, publishResume } from '$lib/stores/resumeBuilder';
	import { generationPreferences } from '$lib/stores/generationPreferences';
	import { ResumeStrategyFactory } from '$lib/services/ResumeStrategies';
	import { analyzeProfile, type ProfileAnalysisResult } from '$lib/services/ProfileAnalysis';
	import ProfileCompleteness from '$lib/components/profile/ProfileCompleteness.svelte';
	import type { UserProfile } from '$lib/types';
	import type { ExtendedResumeTemplate } from '$lib/templates/types';
	import { toast } from 'svelte-sonner';
	import { getIndustryBoilerplate, mergeSkillsWithBoilerplate } from '$lib/services/IndustryBoilerplates';
	import { builderData } from '$lib/stores/resumeBuilder';
	import { goto } from '$app/navigation';
	import { generateId } from '$lib/utils';

	export let open = false;
	export let currentTemplate: ExtendedResumeTemplate | null = null;
	export let mode: 'populate' | 'create' = 'populate'; // New prop to control behavior

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
					const completedSteps = [...d.completedSteps];
					
					// Ensure personal info is populated with profile data
					if (selectedSections.personal) {
						if ($userProfile) {
							// Only update empty fields to preserve user edits
							updates.personalInfo = {
								...d.personalInfo,
								fullName: d.personalInfo.fullName || 
									($userProfile.first_name && $userProfile.last_name 
										? `${$userProfile.first_name} ${$userProfile.last_name}`
										: ''),
								email: d.personalInfo.email || '',
								phone: d.personalInfo.phone || $userProfile.phone || '',
								location: d.personalInfo.location || $userProfile.location || '',
								linkedin: d.personalInfo.linkedin || $userProfile.linkedin_url || '',
								website: d.personalInfo.website || $userProfile.portfolio_url || ''
							};
						}
						if (!completedSteps.includes('personal')) {
							completedSteps.push('personal');
						}
					}
					
					// Only update if current content is empty or default/generic
					if (selectedSections.summary) {
						const isEmpty = !d.summary || d.summary.trim().length === 0;
						const isGeneric = d.summary && (
							d.summary.includes('Professional with strong work ethic') ||
							d.summary.includes('Recent graduate with experience') ||
							d.summary.length < 50
						);
						if (isEmpty || isGeneric) {
							updates.summary = boilerplate.summary;
						}
						if (!completedSteps.includes('summary')) {
							completedSteps.push('summary');
						}
					}
					
					if (selectedSections.skills) {
						// Check if current skills are default/generic
						const hasDefaultSkills = d.skills.length <= 4 && 
							d.skills.some(s => s.name === 'JavaScript' || s.name === 'HTML/CSS');
						
						// Merge profile skills with boilerplate skills
						const profileSkills = $userProfile?.key_skills 
							? $userProfile.key_skills.split(',').map(s => ({
								id: generateId(),
								name: s.trim(),
								level: 'intermediate' as const,
								category: 'technical' as const
							}))
							: [];
						
						// If default skills, replace completely; otherwise merge
						if (hasDefaultSkills) {
							updates.skills = mergeSkillsWithBoilerplate(profileSkills, boilerplate.skills);
						} else {
							updates.skills = mergeSkillsWithBoilerplate([...d.skills, ...profileSkills], boilerplate.skills);
						}
						
						if (!completedSteps.includes('skills')) {
							completedSteps.push('skills');
						}
					}
					
					if (selectedSections.experience) {
						const hasDefaultExperience = d.experience.length === 1 && 
							d.experience[0].company === 'ABC Company';
						const isEmpty = d.experience.length === 0;
						
						if (isEmpty || hasDefaultExperience) {
							updates.experience = boilerplate.experience;
						}
						if (!completedSteps.includes('experience')) {
							completedSteps.push('experience');
						}
					}
					
					if (selectedSections.education) {
						const isEmpty = d.education.length === 0;
						const hasDefaultEducation = d.education.length === 1 && 
							(d.education[0].institution === 'San Diego State University' ||
							 d.education[0].institution === 'State University' ||
							 d.education[0].institution === 'Local University');
						if (isEmpty || hasDefaultEducation) {
							updates.education = boilerplate.education;
						}
						if (!completedSteps.includes('education')) {
							completedSteps.push('education');
						}
					}
					
					// Handle projects section - create sample project if empty
					if (selectedSections.projects) {
						const isEmpty = d.projects.length === 0;
						if (isEmpty) {
							// Create a sample project based on industry
							updates.projects = [{
								id: generateId(),
								name: `${targetIndustry} Project`,
								description: `Sample project demonstrating skills relevant to ${targetIndustry}. Replace with your actual projects.`,
								technologies: boilerplate.skills.slice(0, 5).map(s => s.name).join(', '),
								link: '',
								startDate: '',
								endDate: '',
								current: false,
								highlights: [
									'Key achievement or outcome',
									'Technologies or skills demonstrated',
									'Impact or results achieved'
								]
							}];
						}
						if (!completedSteps.includes('projects')) {
							completedSteps.push('projects');
						}
					}
					
					updates.completedSteps = completedSteps;
					return updates;
				});

				// If in 'create' mode, publish the resume and redirect to dashboard
				if (mode === 'create') {
					toast.loading('Creating your resume...', { id: 'create-resume' });
					
					try {
						const result = await publishResume();
						toast.dismiss('create-resume');
						toast.success('Resume created successfully!');
						handleClose();
						
						// Redirect to dashboard with created flag
						setTimeout(() => {
							goto(`/dashboard?created=true&resumeId=${result.record.id}`);
						}, 500);
					} catch (error) {
						toast.dismiss('create-resume');
						console.error('Failed to create resume:', error);
						toast.error('Failed to create resume. Please try again.');
					}
				} else {
					// In 'populate' mode, just update the builder
					toast.success('Industry template applied successfully!');
					handleClose();
				}
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

				// If in 'create' mode, publish the resume and redirect to dashboard
				if (mode === 'create') {
					toast.loading('Creating your resume...', { id: 'create-resume' });
					
					try {
						const result = await publishResume();
						toast.dismiss('create-resume');
						toast.success('Resume created successfully!');
						handleClose();
						
						// Redirect to dashboard with created flag
						setTimeout(() => {
							goto(`/dashboard?created=true&resumeId=${result.record.id}`);
						}, 500);
					} catch (error) {
						toast.dismiss('create-resume');
						console.error('Failed to create resume:', error);
						toast.error('Failed to create resume. Please try again.');
					}
				} else {
					// In 'populate' mode, just update the builder
					toast.success('Resume sections generated successfully!');
					handleClose();
				}
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
							Generate Resume Content
						</h2>
						<p class="text-sm text-gray-500 mt-0.5">
							Populate sections with your profile data or industry templates
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
				<!-- Generation Mode Selection -->
				<div class="space-y-3">
					<label class="block text-sm font-medium text-gray-700">
						Generation Mode
					</label>
					
					<!-- Profile-based Generation -->
					<button
						type="button"
						on:click={() => { useBoilerplate = false; }}
						disabled={$storeIsGenerating}
						class="w-full text-left p-4 border-2 rounded-lg transition-all hover:border-blue-300 hover:bg-blue-50 disabled:opacity-50 {!useBoilerplate
							? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
							: 'border-gray-200'}"
					>
						<div class="flex items-start gap-3">
							<div class="p-2 bg-blue-100 rounded-lg mt-0.5">
								<Sparkles class="w-5 h-5 text-blue-600" />
							</div>
							<div class="flex-1">
								<div class="font-medium text-gray-900 flex items-center gap-2">
									Generate from My Profile
									{#if !useBoilerplate}
										<span class="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-0.5 rounded">Selected</span>
									{/if}
								</div>
								<p class="text-sm text-gray-600 mt-1">
									Uses your actual profile data to populate sections. Best for your primary industry/career focus.
								</p>
								{#if $userProfile?.target_industry && !useBoilerplate}
									<p class="text-xs text-blue-600 mt-2">
										Will use your profile industry: <strong>{$userProfile.target_industry}</strong>
									</p>
								{/if}
							</div>
						</div>
					</button>
					
					<!-- Industry Template Generation -->
					<button
						type="button"
						on:click={() => { useBoilerplate = true; }}
						disabled={$storeIsGenerating}
						class="w-full text-left p-4 border-2 rounded-lg transition-all hover:border-purple-300 hover:bg-purple-50 disabled:opacity-50 {useBoilerplate
							? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200'
							: 'border-gray-200'}"
					>
						<div class="flex items-start gap-3">
							<div class="p-2 bg-purple-100 rounded-lg mt-0.5">
								<span class="text-xl">📋</span>
							</div>
							<div class="flex-1">
								<div class="font-medium text-gray-900 flex items-center gap-2">
									Use Industry Template
									{#if useBoilerplate}
										<span class="text-xs font-medium text-purple-600 bg-purple-100 px-2 py-0.5 rounded">Selected</span>
									{/if}
								</div>
								<p class="text-sm text-gray-600 mt-1">
									Hybrid approach: Industry-specific boilerplate mixed with relevant profile data. Perfect for career changes or targeting different industries.
								</p>
							</div>
						</div>
					</button>
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
						{#if useBoilerplate}
							Select Target Industry <span class="text-red-500">*</span>
						{:else}
							Target Industry (Optional - Override Profile)
						{/if}
					</label>
					
					<!-- Auto-detect option for profile mode -->
					{#if !useBoilerplate}
						<button
							type="button"
							on:click={() => {
								targetIndustry = '';
								handleIndustryChange();
							}}
							disabled={$storeIsGenerating}
							class="w-full mb-3 text-left p-3 border-2 rounded-lg transition-all hover:border-blue-300 hover:bg-blue-50 disabled:opacity-50 {targetIndustry === ''
								? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
								: 'border-gray-200'}"
						>
							<div class="flex items-center gap-2">
								<span class="text-xl">🤖</span>
								<div class="flex-1">
									<div class="text-sm font-medium text-gray-900">
										Use Profile Industry
									</div>
									<div class="text-xs text-gray-500">
										{#if $userProfile?.target_industry}
											Currently set to: <strong>{$userProfile.target_industry}</strong>
										{:else}
											No industry set in profile
										{/if}
									</div>
								</div>
								{#if targetIndustry === ''}
									<span class="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-0.5 rounded">Active</span>
								{/if}
							</div>
						</button>
						
						<p class="text-xs text-gray-600 mb-3">
							Or select a different industry below to override:
						</p>
					{/if}
					
					<div class="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
						{#each industries.slice(1) as industry}
							<button
								type="button"
								on:click={() => {
									targetIndustry = industry.value;
									handleIndustryChange();
								}}
								disabled={$storeIsGenerating}
								class="text-left p-3 border-2 rounded-lg transition-all disabled:opacity-50 {targetIndustry === industry.value
									? useBoilerplate 
										? 'border-purple-500 bg-purple-50 hover:border-purple-600'
										: 'border-blue-500 bg-blue-50 hover:border-blue-600'
									: 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}"
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
					
					<div class="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
						<p class="text-xs text-gray-600">
							{#if useBoilerplate}
								<strong>Industry Template Mode:</strong> Select an industry to use its boilerplate content mixed with relevant data from your profile.
							{:else}
								<strong>Profile Mode:</strong> Uses your profile's industry by default. Select a different industry to tailor the content for that field.
							{/if}
						</p>
					</div>
				</div>

				<!-- Info Box -->
				<div class="border rounded-lg p-4 {useBoilerplate ? 'bg-purple-50 border-purple-200' : 'bg-blue-50 border-blue-200'}">
					<div class="flex items-start gap-2">
						<AlertCircle class="w-5 h-5 {useBoilerplate ? 'text-purple-600' : 'text-blue-600'} mt-0.5 flex-shrink-0" />
						<div class="flex-1">
							<p class="text-sm font-medium {useBoilerplate ? 'text-purple-900' : 'text-blue-900'} mb-1">
								{#if useBoilerplate}
									Industry Template Mode
								{:else}
									Profile-Based Generation
								{/if}
							</p>
							<p class="text-sm {useBoilerplate ? 'text-purple-700' : 'text-blue-700'}">
								{#if useBoilerplate}
									Selected sections will be populated with industry-specific boilerplate content mixed with relevant data from your profile (name, contact info, skills). Perfect for creating resumes for different industries or career changes.
								{:else}
									Selected sections will be populated with your actual profile data. Empty fields will be filled, but any content you've already edited will be preserved. Best for your primary career focus.
								{/if}
							</p>
						</div>
					</div>
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
