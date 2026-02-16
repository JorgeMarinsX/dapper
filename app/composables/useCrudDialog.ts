interface WithId {
  id: string
}

interface FormDialogState<T, E extends WithId> {
  show: Ref<boolean>
  editingId: Ref<string | null>
  form: Ref<T>
  isEditing: ComputedRef<boolean>
  openNew: () => void
  openEdit: (entity: E, mapFn: (entity: E) => T) => void
  close: () => void
}

interface DeleteDialogState<E extends WithId> {
  show: Ref<boolean>
  deletingId: Ref<string | null>
  openDelete: (entity: E) => void
  close: () => void
}

/**
 * Composable for managing form dialog state (create/edit)
 */
export function useFormDialog<T extends object, E extends WithId = WithId>(
  defaultForm: T,
): FormDialogState<T, E> {
  const show = ref(false)
  const editingId = ref<string | null>(null)
  const form = ref({ ...defaultForm }) as Ref<T>

  const isEditing = computed(() => editingId.value !== null)

  function openNew() {
    editingId.value = null
    form.value = { ...defaultForm }
    show.value = true
  }

  function openEdit(entity: E, mapFn: (entity: E) => T) {
    editingId.value = entity.id
    form.value = mapFn(entity)
    show.value = true
  }

  function close() {
    show.value = false
  }

  return {
    show,
    editingId,
    form,
    isEditing,
    openNew,
    openEdit,
    close,
  }
}

/**
 * Composable for managing delete confirmation dialog state
 */
export function useDeleteDialog<E extends WithId = WithId>(): DeleteDialogState<E> {
  const show = ref(false)
  const deletingId = ref<string | null>(null)

  function openDelete(entity: E) {
    deletingId.value = entity.id
    show.value = true
  }

  function close() {
    show.value = false
    deletingId.value = null
  }

  return {
    show,
    deletingId,
    openDelete,
    close,
  }
}

/**
 * Combined composable for full CRUD dialog management
 */
export function useCrudDialogs<T extends object, E extends WithId = WithId>(
  defaultForm: T,
  options?: {
    apiUrl: string
    entityName?: string
    onSaveSuccess?: () => void | Promise<void>
    onDeleteSuccess?: () => void | Promise<void>
  },
) {
  const formDialog = useFormDialog<T, E>(defaultForm)
  const deleteDialog = useDeleteDialog<E>()

  const { loading: saveLoading, save } = useSaveMutation(
    options?.apiUrl || '',
    {
      createMessage: options?.entityName ? `${options.entityName} criado` : undefined,
      updateMessage: options?.entityName ? `${options.entityName} atualizado` : undefined,
      onSuccess: async () => {
        formDialog.close()
        await options?.onSaveSuccess?.()
      },
    },
  )

  const { loading: deleteLoading, remove } = useDeleteMutation(
    options?.apiUrl || '',
    {
      successMessage: options?.entityName ? `${options.entityName} excluído` : undefined,
      onSuccess: async () => {
        deleteDialog.close()
        await options?.onDeleteSuccess?.()
      },
    },
  )

  async function handleSave(body?: unknown) {
    return save(formDialog.editingId.value, body || formDialog.form.value)
  }

  async function handleDelete() {
    if (!deleteDialog.deletingId.value) return false
    return remove(deleteDialog.deletingId.value)
  }

  return {
    // Form dialog
    showForm: formDialog.show,
    editingId: formDialog.editingId,
    form: formDialog.form,
    isEditing: formDialog.isEditing,
    formLoading: saveLoading,
    openNew: formDialog.openNew,
    openEdit: formDialog.openEdit,
    closeForm: formDialog.close,
    handleSave,

    // Delete dialog
    showDelete: deleteDialog.show,
    deletingId: deleteDialog.deletingId,
    deleteLoading,
    openDelete: deleteDialog.openDelete,
    closeDelete: deleteDialog.close,
    handleDelete,
  }
}
