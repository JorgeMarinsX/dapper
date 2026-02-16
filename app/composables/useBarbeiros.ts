import type { Barbeiro, Unidade } from '~/types/entities'
import type { BarbeiroForm } from '~/types/forms'

const defaultForm: BarbeiroForm = {
  nome: '',
  email: '',
  telefone: '',
  unidadeId: '',
}

export function useBarbeiros() {
  // Filters
  const search = ref('')
  const unidadeFilter = ref('')

  // Data fetching
  const { data: barbeiros, refresh } = useFetch<Barbeiro[]>('/api/barbeiros', {
    query: { search, unidade: unidadeFilter },
  })

  const { data: unidades } = useFetch<Unidade[]>('/api/unidades')

  // Select options
  const unidadeOptions = useSelectOptions(unidades)

  // Stats
  const stats = computed(() => {
    const list = barbeiros.value || []
    return [
      { label: 'Total de Barbeiros', value: String(list.length), icon: 'i-lucide-user-round' },
      { label: 'Disponíveis', value: String(list.filter(b => b.status === 'DISPONIVEL').length), icon: 'i-lucide-user-check' },
      { label: 'Ocupados', value: String(list.filter(b => b.status === 'OCUPADO').length), icon: 'i-lucide-user-x' },
    ]
  })

  // CRUD dialogs
  const {
    showForm,
    editingId,
    form,
    formLoading,
    openNew,
    openEdit,
    handleSave,
    showDelete,
    deleteLoading,
    openDelete,
    handleDelete,
  } = useCrudDialogs<BarbeiroForm, Barbeiro>(
    defaultForm,
    {
      apiUrl: '/api/barbeiros',
      entityName: 'Barbeiro',
      onSaveSuccess: refresh,
      onDeleteSuccess: refresh,
    },
  )

  function editBarbeiro(barbeiro: Barbeiro) {
    openEdit(barbeiro, b => ({
      nome: b.nome,
      email: b.email,
      telefone: b.telefone,
      unidadeId: b.unidadeId,
    }))
  }

  return {
    // Data
    barbeiros,
    unidades,
    stats,

    // Filters
    search,
    unidadeFilter,
    unidadeOptions,

    // CRUD
    showForm,
    editingId,
    form,
    formLoading,
    openNew,
    editBarbeiro,
    handleSave,
    showDelete,
    deleteLoading,
    openDelete,
    handleDelete,
  }
}
