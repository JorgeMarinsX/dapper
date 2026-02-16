<script setup lang="ts">
const { agendamentos, barbeiros, stats } = useDashboard()
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

            <UTable v-if="agendamentos?.length" :data="agendamentos" :columns="COLUMNS.dashboard">
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
