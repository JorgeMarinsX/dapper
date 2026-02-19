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

  // Slug management
  const slugForm = ref('')
  const slugAvailable = ref<boolean | null>(null)
  const slugChecking = ref(false)

  let slugCheckTimeout: ReturnType<typeof setTimeout> | null = null

  function checkSlugAvailability(slug: string) {
    slugAvailable.value = null
    if (slugCheckTimeout) clearTimeout(slugCheckTimeout)
    if (!slug || slug.length < 3) return

    slugChecking.value = true
    slugCheckTimeout = setTimeout(async () => {
      try {
        const result = await $fetch<{ available: boolean }>('/api/barbearia/check-slug', {
          query: { slug },
        })
        slugAvailable.value = result.available
      }
      catch {
        slugAvailable.value = null
      }
      finally {
        slugChecking.value = false
      }
    }, 500)
  }

  watch(slugForm, (val) => {
    const formatted = val.toLowerCase().replace(/[^a-z0-9-]/g, '')
    if (formatted !== val) slugForm.value = formatted
    else checkSlugAvailability(val)
  })

  const { loading: slugLoading, execute: executeSlugSave } = useApiMutation({
    successMessage: 'Link atualizado',
    errorMessage: 'Erro ao atualizar link',
  })

  async function saveSlug() {
    const result = await executeSlugSave('/api/barbearia', {
      method: 'PATCH',
      body: { slug: slugForm.value },
    })
    if (result !== null) {
      await fetchUser()
    }
  }

  watch(user, (val) => {
    if (val) {
      shopForm.value = {
        nome: val.nome,
        cnpj: val.cnpj,
        telefone: val.telefone,
        endereco: val.endereco,
      }
      slugForm.value = val.slug
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
    slugForm,
    slugAvailable,
    slugChecking,
    slugLoading,
    saveSlug,
    notificacoes,
    notifLoading,
    saveNotificacoes,
  }
}
