<script setup lang="ts">
const barbearia = ref({
  nome: 'Barbearia Exemplo',
  cnpj: '12.345.678/0001-90',
  telefone: '(11) 3456-7890',
  endereco: 'Rua dos Barbeiros, 123 - Centro, São Paulo - SP',
})

const horarioFuncionamento = ref({
  segunda: { aberto: true, inicio: '09:00', fim: '19:00' },
  terca: { aberto: true, inicio: '09:00', fim: '19:00' },
  quarta: { aberto: true, inicio: '09:00', fim: '19:00' },
  quinta: { aberto: true, inicio: '09:00', fim: '19:00' },
  sexta: { aberto: true, inicio: '09:00', fim: '20:00' },
  sabado: { aberto: true, inicio: '08:00', fim: '17:00' },
  domingo: { aberto: false, inicio: '09:00', fim: '13:00' },
})

const diasSemana: Record<string, string> = {
  segunda: 'Segunda-feira',
  terca: 'Terça-feira',
  quarta: 'Quarta-feira',
  quinta: 'Quinta-feira',
  sexta: 'Sexta-feira',
  sabado: 'Sábado',
  domingo: 'Domingo',
}

const notificacoes = ref({
  emailConfirmacao: true,
  smsLembrete: true,
  antecedencia: '2',
})

const antecedenciaOptions = [
  { label: '1 hora antes', value: '1' },
  { label: '2 horas antes', value: '2' },
  { label: '3 horas antes', value: '3' },
  { label: '1 dia antes', value: '24' },
]
</script>

<template>
  <template #header>
    <UDashboardNavbar title="Configurações" />
  </template>

  <div class="flex flex-col gap-6 p-6 max-w-4xl">
    <!-- Dados da Barbearia -->
    <UCard>
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-store" class="size-5 text-primary" />
          <h2 class="font-semibold">Dados da Barbearia</h2>
        </div>
      </template>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <UFormField label="Nome">
          <UInput v-model="barbearia.nome" />
        </UFormField>
        <UFormField label="CNPJ">
          <UInput v-model="barbearia.cnpj" />
        </UFormField>
        <UFormField label="Telefone">
          <UInput v-model="barbearia.telefone" />
        </UFormField>
        <UFormField label="Endereço" class="sm:col-span-2">
          <UInput v-model="barbearia.endereco" />
        </UFormField>
      </div>

      <template #footer>
        <div class="flex justify-end">
          <UButton label="Salvar alterações" icon="i-lucide-save" />
        </div>
      </template>
    </UCard>

    <!-- Horário de Funcionamento -->
    <UCard>
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-clock" class="size-5 text-primary" />
          <h2 class="font-semibold">Horário de Funcionamento</h2>
        </div>
      </template>

      <div class="flex flex-col gap-4">
        <div
          v-for="(horario, dia) in horarioFuncionamento"
          :key="dia"
          class="flex items-center gap-4"
        >
          <div class="w-36">
            <span class="text-sm font-medium">{{ diasSemana[dia] }}</span>
          </div>
          <USwitch v-model="horario.aberto" />
          <template v-if="horario.aberto">
            <UInput v-model="horario.inicio" type="time" class="w-28" />
            <span class="text-muted">às</span>
            <UInput v-model="horario.fim" type="time" class="w-28" />
          </template>
          <span v-else class="text-sm text-muted">Fechado</span>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end">
          <UButton label="Salvar horários" icon="i-lucide-save" />
        </div>
      </template>
    </UCard>

    <!-- Notificações -->
    <UCard>
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-bell" class="size-5 text-primary" />
          <h2 class="font-semibold">Notificações</h2>
        </div>
      </template>

      <div class="flex flex-col gap-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium">E-mail de confirmação</p>
            <p class="text-xs text-muted">Enviar e-mail ao cliente quando um agendamento for confirmado</p>
          </div>
          <USwitch v-model="notificacoes.emailConfirmacao" />
        </div>
        <USeparator />
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium">SMS de lembrete</p>
            <p class="text-xs text-muted">Enviar SMS de lembrete antes do agendamento</p>
          </div>
          <USwitch v-model="notificacoes.smsLembrete" />
        </div>
        <USeparator />
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium">Antecedência do lembrete</p>
            <p class="text-xs text-muted">Quanto tempo antes do agendamento enviar o lembrete</p>
          </div>
          <USelect
            v-model="notificacoes.antecedencia"
            :items="antecedenciaOptions"
            value-key="value"
            label-key="label"
            class="w-44"
          />
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end">
          <UButton label="Salvar notificações" icon="i-lucide-save" />
        </div>
      </template>
    </UCard>
  </div>
</template>
