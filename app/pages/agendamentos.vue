<script setup lang="ts">
const {
  agendamentos,
  stats,
  search,
  statusFilter,
  selectedDate,
  unidadeFilter,
  unidadeOptions,
  hasFilters,
  clearFilters,
  showForm,
  form,
  formLoading,
  openNew,
  handleSave,
  selectedCliente,
  clienteSearch,
  clienteResults,
  clienteLoading,
  selectedServico,
  servicoOptions,
  barbeirosOptions,
  formDate,
  selectedSlot,
  availableSlots,
  slotsLoading,
  selectSlot,
  showClienteForm,
  showBarbeiroForm,
  onClienteCreated,
  onBarbeiroCreated,
  updateStatus,
  deleteDialog,
  deleteLoading,
  handleDelete,
} = useAgendamentos()

const today = getTodayISO()
</script>

<template>
  <div class="w-full">
    <UDashboardPanel>
      <UDashboardNavbar title="Agendamentos">
        <template #right>
          <UButton label="Novo agendamento" icon="i-lucide-plus" @click="openNew" />
        </template>
      </UDashboardNavbar>

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

        <!-- Filters -->
        <UCard>
          <div class="flex flex-wrap items-center gap-4">
            <UInput
              v-model="search"
              placeholder="Buscar por cliente ou barbeiro..."
              icon="i-lucide-search"
              class="w-64"
              size="xl"
            />
            <USelect
              v-model="statusFilter"
              :items="AGENDAMENTO_STATUS_OPTIONS"
              value-key="value"
              label-key="label"
              placeholder="Todos os status"
              class="w-48"
            />
            <USelect
              v-model="unidadeFilter"
              :items="unidadeOptions"
              value-key="value"
              label-key="label"
              placeholder="Todas as unidades"
              class="w-48"
            />
            <UInput
              v-model="selectedDate"
              type="date"
              class="w-44"
              size="xl"
            />
            <UButton
              v-if="hasFilters"
              label="Limpar filtros"
              variant="ghost"
              color="neutral"
              icon="i-lucide-x"
              @click="clearFilters"
            />
          </div>
        </UCard>

        <!-- Table -->
        <UCard v-if="agendamentos?.length">
          <UTable :data="agendamentos" :columns="COLUMNS.agendamentos">
            <template #horario-cell="{ row }">
              {{ formatHorario(row.original.dataHora) }}
            </template>
            <template #data-cell="{ row }">
              {{ formatData(row.original.dataHora) }}
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
            <template #unidade-cell="{ row }">
              {{ row.original.unidade?.nome }}
            </template>
            <template #status-cell="{ row }">
              <StatusBadge
                :label="getStatusConfig(AGENDAMENTO_STATUS, row.original.status).label"
                :color="getStatusConfig(AGENDAMENTO_STATUS, row.original.status).color"
              />
            </template>
            <template #actions-cell="{ row }">
              <UDropdownMenu
                :items="[
                  [
                    { label: 'Aguardando', icon: 'i-lucide-clock', click: () => updateStatus(row.original, 'AGUARDANDO') },
                    { label: 'Em andamento', icon: 'i-lucide-play', click: () => updateStatus(row.original, 'EM_ANDAMENTO') },
                    { label: 'Concluído', icon: 'i-lucide-check', click: () => updateStatus(row.original, 'CONCLUIDO') },
                    { label: 'Não compareceu', icon: 'i-lucide-user-x', click: () => updateStatus(row.original, 'NAO_COMPARECEU') },
                  ],
                  [
                    { label: 'Cancelar', icon: 'i-lucide-x', color: 'error' as const, click: () => updateStatus(row.original, 'CANCELADO') },
                    { label: 'Excluir', icon: 'i-lucide-trash-2', color: 'error' as const, click: () => deleteDialog.openDelete(row.original) },
                  ],
                ]"
              >
                <UButton icon="i-lucide-ellipsis-vertical" variant="ghost" color="neutral" size="xs" />
              </UDropdownMenu>
            </template>
          </UTable>
        </UCard>

        <UCard v-else>
          <div class="py-8 text-center text-muted">
            <UIcon name="i-lucide-calendar" class="mx-auto mb-2 size-8" />
            <p>Nenhum agendamento encontrado</p>
            <UButton label="Criar primeiro agendamento" variant="link" class="mt-2" @click="openNew" />
          </div>
        </UCard>
      </div>

      <!-- Form dialog -->
      <FormDialog v-model="showForm" title="Novo agendamento" :loading="formLoading" @save="handleSave">
        <div class="flex flex-col gap-4">
          <UFormField label="Cliente" required>
            <div class="flex items-end gap-2">
              <UInputMenu
                v-model="selectedCliente"
                v-model:search-term="clienteSearch"
                :items="clienteResults"
                label-key="label"
                :loading="clienteLoading"
                :ignore-filter="true"
                placeholder="Digite para buscar cliente..."
                icon="i-lucide-search"
                class="flex-1"
              >
                <template #empty>
                  <span class="text-muted">{{ clienteSearch.length < 2 ? 'Digite ao menos 2 caracteres...' : 'Sem resultados' }}</span>
                </template>
              </UInputMenu>
              <UButton icon="i-lucide-plus" variant="outline" color="neutral" @click="showClienteForm = true" />
            </div>
          </UFormField>
          <div class="grid grid-cols-2 gap-4">
            <UFormField label="Unidade" required>
              <USelect
                v-model="form.unidadeId"
                :items="unidadeOptions"
                value-key="value"
                label-key="label"
                placeholder="Selecione a unidade"
                class="w-full"
              />
            </UFormField>
            <UFormField label="Serviço" required>
              <UInputMenu
                v-model="selectedServico"
                :items="servicoOptions"
                label-key="label"
                placeholder="Buscar serviço..."
                icon="i-lucide-search"
                class="w-full"
              >
                <template #empty>
                  <span class="text-muted">Sem resultados</span>
                </template>
              </UInputMenu>
            </UFormField>
          </div>
          <UFormField label="Barbeiro" required>
            <div class="flex items-end gap-2">
              <USelect
                v-model="form.barbeiroId"
                :items="barbeirosOptions"
                value-key="value"
                label-key="label"
                placeholder="Selecione o barbeiro"
                :disabled="!form.unidadeId"
                class="flex-1"
              />
              <UButton icon="i-lucide-plus" variant="outline" color="neutral" :disabled="!form.unidadeId" @click="showBarbeiroForm = true" />
            </div>
          </UFormField>
          <UFormField label="Data" required>
            <UInput
              v-model="formDate"
              type="date"
              :min="today"
              size="xl"
              class="w-full"
              :disabled="!form.unidadeId || !form.barbeiroId || !form.servicoId"
            />
          </UFormField>
          <div v-if="!form.unidadeId || !form.barbeiroId || !form.servicoId" class="text-sm text-muted">
            Selecione unidade, barbeiro e serviço para ver horários disponíveis.
          </div>
          <div v-else-if="formDate">
            <p class="text-sm font-medium mb-2">Horários disponíveis:</p>
            <div v-if="slotsLoading" class="flex justify-center py-4">
              <UIcon name="i-lucide-loader-2" class="size-6 animate-spin text-muted" />
            </div>
            <div v-else-if="availableSlots.length > 0" class="flex flex-wrap gap-2">
              <UButton
                v-for="s in availableSlots"
                :key="s"
                :label="s"
                :variant="selectedSlot === s ? 'solid' : 'outline'"
                :color="selectedSlot === s ? 'primary' : 'neutral'"
                size="md"
                @click="selectSlot(s)"
              />
            </div>
            <p v-else class="text-sm text-muted text-center py-4">
              Nenhum horário disponível nesta data.
            </p>
          </div>
          <UFormField label="Observações">
            <UTextarea v-model="form.observacoes" placeholder="Observações opcionais..." :rows="3" class="w-full" />
          </UFormField>
        </div>
      </FormDialog>

      <!-- Delete confirmation -->
      <ConfirmDialog v-model="deleteDialog.show.value" :loading="deleteLoading" @confirm="handleDelete" />

      <!-- Quick-create dialogs -->
      <QuickCreateCliente v-model="showClienteForm" @created="onClienteCreated" />
      <QuickCreateBarbeiro v-model="showBarbeiroForm" :unidade-id="form.unidadeId" :unidade-options="unidadeOptions" @created="onBarbeiroCreated" />
    </UDashboardPanel>
  </div>
</template>
