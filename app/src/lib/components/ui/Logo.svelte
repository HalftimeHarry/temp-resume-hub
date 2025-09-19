<script>
	export let size = 'md'; // 'xs', 'sm', 'md', 'lg'
	export let showText = true;
	
	const sizes = {
		xs: { width: 32, height: 32, fontSize: 10 },
		sm: { width: 144, height: 43, fontSize: 14 },
		md: { width: 192, height: 58, fontSize: 17 },
		lg: { width: 240, height: 72, fontSize: 19 }
	};
	
	$: currentSize = sizes[size];
</script>

<svg 
	width={currentSize.width} 
	height={currentSize.height} 
	viewBox="0 0 200 60" 
	fill="none" 
	xmlns="http://www.w3.org/2000/svg"
	class="logo"
>
	<!-- Background circle -->
	<circle cx="30" cy="30" r="25" fill="currentColor" opacity="0.1"/>
	
	<!-- Document icon -->
	<rect x="18" y="15" width="16" height="20" rx="2" fill="currentColor" stroke="currentColor" stroke-width="1"/>
	<rect x="20" y="18" width="12" height="1.5" fill="white"/>
	<rect x="20" y="21" width="8" height="1.5" fill="white"/>
	<rect x="20" y="24" width="10" height="1.5" fill="white"/>
	<rect x="20" y="27" width="6" height="1.5" fill="white"/>
	
	<!-- Network/hub lines -->
	<line x1="34" y1="25" x2="42" y2="20" stroke="currentColor" stroke-width="2" opacity="0.6"/>
	<line x1="34" y1="30" x2="42" y2="30" stroke="currentColor" stroke-width="2" opacity="0.6"/>
	<line x1="34" y1="35" x2="42" y2="40" stroke="currentColor" stroke-width="2" opacity="0.6"/>
	
	<!-- Small nodes -->
	<circle cx="42" cy="20" r="2" fill="currentColor"/>
	<circle cx="42" cy="30" r="2" fill="currentColor"/>
	<circle cx="42" cy="40" r="2" fill="currentColor"/>
	
	{#if showText}
		<!-- Text -->
		<text x="55" y="25" font-family="Inter, system-ui, sans-serif" font-size={currentSize.fontSize} font-weight="700" fill="currentColor" opacity="0.8">
			Digital Resume
		</text>
		<text x="55" y="42" font-family="Inter, system-ui, sans-serif" font-size={currentSize.fontSize} font-weight="700" fill="currentColor">
			Hub
		</text>
	{/if}
</svg>

<style>
	.logo {
		color: #2563eb;
	}
</style>