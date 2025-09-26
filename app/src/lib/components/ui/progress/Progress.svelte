<!--
  Progress Component
  A simple progress bar component for showing completion status
-->

<script lang="ts">
  export let value: number = 0;
  export let max: number = 100;
  export let className: string = '';
  
  $: percentage = Math.min(Math.max((value / max) * 100, 0), 100);
</script>

<div 
  class="w-full bg-gray-200 rounded-full overflow-hidden {className}"
  role="progressbar"
  aria-valuenow={value}
  aria-valuemin="0"
  aria-valuemax={max}
>
  <div 
    class="bg-blue-600 h-full transition-all duration-300 ease-out rounded-full"
    style="width: {percentage}%"
  ></div>
</div>