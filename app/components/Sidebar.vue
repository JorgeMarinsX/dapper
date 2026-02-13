<script setup lang="ts">
const { user, logout } = useAuth()

const collapsed = ref(false)

const navItems: NavigationMenuItem[] = [
  {
    label: 'Painel',
    icon: 'i-lucide-layout-dashboard',
    to: '/',
  },
  {
    label: 'Agendamentos',
    icon: 'i-lucide-calendar',
    to: '/agendamentos',
  },
  {
    label: 'Barbeiros',
    icon: 'i-lucide-user-round',
    to: '/barbeiros',
  },
  {
    label: 'Clientes',
    icon: 'i-lucide-users',
    to: '/clientes',
  },
  {
    label: 'Serviços',
    icon: 'i-lucide-scissors',
    to: '/servicos',
  },
  {
    label: 'Unidades',
    icon: 'i-lucide-map-pin',
    to: '/unidades',
  },
]

const bottomNavItems: NavigationMenuItem[] = [
  {
    label: 'Configurações',
    icon: 'i-lucide-settings',
    to: '/configuracoes',
  },
  {
    label: 'Sair',
    icon: 'i-lucide-log-out',
    onSelect: () => logout(),
  },
]

const shopName = computed(() => user.value?.nome || 'Barbearia')
const shopInitials = computed(() => {
  if (!user.value?.nome) return 'BB'
  return user.value.nome.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()
})

const shopMenuItems = [
  [
    { label: 'Configurações', icon: 'i-lucide-settings', to: '/configuracoes' },
  ],
  [
    { label: 'Sair', icon: 'i-lucide-log-out', onSelect: () => logout() },
  ],
]
</script>
<template>
  <UDashboardSidebar v-model:collapsed="collapsed" collapsible resizable>
    <template #header>
      <div class="flex items-center gap-2 px-1">
        <div class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-barber-red-600 text-white">
          <UIcon name="i-lucide-scissors" class="size-5" />
        </div>
        <span v-if="!collapsed" class="text-lg font-bold">Dapper</span>
      </div>
    </template>

    <UNavigationMenu :collapsed="collapsed" :items="navItems" orientation="vertical" />

    <UNavigationMenu :collapsed="collapsed" :items="bottomNavItems" orientation="vertical" class="mt-auto" />

    <template #footer>
      <div class="flex flex-col gap-3">
        <UDropdownMenu :items="shopMenuItems">
          <UButton
            :label="collapsed ? undefined : shopName"
            :avatar="{ text: shopInitials }"
            color="neutral"
            variant="ghost"
            class="w-full"
            :block="collapsed"
          />
        </UDropdownMenu>
        <img v-if="!collapsed" src="/images/logo_black.png" alt="Dapper" class="w-full h-auto px-4" />
      </div>
    </template>
  </UDashboardSidebar>
</template>
