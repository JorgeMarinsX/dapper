<script setup lang="ts">
import type { ServicoPublico } from '~/types/entities'

defineProps<{ servicos: ServicoPublico[]; loading: boolean }>()
const emit = defineEmits<{ select: [servico: ServicoPublico] }>()
</script>

<template>
  <div class="flex flex-col gap-3">
    <h2 class="text-lg font-semibold">Selecione o serviço</h2>
    <UCard
      v-for="s in servicos" :key="s.id"
      class="cursor-pointer hover:ring-2 hover:ring-primary transition-all"
      @click="emit('select', s)"
    >
      <div class="flex items-center justify-between">
        <div>
          <p class="font-medium">{{ s.nome }}</p>
          <p class="text-sm text-muted">{{ formatDuracao(s.duracao) }}</p>
        </div>
        <p class="font-semibold text-primary">{{ formatPreco(s.preco) }}</p>
      </div>
    </UCard>
    <p v-if="!loading && servicos.length === 0" class="text-sm text-muted text-center py-4">
      Nenhum serviço disponível.
    </p>
  </div>
</template>
