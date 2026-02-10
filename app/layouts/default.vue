<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const collapsed = ref(false)

const navItems: NavigationMenuItem[] = [
  {
    label: 'Painel',
    icon: 'i-lucide-layout-dashboard',
    to: '/',
    active: true,
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

const userMenuItems = [
  [
    { label: 'Perfil', icon: 'i-lucide-user' },
    { label: 'Configurações', icon: 'i-lucide-settings' },
  ],
  [
    { label: 'Sair', icon: 'i-lucide-log-out' },
  ],
]
</script>

<template>
  <UDashboardGroup>
    <UDashboardSidebar v-model:collapsed="collapsed" collapsible resizable>
      <template #header>
        <div class="flex items-center gap-2 px-1">
          <UIcon name="i-lucide-scissors" class="size-6 shrink-0 text-primary" />
          <span v-if="!collapsed" class="text-lg font-bold">Dapper</span>
        </div>
      </template>

      <UNavigationMenu :collapsed="collapsed" :items="navItems" orientation="vertical" />

      <UNavigationMenu :collapsed="collapsed" :items="bottomNavItems" orientation="vertical" class="mt-auto" />

      <template #footer>
        <div class="flex flex-col gap-3">
          <UDropdownMenu :items="userMenuItems">
            <UButton
              :label="collapsed ? undefined : 'João Silva'"
              :avatar="{ text: 'JS' }"
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

    <UDashboardPanel>
      <template #header>
        <UDashboardNavbar title="Painel" />
      </template>

      <slot />
    </UDashboardPanel>
  </UDashboardGroup>
</template>
