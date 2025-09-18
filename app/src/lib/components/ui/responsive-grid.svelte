<script lang="ts">
  import { onMount } from 'svelte';
  import { deviceInfo } from '$lib/utils/responsive';
  
  export let cols = {
    mobile: 1,
    tablet: 2,
    desktop: 3,
    large: 4
  };
  export let gap = 'gap-4';
  export let className = '';
  
  let currentCols = cols.desktop;
  
  onMount(() => {
    const unsubscribe = deviceInfo.subscribe(info => {
      if (info.isMobile) {
        currentCols = cols.mobile;
      } else if (info.isTablet) {
        currentCols = cols.tablet;
      } else if (info.screenWidth >= 1280) {
        currentCols = cols.large;
      } else {
        currentCols = cols.desktop;
      }
    });
    
    return unsubscribe;
  });
  
  function getGridClasses() {
    const colsClass = `grid-cols-${currentCols}`;
    return `grid ${colsClass} ${gap} ${className}`;
  }
</script>

<div class={getGridClasses()}>
  <slot />
</div>