<script setup lang="ts">
interface Cliente {
  id: string
  nome: string
  email?: string
  telefone: string
  totalVisitas: number
  ultimaVisita: string
  ultimoServico: string
}

const search = ref('')

// Mock data
const clientes = ref<Cliente[]>([
  { id: '1', nome: 'Carlos Mendes', email: 'carlos@email.com', telefone: '(11) 99999-0001', totalVisitas: 24, ultimaVisita: 'Hoje, 09:00', ultimoServico: 'Corte + Barba' },
  { id: '2', nome: 'Pedro Alves', email: 'pedro@email.com', telefone: '(11) 99999-0002', totalVisitas: 18, ultimaVisita: 'Hoje, 09:30', ultimoServico: 'Corte Degradê' },
  { id: '3', nome: 'Bruno Costa', email: undefined, telefone: '(11) 99999-0003', totalVisitas: 12, ultimaVisita: '10/02/2026', ultimoServico: 'Barba' },
  { id: '4', nome: 'Marcos Lima', email: 'marcos.lima@email.com', telefone: '(11) 99999-0004', totalVisitas: 31, ultimaVisita: '09/02/2026', ultimoServico: 'Corte Social' },
  { id: '5', nome: 'André Santos', email: 'andre.s@email.com', telefone: '(11) 99999-0005', totalVisitas: 8, ultimaVisita: '08/02/2026', ultimoServico: 'Corte + Sobrancelha' },
  { id: '6', nome: 'Felipe Rocha', email: undefined, telefone: '(11) 99999-0006', totalVisitas: 15, ultimaVisita: '07/02/2026', ultimoServico: 'Corte Degradê' },
  { id: '7', nome: 'Gustavo Ferreira', email: 'gustavo@email.com', telefone: '(11) 99999-0007', totalVisitas: 42, ultimaVisita: '06/02/2026', ultimoServico: 'Corte + Barba' },
  { id: '8', nome: 'Leonardo Dias', email: 'leo.dias@email.com', telefone: '(11) 99999-0008', totalVisitas: 5, ultimaVisita: '05/02/2026', ultimoServico: 'Barba' },
  { id: '9', nome: 'João Ribeiro', email: 'joao.r@email.com', telefone: '(11) 99999-0009', totalVisitas: 27, ultimaVisita: '04/02/2026', ultimoServico: 'Corte Degradê' },
  { id: '10', nome: 'Matheus Gomes', email: undefined, telefone: '(11) 99999-0010', totalVisitas: 3, ultimaVisita: '03/02/2026', ultimoServico: 'Barba' },
])

const filteredClientes = computed(() => {
  if (!search.value) return clientes.value
  const q = search.value.toLowerCase()
  return clientes.value.filter(c =>
    c.nome.toLowerCase().includes(q)
    || c.telefone.includes(q)
    || c.email?.toLowerCase().includes(q),
  )
})

const columns = [
  { accessorKey: 'nome', header: 'Nome' },
  { accessorKey: 'telefone', header: 'Telefone' },
  { accessorKey: 'email', header: 'E-mail' },
  { accessorKey: 'totalVisitas', header: 'Visitas' },
  { accessorKey: 'ultimaVisita', header: 'Última Visita' },
  { accessorKey: 'ultimoServico', header: 'Último Serviço' },
]

function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

const stats = [
  { label: 'Total de Clientes', value: '248', icon: 'i-lucide-users' },
  { label: 'Novos este Mês', value: '12', icon: 'i-lucide-user-plus' },
  { label: 'Clientes Recorrentes', value: '186', icon: 'i-lucide-user-check' },
  { label: 'Ticket Médio', value: 'R$ 75', icon: 'i-lucide-receipt' },
]
</script>

<template>
  <template #header>
    <UDashboardNavbar title="Clientes">
      <template #actions>
        <UButton label="Novo cliente" icon="i-lucide-user-plus" />
      </template>
    </UDashboardNavbar>
  </template>

  <div class="flex flex-col gap-6 p-6">
    <!-- Stats -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        v-for="stat in stats"
        :key="stat.label"
        :label="stat.label"
        :value="stat.value"
        :icon="stat.icon"
      />
    </div>

    <!-- Search -->
    <UCard>
      <div class="flex items-center gap-4">
        <UInput
          v-model="search"
          placeholder="Buscar por nome, telefone ou e-mail..."
          icon="i-lucide-search"
          class="w-80"
        />
      </div>
    </UCard>

    <!-- Table -->
    <UCard>
      <UTable :data="filteredClientes" :columns="columns">
        <template #nome-cell="{ row }">
          <div class="flex items-center gap-3">
            <UAvatar :text="getInitials(row.original.nome)" size="sm" />
            <span class="font-medium">{{ row.original.nome }}</span>
          </div>
        </template>
        <template #email-cell="{ row }">
          <span :class="row.original.email ? '' : 'text-muted'">
            {{ row.original.email || '—' }}
          </span>
        </template>
      </UTable>
    </UCard>
  </div>
</template>
