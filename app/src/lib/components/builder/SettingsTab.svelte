<script lang="ts">
	import { builderData, updateSettings } from '$lib/stores/resumeBuilder.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Layout, Palette } from 'lucide-svelte';

	$: settings = $builderData.settings;

	function updateLayout(layout: '1-page' | '2-page') {
		updateSettings({ layout });
	}

	function updateTemplate(template: 'modern' | 'classic' | 'minimal') {
		updateSettings({ template });
	}

	function updateColorScheme(colorScheme: 'blue' | 'green' | 'purple' | 'black') {
		updateSettings({ colorScheme });
	}

	export let onNext: () => void;
	export let onPrevious: () => void;
</script>

<div class="space-y-8">
	<!-- Layout Toggle -->
	<div class="space-y-4">
		<div class="flex items-center gap-2">
			<Layout class="w-5 h-5" />
			<h3 class="text-lg font-semibold">Resume Length</h3>
		</div>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<button
				class="p-4 border rounded-lg text-left transition-all hover:border-primary {settings.layout === '1-page' ? 'border-primary bg-primary/5' : 'border-border'}"
				on:click={() => updateLayout('1-page')}
			>
				<div class="font-medium mb-2">1 Page</div>
				<p class="text-sm text-muted-foreground">
					Perfect for entry-level positions. Concise and focused.
				</p>
			</button>
			
			<button
				class="p-4 border rounded-lg text-left transition-all hover:border-primary {settings.layout === '2-page' ? 'border-primary bg-primary/5' : 'border-border'}"
				on:click={() => updateLayout('2-page')}
			>
				<div class="font-medium mb-2">2 Pages Max</div>
				<p class="text-sm text-muted-foreground">
					More space for experience and projects. Still professional.
				</p>
			</button>
		</div>
	</div>

	<!-- Template Selection -->
	<div class="space-y-4">
		<div class="flex items-center gap-2">
			<Layout class="w-5 h-5" />
			<h3 class="text-lg font-semibold">Template Style</h3>
		</div>
		<div class="grid grid-cols-3 gap-3">
			{#each ['modern', 'classic', 'minimal'] as template}
				<button
					class="p-3 border rounded-lg text-center transition-all hover:border-primary {settings.template === template ? 'border-primary bg-primary/5' : 'border-border'}"
					on:click={() => updateTemplate(template)}
				>
					<div class="font-medium capitalize">{template}</div>
				</button>
			{/each}
		</div>
	</div>

	<!-- Color Scheme -->
	<div class="space-y-4">
		<div class="flex items-center gap-2">
			<Palette class="w-5 h-5" />
			<h3 class="text-lg font-semibold">Color Scheme</h3>
		</div>
		<div class="grid grid-cols-4 gap-3">
			{#each [
				{ name: 'blue', color: 'bg-blue-500' },
				{ name: 'green', color: 'bg-green-500' },
				{ name: 'purple', color: 'bg-purple-500' },
				{ name: 'black', color: 'bg-gray-800' }
			] as scheme}
				<button
					class="p-3 border rounded-lg text-center transition-all hover:border-primary {settings.colorScheme === scheme.name ? 'border-primary bg-primary/5' : 'border-border'}"
					on:click={() => updateColorScheme(scheme.name)}
				>
					<div class="w-6 h-6 {scheme.color} rounded mx-auto mb-1"></div>
					<div class="text-sm capitalize">{scheme.name}</div>
				</button>
			{/each}
		</div>
	</div>

	<div class="bg-muted p-4 rounded-lg">
		<h4 class="font-medium mb-2">💡 Layout Tips</h4>
		<ul class="text-sm text-muted-foreground space-y-1">
			<li>• 1-page resumes are preferred for entry-level positions</li>
			<li>• 2-page resumes work well if you have significant experience</li>
			<li>• Modern template works well for tech and creative fields</li>
			<li>• Classic template is great for traditional industries</li>
			<li>• Choose colors that match your industry standards</li>
		</ul>
	</div>

	<div class="flex justify-between">
		<Button variant="outline" on:click={onPrevious}>
			Previous
		</Button>
		<Button on:click={onNext}>
			Next: Preview
		</Button>
	</div>
</div>