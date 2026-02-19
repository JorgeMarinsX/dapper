<script setup lang="ts">
import type { TimelineSlot } from '~/types/entities'

const props = withDefaults(defineProps<{
  slots: TimelineSlot[]
  gridStart: number
  gridEnd: number
  slotInterval?: number
  currentTimeMinute?: number
  interactive?: boolean
}>(), {
  slotInterval: TIMELINE_SLOT_INTERVAL,
  interactive: false,
})

const emit = defineEmits<{
  slotClick: [minute: number]
  itemClick: [id: string]
}>()

const totalMinutes = computed(() => props.gridEnd - props.gridStart)
const rowCount = computed(() => Math.ceil(totalMinutes.value / props.slotInterval))
const containerHeight = computed(() => rowCount.value * TIMELINE_ROW_HEIGHT)

const timeLabels = computed(() =>
  generateTimeLabels(props.gridStart, props.gridEnd, props.slotInterval, TIMELINE_ROW_HEIGHT),
)

const positionedSlots = computed(() =>
  props.slots.map(slot => ({
    ...slot,
    top: minuteToPixel(slot.startMinute, props.gridStart, props.slotInterval, TIMELINE_ROW_HEIGHT),
    height: (slot.durationMinutes / props.slotInterval) * TIMELINE_ROW_HEIGHT,
  })),
)

const nowIndicatorTop = computed(() => {
  if (props.currentTimeMinute === undefined) return null
  if (props.currentTimeMinute < props.gridStart || props.currentTimeMinute > props.gridEnd) return null
  return minuteToPixel(props.currentTimeMinute, props.gridStart, props.slotInterval, TIMELINE_ROW_HEIGHT)
})

function handleGridClick(event: MouseEvent) {
  if (!props.interactive) return
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  const y = event.clientY - rect.top
  const clickedMinute = props.gridStart + (y / containerHeight.value) * totalMinutes.value
  const snapped = Math.round(clickedMinute / props.slotInterval) * props.slotInterval
  emit('slotClick', Math.max(props.gridStart, Math.min(snapped, props.gridEnd)))
}
</script>

<template>
  <div class="flex select-none">
    <!-- Time labels gutter -->
    <div class="relative w-16 shrink-0 border-r border-gray-200 dark:border-gray-700" :style="{ height: `${containerHeight}px` }">
      <div
        v-for="tl in timeLabels"
        :key="tl.minute"
        class="absolute right-2 -translate-y-1/2 text-xs text-muted"
        :style="{ top: `${tl.top}px` }"
      >
        {{ tl.label }}
      </div>
    </div>

    <!-- Grid area -->
    <div
      class="relative flex-1"
      :class="{ 'cursor-pointer': interactive }"
      :style="{ height: `${containerHeight}px` }"
      @click="handleGridClick"
    >
      <!-- Grid lines -->
      <div
        v-for="tl in timeLabels"
        :key="`line-${tl.minute}`"
        class="absolute left-0 right-0 border-t border-gray-100 dark:border-gray-800"
        :style="{ top: `${tl.top}px` }"
      />

      <!-- Appointment blocks -->
      <div
        v-for="slot in positionedSlots"
        :key="slot.id"
        class="absolute left-3 right-3 cursor-pointer overflow-hidden rounded-lg border border-l-3 px-2 py-1 transition-opacity hover:opacity-90"
        :class="[slot.color.bg, slot.color.text, slot.color.border]"
        :style="{ top: `${slot.top}px`, height: `${slot.height}px`, minHeight: '24px' }"
        @click.stop="emit('itemClick', slot.id)"
      >
        <div class="truncate text-xs font-medium">{{ slot.label }}</div>
        <div v-if="slot.sublabel && slot.height > 32" class="truncate text-xs opacity-75">{{ slot.sublabel }}</div>
        <div v-if="slot.height > 48" class="text-xs opacity-60">
          {{ formatMinutes(slot.startMinute) }} – {{ formatMinutes(slot.startMinute + slot.durationMinutes) }}
        </div>
      </div>

      <!-- Current time indicator -->
      <div
        v-if="nowIndicatorTop !== null"
        class="absolute left-0 right-0 z-10 flex items-center"
        :style="{ top: `${nowIndicatorTop}px` }"
      >
        <div class="size-2 rounded-full bg-red-500" />
        <div class="h-px flex-1 bg-red-500" />
      </div>
    </div>
  </div>
</template>
