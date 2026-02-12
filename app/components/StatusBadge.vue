<script setup lang="ts">
defineProps<{
  label: string
  color: 'success' | 'warning' | 'info' | 'neutral' | 'error'
}>()
</script>

<template>
  <UBadge :label="label" :color="color" variant="subtle" size="sm" />
</template>
