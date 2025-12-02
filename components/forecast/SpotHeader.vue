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

    <!-- Today's Hourly -->
  <!-- Today's Hourly -->
<div v-if="hourlyData && hourlyData.length" class="border-t border-gray-200 pt-4 mb-4">
  
  <!-- Wave Height Row -->
  <div class="mb-4">
    <p class="text-xs text-gray-500 uppercase tracking-wide mb-2">Wave Height (ft)</p>
    <div class="flex justify-between overflow-x-auto gap-1">
      <div 
        v-for="hour in hourlyData.slice(0, 12)" 
        :key="'wave-' + hour.hour"
        class="flex flex-col items-center min-w-[36px]"
      >
        <span class="text-sm font-bold">{{ adjustedWaveHeight(hour.waveHeight) }}</span>
        <span class="text-[10px] text-gray-400 font-mono">{{ formatHourLabel(hour.hour) }}</span>
      </div>
    </div>
  </div>

  <!-- Wind Row -->
  <div>
    <p class="text-xs text-gray-500 uppercase tracking-wide mb-2">Wind</p>
    <div class="flex justify-between overflow-x-auto gap-1">
      <div 
        v-for="hour in hourlyData.slice(0, 12)" 
        :key="'wind-' + hour.hour"
        class="flex flex-col items-center min-w-[36px]"
      >
        <Windarrow 
          :degrees="hour.windDirection" 
          :speed="hour.windSpeed" 
          class="w-5 h-5"
        />
        <span class="text-xs font-mono mt-1">{{ hour.windSpeed }}</span>
        <span class="text-[10px] text-gray-400 font-mono">{{ formatHourLabel(hour.hour) }}</span>
      </div>
    </div>
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
  spotName: { type: String, required: true },
  region: { type: String, default: '' },
  buoyId: { type: String, default: '' },
  current: { type: Object, required: true },
  rating: { type: Number, default: 0 },
  ratingLabel: { type: String, default: 'Unknown' },
  timestamp: { type: String, default: null },
  hourlyData: { type: Array, default: () => [] },
  orientation: { type: Number, default: null }
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

const adjustedWaveHeight = (height) => {
  if (!height) return '--'
  const adjusted = (parseFloat(height) * 0.5).toFixed(1)
  return adjusted
}

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

const renderHeaderChart = () => {
  if (!headerChartRef.value || !props.hourlyData?.length) return
  
  if (headerChart) headerChart.destroy()
  
  const ctx = headerChartRef.value.getContext('2d')
  
  // Color based on wind quality
  const getPointColor = (hour) => {
    // We need orientation to calculate - pass it as a prop
    if (!props.orientation) return '#3b82f6' // default blue
    
    const windDir = hour.windDirection
    if (!windDir) return '#3b82f6'
    
    let diff = Math.abs(windDir - props.orientation)
    if (diff > 180) diff = 360 - diff
    
    if (diff >= 120) return '#22c55e' // green - offshore/clean
    if (diff >= 60) return '#3b82f6'  // blue - cross-shore/fair
    return '#ef4444'                   // red - onshore/choppy
  }
  
  // Create segment colors array
  const colors = props.hourlyData.map(h => getPointColor(h))
  
  headerChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: props.hourlyData.map(h => formatHourLabel(h.hour)),
      datasets: [{
        data: props.hourlyData.map(h => h.waveHeight ? (parseFloat(h.waveHeight) * 0.5).toFixed(1) : null),
        borderColor: '#000',
        borderWidth: 1,
        segment: {
          backgroundColor: (ctx) => {
            const index = ctx.p0DataIndex
            return colors[index] + '80' // add transparency
          }
        },
        backgroundColor: colors.map(c => c + '80'),
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 4,
        pointHoverBackgroundColor: '#000'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { intersect: false, mode: 'index' },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#000',
          titleFont: { family: 'JetBrains Mono', size: 10 },
          bodyFont: { family: 'JetBrains Mono', size: 12, weight: 'bold' },
          padding: 8,
          displayColors: false,
          callbacks: {
            label: (item) => `${item.raw}ft`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 10,
          grid: { color: '#e5e7eb' },
          border: { display: false },
          ticks: {
            font: { family: 'JetBrains Mono', size: 9 },
            stepSize: 2,
            callback: (val) => val + 'ft'
          }
        },
        x: {
          grid: { display: false },
          border: { display: false },
          ticks: {
            font: { family: 'JetBrains Mono', size: 9 },
            maxRotation: 0
          }
        }
      }
    }
  })
}

const formatHourLabel = (hour) => {
  if (hour === 0) return '12a'
  if (hour === 12) return '12p'
  if (hour < 12) return `${hour}a`
  return `${hour - 12}p`
}
</script>

