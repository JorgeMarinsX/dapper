<script setup lang="ts">
definePageMeta({ layout: false })

const { login } = useAuth()

const form = ref({ email: '', senha: '' })
const loading = ref(false)
const success = ref(false)
const error = ref('')


async function handleSubmit() {
  error.value = ''
  loading.value = true
  try {
    await login(form.value.email, form.value.senha)
    loading.value = false
    success.value = true
    await new Promise(r => setTimeout(r, 600))
    await navigateTo('/')
  }
  catch (e: any) {
    error.value = e.data?.statusMessage || 'E-mail ou senha inválidos'
    loading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4">
    <div class="login-container w-full max-w-sm" :class="{ 'login-success': success }">
      <div class="login-glow" :class="{ 'login-glow-success': success }" aria-hidden="true" />

      <div class="relative mb-8 text-center">
        <div
          class="login-logo mx-auto mb-4 flex size-12 items-center justify-center rounded-xl text-white transition-all duration-500"
          :class="success ? 'bg-green-600 scale-110' : 'bg-barber-red-600'"
        >
          <Transition name="login-icon" mode="out-in">
            <UIcon v-if="success" key="check" name="i-lucide-check" class="size-7" />
            <UIcon v-else key="scissors" name="i-lucide-scissors" class="size-7" />
          </Transition>
        </div>
        <h1 class="text-2xl font-bold">Dapper</h1>
        <Transition name="login-fade" mode="out-in">
          <p v-if="success" key="welcome" class="mt-1 text-sm text-green-600 dark:text-green-400 font-medium">
            Bem-vindo!
          </p>
          <p v-else key="subtitle" class="mt-1 text-sm text-muted">
            Acesse sua conta
          </p>
        </Transition>
      </div>

      <UCard class="transition-all duration-400" :class="success ? 'opacity-0 scale-95 pointer-events-none' : ''">
        <form
          class="flex flex-col gap-4"
          @submit.prevent="handleSubmit"
        >
          <UAlert v-if="error" color="error" :title="error" icon="i-lucide-alert-circle" />

          <UFormField label="E-mail">
            <UInput
              v-model="form.email"
              type="email"
              placeholder="seu@email.com"
              required
              :disabled="loading"
              class="w-full"
              size="xl"
            />
          </UFormField>

          <UFormField label="Senha">
            <UInput
              v-model="form.senha"
              type="password"
              placeholder="Sua senha"
              required
              :disabled="loading"
              class="w-full"
              size="xl"
            />
          </UFormField>

          <UButton
            type="submit"
            label="Entrar"
            block
            :loading="loading"
            size="xl"
          />
        </form>
      </UCard>

      <p class="mt-4 text-center text-sm text-muted transition-opacity duration-400" :class="{ 'opacity-0': success }">
        Não tem conta?
        <NuxtLink to="/register" class="text-primary font-medium hover:underline">
          Cadastre-se
        </NuxtLink>
      </p>
    </div>
  </div>
</template>
