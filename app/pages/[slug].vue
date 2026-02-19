<script setup lang="ts">
definePageMeta({ layout: 'public' })

const slug = useRoute().params.slug as string
const {
  step, loading, error,
  barbearia, servicos, barbeiros, slots, confirmacao,
  selectedUnidade, selectedServico, selectedBarbeiro, selectedData, selectedHorario,
  clienteNome, clienteTelefone, clienteEmail,
  fetchBarbearia, selectUnidade, selectServico, selectBarbeiro,
  fetchSlots, selectHorario, submitAgendamento, goBack,
} = useAgendamentoPublico(slug)

await fetchBarbearia()

useHead({ title: computed(() => barbearia.value ? `${barbearia.value.nome} — Agendamento` : 'Agendamento') })

const canGoBack = computed(() => {
  if (step.value <= 1 || step.value >= 6) return false
  return !(step.value === 2 && barbearia.value?.unidades.length === 1)
})
</script>

<template>
  <div>
    <!-- 404 -->
    <UCard v-if="error && !barbearia" class="text-center">
      <div class="flex flex-col items-center gap-4 py-8">
        <UIcon name="i-lucide-search-x" class="size-12 text-muted" />
        <h2 class="text-lg font-semibold">Barbearia não encontrada</h2>
        <p class="text-sm text-muted">O link acessado não corresponde a nenhuma barbearia.</p>
      </div>
    </UCard>

    <template v-else-if="barbearia">
      <div class="mb-6 text-center">
        <h1 class="text-2xl font-bold">{{ barbearia.nome }}</h1>
        <p class="text-sm text-muted mt-1">Agende seu horário</p>
      </div>

      <BookingStepIndicator v-if="step < 6" :current="step" :total="5" />

      <div v-if="canGoBack" class="mb-4">
        <UButton variant="ghost" color="neutral" icon="i-lucide-arrow-left" label="Voltar" size="sm" @click="goBack" />
      </div>

      <BookingStepUnidade v-if="step === 1" :unidades="barbearia.unidades" @select="selectUnidade" />
      <BookingStepServico v-if="step === 2" :servicos="servicos" :loading="loading" @select="selectServico" />
      <BookingStepBarbeiro v-if="step === 3" :barbeiros="barbeiros" :loading="loading" @select="selectBarbeiro" />
      <BookingStepHorario v-if="step === 4" :slots="slots" :loading="loading" :selected-data="selectedData" :selected-horario="selectedHorario" @select-date="fetchSlots" @select-horario="selectHorario" />
      <BookingStepConfirmacao v-if="step === 5" v-model:nome="clienteNome" v-model:telefone="clienteTelefone" v-model:email="clienteEmail" :unidade="selectedUnidade" :servico="selectedServico" :barbeiro="selectedBarbeiro" :data="selectedData" :horario="selectedHorario" :loading="loading" :error="error" @submit="submitAgendamento" />
      <BookingStepSucesso v-if="step === 6 && confirmacao" :confirmacao="confirmacao" />

      <div v-if="loading && step < 4" class="flex justify-center py-8">
        <UIcon name="i-lucide-loader-2" class="size-6 animate-spin text-muted" />
      </div>
    </template>
  </div>
</template>
