<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <AppHeader />
    
    <main class="flex-grow container mx-auto px-4 py-8">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <h2 class="text-2xl font-bold text-red-600 mb-2">Oops!</h2>
        <p class="text-gray-600">{{ error }}</p>
        <button @click="refresh" class="mt-4 px-4 py-2 bg-black text-white rounded">Try Again</button>
      </div>

      <!-- Content -->
      <template v-else-if="forecastData">
        <SpotHeader :spot-name="forecastData.spot.name" :current="forecastData.forecast.current" />

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Main Content (Left Column) -->
          <div class="lg:col-span-2 space-y-6">
            <LiveReports />

            <!-- Forecast Chart -->
            <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <h3 class="font-bold text-xl mb-6">5-Day Forecast</h3>
              <div class="h-80 w-full relative">
                <canvas ref="chartCanvas"></canvas>
              </div>
              <div class="mt-4 text-center text-sm text-gray-500">
                Multi-day forecast integration in progress
              </div>
            </div>
          </div>

          <!-- Sidebar (Right Column) -->
          <div class="space-y-6">
            <SpotInfo :spot="forecastData.spot" />
            <Hazards :hazards="forecastData.spot.hazards" />
            <NearbySpots />
          </div>
        </div>
      </template>
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useForecast } from '~/composables/useForecast'
import {
  Chart,
  LineController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js'

Chart.register(
  LineController,
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Filler,
  Tooltip,
  Legend
)

const route = useRoute()
const spotSlug = route.params.spot

const { useSpotForecast } = useForecast()
const { forecast: forecastData, loading, error, refresh } = useSpotForecast(spotSlug)

const chartCanvas = ref(null)
let chartInstance = null

// SEO
useHead({
  title: computed(() => forecastData.value ? `${forecastData.value.spot.name} - Howzit Forecast` : 'Loading...'),
  meta: [
    { name: 'description', content: computed(() => forecastData.value ? `Real-time surf forecast for ${forecastData.value.spot.name}` : 'Loading...') }
  ]
})

const initChart = () => {
  if (!chartCanvas.value || !forecastData.value) return

  const ctx = chartCanvas.value.getContext('2d')
  const { hours, heights } = forecastData.value.forecast

  if (chartInstance) {
    chartInstance.destroy()
  }

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: hours,
      datasets: [{
        label: 'Wave Height (ft)',
        data: heights,
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.15)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: 'index',
      },
      plugins: {
        legend: { display: false },
        tooltip: { 
          enabled: true,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleFont: { family: 'Inter', size: 13 },
          bodyFont: { family: 'Inter', size: 13 },
          padding: 10,
          cornerRadius: 4,
          displayColors: false
        }
      },
      scales: {
        x: {
          display: true,
          grid: { display: false },
          ticks: {
            color: '#9ca3af',
            font: { size: 10, family: 'Inter' },
            callback: function(val) {
              const h = hours[val]
              if (h === 0) return '12am'
              if (h === 6) return '6am'
              if (h === 12) return '12pm'
              if (h === 18) return '6pm'
              if (h === 24) return '12am'
              return ''
            }
          },
          border: { display: false }
        },
        y: {
          display: true,
          min: 0,
          max: Math.max(...heights) + 2,
          grid: {
            color: '#f3f4f6',
            borderDash: [4, 4]
          },
          ticks: {
            color: '#9ca3af',
            font: { size: 10, family: 'Inter' },
            stepSize: 2
          },
          border: { display: false }
        }
      }
    }
  })
}

// Watch for data changes to init/update chart
watch(forecastData, (newData) => {
  if (newData) {
    // Small delay to ensure canvas is rendered
    setTimeout(initChart, 100)
  }
})

onMounted(() => {
  if (forecastData.value) {
    initChart()
  }
})

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy()
  }
})
</script>