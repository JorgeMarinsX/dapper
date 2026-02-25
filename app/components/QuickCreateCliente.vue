<script setup lang="ts">
const open = defineModel<boolean>({ required: true })
const emit = defineEmits<{ created: [cliente: { id: string, nome: string }] }>()

const form = ref({ nome: '', telefone: '', email: '' })

const { loading, execute } = useApiMutation<{ id: string, nome: string }>({
  successMessage: 'Cliente criado',
  errorMessage: 'Erro ao criar cliente',
})

watch(open, (val) => {
  if (val) form.value = { nome: '', telefone: '', email: '' }
})

async function handleSave() {
  const body = {
    nome: form.value.nome,
    telefone: form.value.telefone,
    email: form.value.email || undefined,
  }
  const result = await execute('/api/clientes', { method: 'POST', body })
  if (result) {
    open.value = false
    emit('created', result)
  }
}
</script>

<template>
  <FormDialog v-model="open" title="Novo cliente" :loading="loading" @save="handleSave">
    <div class="flex flex-col gap-4">
      <UFormField label="Nome" required>
        <UInput v-model="form.nome" placeholder="Nome completo" size="xl" class="w-full" />
      </UFormField>
      <UFormField label="Telefone" required>
        <UInput v-model="form.telefone" placeholder="(11) 99999-0000" size="xl" class="w-full" />
      </UFormField>
      <UFormField label="E-mail">
        <UInput v-model="form.email" type="email" placeholder="email@exemplo.com" size="xl" class="w-full" />
      </UFormField>
    </div>
  </FormDialog>
</template>
