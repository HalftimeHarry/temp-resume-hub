<script lang="ts">
	import { cn } from "$lib/utils.js";

	let className: string | undefined = undefined;
	export { className as class };
	export let placeholder: string | undefined = undefined;
</script>

<span
	class={cn("text-sm placeholder:text-muted-foreground", className)}
	{...$$restProps}
>
	<slot>{placeholder || ""}</slot>
</span>