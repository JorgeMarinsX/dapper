<script setup lang="ts">
import type { SelectItem } from '~/types/entities'

const props = defineProps<{ unidadeId: string; unidadeOptions: { label: string; value: string }[] }>()
const open = defineModel<boolean>({ required: true })
const emit = defineEmits<{ created: [barbeiro: { id: string, nome: string }] }>()

const form = ref({ nome: '', email: '', telefone: '', unidadeId: '' })

const { loading, execute } = useApiMutation<{ id: string, nome: string }>({
  successMessage: 'Barbeiro criado',
  errorMessage: 'Erro ao criar barbeiro',
})

watch(open, (val) => {
  if (val) form.value = { nome: '', email: '', telefone: '', unidadeId: props.unidadeId }
})

async function handleSave() {
  const result = await execute('/api/barbeiros', { method: 'POST', body: form.value })
  if (result) {
    open.value = false
    emit('created', result)
  }
}
</script>

<template>
  <FormDialog v-model="open" title="Novo barbeiro" :loading="loading" @save="handleSave">
    <div class="flex flex-col gap-4">
      <UFormField label="Nome" required>
        <UInput v-model="form.nome" placeholder="Nome completo" size="xl" class="w-full" />
      </UFormField>
      <div class="grid grid-cols-2 gap-4">
        <UFormField label="E-mail" required>
          <UInput v-model="form.email" type="email" placeholder="email@exemplo.com" size="xl" class="w-full" />
        </UFormField>
        <UFormField label="Telefone" required>
          <UInput v-model="form.telefone" placeholder="(11) 99999-0000" size="xl" class="w-full" />
        </UFormField>
      </div>
      <UFormField label="Unidade" required>
        <USelect
          v-model="form.unidadeId"
          :items="unidadeOptions"
          value-key="value"
          label-key="label"
          placeholder="Selecione a unidade"
          size="xl"
          class="w-full"
        />
      </UFormField>
    </div>
  </FormDialog>
</template>
