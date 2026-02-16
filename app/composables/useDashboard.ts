import type { Agendamento, Barbeiro } from '~/types/entities'

export function useDashboard() {
  const today = getTodayISO()

  const { data: agendamentos } = useFetch<Agendamento[]>('/api/agendamentos', {
    query: { date: today },
  })

  const { data: barbeiros } = useFetch<Barbeiro[]>('/api/barbeiros')
  const { data: clientes } = useFetch<{ id: string }[]>('/api/clientes')
  const { data: servicos } = useFetch<{ id: string }[]>('/api/servicos')

  const stats = computed(() => {
    const list = agendamentos.value || []
    const concluidos = list.filter(a => a.status === 'CONCLUIDO')
    const receita = concluidos.reduce((sum, a) => sum + (a.servico?.preco || 0), 0)
    return [
      { label: 'Agendamentos Hoje', value: String(list.length), icon: 'i-lucide-calendar-check' },
      { label: 'Receita Hoje', value: formatPreco(receita), icon: 'i-lucide-dollar-sign' },
      { label: 'Total de Clientes', value: String(clientes.value?.length || 0), icon: 'i-lucide-users' },
      { label: 'Total de Serviços', value: String(servicos.value?.length || 0), icon: 'i-lucide-scissors' },
    ]
  })

  return {
    agendamentos,
    barbeiros,
    stats,
  }
}
