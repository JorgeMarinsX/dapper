import type { SelectItem } from '~/types/entities'
import type { AgendamentoForm } from '~/types/forms'

const defaultForm: AgendamentoForm = {
  unidadeId: '',
  clienteId: '',
  barbeiroId: '',
  servicoId: '',
  dataHora: '',
  observacoes: '',
}

export function useAgendamentoForm(onSaved: () => Promise<void>) {
  const showForm = ref(false)
  const form = ref<AgendamentoForm>({ ...defaultForm })

  // --- Unidade / Barbeiro ---
  const { data: unidades } = useFetch<SelectItem[]>('/api/unidades')
  const { data: servicos } = useFetch<SelectItem[]>('/api/servicos')

  const unidadeOptions = useSelectOptions(unidades)
  const servicoOptions = useSelectOptions(servicos)

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

  // --- Serviço selection ---
  const selectedServico = ref<{ label: string, value: string } | null>(null)

  watch(selectedServico, (val) => {
    form.value.servicoId = val?.value ?? ''
  })

  // --- Client search ---
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
        const response = await $fetch<{ data: SelectItem[] }>('/api/clientes', {
          query: { search: term },
        })
        clienteResults.value = toSelectOptions(response.data)
      }
      catch {
        clienteResults.value = []
      }
      finally {
        clienteLoading.value = false
      }
    }, 300)
  })

  // --- Time slot picker ---
  const formDate = ref('')
  const selectedSlot = ref('')
  const availableSlots = ref<string[]>([])
  const slotsLoading = ref(false)

  watch([() => form.value.unidadeId, () => form.value.barbeiroId, () => form.value.servicoId, formDate], async ([unidadeId, barbeiroId, servicoId, data]) => {
    selectedSlot.value = ''
    form.value.dataHora = ''
    availableSlots.value = []

    if (!unidadeId || !barbeiroId || !servicoId || !data) return

    slotsLoading.value = true
    try {
      const result = await $fetch<{ slots: string[] }>('/api/agendamentos/disponibilidade', {
        query: { unidadeId, barbeiroId, servicoId, data },
      })
      availableSlots.value = result.slots
    }
    catch {
      availableSlots.value = []
    }
    finally {
      slotsLoading.value = false
    }
  })

  function selectSlot(slot: string) {
    selectedSlot.value = slot
    form.value.dataHora = `${formDate.value}T${slot}`
  }

  // --- Open / Save ---
  function openNew() {
    form.value = { ...defaultForm }
    selectedCliente.value = null
    selectedServico.value = null
    clienteSearch.value = ''
    clienteResults.value = []
    clienteLoading.value = false
    formDate.value = ''
    selectedSlot.value = ''
    availableSlots.value = []
    showForm.value = true
  }

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
      await onSaved()
    }
  }

  // --- Quick-create dialogs ---
  const showClienteForm = ref(false)
  const showBarbeiroForm = ref(false)

  function onClienteCreated(cliente: { id: string, nome: string }) {
    selectedCliente.value = { label: cliente.nome, value: cliente.id }
  }

  async function onBarbeiroCreated(barbeiro: { id: string, nome: string }) {
    try {
      barbeirosForUnit.value = await $fetch<SelectItem[]>('/api/barbeiros', {
        query: { unidade: form.value.unidadeId },
      })
    }
    catch { /* keep existing list */ }
    form.value.barbeiroId = barbeiro.id
  }

  return {
    showForm,
    form,
    formLoading,
    openNew,
    handleSave,

    // Select options
    unidadeOptions,
    servicoOptions,
    barbeirosOptions,
    selectedCliente,
    clienteSearch,
    clienteResults,
    clienteLoading,
    selectedServico,

    // Slot picker
    formDate,
    selectedSlot,
    availableSlots,
    slotsLoading,
    selectSlot,

    // Quick-create dialogs
    showClienteForm,
    showBarbeiroForm,
    onClienteCreated,
    onBarbeiroCreated,
  }
}
