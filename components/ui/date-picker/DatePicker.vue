<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        :class="[
          'w-full justify-start text-left font-normal',
          !modelValue && 'text-muted-foreground'
        ]"
      >
        <CalendarIcon class="mr-2 h-4 w-4" />
        {{ modelValue ? formatDate(modelValue) : 'Pick a date' }}
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0">
      <Calendar
        v-model="selectedDate"
        :weekday-format="'short'"
        class="rounded-md border"
        @update:model-value="handleDateSelect"
      />
    </PopoverContent>
  </Popover>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { type DateValue, getLocalTimeZone, today } from '@internationalized/date'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { CalendarIcon } from 'lucide-vue-next'

interface Props {
  modelValue?: string
  max?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  max: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const selectedDate = computed({
  get: () => {
    if (!props.modelValue) return today(getLocalTimeZone())
    return new Date(props.modelValue) as unknown as DateValue
  },
  set: (value: DateValue) => {
    // Handle in handleDateSelect
  }
})

function handleDateSelect(date: DateValue) {
  const dateString = date.toString()
  emit('update:modelValue', dateString)
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script> 