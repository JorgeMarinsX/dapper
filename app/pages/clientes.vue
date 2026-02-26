<script setup lang="ts">
const {
  clientes,
  stats,
  page,
  totalPages,
  total,
  search,
  showForm,
  editingId,
  form,
  formLoading,
  openNew,
  editCliente,
  handleSave,
  showDelete,
  deleteLoading,
  openDelete,
  handleDelete,
} = useClientes()
</script>

<template>
  <div class="w-full overflow-y-auto">
    <UDashboardPanel class="flex flex-col">
      <UDashboardNavbar title="Clientes">
        <template #right>
          <UButton label="Novo cliente" icon="i-lucide-user-plus" @click="openNew" />
        </template>
      </UDashboardNavbar>

      <div class="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto p-6">
        <!-- Stats -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
              placeholder="Buscar por nome, telefone ou e-mail..."
              icon="i-lucide-search"
              class="w-80"
              size="xl"
            />
          </div>
        </UCard>

        <!-- Table -->
        <UCard v-if="clientes?.length">
          <UTable :data="clientes" :columns="COLUMNS.clientes">
            <template #nome-cell="{ row }">
              <div class="flex items-center gap-3">
                <UAvatar :text="getInitials(row.original.nome)" size="sm" />
                <span class="font-medium">{{ row.original.nome }}</span>
              </div>
            </template>
            <template #email-cell="{ row }">
              <span :class="row.original.email ? '' : 'text-muted'">
                {{ row.original.email || '—' }}
              </span>
            </template>
            <template #actions-cell="{ row }">
              <UDropdownMenu
                :items="[[
                  { label: 'Editar', icon: 'i-lucide-pencil', click: () => editCliente(row.original) },
                  { label: 'Excluir', icon: 'i-lucide-trash-2', color: 'error' as const, click: () => openDelete(row.original) },
                ]]"
              >
                <UButton icon="i-lucide-ellipsis-vertical" variant="ghost" color="neutral" size="xs" />
              </UDropdownMenu>
            </template>
          </UTable>
        </UCard>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="flex items-center justify-between">
          <span class="text-sm text-muted">{{ total }} cliente{{ total !== 1 ? 's' : '' }}</span>
          <div class="flex items-center gap-2">
            <UButton
              icon="i-lucide-chevron-left"
              variant="outline"
              color="neutral"
              size="xs"
              :disabled="page <= 1"
              @click="page--"
            />
            <span class="text-sm">Página {{ page }} de {{ totalPages }}</span>
            <UButton
              icon="i-lucide-chevron-right"
              variant="outline"
              color="neutral"
              size="xs"
              :disabled="page >= totalPages"
              @click="page++"
            />
          </div>
        </div>

        <UCard v-else-if="!clientes?.length">
          <div class="py-8 text-center text-muted">
            <UIcon name="i-lucide-users" class="mx-auto mb-2 size-8" />
            <p>Nenhum cliente cadastrado</p>
            <UButton label="Cadastrar primeiro cliente" variant="link" class="mt-2" @click="openNew" />
          </div>
        </UCard>
      </div>

      <!-- Form dialog -->
      <FormDialog v-model="showForm" :title="editingId ? 'Editar cliente' : 'Novo cliente'" :loading="formLoading" @save="handleSave">
        <div class="flex flex-col gap-4">
          <UFormField label="Nome" required>
            <UInput v-model="form.nome" placeholder="Nome completo" size="xl" class="w-full"/>
          </UFormField>
          <UFormField label="Telefone" required>
            <UInput v-model="form.telefone" placeholder="(11) 99999-0000" size="xl" class="w-full" />
          </UFormField>
          <UFormField label="E-mail">
            <UInput v-model="form.email" type="email" placeholder="email@exemplo.com" size="xl" class="w-full" />
          </UFormField>
        </div>
      </FormDialog>

      <!-- Delete confirmation -->
      <ConfirmDialog v-model="showDelete" :loading="deleteLoading" @confirm="handleDelete" />
    </UDashboardPanel>
  </div>
</template>
