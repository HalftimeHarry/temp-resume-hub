<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import * as Card from "$lib/components/ui/card";
	
	let name = 'Resume Hub';
</script>

<svelte:head>
	<title>Welcome to {name}</title>
	<meta name="description" content="Resume Hub - Your professional resume platform" />
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<section class="text-center mb-8">
		<h1 class="text-4xl font-bold text-gray-900 mb-4">Welcome to {name}</h1>
		<p class="text-xl text-gray-600 mb-8">Your professional resume platform is ready to be built!</p>
		
		<div class="flex gap-4 justify-center">
			<Button variant="default">Get Started</Button>
			<Button variant="outline">Learn More</Button>
		</div>
	</section>
	
	<div class="max-w-2xl mx-auto">
		<Card.Root>
			<Card.Header>
				<Card.Title>Getting Started</Card.Title>
				<Card.Description>This is a SvelteKit application with TypeScript, TailwindCSS, and shadcn-svelte components.</Card.Description>
			</Card.Header>
			<Card.Content>
				<ul class="space-y-2 text-sm text-gray-600">
					<li>✅ <strong>SvelteKit</strong> - Full-stack web framework</li>
					<li>✅ <strong>TypeScript</strong> - Type-safe development</li>
					<li>✅ <strong>TailwindCSS</strong> - Utility-first styling</li>
					<li>✅ <strong>shadcn-svelte</strong> - Beautiful UI components</li>
					<li>✅ <strong>Vitest</strong> - Testing framework</li>
				</ul>
			</Card.Content>
			<Card.Footer>
				<p class="text-sm text-gray-500">
					Edit <code class="bg-gray-100 px-2 py-1 rounded">src/routes/+page.svelte</code> to customize this page
				</p>
			</Card.Footer>
		</Card.Root>
		
		<Card.Root class="mt-6">
			<Card.Header>
				<Card.Title>Next Steps</Card.Title>
			</Card.Header>
			<Card.Content>
				<div class="grid gap-4 md:grid-cols-2">
					<div>
						<h4 class="font-semibold mb-2">Development</h4>
						<ul class="text-sm text-gray-600 space-y-1">
							<li>• Add new routes in <code class="bg-gray-100 px-1 rounded">src/routes</code></li>
							<li>• Build components in <code class="bg-gray-100 px-1 rounded">src/lib</code></li>
							<li>• Run tests with <code class="bg-gray-100 px-1 rounded">npm run test</code></li>
						</ul>
					</div>
					<div>
						<h4 class="font-semibold mb-2">Components</h4>
						<ul class="text-sm text-gray-600 space-y-1">
							<li>• Button and Card components ready</li>
							<li>• Add more with <code class="bg-gray-100 px-1 rounded">pnpm dlx shadcn-svelte add [component]</code></li>
							<li>• Customize in <code class="bg-gray-100 px-1 rounded">components.json</code></li>
						</ul>
					</div>
				</div>
			</Card.Content>
		</Card.Root>
	</div>
</div>