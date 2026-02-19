<script setup lang="ts">
const {
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
} = useConfiguracoes()

const requestURL = useRequestURL()
</script>

<template>
  <div class="w-full">
    <UDashboardPanel>
      <UDashboardNavbar title="Configurações" />

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
        <!-- Dados da Barbearia -->
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-store" class="size-5 text-primary" />
              <h2 class="font-semibold">Dados da Barbearia</h2>
            </div>
          </template>

          <div class="grid grid-cols-2 gap-3">
            <UFormField label="Nome">
              <UInput v-model="shopForm.nome" size="xl" />
            </UFormField>
            <UFormField label="CNPJ">
              <UInput v-model="shopForm.cnpj" size="xl" />
            </UFormField>
            <UFormField label="Telefone">
              <UInput v-model="shopForm.telefone" size="xl" />
            </UFormField>
            <UFormField label="Endereço">
              <UInput v-model="shopForm.endereco" size="xl" />
            </UFormField>
          </div>

          <template #footer>
            <div class="flex justify-end">
              <UButton label="Salvar alterações" icon="i-lucide-save" :loading="shopLoading" @click="saveShop" />
            </div>
          </template>
        </UCard>

        <!-- Página de Agendamento -->
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-link" class="size-5 text-primary" />
              <h2 class="font-semibold">Página de Agendamento</h2>
            </div>
          </template>

          <div class="flex flex-col gap-3">
            <p class="text-sm text-muted">
              Compartilhe este link para seus clientes agendarem online.
            </p>

            <UFormField label="Slug da sua página">
              <UInput v-model="slugForm" size="xl" placeholder="minha-barbearia">
                <template #leading>
                  <span class="text-xs text-muted pl-1">/</span>
                </template>
              </UInput>
            </UFormField>

            <div class="flex items-center gap-2 text-sm">
              <template v-if="slugChecking">
                <UIcon name="i-lucide-loader-2" class="size-4 animate-spin text-muted" />
                <span class="text-muted">Verificando disponibilidade...</span>
              </template>
              <template v-else-if="slugAvailable === true">
                <UIcon name="i-lucide-check-circle" class="size-4 text-green-500" />
                <span class="text-green-500">Slug disponível</span>
              </template>
              <template v-else-if="slugAvailable === false">
                <UIcon name="i-lucide-x-circle" class="size-4 text-red-500" />
                <span class="text-red-500">Slug já em uso</span>
              </template>
            </div>

            <div v-if="slugForm" class="rounded-lg bg-elevated p-3">
              <p class="text-xs text-muted mb-1">Link da sua página:</p>
              <p class="text-sm font-mono font-medium text-primary break-all">
                {{ `${requestURL.origin}/${slugForm}` }}
              </p>
            </div>
          </div>

          <template #footer>
            <div class="flex justify-end">
              <UButton
                label="Salvar link"
                icon="i-lucide-save"
                :loading="slugLoading"
                :disabled="slugAvailable === false || slugChecking || !slugForm || slugForm.length < 3"
                @click="saveSlug"
              />
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
                <p class="text-xs text-muted">Enviar e-mail ao confirmar agendamento</p>
              </div>
              <USwitch v-model="notificacoes.emailConfirmacao" />
            </div>
            <USeparator />
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium">SMS de lembrete</p>
                <p class="text-xs text-muted">SMS antes do agendamento</p>
              </div>
              <USwitch v-model="notificacoes.smsLembrete" />
            </div>
            <USeparator />
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium">Antecedência</p>
                <p class="text-xs text-muted">Tempo antes do lembrete</p>
              </div>
              <USelect
                v-model="notificacoes.antecedencia"
                :items="ANTECEDENCIA_OPTIONS"
                value-key="value"
                label-key="label"
                class="w-40"
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
