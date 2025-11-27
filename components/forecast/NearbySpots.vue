<template>
  <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
    <h3 class="font-bold text-lg mb-4">Nearby Spots</h3>
    
    <div class="space-y-3">
      <NuxtLink 
        v-for="spot in filteredSpots" 
        :key="spot.slug"
        :to="`/spots/${spot.slug}`" 
        class="block p-3 border border-black rounded hover:bg-gray-50 transition-colors"
      >
        <div class="font-bold">{{ spot.name }}</div>
        <div class="text-sm text-gray-500">{{ spot.distance }}</div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  spots: {
    type: Array,
    default: () => []
  },
  currentSlug: {
    type: String,
    default: ''
  }
})

const filteredSpots = computed(() => {
  return props.spots.filter(s => s.slug !== props.currentSlug)
})
</script>