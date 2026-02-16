<script setup lang="ts">
const {
  barbeiros,
  unidades,
  stats,
  search,
  unidadeFilter,
  unidadeOptions,
  showForm,
  editingId,
  form,
  formLoading,
  openNew,
  editBarbeiro,
  handleSave,
  showDelete,
  deleteLoading,
  openDelete,
  handleDelete,
} = useBarbeiros()
</script>

<template>
  <div class="w-full">
    <UDashboardPanel>
      <UDashboardNavbar title="Barbeiros">
        <template #right>
          <UButton label="Novo barbeiro" icon="i-lucide-plus" @click="openNew" />
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

        <!-- Filters -->
        <UCard>
          <div class="flex flex-wrap items-center gap-4">
            <UInput
              v-model="search"
              placeholder="Buscar por nome..."
              icon="i-lucide-search"
              class="w-64"
              size="xl"
            />
            <USelect
              v-model="unidadeFilter"
              :items="unidadeOptions"
              value-key="value"
              label-key="label"
              placeholder="Todas as unidades"
              class="w-56"
            />
          </div>
        </UCard>

        <!-- Table -->
        <UCard v-if="barbeiros?.length">
          <UTable :data="barbeiros" :columns="COLUMNS.barbeiros">
            <template #nome-cell="{ row }">
              <div class="flex items-center gap-3">
                <UAvatar :text="getInitials(row.original.nome)" size="sm" />
                <span class="font-medium">{{ row.original.nome }}</span>
              </div>
            </template>
            <template #unidade-cell="{ row }">
              {{ row.original.unidade?.nome || '—' }}
            </template>
            <template #status-cell="{ row }">
              <StatusBadge
                :label="getStatusConfig(BARBEIRO_STATUS, row.original.status).label"
                :color="getStatusConfig(BARBEIRO_STATUS, row.original.status).color"
              />
            </template>
            <template #actions-cell="{ row }">
              <UDropdownMenu
                :items="[[
                  { label: 'Editar', icon: 'i-lucide-pencil', click: () => editBarbeiro(row.original) },
                  { label: 'Excluir', icon: 'i-lucide-trash-2', color: 'error' as const, click: () => openDelete(row.original) },
                ]]"
              >
                <UButton icon="i-lucide-ellipsis-vertical" variant="ghost" color="neutral" size="xs" />
              </UDropdownMenu>
            </template>
          </UTable>
        </UCard>

        <UCard v-else>
          <div class="py-8 text-center text-muted">
            <UIcon name="i-lucide-user-round" class="mx-auto mb-2 size-8" />
            <p>Nenhum barbeiro cadastrado</p>
            <UButton label="Cadastrar primeiro barbeiro" variant="link" class="mt-2" @click="openNew" />
          </div>
        </UCard>
      </div>

      <!-- Form dialog -->
      <FormDialog v-model="showForm" :title="editingId ? 'Editar barbeiro' : 'Novo barbeiro'" :loading="formLoading" @save="handleSave">
        <div class="flex flex-col gap-4">
          <UFormField label="Nome" required>
            <UInput v-model="form.nome" placeholder="Nome completo" size="xl" class="w-full"/>
          </UFormField>
          <div class="grid grid-cols-2 gap-4">
            <UFormField label="E-mail" required>
              <UInput v-model="form.email" type="email" placeholder="email@exemplo.com" size="xl" class="w-full"/>
            </UFormField>
            <UFormField label="Telefone" required>
              <UInput v-model="form.telefone" placeholder="(11) 99999-0000" size="xl" class="w-full" />
            </UFormField>
          </div>
          <UFormField label="Unidade" required>
            <USelect
              v-model="form.unidadeId"
              :items="toSelectOptions(unidades)"
              value-key="value"
              label-key="label"
              placeholder="Selecione a unidade"
              size="xl"
              class="w-full"
            />
          </UFormField>
        </div>
      </FormDialog>

      <!-- Delete confirmation -->
      <ConfirmDialog v-model="showDelete" :loading="deleteLoading" @confirm="handleDelete" />
    </UDashboardPanel>
  </div>
</template>
