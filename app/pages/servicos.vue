<script setup lang="ts">
interface Servico {
  id: string
  nome: string
  descricao?: string
  preco: number
  duracao: number
}

const search = ref('')

// Mock data
const servicos = ref<Servico[]>([
  { id: '1', nome: 'Corte Social', descricao: 'Corte de cabelo tradicional com tesoura e máquina', preco: 45, duracao: 30 },
  { id: '2', nome: 'Corte Degradê', descricao: 'Corte com degradê lateral e/ou traseiro', preco: 55, duracao: 40 },
  { id: '3', nome: 'Barba', descricao: 'Aparar e modelar a barba com navalha e toalha quente', preco: 35, duracao: 25 },
  { id: '4', nome: 'Corte + Barba', descricao: 'Combo de corte de cabelo e barba completa', preco: 75, duracao: 55 },
  { id: '5', nome: 'Corte + Sobrancelha', descricao: 'Corte de cabelo com design de sobrancelha', preco: 60, duracao: 40 },
  { id: '6', nome: 'Sobrancelha', descricao: 'Design e limpeza de sobrancelha com navalha', preco: 20, duracao: 15 },
  { id: '7', nome: 'Pigmentação', descricao: 'Aplicação de pigmento para preenchimento capilar', preco: 120, duracao: 60 },
  { id: '8', nome: 'Hidratação Capilar', descricao: 'Tratamento de hidratação profunda para cabelos', preco: 40, duracao: 30 },
])

const filteredServicos = computed(() => {
  if (!search.value) return servicos.value
  const q = search.value.toLowerCase()
  return servicos.value.filter(s =>
    s.nome.toLowerCase().includes(q)
    || s.descricao?.toLowerCase().includes(q),
  )
})

function formatPreco(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatDuracao(minutos: number): string {
  if (minutos < 60) return `${minutos} min`
  const h = Math.floor(minutos / 60)
  const m = minutos % 60
  return m > 0 ? `${h}h ${m}min` : `${h}h`
}

const stats = [
  { label: 'Total de Serviços', value: '8', icon: 'i-lucide-scissors' },
  { label: 'Preço Médio', value: 'R$ 56', icon: 'i-lucide-dollar-sign' },
  { label: 'Mais Popular', value: 'Corte Degradê', icon: 'i-lucide-trending-up' },
  { label: 'Duração Média', value: '37 min', icon: 'i-lucide-clock' },
]
</script>

<template>
  <template #header>
    <UDashboardNavbar title="Serviços">
      <template #actions>
        <UButton label="Novo serviço" icon="i-lucide-plus" />
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
          placeholder="Buscar serviço..."
          icon="i-lucide-search"
          class="w-80"
        />
      </div>
    </UCard>

    <!-- Services grid -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <UCard v-for="servico in filteredServicos" :key="servico.id">
        <div class="flex flex-col gap-3">
          <div class="flex items-start justify-between">
            <h3 class="font-semibold">{{ servico.nome }}</h3>
            <UDropdownMenu
              :items="[[
                { label: 'Editar', icon: 'i-lucide-pencil' },
                { label: 'Excluir', icon: 'i-lucide-trash-2', color: 'error' as const },
              ]]"
            >
              <UButton icon="i-lucide-ellipsis-vertical" variant="ghost" color="neutral" size="xs" />
            </UDropdownMenu>
          </div>
          <p v-if="servico.descricao" class="text-sm text-muted">{{ servico.descricao }}</p>
          <div class="flex items-center justify-between mt-auto pt-2 border-t border-default">
            <div class="flex items-center gap-1.5 text-sm">
              <UIcon name="i-lucide-clock" class="size-4 text-muted" />
              <span class="text-muted">{{ formatDuracao(servico.duracao) }}</span>
            </div>
            <span class="text-lg font-semibold text-primary">{{ formatPreco(servico.preco) }}</span>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>
