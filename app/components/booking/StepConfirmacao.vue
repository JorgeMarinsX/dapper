<script setup lang="ts">
import type { UnidadePublica, ServicoPublico, BarbeiroPublico } from '~/types/entities'

const props = defineProps<{
  unidade: UnidadePublica | null
  servico: ServicoPublico | null
  barbeiro: BarbeiroPublico | null
  data: string
  horario: string
  loading: boolean
  error: string
}>()

const nome = defineModel<string>('nome', { required: true })
const telefone = defineModel<string>('telefone', { required: true })
const email = defineModel<string>('email', { required: true })

const emit = defineEmits<{ submit: [] }>()

const canSubmit = computed(() => nome.value.trim().length >= 2 && telefone.value.trim().length >= 10)
</script>

<template>
  <div class="flex flex-col gap-4">
    <h2 class="text-lg font-semibold">Seus dados</h2>

    <UCard>
      <div class="flex flex-col gap-4">
        <UFormField label="Nome" required>
          <UInput v-model="nome" placeholder="Seu nome completo" size="xl" />
        </UFormField>
        <UFormField label="Telefone" required>
          <UInput v-model="telefone" placeholder="(11) 99999-9999" size="xl" />
        </UFormField>
        <UFormField label="E-mail">
          <UInput v-model="email" type="email" placeholder="seu@email.com (opcional)" size="xl" />
        </UFormField>
      </div>
    </UCard>

    <UCard>
      <template #header>
        <h3 class="font-semibold text-sm">Resumo do agendamento</h3>
      </template>
      <div class="flex flex-col gap-2 text-sm">
        <div class="flex justify-between">
          <span class="text-muted">Unidade</span>
          <span class="font-medium">{{ unidade?.nome }}</span>
        </div>
        <USeparator />
        <div class="flex justify-between">
          <span class="text-muted">Serviço</span>
          <span class="font-medium">{{ servico?.nome }}</span>
        </div>
        <USeparator />
        <div class="flex justify-between">
          <span class="text-muted">Profissional</span>
          <span class="font-medium">{{ barbeiro?.nome }}</span>
        </div>
        <USeparator />
        <div class="flex justify-between">
          <span class="text-muted">Data e horário</span>
          <span class="font-medium">{{ formatData(data + 'T12:00:00Z') }} às {{ horario }}</span>
        </div>
        <USeparator />
        <div class="flex justify-between">
          <span class="text-muted">Valor</span>
          <span class="font-semibold text-primary">{{ servico ? formatPreco(servico.preco) : '' }}</span>
        </div>
      </div>
    </UCard>

    <UButton
      label="Confirmar Agendamento"
      icon="i-lucide-calendar-check"
      size="xl" block
      :loading="loading"
      :disabled="!canSubmit"
      @click="emit('submit')"
    />

    <p v-if="error" class="text-sm text-red-500 text-center">{{ error }}</p>
  </div>
</template>
