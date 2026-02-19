<script setup lang="ts">
import type { UnidadePublica } from '~/types/entities'

defineProps<{ unidades: UnidadePublica[] }>()
const emit = defineEmits<{ select: [unidade: UnidadePublica] }>()
</script>

<template>
  <div class="flex flex-col gap-3">
    <h2 class="text-lg font-semibold">Selecione a unidade</h2>
    <UCard
      v-for="u in unidades" :key="u.id"
      class="cursor-pointer hover:ring-2 hover:ring-primary transition-all"
      @click="emit('select', u)"
    >
      <div class="flex items-center gap-3">
        <UIcon name="i-lucide-map-pin" class="size-5 text-primary shrink-0" />
        <div>
          <p class="font-medium">{{ u.nome }}</p>
          <p class="text-sm text-muted">{{ u.endereco }}</p>
        </div>
      </div>
    </UCard>
  </div>
</template>
