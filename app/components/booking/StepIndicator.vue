<script setup lang="ts">
const props = defineProps<{ current: number; total: number }>()
</script>

<template>
  <div class="flex items-center justify-center gap-2 mb-6">
    <template v-for="i in total" :key="i">
      <div
        class="flex items-center justify-center size-8 rounded-full text-xs font-semibold transition-colors"
        :class="current >= i ? 'bg-primary text-white' : 'bg-elevated text-muted'"
      >
        <UIcon v-if="current > i" name="i-lucide-check" class="size-4" />
        <span v-else>{{ i }}</span>
      </div>
      <div v-if="i < total" class="h-px w-6 bg-elevated" />
    </template>
  </div>
</template>
