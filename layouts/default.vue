<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Main Content -->
    <main class="pb-20">
      <slot />
    </main>

    <!-- Bottom Navigation -->
    <nav class="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700 shadow-lg">
      <div class="flex justify-around items-center h-16 px-4">
        <NuxtLink 
          to="/" 
          class="flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200"
          :class="$route.path === '/' ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20' : 'text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20'"
        >
          <HomeIcon class="w-5 h-5" />
          <span class="text-xs font-medium">Home</span>
        </NuxtLink>

        <NuxtLink 
          to="/calendar" 
          class="flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200"
          :class="$route.path === '/calendar' ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'"
        >
          <CalendarIcon class="w-5 h-5" />
          <span class="text-xs font-medium">Calendar</span>
        </NuxtLink>

        <NuxtLink 
          to="/log" 
          class="flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200"
          :class="$route.path === '/log' ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20' : 'text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20'"
        >
          <PlusCircleIcon class="w-5 h-5" />
          <span class="text-xs font-medium">Log</span>
        </NuxtLink>

        <NuxtLink 
          to="/settings" 
          class="flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200"
          :class="$route.path === '/settings' ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20' : 'text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20'"
        >
          <SettingsIcon class="w-5 h-5" />
          <span class="text-xs font-medium">Settings</span>
        </NuxtLink>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { 
  HomeIcon, CalendarIcon, PlusCircleIcon, SettingsIcon 
} from 'lucide-vue-next'
</script>

<style></style>