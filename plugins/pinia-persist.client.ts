export default defineNuxtPlugin(() => {
  const cycleStore = useCycleStore()
  
  // Initialize store with saved data
  cycleStore.initializeStore()
}) 