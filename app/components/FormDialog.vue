<script setup lang="ts">
defineProps<{
  title: string
  loading?: boolean
}>()

const open = defineModel<boolean>({ required: true })
const emit = defineEmits<{ save: [] }>()
</script>

<template>
  <UModal v-model:open="open">
    <template #header>
      <h2 class="font-semibold">{{ title }}</h2>
    </template>

    <div class="p-4">
      <slot />
    </div>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton label="Cancelar" variant="ghost" color="neutral" @click="open = false" />
        <UButton label="Salvar" :loading="loading" @click="emit('save')" />
      </div>
    </template>
  </UModal>
</template>
