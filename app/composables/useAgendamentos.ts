import type { Agendamento, SelectItem } from '~/types/entities'
import type { AgendamentoForm } from '~/types/forms'

const defaultForm: AgendamentoForm = {
  unidadeId: '',
  clienteId: '',
  barbeiroId: '',
  servicoId: '',
  dataHora: '',
  observacoes: '',
}

export function useAgendamentos() {
  // Filters
  const search = ref('')
  const statusFilter = ref('')
  const selectedDate = ref(getTodayISO())
  const unidadeFilter = ref('')

  // Data fetching
  const { data: agendamentos, refresh } = useFetch<Agendamento[]>('/api/agendamentos', {
    query: { search, status: statusFilter, date: selectedDate, unidade: unidadeFilter },
  })

  const { data: unidades } = useFetch<SelectItem[]>('/api/unidades')
  const { data: servicos } = useFetch<SelectItem[]>('/api/servicos')

  // Select options
  const unidadeOptions = useSelectOptions(unidades)
  const servicoOptions = useSelectOptions(servicos)

  // Client search (server-side) for UInputMenu
  const clienteSearch = ref('')
  const selectedCliente = ref<{ label: string, value: string } | null>(null)
  const clienteResults = ref<{ label: string, value: string }[]>([])
  const clienteLoading = ref(false)
  let clienteDebounce: ReturnType<typeof setTimeout> | null = null

  watch(selectedCliente, (val) => {
    form.value.clienteId = val?.value ?? ''
  })

  watch(clienteSearch, (term) => {
    if (clienteDebounce) clearTimeout(clienteDebounce)

    if (!term || term.length < 2) {
      clienteResults.value = []
      clienteLoading.value = false
      return
    }
    clienteLoading.value = true
    clienteDebounce = setTimeout(async () => {
      try {
        const data = await $fetch<SelectItem[]>('/api/clientes', {
          query: { search: term },
        })
        clienteResults.value = toSelectOptions(data)
      }
      catch {
        clienteResults.value = []
      }
      finally {
        clienteLoading.value = false
      }
    }, 300)
  })

  // Stats
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
  const form = ref<AgendamentoForm>({ ...defaultForm })

  // Barbeiros filtered by selected unit
  const barbeirosForUnit = ref<SelectItem[]>([])

  watch(() => form.value.unidadeId, async (val) => {
    form.value.barbeiroId = ''
    if (val) {
      try {
        barbeirosForUnit.value = await $fetch<SelectItem[]>('/api/barbeiros', {
          query: { unidade: val },
        })
      }
      catch {
        barbeirosForUnit.value = []
      }
    }
    else {
      barbeirosForUnit.value = []
    }
  })

  const barbeirosOptions = computed(() => toSelectOptions(barbeirosForUnit.value))

  function openNew() {
    form.value = { ...defaultForm }
    selectedCliente.value = null
    clienteSearch.value = ''
    clienteResults.value = []
    clienteLoading.value = false
    showForm.value = true
  }

  // Save mutation
  const { loading: formLoading, execute: executeCreate } = useApiMutation({
    successMessage: 'Agendamento criado',
    errorMessage: 'Erro ao criar agendamento',
  })

  async function handleSave() {
    const result = await executeCreate('/api/agendamentos', {
      method: 'POST',
      body: form.value,
    })
    if (result !== null) {
      showForm.value = false
      await refresh()
    }
  }

  // Status update
  const { execute: executeUpdateStatus } = useApiMutation({
    successMessage: 'Status atualizado',
    errorMessage: 'Erro ao atualizar',
  })

  async function updateStatus(agendamento: Agendamento, newStatus: string) {
    const result = await executeUpdateStatus(`/api/agendamentos/${agendamento.id}`, {
      method: 'PATCH',
      body: { status: newStatus },
    })
    if (result !== null) {
      await refresh()
    }
  }

  // Delete dialog
  const deleteDialog = useDeleteDialog<Agendamento>()
  const { loading: deleteLoading, remove } = useDeleteMutation('/api/agendamentos', {
    successMessage: 'Agendamento excluído',
    onSuccess: async () => {
      deleteDialog.close()
      await refresh()
    },
  })

  async function handleDelete() {
    if (!deleteDialog.deletingId.value) return
    await remove(deleteDialog.deletingId.value)
  }

  function clearFilters() {
    search.value = ''
    statusFilter.value = ''
    selectedDate.value = ''
    unidadeFilter.value = ''
  }

  const hasFilters = computed(() =>
    Boolean(search.value || statusFilter.value || selectedDate.value || unidadeFilter.value),
  )

  return {
    // Data
    agendamentos,
    stats,

    // Filters
    search,
    statusFilter,
    selectedDate,
    unidadeFilter,
    unidadeOptions,
    hasFilters,
    clearFilters,

    // Form
    showForm,
    form,
    formLoading,
    openNew,
    handleSave,
    selectedCliente,
    clienteSearch,
    clienteResults,
    clienteLoading,
    servicoOptions,
    barbeirosOptions,

    // Status
    updateStatus,

    // Delete
    deleteDialog,
    deleteLoading,
    handleDelete,
  }
}
