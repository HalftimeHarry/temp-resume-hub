<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { Resume } from '$lib/types/resume';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Switch } from '$lib/components/ui/switch';
	import { Badge } from '$lib/components/ui/badge';
	import { 
		Dialog,
		DialogContent,
		DialogDescription,
		DialogFooter,
		DialogHeader,
		DialogTitle
	} from '$lib/components/ui/dialog';
	import { 
		Share2, 
		Lock, 
		Unlock, 
		Copy, 
		Check,
		QrCode,
		Eye,
		Download,
		Calendar,
		ExternalLink
	} from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import { pb } from '$lib/pocketbase';
	import { resumeStore } from '$lib/stores/resume';

	interface Props {
		resume: Resume;
		open: boolean;
	}

	let { resume, open = $bindable() }: Props = $props();

	const dispatch = createEventDispatcher<{
		updated: Resume;
		close: void;
	}>();

	let activeTab = $state<'sharing' | 'styling' | 'metadata' | 'analytics'>('sharing');
	let isPublic = $state(resume.is_public);
	let customSlug = $state(resume.slug || '');
	let isSaving = $state(false);
	let copied = $state(false);

	// Generate share URL
	let shareUrl = $derived(
		typeof window !== 'undefined' 
			? `${window.location.origin}/resume/${customSlug}`
			: ''
	);

	const tabs = [
		{ id: 'sharing', label: 'Sharing & Privacy', icon: Share2 },
		{ id: 'styling', label: 'Styling', icon: null },
		{ id: 'metadata', label: 'Info', icon: null },
		{ id: 'analytics', label: 'Stats', icon: null }
	];

	async function handleSave() {
		isSaving = true;
		try {
			// Update resume in database
			const updated = await pb.collection('resumes').update(resume.id, {
				is_public: isPublic,
				slug: customSlug,
				updated: new Date().toISOString()
			});

			// Update local store
			await resumeStore.loadUserResumes();

			toast.success('Settings saved successfully!');
			dispatch('updated', updated);
		} catch (error) {
			console.error('Failed to save settings:', error);
			toast.error('Failed to save settings');
		} finally {
			isSaving = false;
		}
	}

	function handleClose() {
		open = false;
		dispatch('close');
	}

	async function copyShareLink() {
		try {
			await navigator.clipboard.writeText(shareUrl);
			copied = true;
			toast.success('Link copied to clipboard!');
			setTimeout(() => {
				copied = false;
			}, 2000);
		} catch (error) {
			toast.error('Failed to copy link');
		}
	}

	function openInNewTab() {
		if (isPublic && customSlug) {
			window.open(shareUrl, '_blank');
		}
	}
</script>

<Dialog bind:open>
	<DialogContent class="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
		<DialogHeader>
			<DialogTitle class="flex items-center gap-2">
				<span class="text-2xl">⚙️</span>
				Resume Settings
			</DialogTitle>
			<DialogDescription>
				{resume.title}
			</DialogDescription>
		</DialogHeader>

		<!-- Tabs -->
		<div class="border-b border-gray-200">
			<div class="flex space-x-1 overflow-x-auto">
				{#each tabs as tab}
					<button
						class="px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap {activeTab === tab.id
							? 'border-b-2 border-blue-600 text-blue-600'
							: 'text-gray-600 hover:text-gray-900'}"
						onclick={() => activeTab = tab.id}
					>
						{#if tab.icon}
							{@const Icon = tab.icon}
							<Icon class="w-4 h-4 inline mr-1" />
						{/if}
						{tab.label}
					</button>
				{/each}
			</div>
		</div>

		<!-- Tab Content -->
		<div class="flex-1 overflow-y-auto py-6">
			{#if activeTab === 'sharing'}
				<div class="space-y-6">
					<!-- Privacy Toggle -->
					<div class="space-y-4">
						<div class="flex items-center justify-between">
							<div class="space-y-1">
								<Label class="text-base font-semibold flex items-center gap-2">
									{#if isPublic}
										<Unlock class="w-5 h-5 text-green-600" />
										Public Resume
									{:else}
										<Lock class="w-5 h-5 text-gray-600" />
										Private Resume
									{/if}
								</Label>
								<p class="text-sm text-gray-600">
									{#if isPublic}
										Anyone with the link can view this resume
									{:else}
										Only you can view this resume
									{/if}
								</p>
							</div>
							<Switch bind:checked={isPublic} />
						</div>

						{#if !isPublic}
							<div class="bg-amber-50 border border-amber-200 rounded-lg p-4">
								<p class="text-sm text-amber-900">
									<strong>Note:</strong> This resume is private. Make it public to share with others.
								</p>
							</div>
						{/if}
					</div>

					{#if isPublic}
						<!-- Share Link -->
						<div class="space-y-3">
							<Label class="text-base font-semibold">Share Link</Label>
							<div class="flex gap-2">
								<Input
									value={shareUrl}
									readonly
									class="flex-1 bg-gray-50"
								/>
								<Button
									variant="outline"
									size="icon"
									onclick={copyShareLink}
									title="Copy link"
								>
									{#if copied}
										<Check class="w-4 h-4 text-green-600" />
									{:else}
										<Copy class="w-4 h-4" />
									{/if}
								</Button>
								<Button
									variant="outline"
									size="icon"
									onclick={openInNewTab}
									title="Open in new tab"
								>
									<ExternalLink class="w-4 h-4" />
								</Button>
							</div>
							<p class="text-xs text-gray-500">
								Share this link with employers, recruiters, or on your social media profiles.
							</p>
						</div>

						<!-- Custom Slug -->
						<div class="space-y-3">
							<Label class="text-base font-semibold">Custom URL</Label>
							<div class="flex items-center gap-2">
								<span class="text-sm text-gray-600">/resume/</span>
								<Input
									bind:value={customSlug}
									placeholder="your-name-title"
									class="flex-1"
									disabled
								/>
								<Badge variant="secondary">Pro</Badge>
							</div>
							<p class="text-xs text-gray-500">
								Custom URLs are available for Pro users. Upgrade to personalize your resume link.
							</p>
						</div>

						<!-- QR Code (Coming Soon) -->
						<div class="space-y-3">
							<Label class="text-base font-semibold flex items-center gap-2">
								<QrCode class="w-4 h-4" />
								QR Code
							</Label>
							<div class="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
								<QrCode class="w-16 h-16 mx-auto text-gray-400 mb-3" />
								<p class="text-sm text-gray-600">QR Code generation coming soon!</p>
								<p class="text-xs text-gray-500 mt-1">
									Generate a QR code to share your resume at events and on business cards.
								</p>
							</div>
						</div>
					{/if}
				</div>

			{:else if activeTab === 'styling'}
				<div class="space-y-6">
					<div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
						<p class="text-sm text-blue-900">
							<strong>Styling Options</strong> are available on the resume view page.
						</p>
						<p class="text-sm text-blue-700 mt-2">
							Click the <strong>🎨 Style Resume</strong> button when viewing your resume to customize colors, layout, and theme.
						</p>
						{#if isPublic && customSlug}
							<Button
								variant="outline"
								size="sm"
								class="mt-3"
								onclick={openInNewTab}
							>
								<ExternalLink class="w-4 h-4 mr-2" />
								Open Resume to Style
							</Button>
						{/if}
					</div>
				</div>

			{:else if activeTab === 'metadata'}
				<div class="space-y-6">
					<div class="space-y-3">
						<Label class="text-base font-semibold">Resume Title</Label>
						<Input
							value={resume.title}
							readonly
							class="bg-gray-50"
						/>
						<p class="text-xs text-gray-500">
							Edit the title in the builder or when viewing your resume.
						</p>
					</div>

					<div class="space-y-3">
						<Label class="text-base font-semibold">Target Industry</Label>
						<Input
							value={resume.target_industry || 'Not specified'}
							readonly
							class="bg-gray-50"
						/>
					</div>

					<div class="space-y-3">
						<Label class="text-base font-semibold">Purpose</Label>
						<Input
							value={resume.purpose || 'Not specified'}
							readonly
							class="bg-gray-50"
						/>
					</div>

					<div class="space-y-3">
						<Label class="text-base font-semibold">Status</Label>
						<div>
							<Badge variant={resume.status === 'active' ? 'default' : 'secondary'}>
								{resume.status || 'draft'}
							</Badge>
						</div>
					</div>
				</div>

			{:else if activeTab === 'analytics'}
				<div class="space-y-6">
					<!-- Stats Grid -->
					<div class="grid grid-cols-2 gap-4">
						<div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
							<div class="flex items-center gap-2 mb-2">
								<Eye class="w-5 h-5 text-blue-600" />
								<span class="text-sm font-medium text-blue-900">Views</span>
							</div>
							<p class="text-2xl font-bold text-blue-900">{resume.view_count || 0}</p>
						</div>

						<div class="bg-green-50 border border-green-200 rounded-lg p-4">
							<div class="flex items-center gap-2 mb-2">
								<Download class="w-5 h-5 text-green-600" />
								<span class="text-sm font-medium text-green-900">Downloads</span>
							</div>
							<p class="text-2xl font-bold text-green-900">{resume.download_count || 0}</p>
						</div>

						<div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
							<div class="flex items-center gap-2 mb-2">
								<Share2 class="w-5 h-5 text-purple-600" />
								<span class="text-sm font-medium text-purple-900">Shares</span>
							</div>
							<p class="text-2xl font-bold text-purple-900">{resume.share_count || 0}</p>
						</div>

						<div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
							<div class="flex items-center gap-2 mb-2">
								<Calendar class="w-5 h-5 text-gray-600" />
								<span class="text-sm font-medium text-gray-900">Completion</span>
							</div>
							<p class="text-2xl font-bold text-gray-900">{resume.completion_percentage || 0}%</p>
						</div>
					</div>

					<!-- Last Activity -->
					<div class="space-y-3">
						<Label class="text-base font-semibold">Last Activity</Label>
						<div class="space-y-2 text-sm">
							{#if resume.last_viewed}
								<div class="flex justify-between">
									<span class="text-gray-600">Last viewed:</span>
									<span class="font-medium">{new Date(resume.last_viewed).toLocaleDateString()}</span>
								</div>
							{/if}
							{#if resume.last_downloaded}
								<div class="flex justify-between">
									<span class="text-gray-600">Last downloaded:</span>
									<span class="font-medium">{new Date(resume.last_downloaded).toLocaleDateString()}</span>
								</div>
							{/if}
							<div class="flex justify-between">
								<span class="text-gray-600">Last updated:</span>
								<span class="font-medium">{new Date(resume.updated).toLocaleDateString()}</span>
							</div>
							<div class="flex justify-between">
								<span class="text-gray-600">Created:</span>
								<span class="font-medium">{new Date(resume.created).toLocaleDateString()}</span>
							</div>
						</div>
					</div>
				</div>
			{/if}
		</div>

		<DialogFooter>
			<Button variant="outline" onclick={handleClose} disabled={isSaving}>
				Cancel
			</Button>
			<Button onclick={handleSave} disabled={isSaving}>
				{#if isSaving}
					Saving...
				{:else}
					Save Changes
				{/if}
			</Button>
		</DialogFooter>
	</DialogContent>
</Dialog>
