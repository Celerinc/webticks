<script setup>
import { onMounted } from 'vue';
import inject from '@webticks/core';

onMounted(() => {
  inject();
});
</script>

<template>
  <!-- No UI, just side effect -->
</template>
