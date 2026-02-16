import type { Servico } from '~/types/entities'
import type { ServicoForm } from '~/types/forms'

const defaultForm: ServicoForm = {
  nome: '',
  descricao: '',
  preco: 0,
  duracao: 30,
}

export function useServicos() {
  // Filters
  const search = ref('')

  // Data fetching
  const { data: servicos, refresh } = useFetch<Servico[]>('/api/servicos', {
    query: { search },
  })

  // Stats
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
  } = useCrudDialogs<ServicoForm, Servico>(
    defaultForm,
    {
      apiUrl: '/api/servicos',
      entityName: 'Serviço',
      onSaveSuccess: refresh,
      onDeleteSuccess: refresh,
    },
  )

  function editServico(servico: Servico) {
    openEdit(servico, s => ({
      nome: s.nome,
      descricao: s.descricao || '',
      preco: s.preco,
      duracao: s.duracao,
    }))
  }

  return {
    // Data
    servicos,
    stats,

    // Filters
    search,

    // CRUD
    showForm,
    editingId,
    form,
    formLoading,
    openNew,
    editServico,
    handleSave,
    showDelete,
    deleteLoading,
    openDelete,
    handleDelete,
  }
}
