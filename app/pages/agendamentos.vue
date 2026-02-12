<script setup lang="ts">
interface Agendamento {
  id: string
  dataHora: string
  horario: string
  data: string
  cliente: string
  barbeiro: string
  servico: string
  status: string
  observacoes?: string
}

const statusMap: Record<string, { label: string; color: 'success' | 'warning' | 'info' | 'neutral' | 'error' }> = {
  AGUARDANDO: { label: 'Aguardando', color: 'neutral' },
  EM_ANDAMENTO: { label: 'Em andamento', color: 'warning' },
  CONCLUIDO: { label: 'Concluído', color: 'success' },
  CANCELADO: { label: 'Cancelado', color: 'error' },
  NAO_COMPARECEU: { label: 'Não compareceu', color: 'info' },
}

const statusOptions = [
  { label: 'Todos', value: '' },
  { label: 'Aguardando', value: 'AGUARDANDO' },
  { label: 'Em andamento', value: 'EM_ANDAMENTO' },
  { label: 'Concluído', value: 'CONCLUIDO' },
  { label: 'Cancelado', value: 'CANCELADO' },
  { label: 'Não compareceu', value: 'NAO_COMPARECEU' },
]

const search = ref('')
const statusFilter = ref('')
const selectedDate = ref(new Date().toISOString().slice(0, 10))

// Mock data
const agendamentos = ref<Agendamento[]>([
  { id: '1', dataHora: '2026-02-12T09:00:00', horario: '09:00', data: '12/02/2026', cliente: 'Carlos Mendes', barbeiro: 'Rafael Oliveira', servico: 'Corte + Barba', status: 'CONCLUIDO' },
  { id: '2', dataHora: '2026-02-12T09:30:00', horario: '09:30', data: '12/02/2026', cliente: 'Pedro Alves', barbeiro: 'Lucas Martins', servico: 'Corte Degradê', status: 'EM_ANDAMENTO' },
  { id: '3', dataHora: '2026-02-12T10:00:00', horario: '10:00', data: '12/02/2026', cliente: 'Bruno Costa', barbeiro: 'Rafael Oliveira', servico: 'Barba', status: 'AGUARDANDO' },
  { id: '4', dataHora: '2026-02-12T10:30:00', horario: '10:30', data: '12/02/2026', cliente: 'Marcos Lima', barbeiro: 'Thiago Souza', servico: 'Corte Social', status: 'AGUARDANDO' },
  { id: '5', dataHora: '2026-02-12T11:00:00', horario: '11:00', data: '12/02/2026', cliente: 'André Santos', barbeiro: 'Lucas Martins', servico: 'Corte + Sobrancelha', status: 'AGUARDANDO' },
  { id: '6', dataHora: '2026-02-12T11:30:00', horario: '11:30', data: '12/02/2026', cliente: 'Felipe Rocha', barbeiro: 'Rafael Oliveira', servico: 'Corte Degradê', status: 'AGUARDANDO' },
  { id: '7', dataHora: '2026-02-12T13:00:00', horario: '13:00', data: '12/02/2026', cliente: 'Gustavo Ferreira', barbeiro: 'Thiago Souza', servico: 'Corte + Barba', status: 'AGUARDANDO' },
  { id: '8', dataHora: '2026-02-12T14:00:00', horario: '14:00', data: '12/02/2026', cliente: 'Leonardo Dias', barbeiro: 'Lucas Martins', servico: 'Barba', status: 'AGUARDANDO' },
  { id: '9', dataHora: '2026-02-11T09:00:00', horario: '09:00', data: '11/02/2026', cliente: 'João Ribeiro', barbeiro: 'Rafael Oliveira', servico: 'Corte Degradê', status: 'CONCLUIDO' },
  { id: '10', dataHora: '2026-02-11T10:00:00', horario: '10:00', data: '11/02/2026', cliente: 'Matheus Gomes', barbeiro: 'Thiago Souza', servico: 'Barba', status: 'CONCLUIDO' },
  { id: '11', dataHora: '2026-02-11T14:00:00', horario: '14:00', data: '11/02/2026', cliente: 'Ricardo Nunes', barbeiro: 'Lucas Martins', servico: 'Corte Social', status: 'NAO_COMPARECEU' },
  { id: '12', dataHora: '2026-02-11T16:00:00', horario: '16:00', data: '11/02/2026', cliente: 'Vinícius Prado', barbeiro: 'Rafael Oliveira', servico: 'Corte + Sobrancelha', status: 'CANCELADO' },
])

const filteredAgendamentos = computed(() => {
  return agendamentos.value.filter((a) => {
    const matchesSearch = !search.value
      || a.cliente.toLowerCase().includes(search.value.toLowerCase())
      || a.barbeiro.toLowerCase().includes(search.value.toLowerCase())
    const matchesStatus = !statusFilter.value || a.status === statusFilter.value
    const matchesDate = !selectedDate.value || a.dataHora.startsWith(selectedDate.value)
    return matchesSearch && matchesStatus && matchesDate
  })
})

const columns = [
  { accessorKey: 'horario', header: 'Horário' },
  { accessorKey: 'data', header: 'Data' },
  { accessorKey: 'cliente', header: 'Cliente' },
  { accessorKey: 'barbeiro', header: 'Barbeiro' },
  { accessorKey: 'servico', header: 'Serviço' },
  { accessorKey: 'status', header: 'Status' },
]

const stats = computed(() => {
  const hoje = agendamentos.value.filter(a => a.dataHora.startsWith(new Date().toISOString().slice(0, 10)))
  return [
    { label: 'Total Hoje', value: String(hoje.length), icon: 'i-lucide-calendar', change: undefined },
    { label: 'Concluídos', value: String(hoje.filter(a => a.status === 'CONCLUIDO').length), icon: 'i-lucide-calendar-check', change: undefined },
    { label: 'Aguardando', value: String(hoje.filter(a => a.status === 'AGUARDANDO').length), icon: 'i-lucide-clock', change: undefined },
    { label: 'Cancelados', value: String(hoje.filter(a => a.status === 'CANCELADO').length), icon: 'i-lucide-calendar-x', change: undefined },
  ]
})
</script>

<template>
  <template #header>
    <UDashboardNavbar title="Agendamentos">
      <template #actions>
        <UButton label="Novo agendamento" icon="i-lucide-plus" />
      </template>
    </UDashboardNavbar>
  </template>

  <div class="flex flex-col gap-6 p-6">
    <!-- Stats -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        v-for="stat in stats"
        :key="stat.label"
        :label="stat.label"
        :value="stat.value"
        :icon="stat.icon"
        :change="stat.change"
      />
    </div>

    <!-- Filters -->
    <UCard>
      <div class="flex flex-wrap items-center gap-4">
        <UInput
          v-model="search"
          placeholder="Buscar por cliente ou barbeiro..."
          icon="i-lucide-search"
          class="w-64"
        />
        <USelect
          v-model="statusFilter"
          :items="statusOptions"
          value-key="value"
          label-key="label"
          placeholder="Status"
          class="w-48"
        />
        <UInput
          v-model="selectedDate"
          type="date"
          class="w-44"
        />
        <UButton
          v-if="search || statusFilter || selectedDate"
          label="Limpar filtros"
          variant="ghost"
          color="neutral"
          icon="i-lucide-x"
          @click="search = ''; statusFilter = ''; selectedDate = ''"
        />
      </div>
    </UCard>

    <!-- Table -->
    <UCard>
      <UTable :data="filteredAgendamentos" :columns="columns">
        <template #status-cell="{ row }">
          <StatusBadge
            :label="statusMap[row.original.status].label"
            :color="statusMap[row.original.status].color"
          />
        </template>
      </UTable>
    </UCard>
  </div>
</template>
