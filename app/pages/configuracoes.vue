<script setup lang="ts">
const { user, fetchUser } = useAuth()
const toast = useToast()

// Shop data form (from auth user)
const shopForm = ref({
  nome: '',
  cnpj: '',
  telefone: '',
  endereco: '',
})
const shopLoading = ref(false)

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

async function saveShop() {
  shopLoading.value = true
  try {
    await $fetch('/api/barbearia', { method: 'PATCH', body: shopForm.value })
    await fetchUser()
    toast.add({ title: 'Dados atualizados', color: 'success' })
  }
  catch (e: any) {
    toast.add({ title: e.data?.statusMessage || 'Erro ao salvar', color: 'error' })
  }
  finally {
    shopLoading.value = false
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
const notifLoading = ref(false)

watch(notificacoesData, (val) => {
  if (val) {
    notificacoes.value = {
      emailConfirmacao: val.emailConfirmacao,
      smsLembrete: val.smsLembrete,
      antecedencia: val.antecedencia,
    }
  }
}, { immediate: true })

const antecedenciaOptions = [
  { label: '1 hora antes', value: 1 },
  { label: '2 horas antes', value: 2 },
  { label: '3 horas antes', value: 3 },
  { label: '1 dia antes', value: 24 },
]

async function saveNotificacoes() {
  notifLoading.value = true
  try {
    await $fetch('/api/barbearia/notificacoes', { method: 'PATCH', body: notificacoes.value })
    toast.add({ title: 'Notificações atualizadas', color: 'success' })
  }
  catch (e: any) {
    toast.add({ title: e.data?.statusMessage || 'Erro ao salvar', color: 'error' })
  }
  finally {
    notifLoading.value = false
  }
}
</script>

<template>
  <div>
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
            <UInput v-model="shopForm.nome" />
          </UFormField>
          <UFormField label="CNPJ">
            <UInput v-model="shopForm.cnpj" />
          </UFormField>
          <UFormField label="Telefone">
            <UInput v-model="shopForm.telefone" />
          </UFormField>
          <UFormField label="Endereço" class="sm:col-span-2">
            <UInput v-model="shopForm.endereco" />
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
              :items="antecedenciaOptions"
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
