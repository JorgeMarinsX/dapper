import type { AgendamentoConsulta } from '~/types/entities'

export function useConsultaAgendamentos(slug: string) {
  const loading = ref(false)
  const error = ref('')
  const agendamentos = ref<AgendamentoConsulta[]>([])
  const lastEmail = ref('')
  const searched = ref(false)

  async function consultarPorEmail(email: string) {
    const trimmed = email.trim().toLowerCase()

    if (!trimmed) {
      error.value = 'Informe um e-mail válido.'
      return
    }

    if (trimmed.includes('*') || trimmed.includes(',') || trimmed.includes(';')) {
      error.value = 'Informe apenas um endereço de e-mail.'
      return
    }

    loading.value = true
    error.value = ''
    searched.value = true

    try {
      const data = await $fetch<AgendamentoConsulta[]>(`/api/public/${slug}/agendamentos`, {
        query: { email: trimmed },
      })
      agendamentos.value = Array.isArray(data) ? data : [data]
      lastEmail.value = trimmed
    } catch (e: any) {
      agendamentos.value = []
      error.value = e?.data?.statusMessage || e?.message || 'Erro inesperado'
    } finally {
      loading.value = false
    }
  }

  function limpar() {
    agendamentos.value = []
    error.value = ''
    lastEmail.value = ''
    loading.value = false
    searched.value = false
  }

  return {
    agendamentos,
    loading,
    error,
    lastEmail,
    searched,
    consultarPorEmail,
    limpar,
  }
}
