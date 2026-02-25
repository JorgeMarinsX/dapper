import type { Agendamento, Horario, SelectItem, TimelineSlot } from '~/types/entities'

export function useCalendario() {
  const selectedDate = ref(getTodayISO())
  const unidadeFilter = ref('')
  const barbeiroFilter = ref<string[]>([])

  // Data fetching
  const { data: agendamentos } = useFetch<Agendamento[]>('/api/agendamentos', {
    query: { date: selectedDate, unidade: unidadeFilter },
  })

  const { data: unidades } = useFetch<SelectItem[]>('/api/unidades')
  const unidadeOptions = useSelectOptions(unidades)

  // Barbeiros for the selected unit
  const { data: barbeiros } = useFetch<SelectItem[]>('/api/barbeiros', {
    query: { unidade: unidadeFilter },
  })

  // Operating hours for selected unit
  const { data: horarios } = useFetch<Horario[]>(() =>
    unidadeFilter.value ? `/api/unidades/${unidadeFilter.value}/horarios` : null,
  )

  // Day of week for the selected date (0=Sunday)
  const selectedDayOfWeek = computed(() => {
    if (!selectedDate.value) return 1
    const [y, m, d] = selectedDate.value.split('-').map(Number)
    return new Date(y, m - 1, d).getDay()
  })

  // Operating hours for the selected day
  const dayHorario = computed(() => {
    if (!horarios.value?.length) return null
    return horarios.value.find(h => h.diaSemana === selectedDayOfWeek.value) || null
  })

  // Grid hours derived from the unit's actual business hours for the selected day
  const gridHours = computed<{ start: number; end: number } | null>(() => {
    if (!dayHorario.value || !dayHorario.value.aberto) return null

    const [sh, sm] = dayHorario.value.inicio.split(':').map(Number)
    const [eh, em] = dayHorario.value.fim.split(':').map(Number)
    return { start: sh * 60 + sm, end: eh * 60 + em }
  })

  // Whether the unit is closed on the selected day
  const isClosed = computed(() => {
    if (!dayHorario.value) return false
    return !dayHorario.value.aberto
  })

  // Build barber color map: barberId → color
  const barbeiroColorMap = computed(() => {
    const map = new Map<string, ReturnType<typeof getBarbeiroColor>>()
    const list = barbeiros.value || []
    list.forEach((b, i) => {
      map.set(b.id, getBarbeiroColor(i))
    })
    return map
  })

  // Barber filter options (with colors for chips)
  const barbeiroOptions = computed(() =>
    (barbeiros.value || []).map((b, i) => ({
      label: b.nome,
      value: b.id,
      color: getBarbeiroColor(i),
    })),
  )

  // Filter appointments by selected barbers
  const filteredAgendamentos = computed(() => {
    const list = agendamentos.value || []
    if (barbeiroFilter.value.length === 0) return list
    return list.filter(a => barbeiroFilter.value.includes(a.barbeiro.id))
  })

  // Transform agendamentos to TimelineSlot format
  const timelineSlots = computed<TimelineSlot[]>(() =>
    filteredAgendamentos.value
      .filter(a => a.status !== 'CANCELADO' && a.status !== 'NAO_COMPARECEU')
      .map(a => ({
        id: a.id,
        startMinute: dateToSaoPauloMinutes(a.dataHora),
        durationMinutes: a.servico.duracao,
        label: `${a.barbeiro.nome} — ${a.cliente.nome}`,
        sublabel: a.servico.nome,
        color: barbeiroColorMap.value.get(a.barbeiro.id) || getBarbeiroColor(0),
      })),
  )

  // Current time in minutes (updates every minute)
  const nowMinutes = ref(getNowMinutes())
  let nowInterval: ReturnType<typeof setInterval> | null = null

  onMounted(() => {
    nowInterval = setInterval(() => {
      nowMinutes.value = getNowMinutes()
    }, 60_000)
  })

  onUnmounted(() => {
    if (nowInterval) clearInterval(nowInterval)
  })

  // Show current time indicator only if viewing today
  const currentTimeMinute = computed(() =>
    selectedDate.value === getTodayISO() ? nowMinutes.value : undefined,
  )

  // Date navigation
  function prevDay() {
    const [y, m, d] = selectedDate.value.split('-').map(Number)
    const date = new Date(y, m - 1, d - 1)
    selectedDate.value = formatDateISO(date)
  }

  function nextDay() {
    const [y, m, d] = selectedDate.value.split('-').map(Number)
    const date = new Date(y, m - 1, d + 1)
    selectedDate.value = formatDateISO(date)
  }

  function goToday() {
    selectedDate.value = getTodayISO()
  }

  // Short label for the nav button (shows "Hoje" when viewing today, otherwise the date)
  const navLabel = computed(() => {
    if (selectedDate.value === getTodayISO()) return 'Hoje'
    const [y, m, d] = selectedDate.value.split('-').map(Number)
    const date = new Date(y, m - 1, d)
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
  })

  // Format date for display
  const displayDate = computed(() => {
    if (!selectedDate.value) return ''
    const [y, m, d] = selectedDate.value.split('-').map(Number)
    const date = new Date(y, m - 1, d)
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  })

  return {
    // Filters
    selectedDate,
    unidadeFilter,
    barbeiroFilter,
    unidadeOptions,
    barbeiroOptions,

    // Data
    timelineSlots,
    gridHours,
    isClosed,
    currentTimeMinute,

    // Navigation
    prevDay,
    nextDay,
    goToday,
    navLabel,
    displayDate,

    // Color map (for legend)
    barbeiroColorMap,
  }
}

function formatDateISO(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}
