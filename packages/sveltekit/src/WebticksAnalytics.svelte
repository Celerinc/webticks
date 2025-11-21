<script>
  import { onMount } from 'svelte';
  import inject from '@webticks/core';

  onMount(() => {
    inject();
  });
</script>

<!-- No UI, just side effects -->
