<template>
  <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-100 mb-6">
    <!-- Breadcrumbs -->
    <nav class="text-sm text-gray-500 mb-4">
      <NuxtLink to="/" class="hover:text-black">Home</NuxtLink>
      <span class="mx-2">/</span>
      <span class="text-gray-900 font-medium">{{ spotName }}</span>
    </nav>

    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
      <div>
        <h1 class="text-4xl font-black mb-1 capitalize">{{ spotName }}</h1>
        <p class="text-gray-500">New Jersey • Buoy: 44065</p>
      </div>
      <div class="mt-4 md:mt-0">
        <span class="text-sm text-gray-500">Current Rating</span>
        <!-- Placeholder for rating component if needed -->
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
        <p class="text-3xl font-black">{{ current.wind.speed }}<span class="text-lg font-normal text-gray-500 ml-1">mph</span> <span class="text-lg font-bold">{{ current.wind.direction }}</span></p>
      </div>
      <div>
        <p class="text-sm text-gray-500 mb-1">Water Temp</p>
        <p class="text-3xl font-black">{{ current.temp }}<span class="text-lg font-normal text-gray-500 ml-1">°F</span></p>
      </div>
    </div>

    <div class="text-xs text-gray-400 mb-6">
      Last updated: {{ new Date().toLocaleString() }}
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
defineProps({
  spotName: {
    type: String,
    required: true
  },
  current: {
    type: Object,
    required: true
  }
})
</script>
