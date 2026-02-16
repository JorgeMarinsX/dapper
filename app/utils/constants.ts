export type BadgeColor = 'success' | 'warning' | 'info' | 'neutral' | 'error'

export interface StatusConfig {
  label: string
  color: BadgeColor
}

/**
 * Appointment status mapping
 */
export const AGENDAMENTO_STATUS: Record<string, StatusConfig> = {
  AGUARDANDO: { label: 'Aguardando', color: 'neutral' },
  EM_ANDAMENTO: { label: 'Em andamento', color: 'warning' },
  CONCLUIDO: { label: 'Concluído', color: 'success' },
  CANCELADO: { label: 'Cancelado', color: 'error' },
  NAO_COMPARECEU: { label: 'Não compareceu', color: 'info' },
}

/**
 * Appointment status options for select inputs
 */
export const AGENDAMENTO_STATUS_OPTIONS = [
  { label: 'Aguardando', value: 'AGUARDANDO' },
  { label: 'Em andamento', value: 'EM_ANDAMENTO' },
  { label: 'Concluído', value: 'CONCLUIDO' },
  { label: 'Cancelado', value: 'CANCELADO' },
  { label: 'Não compareceu', value: 'NAO_COMPARECEU' },
]

/**
 * Barber status mapping
 */
export const BARBEIRO_STATUS: Record<string, StatusConfig> = {
  DISPONIVEL: { label: 'Disponível', color: 'success' },
  OCUPADO: { label: 'Ocupado', color: 'warning' },
  FOLGA: { label: 'Folga', color: 'neutral' },
  ALMOCO: { label: 'Almoço', color: 'info' },
}

/**
 * Days of the week mapping (0 = Sunday)
 */
export const DIAS_SEMANA: Record<number, string> = {
  0: 'Domingo',
  1: 'Segunda-feira',
  2: 'Terça-feira',
  3: 'Quarta-feira',
  4: 'Quinta-feira',
  5: 'Sexta-feira',
  6: 'Sábado',
}

/**
 * Notification reminder time options
 */
export const ANTECEDENCIA_OPTIONS = [
  { label: '1 hora antes', value: 1 },
  { label: '2 horas antes', value: 2 },
  { label: '3 horas antes', value: 3 },
  { label: '1 dia antes', value: 24 },
]

/**
 * Get status config with fallback
 */
export function getStatusConfig(
  statusMap: Record<string, StatusConfig>,
  status: string,
): StatusConfig {
  return statusMap[status] || { label: status, color: 'neutral' }
}

/**
 * Table column definitions
 */
export const COLUMNS = {
  agendamentos: [
    { accessorKey: 'horario', header: 'Horário' },
    { accessorKey: 'data', header: 'Data' },
    { accessorKey: 'cliente', header: 'Cliente' },
    { accessorKey: 'barbeiro', header: 'Barbeiro' },
    { accessorKey: 'servico', header: 'Serviço' },
    { accessorKey: 'unidade', header: 'Unidade' },
    { accessorKey: 'status', header: 'Status' },
    { accessorKey: 'actions', header: '' },
  ],
  barbeiros: [
    { accessorKey: 'nome', header: 'Nome' },
    { accessorKey: 'email', header: 'E-mail' },
    { accessorKey: 'telefone', header: 'Telefone' },
    { accessorKey: 'unidade', header: 'Unidade' },
    { accessorKey: 'status', header: 'Status' },
    { accessorKey: 'actions', header: '' },
  ],
  clientes: [
    { accessorKey: 'nome', header: 'Nome' },
    { accessorKey: 'telefone', header: 'Telefone' },
    { accessorKey: 'email', header: 'E-mail' },
    { accessorKey: 'actions', header: '' },
  ],
  dashboard: [
    { accessorKey: 'horario', header: 'Horário' },
    { accessorKey: 'cliente', header: 'Cliente' },
    { accessorKey: 'barbeiro', header: 'Barbeiro' },
    { accessorKey: 'servico', header: 'Serviço' },
    { accessorKey: 'status', header: 'Status' },
  ],
}
