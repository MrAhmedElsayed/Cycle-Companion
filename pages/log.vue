<template>
  <div class="min-h-screen">
    <!-- Header -->
    <div class="p-6">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-12 h-12 flex items-center justify-center">
          <PlusCircleIcon class="w-6 h-6" />
        </div>
        <div>
          <h1 class="text-xl font-bold">Daily Log</h1>
          <p class="text-sm">Track your wellness</p>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="px-4 space-y-4">
      <!-- Today's Log Form -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <PenToolIcon class="w-5 h-5" />
            Today's Entry
          </CardTitle>
          <p class="text-sm">{{ formatDate(today) }}</p>
        </CardHeader>
        <CardContent class="space-y-6">
          <!-- Mood Selection -->
          <div class="space-y-3">
            <Label class="font-medium">How are you feeling today?</Label>
            <div class="grid grid-cols-4 gap-3">
              <button
                v-for="mood in moods"
                :key="mood.label"
                @click="selectedMood = mood"
                :class="[
                  'flex flex-col items-center gap-2 p-4 transition-all duration-200',
                  selectedMood?.label === mood.label
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary hover:bg-secondary/80'
                ]"
              >
                <component :is="mood.icon" class="w-6 h-6" />
                <span class="text-xs font-medium">{{ mood.label }}</span>
              </button>
            </div>
          </div>

          <!-- Symptoms -->
          <div class="space-y-3">
            <Label class="font-medium">Any symptoms today?</Label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="symptom in symptoms"
                :key="symptom.name"
                @click="toggleSymptom(symptom.name)"
                :class="[
                  'flex items-center gap-2 px-4 py-2 text-sm transition-all duration-200',
                  selectedSymptoms.includes(symptom.name)
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary hover:bg-secondary/80'
                ]"
              >
                <component :is="symptom.icon" class="w-4 h-4" />
                {{ symptom.name }}
              </button>
            </div>
          </div>

          <!-- Notes -->
          <div class="space-y-3">
            <Label for="notes" class="font-medium">Notes (optional)</Label>
            <Textarea
              id="notes"
              v-model="notes"
              placeholder="How was your day? Any observations about your cycle?"
              class="min-h-[100px]"
            />
          </div>

          <!-- Save Button -->
          <Button 
            @click="saveLog" 
            class="w-full" 
            :disabled="!selectedMood || isSaving"
          >
            <Loader2Icon v-if="isSaving" class="w-4 h-4 mr-2 animate-spin" />
            <SaveIcon v-else class="w-4 h-4 mr-2" />
            {{ isSaving ? 'Saving...' : (existingLog ? 'Update Today\'s Log' : 'Save Today\'s Log') }}
          </Button>
        </CardContent>
      </Card>

      <!-- Recent Logs -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <HistoryIcon class="w-5 h-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div v-if="recentLogs.length === 0" class="text-center py-8">
            <div class="w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <HistoryIcon class="w-8 h-8" />
            </div>
            <p class="mb-2">No logs yet</p>
            <p class="text-sm">Your daily logs will appear here</p>
          </div>
          <div v-else class="space-y-4">
            <div 
              v-for="log in recentLogs" 
              :key="log.date"
              class="flex items-start gap-4 p-4"
            >
              <div class="w-12 h-12 flex items-center justify-center flex-shrink-0">
                <component :is="getMoodIcon(log.mood)" class="w-6 h-6" />
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <span class="font-semibold">{{ log.mood }}</span>
                  <Badge variant="secondary">
                    {{ formatRelativeDate(log.date) }}
                  </Badge>
                </div>
                <div v-if="log.symptoms && log.symptoms.length > 0" class="flex flex-wrap gap-1 mb-2">
                  <Badge 
                    v-for="symptom in log.symptoms" 
                    :key="symptom"
                    variant="outline" 
                    class="text-xs"
                  >
                    {{ symptom }}
                  </Badge>
                </div>
                <p v-if="log.notes" class="text-sm leading-relaxed">
                  {{ log.notes }}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { toast } from 'sonner'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { useCycleStore } from '@/stores/cycle'
import { 
  PlusCircleIcon, PenToolIcon, SaveIcon, HistoryIcon, SmileIcon, 
  MoonIcon, FrownIcon, ZapIcon, DropletsIcon, CircleIcon, HeartIcon,
  AlertTriangleIcon, ActivityIcon, ThermometerIcon, CoffeeIcon, Loader2Icon
} from 'lucide-vue-next'

const cycleStore = useCycleStore()

// Form data
const selectedMood = ref<{ label: string; icon: any } | null>(null)
const selectedSymptoms = ref<string[]>([])
const notes = ref('')
const isSaving = ref(false)

// Get today's date
const today = computed(() => {
  return new Date().toISOString().slice(0, 10)
})

// Check if there's an existing log for today
const existingLog = computed(() => {
  return cycleStore.getDailyLog(today.value)
})

// Load existing log data if available
onMounted(() => {
  const todayLog = existingLog.value
  if (todayLog) {
    selectedMood.value = moods.find(m => m.label === todayLog.mood) || null
    selectedSymptoms.value = todayLog.symptoms || []
    notes.value = todayLog.notes || ''
  }
})

// Dummy data with Lucide icons
const moods = [
  { label: 'Happy', icon: SmileIcon },
  { label: 'Sad', icon: FrownIcon },
  { label: 'Tired', icon: MoonIcon },
  { label: 'Energetic', icon: ZapIcon },
  { label: 'Calm', icon: HeartIcon },
  { label: 'Stressed', icon: AlertTriangleIcon },
  { label: 'Active', icon: ActivityIcon },
  { label: 'Sick', icon: ThermometerIcon }
]

const symptoms = [
  { name: 'Cramps', icon: ZapIcon },
  { name: 'Bloating', icon: CircleIcon },
  { name: 'Fatigue', icon: MoonIcon },
  { name: 'Mood swings', icon: ActivityIcon },
  { name: 'Acne', icon: CircleIcon },
  { name: 'Headache', icon: ZapIcon },
  { name: 'Back pain', icon: ZapIcon },
  { name: 'Breast tenderness', icon: HeartIcon },
  { name: 'Food cravings', icon: CoffeeIcon },
  { name: 'Insomnia', icon: MoonIcon },
  { name: 'Hot flashes', icon: ThermometerIcon },
  { name: 'Nausea', icon: DropletsIcon }
]

// Get recent logs (excluding today)
const recentLogs = computed(() => {
  const logs = Object.entries(cycleStore.dailyLogs)
    .filter(([date]) => date !== today.value)
    .map(([date, log]) => ({ ...log, date }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)
  
  return logs
})

// Methods
function toggleSymptom(symptom: string) {
  const index = selectedSymptoms.value.indexOf(symptom)
  if (index > -1) {
    selectedSymptoms.value.splice(index, 1)
  } else {
    selectedSymptoms.value.push(symptom)
  }
}

async function saveLog() {
  if (!selectedMood.value) return

  isSaving.value = true

  try {
    const logData = {
      mood: selectedMood.value.label,
      symptoms: selectedSymptoms.value,
      notes: notes.value,
      date: today.value
    }

    // Simulate a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500))

    // Save to Pinia store
    cycleStore.addDailyLog(today.value, logData)
    
    // Show success message
    toast.success(existingLog.value ? 'Log updated successfully!' : 'Log saved successfully!')
    
  } catch (error) {
    toast.error('Failed to save log. Please try again.')
  } finally {
    isSaving.value = false
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', { 
    weekday: 'long',
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

function formatRelativeDate(dateString: string) {
  const date = new Date(dateString)
  const today = new Date()
  const diffTime = Math.abs(today.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays === 2) return '2 days ago'
  return `${diffDays} days ago`
}

function getMoodIcon(mood: string) {
  const iconMap: Record<string, any> = {
    'Happy': SmileIcon,
    'Sad': FrownIcon,
    'Tired': MoonIcon,
    'Energetic': ZapIcon,
    'Calm': HeartIcon,
    'Stressed': AlertTriangleIcon,
    'Active': ActivityIcon,
    'Sick': ThermometerIcon
  }
  return iconMap[mood] || SmileIcon
}
</script> 