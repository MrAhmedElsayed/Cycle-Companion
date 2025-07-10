<template>
  <div class="min-h-screen">
    <!-- Header with Today's Status -->
    <div class="p-6">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 flex items-center justify-center bg-primary/10 rounded-xl">
            <HeartIcon class="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 class="text-xl font-bold">Welcome back!</h1>
            <p class="text-sm text-muted-foreground">Track your cycle with confidence</p>
          </div>
        </div>
        <Button @click="testSonner" variant="outline" size="sm">
          <BellIcon class="w-4 h-4 mr-2" />
          Test Toast
        </Button>
      </div>

      <!-- Today's Status Card -->
      <Card class="mb-4">
        <CardContent class="p-6">
          <div class="flex items-center justify-between mb-4">
            <div>
              <p class="text-sm text-muted-foreground">Today's Status</p>
              <h2 class="text-2xl font-bold">{{ todayStatus }}</h2>
            </div>
            <div class="text-right">
              <p class="text-sm text-muted-foreground">Cycle Day</p>
              <p class="text-2xl font-bold text-primary">{{ cycleDay }}</p>
            </div>
          </div>

          <!-- Cycle Progress Bar -->
          <div class="mb-4">
            <div class="flex justify-between text-xs text-muted-foreground mb-2">
              <span>Day 1</span>
              <span>Day {{ cycleStore.cycleLength }}</span>
            </div>
            <div class="w-full bg-secondary rounded-full h-2">
              <div class="bg-primary h-2 rounded-full transition-all duration-300"
                :style="{ width: `${Math.min((cycleDayNumber / cycleStore.cycleLength) * 100, 100)}%` }"></div>
            </div>
          </div>

          <!-- Phase Info -->
          <div class="flex items-center gap-3 p-3 rounded-lg" :class="getPhaseBackgroundClass(currentPhase)">
            <div class="w-8 h-8 flex items-center justify-center rounded-full"
              :class="getPhaseIconBackgroundClass(currentPhase)">
              <component :is="getPhaseIcon(currentPhase)" class="w-4 h-4" :class="getPhaseIconColor(currentPhase)" />
            </div>
            <div class="flex-1">
              <p class="font-medium">{{ currentPhase }}</p>
              <p class="text-sm">{{ phaseDescription }}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Main Content -->
    <div class="px-4 space-y-4">
      <!-- Today's Quick Actions -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <ZapIcon class="w-5 h-5" />
            Today's Actions
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-3">
          <!-- Today's Log Status -->
          <div v-if="todayLog" class="p-4 rounded-lg bg-green-50 border border-green-200">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 flex items-center justify-center bg-green-500 rounded-full">
                  <CheckCircleIcon class="w-5 h-5 text-white" />
                </div>
                <div>
                  <p class="font-medium text-green-800">Today's Entry Complete</p>
                  <p class="text-sm text-green-600">{{ todayLog.mood }} • {{ todayLog.symptoms?.length || 0 }} symptoms
                  </p>
                </div>
              </div>
              <Button @click="$router.push('/log')" variant="outline" size="sm">
                Edit
              </Button>
            </div>
          </div>

          <!-- Quick Log Button -->
          <NuxtLink v-else to="/log" class="block">
            <div
              class="flex items-center justify-between p-4 rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 flex items-center justify-center bg-primary/10 rounded-full">
                  <PlusCircleIcon class="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p class="font-medium">Log Today's Entry</p>
                  <p class="text-sm text-muted-foreground">Record your mood and symptoms</p>
                </div>
              </div>
              <ChevronRightIcon class="w-5 h-5 text-muted-foreground" />
            </div>
          </NuxtLink>

          <!-- Quick Mood Check-in -->
          <div class="grid grid-cols-4 gap-2">
            <button v-for="mood in quickMoods" :key="mood.label" @click="quickMoodCheck(mood.label)"
              class="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-secondary transition-colors">
              <div class="w-8 h-8 flex items-center justify-center">
                <component :is="mood.icon" class="w-5 h-5" />
              </div>
              <span class="text-xs font-medium">{{ mood.label }}</span>
            </button>
          </div>
        </CardContent>
      </Card>

      <!-- Phase-Specific Tips -->
      <Card v-if="phaseTips.length > 0">
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <LightbulbIcon class="w-5 h-5" />
            Tips for {{ currentPhase }}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-3">
            <div v-for="tip in phaseTips" :key="tip.id" class="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
              <div class="w-6 h-6 flex items-center justify-center rounded-full bg-primary/20 flex-shrink-0 mt-0.5">
                <component :is="tip.icon" class="w-3 h-3 text-primary" />
              </div>
              <div>
                <p class="font-medium text-sm">{{ tip.title }}</p>
                <p class="text-sm text-muted-foreground">{{ tip.description }}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Next Period Countdown -->
      <Card v-if="nextPeriodDays > 0">
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <CalendarIcon class="w-5 h-5" />
            Next Period
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 flex items-center justify-center bg-red-100 rounded-full">
                <DropletsIcon class="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p class="font-medium">{{ nextPeriodText }}</p>
                <p class="text-sm text-muted-foreground">{{ nextPeriodDate }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-2xl font-bold text-red-600">{{ nextPeriodDays }}</p>
              <p class="text-xs text-muted-foreground">days</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Recent Activity with Enhanced Styling -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <HistoryIcon class="w-5 h-5" />
            Recent Activity
            <Badge variant="secondary" class="ml-auto">{{ recentLogs.length }}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-3">
          <div v-for="log in recentLogs" :key="log.date"
            class="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors">
            <div class="w-10 h-10 flex items-center justify-center rounded-full"
              :class="getLogBackgroundClass(log.mood)">
              <component :is="getMoodIcon(log.mood)" class="w-5 h-5" :class="getLogIconColor(log.mood)" />
            </div>
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <p class="text-sm font-medium">{{ formatDate(log.date) }}</p>
                <Badge :class="getLogBadgeClass(log.mood)" class="text-xs">
                  {{ log.mood }}
                </Badge>
              </div>
              <p class="text-xs text-muted-foreground">
                {{ log.symptoms?.length || 0 }} symptoms • {{ formatRelativeDate(log.date) }}
              </p>
              <p v-if="log.notes" class="text-xs text-muted-foreground mt-1 line-clamp-1">
                "{{ log.notes }}"
              </p>
            </div>
          </div>

          <div v-if="recentLogs.length === 0" class="text-center py-8">
            <div class="w-16 h-16 flex items-center justify-center mx-auto mb-4 bg-secondary rounded-full">
              <PenToolIcon class="w-8 h-8 text-muted-foreground" />
            </div>
            <p class="font-medium mb-2">No recent logs</p>
            <p class="text-sm text-muted-foreground mb-4">Start logging to see your activity here</p>
            <Button @click="$router.push('/log')" size="sm">
              <PlusCircleIcon class="w-4 h-4 mr-2" />
              Log Today
            </Button>
          </div>
        </CardContent>
      </Card>

      <!-- Streak Counter -->
      <Card v-if="logStreak > 0">
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <FlameIcon class="w-5 h-5" />
            Logging Streak
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 flex items-center justify-center bg-orange-100 rounded-full">
                <FlameIcon class="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p class="font-medium">{{ logStreak }} day streak</p>
                <p class="text-sm text-muted-foreground">Keep it up!</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-2xl font-bold text-orange-600">{{ logStreak }}</p>
              <p class="text-xs text-muted-foreground">days</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Welcome Modal -->
    <WelcomeModal :show="showWelcomeModal" @close="showWelcomeModal = false" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useCycleStore } from '@/stores/cycle'
import WelcomeModal from '@/components/WelcomeModal.vue'
import { toast } from 'vue-sonner'
import {
  HeartIcon, SettingsIcon, ZapIcon, CircleIcon, CalendarIcon,
  TargetIcon, ActivityIcon, SmileIcon, ChevronRightIcon,
  MoonIcon, SparklesIcon, PlusCircleIcon, FrownIcon, HeartIcon as HeartIcon2,
  AlertTriangleIcon, ActivityIcon as ActivityIcon2, ThermometerIcon, ClockIcon, HistoryIcon, PenToolIcon,
  LightbulbIcon, DropletsIcon, CheckCircleIcon, FlameIcon, BellIcon, PenToolIcon as PenToolIcon2
} from 'lucide-vue-next'

const cycleStore = useCycleStore()
const showWelcomeModal = ref(false)

// Today's status text
const todayStatus = computed(() => {
  if (!cycleStore.lastPeriod) return 'Setup Required'
  return `Day ${cycleDay.value} of ${cycleStore.cycleLength}`
})

const affirmations = [
  "You are strong and capable. Your body is doing exactly what it needs to do.",
  "It's okay to take time for yourself. Rest is productive.",
  "Your feelings are valid. Be gentle with yourself today.",
  "You've got this! Every cycle is a new beginning.",
  "You are more than your symptoms. You are amazing."
]

const currentAffirmation = computed(() => {
  const today = new Date().getDate()
  return affirmations[today % affirmations.length]
})

// Get current cycle phase
// Get current cycle day
const cycleDay = computed(() => {
  if (!cycleStore.lastPeriod) return '--'

  const today = new Date()
  const lastPeriod = new Date(cycleStore.lastPeriod)
  const daysSinceLastPeriod = Math.floor((today.getTime() - lastPeriod.getTime()) / (1000 * 60 * 60 * 24))

  if (daysSinceLastPeriod < 0) return '--'
  return (daysSinceLastPeriod % cycleStore.cycleLength) + 1
})

// Get next period text
const nextPeriodText = computed(() => {
  if (!cycleStore.lastPeriod) return 'Setup Required'

  const today = new Date()
  const lastPeriod = new Date(cycleStore.lastPeriod)
  const daysSinceLastPeriod = Math.floor((today.getTime() - lastPeriod.getTime()) / (1000 * 60 * 60 * 24))

  if (daysSinceLastPeriod < 0) return 'Setup Required'

  const daysUntilNextPeriod = cycleStore.cycleLength - (daysSinceLastPeriod % cycleStore.cycleLength)

  if (daysUntilNextPeriod === 1) return 'Tomorrow'
  if (daysUntilNextPeriod <= 7) return `In ${daysUntilNextPeriod} days`
  return `In ${daysUntilNextPeriod} days`
})

const currentPhase = computed(() => {
  if (!cycleStore.lastPeriod) return 'Setup Required'

  const today = new Date()
  const lastPeriod = new Date(cycleStore.lastPeriod)
  const daysSinceLastPeriod = Math.floor((today.getTime() - lastPeriod.getTime()) / (1000 * 60 * 60 * 24))

  if (daysSinceLastPeriod < 0) return 'Setup Required'
  if (daysSinceLastPeriod < cycleStore.periodLength) return 'Period'
  if (daysSinceLastPeriod >= cycleStore.cycleLength - 14 && daysSinceLastPeriod < cycleStore.cycleLength - 9) return 'Fertile Window'
  if (daysSinceLastPeriod >= cycleStore.cycleLength - 7) return 'PMS Phase'
  return 'Regular Phase'
})

const phaseDescription = computed(() => {
  switch (currentPhase.value) {
    case 'Period':
      return "You're currently on your period. Take care of yourself and listen to your body's needs."
    case 'Fertile Window':
      return "You're in your fertile window. This is a great time for conception if you're trying to get pregnant."
    case 'PMS Phase':
      return "You're in the premenstrual phase. Be gentle with yourself and practice self-care."
    case 'Regular Phase':
      return "You're in a regular phase of your cycle. This is typically a time of balanced energy."
    default:
      return "Please complete your profile in Settings to get personalized cycle information."
  }
})

// Get recent logs (last 3 days)
const recentLogs = computed(() => {
  const logs = Object.entries(cycleStore.dailyLogs)
    .map(([date, log]) => ({ ...log, date }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3)

  return logs
})

function formatDate(dateString: string | null) {
  if (!dateString) return 'Not set'
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
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
    'Calm': HeartIcon2,
    'Stressed': AlertTriangleIcon,
    'Active': ActivityIcon2,
    'Sick': ThermometerIcon
  }
  return iconMap[mood] || SmileIcon
}

function getLogBackgroundClass(mood: string) {
  switch (mood) {
    case 'Happy':
      return 'bg-green-500'
    case 'Sad':
      return 'bg-red-500'
    case 'Tired':
      return 'bg-blue-500'
    case 'Energetic':
      return 'bg-purple-500'
    case 'Calm':
      return 'bg-yellow-500'
    case 'Stressed':
      return 'bg-orange-500'
    case 'Active':
      return 'bg-teal-500'
    case 'Sick':
      return 'bg-pink-500'
    default:
      return 'bg-gray-500'
  }
}

function getLogIconColor(mood: string) {
  switch (mood) {
    case 'Happy':
      return 'text-white'
    case 'Sad':
      return 'text-white'
    case 'Tired':
      return 'text-white'
    case 'Energetic':
      return 'text-white'
    case 'Calm':
      return 'text-white'
    case 'Stressed':
      return 'text-white'
    case 'Active':
      return 'text-white'
    case 'Sick':
      return 'text-white'
    default:
      return 'text-white'
  }
}

function getLogBadgeClass(mood: string) {
  switch (mood) {
    case 'Happy':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'Sad':
      return 'bg-red-100 text-red-800 border-red-200'
    case 'Tired':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'Energetic':
      return 'bg-purple-100 text-purple-800 border-purple-200'
    case 'Calm':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'Stressed':
      return 'bg-orange-100 text-orange-800 border-orange-200'
    case 'Active':
      return 'bg-teal-100 text-teal-800 border-teal-200'
    case 'Sick':
      return 'bg-pink-100 text-pink-800 border-pink-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

function getPhaseBackgroundClass(phase: string) {
  switch (phase) {
    case 'Period':
      return 'bg-red-50'
    case 'Fertile Window':
      return 'bg-blue-50'
    case 'PMS Phase':
      return 'bg-purple-50'
    case 'Regular Phase':
      return 'bg-gray-50'
    default:
      return ''
  }
}

function getPhaseIconBackgroundClass(phase: string) {
  switch (phase) {
    case 'Period':
      return 'bg-red-100'
    case 'Fertile Window':
      return 'bg-blue-100'
    case 'PMS Phase':
      return 'bg-purple-100'
    case 'Regular Phase':
      return 'bg-gray-100'
    default:
      return ''
  }
}

function getPhaseIcon(phase: string) {
  switch (phase) {
    case 'Period':
      return CircleIcon
    case 'Fertile Window':
      return SparklesIcon
    case 'PMS Phase':
      return MoonIcon
    case 'Regular Phase':
      return HeartIcon2
    default:
      return HeartIcon2
  }
}

function getPhaseIconColor(phase: string) {
  switch (phase) {
    case 'Period':
      return 'text-red-600'
    case 'Fertile Window':
      return 'text-blue-600'
    case 'PMS Phase':
      return 'text-purple-600'
    case 'Regular Phase':
      return 'text-gray-600'
    default:
      return 'text-gray-600'
  }
}

const quickMoods = [
  { label: 'Happy', icon: SmileIcon },
  { label: 'Sad', icon: FrownIcon },
  { label: 'Tired', icon: MoonIcon },
  { label: 'Energetic', icon: ZapIcon },
  { label: 'Calm', icon: HeartIcon2 },
  { label: 'Stressed', icon: AlertTriangleIcon },
  { label: 'Active', icon: ActivityIcon2 },
  { label: 'Sick', icon: ThermometerIcon }
]

// Phase-specific tips
const phaseTips = computed(() => {
  switch (currentPhase.value) {
    case 'Period':
      return [
        { id: 1, title: 'Stay Hydrated', description: 'Drink plenty of water to help with bloating and cramps', icon: DropletsIcon },
        { id: 2, title: 'Gentle Exercise', description: 'Light walking or yoga can help with cramps', icon: ActivityIcon2 },
        { id: 3, title: 'Rest Well', description: 'Listen to your body and get extra sleep if needed', icon: MoonIcon }
      ]
    case 'Fertile Window':
      return [
        { id: 1, title: 'Track Temperature', description: 'Monitor your basal body temperature for fertility tracking', icon: ThermometerIcon },
        { id: 2, title: 'Cervical Mucus', description: 'Pay attention to changes in cervical mucus consistency', icon: CircleIcon },
        { id: 3, title: 'Ovulation Tests', description: 'Consider using ovulation prediction kits', icon: TargetIcon }
      ]
    case 'PMS Phase':
      return [
        { id: 1, title: 'Self-Care', description: 'Practice gentle self-care activities like warm baths', icon: HeartIcon2 },
        { id: 2, title: 'Healthy Diet', description: 'Eat balanced meals and avoid excessive salt and sugar', icon: SparklesIcon },
        { id: 3, title: 'Stress Management', description: 'Try meditation or deep breathing exercises', icon: ActivityIcon2 }
      ]
    case 'Regular Phase':
      return [
        { id: 1, title: 'Maintain Routine', description: 'This is a great time for regular exercise and activities', icon: ActivityIcon2 },
        { id: 2, title: 'Track Symptoms', description: 'Continue logging to understand your patterns', icon: PenToolIcon2 },
        { id: 3, title: 'Plan Ahead', description: 'Use this time to prepare for upcoming cycle phases', icon: CalendarIcon }
      ]
    default:
      return []
  }
})

function quickMoodCheck(mood: string) {
  const today = new Date().toISOString().slice(0, 10)
  const existingLog = cycleStore.dailyLogs[today]
  if (existingLog) {
    existingLog.mood = mood
    existingLog.symptoms = [] // Clear symptoms if mood changes
    existingLog.notes = ''
    cycleStore.saveToStorage()
  } else {
    cycleStore.addDailyLog(today, {
      date: today,
      mood: mood,
      symptoms: [],
      notes: ''
    })
  }
  toast(`Quick mood check: ${mood}`, {
    description: 'Your mood has been recorded for today'
  })
}

const todayLog = computed(() => {
  const today = new Date().toISOString().slice(0, 10)
  return cycleStore.dailyLogs[today]
})

const cycleDayNumber = computed(() => {
  if (!cycleStore.lastPeriod) return 0
  const today = new Date()
  const lastPeriod = new Date(cycleStore.lastPeriod)
  const daysSinceLastPeriod = Math.floor((today.getTime() - lastPeriod.getTime()) / (1000 * 60 * 60 * 24))
  return daysSinceLastPeriod + 1
})

const nextPeriodDate = computed(() => {
  if (!cycleStore.lastPeriod) return 'Not set'
  const today = new Date()
  const lastPeriod = new Date(cycleStore.lastPeriod)
  const daysSinceLastPeriod = Math.floor((today.getTime() - lastPeriod.getTime()) / (1000 * 60 * 60 * 24))
  const daysUntilNextPeriod = cycleStore.cycleLength - (daysSinceLastPeriod % cycleStore.cycleLength)

  if (daysUntilNextPeriod === 1) return 'Tomorrow'
  if (daysUntilNextPeriod <= 7) return `In ${daysUntilNextPeriod} days`
  return `In ${daysUntilNextPeriod} days`
})

const nextPeriodDays = computed(() => {
  if (!cycleStore.lastPeriod) return 0
  const today = new Date()
  const lastPeriod = new Date(cycleStore.lastPeriod)
  const daysSinceLastPeriod = Math.floor((today.getTime() - lastPeriod.getTime()) / (1000 * 60 * 60 * 24))
  const daysUntilNextPeriod = cycleStore.cycleLength - (daysSinceLastPeriod % cycleStore.cycleLength)

  return daysUntilNextPeriod
})

const logStreak = computed(() => {
  const today = new Date()
  let streak = 0
  let currentDate = new Date(today)

  // Count consecutive days with logs, starting from today
  while (true) {
    const dateString = currentDate.toISOString().slice(0, 10)
    const log = cycleStore.dailyLogs[dateString]

    if (log && log.mood) {
      streak++
      currentDate.setDate(currentDate.getDate() - 1) // Go back one day
    } else {
      break
    }
  }

  return streak
})

function testSonner() {
  toast('🎉 Sonner is working perfectly!', {
    description: 'This toast notification system is fully functional and ready for production use.',
    duration: 4000,
    action: {
      label: 'Dismiss',
      onClick: () => console.log('Dismissed'),
    },
  })
}

// Check if user needs welcome modal
onMounted(() => {
  if (!cycleStore.lastPeriod) {
    showWelcomeModal.value = true
  }
})
</script>

<style></style>