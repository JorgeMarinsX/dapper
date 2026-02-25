import type { Agendamento, Barbeiro, PaginatedResponse } from '~/types/entities'

interface AgendamentosResponse extends PaginatedResponse<Agendamento> {
  stats: { label: string; value: string; icon: string }[]
}

export function useDashboard() {
  const today = getTodayISO()

  const { data: agResponse } = useFetch<AgendamentosResponse>('/api/agendamentos', {
    query: { date: today, limit: 100 },
  })

  const { data: barbeiros } = useFetch<Barbeiro[]>('/api/barbeiros')
  const { data: clientesResponse } = useFetch<PaginatedResponse<{ id: string }>>('/api/clientes', {
    query: { limit: 1 },
  })
  const { data: servicos } = useFetch<{ id: string }[]>('/api/servicos')

  const agendamentos = computed(() => agResponse.value?.data || [])

  const stats = computed(() => {
    const list = agendamentos.value
    const concluidos = list.filter(a => a.status === 'CONCLUIDO')
    const receita = concluidos.reduce((sum, a) => sum + (a.servico?.preco || 0), 0)
    return [
      { label: 'Agendamentos Hoje', value: String(agResponse.value?.total || 0), icon: 'i-lucide-calendar-check' },
      { label: 'Receita Hoje', value: formatPreco(receita), icon: 'i-lucide-dollar-sign' },
      { label: 'Total de Clientes', value: String(clientesResponse.value?.total || 0), icon: 'i-lucide-users' },
      { label: 'Total de Serviços', value: String(servicos.value?.length || 0), icon: 'i-lucide-scissors' },
    ]
  })

  return {
    agendamentos,
    barbeiros,
    stats,
  }
}
