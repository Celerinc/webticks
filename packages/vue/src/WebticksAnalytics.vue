<script setup>
import { onMounted } from 'vue';
import inject from '@webticks/core';

const props = defineProps({
  backendUrl: String,
  appId: String
});

onMounted(() => {
  inject({ backendUrl: props.backendUrl, appId: props.appId });
});
</script>

<template>
  <!-- No UI, just side effect -->
</template>
