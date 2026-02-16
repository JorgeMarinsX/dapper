// Form interfaces for CRUD operations

export interface AgendamentoForm {
  unidadeId: string
  clienteId: string
  barbeiroId: string
  servicoId: string
  dataHora: string
  observacoes: string
}

export interface BarbeiroForm {
  nome: string
  email: string
  telefone: string
  unidadeId: string
}

export interface ClienteForm {
  nome: string
  telefone: string
  email: string
}

export interface ServicoForm {
  nome: string
  descricao: string
  preco: number
  duracao: number
}

export interface UnidadeForm {
  nome: string
  endereco: string
  telefone: string
}

export interface BarbeariaForm {
  nome: string
  cnpj: string
  telefone: string
  endereco: string
}
