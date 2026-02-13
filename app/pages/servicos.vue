<script setup lang="ts">
interface Servico {
  id: string
  nome: string
  descricao?: string
  preco: number
  duracao: number
}

const toast = useToast()
const search = ref('')

const { data: servicos, refresh } = useFetch<Servico[]>('/api/servicos', {
  query: { search },
})

const stats = computed(() => {
  const list = servicos.value || []
  const total = list.length
  const avgPreco = total ? (list.reduce((s, v) => s + v.preco, 0) / total) : 0
  const avgDuracao = total ? Math.round(list.reduce((s, v) => s + v.duracao, 0) / total) : 0
  return [
    { label: 'Total de Serviços', value: String(total), icon: 'i-lucide-scissors' },
    { label: 'Preço Médio', value: formatPreco(avgPreco), icon: 'i-lucide-dollar-sign' },
    { label: 'Duração Média', value: formatDuracao(avgDuracao), icon: 'i-lucide-clock' },
  ]
})

function formatPreco(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatDuracao(minutos: number): string {
  if (minutos < 60) return `${minutos} min`
  const h = Math.floor(minutos / 60)
  const m = minutos % 60
  return m > 0 ? `${h}h ${m}min` : `${h}h`
}

// Form dialog state
const showForm = ref(false)
const formLoading = ref(false)
const editingId = ref<string | null>(null)
const form = ref({ nome: '', descricao: '', preco: 0, duracao: 30 })

function openNew() {
  editingId.value = null
  form.value = { nome: '', descricao: '', preco: 0, duracao: 30 }
  showForm.value = true
}

function openEdit(servico: Servico) {
  editingId.value = servico.id
  form.value = {
    nome: servico.nome,
    descricao: servico.descricao || '',
    preco: servico.preco,
    duracao: servico.duracao,
  }
  showForm.value = true
}

async function handleSave() {
  formLoading.value = true
  try {
    if (editingId.value) {
      await $fetch(`/api/servicos/${editingId.value}`, {
        method: 'PATCH',
        body: form.value,
      })
      toast.add({ title: 'Serviço atualizado', color: 'success' })
    }
    else {
      await $fetch('/api/servicos', {
        method: 'POST',
        body: form.value,
      })
      toast.add({ title: 'Serviço criado', color: 'success' })
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

// Delete dialog state
const showDelete = ref(false)
const deleteLoading = ref(false)
const deletingId = ref<string | null>(null)

function openDelete(servico: Servico) {
  deletingId.value = servico.id
  showDelete.value = true
}

async function handleDelete() {
  if (!deletingId.value) return
  deleteLoading.value = true
  try {
    await $fetch(`/api/servicos/${deletingId.value}`, { method: 'DELETE' })
    toast.add({ title: 'Serviço excluído', color: 'success' })
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
      <UDashboardNavbar title="Serviços">
        <template #actions>
          <UButton label="Novo serviço" icon="i-lucide-plus" @click="openNew" />
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

      <!-- Search -->
      <UCard>
        <div class="flex items-center gap-4">
          <UInput
            v-model="search"
            placeholder="Buscar serviço..."
            icon="i-lucide-search"
            class="w-80"
          />
        </div>
      </UCard>

      <!-- Services grid -->
      <div v-if="servicos?.length" class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <UCard v-for="servico in servicos" :key="servico.id">
          <div class="flex flex-col gap-3">
            <div class="flex items-start justify-between">
              <h3 class="font-semibold">{{ servico.nome }}</h3>
              <UDropdownMenu
                :items="[[
                  { label: 'Editar', icon: 'i-lucide-pencil', click: () => openEdit(servico) },
                  { label: 'Excluir', icon: 'i-lucide-trash-2', color: 'error' as const, click: () => openDelete(servico) },
                ]]"
              >
                <UButton icon="i-lucide-ellipsis-vertical" variant="ghost" color="neutral" size="xs" />
              </UDropdownMenu>
            </div>
            <p v-if="servico.descricao" class="text-sm text-muted">{{ servico.descricao }}</p>
            <div class="flex items-center justify-between mt-auto pt-2 border-t border-default">
              <div class="flex items-center gap-1.5 text-sm">
                <UIcon name="i-lucide-clock" class="size-4 text-muted" />
                <span class="text-muted">{{ formatDuracao(servico.duracao) }}</span>
              </div>
              <span class="text-lg font-semibold text-primary">{{ formatPreco(servico.preco) }}</span>
            </div>
          </div>
        </UCard>
      </div>

      <UCard v-else>
        <div class="py-8 text-center text-muted">
          <UIcon name="i-lucide-scissors" class="mx-auto mb-2 size-8" />
          <p>Nenhum serviço cadastrado</p>
          <UButton label="Cadastrar primeiro serviço" variant="link" class="mt-2" @click="openNew" />
        </div>
      </UCard>
    </div>

    <!-- Form dialog -->
    <FormDialog v-model="showForm" :title="editingId ? 'Editar serviço' : 'Novo serviço'" :loading="formLoading" @save="handleSave">
      <div class="flex flex-col gap-4">
        <UFormField label="Nome" required>
          <UInput v-model="form.nome" placeholder="Ex: Corte Social" />
        </UFormField>
        <UFormField label="Descrição">
          <UTextarea v-model="form.descricao" placeholder="Descrição do serviço..." :rows="2" />
        </UFormField>
        <div class="grid grid-cols-2 gap-4">
          <UFormField label="Preço (R$)" required>
            <UInput v-model.number="form.preco" type="number" :min="0" step="0.01" />
          </UFormField>
          <UFormField label="Duração (min)" required>
            <UInput v-model.number="form.duracao" type="number" :min="5" step="5" />
          </UFormField>
        </div>
      </div>
    </FormDialog>

    <!-- Delete confirmation -->
    <ConfirmDialog v-model="showDelete" :loading="deleteLoading" @confirm="handleDelete" />
  </UDashboardPanel>
</template>
