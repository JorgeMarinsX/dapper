<script setup lang="ts">
interface Agendamento {
  id: string
  dataHora: string
  status: string
  cliente: { nome: string }
  barbeiro: { nome: string }
  servico: { nome: string; preco: number }
}

interface Barbeiro {
  id: string
  nome: string
  status: string
  unidade?: { nome: string }
}

const today = getTodayISO()

const { data: agendamentos } = useFetch<Agendamento[]>('/api/agendamentos', {
  query: { date: today },
})

const { data: barbeiros } = useFetch<Barbeiro[]>('/api/barbeiros')
const { data: clientes } = useFetch<{ id: string }[]>('/api/clientes')
const { data: servicos } = useFetch<{ id: string }[]>('/api/servicos')

const stats = computed(() => {
  const list = agendamentos.value || []
  const concluidos = list.filter((a: Agendamento) => a.status === 'CONCLUIDO')
  const receita = concluidos.reduce((sum: number, a: Agendamento) => sum + (a.servico?.preco || 0), 0)
  return [
    { label: 'Agendamentos Hoje', value: String(list.length), icon: 'i-lucide-calendar-check' },
    { label: 'Receita Hoje', value: formatPreco(receita), icon: 'i-lucide-dollar-sign' },
    { label: 'Total de Clientes', value: String(clientes.value?.length || 0), icon: 'i-lucide-users' },
    { label: 'Total de Serviços', value: String(servicos.value?.length || 0), icon: 'i-lucide-scissors' },
  ]
})

const columns = [
  { accessorKey: 'horario', header: 'Horário' },
  { accessorKey: 'cliente', header: 'Cliente' },
  { accessorKey: 'barbeiro', header: 'Barbeiro' },
  { accessorKey: 'servico', header: 'Serviço' },
  { accessorKey: 'status', header: 'Status' },
]
</script>

<template>
  <div class="w-full">
    <UDashboardPanel>
      <UDashboardNavbar title="Painel" />

      <div class="flex flex-col gap-6 p-6">
        <!-- Stats -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            v-for="stat in stats"
            :key="stat.label"
            :label="stat.label"
            :value="stat.value"
            :icon="stat.icon"
          />
        </div>

        <!-- Main content: Appointments + Barbers -->
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <!-- Appointments table -->
          <UCard class="lg:col-span-2">
            <template #header>
              <div class="flex items-center justify-between">
                <h2 class="font-semibold">Agendamentos de Hoje</h2>
                <UButton label="Novo agendamento" icon="i-lucide-plus" size="sm" to="/agendamentos" />
              </div>
            </template>

            <UTable v-if="agendamentos?.length" :data="agendamentos" :columns="columns">
              <template #horario-cell="{ row }">
                {{ formatHorario(row.original.dataHora) }}
              </template>
              <template #cliente-cell="{ row }">
                {{ row.original.cliente?.nome }}
              </template>
              <template #barbeiro-cell="{ row }">
                {{ row.original.barbeiro?.nome }}
              </template>
              <template #servico-cell="{ row }">
                {{ row.original.servico?.nome }}
              </template>
              <template #status-cell="{ row }">
                <StatusBadge
                  :label="getStatusConfig(AGENDAMENTO_STATUS, row.original.status).label"
                  :color="getStatusConfig(AGENDAMENTO_STATUS, row.original.status).color"
                />
              </template>
            </UTable>

            <div v-else class="py-8 text-center text-muted">
              <p>Nenhum agendamento hoje</p>
            </div>
          </UCard>

          <!-- Barber availability -->
          <UCard>
            <template #header>
              <h2 class="font-semibold">Barbeiros</h2>
            </template>

            <div v-if="barbeiros?.length" class="flex flex-col gap-4">
              <div
                v-for="barber in barbeiros"
                :key="barber.id"
                class="flex items-center gap-3"
              >
                <UAvatar :text="getInitials(barber.nome)" size="md" />
                <div class="flex-1">
                  <p class="text-sm font-medium">{{ barber.nome }}</p>
                  <p class="text-xs text-muted">{{ barber.unidade?.nome }}</p>
                </div>
                <StatusBadge
                  :label="getStatusConfig(BARBEIRO_STATUS, barber.status).label"
                  :color="getStatusConfig(BARBEIRO_STATUS, barber.status).color"
                />
              </div>
            </div>

            <div v-else class="py-8 text-center text-muted">
              <p>Nenhum barbeiro cadastrado</p>
            </div>
          </UCard>
        </div>
      </div>
    </UDashboardPanel>
  </div>
</template>
