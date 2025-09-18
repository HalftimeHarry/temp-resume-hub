<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { deviceInfo } from '$lib/utils/responsive';
  
  export let variant = 'default';
  export let size = 'default';
  export let disabled = false;
  export let className = '';
  
  let isTouchDevice = false;
  
  // Subscribe to device info to determine if touch-friendly sizing is needed
  deviceInfo.subscribe(info => {
    isTouchDevice = info.touchSupported;
  });
  
  function getTouchFriendlySize() {
    if (!isTouchDevice) return size;
    
    // Ensure minimum touch target size of 44px
    switch (size) {
      case 'sm':
        return 'default'; // Upgrade small to default for touch
      case 'lg':
        return 'lg';
      case 'icon':
        return 'default'; // Upgrade icon to default for touch
      default:
        return size;
    }
  }
  
  function getTouchFriendlyClasses() {
    const baseClasses = isTouchDevice ? 'touch-target' : '';
    return `${baseClasses} ${className}`.trim();
  }
</script>

<Button 
  {variant} 
  size={getTouchFriendlySize()} 
  {disabled}
  class={getTouchFriendlyClasses()}
  on:click
>
  <slot />
</Button>