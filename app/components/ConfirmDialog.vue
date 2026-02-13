<script setup lang="ts">
defineProps<{
  title?: string
  description?: string
  confirmLabel?: string
  loading?: boolean
}>()

const open = defineModel<boolean>({ required: true })
const emit = defineEmits<{ confirm: [] }>()
</script>

<template>
  <UModal v-model:open="open">
    <template #header>
      <h2 class="font-semibold">{{ title || 'Confirmar exclusão' }}</h2>
    </template>

    <template #body>
      <p class="text-sm text-muted">
        {{ description || 'Tem certeza que deseja excluir? Esta ação não pode ser desfeita.' }}
      </p>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton label="Cancelar" variant="ghost" color="neutral" @click="open = false" />
        <UButton
          :label="confirmLabel || 'Excluir'"
          color="error"
          :loading="loading"
          @click="emit('confirm')"
        />
      </div>
    </template>
  </UModal>
</template>
