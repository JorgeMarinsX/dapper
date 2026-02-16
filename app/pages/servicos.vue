<script setup lang="ts">
const {
  servicos,
  stats,
  search,
  showForm,
  editingId,
  form,
  formLoading,
  openNew,
  editServico,
  handleSave,
  showDelete,
  deleteLoading,
  openDelete,
  handleDelete,
} = useServicos()
</script>

<template>
  <div class="w-full">
    <UDashboardPanel>
      <UDashboardNavbar title="Serviços">
        <template #right>
          <UButton label="Novo serviço" icon="i-lucide-plus" @click="openNew" />
        </template>
      </UDashboardNavbar>

      <div class="flex flex-col gap-6 p-6">
        <!-- Stats -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            v-for="stat in stats"
            :key="stat.label"
            :label="stat.label"
            :value="stat.value"
            :icon="stat.icon"
          />
        </div>

        <!-- Search -->
        <UCard>
          <div class="flex items-center gap-4">
            <UInput
              v-model="search"
              placeholder="Buscar serviço..."
              icon="i-lucide-search"
              class="w-80"
              size="xl"
            />
          </div>
        </UCard>

        <!-- Services grid -->
        <div v-if="servicos?.length" class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <UCard v-for="servico in servicos" :key="servico.id">
            <div class="flex flex-col gap-3">
              <div class="flex items-start justify-between">
                <h3 class="font-semibold">{{ servico.nome }}</h3>
                <UDropdownMenu
                  :items="[[
                    { label: 'Editar', icon: 'i-lucide-pencil', click: () => editServico(servico) },
                    { label: 'Excluir', icon: 'i-lucide-trash-2', color: 'error' as const, click: () => openDelete(servico) },
                  ]]"
                >
                  <UButton icon="i-lucide-ellipsis-vertical" variant="ghost" color="neutral" size="xs" />
                </UDropdownMenu>
              </div>
              <p v-if="servico.descricao" class="text-sm text-muted">{{ servico.descricao }}</p>
              <div class="flex items-center justify-between mt-auto pt-2 border-t border-default">
                <div class="flex items-center gap-1.5 text-sm">
                  <UIcon name="i-lucide-clock" class="size-4 text-muted" />
                  <span class="text-muted">{{ formatDuracao(servico.duracao) }}</span>
                </div>
                <span class="text-lg font-semibold text-primary">{{ formatPreco(servico.preco) }}</span>
              </div>
            </div>
          </UCard>
        </div>

        <UCard v-else>
          <div class="py-8 text-center text-muted">
            <UIcon name="i-lucide-scissors" class="mx-auto mb-2 size-8" />
            <p>Nenhum serviço cadastrado</p>
            <UButton label="Cadastrar primeiro serviço" variant="link" class="mt-2" @click="openNew" />
          </div>
        </UCard>
      </div>

      <!-- Form dialog -->
      <FormDialog v-model="showForm" :title="editingId ? 'Editar serviço' : 'Novo serviço'" :loading="formLoading" @save="handleSave">
        <div class="flex flex-col gap-4">
          <UFormField label="Nome" required>
            <UInput v-model="form.nome" placeholder="Ex: Corte Social" size="xl" class="w-full"/>
          </UFormField>
          <UFormField label="Descrição">
            <UTextarea v-model="form.descricao" placeholder="Descrição do serviço..." :rows="2" class="w-full" />
          </UFormField>
          <div class="grid grid-cols-2 gap-4">
            <UFormField label="Preço (R$)" required>
              <UInput v-model.number="form.preco" type="number" :min="0" step="0.01" size="xl" class="w-full" />
            </UFormField>
            <UFormField label="Duração (min)" required>
              <UInput v-model.number="form.duracao" type="number" :min="5" step="5" size="xl" class="w-full" />
            </UFormField>
          </div>
        </div>
      </FormDialog>

      <!-- Delete confirmation -->
      <ConfirmDialog v-model="showDelete" :loading="deleteLoading" @confirm="handleDelete" />
    </UDashboardPanel>
  </div>
</template>
