<script setup lang="ts">
definePageMeta({ layout: false })

const { register } = useAuth()

const form = ref({
  nome: '',
  email: '',
  senha: '',
  cnpj: '',
  telefone: '',
  endereco: '',
})
const loading = ref(false)
const error = ref('')

async function handleSubmit() {
  error.value = ''
  loading.value = true
  try {
    await register(form.value)
    await navigateTo('/')
  }
  catch (e: any) {
    error.value = e.data?.statusMessage || 'Erro ao criar conta'
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4">
    <div class="w-full max-w-md">
      <div class="mb-8 text-center">
        <div class="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-barber-red-600 text-white">
          <UIcon name="i-lucide-scissors" class="size-7" />
        </div>
        <h1 class="text-2xl font-bold">Dapper</h1>
        <p class="mt-1 text-sm text-muted">Crie sua conta</p>
      </div>

      <UCard>
        <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
          <UAlert v-if="error" color="error" :title="error" icon="i-lucide-alert-circle" />

          <UFormField label="Nome da barbearia">
            <UInput v-model="form.nome" placeholder="Barbearia do João" required autofocus :disabled="loading" class="w-full"/>
          </UFormField>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <UFormField label="E-mail">
              <UInput v-model="form.email" type="email" placeholder="seu@email.com" required :disabled="loading" />
            </UFormField>
            <UFormField label="Senha">
              <UInput v-model="form.senha" type="password" placeholder="Mínimo 6 caracteres" required :disabled="loading" />
            </UFormField>
          </div>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <UFormField label="CNPJ">
              <UInput v-model="form.cnpj" placeholder="00.000.000/0001-00" required :disabled="loading" />
            </UFormField>
            <UFormField label="Telefone">
              <UInput v-model="form.telefone" placeholder="(11) 99999-0000" required :disabled="loading" />
            </UFormField>
          </div>

          <UFormField label="Endereço">
            <UInput v-model="form.endereco" placeholder="Rua, número - Bairro, Cidade - UF" required :disabled="loading" class="w-full"/>
          </UFormField>

          <UButton
            type="submit"
            label="Criar conta"
            block
            :loading="loading"
          />
        </form>
      </UCard>

      <p class="mt-4 text-center text-sm text-muted">
        Já tem conta?
        <NuxtLink to="/login" class="text-primary font-medium hover:underline">
          Entrar
        </NuxtLink>
      </p>
    </div>
  </div>
</template>
