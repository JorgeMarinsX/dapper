// Base interface for all entities with ID
export interface WithId {
  id: string
}

// Paginated API response wrapper
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Select item for dropdowns
export interface SelectItem {
  id: string
  nome: string
}

// Agendamento
export interface Agendamento {
  id: string
  dataHora: string
  status: string
  observacoes?: string
  cliente: { id: string; nome: string }
  barbeiro: { id: string; nome: string }
  servico: { id: string; nome: string; preco: number; duracao: number }
  unidade: { id: string; nome: string }
}

// Barbeiro
export interface Barbeiro {
  id: string
  nome: string
  email: string
  telefone: string
  status: string
  unidadeId: string
  unidade?: { id: string; nome: string }
}

// Cliente
export interface Cliente {
  id: string
  nome: string
  email?: string
  telefone: string
  createdAt: string
  _count?: { agendamentos: number }
}

// Servico
export interface Servico {
  id: string
  nome: string
  descricao?: string
  preco: number
  duracao: number
}

// Unidade
export interface Unidade {
  id: string
  nome: string
  endereco: string
  telefone?: string
  _count?: { barbeiros: number; agendamentos: number }
}

// Horario (for unit operating hours)
export interface Horario {
  id?: string
  diaSemana: number
  aberto: boolean
  inicio: string
  fim: string
}

// Calendar timeline slot (reusable component data)
export interface TimelineSlot {
  id: string
  startMinute: number
  durationMinutes: number
  label: string
  sublabel?: string
  color: { bg: string; text: string; border: string }
}

// Notificacao config (for settings page)
export interface NotificacaoConfig {
  emailConfirmacao: boolean
  smsLembrete: boolean
  antecedencia: number
}

// Public booking page types
export interface BarbeariaPublica {
  id: string
  nome: string
  slug: string
  unidades: UnidadePublica[]
}

export interface UnidadePublica {
  id: string
  nome: string
  endereco: string
}

export interface ServicoPublico {
  id: string
  nome: string
  preco: number
  duracao: number
}

export interface BarbeiroPublico {
  id: string
  nome: string
  foto: string | null
}

export interface AgendamentoConfirmado {
  id: string
  dataHora: string
  status: string
  cliente: { nome: string; telefone: string }
  barbeiro: { nome: string }
  servico: { nome: string; preco: number; duracao: number }
  unidade: { nome: string }
}

export interface AgendamentoConsulta {
  id: string
  dataHora: string
  status: string
  cliente: { nome: string; email: string | null }
  barbeiro: { nome: string }
  servico: { nome: string; preco: number; duracao: number }
  unidade: { nome: string }
}
