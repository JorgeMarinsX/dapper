<script setup lang="ts">
import type { BarbeiroPublico } from '~/types/entities'

defineProps<{ barbeiros: BarbeiroPublico[]; loading: boolean }>()
const emit = defineEmits<{ select: [barbeiro: BarbeiroPublico] }>()
</script>

<template>
  <div class="flex flex-col gap-3">
    <h2 class="text-lg font-semibold">Selecione o profissional</h2>
    <UCard
      v-for="b in barbeiros" :key="b.id"
      class="cursor-pointer hover:ring-2 hover:ring-primary transition-all"
      @click="emit('select', b)"
    >
      <div class="flex items-center gap-3">
        <UAvatar :alt="b.nome" :src="b.foto || undefined" size="lg" />
        <p class="font-medium">{{ b.nome }}</p>
      </div>
    </UCard>
    <p v-if="!loading && barbeiros.length === 0" class="text-sm text-muted text-center py-4">
      Nenhum profissional disponível nesta unidade.
    </p>
  </div>
</template>
