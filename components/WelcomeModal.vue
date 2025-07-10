<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
    <div class="bg-background rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto border">
      <!-- Header -->
      <div class="relative p-6 border-b">
        <div class="absolute top-4 right-4">
          <button @click="closeModal" class="text-muted-foreground hover:text-foreground transition-colors">
            <XIcon class="w-6 h-6" />
          </button>
        </div>
        <div class="text-center">
          <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <HeartIcon class="w-8 h-8 text-primary" />
          </div>
          <h2 class="text-xl font-bold mb-2">Welcome to Cycle Companion</h2>
          <p class="text-muted-foreground">Let's get you started with your wellness journey</p>
        </div>
      </div>

      <!-- Content -->
      <div class="p-6 space-y-6">
        <!-- Step 1: Last Period -->
        <div class="space-y-3">
          <Label class="font-medium">When did your last period start?</Label>
          <Popover>
            <PopoverTrigger as-child>
              <Button
                variant="outline"
                class="w-full justify-start text-left font-normal"
              >
                <CalendarIcon class="mr-2 h-4 w-4" />
                {{ lastPeriodDate ? formatDate(lastPeriodDate) : 'Select date' }}
              </Button>
            </PopoverTrigger>
            <PopoverContent class="w-auto p-0" align="start">
              <Calendar
                v-model="lastPeriodDate"
                :weekday-format="'short'"
                :max="todayDate as unknown as DateValue"
              />
            </PopoverContent>
          </Popover>
        </div>

        <!-- Step 2: Cycle Length -->
        <div class="space-y-3">
          <Label class="font-medium">What's your average cycle length?</Label>
          <Select v-model="cycleLength">
            <SelectTrigger>
              <SelectValue placeholder="Select cycle length" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="length in cycleLengths" :key="length" :value="length">
                {{ length }} days
              </SelectItem>
            </SelectContent>
          </Select>
          <p class="text-xs text-muted-foreground">Most women have cycles between 21-35 days</p>
        </div>

        <!-- Step 3: Period Length -->
        <div class="space-y-3">
          <Label class="font-medium">How long do your periods typically last?</Label>
          <Select v-model="periodLength">
            <SelectTrigger>
              <SelectValue placeholder="Select period length" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="length in periodLengths" :key="length" :value="length">
                {{ length }} days
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <!-- Features Preview -->
        <div class="space-y-3">
          <Label class="font-medium">What you can do with Cycle Companion:</Label>
          <div class="space-y-2">
            <div class="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
              <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <CalendarIcon class="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <p class="font-medium text-sm">Track your cycle phases</p>
                <p class="text-xs text-muted-foreground">Know when you're fertile or expecting PMS</p>
              </div>
            </div>
            
            <div class="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
              <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <PlusCircleIcon class="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <p class="font-medium text-sm">Log daily wellness</p>
                <p class="text-xs text-muted-foreground">Track mood, symptoms, and notes</p>
              </div>
            </div>
            
            <div class="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
              <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <BellIcon class="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <p class="font-medium text-sm">Get smart reminders</p>
                <p class="text-xs text-muted-foreground">Never miss important cycle events</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="space-y-3 pt-4">
          <Button 
            @click="saveSettings" 
            class="w-full" 
            :disabled="!isValid"
          >
            <CheckIcon class="w-4 h-4 mr-2" />
            Get Started
          </Button>
          <Button 
            @click="closeModal" 
            variant="outline" 
            class="w-full"
          >
            Maybe Later
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { type DateValue, getLocalTimeZone, today } from '@internationalized/date'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { useCycleStore } from '@/stores/cycle'
import { toast } from 'vue-sonner'
import { 
  HeartIcon, XIcon, CalendarIcon, PlusCircleIcon, BellIcon, CheckIcon
} from 'lucide-vue-next'

interface Props {
  show: boolean
}

interface Emits {
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const cycleStore = useCycleStore()

// Form data
const lastPeriodDate = ref<DateValue | undefined>(undefined)
const cycleLength = ref('28')
const periodLength = ref('5')

// Get today's date
const todayDate = computed(() => {
  return new Date()
})

// Validation
const isValid = computed(() => {
  return lastPeriodDate.value && cycleLength.value && periodLength.value
})

// Options
const cycleLengths = ['21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35']
const periodLengths = ['2', '3', '4', '5', '6', '7', '8', '9', '10']

function formatDate(dateValue: DateValue) {
  return dateValue.toDate(getLocalTimeZone()).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

function saveSettings() {
  if (!isValid.value) return

  // Save to store
  if (lastPeriodDate.value) {
    const date = lastPeriodDate.value.toDate(getLocalTimeZone())
    cycleStore.setLastPeriod(date.toISOString().slice(0, 10))
  }
  cycleStore.setCycleLength(parseInt(cycleLength.value))
  cycleStore.setPeriodLength(parseInt(periodLength.value))

  // Show success message
  toast('Welcome to Cycle Companion!', {
    description: 'Your profile is now set up.',
    action: {
      label: 'Accept',
      onClick: () => console.log('Accepted'),
    },
  })

  // Close modal
  closeModal()
}

function closeModal() {
  emit('close')
}
</script> 