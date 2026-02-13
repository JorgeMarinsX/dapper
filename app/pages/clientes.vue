<script setup lang="ts">
interface Cliente {
  id: string
  nome: string
  email?: string
  telefone: string
  createdAt: string
  _count?: { agendamentos: number }
}

const toast = useToast()
const search = ref('')

const { data: clientes, refresh } = await useFetch<Cliente[]>('/api/clientes', {
  query: { search },
})

const stats = computed(() => {
  const total = clientes.value?.length || 0
  return [
    { label: 'Total de Clientes', value: String(total), icon: 'i-lucide-users' },
  ]
})

const columns = [
  { accessorKey: 'nome', header: 'Nome' },
  { accessorKey: 'telefone', header: 'Telefone' },
  { accessorKey: 'email', header: 'E-mail' },
  { accessorKey: 'actions', header: '' },
]

function getInitials(name: string): string {
  return name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
}

// Form dialog
const showForm = ref(false)
const formLoading = ref(false)
const editingId = ref<string | null>(null)
const form = ref({ nome: '', telefone: '', email: '' })

function openNew() {
  editingId.value = null
  form.value = { nome: '', telefone: '', email: '' }
  showForm.value = true
}

function openEdit(cliente: Cliente) {
  editingId.value = cliente.id
  form.value = {
    nome: cliente.nome,
    telefone: cliente.telefone,
    email: cliente.email || '',
  }
  showForm.value = true
}

async function handleSave() {
  formLoading.value = true
  try {
    const body = {
      nome: form.value.nome,
      telefone: form.value.telefone,
      email: form.value.email || undefined,
    }
    if (editingId.value) {
      await $fetch(`/api/clientes/${editingId.value}`, { method: 'PATCH', body })
      toast.add({ title: 'Cliente atualizado', color: 'success' })
    }
    else {
      await $fetch('/api/clientes', { method: 'POST', body })
      toast.add({ title: 'Cliente cadastrado', color: 'success' })
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

function openDelete(cliente: Cliente) {
  deletingId.value = cliente.id
  showDelete.value = true
}

async function handleDelete() {
  if (!deletingId.value) return
  deleteLoading.value = true
  try {
    await $fetch(`/api/clientes/${deletingId.value}`, { method: 'DELETE' })
    toast.add({ title: 'Cliente excluído', color: 'success' })
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
      <UDashboardNavbar title="Clientes">
        <template #actions>
          <UButton label="Novo cliente" icon="i-lucide-user-plus" @click="openNew" />
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

      <!-- Search -->
      <UCard>
        <div class="flex items-center gap-4">
          <UInput
            v-model="search"
            placeholder="Buscar por nome, telefone ou e-mail..."
            icon="i-lucide-search"
            class="w-80"
          />
        </div>
      </UCard>

      <!-- Table -->
      <UCard v-if="clientes?.length">
        <UTable :data="clientes" :columns="columns">
          <template #nome-cell="{ row }">
            <div class="flex items-center gap-3">
              <UAvatar :text="getInitials(row.original.nome)" size="sm" />
              <span class="font-medium">{{ row.original.nome }}</span>
            </div>
          </template>
          <template #email-cell="{ row }">
            <span :class="row.original.email ? '' : 'text-muted'">
              {{ row.original.email || '—' }}
            </span>
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
          <UIcon name="i-lucide-users" class="mx-auto mb-2 size-8" />
          <p>Nenhum cliente cadastrado</p>
          <UButton label="Cadastrar primeiro cliente" variant="link" class="mt-2" @click="openNew" />
        </div>
      </UCard>
    </div>

    <!-- Form dialog -->
    <FormDialog v-model="showForm" :title="editingId ? 'Editar cliente' : 'Novo cliente'" :loading="formLoading" @save="handleSave">
      <div class="flex flex-col gap-4">
        <UFormField label="Nome" required>
          <UInput v-model="form.nome" placeholder="Nome completo" />
        </UFormField>
        <UFormField label="Telefone" required>
          <UInput v-model="form.telefone" placeholder="(11) 99999-0000" />
        </UFormField>
        <UFormField label="E-mail">
          <UInput v-model="form.email" type="email" placeholder="email@exemplo.com" />
        </UFormField>
      </div>
    </FormDialog>

    <!-- Delete confirmation -->
    <ConfirmDialog v-model="showDelete" :loading="deleteLoading" @confirm="handleDelete" />
  </UDashboardPanel>
</template>
