<script setup lang="ts">
const { user, fetchUser } = useAuth()

// Shop data form (from auth user)
const shopForm = ref({
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
interface NotificacaoConfig {
  emailConfirmacao: boolean
  smsLembrete: boolean
  antecedencia: number
}

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
</script>

<template>
  <div class="w-full">
    <UDashboardPanel>
      <UDashboardNavbar title="Configurações" />

      <div class="flex flex-col gap-6 p-6 max-w-4xl">
        <!-- Dados da Barbearia -->
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-store" class="size-5 text-primary" />
              <h2 class="font-semibold">Dados da Barbearia</h2>
            </div>
          </template>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <UFormField label="Nome">
              <UInput v-model="shopForm.nome" size="xl" />
            </UFormField>
            <UFormField label="CNPJ">
              <UInput v-model="shopForm.cnpj" size="xl" />
            </UFormField>
            <UFormField label="Telefone">
              <UInput v-model="shopForm.telefone" size="xl" />
            </UFormField>
            <UFormField label="Endereço" class="sm:col-span-2">
              <UInput v-model="shopForm.endereco" size="xl" />
            </UFormField>
          </div>

          <template #footer>
            <div class="flex justify-end">
              <UButton label="Salvar alterações" icon="i-lucide-save" :loading="shopLoading" @click="saveShop" />
            </div>
          </template>
        </UCard>

        <!-- Notificações -->
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-bell" class="size-5 text-primary" />
              <h2 class="font-semibold">Notificações</h2>
            </div>
          </template>

          <div class="flex flex-col gap-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium">E-mail de confirmação</p>
                <p class="text-xs text-muted">Enviar e-mail ao cliente quando um agendamento for confirmado</p>
              </div>
              <USwitch v-model="notificacoes.emailConfirmacao" />
            </div>
            <USeparator />
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium">SMS de lembrete</p>
                <p class="text-xs text-muted">Enviar SMS de lembrete antes do agendamento</p>
              </div>
              <USwitch v-model="notificacoes.smsLembrete" />
            </div>
            <USeparator />
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium">Antecedência do lembrete</p>
                <p class="text-xs text-muted">Quanto tempo antes do agendamento enviar o lembrete</p>
              </div>
              <USelect
                v-model="notificacoes.antecedencia"
                :items="ANTECEDENCIA_OPTIONS"
                value-key="value"
                label-key="label"
                class="w-44"
              />
            </div>
          </div>

          <template #footer>
            <div class="flex justify-end">
              <UButton label="Salvar notificações" icon="i-lucide-save" :loading="notifLoading" @click="saveNotificacoes" />
            </div>
          </template>
        </UCard>
      </div>
    </UDashboardPanel>
  </div>
</template>
