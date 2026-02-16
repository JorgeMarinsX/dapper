import type { Horario, Unidade } from '~/types/entities'
import type { UnidadeForm } from '~/types/forms'

const defaultForm: UnidadeForm = {
  nome: '',
  endereco: '',
  telefone: '',
}

const defaultHorarios = (): Horario[] =>
  Array.from({ length: 7 }, (_, i) => ({
    diaSemana: i,
    aberto: i !== 0,
    inicio: '09:00',
    fim: '19:00',
  }))

export function useUnidades() {
  const toast = useToast()

  // Data fetching
  const { data: unidades, refresh } = useFetch<Unidade[]>('/api/unidades')

  // Stats
  const stats = computed(() => [
    { label: 'Total de Unidades', value: String(unidades.value?.length || 0), icon: 'i-lucide-map-pin' },
  ])

  // CRUD dialogs
  const {
    showForm,
    editingId,
    form,
    formLoading,
    openNew,
    openEdit,
    showDelete,
    deleteLoading,
    openDelete,
    handleDelete,
  } = useCrudDialogs<UnidadeForm, Unidade>(
    defaultForm,
    {
      apiUrl: '/api/unidades',
      entityName: 'Unidade',
      onSaveSuccess: refresh,
      onDeleteSuccess: refresh,
    },
  )

  const { loading: saveLoading, save } = useSaveMutation<Unidade>('/api/unidades', {
    createMessage: 'Unidade criada',
    updateMessage: 'Unidade atualizada',
    onSuccess: async () => {
      showForm.value = false
      await refresh()
    },
  })

  function editUnidade(unidade: Unidade) {
    openEdit(unidade, u => ({
      nome: u.nome,
      endereco: u.endereco,
      telefone: u.telefone || '',
    }))
  }

  async function handleSave() {
    const body = {
      nome: form.value.nome,
      endereco: form.value.endereco,
      telefone: form.value.telefone || undefined,
    }
    await save(editingId.value, body)
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
        : defaultHorarios()
      showHorarios.value = true
    }
    catch {
      toast.add({ title: 'Erro ao carregar horários', color: 'error' })
    }
  }

  const { loading: horariosApiLoading, execute: executeHorarios } = useApiMutation({
    successMessage: 'Horários salvos',
    errorMessage: 'Erro ao salvar horários',
  })

  async function handleSaveHorarios() {
    if (!horariosUnidadeId.value) return
    horariosLoading.value = true
    const result = await executeHorarios(`/api/unidades/${horariosUnidadeId.value}/horarios`, {
      method: 'PATCH',
      body: { horarios: horarios.value },
    })
    horariosLoading.value = false
    if (result !== null) {
      showHorarios.value = false
    }
  }

  return {
    // Data
    unidades,
    stats,

    // CRUD
    showForm,
    editingId,
    form,
    formLoading: formLoading || saveLoading,
    openNew,
    editUnidade,
    handleSave,
    showDelete,
    deleteLoading,
    openDelete,
    handleDelete,

    // Horarios
    showHorarios,
    horariosUnidadeNome,
    horarios,
    horariosLoading: computed(() => horariosLoading.value || horariosApiLoading.value),
    openHorarios,
    handleSaveHorarios,
  }
}
