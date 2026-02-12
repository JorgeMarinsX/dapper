<script setup lang="ts">
defineProps<{
  label: string
  value: string
  icon: string
  change?: string
}>()
</script>

<template>
  <UCard>
    <div class="flex items-start justify-between">
      <div>
        <p class="text-sm text-muted">{{ label }}</p>
        <p class="mt-1 text-2xl font-semibold">{{ value }}</p>
        <p v-if="change" class="mt-1 text-xs text-muted">{{ change }}</p>
      </div>
      <div class="flex size-10 items-center justify-center rounded-lg bg-primary/10">
        <UIcon :name="icon" class="size-5 text-primary" />
      </div>
    </div>
  </UCard>
</template>
