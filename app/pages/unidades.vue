<script setup lang="ts">
const {
  unidades,
  stats,
  showForm,
  editingId,
  form,
  formLoading,
  openNew,
  editUnidade,
  handleSave,
  showDelete,
  deleteLoading,
  openDelete,
  handleDelete,
  showHorarios,
  horariosUnidadeNome,
  horarios,
  horariosLoading,
  openHorarios,
  handleSaveHorarios,
} = useUnidades()
</script>

<template>
  <div class="w-full">
    <UDashboardPanel>
      <UDashboardNavbar title="Unidades">
        <template #right>
          <UButton label="Nova unidade" icon="i-lucide-plus" @click="openNew" />
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

        <!-- Units grid -->
        <div v-if="unidades?.length" class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <UCard v-for="unidade in unidades" :key="unidade.id">
            <div class="flex flex-col gap-3">
              <div class="flex items-start justify-between">
                <div>
                  <h3 class="font-semibold">{{ unidade.nome }}</h3>
                  <p class="mt-1 text-sm text-muted">{{ unidade.endereco }}</p>
                </div>
                <UDropdownMenu
                  :items="[[
                    { label: 'Editar', icon: 'i-lucide-pencil', click: () => editUnidade(unidade) },
                    { label: 'Horários', icon: 'i-lucide-clock', click: () => openHorarios(unidade) },
                    { label: 'Excluir', icon: 'i-lucide-trash-2', color: 'error' as const, click: () => openDelete(unidade) },
                  ]]"
                >
                  <UButton icon="i-lucide-ellipsis-vertical" variant="ghost" color="neutral" size="xs" />
                </UDropdownMenu>
              </div>

              <div v-if="unidade.telefone" class="flex items-center gap-1.5 text-sm text-muted">
                <UIcon name="i-lucide-phone" class="size-4" />
                {{ unidade.telefone }}
              </div>

              <div class="flex items-center gap-4 pt-2 border-t border-default text-sm text-muted">
                <div class="flex items-center gap-1.5">
                  <UIcon name="i-lucide-user-round" class="size-4" />
                  {{ unidade._count?.barbeiros || 0 }} barbeiros
                </div>
                <div class="flex items-center gap-1.5">
                  <UIcon name="i-lucide-calendar" class="size-4" />
                  {{ unidade._count?.agendamentos || 0 }} agendamentos
                </div>
              </div>
            </div>
          </UCard>
        </div>

        <UCard v-else>
          <div class="py-8 text-center text-muted">
            <UIcon name="i-lucide-map-pin" class="mx-auto mb-2 size-8" />
            <p>Nenhuma unidade cadastrada</p>
            <UButton label="Cadastrar primeira unidade" variant="link" class="mt-2" @click="openNew" />
          </div>
        </UCard>
      </div>

      <!-- Form dialog -->
      <FormDialog v-model="showForm" :title="editingId ? 'Editar unidade' : 'Nova unidade'" :loading="formLoading" @save="handleSave">
        <div class="flex flex-col gap-4">
          <UFormField label="Nome" required>
            <UInput v-model="form.nome" placeholder="Ex: Unidade Centro" size="xl" class="w-full"/>
          </UFormField>
          <UFormField label="Endereço" required>
            <UInput v-model="form.endereco" placeholder="Rua, número - Bairro, Cidade - UF" size="xl" class="w-full" />
          </UFormField>
          <UFormField label="Telefone">
            <UInput v-model="form.telefone" placeholder="(11) 99999-0000" size="xl" class="w-full" />
          </UFormField>
        </div>
      </FormDialog>

      <!-- Horarios dialog -->
      <FormDialog v-model="showHorarios" :title="`Horários — ${horariosUnidadeNome}`" :loading="horariosLoading" @save="handleSaveHorarios">
        <div class="flex flex-col gap-4">
          <div
            v-for="horario in horarios"
            :key="horario.diaSemana"
            class="flex items-center gap-4"
          >
            <div class="w-36">
              <span class="text-sm font-medium">{{ DIAS_SEMANA[horario.diaSemana] }}</span>
            </div>
            <USwitch v-model="horario.aberto" />
            <template v-if="horario.aberto">
              <UInput v-model="horario.inicio" type="time" class="w-full" size="xl" />
              <span class="text-muted">às</span>
              <UInput v-model="horario.fim" type="time" class="w-full" size="xl" />
            </template>
            <span v-else class="text-sm text-muted">Fechado</span>
          </div>
        </div>
      </FormDialog>

      <!-- Delete confirmation -->
      <ConfirmDialog v-model="showDelete" :loading="deleteLoading" @confirm="handleDelete" />
    </UDashboardPanel>
  </div>
</template>
