<script setup lang="ts">
definePageMeta({ layout: false })

const { login } = useAuth()

const form = ref({ email: '', senha: '' })
const loading = ref(false)
const error = ref('')

async function handleSubmit() {
  error.value = ''
  loading.value = true
  try {
    await login(form.value.email, form.value.senha)
    await navigateTo('/')
  }
  catch (e: any) {
    error.value = e.data?.statusMessage || 'E-mail ou senha inválidos'
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4">
    <div class="w-full max-w-sm">
      <div class="mb-8 text-center">
        <div class="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-barber-red-600 text-white">
          <UIcon name="i-lucide-scissors" class="size-7" />
        </div>
        <h1 class="text-2xl font-bold">Dapper</h1>
        <p class="mt-1 text-sm text-muted">Acesse sua conta</p>
      </div>

      <UCard>
        <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
          <UAlert v-if="error" color="error" :title="error" icon="i-lucide-alert-circle" />

          <UFormField label="E-mail">
            <UInput
              v-model="form.email"
              type="email"
              placeholder="seu@email.com"
              required
              autofocus
              class="w-full"
            />
          </UFormField>

          <UFormField label="Senha">
            <UInput
              v-model="form.senha"
              type="password"
              placeholder="Sua senha"
              required
              class="w-full"
            />
          </UFormField>

          <UButton
            type="submit"
            label="Entrar"
            block
            :loading="loading"
          />
        </form>
      </UCard>

      <p class="mt-4 text-center text-sm text-muted">
        Não tem conta?
        <NuxtLink to="/register" class="text-primary font-medium hover:underline">
          Cadastre-se
        </NuxtLink>
      </p>
    </div>
  </div>
</template>
