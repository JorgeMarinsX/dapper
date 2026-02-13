<script setup lang="ts">
interface Unidade {
  id: string
  nome: string
}

interface Barbeiro {
  id: string
  nome: string
  email: string
  telefone: string
  status: string
  unidadeId: string
  unidade: { id: string; nome: string }
}

const toast = useToast()
const search = ref('')
const unidadeFilter = ref('')

const { data: barbeiros, refresh } = useFetch<Barbeiro[]>('/api/barbeiros', {
  query: { search, unidade: unidadeFilter },
})

const { data: unidades } = useFetch<Unidade[]>('/api/unidades')

const unidadeOptions = computed(() =>
  (unidades.value || []).map(u => ({ label: u.nome, value: u.id })),
)

const statusMap: Record<string, { label: string; color: 'success' | 'warning' | 'neutral' | 'info' }> = {
  DISPONIVEL: { label: 'Disponível', color: 'success' },
  OCUPADO: { label: 'Ocupado', color: 'warning' },
  FOLGA: { label: 'Folga', color: 'neutral' },
  ALMOCO: { label: 'Almoço', color: 'info' },
}

const columns = [
  { accessorKey: 'nome', header: 'Nome' },
  { accessorKey: 'email', header: 'E-mail' },
  { accessorKey: 'telefone', header: 'Telefone' },
  { accessorKey: 'unidade', header: 'Unidade' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'actions', header: '' },
]

const stats = computed(() => {
  const list = barbeiros.value || []
  return [
    { label: 'Total de Barbeiros', value: String(list.length), icon: 'i-lucide-user-round' },
    { label: 'Disponíveis', value: String(list.filter(b => b.status === 'DISPONIVEL').length), icon: 'i-lucide-user-check' },
    { label: 'Ocupados', value: String(list.filter(b => b.status === 'OCUPADO').length), icon: 'i-lucide-user-x' },
  ]
})

function getInitials(name: string): string {
  return name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
}

// Form dialog
const showForm = ref(false)
const formLoading = ref(false)
const editingId = ref<string | null>(null)
const form = ref({ nome: '', email: '', telefone: '', unidadeId: '' })

function openNew() {
  editingId.value = null
  form.value = { nome: '', email: '', telefone: '', unidadeId: '' }
  showForm.value = true
}

function openEdit(barbeiro: Barbeiro) {
  editingId.value = barbeiro.id
  form.value = {
    nome: barbeiro.nome,
    email: barbeiro.email,
    telefone: barbeiro.telefone,
    unidadeId: barbeiro.unidadeId,
  }
  showForm.value = true
}

async function handleSave() {
  formLoading.value = true
  try {
    if (editingId.value) {
      await $fetch(`/api/barbeiros/${editingId.value}`, { method: 'PATCH', body: form.value })
      toast.add({ title: 'Barbeiro atualizado', color: 'success' })
    }
    else {
      await $fetch('/api/barbeiros', { method: 'POST', body: form.value })
      toast.add({ title: 'Barbeiro cadastrado', color: 'success' })
    }
    showForm.value = false
    await refresh()
  }
  catch (e: any) {
    toast.add({ title: e.data?.statusMessage || 'Erro ao salvar', color: 'error' })
  }
  finally {
    formLoading.value = false
  }
}

// Delete dialog
const showDelete = ref(false)
const deleteLoading = ref(false)
const deletingId = ref<string | null>(null)

function openDelete(barbeiro: Barbeiro) {
  deletingId.value = barbeiro.id
  showDelete.value = true
}

async function handleDelete() {
  if (!deletingId.value) return
  deleteLoading.value = true
  try {
    await $fetch(`/api/barbeiros/${deletingId.value}`, { method: 'DELETE' })
    toast.add({ title: 'Barbeiro excluído', color: 'success' })
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
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Barbeiros">
        <template #actions>
          <UButton label="Novo barbeiro" icon="i-lucide-plus" @click="openNew" />
        </template>
      </UDashboardNavbar>
    </template>

    <div class="flex flex-col gap-6 p-6">
      <!-- Stats -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
            placeholder="Buscar por nome..."
            icon="i-lucide-search"
            class="w-64"
          />
          <USelect
            v-model="unidadeFilter"
            :items="unidadeOptions"
            value-key="value"
            label-key="label"
            placeholder="Todas as unidades"
            class="w-56"
          />
        </div>
      </UCard>

      <!-- Table -->
      <UCard v-if="barbeiros?.length">
        <UTable :data="barbeiros" :columns="columns">
          <template #nome-cell="{ row }">
            <div class="flex items-center gap-3">
              <UAvatar :text="getInitials(row.original.nome)" size="sm" />
              <span class="font-medium">{{ row.original.nome }}</span>
            </div>
          </template>
          <template #unidade-cell="{ row }">
            {{ row.original.unidade?.nome || '—' }}
          </template>
          <template #status-cell="{ row }">
            <StatusBadge
              :label="statusMap[row.original.status]?.label || row.original.status"
              :color="statusMap[row.original.status]?.color || 'neutral'"
            />
          </template>
          <template #actions-cell="{ row }">
            <UDropdownMenu
              :items="[[
                { label: 'Editar', icon: 'i-lucide-pencil', click: () => openEdit(row.original) },
                { label: 'Excluir', icon: 'i-lucide-trash-2', color: 'error' as const, click: () => openDelete(row.original) },
              ]]"
            >
              <UButton icon="i-lucide-ellipsis-vertical" variant="ghost" color="neutral" size="xs" />
            </UDropdownMenu>
          </template>
        </UTable>
      </UCard>

      <UCard v-else>
        <div class="py-8 text-center text-muted">
          <UIcon name="i-lucide-user-round" class="mx-auto mb-2 size-8" />
          <p>Nenhum barbeiro cadastrado</p>
          <UButton label="Cadastrar primeiro barbeiro" variant="link" class="mt-2" @click="openNew" />
        </div>
      </UCard>
    </div>

    <!-- Form dialog -->
    <FormDialog v-model="showForm" :title="editingId ? 'Editar barbeiro' : 'Novo barbeiro'" :loading="formLoading" @save="handleSave">
      <div class="flex flex-col gap-4">
        <UFormField label="Nome" required>
          <UInput v-model="form.nome" placeholder="Nome completo" />
        </UFormField>
        <div class="grid grid-cols-2 gap-4">
          <UFormField label="E-mail" required>
            <UInput v-model="form.email" type="email" placeholder="email@exemplo.com" />
          </UFormField>
          <UFormField label="Telefone" required>
            <UInput v-model="form.telefone" placeholder="(11) 99999-0000" />
          </UFormField>
        </div>
        <UFormField label="Unidade" required>
          <USelect
            v-model="form.unidadeId"
            :items="(unidades || []).map(u => ({ label: u.nome, value: u.id }))"
            value-key="value"
            label-key="label"
            placeholder="Selecione a unidade"
          />
        </UFormField>
      </div>
    </FormDialog>

    <!-- Delete confirmation -->
    <ConfirmDialog v-model="showDelete" :loading="deleteLoading" @confirm="handleDelete" />
  </UDashboardPanel>
</template>
