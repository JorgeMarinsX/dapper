import type { NotificacaoConfig } from '~/types/entities'
import type { BarbeariaForm } from '~/types/forms'

export function useConfiguracoes() {
  const { user, fetchUser } = useAuth()

  // Shop data form
  const shopForm = ref<BarbeariaForm>({
    nome: '',
    cnpj: '',
    telefone: '',
    endereco: '',
  })

  watch(user, (val) => {
    if (val) {
      shopForm.value = {
        nome: val.nome,
        cnpj: val.cnpj,
        telefone: val.telefone,
        endereco: val.endereco,
      }
    }
  }, { immediate: true })

  const { loading: shopLoading, execute: executeShopSave } = useApiMutation({
    successMessage: 'Dados atualizados',
    errorMessage: 'Erro ao salvar',
  })

  async function saveShop() {
    const result = await executeShopSave('/api/barbearia', {
      method: 'PATCH',
      body: shopForm.value,
    })
    if (result !== null) {
      await fetchUser()
    }
  }

  // Notifications
  const { data: notificacoesData } = useFetch<NotificacaoConfig>('/api/barbearia/notificacoes')

  const notificacoes = ref({
    emailConfirmacao: true,
    smsLembrete: true,
    antecedencia: 2,
  })

  watch(notificacoesData, (val) => {
    if (val) {
      notificacoes.value = {
        emailConfirmacao: val.emailConfirmacao,
        smsLembrete: val.smsLembrete,
        antecedencia: val.antecedencia,
      }
    }
  }, { immediate: true })

  const { loading: notifLoading, execute: executeNotifSave } = useApiMutation({
    successMessage: 'Notificações atualizadas',
    errorMessage: 'Erro ao salvar',
  })

  async function saveNotificacoes() {
    await executeNotifSave('/api/barbearia/notificacoes', {
      method: 'PATCH',
      body: notificacoes.value,
    })
  }

  return {
    shopForm,
    shopLoading,
    saveShop,
    notificacoes,
    notifLoading,
    saveNotificacoes,
  }
}
