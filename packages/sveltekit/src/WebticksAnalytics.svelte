<script>
  import { onMount } from 'svelte';
  import inject from '@webticks/core';

  export let backendUrl = undefined;
  export let appId = undefined;

  onMount(() => {
    inject({ backendUrl, appId });
  });
</script>

<!-- No UI, just side effects -->
