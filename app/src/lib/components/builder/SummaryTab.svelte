<script lang="ts">
	import { builderData, updateSummary, markStepComplete, markStepIncomplete, characterLimits } from '$lib/stores/resumeBuilder.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { Button } from '$lib/components/ui/button/index.js';

	$: summary = $builderData.summary;
	$: maxLength = characterLimits.summary;
	$: remainingChars = maxLength - summary.length;
	$: isValid = summary.trim().length >= 50 && summary.length <= maxLength;

	$: {
		if (isValid) {
			markStepComplete('summary');
		} else {
			markStepIncomplete('summary');
		}
	}

	function handleInput(value: string) {
		updateSummary(value);
	}

	const examples = [
		"Recent Computer Science graduate with strong foundation in programming languages including Java and Python. Eager to apply problem-solving skills and learn new technologies in a collaborative team environment. Seeking an entry-level software developer position.",
		"Motivated business student with internship experience in marketing and customer service. Excellent communication skills and proficiency in Microsoft Office Suite. Looking to start a career in business development where I can contribute to company growth.",
		"Detail-oriented Marketing graduate with hands-on experience in social media management and content creation. Strong analytical skills with experience in Google Analytics. Seeking to leverage creativity and data-driven approach in a digital marketing role."
	];

	export let onNext: () => void;
	export let onPrevious: () => void;
</script>

<div class="space-y-6">
	<div class="space-y-2">
		<label for="summary" class="text-sm font-medium">
			Professional Summary * 
			<span class="text-muted-foreground">({maxLength} characters max)</span>
		</label>
		<div class="relative">
			<Textarea
				id="summary"
				placeholder="Write a compelling summary that showcases your strengths, relevant skills, and career objectives..."
				value={summary}
				maxlength={maxLength}
				rows={4}
				on:input={(e) => handleInput(e.target.value)}
				required
				class="pr-20"
			/>
			<div class="absolute bottom-2 right-2 text-xs {remainingChars < 0 ? 'text-destructive' : 'text-muted-foreground'}">
				{remainingChars} left
			</div>
		</div>
		{#if summary.trim().length < 50}
			<p class="text-sm text-muted-foreground">
				Write at least 50 characters for a meaningful summary
			</p>
		{/if}
	</div>

	<div class="bg-muted p-4 rounded-lg">
		<h4 class="font-medium mb-3">💡 Writing Tips</h4>
		<ul class="text-sm text-muted-foreground space-y-1 mb-4">
			<li>• Start with your degree or current status (e.g., "Recent graduate...")</li>
			<li>• Mention 2-3 key skills or strengths</li>
			<li>• Include your career goal or type of position you're seeking</li>
			<li>• Keep it concise but impactful</li>
			<li>• Avoid using "I" - write in third person</li>
		</ul>

		<h5 class="font-medium mb-2">Example Summaries:</h5>
		<div class="space-y-3">
			{#each examples as example, i}
				<div class="bg-background p-3 rounded border">
					<p class="text-sm">{example}</p>
					<button 
						class="text-xs text-primary hover:underline mt-2"
						on:click={() => handleInput(example)}
					>
						Use this example
					</button>
				</div>
			{/each}
		</div>
	</div>

	<div class="flex justify-between">
		<Button variant="outline" on:click={onPrevious}>
			Previous
		</Button>
		<Button disabled={!isValid} on:click={onNext}>
			Next: Experience
		</Button>
	</div>
</div>