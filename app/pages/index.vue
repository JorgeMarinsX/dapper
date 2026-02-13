<script setup lang="ts">
const today = new Date().toISOString().slice(0, 10)

const { data: agendamentos } = await useFetch<any[]>('/api/agendamentos', {
  query: { date: today },
})

const { data: barbeiros } = await useFetch<any[]>('/api/barbeiros')
const { data: clientes } = await useFetch<any[]>('/api/clientes')
const { data: servicos } = await useFetch<any[]>('/api/servicos')

const statusMap: Record<string, { label: string; color: 'success' | 'warning' | 'info' | 'neutral' | 'error' }> = {
  AGUARDANDO: { label: 'Aguardando', color: 'neutral' },
  EM_ANDAMENTO: { label: 'Em andamento', color: 'warning' },
  CONCLUIDO: { label: 'Concluído', color: 'success' },
  CANCELADO: { label: 'Cancelado', color: 'error' },
  NAO_COMPARECEU: { label: 'Não compareceu', color: 'info' },
}

const barberStatusMap: Record<string, { label: string; color: 'success' | 'warning' | 'neutral' | 'info' }> = {
  DISPONIVEL: { label: 'Disponível', color: 'success' },
  OCUPADO: { label: 'Ocupado', color: 'warning' },
  FOLGA: { label: 'Folga', color: 'neutral' },
  ALMOCO: { label: 'Almoço', color: 'info' },
}

const stats = computed(() => {
  const list = agendamentos.value || []
  const concluidos = list.filter(a => a.status === 'CONCLUIDO')
  const receita = concluidos.reduce((sum: number, a: any) => sum + (a.servico?.preco || 0), 0)
  return [
    { label: 'Agendamentos Hoje', value: String(list.length), icon: 'i-lucide-calendar-check' },
    { label: 'Receita Hoje', value: receita.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), icon: 'i-lucide-dollar-sign' },
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

function formatHorario(dataHora: string): string {
  return new Date(dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

function getInitials(name: string): string {
  return name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
}
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Painel" />
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
                :label="statusMap[row.original.status]?.label || row.original.status"
                :color="statusMap[row.original.status]?.color || 'neutral'"
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
                :label="barberStatusMap[barber.status]?.label || barber.status"
                :color="barberStatusMap[barber.status]?.color || 'neutral'"
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
</template>
