<script setup lang="ts">
interface Horario {
  id?: string
  diaSemana: number
  aberto: boolean
  inicio: string
  fim: string
}

interface Unidade {
  id: string
  nome: string
  endereco: string
  telefone?: string
  _count?: { barbeiros: number; agendamentos: number }
}

const toast = useToast()

const { data: unidades, refresh } = useFetch<Unidade[]>('/api/unidades')

const diasSemana: Record<number, string> = {
  0: 'Domingo',
  1: 'Segunda-feira',
  2: 'Terça-feira',
  3: 'Quarta-feira',
  4: 'Quinta-feira',
  5: 'Sexta-feira',
  6: 'Sábado',
}

// Form dialog
const showForm = ref(false)
const formLoading = ref(false)
const editingId = ref<string | null>(null)
const form = ref({ nome: '', endereco: '', telefone: '' })

function openNew() {
  editingId.value = null
  form.value = { nome: '', endereco: '', telefone: '' }
  showForm.value = true
}

function openEdit(unidade: Unidade) {
  editingId.value = unidade.id
  form.value = {
    nome: unidade.nome,
    endereco: unidade.endereco,
    telefone: unidade.telefone || '',
  }
  showForm.value = true
}

async function handleSave() {
  formLoading.value = true
  try {
    const body = {
      nome: form.value.nome,
      endereco: form.value.endereco,
      telefone: form.value.telefone || undefined,
    }
    if (editingId.value) {
      await $fetch(`/api/unidades/${editingId.value}`, { method: 'PATCH', body })
      toast.add({ title: 'Unidade atualizada', color: 'success' })
    }
    else {
      await $fetch('/api/unidades', { method: 'POST', body })
      toast.add({ title: 'Unidade criada', color: 'success' })
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

function openDelete(unidade: Unidade) {
  deletingId.value = unidade.id
  showDelete.value = true
}

async function handleDelete() {
  if (!deletingId.value) return
  deleteLoading.value = true
  try {
    await $fetch(`/api/unidades/${deletingId.value}`, { method: 'DELETE' })
    toast.add({ title: 'Unidade excluída', color: 'success' })
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

// Horarios dialog
const showHorarios = ref(false)
const horariosLoading = ref(false)
const horariosUnidadeId = ref<string | null>(null)
const horariosUnidadeNome = ref('')
const horarios = ref<Horario[]>([])

async function openHorarios(unidade: Unidade) {
  horariosUnidadeId.value = unidade.id
  horariosUnidadeNome.value = unidade.nome
  try {
    const data = await $fetch<Horario[]>(`/api/unidades/${unidade.id}/horarios`)
    horarios.value = data.length
      ? data.sort((a, b) => a.diaSemana - b.diaSemana)
      : Array.from({ length: 7 }, (_, i) => ({
          diaSemana: i,
          aberto: i !== 0,
          inicio: '09:00',
          fim: '19:00',
        }))
    showHorarios.value = true
  }
  catch {
    toast.add({ title: 'Erro ao carregar horários', color: 'error' })
  }
}

async function handleSaveHorarios() {
  if (!horariosUnidadeId.value) return
  horariosLoading.value = true
  try {
    await $fetch(`/api/unidades/${horariosUnidadeId.value}/horarios`, {
      method: 'PATCH',
      body: { horarios: horarios.value },
    })
    toast.add({ title: 'Horários salvos', color: 'success' })
    showHorarios.value = false
  }
  catch (e: any) {
    toast.add({ title: e.data?.statusMessage || 'Erro ao salvar horários', color: 'error' })
  }
  finally {
    horariosLoading.value = false
  }
}
</script>

<template>
  <div class="w-full">
  <UDashboardPanel>
    <UDashboardNavbar title="Unidades">
      <template #right>
        <UButton label="Nova unidade" icon="i-lucide-plus" @click="openNew" />
      </template>
    </UDashboardNavbar>

    <div class="flex flex-col gap-6 p-6">
      <!-- Stats -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Total de Unidades" :value="String(unidades?.length || 0)" icon="i-lucide-map-pin" />
      </div>

      <!-- Units grid -->
      <div v-if="unidades?.length" class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <UCard v-for="unidade in unidades" :key="unidade.id">
          <div class="flex flex-col gap-3">
            <div class="flex items-start justify-between">
              <div>
                <h3 class="font-semibold">{{ unidade.nome }}</h3>
                <p class="mt-1 text-sm text-muted">{{ unidade.endereco }}</p>
              </div>
              <UDropdownMenu
                :items="[[
                  { label: 'Editar', icon: 'i-lucide-pencil', click: () => openEdit(unidade) },
                  { label: 'Horários', icon: 'i-lucide-clock', click: () => openHorarios(unidade) },
                  { label: 'Excluir', icon: 'i-lucide-trash-2', color: 'error' as const, click: () => openDelete(unidade) },
                ]]"
              >
                <UButton icon="i-lucide-ellipsis-vertical" variant="ghost" color="neutral" size="xs" />
              </UDropdownMenu>
            </div>

            <div v-if="unidade.telefone" class="flex items-center gap-1.5 text-sm text-muted">
              <UIcon name="i-lucide-phone" class="size-4" />
              {{ unidade.telefone }}
            </div>

            <div class="flex items-center gap-4 pt-2 border-t border-default text-sm text-muted">
              <div class="flex items-center gap-1.5">
                <UIcon name="i-lucide-user-round" class="size-4" />
                {{ unidade._count?.barbeiros || 0 }} barbeiros
              </div>
              <div class="flex items-center gap-1.5">
                <UIcon name="i-lucide-calendar" class="size-4" />
                {{ unidade._count?.agendamentos || 0 }} agendamentos
              </div>
            </div>
          </div>
        </UCard>
      </div>

      <UCard v-else>
        <div class="py-8 text-center text-muted">
          <UIcon name="i-lucide-map-pin" class="mx-auto mb-2 size-8" />
          <p>Nenhuma unidade cadastrada</p>
          <UButton label="Cadastrar primeira unidade" variant="link" class="mt-2" @click="openNew" />
        </div>
      </UCard>
    </div>

    <!-- Form dialog -->
    <FormDialog v-model="showForm" :title="editingId ? 'Editar unidade' : 'Nova unidade'" :loading="formLoading" @save="handleSave">
      <div class="flex flex-col gap-4">
        <UFormField label="Nome" required>
          <UInput v-model="form.nome" placeholder="Ex: Unidade Centro" size="xl" />
        </UFormField>
        <UFormField label="Endereço" required>
          <UInput v-model="form.endereco" placeholder="Rua, número - Bairro, Cidade - UF" size="xl" />
        </UFormField>
        <UFormField label="Telefone">
          <UInput v-model="form.telefone" placeholder="(11) 99999-0000" size="xl" />
        </UFormField>
      </div>
    </FormDialog>

    <!-- Horarios dialog -->
    <FormDialog v-model="showHorarios" :title="`Horários — ${horariosUnidadeNome}`" :loading="horariosLoading" @save="handleSaveHorarios">
      <div class="flex flex-col gap-4">
        <div
          v-for="horario in horarios"
          :key="horario.diaSemana"
          class="flex items-center gap-4"
        >
          <div class="w-36">
            <span class="text-sm font-medium">{{ diasSemana[horario.diaSemana] }}</span>
          </div>
          <USwitch v-model="horario.aberto" />
          <template v-if="horario.aberto">
            <UInput v-model="horario.inicio" type="time" class="w-28" size="xl" />
            <span class="text-muted">às</span>
            <UInput v-model="horario.fim" type="time" class="w-28" size="xl" />
          </template>
          <span v-else class="text-sm text-muted">Fechado</span>
        </div>
      </div>
    </FormDialog>

    <!-- Delete confirmation -->
    <ConfirmDialog v-model="showDelete" :loading="deleteLoading" @confirm="handleDelete" />
  </UDashboardPanel>
  </div>
</template>
