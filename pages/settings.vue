<template>
  <div class="min-h-screen">
    <!-- Header -->
    <div class="p-6">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-12 h-12 flex items-center justify-center">
          <SettingsIcon class="w-6 h-6" />
        </div>
        <div>
          <h1 class="text-xl font-bold">Settings</h1>
          <p class="text-sm">Customize your experience</p>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="px-4 space-y-4">
      <!-- Profile Section -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <UserIcon class="w-5 h-5" />
            Profile Settings
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-6">
          <!-- Last Period Date -->
          <div class="space-y-3">
            <Label for="lastPeriod" class="font-medium">Last Period Start Date</Label>
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
                />
              </PopoverContent>
            </Popover>
          </div>

          <!-- Cycle Length -->
          <div class="space-y-3">
            <Label for="cycleLength" class="font-medium">Average Cycle Length (days)</Label>
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
          </div>

          <!-- Period Length -->
          <div class="space-y-3">
            <Label for="periodLength" class="font-medium">Average Period Length (days)</Label>
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
        </CardContent>
      </Card>

      <!-- Notifications -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <BellIcon class="w-5 h-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="flex items-center justify-between p-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 flex items-center justify-center">
                <CalendarIcon class="w-5 h-5" />
              </div>
              <div>
                <p class="font-medium">Period Reminders</p>
                <p class="text-sm">Get notified before your period</p>
              </div>
            </div>
            <Switch v-model="periodReminders" />
          </div>

          <div class="flex items-center justify-between p-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 flex items-center justify-center">
                <TargetIcon class="w-5 h-5" />
              </div>
              <div>
                <p class="font-medium">Fertile Window Alerts</p>
                <p class="text-sm">Reminders for fertile days</p>
              </div>
            </div>
            <Switch v-model="fertileAlerts" />
          </div>

          <div class="flex items-center justify-between p-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 flex items-center justify-center">
                <AlertTriangleIcon class="w-5 h-5" />
              </div>
              <div>
                <p class="font-medium">PMS Warnings</p>
                <p class="text-sm">Alerts before PMS symptoms</p>
              </div>
            </div>
            <Switch v-model="pmsWarnings" />
          </div>

          <div class="flex items-center justify-between p-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 flex items-center justify-center">
                <BookOpenIcon class="w-5 h-5" />
              </div>
              <div>
                <p class="font-medium">Daily Log Reminders</p>
                <p class="text-sm">Remind me to log daily</p>
              </div>
            </div>
            <Switch v-model="dailyLogReminders" />
          </div>
        </CardContent>
      </Card>

      <!-- App Preferences -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <PaletteIcon class="w-5 h-5" />
            App Preferences
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="flex items-center justify-between p-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 flex items-center justify-center">
                <MoonIcon class="w-5 h-5" />
              </div>
              <div>
                <p class="font-medium">Dark Mode</p>
                <p class="text-sm">Use dark theme</p>
              </div>
            </div>
            <Switch v-model="darkMode" />
          </div>

          <div class="flex items-center justify-between p-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 flex items-center justify-center">
                <GlobeIcon class="w-5 h-5" />
              </div>
              <div>
                <p class="font-medium">Language</p>
                <p class="text-sm">English</p>
              </div>
            </div>
            <ChevronRightIcon class="w-5 h-5" />
          </div>
        </CardContent>
      </Card>

      <!-- Data & Privacy -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <ShieldIcon class="w-5 h-5" />
            Data & Privacy
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="flex items-center justify-between p-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 flex items-center justify-center">
                <DownloadIcon class="w-5 h-5" />
              </div>
              <div>
                <p class="font-medium">Export Data</p>
                <p class="text-sm">Download your data</p>
              </div>
            </div>
            <Button 
              @click="exportData"
              variant="outline" 
              size="sm"
            >
              Export
            </Button>
          </div>

          <div class="flex items-center justify-between p-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 flex items-center justify-center">
                <Trash2Icon class="w-5 h-5" />
              </div>
              <div>
                <p class="font-medium">Clear All Data</p>
                <p class="text-sm">Delete all your data</p>
              </div>
            </div>
            <Button 
              @click="clearAllData"
              variant="outline" 
              size="sm"
            >
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      <!-- About -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <InfoIcon class="w-5 h-5" />
            About
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="flex items-center justify-between p-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 flex items-center justify-center">
                <FileTextIcon class="w-5 h-5" />
              </div>
              <div>
                <p class="font-medium">Privacy Policy</p>
                <p class="text-sm">Read our privacy policy</p>
              </div>
            </div>
            <ChevronRightIcon class="w-5 h-5" />
          </div>

          <div class="flex items-center justify-between p-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 flex items-center justify-center">
                <HelpCircleIcon class="w-5 h-5" />
              </div>
              <div>
                <p class="font-medium">Help & Support</p>
                <p class="text-sm">Get help and support</p>
              </div>
            </div>
            <ChevronRightIcon class="w-5 h-5" />
          </div>

          <div class="text-center p-4">
            <p class="text-sm">Cycle Companion v1.0.0</p>
            <p class="text-xs mt-1">Made with ❤️ for your wellness</p>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { type DateValue, getLocalTimeZone, today } from '@internationalized/date'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { useCycleStore } from '@/stores/cycle'
import { toast } from 'sonner'
import { 
  SettingsIcon, UserIcon, CalendarIcon, BellIcon, TargetIcon, AlertTriangleIcon,
  BookOpenIcon, PaletteIcon, MoonIcon, GlobeIcon, ChevronRightIcon, ShieldIcon,
  DownloadIcon, Trash2Icon, InfoIcon, FileTextIcon, HelpCircleIcon
} from 'lucide-vue-next'

const cycleStore = useCycleStore()

// Form data - use DateValue type for Calendar component
const lastPeriodDate = ref<DateValue | undefined>(undefined)

// Initialize the date if it exists in store
if (cycleStore.lastPeriod) {
  try {
    const date = new Date(cycleStore.lastPeriod)
    // Convert JavaScript Date to DateValue using today() as base and adjusting
    const todayDate = today(getLocalTimeZone())
    const targetDate = todayDate.add({ days: Math.floor((date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) })
    lastPeriodDate.value = targetDate
  } catch (error) {
    console.error('Error parsing last period date:', error)
  }
}
const cycleLength = ref(cycleStore.cycleLength?.toString() || '28')
const periodLength = ref(cycleStore.periodLength?.toString() || '5')

// Notification settings
const periodReminders = ref(true)
const fertileAlerts = ref(true)
const pmsWarnings = ref(true)
const dailyLogReminders = ref(true)

// App preferences
const darkMode = ref(false)

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

// Export data function
function exportData() {
  try {
    const data = cycleStore.exportData()
    const dataStr = JSON.stringify(data, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    
    const link = document.createElement('a')
    link.href = URL.createObjectURL(dataBlob)
    link.download = `cycle-companion-data-${new Date().toISOString().slice(0, 10)}.json`
    link.click()
    
    toast.success('Data exported successfully!')
  } catch (error) {
    toast.error('Failed to export data. Please try again.')
  }
}

// Clear all data function
function clearAllData() {
  if (confirm('Are you sure you want to delete all your data? This action cannot be undone.')) {
    try {
      cycleStore.clearAllData()
      
      // Reset form values
      lastPeriodDate.value = undefined
      cycleLength.value = '28'
      periodLength.value = '5'
      periodReminders.value = true
      fertileAlerts.value = true
      pmsWarnings.value = true
      dailyLogReminders.value = true
      darkMode.value = false
      
      toast.success('All data cleared successfully!')
    } catch (error) {
      toast.error('Failed to clear data. Please try again.')
    }
  }
}

// Watch for changes and update store
watch(lastPeriodDate, (newDateValue) => {
  if (newDateValue) {
    // Convert DateValue to JavaScript Date, then to ISO string
    const date = newDateValue.toDate(getLocalTimeZone())
    cycleStore.setLastPeriod(date.toISOString().slice(0, 10))
    toast.success('Last period date updated!')
  }
})

watch(cycleLength, (newLength) => {
  cycleStore.setCycleLength(parseInt(newLength))
  toast.info('Cycle length updated!')
})

watch(periodLength, (newLength) => {
  cycleStore.setPeriodLength(parseInt(newLength))
  toast.info('Period length updated!')
})

// Watch notification settings
watch(periodReminders, (enabled) => {
  toast.info(`Period reminders ${enabled ? 'enabled' : 'disabled'}`)
})

watch(fertileAlerts, (enabled) => {
  toast.info(`Fertile window alerts ${enabled ? 'enabled' : 'disabled'}`)
})

watch(pmsWarnings, (enabled) => {
  toast.info(`PMS warnings ${enabled ? 'enabled' : 'disabled'}`)
})

watch(dailyLogReminders, (enabled) => {
  toast.info(`Daily log reminders ${enabled ? 'enabled' : 'disabled'}`)
})

watch(darkMode, (enabled) => {
  toast.info(`Dark mode ${enabled ? 'enabled' : 'disabled'}`)
})
</script> 