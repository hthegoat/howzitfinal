<template>
  <div 
    class="bg-white p-6 border-2 border-black mb-6"
    :style="{ borderTopColor: ratingBorderColor, borderTopWidth: '4px' }"
  >
    <!-- Breadcrumbs -->
    <nav class="text-sm text-gray-500 mb-4 font-mono">
      <NuxtLink to="/" class="hover:text-black">Home</NuxtLink>
      <span class="mx-2">/</span>
      <NuxtLink to="/spots" class="hover:text-black">Spots</NuxtLink>
      <span class="mx-2">/</span>
      <span class="text-gray-900 font-medium">{{ spotName }}</span>
    </nav>

    <!-- Title + Rating on same line -->
    <div class="flex flex-wrap items-center gap-3 mb-2">
      <h1 class="text-4xl font-black uppercase tracking-tight">{{ spotName }}</h1>
      <div class="flex items-center gap-2">
        <Starrating :rating="rating" />
        <span class="text-sm font-bold uppercase" :class="ratingColorClass">{{ ratingLabel }}</span>
      </div>
    </div>
    
    <p class="text-gray-500 mb-8 font-mono text-sm">{{ region }} • Buoy: {{ buoyId }}</p>

    <!-- Metrics Grid -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-6">
      <div>
        <p class="text-xs text-gray-500 mb-1 uppercase tracking-wide">Wave Height</p>
        <p class="text-3xl font-black">{{ current.height }}<span class="text-lg font-normal text-gray-500 ml-1">ft</span></p>
      </div>
      <div>
        <p class="text-xs text-gray-500 mb-1 uppercase tracking-wide">Period</p>
        <p class="text-3xl font-black">{{ current.period }}<span class="text-lg font-normal text-gray-500 ml-1">s</span></p>
      </div>
      <div>
        <p class="text-xs text-gray-500 mb-1 uppercase tracking-wide">Wind</p>
        <div class="flex items-center gap-2">
          <p class="text-3xl font-black">{{ current.wind.speed }}<span class="text-lg font-normal text-gray-500 ml-1">mph</span></p>
          <Windarrow :degrees="current.wind.degrees" :speed="Number(current.wind.speed)" />
        </div>
        <p class="text-sm text-gray-500">{{ current.wind.direction }}</p>
      </div>
      <div>
        <p class="text-xs text-gray-500 mb-1 uppercase tracking-wide">Water Temp</p>
        <p class="text-3xl font-black">{{ current.temp }}<span class="text-lg font-normal text-gray-500 ml-1">°F</span></p>
      </div>
    </div>

    <div class="text-xs text-gray-400 font-mono">
      Last updated: {{ formatTimestamp(timestamp) }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  spotName: {
    type: String,
    required: true
  },
  region: {
    type: String,
    default: ''
  },
  buoyId: {
    type: String,
    default: ''
  },
  current: {
    type: Object,
    required: true
  },
  rating: {
    type: Number,
    default: 0
  },
  ratingLabel: {
    type: String,
    default: 'Unknown'
  },
  timestamp: {
    type: String,
    default: null
  }
})

const ratingBorderColor = computed(() => {
  const r = props.rating
  if (r >= 4.5) return '#22c55e'
  if (r >= 3.5) return '#4ade80'
  if (r >= 2.5) return '#a3e635'
  if (r >= 1.5) return '#facc15'
  if (r >= 0.5) return '#fb923c'
  return '#f87171'
})

const ratingColorClass = computed(() => {
  if (props.rating >= 4) return 'text-emerald-600'
  if (props.rating >= 3) return 'text-green-600'
  if (props.rating >= 2) return 'text-yellow-600'
  if (props.rating >= 1) return 'text-orange-500'
  return 'text-gray-500'
})

const formatTimestamp = (ts) => {
  if (!ts) return 'N/A'
  return new Date(ts).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  })
}
</script>