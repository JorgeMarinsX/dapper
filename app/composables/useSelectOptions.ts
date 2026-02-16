import type { SelectItem } from '~/types/entities'

/**
 * Converts an array of entities with id/nome to select options format
 */
export function toSelectOptions<T extends SelectItem>(
  items: T[] | null | undefined,
): { label: string; value: string }[] {
  return (items || []).map(item => ({ label: item.nome, value: item.id }))
}

/**
 * Composable that provides reactive select options from a fetched list
 */
export function useSelectOptions<T extends SelectItem>(
  data: Ref<T[] | null | undefined>,
) {
  return computed(() => toSelectOptions(data.value))
}
