import { defineStore } from 'pinia'

interface DailyLog {
  mood?: string
  symptoms?: string[]
  notes?: string
  date: string
}

export const useCycleStore = defineStore('cycle', {
  state: () => ({
    lastPeriod: null as string | null,
    cycleLength: 28 as number,
    periodLength: 5 as number,
    dailyLogs: {} as Record<string, DailyLog>,
    notificationsEnabled: true as boolean
  }),

  getters: {
    nextPeriod: (state) => {
      if (!state.lastPeriod) return null
      const d = new Date(state.lastPeriod)
      d.setDate(d.getDate() + state.cycleLength)
      return d.toISOString().slice(0, 10)
    },

    fertileWindow: (state) => {
      if (!state.lastPeriod) return null
      const d = new Date(state.lastPeriod)
      d.setDate(d.getDate() + state.cycleLength - 14)
      const start = new Date(d)
      d.setDate(d.getDate() + 5)
      return {
        start: start.toISOString().slice(0, 10),
        end: d.toISOString().slice(0, 10)
      }
    },

    pmsPhase: (state) => {
      if (!state.lastPeriod) return null
      const d = new Date(state.lastPeriod)
      d.setDate(d.getDate() + state.cycleLength - 7)
      const start = new Date(d)
      d.setDate(d.getDate() + 5)
      return {
        start: start.toISOString().slice(0, 10),
        end: d.toISOString().slice(0, 10)
      }
    }
  },

  actions: {
    // Initialize store from localStorage
    initializeStore() {
      if (process.client) {
        const saved = localStorage.getItem('cycle-companion-data')
        if (saved) {
          try {
            const data = JSON.parse(saved)
            this.lastPeriod = data.lastPeriod || null
            this.cycleLength = data.cycleLength || 28
            this.periodLength = data.periodLength || 5
            this.dailyLogs = data.dailyLogs || {}
            this.notificationsEnabled = data.notificationsEnabled !== false
          } catch (error) {
            console.error('Error loading saved data:', error)
          }
        }
      }
    },

    // Save data to localStorage
    saveToStorage() {
      if (process.client) {
        const data = {
          lastPeriod: this.lastPeriod,
          cycleLength: this.cycleLength,
          periodLength: this.periodLength,
          dailyLogs: this.dailyLogs,
          notificationsEnabled: this.notificationsEnabled
        }
        localStorage.setItem('cycle-companion-data', JSON.stringify(data))
      }
    },

    setLastPeriod(date: string) {
      this.lastPeriod = date
      this.saveToStorage()
    },

    setCycleLength(length: number) {
      this.cycleLength = length
      this.saveToStorage()
    },

    setPeriodLength(length: number) {
      this.periodLength = length
      this.saveToStorage()
    },

    addDailyLog(date: string, log: DailyLog) {
      this.dailyLogs[date] = log
      this.saveToStorage()
    },

    getDailyLog(date: string) {
      return this.dailyLogs[date] || null
    },

    setNotificationsEnabled(enabled: boolean) {
      this.notificationsEnabled = enabled
      this.saveToStorage()
    },

    // Clear all data
    clearAllData() {
      this.lastPeriod = null
      this.cycleLength = 28
      this.periodLength = 5
      this.dailyLogs = {}
      this.notificationsEnabled = true
      if (process.client) {
        localStorage.removeItem('cycle-companion-data')
      }
    },

    // Export data
    exportData() {
      return {
        lastPeriod: this.lastPeriod,
        cycleLength: this.cycleLength,
        periodLength: this.periodLength,
        dailyLogs: this.dailyLogs,
        notificationsEnabled: this.notificationsEnabled,
        exportDate: new Date().toISOString()
      }
    },

    // Import data
    importData(data: any) {
      try {
        this.lastPeriod = data.lastPeriod || null
        this.cycleLength = data.cycleLength || 28
        this.periodLength = data.periodLength || 5
        this.dailyLogs = data.dailyLogs || {}
        this.notificationsEnabled = data.notificationsEnabled !== false
        this.saveToStorage()
        return true
      } catch (error) {
        console.error('Error importing data:', error)
        return false
      }
    }
  }
}) 