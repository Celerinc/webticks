<script setup>
import { onMounted } from 'vue';
import inject from '@webticks/core';

const props = defineProps({
  serverUrl: String,
  appId: String,
  debug: Boolean
});

onMounted(() => {
  inject({ serverUrl: props.serverUrl, appId: props.appId, debug: props.debug });
});
</script>

<template>
  <!-- No UI, just side effect -->
</template>
