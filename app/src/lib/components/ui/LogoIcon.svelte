<script>
	export let size = 24; // Size in pixels
</script>

<svg 
	width={size} 
	height={size} 
	viewBox="0 0 60 60" 
	fill="none" 
	xmlns="http://www.w3.org/2000/svg"
	class="logo-icon"
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
</svg>

<style>
	.logo-icon {
		color: inherit;
	}
</style>