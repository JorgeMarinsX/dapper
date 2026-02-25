import type { Agendamento, PaginatedResponse } from '~/types/entities'

interface AgendamentoStats {
  label: string
  value: string
  icon: string
}

type AgendamentosResponse = PaginatedResponse<Agendamento> & { stats: AgendamentoStats[] }

export function useAgendamentos() {
  // Filters
  const search = ref('')
  const statusFilter = ref('')
  const selectedDate = ref(getTodayISO())
  const unidadeFilter = ref('')

  // Pagination
  const page = ref(1)
  const limit = ref(20)

  // Reset page when filters change
  watch([search, statusFilter, selectedDate, unidadeFilter], () => {
    page.value = 1
  })

  // Data fetching
  const { data: response, refresh } = useFetch<AgendamentosResponse>('/api/agendamentos', {
    query: { search, status: statusFilter, date: selectedDate, unidade: unidadeFilter, page, limit },
  })

  const agendamentos = computed(() => response.value?.data || [])
  const stats = computed(() => response.value?.stats || [])
  const totalPages = computed(() => response.value?.totalPages || 1)
  const total = computed(() => response.value?.total || 0)

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

    // Pagination
    page,
    totalPages,
    total,

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
