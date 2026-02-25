import type { Agendamento } from '~/types/entities'

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

  // Form (delegated to useAgendamentoForm)
  const formState = useAgendamentoForm(() => refresh())

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
    hasFilters,
    clearFilters,

    // Form (spread from useAgendamentoForm)
    ...formState,

    // Status
    updateStatus,

    // Delete
    deleteDialog,
    deleteLoading,
    handleDelete,
  }
}
