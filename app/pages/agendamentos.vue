<script setup lang="ts">
interface Agendamento {
  id: string
  dataHora: string
  status: string
  observacoes?: string
  cliente: { id: string; nome: string }
  barbeiro: { id: string; nome: string }
  servico: { id: string; nome: string; preco: number }
  unidade: { id: string; nome: string }
}

interface SelectItem { id: string; nome: string }

const toast = useToast()

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
const unidadeFilter = ref('')

const { data: agendamentos, refresh } = await useFetch<Agendamento[]>('/api/agendamentos', {
  query: computed(() => ({
    ...(search.value && { search: search.value }),
    ...(statusFilter.value && { status: statusFilter.value }),
    ...(selectedDate.value && { date: selectedDate.value }),
    ...(unidadeFilter.value && { unidade: unidadeFilter.value }),
  })),
})

const { data: unidades } = await useFetch<SelectItem[]>('/api/unidades')
const { data: clientes } = await useFetch<SelectItem[]>('/api/clientes')
const { data: servicos } = await useFetch<SelectItem[]>('/api/servicos')

const unidadeFilterOptions = computed(() => [
  { label: 'Todas as unidades', value: '' },
  ...(unidades.value || []).map(u => ({ label: u.nome, value: u.id })),
])

function formatHorario(dataHora: string): string {
  return new Date(dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

function formatData(dataHora: string): string {
  return new Date(dataHora).toLocaleDateString('pt-BR')
}

const columns = [
  { accessorKey: 'horario', header: 'Horário' },
  { accessorKey: 'data', header: 'Data' },
  { accessorKey: 'cliente', header: 'Cliente' },
  { accessorKey: 'barbeiro', header: 'Barbeiro' },
  { accessorKey: 'servico', header: 'Serviço' },
  { accessorKey: 'unidade', header: 'Unidade' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'actions', header: '' },
]

const stats = computed(() => {
  const list = agendamentos.value || []
  return [
    { label: 'Total', value: String(list.length), icon: 'i-lucide-calendar' },
    { label: 'Concluídos', value: String(list.filter(a => a.status === 'CONCLUIDO').length), icon: 'i-lucide-calendar-check' },
    { label: 'Aguardando', value: String(list.filter(a => a.status === 'AGUARDANDO').length), icon: 'i-lucide-clock' },
    { label: 'Cancelados', value: String(list.filter(a => a.status === 'CANCELADO').length), icon: 'i-lucide-calendar-x' },
  ]
})

// Form dialog
const showForm = ref(false)
const formLoading = ref(false)
const form = ref({
  unidadeId: '',
  clienteId: '',
  barbeiroId: '',
  servicoId: '',
  dataHora: '',
  observacoes: '',
})

// Barbeiros filtered by selected unit
const { data: barbeirosForUnit, refresh: refreshBarbeiros } = await useFetch<{ id: string; nome: string }[]>('/api/barbeiros', {
  query: computed(() => ({
    ...(form.value.unidadeId && { unidade: form.value.unidadeId }),
  })),
  immediate: false,
})

watch(() => form.value.unidadeId, async (val) => {
  form.value.barbeiroId = ''
  if (val) await refreshBarbeiros()
})

function openNew() {
  form.value = { unidadeId: '', clienteId: '', barbeiroId: '', servicoId: '', dataHora: '', observacoes: '' }
  showForm.value = true
}

async function handleSave() {
  formLoading.value = true
  try {
    await $fetch('/api/agendamentos', { method: 'POST', body: form.value })
    toast.add({ title: 'Agendamento criado', color: 'success' })
    showForm.value = false
    await refresh()
  }
  catch (e: any) {
    toast.add({ title: e.data?.statusMessage || 'Erro ao criar agendamento', color: 'error' })
  }
  finally {
    formLoading.value = false
  }
}

// Status update
async function updateStatus(agendamento: Agendamento, newStatus: string) {
  try {
    await $fetch(`/api/agendamentos/${agendamento.id}`, {
      method: 'PATCH',
      body: { status: newStatus },
    })
    toast.add({ title: 'Status atualizado', color: 'success' })
    await refresh()
  }
  catch (e: any) {
    toast.add({ title: e.data?.statusMessage || 'Erro ao atualizar', color: 'error' })
  }
}

// Delete dialog
const showDelete = ref(false)
const deleteLoading = ref(false)
const deletingId = ref<string | null>(null)

function openDelete(agendamento: Agendamento) {
  deletingId.value = agendamento.id
  showDelete.value = true
}

async function handleDelete() {
  if (!deletingId.value) return
  deleteLoading.value = true
  try {
    await $fetch(`/api/agendamentos/${deletingId.value}`, { method: 'DELETE' })
    toast.add({ title: 'Agendamento excluído', color: 'success' })
    showDelete.value = false
    await refresh()
  }
  catch (e: any) {
    toast.add({ title: e.data?.statusMessage || 'Erro ao excluir', color: 'error' })
  }
  finally {
    deleteLoading.value = false
  }
}

function clearFilters() {
  search.value = ''
  statusFilter.value = ''
  selectedDate.value = ''
  unidadeFilter.value = ''
}
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Agendamentos">
        <template #actions>
          <UButton label="Novo agendamento" icon="i-lucide-plus" @click="openNew" />
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
          <USelect
            v-model="unidadeFilter"
            :items="unidadeFilterOptions"
            value-key="value"
            label-key="label"
            placeholder="Unidade"
            class="w-48"
          />
          <UInput
            v-model="selectedDate"
            type="date"
            class="w-44"
          />
          <UButton
            v-if="search || statusFilter || selectedDate || unidadeFilter"
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
        <UTable :data="agendamentos" :columns="columns">
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
              :label="statusMap[row.original.status]?.label || row.original.status"
              :color="statusMap[row.original.status]?.color || 'neutral'"
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
                  { label: 'Excluir', icon: 'i-lucide-trash-2', color: 'error' as const, click: () => openDelete(row.original) },
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
        <UFormField label="Unidade" required>
          <USelect
            v-model="form.unidadeId"
            :items="(unidades || []).map(u => ({ label: u.nome, value: u.id }))"
            value-key="value"
            label-key="label"
            placeholder="Selecione a unidade"
          />
        </UFormField>
        <div class="grid grid-cols-2 gap-4">
          <UFormField label="Cliente" required>
            <USelect
              v-model="form.clienteId"
              :items="(clientes || []).map(c => ({ label: c.nome, value: c.id }))"
              value-key="value"
              label-key="label"
              placeholder="Selecione o cliente"
            />
          </UFormField>
          <UFormField label="Barbeiro" required>
            <USelect
              v-model="form.barbeiroId"
              :items="(barbeirosForUnit || []).map(b => ({ label: b.nome, value: b.id }))"
              value-key="value"
              label-key="label"
              placeholder="Selecione o barbeiro"
              :disabled="!form.unidadeId"
            />
          </UFormField>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <UFormField label="Serviço" required>
            <USelect
              v-model="form.servicoId"
              :items="(servicos || []).map(s => ({ label: s.nome, value: s.id }))"
              value-key="value"
              label-key="label"
              placeholder="Selecione o serviço"
            />
          </UFormField>
          <UFormField label="Data e hora" required>
            <UInput v-model="form.dataHora" type="datetime-local" />
          </UFormField>
        </div>
        <UFormField label="Observações">
          <UTextarea v-model="form.observacoes" placeholder="Observações opcionais..." :rows="2" />
        </UFormField>
      </div>
    </FormDialog>

    <!-- Delete confirmation -->
    <ConfirmDialog v-model="showDelete" :loading="deleteLoading" @confirm="handleDelete" />
  </UDashboardPanel>
</template>
