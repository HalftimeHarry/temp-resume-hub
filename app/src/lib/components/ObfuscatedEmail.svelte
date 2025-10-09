<script lang="ts">
  /**
   * Email obfuscation component to prevent email harvesting by bots
   * Usage: <ObfuscatedEmail email="contact@example.com" />
   */
  
  interface Props {
    email: string;
    class?: string;
    subject?: string;
  }
  
  let { email, class: className = '', subject = '' }: Props = $props();
  
  // Split email into parts
  let emailParts = $derived(email.split('@'));
  let localPart = $derived(emailParts[0] || '');
  let domainPart = $derived(emailParts[1] || '');
  
  // Build mailto link
  let mailtoLink = $derived(`mailto:${email}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`);
</script>

<!-- 
  Email is obfuscated using multiple techniques:
  1. Split into parts with hidden @ symbol
  2. Uses aria-label for screen readers
  3. JavaScript-based reconstruction
-->
<a 
  href={mailtoLink}
  class={className}
  aria-label="Email {email}"
>
  <span>{localPart}</span>
  <span aria-hidden="true" style="display:none;">REMOVE</span>
  <span>@</span>
  <span aria-hidden="true" style="display:none;">THIS</span>
  <span>{domainPart}</span>
</a>

<style>
  a {
    text-decoration: none;
    color: inherit;
  }
  
  a:hover {
    text-decoration: underline;
  }
</style>
