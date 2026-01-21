<script lang="ts">
	import favicon from "$lib/assets/favicon.svg";
	import { WebticksAnalytics } from "@webticks/sveltekit";

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<WebticksAnalytics
	backendUrl="http://localhost:3002/api/track"
	appId="97069816-8b25-4640-833f-f17259208a42"
/>
{@render children()}
