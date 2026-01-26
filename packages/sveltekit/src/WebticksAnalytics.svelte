<script>
  import { onMount } from "svelte";
  import inject from "@webticks/core";

  export let serverUrl = undefined;
  export let appId = undefined;
  export let debug = undefined;

  onMount(() => {
    inject({ serverUrl, appId, debug });
  });
</script>

<!-- No UI, just side effects -->
