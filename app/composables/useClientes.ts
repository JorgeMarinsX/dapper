import type { Cliente } from '~/types/entities'
import type { ClienteForm } from '~/types/forms'

const defaultForm: ClienteForm = {
  nome: '',
  telefone: '',
  email: '',
}

export function useClientes() {
  // Filters
  const search = ref('')

  // Data fetching
  const { data: clientes, refresh } = useFetch<Cliente[]>('/api/clientes', {
    query: { search },
  })

  // Stats
  const stats = computed(() => [
    { label: 'Total de Clientes', value: String(clientes.value?.length || 0), icon: 'i-lucide-users' },
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
  } = useCrudDialogs<ClienteForm, Cliente>(
    defaultForm,
    {
      apiUrl: '/api/clientes',
      entityName: 'Cliente',
      onSaveSuccess: refresh,
      onDeleteSuccess: refresh,
    },
  )

  const { loading: saveLoading, save } = useSaveMutation<Cliente>('/api/clientes', {
    createMessage: 'Cliente criado',
    updateMessage: 'Cliente atualizado',
    onSuccess: async () => {
      showForm.value = false
      await refresh()
    },
  })

  function editCliente(cliente: Cliente) {
    openEdit(cliente, c => ({
      nome: c.nome,
      telefone: c.telefone,
      email: c.email || '',
    }))
  }

  async function handleSave() {
    const body = {
      nome: form.value.nome,
      telefone: form.value.telefone,
      email: form.value.email || undefined,
    }
    await save(editingId.value, body)
  }

  return {
    // Data
    clientes,
    stats,

    // Filters
    search,

    // CRUD
    showForm,
    editingId,
    form,
    formLoading: saveLoading,
    openNew,
    editCliente,
    handleSave,
    showDelete,
    deleteLoading,
    openDelete,
    handleDelete,
  }
}
