import type {
  BarbeariaPublica,
  UnidadePublica,
  ServicoPublico,
  BarbeiroPublico,
  Horario,
  AgendamentoConfirmado,
} from '~/types/entities'

export function useAgendamentoPublico(slug: string) {
  const step = ref(1)
  const loading = ref(false)
  const error = ref('')

  const selectedUnidade = ref<UnidadePublica | null>(null)
  const selectedServico = ref<ServicoPublico | null>(null)
  const selectedBarbeiro = ref<BarbeiroPublico | null>(null)
  const selectedData = ref('')
  const selectedHorario = ref('')

  const clienteNome = ref('')
  const clienteTelefone = ref('')
  const clienteEmail = ref('')

  const barbearia = ref<BarbeariaPublica | null>(null)
  const servicos = ref<ServicoPublico[]>([])
  const barbeiros = ref<BarbeiroPublico[]>([])
  const horarios = ref<Horario[]>([])
  const slots = ref<string[]>([])
  const confirmacao = ref<AgendamentoConfirmado | null>(null)

  async function load<T>(fn: () => Promise<T>, fallback?: T): Promise<T | null> {
    loading.value = true
    error.value = ''
    try { return await fn() }
    catch (e: any) {
      error.value = e.data?.statusMessage || 'Erro inesperado'
      return fallback ?? null
    }
    finally { loading.value = false }
  }

  async function fetchBarbearia() {
    const data = await load(() => $fetch<BarbeariaPublica>(`/api/public/${slug}`))
    if (!data) return
    barbearia.value = data
    if (data.unidades.length === 1) {
      selectedUnidade.value = data.unidades[0]
      step.value = 2
      await fetchServicos()
    }
  }

  async function fetchServicos() {
    servicos.value = await load(() => $fetch<ServicoPublico[]>(`/api/public/${slug}/servicos`), []) ?? []
  }

  async function fetchBarbeiros() {
    if (!selectedUnidade.value) return
    barbeiros.value = await load(() =>
      $fetch<BarbeiroPublico[]>(`/api/public/${slug}/unidades/${selectedUnidade.value!.id}/barbeiros`),
    [], ) ?? []
  }

  async function fetchHorarios() {
    if (!selectedUnidade.value) return
    horarios.value = await load(() =>
      $fetch<Horario[]>(`/api/public/${slug}/unidades/${selectedUnidade.value!.id}/horarios`),
    [], ) ?? []
  }

  async function fetchSlots(data: string) {
    if (!selectedUnidade.value || !selectedBarbeiro.value || !selectedServico.value) return
    selectedData.value = data
    selectedHorario.value = ''
    const result = await load(() =>
      $fetch<{ slots: string[] }>(`/api/public/${slug}/unidades/${selectedUnidade.value!.id}/disponibilidade`, {
        query: { data, barbeiroId: selectedBarbeiro.value!.id, servicoId: selectedServico.value!.id },
      }),
    )
    slots.value = result?.slots ?? []
  }

  async function selectUnidade(u: UnidadePublica) { selectedUnidade.value = u; step.value = 2; await fetchServicos() }
  async function selectServico(s: ServicoPublico) { selectedServico.value = s; step.value = 3; await fetchBarbeiros() }
  async function selectBarbeiro(b: BarbeiroPublico) { selectedBarbeiro.value = b; step.value = 4; await fetchHorarios() }
  function selectHorario(h: string) { selectedHorario.value = h; step.value = 5 }

  async function submitAgendamento() {
    if (!selectedUnidade.value || !selectedBarbeiro.value || !selectedServico.value) return
    const data = await load(() =>
      $fetch<AgendamentoConfirmado>(`/api/public/${slug}/agendar`, {
        method: 'POST',
        body: {
          nome: clienteNome.value,
          telefone: clienteTelefone.value,
          email: clienteEmail.value || undefined,
          servicoId: selectedServico.value!.id,
          barbeiroId: selectedBarbeiro.value!.id,
          unidadeId: selectedUnidade.value!.id,
          dataHora: `${selectedData.value}T${selectedHorario.value}`,
        },
      }),
    )
    if (data) { confirmacao.value = data; step.value = 6 }
  }

  function goBack() {
    if (step.value <= 1) return
    if (step.value === 2 && barbearia.value?.unidades.length === 1) return
    step.value--
    if (step.value < 5) selectedHorario.value = ''
    if (step.value < 4) { selectedData.value = ''; slots.value = [] }
    if (step.value < 3) selectedBarbeiro.value = null
    if (step.value < 2) selectedServico.value = null
  }

  function isDayOpen(dayOfWeek: number): boolean {
    return !!horarios.value.find(h => h.diaSemana === dayOfWeek)?.aberto
  }

  return {
    step, loading, error,
    barbearia, servicos, barbeiros, horarios, slots, confirmacao,
    selectedUnidade, selectedServico, selectedBarbeiro, selectedData, selectedHorario,
    clienteNome, clienteTelefone, clienteEmail,
    fetchBarbearia, selectUnidade, selectServico, selectBarbeiro,
    fetchSlots, selectHorario, submitAgendamento, goBack, isDayOpen,
  }
}
