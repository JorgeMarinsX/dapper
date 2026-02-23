// app/composables/useConsultaAgendamentos.ts
import type { AgendamentoConfirmado } from '~/types/entities'

export function useConsultaAgendamentos() {
  const loading = ref(false)
  const error = ref('')
  const agendamentos = ref<AgendamentoConfirmado[]>([])
  const lastEmail = ref('')

  async function load<T>(fn: () => Promise<T>, fallback?: T): Promise<T | null> {
    loading.value = true
    error.value = ''
    try {
      return await fn()
    } catch (e: any) {
      error.value = e?.data?.statusMessage || e?.message || 'Erro inesperado'
      return fallback ?? null
    } finally {
      loading.value = false
    }
  }


  async function consultarPorEmail(email: string) {
    if (!email) {
      error.value = 'Informe um email válido.'
      return
    }

    const data = await load(() =>
      $fetch<AgendamentoConfirmado[]>(`/api/agendamentos/cliente`, {
        method: 'GET',
        query: { email },
      }),
      [],
    )

    if (data) {
      agendamentos.value = Array.isArray(data) ? data : [data]
      lastEmail.value = email
    } else {
      agendamentos.value = []
    }
  }

  function limpar() {
    agendamentos.value = []
    error.value = ''
    lastEmail.value = ''
    loading.value = false
  }

  return {
    agendamentos,
    loading,
    error,
    lastEmail,
    consultarPorEmail,
    limpar,
  }
}