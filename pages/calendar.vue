<template>
  <div class="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
    <!-- Enhanced Header with Stats -->
    <div class="p-6 bg-gradient-to-r from-primary/5 to-accent/5 border-b border-border/50">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 flex items-center justify-center bg-primary/10 rounded-2xl">
            <CalendarIcon class="w-7 h-7 text-primary" />
          </div>
          <div>
            <h1 class="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Cycle Calendar
            </h1>
            <p class="text-sm text-muted-foreground">Track, analyze, and predict your cycle</p>
          </div>
        </div>
        
        <!-- Quick Stats -->
        <div class="flex items-center gap-4">
          <div class="text-center">
            <p class="text-2xl font-bold text-primary">{{ cycleDay }}</p>
            <p class="text-xs text-muted-foreground">Day {{ currentPhase }}</p>
          </div>
          <div class="w-px h-8 bg-border"></div>
          <div class="text-center">
            <p class="text-lg font-semibold">{{ nextPeriodDays }}</p>
            <p class="text-xs text-muted-foreground">Days to next</p>
          </div>
        </div>
      </div>

      <!-- Cycle Progress Bar -->
      <div class="mb-4">
        <div class="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Day 1</span>
          <span class="font-medium">{{ currentPhase }}</span>
          <span>Day {{ cycleStore.cycleLength }}</span>
        </div>
        <div class="w-full bg-secondary/50 rounded-full h-3 overflow-hidden">
          <div class="bg-gradient-to-r from-primary to-accent h-3 rounded-full transition-all duration-500 ease-out"
            :style="{ width: `${Math.min((cycleDayNumber / cycleStore.cycleLength) * 100, 100)}%` }">
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="p-6 space-y-6">
      <!-- Interactive Calendar Section -->
      <div class="grid lg:grid-cols-3 gap-6">
        <!-- Enhanced Calendar -->
        <div class="lg:col-span-2">
          <Card class="h-fit">
            <CardHeader>
              <div class="flex items-center justify-between">
                <CardTitle class="flex items-center gap-2">
                  <CalendarIcon class="w-5 h-5" />
                  Interactive Cycle Calendar
                </CardTitle>
                <div class="flex items-center gap-2">
                  <Button variant="outline" size="sm" @click="previousMonth">
                    <ChevronLeftIcon class="w-4 h-4" />
                  </Button>
                  <span class="text-sm font-medium">{{ currentMonthYear }}</span>
                  <Button variant="outline" size="sm" @click="nextMonth">
                    <ChevronRightIcon class="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <p class="text-sm text-muted-foreground">Click on dates to log entries or view details</p>
            </CardHeader>
            <CardContent>
              <!-- Clean Calendar, no intrusive overlays -->
              <Calendar
                v-model="selectedDate"
                :weekday-format="'short'"
                class="w-full"
              />
              <!-- Minimal legend or indicators can be added later if needed -->
            </CardContent>
          </Card>
        </div>

        <!-- Quick Actions & Today's Info -->
        <div class="space-y-6">
          <!-- Today's Status -->
          <Card>
            <CardHeader>
              <CardTitle class="flex items-center gap-2">
                <TargetIcon class="w-5 h-5" />
                Today's Status
              </CardTitle>
            </CardHeader>
            <CardContent class="space-y-4">
              <div class="text-center p-4 rounded-lg" :class="getPhaseBackgroundClass(currentPhase)">
                <div class="w-12 h-12 flex items-center justify-center mx-auto mb-3 rounded-full"
                  :class="getPhaseIconBackgroundClass(currentPhase)">
                  <component :is="getPhaseIcon(currentPhase)" class="w-6 h-6" :class="getPhaseIconColor(currentPhase)" />
                </div>
                <h3 class="font-semibold text-lg">{{ currentPhase }}</h3>
                <p class="text-sm text-muted-foreground">{{ phaseDescription }}</p>
              </div>

              <!-- Quick Log Button -->
              <Button @click="quickLogToday" class="w-full" :variant="todayLog ? 'outline' : 'default'">
                <component :is="todayLog ? CheckCircleIcon : PlusCircleIcon" class="w-4 h-4 mr-2" />
                {{ todayLog ? 'Edit Today\'s Log' : 'Log Today' }}
              </Button>
            </CardContent>
          </Card>

          <!-- Smart Predictions -->
          <Card>
            <CardHeader>
              <CardTitle class="flex items-center gap-2">
                <BrainIcon class="w-5 h-5" />
                Smart Predictions
              </CardTitle>
            </CardHeader>
            <CardContent class="space-y-3">
              <div v-for="prediction in smartPredictions" :key="prediction.id"
                class="flex items-start gap-3 p-3 rounded-lg bg-secondary/30">
                <div class="w-8 h-8 flex items-center justify-center rounded-full bg-primary/20 flex-shrink-0">
                  <component :is="prediction.icon" class="w-4 h-4 text-primary" />
                </div>
                <div class="flex-1">
                  <p class="font-medium text-sm">{{ prediction.title }}</p>
                  <p class="text-xs text-muted-foreground">{{ prediction.description }}</p>
                  <p v-if="prediction.date" class="text-xs font-medium text-primary mt-1">
                    {{ prediction.date }}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <!-- Advanced Analytics Dashboard -->
      <div class="grid lg:grid-cols-2 gap-6">
        <!-- Cycle Analytics -->
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <BarChart3Icon class="w-5 h-5" />
              Cycle Analytics
            </CardTitle>
          </CardHeader>
          <CardContent class="space-y-6">
            <!-- Cycle Length Trend -->
            <div>
              <h4 class="font-medium mb-3">Cycle Length Trend</h4>
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm text-muted-foreground">Average: {{ averageCycleLength }} days</span>
                <span class="text-sm text-muted-foreground">Regularity: {{ cycleRegularity }}%</span>
              </div>
              <div class="h-20 bg-secondary/20 rounded-lg p-3">
                <!-- Cycle Length Chart Placeholder -->
                <div class="flex items-end justify-between h-full">
                  <div v-for="(length, index) in cycleLengthHistory" :key="index"
                    class="bg-primary rounded-t transition-all duration-300 hover:bg-primary/80"
                    :style="{ height: `${(length / 35) * 100}%`, width: '8px' }"
                    :title="`Cycle ${index + 1}: ${length} days`">
                  </div>
                </div>
              </div>
            </div>

            <!-- Symptom Correlation -->
            <div>
              <h4 class="font-medium mb-3">Symptom Patterns</h4>
              <div class="space-y-2">
                <div v-for="symptom in topSymptoms" :key="symptom.name"
                  class="flex items-center justify-between">
                  <span class="text-sm">{{ symptom.name }}</span>
                  <div class="flex items-center gap-2">
                    <div class="w-16 bg-secondary/30 rounded-full h-2">
                      <div class="bg-accent h-2 rounded-full" :style="{ width: `${symptom.frequency}%` }"></div>
                    </div>
                    <span class="text-xs text-muted-foreground">{{ symptom.frequency }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Mood & Energy Analysis -->
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <TrendingUpIcon class="w-5 h-5" />
              Mood & Energy Trends
            </CardTitle>
          </CardHeader>
          <CardContent class="space-y-6">
            <!-- Mood Distribution -->
            <div>
              <h4 class="font-medium mb-3">Mood Distribution</h4>
              <div class="grid grid-cols-2 gap-3">
                <div v-for="mood in moodDistribution" :key="mood.name"
                  class="flex items-center gap-2 p-2 rounded-lg bg-secondary/30">
                  <div class="w-3 h-3 rounded-full" :class="getMoodColor(mood.name)"></div>
                  <span class="text-sm flex-1">{{ mood.name }}</span>
                  <span class="text-xs font-medium">{{ mood.percentage }}%</span>
                </div>
              </div>
            </div>

            <!-- Energy Level -->
            <div>
              <h4 class="font-medium mb-3">Current Energy Level</h4>
              <div class="flex items-center gap-3">
                <div class="flex-1">
                  <div class="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Low</span>
                    <span>High</span>
                  </div>
                  <div class="w-full bg-secondary/30 rounded-full h-3">
                    <div class="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-3 rounded-full transition-all duration-300"
                      :style="{ width: `${currentEnergyLevel}%` }"></div>
                  </div>
                </div>
                <span class="text-sm font-medium">{{ currentEnergyLevel }}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Advanced Features -->
      <div class="grid lg:grid-cols-3 gap-6">
        <!-- Fertility Tracking -->
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <HeartIcon class="w-5 h-5" />
              Fertility Insights
            </CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div v-if="isInFertileWindow" class="p-4 rounded-lg bg-blue-50 border border-blue-200">
              <div class="flex items-center gap-3 mb-2">
                <div class="w-8 h-8 flex items-center justify-center bg-blue-500 rounded-full">
                  <TargetIcon class="w-4 h-4 text-white" />
                </div>
                <span class="font-medium text-blue-800">Fertile Window Active</span>
              </div>
              <p class="text-sm text-blue-700">{{ fertileWindowDays }} days remaining</p>
            </div>
            
            <div class="space-y-2">
              <div v-for="insight in fertilityInsights" :key="insight.id"
                class="flex items-center gap-3 p-2 rounded-lg bg-secondary/30">
                <component :is="insight.icon" class="w-4 h-4 text-primary" />
                <span class="text-sm">{{ insight.text }}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Health Recommendations -->
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <StethoscopeIcon class="w-5 h-5" />
              Health Tips
            </CardTitle>
          </CardHeader>
          <CardContent class="space-y-3">
            <div v-for="tip in healthTips" :key="tip.id"
              class="flex items-start gap-3 p-3 rounded-lg bg-secondary/30">
              <div class="w-6 h-6 flex items-center justify-center rounded-full bg-green-100 flex-shrink-0">
                <component :is="tip.icon" class="w-3 h-3 text-green-600" />
              </div>
              <div>
                <p class="font-medium text-sm">{{ tip.title }}</p>
                <p class="text-xs text-muted-foreground">{{ tip.description }}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Data Export & Sharing -->
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <ShareIcon class="w-5 h-5" />
              Export & Share
            </CardTitle>
          </CardHeader>
          <CardContent class="space-y-3">
            <Button @click="exportData" variant="outline" class="w-full">
              <DownloadIcon class="w-4 h-4 mr-2" />
              Export Data
            </Button>
            <Button @click="shareCalendar" variant="outline" class="w-full">
              <ShareIcon class="w-4 h-4 mr-2" />
              Share Calendar
            </Button>
            <Button @click="generateReport" variant="outline" class="w-full">
              <FileTextIcon class="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>

    <!-- Enhanced Date Detail Modal -->
    <Dialog v-model:open="showDateDetail">
      <DialogContent class="max-w-md">
        <DialogHeader>
          <DialogTitle>{{ selectedDateFormatted }}</DialogTitle>
          <DialogDescription>
            View and edit your log entry for this date
          </DialogDescription>
        </DialogHeader>
        <div class="space-y-4">
          <div v-if="selectedDateLog" class="space-y-3">
            <div class="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
              <component :is="getMoodIcon(selectedDateLog.mood || '')" class="w-5 h-5" />
              <span class="font-medium">{{ selectedDateLog.mood }}</span>
            </div>
            <div v-if="selectedDateLog.symptoms?.length" class="space-y-2">
              <h4 class="font-medium text-sm">Symptoms:</h4>
              <div class="flex flex-wrap gap-2">
                <Badge v-for="symptom in selectedDateLog.symptoms" :key="symptom" variant="secondary">
                  {{ symptom }}
                </Badge>
              </div>
            </div>
            <div v-if="selectedDateLog.notes" class="p-3 rounded-lg bg-muted/30">
              <p class="text-sm">{{ selectedDateLog.notes }}</p>
            </div>
          </div>
          <DialogFooter>
            <Button @click="editSelectedDate" class="flex-1">
              <EditIcon class="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button @click="showDateDetail = false" variant="outline">
              Close
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { type DateValue, getLocalTimeZone, today, CalendarDate } from '@internationalized/date'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Calendar } from '@/components/ui/calendar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useCycleStore } from '@/stores/cycle'
import { toast } from 'vue-sonner'
import { 
  CalendarIcon, TargetIcon, BarChart3Icon, TrendingUpIcon, HeartIcon, ShareIcon,
  ChevronLeftIcon, ChevronRightIcon, PlusCircleIcon, CheckCircleIcon, BrainIcon,
  DownloadIcon, FileTextIcon, EditIcon, StethoscopeIcon, ActivityIcon, DropletsIcon,
  MoonIcon, ThermometerIcon, SparklesIcon, AlertTriangleIcon, ClockIcon, ZapIcon,
  SmileIcon, FrownIcon, ActivityIcon as ActivityIcon2, HeartIcon as HeartIcon2, CircleIcon
} from 'lucide-vue-next'

const cycleStore = useCycleStore()
const selectedDate = ref(today(getLocalTimeZone())) as Ref<DateValue>
const showDateDetail = ref(false)
const currentMonth = ref(new Date().getMonth())
const currentYear = ref(new Date().getFullYear())

// Computed Properties
const currentMonthYear = computed(() => {
  return new Date(currentYear.value, currentMonth.value).toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  })
})

const cycleDay = computed(() => {
  if (!cycleStore.lastPeriod) return '--'
  const today = new Date()
  const lastPeriod = new Date(cycleStore.lastPeriod)
  const daysSinceLastPeriod = Math.floor((today.getTime() - lastPeriod.getTime()) / (1000 * 60 * 60 * 24))
  return (daysSinceLastPeriod % cycleStore.cycleLength) + 1
})

const cycleDayNumber = computed(() => {
  if (!cycleStore.lastPeriod) return 0
  const today = new Date()
  const lastPeriod = new Date(cycleStore.lastPeriod)
  const daysSinceLastPeriod = Math.floor((today.getTime() - lastPeriod.getTime()) / (1000 * 60 * 60 * 24))
  return daysSinceLastPeriod + 1
})

const currentPhase = computed(() => {
  if (!cycleStore.lastPeriod) return 'Setup Required'
  const today = new Date()
  const lastPeriod = new Date(cycleStore.lastPeriod)
  const daysSinceLastPeriod = Math.floor((today.getTime() - lastPeriod.getTime()) / (1000 * 60 * 60 * 24))
  
  if (daysSinceLastPeriod < cycleStore.periodLength) return 'Period'
  if (daysSinceLastPeriod >= cycleStore.cycleLength - 14 && daysSinceLastPeriod < cycleStore.cycleLength - 9) return 'Fertile Window'
  if (daysSinceLastPeriod >= cycleStore.cycleLength - 7) return 'PMS Phase'
  return 'Regular Phase'
})

const phaseDescription = computed(() => {
  switch (currentPhase.value) {
    case 'Period': return "Your menstrual phase. Focus on rest and self-care."
    case 'Fertile Window': return "Peak fertility period. Great time for conception planning."
    case 'PMS Phase': return "Pre-menstrual phase. Be gentle with yourself."
    case 'Regular Phase': return "Balanced energy phase. Good time for activities."
    default: return "Please complete your profile setup."
  }
})

const nextPeriodDays = computed(() => {
  if (!cycleStore.lastPeriod) return 0
  const today = new Date()
  const lastPeriod = new Date(cycleStore.lastPeriod)
  const daysSinceLastPeriod = Math.floor((today.getTime() - lastPeriod.getTime()) / (1000 * 60 * 60 * 24))
  return cycleStore.cycleLength - (daysSinceLastPeriod % cycleStore.cycleLength)
})

const todayLog = computed(() => {
  const today = new Date().toISOString().slice(0, 10)
  return cycleStore.dailyLogs[today]
})

const selectedDateFormatted = computed(() => {
  return new Date(selectedDate.value.toDate(getLocalTimeZone())).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const selectedDateLog = computed(() => {
  const dateStr = new Date(selectedDate.value.toDate(getLocalTimeZone())).toISOString().slice(0, 10)
  return cycleStore.dailyLogs[dateStr]
})

// Cycle Phase Visualization
const cyclePhases = computed(() => {
  if (!cycleStore.lastPeriod) return []
  
  const phases = []
  const lastPeriod = new Date(cycleStore.lastPeriod)
  
  for (let i = 0; i < cycleStore.cycleLength; i++) {
    const date = new Date(lastPeriod)
    date.setDate(date.getDate() + i)
    
    let phase = 'Regular'
    if (i < cycleStore.periodLength) phase = 'Period'
    else if (i >= cycleStore.cycleLength - 14 && i < cycleStore.cycleLength - 9) phase = 'Fertile'
    else if (i >= cycleStore.cycleLength - 7) phase = 'PMS'
    
    phases.push({
      date: date.toISOString().slice(0, 10),
      phase
    })
  }
  
  return phases
})

const cycleLegend = [
  { phase: 'Period', color: 'bg-red-500' },
  { phase: 'Fertile', color: 'bg-blue-500' },
  { phase: 'PMS', color: 'bg-purple-500' },
  { phase: 'Regular', color: 'bg-gray-400' }
]

// Smart Predictions
const periodDates = computed(() => {
  const periodLogs = Object.values(cycleStore.dailyLogs)
    .filter(log => log.mood === 'Period Start')
    .map(log => new Date(log.date))
    .sort((a, b) => a.getTime() - b.getTime())
  if (periodLogs.length === 0) {
    // fallback: use all log dates
    return Object.values(cycleStore.dailyLogs)
      .map(log => new Date(log.date))
      .sort((a, b) => a.getTime() - b.getTime())
  }
  return periodLogs
})

const averageCycleLength = computed(() => {
  const dates = periodDates.value
  if (dates.length < 2) return cycleStore.cycleLength
  let total = 0
  for (let i = 1; i < dates.length; i++) {
    total += (dates[i].getTime() - dates[i - 1].getTime()) / (1000 * 60 * 60 * 24)
  }
  return Math.round(total / (dates.length - 1))
})

const smartPredictions = computed(() => {
  const predictions = []
  // Period prediction
  if (nextPeriodDays.value <= 7 && nextPeriodDays.value > 0) {
    predictions.push({
      id: 1,
      title: 'Period Approaching',
      description: `Your period is expected in ${nextPeriodDays.value} day${nextPeriodDays.value === 1 ? '' : 's'}.`,
      date: null,
      icon: AlertTriangleIcon
    })
  }
  // Fertile window
  if (isInFertileWindow.value) {
    const days = Number(fertileWindowDays.value) || 0
    predictions.push({
      id: 2,
      title: 'Fertile Window',
      description: `You are in your fertile window. ${days} day${days === 1 ? '' : 's'} left.`,
      date: null,
      icon: TargetIcon
    })
  }
  // PMS phase
  if (currentPhase.value === 'PMS Phase') {
    predictions.push({
      id: 3,
      title: 'PMS Phase',
      description: 'Premenstrual phase. Take care of yourself and practice self-care.',
      date: null,
      icon: BrainIcon
    })
  }
  // Average cycle pattern
  if (periodDates.value.length >= 2) {
    predictions.push({
      id: 4,
      title: 'Cycle Pattern',
      description: `Your average cycle length is ${averageCycleLength.value} days.`,
      date: null,
      icon: BrainIcon
    })
  }
  if (predictions.length === 0) {
    predictions.push({
      id: 'empty',
      title: 'No Predictions Available',
      description: 'Log your period start dates and keep tracking your cycle to see smart predictions here.',
      date: null,
      icon: BrainIcon
    })
  }
  return predictions
})

// Analytics Data
const cycleRegularity = computed(() => {
  // Calculate regularity percentage
  return 85 // Placeholder
})

const cycleLengthHistory = computed(() => {
  // Generate sample data for visualization
  return [28, 29, 27, 30, 28, 29, 27, 28]
})

const topSymptoms = computed(() => {
  const allSymptoms: string[] = []
  Object.values(cycleStore.dailyLogs).forEach(log => {
    if (log.symptoms) {
      allSymptoms.push(...log.symptoms)
    }
  })
  
  const symptomCounts: { [key: string]: number } = {}
  allSymptoms.forEach(symptom => {
    symptomCounts[symptom] = (symptomCounts[symptom] || 0) + 1
  })
  
  return Object.entries(symptomCounts)
    .map(([name, count]) => ({
      name,
      frequency: Math.round((count / allSymptoms.length) * 100)
    }))
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 5)
})

const moodDistribution = computed(() => {
  const moods = Object.values(cycleStore.dailyLogs).map(log => log.mood).filter(Boolean)
  const moodCounts: { [key: string]: number } = {}
  
  moods.forEach(mood => {
    moodCounts[mood!] = (moodCounts[mood!] || 0) + 1
  })
  
  return Object.entries(moodCounts)
    .map(([name, count]) => ({
      name,
      percentage: Math.round((count / moods.length) * 100)
    }))
    .sort((a, b) => b.percentage - a.percentage)
})

const currentEnergyLevel = computed(() => {
  // Calculate energy level based on current phase and mood
  switch (currentPhase.value) {
    case 'Period': return 30
    case 'Fertile Window': return 80
    case 'PMS Phase': return 40
    case 'Regular Phase': return 70
    default: return 50
  }
})

// Fertility Tracking
const isInFertileWindow = computed(() => {
  return currentPhase.value === 'Fertile Window'
})

const fertileWindowDays = computed(() => {
  if (!isInFertileWindow.value) return 0
  return 5 // Placeholder calculation
})

const fertilityInsights = computed(() => [
  {
    id: 1,
    text: 'Track basal body temperature',
    icon: ThermometerIcon
  },
  {
    id: 2,
    text: 'Monitor cervical mucus',
    icon: DropletsIcon
  },
  {
    id: 3,
    text: 'Consider ovulation tests',
    icon: TargetIcon
  }
])

const healthTips = computed(() => [
  {
    id: 1,
    title: 'Stay Hydrated',
    description: 'Drink 8-10 glasses of water daily',
    icon: DropletsIcon
  },
  {
    id: 2,
    title: 'Exercise Regularly',
    description: '30 minutes of moderate activity',
    icon: ActivityIcon
  },
  {
    id: 3,
    title: 'Get Adequate Sleep',
    description: '7-9 hours of quality sleep',
    icon: MoonIcon
  }
])

// Methods
function getPhaseOverlayClass(phase: string) {
  switch (phase) {
    case 'Period': return 'border-red-500 bg-red-500/20'
    case 'Fertile': return 'border-blue-500 bg-blue-500/20'
    case 'PMS': return 'border-purple-500 bg-purple-500/20'
    default: return 'border-gray-400 bg-gray-400/20'
  }
}

function getPhasePosition(date: string) {
  // Calculate position based on date
  const dateObj = new Date(date)
  const day = dateObj.getDate()
  const week = Math.floor((day - 1) / 7)
  const dayOfWeek = dateObj.getDay()
  
  return {
    top: `${week * 40 + 60}px`,
    left: `${dayOfWeek * 40 + 20}px`
  }
}

function getPhaseBackgroundClass(phase: string) {
  switch (phase) {
    case 'Period': return 'bg-red-50 border border-red-200'
    case 'Fertile Window': return 'bg-blue-50 border border-blue-200'
    case 'PMS Phase': return 'bg-purple-50 border border-purple-200'
    case 'Regular Phase': return 'bg-gray-50 border border-gray-200'
    default: return 'bg-muted border border-border'
  }
}

function getPhaseIconBackgroundClass(phase: string) {
  switch (phase) {
    case 'Period': return 'bg-red-100'
    case 'Fertile Window': return 'bg-blue-100'
    case 'PMS Phase': return 'bg-purple-100'
    case 'Regular Phase': return 'bg-gray-100'
    default: return 'bg-muted'
  }
}

function getPhaseIcon(phase: string) {
  switch (phase) {
    case 'Period': return CircleIcon
    case 'Fertile Window': return TargetIcon
    case 'PMS Phase': return MoonIcon
    case 'Regular Phase': return HeartIcon2
    default: return HeartIcon2
  }
}

function getPhaseIconColor(phase: string) {
  switch (phase) {
    case 'Period': return 'text-red-600'
    case 'Fertile Window': return 'text-blue-600'
    case 'PMS Phase': return 'text-purple-600'
    case 'Regular Phase': return 'text-gray-600'
    default: return 'text-muted-foreground'
  }
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

function getMoodColor(mood: string) {
  const colorMap: Record<string, string> = {
    'Happy': 'bg-green-500',
    'Sad': 'bg-red-500',
    'Tired': 'bg-blue-500',
    'Energetic': 'bg-purple-500',
    'Calm': 'bg-yellow-500',
    'Stressed': 'bg-orange-500',
    'Active': 'bg-teal-500',
    'Sick': 'bg-pink-500'
  }
  return colorMap[mood] || 'bg-gray-500'
}

function previousMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

function quickLogToday() {
  if (todayLog.value) {
    // Navigate to edit existing log
    navigateTo('/log')
  } else {
    // Navigate to create new log
    navigateTo('/log')
  }
}

function editSelectedDate() {
  const dateStr = new Date(selectedDate.value.toDate(getLocalTimeZone())).toISOString().slice(0, 10)
  // Navigate to log page with selected date
  navigateTo(`/log?date=${dateStr}`)
}

function exportData() {
  const data = cycleStore.exportData()
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `cycle-data-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
  toast.success('Data exported successfully')
}

function shareCalendar() {
  // Implement calendar sharing functionality
  toast.info('Calendar sharing feature coming soon!')
}

function generateReport() {
  // Implement report generation
  toast.info('Report generation feature coming soon!')
}

// Event handlers
function onDateSelect(date: DateValue) {
  selectedDate.value = date
  const dateStr = new Date(date.toDate(getLocalTimeZone())).toISOString().slice(0, 10)
  const log = cycleStore.dailyLogs[dateStr]
  
  if (log) {
    showDateDetail.value = true
  } else {
    // Quick log creation
    navigateTo(`/log?date=${dateStr}`)
  }
}

onMounted(() => {
  // Initialize any additional setup
})
</script>

<style scoped>
.cycle-calendar {
  position: relative;
}

.cycle-calendar :deep(.calendar-grid) {
  position: relative;
}

.cycle-calendar :deep(.calendar-cell) {
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cycle-calendar :deep(.calendar-cell:hover) {
  background-color: hsl(var(--accent) / 0.1);
  transform: scale(1.05);
}

.cycle-calendar :deep(.calendar-cell.selected) {
  background-color: hsl(var(--primary) / 0.2);
  border-color: hsl(var(--primary));
}
</style> 