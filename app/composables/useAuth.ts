interface Barbearia {
  id: string
  nome: string
  email: string
  cnpj: string
  telefone: string
  endereco: string
  createdAt: string
  updatedAt: string
}

export function useAuth() {
  const user = useState<Barbearia | null>('auth-user', () => null)
  const loggedIn = computed(() => !!user.value)

  async function fetchUser() {
    try {
      const headers = import.meta.server ? useRequestHeaders(['cookie']) : undefined
      user.value = await $fetch<Barbearia>('/api/auth/me', { headers })
    }
    catch {
      user.value = null
    }
  }

  async function login(email: string, senha: string) {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email, senha },
    })
    await fetchUser()
  }

  async function register(data: {
    nome: string
    email: string
    senha: string
    cnpj: string
    telefone: string
    endereco: string
  }) {
    await $fetch('/api/auth/register', {
      method: 'POST',
      body: data,
    })
    await fetchUser()
  }

  async function logout() {
    await $fetch('/api/auth/logout', { method: 'POST' })
    user.value = null
    await navigateTo('/login')
  }

  return { user, loggedIn, fetchUser, login, register, logout }
}
