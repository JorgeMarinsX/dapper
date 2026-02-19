<script setup lang="ts">

defineProps<{ slots: string[]; loading: boolean; selectedData: string; selectedHorario: string }>()
const emit = defineEmits<{ selectDate: [date: string]; selectHorario: [horario: string] }>()

const today = getTodayISO()
</script>

<template>
  <div class="flex flex-col gap-4">
    <h2 class="text-lg font-semibold">Selecione a data e horário</h2>

    <UFormField label="Data">
      <UInput
        type="date"
        :model-value="selectedData"
        :min="today"
        size="xl"
        @update:model-value="emit('selectDate', $event as string)"
      />
    </UFormField>

    <div v-if="selectedData">
      <p class="text-sm font-medium mb-2">Horários disponíveis:</p>
      <div v-if="loading" class="flex justify-center py-4">
        <UIcon name="i-lucide-loader-2" class="size-6 animate-spin text-muted" />
      </div>
      <div v-else-if="slots.length > 0" class="flex flex-wrap gap-2">
        <UButton
          v-for="s in slots" :key="s"
          :label="s"
          :variant="selectedHorario === s ? 'solid' : 'outline'"
          :color="selectedHorario === s ? 'primary' : 'neutral'"
          size="md"
          @click="emit('selectHorario', s)"
        />
      </div>
      <p v-else class="text-sm text-muted text-center py-4">
        Nenhum horário disponível nesta data.
      </p>
    </div>
  </div>
</template>
