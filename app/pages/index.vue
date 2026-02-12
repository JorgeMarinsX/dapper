<script setup lang="ts">
const stats = [
  { label: 'Agendamentos Hoje', value: '12', icon: 'i-lucide-calendar-check', change: '+3 vs ontem' },
  { label: 'Receita Hoje', value: 'R$ 1.840', icon: 'i-lucide-dollar-sign', change: '+15% vs ontem' },
  { label: 'Clientes Ativos', value: '248', icon: 'i-lucide-users', change: '+5 esta semana' },
  { label: 'Tempo Médio de Espera', value: '14 min', icon: 'i-lucide-clock', change: '-2 min vs ontem' },
]

const appointments = [
  { horario: '09:00', cliente: 'Carlos Mendes', barbeiro: 'Rafael', servico: 'Corte + Barba', status: 'concluido' },
  { horario: '09:30', cliente: 'Pedro Alves', barbeiro: 'Lucas', servico: 'Corte Degradê', status: 'em_andamento' },
  { horario: '10:00', cliente: 'Bruno Costa', barbeiro: 'Rafael', servico: 'Barba', status: 'aguardando' },
  { horario: '10:30', cliente: 'Marcos Lima', barbeiro: 'Thiago', servico: 'Corte Social', status: 'aguardando' },
  { horario: '11:00', cliente: 'André Santos', barbeiro: 'Lucas', servico: 'Corte + Sobrancelha', status: 'aguardando' },
  { horario: '11:30', cliente: 'Felipe Rocha', barbeiro: 'Rafael', servico: 'Corte Degradê', status: 'aguardando' },
  { horario: '13:00', cliente: 'Gustavo Ferreira', barbeiro: 'Thiago', servico: 'Corte + Barba', status: 'aguardando' },
  { horario: '14:00', cliente: 'Leonardo Dias', barbeiro: 'Lucas', servico: 'Barba', status: 'aguardando' },
]

const statusMap: Record<string, { label: string; color: 'success' | 'warning' | 'info' | 'neutral' }> = {
  concluido: { label: 'Concluído', color: 'success' },
  em_andamento: { label: 'Em andamento', color: 'warning' },
  aguardando: { label: 'Aguardando', color: 'neutral' },
}

const columns = [
  { accessorKey: 'horario', header: 'Horário' },
  { accessorKey: 'cliente', header: 'Cliente' },
  { accessorKey: 'barbeiro', header: 'Barbeiro' },
  { accessorKey: 'servico', header: 'Serviço' },
  { accessorKey: 'status', header: 'Status' },
]

const barbers = [
  { name: 'Rafael Oliveira', initials: 'RO', status: 'disponivel' as const, currentClient: null },
  { name: 'Lucas Martins', initials: 'LM', status: 'ocupado' as const, currentClient: 'Pedro Alves' },
  { name: 'Thiago Souza', initials: 'TS', status: 'disponivel' as const, currentClient: null },
  { name: 'Diego Pereira', initials: 'DP', status: 'folga' as const, currentClient: null },
]

const barberStatusMap: Record<string, { label: string; color: 'success' | 'warning' | 'neutral' }> = {
  disponivel: { label: 'Disponível', color: 'success' },
  ocupado: { label: 'Ocupado', color: 'warning' },
  folga: { label: 'Folga', color: 'neutral' },
}

const recentClients = [
  { name: 'Carlos Mendes', initials: 'CM', lastVisit: 'Hoje, 09:00', service: 'Corte + Barba' },
  { name: 'João Ribeiro', initials: 'JR', lastVisit: 'Ontem, 16:30', service: 'Corte Degradê' },
  { name: 'Matheus Gomes', initials: 'MG', lastVisit: 'Ontem, 14:00', service: 'Barba' },
  { name: 'Ricardo Nunes', initials: 'RN', lastVisit: '07/02, 11:00', service: 'Corte Social' },
  { name: 'Vinícius Prado', initials: 'VP', lastVisit: '06/02, 15:30', service: 'Corte + Sobrancelha' },
]
</script>

<template>
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
        :change="stat.change"
      />
    </div>

    <!-- Main content: Appointments + Barbers -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <!-- Appointments table -->
      <UCard class="lg:col-span-2">
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="font-semibold">Agendamentos de Hoje</h2>
            <UButton label="Novo agendamento" icon="i-lucide-plus" size="sm" />
          </div>
        </template>

        <UTable :data="appointments" :columns="columns">
          <template #status-cell="{ row }">
            <StatusBadge
              :label="statusMap[row.original.status].label"
              :color="statusMap[row.original.status].color"
            />
          </template>
        </UTable>
      </UCard>

      <!-- Barber availability -->
      <UCard>
        <template #header>
          <h2 class="font-semibold">Barbeiros</h2>
        </template>

        <div class="flex flex-col gap-4">
          <div
            v-for="barber in barbers"
            :key="barber.name"
            class="flex items-center gap-3"
          >
            <UAvatar :text="barber.initials" size="md" />
            <div class="flex-1">
              <p class="text-sm font-medium">{{ barber.name }}</p>
              <p v-if="barber.currentClient" class="text-xs text-muted">
                Atendendo: {{ barber.currentClient }}
              </p>
            </div>
            <StatusBadge
              :label="barberStatusMap[barber.status].label"
              :color="barberStatusMap[barber.status].color"
            />
          </div>
        </div>
      </UCard>
    </div>

    <!-- Recent clients -->
    <UCard>
      <template #header>
        <h2 class="font-semibold">Clientes Recentes</h2>
      </template>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div
          v-for="client in recentClients"
          :key="client.name"
          class="flex items-center gap-3"
        >
          <UAvatar :text="client.initials" size="sm" />
          <div>
            <p class="text-sm font-medium">{{ client.name }}</p>
            <p class="text-xs text-muted">{{ client.lastVisit }} — {{ client.service }}</p>
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>
