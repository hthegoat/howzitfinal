<template>
  <div class="w-full h-full relative">
    <canvas ref="chartCanvas"></canvas>
    
    <!-- Current time indicator line -->
    <div 
      v-if="showNowLine"
      class="absolute top-0 w-0.5 bg-red-500 pointer-events-none z-10"
      :style="{ left: nowLinePosition, height: 'calc(100% - 25px)' }"
    >
      <div class="absolute -top-0.5 -left-[3px] w-2 h-2 bg-red-500 rounded-full"></div>
      <div class="absolute -bottom-4 -left-3 text-[10px] font-bold text-red-500">NOW</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const props = defineProps({
  tides: {
    type: Array,
    default: () => []
  }
})

const chartCanvas = ref(null)
let chartInstance = null

// Calculate current time position
const nowLinePosition = computed(() => {
  const now = new Date()
  const hours = now.getHours() + now.getMinutes() / 60
  const percent = (hours / 24) * 100
  // Adjust for chart padding (roughly 45px left, 15px right)
  return `calc(${percent}% * 0.88 + 45px)`
})

const showNowLine = computed(() => {
  const now = new Date()
  const hours = now.getHours()
  return hours >= 0 && hours < 24
})

// Get today's tides
const getTodayTides = (tides) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  return (tides || [])
    .filter(t => {
      const tideDate = new Date(t.timestamp)
      return tideDate >= today && tideDate < tomorrow
    })
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
}

// Generate smooth tide curve from HIGH/LOW points
const generateTideCurve = (tides) => {
  const labels = []
  const data = []
  const pointColors = []
  const pointRadii = []
  
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const todayTides = getTodayTides(tides)

  // Create a map of tide times to their data
  const tideHours = new Map()
  todayTides.forEach(t => {
    const hour = new Date(t.timestamp).getHours()
    tideHours.set(hour, t)
  })

  // Generate hourly points
  for (let hour = 0; hour < 24; hour++) {
    labels.push(formatHour(hour))
    
    const time = new Date(today)
    time.setHours(hour)
    
    if (todayTides.length >= 2) {
      data.push(interpolateTideHeight(time, todayTides))
    } else {
      // Placeholder sine wave
      data.push(3 + 1.5 * Math.sin((hour / 6) * Math.PI - Math.PI / 2))
    }

    // Highlight HIGH/LOW points
    if (tideHours.has(hour)) {
      const tide = tideHours.get(hour)
      pointColors.push(tide.type === 'HIGH' ? '#3B82F6' : '#6B7280')
      pointRadii.push(6)
    } else {
      pointColors.push('transparent')
      pointRadii.push(0)
    }
  }

  return { labels, data, pointColors, pointRadii, todayTides }
}

// Cosine interpolation between tide points
const interpolateTideHeight = (time, tides) => {
  const timeMs = time.getTime()
  
  let before = null
  let after = null
  
  for (const tide of tides) {
    const tideTime = new Date(tide.timestamp).getTime()
    if (tideTime <= timeMs) before = tide
    if (tideTime >= timeMs && !after) after = tide
  }

  if (!before && after) return after.height
  if (before && !after) return before.height
  if (!before && !after) return 3

  const beforeTime = new Date(before.timestamp).getTime()
  const afterTime = new Date(after.timestamp).getTime()
  const t = (timeMs - beforeTime) / (afterTime - beforeTime)
  const cosT = (1 - Math.cos(t * Math.PI)) / 2
  
  return before.height + (after.height - before.height) * cosT
}

const formatHour = (hour) => {
  if (hour === 0 || hour === 24) return '12a'
  if (hour === 12) return '12p'
  if (hour < 12) return `${hour}a`
  return `${hour - 12}p`
}

const createChart = () => {
  if (!chartCanvas.value) return
  if (chartInstance) chartInstance.destroy()

  const { labels, data, pointColors, pointRadii, todayTides } = generateTideCurve(props.tides)
  const ctx = chartCanvas.value.getContext('2d')

  // Gradient fill
  const gradient = ctx.createLinearGradient(0, 0, 0, 180)
  gradient.addColorStop(0, 'rgba(59, 130, 246, 0.35)')
  gradient.addColorStop(1, 'rgba(59, 130, 246, 0.02)')

  // Map tide hours for tooltip
  const tideHoursMap = new Map()
  todayTides.forEach(t => {
    const hour = new Date(t.timestamp).getHours()
    tideHoursMap.set(hour, t)
  })

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        data,
        borderColor: '#3B82F6',
        backgroundColor: gradient,
        borderWidth: 2.5,
        fill: true,
        tension: 0.4,
        pointRadius: pointRadii,
        pointBackgroundColor: pointColors,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: '#3B82F6',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: true,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleFont: { size: 12, weight: 'bold' },
          bodyFont: { size: 14 },
          padding: 10,
          cornerRadius: 6,
          displayColors: false,
          callbacks: {
            title: (items) => {
              const hour = items[0].dataIndex
              const tide = tideHoursMap.get(hour)
              if (tide) {
                return `${tide.type} TIDE`
              }
              return formatHour(hour)
            },
            label: (ctx) => {
              return `${ctx.raw.toFixed(1)} ft`
            }
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            font: { size: 10 },
            color: '#9CA3AF',
            maxRotation: 0,
            callback: function(val, index) {
              // Show every 4 hours: 12a, 4a, 8a, 12p, 4p, 8p
              return index % 4 === 0 ? this.getLabelForValue(val) : ''
            }
          }
        },
        y: {
          min: 0,
          max: 6,
          grid: { 
            color: '#F3F4F6',
            drawBorder: false
          },
          ticks: {
            font: { size: 10 },
            color: '#9CA3AF',
            stepSize: 2,
            callback: (val) => `${val}ft`
          }
        }
      },
      onHover: (event, elements) => {
        const canvas = event.native.target
        canvas.style.cursor = elements.length ? 'pointer' : 'default'
      }
    }
  })
}

onMounted(() => createChart())
onUnmounted(() => { if (chartInstance) chartInstance.destroy() })
watch(() => props.tides, () => createChart(), { deep: true })
</script>