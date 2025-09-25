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

<img
	src="/logo.svg"
	alt="Dashboard Logo"
	width={currentSize.width}
	height={currentSize.height}
	class="logo"
/>

<style>
	.logo {
		color: #2563eb;
	}
</style>