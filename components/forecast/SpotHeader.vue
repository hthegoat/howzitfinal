<template>
  <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-100 mb-6">
    <!-- Breadcrumbs -->
    <nav class="text-sm text-gray-500 mb-4">
      <NuxtLink to="/" class="hover:text-black">Home</NuxtLink>
      <span class="mx-2">/</span>
      <NuxtLink to="/spots" class="hover:text-black">Spots</NuxtLink>
      <span class="mx-2">/</span>
      <span class="text-gray-900 font-medium">{{ spotName }}</span>
    </nav>

    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
      <div>
        <h1 class="text-4xl font-black mb-1 capitalize">{{ spotName }}</h1>
        <p class="text-gray-500">{{ region }} • Buoy: {{ buoyId }}</p>
      </div>
      <div class="mt-4 md:mt-0 text-right">
        <span class="text-sm text-gray-500 block mb-1">Current Rating</span>
        <div class="flex items-center gap-2 justify-end">
          <Starrating :rating="rating" />
          <span class="text-sm font-medium text-gray-700">{{ ratingLabel }}</span>
        </div>
      </div>
    </div>

    <!-- Metrics Grid -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
      <div>
        <p class="text-sm text-gray-500 mb-1">Wave Height</p>
        <p class="text-3xl font-black">{{ current.height }}<span class="text-lg font-normal text-gray-500 ml-1">ft</span></p>
      </div>
      <div>
        <p class="text-sm text-gray-500 mb-1">Period</p>
        <p class="text-3xl font-black">{{ current.period }}<span class="text-lg font-normal text-gray-500 ml-1">s</span></p>
      </div>
      <div>
        <p class="text-sm text-gray-500 mb-1">Wind</p>
        <div class="flex items-center gap-2">
          <p class="text-3xl font-black">{{ current.wind.speed }}<span class="text-lg font-normal text-gray-500 ml-1">mph</span></p>
          <Windarrow :degrees="current.wind.degrees" :speed="Number(current.wind.speed)" />
        </div>
        <p class="text-sm text-gray-500">{{ current.wind.direction }}</p>
      </div>
      <div>
        <p class="text-sm text-gray-500 mb-1">Water Temp</p>
        <p class="text-3xl font-black">{{ current.temp }}<span class="text-lg font-normal text-gray-500 ml-1">°F</span></p>
      </div>
    </div>

    <div class="text-xs text-gray-400 mb-6">
      Last updated: {{ formatTimestamp(timestamp) }}
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-4">
      <button class="flex-grow bg-black text-white font-bold py-3 px-6 rounded hover:bg-gray-800 transition-colors">
        Post Report
      </button>
      <button class="text-gray-900 font-bold py-3 px-6 rounded border border-transparent hover:bg-gray-50 transition-colors">
        Set Alert
      </button>
    </div>
  </div>
</template>

<script setup>
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