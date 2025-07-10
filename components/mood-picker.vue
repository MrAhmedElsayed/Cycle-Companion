<template>
  <div class="flex flex-wrap gap-2">
    <button v-for="mood in moods" :key="mood.label" @click="$emit('select', mood)" type="button"
      class="rounded-full border px-3 py-1 text-lg bg-background hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring">
      <span>{{ mood.emoji }}</span>
      <span class="sr-only">{{ mood.label }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
const moods = [
  { emoji: '😊', label: 'Happy' },
  { emoji: '😢', label: 'Sad' },
  { emoji: '😡', label: 'Irritable' },
  { emoji: '😴', label: 'Tired' },
  { emoji: '🤕', label: 'Cramp' },
  { emoji: '🤢', label: 'Nausea' },
  { emoji: '😌', label: 'Calm' },
  { emoji: '😖', label: 'Bloated' },
]
</script> 