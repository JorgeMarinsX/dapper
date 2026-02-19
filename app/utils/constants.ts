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
 * Color palette for barbers in calendar view
 */
export const BARBEIRO_COLORS = [
  { bg: 'bg-blue-100 dark:bg-blue-900', text: 'text-blue-800 dark:text-blue-200', border: 'border-blue-500' },
  { bg: 'bg-emerald-100 dark:bg-emerald-900', text: 'text-emerald-800 dark:text-emerald-200', border: 'border-emerald-500' },
  { bg: 'bg-amber-100 dark:bg-amber-900', text: 'text-amber-800 dark:text-amber-200', border: 'border-amber-500' },
  { bg: 'bg-purple-100 dark:bg-purple-900', text: 'text-purple-800 dark:text-purple-200', border: 'border-purple-500' },
  { bg: 'bg-rose-100 dark:bg-rose-900', text: 'text-rose-800 dark:text-rose-200', border: 'border-rose-500' },
  { bg: 'bg-cyan-100 dark:bg-cyan-900', text: 'text-cyan-800 dark:text-cyan-200', border: 'border-cyan-500' },
  { bg: 'bg-orange-100 dark:bg-orange-900', text: 'text-orange-800 dark:text-orange-200', border: 'border-orange-500' },
  { bg: 'bg-indigo-100 dark:bg-indigo-900', text: 'text-indigo-800 dark:text-indigo-200', border: 'border-indigo-500' },
]

export function getBarbeiroColor(index: number) {
  return BARBEIRO_COLORS[index % BARBEIRO_COLORS.length]
}

/**
 * Calendar timeline constants
 */
export const TIMELINE_ROW_HEIGHT = 48
export const TIMELINE_SLOT_INTERVAL = 30

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
