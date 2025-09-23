<script lang="ts">
	import { builderData, updatePersonalInfo, markStepComplete, markStepIncomplete } from '$lib/stores/resumeBuilder.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { validateEmail, validatePhone } from '$lib/utils.js';

	$: personalInfo = $builderData.personalInfo;
	
	// More permissive phone validation: require at least 7 digits when provided
	$: digitsPhone = (personalInfo.phone || '').replace(/\D/g, '');
	$: phoneOk = personalInfo.phone ? digitsPhone.length >= 7 : true;
	$: isValid = personalInfo.fullName.trim() !== '' &&
				 personalInfo.email.trim() !== '' &&
				 (personalInfo.phone?.trim() !== '' ? phoneOk : true) &&
				 personalInfo.location?.trim() !== '' &&
				 validateEmail(personalInfo.email) &&
				 phoneOk;
	$: console.log('PersonalInfoTab isValid:', isValid);
	$: console.log('PersonalInfoTab isValid:', isValid);

	$: {
		if (isValid) {
			markStepComplete('personal');
		} else {
			markStepIncomplete('personal');
		}
	}

	function handleInput(field: string, value: string) {
		updatePersonalInfo({ [field]: value });
	}

	export let onNext: () => void;

	function handleNext() {
		console.log('Next clicked');
		console.log('handleNext function called');
		console.log('Next button clicked, isValid:', isValid);
		console.log('onNext prop:', onNext);
		if (isValid && onNext) {
			console.log('Calling onNext');
			try {
				onNext();
			} catch (error) {
				console.error('Error calling onNext:', error);
			}
		} else {
			console.log('Not calling onNext, isValid:', isValid, 'onNext exists:', !!onNext);
		}
	}
</script>

<div class="space-y-6">
	<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
		<div class="space-y-2">
			<label for="fullName" class="text-sm font-medium">Full Name *</label>
			<Input
				id="fullName"
				placeholder="John Doe"
				value={personalInfo.fullName}
				on:input={(e) => handleInput('fullName', e.target.value)}
				required
			/>
		</div>

		<div class="space-y-2">
			<label for="email" class="text-sm font-medium">Email Address *</label>
			<Input
				id="email"
				type="email"
				placeholder="john.doe@email.com"
				value={personalInfo.email}
				on:input={(e) => handleInput('email', e.target.value)}
				required
			/>
			{#if personalInfo.email && !validateEmail(personalInfo.email)}
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
				value={personalInfo.phone || ''}
				on:input={(e) => handleInput('phone', e.target.value)}
				required
			/>
			{#if personalInfo.phone && !phoneOk}
				<p class="text-sm text-destructive">Please enter a valid phone number</p>
			{/if}
		</div>

		<div class="space-y-2">
			<label for="location" class="text-sm font-medium">Location *</label>
			<Input
				id="location"
				placeholder="City, State"
				value={personalInfo.location || ''}
				on:input={(e) => handleInput('location', e.target.value)}
				required
			/>
		</div>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
		<div class="space-y-2">
			<label for="linkedin" class="text-sm font-medium">LinkedIn Profile</label>
			<Input
				id="linkedin"
				placeholder="linkedin.com/in/johndoe"
				value={personalInfo.linkedin || ''}
				on:input={(e) => handleInput('linkedin', e.target.value)}
			/>
		</div>

		<div class="space-y-2">
			<label for="website" class="text-sm font-medium">Portfolio/Website</label>
			<Input
				id="website"
				placeholder="johndoe.com"
				value={personalInfo.website || ''}
				on:input={(e) => handleInput('website', e.target.value)}
			/>
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
			Next: Summary
		</Button>
	</div>
</div>