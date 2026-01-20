<script lang="ts">
	import favicon from "$lib/assets/favicon.svg";
	import { WebticksAnalytics } from "@webticks/sveltekit";

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<WebticksAnalytics />
{@render children()}
