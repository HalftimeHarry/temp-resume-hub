<script lang="ts">
	import { builderData, updatePersonalInfo, updatePurpose, updateTargetIndustry, markStepComplete, markStepIncomplete } from '$lib/stores/resumeBuilder.js';
	import { userProfile } from '$lib/stores/userProfile.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { validateEmail, validatePhone } from '$lib/utils.js';
	import { User, Target, Briefcase } from 'lucide-svelte';

	interface Props {
		onNext?: () => void;
	}

	let { onNext }: Props = $props();

	let personalInfo = $derived($builderData?.personalInfo ?? { fullName: '', email: '', phone: '', location: '', linkedin: '', website: '' });
	
	// Local fields bound to inputs
	let fullName = $state(personalInfo.fullName || '');
	let email = $state(personalInfo.email || '');
	let phone = $state(personalInfo.phone || '');
	let location = $state(personalInfo.location || '');
	let linkedin = $state(personalInfo.linkedin || '');
	let website = $state(personalInfo.website || '');
	let purpose = $state($builderData?.purpose || '');
	let target_industry = $state($builderData?.target_industry || '');
	
	// When the store personalInfo changes, update local fields
	$effect(() => {
		if (personalInfo) {
			fullName = personalInfo.fullName || '';
			email = personalInfo.email || '';
			phone = personalInfo.phone || '';
			location = personalInfo.location || '';
			linkedin = personalInfo.linkedin || '';
			website = personalInfo.website || '';
		}
	});
	
	// Sync builder data changes to local fields
	$effect(() => {
		purpose = $builderData?.purpose || '';
		target_industry = $builderData?.target_industry || '';
	});
	
	// Sync local fields back to the store
	$effect(() => {
		updatePersonalInfo({ fullName, email, phone, location, linkedin, website });
	});
	
	// Sync purpose and target_industry
	$effect(() => {
		if (purpose !== $builderData?.purpose) {
			updatePurpose(purpose);
		}
	});
	
	$effect(() => {
		if (target_industry !== $builderData?.target_industry) {
			updateTargetIndustry(target_industry);
		}
	});
	
	// More permissive phone validation: require at least 7 digits when provided
	let digitsPhone = $derived((phone || '').replace(/\D/g, ''));
	let phoneOk = $derived(phone ? digitsPhone.length >= 7 : true);
	// Step validity: require name, email; phone/location optional
	let isValid = $derived(fullName.trim() !== '' && email.trim() !== '' && validateEmail(email));
	
	// Update step completion status based on validation
	$effect(() => {
		if (isValid) {
			markStepComplete('personal');
		} else {
			markStepIncomplete('personal');
		}
	});

	// Check if data comes from profile
	let profile = $derived($userProfile);
	let hasProfileData = $derived(profile && (
		(profile.first_name && profile.last_name && fullName.includes(profile.first_name)) ||
		(profile.phone && phone === profile.phone) ||
		(profile.location && location === profile.location) ||
		(profile.linkedin_url && linkedin === profile.linkedin_url) ||
		(profile.portfolio_url && website === profile.portfolio_url)
	));

	function handleNext() {
		console.log('Next clicked');
		console.log('handleNext function called');
		console.log('Next button clicked, isValid:', isValid);
		console.log('onNext prop:', onNext);
		if (isValid && onNext) {
			onNext();
		}
	}
</script>

<div class="space-y-6">
	<!-- Profile Data Indicator -->
	{#if hasProfileData}
		<div class="bg-green-50 border border-green-200 rounded-lg p-3">
			<div class="flex items-center gap-2">
				<User class="w-4 h-4 text-green-600" />
				<p class="text-sm text-green-800">
					Some information has been imported from your profile. You can edit any field as needed.
				</p>
			</div>
		</div>
	{/if}

	<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
		<div class="space-y-2">
			<label for="fullName" class="text-sm font-medium">Full Name *</label>
			<Input
			id="fullName"
			placeholder="John Doe"
			bind:value={fullName}
			required
			/>
		</div>

		<div class="space-y-2">
			<label for="email" class="text-sm font-medium">Email Address *</label>
			<Input
			id="email"
			type="email"
			placeholder="john.doe@email.com"
			bind:value={email}
			required
			/>
			{#if email && !validateEmail(email)}
			 <p class="text-sm text-destructive">Please enter a valid email address</p>
			{/if}
		</div>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
		<div class="space-y-2">
			<label for="phone" class="text-sm font-medium">Phone Number *</label>
			<Input
			id="phone"
			type="tel"
			placeholder="(555) 123-4567"
			bind:value={phone}
			/>
			{#if phone && !phoneOk}
			 <p class="text-sm text-destructive">Please enter a valid phone number</p>
			{/if}
		</div>

		<div class="space-y-2">
			<label for="location" class="text-sm font-medium">Location *</label>
			<Input
			id="location"
			placeholder="City, State"
			bind:value={location}
			/>
		</div>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
		<div class="space-y-2">
			<label for="linkedin" class="text-sm font-medium">LinkedIn Profile</label>
			<Input
			id="linkedin"
			placeholder="linkedin.com/in/johndoe"
			bind:value={linkedin}
			/>
		</div>

		<div class="space-y-2">
			<label for="website" class="text-sm font-medium">Portfolio/Website</label>
			<Input
			id="website"
			placeholder="johndoe.com"
			bind:value={website}
			/>
		</div>
	</div>

	<!-- Resume Purpose and Target Industry -->
	<div class="border-t pt-6 mt-6">
		<div class="flex items-center gap-2 mb-4">
			<Target class="w-5 h-5 text-primary" />
			<h3 class="text-lg font-semibold">Resume Purpose & Target</h3>
		</div>
		<p class="text-sm text-muted-foreground mb-4">
			Help tailor your resume by specifying its purpose and target industry. This information helps organize and optimize your resumes.
		</p>
		
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div class="space-y-2">
				<label for="purpose" class="text-sm font-medium flex items-center gap-2">
					<Briefcase class="w-4 h-4" />
					Purpose
				</label>
				<Input
					id="purpose"
					placeholder="e.g., Frontend Developer - Tech Startup"
					bind:value={purpose}
				/>
				<p class="text-xs text-muted-foreground">
					Describe the specific role or purpose for this resume
				</p>
			</div>

			<div class="space-y-2">
				<label for="target_industry" class="text-sm font-medium flex items-center gap-2">
					<Target class="w-4 h-4" />
					Target Industry
				</label>
				<Input
					id="target_industry"
					placeholder="e.g., Technology, Healthcare, Finance"
					bind:value={target_industry}
				/>
				<p class="text-xs text-muted-foreground">
					The industry you're targeting with this resume
				</p>
			</div>
		</div>
	</div>

	<div class="bg-muted p-4 rounded-lg">
		<h4 class="font-medium mb-2">💡 Tips for First-Time Job Seekers</h4>
		<ul class="text-sm text-muted-foreground space-y-1">
			<li>• Use a professional email address (avoid nicknames)</li>
			<li>• Include your city and state (no need for full address)</li>
			<li>• Make sure your phone number has a professional voicemail</li>
			<li>• LinkedIn is highly recommended for professional networking</li>
		</ul>
	</div>

	<div class="flex justify-end">
		<Button disabled={!isValid} on:click={handleNext}>
			Save & Continue
		</Button>
	</div>
</div>