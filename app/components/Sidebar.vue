<script setup lang="ts">

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
    label: 'Clientes',
    icon: 'i-lucide-users',
    to: '/clientes',
  },
  {
    label: 'Serviços',
    icon: 'i-lucide-scissors',
    to: '/servicos',
  },
]

const bottomNavItems: NavigationMenuItem[] = [
  {
    label: 'Configurações',
    icon: 'i-lucide-settings',
    to: '/configuracoes',
  },
]

const shopMenuItems = [
  [
    { label: 'Configurações', icon: 'i-lucide-settings', to: '/configuracoes' },
  ],
  [
    { label: 'Sair', icon: 'i-lucide-log-out' },
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
            :label="collapsed ? undefined : 'Barbearia Exemplo'"
            :avatar="{ text: 'BE' }"
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
