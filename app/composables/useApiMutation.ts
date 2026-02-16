type ToastColor = 'success' | 'error' | 'warning' | 'info' | 'neutral'

interface MutationOptions<T> {
  onSuccess?: (data: T) => void | Promise<void>
  successMessage?: string
  errorMessage?: string
}

interface MutationResult<T> {
  loading: Ref<boolean>
  execute: (url: string, options?: {
    method?: 'POST' | 'PATCH' | 'DELETE'
    body?: unknown
  }) => Promise<T | null>
}

/**
 * Composable for API mutations with automatic error handling and toast notifications
 */
export function useApiMutation<T = unknown>(
  defaultOptions?: MutationOptions<T>,
): MutationResult<T> {
  const toast = useToast()
  const loading = ref(false)

  async function execute(
    url: string,
    options?: {
      method?: 'POST' | 'PATCH' | 'DELETE'
      body?: unknown
      successMessage?: string
      errorMessage?: string
      onSuccess?: (data: T) => void | Promise<void>
    },
  ): Promise<T | null> {
    loading.value = true
    try {
      const data = await $fetch<T>(url, {
        method: options?.method || 'POST',
        body: options?.body,
      })

      const successMsg = options?.successMessage || defaultOptions?.successMessage
      if (successMsg) {
        toast.add({ title: successMsg, color: 'success' as ToastColor })
      }

      const onSuccessCallback = options?.onSuccess || defaultOptions?.onSuccess
      if (onSuccessCallback) {
        await onSuccessCallback(data)
      }

      return data
    }
    catch (e: unknown) {
      const error = e as { data?: { statusMessage?: string } }
      const errorMsg = error.data?.statusMessage
        || options?.errorMessage
        || defaultOptions?.errorMessage
        || 'Erro ao processar'
      toast.add({ title: errorMsg, color: 'error' as ToastColor })
      return null
    }
    finally {
      loading.value = false
    }
  }

  return { loading, execute }
}

/**
 * Helper for common save (create/update) operations
 */
export function useSaveMutation<T = unknown>(
  baseUrl: string,
  options?: {
    createMessage?: string
    updateMessage?: string
    errorMessage?: string
    onSuccess?: () => void | Promise<void>
  },
) {
  const { loading, execute } = useApiMutation<T>()

  async function save(
    id: string | null,
    body: unknown,
  ): Promise<T | null> {
    const url = id ? `${baseUrl}/${id}` : baseUrl
    const method = id ? 'PATCH' : 'POST'
    const successMessage = id
      ? (options?.updateMessage || 'Atualizado com sucesso')
      : (options?.createMessage || 'Criado com sucesso')

    return execute(url, {
      method,
      body,
      successMessage,
      errorMessage: options?.errorMessage,
      onSuccess: options?.onSuccess,
    })
  }

  return { loading, save }
}

/**
 * Helper for delete operations
 */
export function useDeleteMutation(
  baseUrl: string,
  options?: {
    successMessage?: string
    errorMessage?: string
    onSuccess?: () => void | Promise<void>
  },
) {
  const { loading, execute } = useApiMutation()

  async function remove(id: string): Promise<boolean> {
    const result = await execute(`${baseUrl}/${id}`, {
      method: 'DELETE',
      successMessage: options?.successMessage || 'Excluído com sucesso',
      errorMessage: options?.errorMessage || 'Erro ao excluir',
      onSuccess: options?.onSuccess,
    })
    return result !== null
  }

  return { loading, remove }
}
