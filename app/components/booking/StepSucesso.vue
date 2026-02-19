<script setup lang="ts">
import type { AgendamentoConfirmado } from '~/types/entities'

defineProps<{ confirmacao: AgendamentoConfirmado }>()
</script>

<template>
  <div class="flex flex-col items-center gap-6 py-8">
    <div class="flex items-center justify-center size-16 rounded-full bg-green-100 dark:bg-green-900/30">
      <UIcon name="i-lucide-check" class="size-8 text-green-600 dark:text-green-400" />
    </div>
    <div class="text-center">
      <h2 class="text-xl font-bold">Agendamento realizado!</h2>
      <p class="text-sm text-muted mt-1">Aguarde a confirmação da barbearia.</p>
    </div>

    <UCard class="w-full">
      <div class="flex flex-col gap-2 text-sm">
        <div class="flex justify-between">
          <span class="text-muted">Serviço</span>
          <span class="font-medium">{{ confirmacao.servico.nome }}</span>
        </div>
        <USeparator />
        <div class="flex justify-between">
          <span class="text-muted">Profissional</span>
          <span class="font-medium">{{ confirmacao.barbeiro.nome }}</span>
        </div>
        <USeparator />
        <div class="flex justify-between">
          <span class="text-muted">Data e horário</span>
          <span class="font-medium">{{ formatData(confirmacao.dataHora) }} às {{ formatHorario(confirmacao.dataHora) }}</span>
        </div>
        <USeparator />
        <div class="flex justify-between">
          <span class="text-muted">Valor</span>
          <span class="font-semibold text-primary">{{ formatPreco(confirmacao.servico.preco) }}</span>
        </div>
      </div>
    </UCard>
  </div>
</template>
