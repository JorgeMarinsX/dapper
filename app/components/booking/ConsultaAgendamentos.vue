<script setup lang="ts">
import type { AgendamentoConsulta } from '~/types/entities'

defineProps<{
  agendamentos: AgendamentoConsulta[]
  loading: boolean
  error: string
  searched: boolean
}>()

const email = defineModel<string>('email', { required: true })
const emit = defineEmits<{ consultar: []; limpar: [] }>()

function onSubmit() {
  if (email.value.trim()) {
    emit('consultar')
  }
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col gap-2">
      <h2 class="text-lg font-semibold">Consultar agendamentos</h2>
      <p class="text-sm text-muted">Informe seu e-mail para ver seus próximos agendamentos.</p>
    </div>

    <form class="flex gap-2" @submit.prevent="onSubmit">
      <UInput
        v-model="email"
        type="email"
        placeholder="seu@email.com"
        size="xl"
        class="flex-1"
        :disabled="loading"
      />
      <UButton
        type="submit"
        label="Buscar"
        icon="i-lucide-search"
        size="xl"
        :loading="loading"
        :disabled="!email.trim()"
      />
    </form>

    <!-- Skeleton while loading -->
    <div v-if="loading" class="flex flex-col gap-3">
      <UCard v-for="i in 3" :key="i">
        <div class="flex flex-col gap-3">
          <div class="flex justify-between">
            <USkeleton class="h-4 w-32" />
            <USkeleton class="h-4 w-20" />
          </div>
          <USeparator />
          <div class="flex justify-between">
            <USkeleton class="h-4 w-24" />
            <USkeleton class="h-4 w-28" />
          </div>
          <USeparator />
          <div class="flex justify-between">
            <USkeleton class="h-4 w-20" />
            <USkeleton class="h-4 w-16" />
          </div>
        </div>
      </UCard>
    </div>

    <!-- Error / not found -->
    <UCard v-else-if="error && searched" class="text-center">
      <div class="flex flex-col items-center gap-3 py-4">
        <UIcon name="i-lucide-calendar-x" class="size-10 text-muted" />
        <p class="text-sm text-muted">{{ error }}</p>
      </div>
    </UCard>

    <!-- Results -->
    <template v-else-if="agendamentos.length > 0">
      <p class="text-sm text-muted">
        {{ agendamentos.length }} agendamento{{ agendamentos.length > 1 ? 's' : '' }} encontrado{{ agendamentos.length > 1 ? 's' : '' }}
      </p>

      <UCard v-for="a in agendamentos" :key="a.id">
        <div class="flex flex-col gap-2 text-sm">
          <div class="flex justify-between">
            <span class="text-muted">Cliente</span>
            <span class="font-medium">{{ a.cliente.nome }}</span>
          </div>
          <USeparator />
          <div class="flex justify-between">
            <span class="text-muted">E-mail</span>
            <span class="font-medium">{{ a.cliente.email }}</span>
          </div>
          <USeparator />
          <div class="flex justify-between">
            <span class="text-muted">Profissional</span>
            <span class="font-medium">{{ a.barbeiro.nome }}</span>
          </div>
          <USeparator />
          <div class="flex justify-between">
            <span class="text-muted">Data</span>
            <span class="font-medium">{{ formatData(a.dataHora) }}</span>
          </div>
          <USeparator />
          <div class="flex justify-between">
            <span class="text-muted">Horário</span>
            <span class="font-medium">{{ formatHorario(a.dataHora) }}</span>
          </div>
          <USeparator />
          <div class="flex justify-between">
            <span class="text-muted">Serviço</span>
            <span class="font-medium">{{ a.servico.nome }}</span>
          </div>
          <USeparator />
          <div class="flex justify-between">
            <span class="text-muted">Valor</span>
            <span class="font-semibold text-primary">{{ formatPreco(a.servico.preco) }}</span>
          </div>
        </div>
      </UCard>

      <UButton
        label="Limpar busca"
        variant="ghost"
        color="neutral"
        icon="i-lucide-x"
        size="sm"
        @click="emit('limpar')"
      />
    </template>
  </div>
</template>
