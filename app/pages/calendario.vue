<script setup lang="ts">
const {
  selectedDate,
  unidadeFilter,
  barbeiroFilter,
  unidadeOptions,
  barbeiroOptions,
  timelineSlots,
  gridHours,
  isClosed,
  currentTimeMinute,
  prevDay,
  nextDay,
  goToday,
  navLabel,
  displayDate,
} = useCalendario()
</script>

<template>
  <div class="w-full">
    <UDashboardPanel>
      <UDashboardNavbar title="Calendário">
        <template #right>
          <div class="flex items-center gap-2">
            <UButton icon="i-lucide-chevron-left" variant="ghost" color="neutral" size="xs" @click="prevDay" />
            <UButton :label="navLabel" variant="soft" color="neutral" size="xs" @click="goToday" />
            <UButton icon="i-lucide-chevron-right" variant="ghost" color="neutral" size="xs" @click="nextDay" />
          </div>
        </template>
      </UDashboardNavbar>

      <div class="flex flex-col gap-6 p-6">
        <!-- Filters -->
        <UCard>
          <div class="flex flex-wrap items-center gap-4">
            <USelect
              v-model="unidadeFilter"
              :items="unidadeOptions"
              value-key="value"
              label-key="label"
              placeholder="Selecione a unidade"
              class="w-56"
              size="xl"
            />
            <UInput
              v-model="selectedDate"
              type="date"
              class="w-44"
              size="xl"
            />
            <span class="text-sm text-muted capitalize">{{ displayDate }}</span>
          </div>
        </UCard>

        <!-- Barber filter chips -->
        <div v-if="barbeiroOptions.length" class="flex flex-wrap items-center gap-2">
          <span class="text-sm text-muted">Barbeiros:</span>
          <button
            v-for="b in barbeiroOptions"
            :key="b.value"
            class="flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors"
            :class="barbeiroFilter.length === 0 || barbeiroFilter.includes(b.value)
              ? [b.color.bg, b.color.text, b.color.border]
              : 'border-gray-200 text-gray-400 dark:border-gray-700 dark:text-gray-500'"
            @click="
              barbeiroFilter.includes(b.value)
                ? barbeiroFilter = barbeiroFilter.filter(id => id !== b.value)
                : barbeiroFilter = [...barbeiroFilter, b.value]
            "
          >
            <span class="size-2 rounded-full" :class="b.color.border.replace('border-', 'bg-')" />
            {{ b.label }}
          </button>
          <button
            v-if="barbeiroFilter.length > 0"
            class="text-xs text-muted hover:underline"
            @click="barbeiroFilter = []"
          >
            Mostrar todos
          </button>
        </div>

        <!-- Calendar content -->
        <UCard class="overflow-auto">
          <!-- No unit selected -->
          <div v-if="!unidadeFilter" class="py-8 text-center text-muted">
            <UIcon name="i-lucide-building-2" class="mx-auto mb-2 size-8" />
            <p>Selecione uma unidade para visualizar o calendário</p>
          </div>

          <!-- Unit closed -->
          <div v-else-if="isClosed" class="py-8 text-center text-muted">
            <UIcon name="i-lucide-calendar-x" class="mx-auto mb-2 size-8" />
            <p>Unidade fechada neste dia</p>
          </div>

          <!-- No operating hours configured -->
          <div v-else-if="!gridHours" class="py-8 text-center text-muted">
            <UIcon name="i-lucide-clock" class="mx-auto mb-2 size-8" />
            <p>Horários de funcionamento não configurados para esta unidade</p>
          </div>

          <!-- Calendar timeline -->
          <template v-else>
            <CalendarTimeline
              :slots="timelineSlots"
              :grid-start="gridHours.start"
              :grid-end="gridHours.end"
              :current-time-minute="currentTimeMinute"
            />
            <div v-if="!timelineSlots.length" class="py-4 text-center text-sm text-muted">
              Nenhum agendamento para este dia
            </div>
          </template>
        </UCard>
      </div>
    </UDashboardPanel>
  </div>
</template>
