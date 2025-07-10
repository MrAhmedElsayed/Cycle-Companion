<template>
  <div class="min-h-screen">
    <!-- Header -->
    <div class="p-6">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-12 h-12 flex items-center justify-center">
          <CalendarIcon class="w-6 h-6" />
        </div>
        <div>
          <h1 class="text-xl font-bold">Calendar</h1>
          <p class="text-sm">Track your cycle</p>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="px-4 space-y-4">
      <!-- Calendar View -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <CalendarIcon class="w-5 h-5" />
            Cycle Calendar
          </CardTitle>
          <p class="text-sm">View your cycle phases and predictions</p>
        </CardHeader>
        <CardContent>
          <Calendar
            v-model="selectedDate"
            :weekday-format="'short'"
            class="w-full"
          />
        </CardContent>
      </Card>

      <!-- Cycle Overview -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <TargetIcon class="w-5 h-5" />
            Cycle Overview
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="p-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 flex items-center justify-center">
                  <CalendarIcon class="w-5 h-5" />
                </div>
                <div>
                  <p class="text-sm">Current Day</p>
                  <p class="text-lg font-bold">{{ currentDay }}</p>
                </div>
              </div>
            </div>

            <div class="p-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 flex items-center justify-center">
                  <TargetIcon class="w-5 h-5" />
                </div>
                <div>
                  <p class="text-sm">Phase</p>
                  <p class="text-lg font-bold">{{ currentPhase }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="p-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 flex items-center justify-center">
                <ClockIcon class="w-5 h-5" />
              </div>
              <div>
                <p class="text-sm">Next Period</p>
                <p class="text-lg font-bold">{{ nextPeriodDate }}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Phase Information -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <InfoIcon class="w-5 h-5" />
            Current Phase Info
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div class="p-4">
              <h3 class="font-semibold mb-2">{{ currentPhase }}</h3>
              <p class="text-sm leading-relaxed">
                {{ getPhaseDescription(currentPhase) }}
              </p>
            </div>

            <div v-if="currentPhase === 'Fertile Window'" class="p-4">
              <h4 class="font-medium mb-2">Fertility Tips:</h4>
              <ul class="text-sm space-y-1">
                <li>• Track your basal body temperature</li>
                <li>• Monitor cervical mucus changes</li>
                <li>• Consider using ovulation tests</li>
              </ul>
            </div>

            <div v-if="currentPhase === 'PMS'" class="p-4">
              <h4 class="font-medium mb-2">Self-Care Tips:</h4>
              <ul class="text-sm space-y-1">
                <li>• Practice gentle exercise</li>
                <li>• Maintain a healthy diet</li>
                <li>• Get adequate sleep</li>
                <li>• Consider magnesium supplements</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Monthly Stats -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <BarChart3Icon class="w-5 h-5" />
            Monthly Statistics
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="p-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 flex items-center justify-center">
                  <TrendingUpIcon class="w-5 h-5" />
                </div>
                <div>
                  <p class="text-sm">Logs This Month</p>
                  <p class="text-lg font-bold">{{ monthlyLogs }}</p>
                </div>
              </div>
            </div>

            <div class="p-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 flex items-center justify-center">
                  <SmileIcon class="w-5 h-5" />
                </div>
                <div>
                  <p class="text-sm">Most Common Mood</p>
                  <p class="text-lg font-bold">{{ mostCommonMood }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="p-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 flex items-center justify-center">
                <AlertTriangleIcon class="w-5 h-5" />
              </div>
              <div>
                <p class="text-sm">Most Common Symptom</p>
                <p class="text-lg font-bold">{{ mostCommonSymptom }}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Quick Actions -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <ZapIcon class="w-5 h-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-3">
          <NuxtLink to="/log" class="block">
            <div class="flex items-center justify-between p-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 flex items-center justify-center">
                  <PlusCircleIcon class="w-5 h-5" />
                </div>
                <div>
                  <p class="font-medium">Log Today's Entry</p>
                  <p class="text-sm">Record your mood and symptoms</p>
                </div>
              </div>
              <ChevronRightIcon class="w-5 h-5" />
            </div>
          </NuxtLink>

          <div class="flex items-center justify-between p-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 flex items-center justify-center">
                <ShareIcon class="w-5 h-5" />
              </div>
              <div>
                <p class="font-medium">Share Calendar</p>
                <p class="text-sm">Export or share your cycle data</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Share
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { type DateValue, getLocalTimeZone, today } from '@internationalized/date'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Calendar } from '@/components/ui/calendar'
import { Badge } from '@/components/ui/badge'
import { useCycleStore } from '@/stores/cycle'
import { 
  CalendarIcon, PaletteIcon, DropletsIcon, TargetIcon, AlertTriangleIcon,
  ZapIcon, BarChart3Icon, HeartIcon, ClockIcon, ChevronRightIcon, ActivityIcon,
  SettingsIcon, InfoIcon, TrendingUpIcon, SmileIcon, PlusCircleIcon, ShareIcon
} from 'lucide-vue-next'

const cycleStore = useCycleStore()
const selectedDate = ref(today(getLocalTimeZone())) as Ref<DateValue>

// Current month and year
const currentMonth = computed(() => {
  return new Date().toLocaleDateString('en-US', { month: 'long' })
})

const currentYear = computed(() => {
  return new Date().getFullYear()
})

// Monthly logs count
const monthlyLogs = computed(() => {
  const currentMonthStr = new Date().toISOString().slice(0, 7) // YYYY-MM
  return Object.keys(cycleStore.dailyLogs).filter(date => 
    date.startsWith(currentMonthStr)
  ).length
})

// Calculate ovulation date (middle of fertile window)
const ovulationDate = computed(() => {
  if (!cycleStore.fertileWindow) return null
  const start = new Date(cycleStore.fertileWindow.start)
  start.setDate(start.getDate() + 2) // Middle of 5-day fertile window
  return start.toISOString().slice(0, 10)
})

// Current day
const currentDay = computed(() => {
  return new Date(selectedDate.value.toDate(getLocalTimeZone())).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  })
})

// Current phase
const currentPhase = computed(() => {
  if (!cycleStore.lastPeriod) return 'Setup Required'
  const todayDate = new Date(selectedDate.value.toDate(getLocalTimeZone()))
  const lastPeriod = new Date(cycleStore.lastPeriod)
  const cycleLength = cycleStore.cycleLength
  const periodLength = cycleStore.periodLength

  // Calculate days since last period
  const daysSinceLastPeriod = todayDate.getDate() - lastPeriod.getDate()

  if (daysSinceLastPeriod < periodLength) {
    return 'Period'
  } else if (daysSinceLastPeriod < periodLength + 5) {
    return 'Fertile Window'
  } else if (daysSinceLastPeriod < periodLength + 7) {
    return 'PMS'
  } else if (daysSinceLastPeriod < periodLength + 1) {
    return 'Ovulation'
  } else {
    // Reset for next cycle
    return 'Period'
  }
})

// Next period date
const nextPeriodDate = computed(() => {
  if (!cycleStore.lastPeriod) return 'Not set'
  const lastPeriod = new Date(cycleStore.lastPeriod)
  const periodLength = cycleStore.periodLength
  const cycleLength = cycleStore.cycleLength

  // Calculate days until next period
  const daysUntilNextPeriod = periodLength - (new Date().getDate() - lastPeriod.getDate())

  if (daysUntilNextPeriod < 0) {
    // If today is after the last period, calculate for the next cycle
    const nextCycleStart = new Date(lastPeriod)
    nextCycleStart.setDate(nextCycleStart.getDate() + cycleLength)
    return new Date(nextCycleStart).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })
  } else {
    return new Date(lastPeriod).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })
  }
})

// Phase description
const getPhaseDescription = (phase: string) => {
  if (phase === 'Period') {
    return 'Your menstrual cycle is the time from one period to the next. It typically lasts 28 days, but can vary. During this phase, you may experience heavy bleeding, cramping, and mood swings.'
  } else if (phase === 'Fertile Window') {
    return 'This is the most fertile time of your cycle. During this 5-day window, you have the highest chance of getting pregnant. It starts 14 days before ovulation and ends 2 days after ovulation.'
  } else if (phase === 'PMS') {
    return 'This phase typically begins 7 days before your period and lasts for 7 days. It\'s characterized by mood swings, fatigue, and physical symptoms like breast tenderness and bloating.'
  } else if (phase === 'Ovulation') {
    return 'This is the day your egg is released from your ovary. It\'s the peak fertility day. You have the highest chance of getting pregnant on this day.'
  } else {
    return 'Your cycle is in a stable state. Keep tracking your cycle to understand your body better.'
  }
}

// Most common mood
const mostCommonMood = computed(() => {
  const moods = Object.values(cycleStore.dailyLogs).map(log => log.mood)
  const moodCounts: { [key: string]: number } = {}
  moods.forEach(mood => {
    if (mood) {
      moodCounts[mood] = (moodCounts[mood] || 0) + 1
    }
  })
  return Object.entries(moodCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || 'N/A'
})

// Most common symptom
const mostCommonSymptom = computed(() => {
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
  return Object.entries(symptomCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || 'N/A'
})



function formatDate(dateString: string | null) {
  if (!dateString) return 'Not set'
  return new Date(dateString).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  })
}
</script> 