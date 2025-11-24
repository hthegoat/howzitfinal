<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader />
    
    <main class="flex-grow container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-6 capitalize">{{ spotName }} Forecast</h1>
      
      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div class="h-96 w-full relative">
          <canvas ref="chartCanvas"></canvas>
        </div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js'

Chart.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Filler,
  Tooltip,
  Legend
)

const route = useRoute()
const spotName = computed(() => route.params.spot?.replace(/-/g, ' ') || 'Surf')

const chartCanvas = ref(null)
let chartInstance = null

// SEO
useHead({
  title: `${spotName.value} - Howzit Forecast`,
  meta: [
    { name: 'description', content: `Real-time surf forecast for ${spotName.value}` }
  ]
})

onMounted(() => {
  if (!chartCanvas.value) return

  const ctx = chartCanvas.value.getContext('2d')
  
  const hours = []
  const heights = []
  for (let i = 0; i <= 24; i++) {
    hours.push(i)
    const height = 2.5 + 2 * Math.sin((i / 6.2) * Math.PI)
    heights.push(Math.max(0, height))
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
          max: 6,
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
})

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy()
  }
})
</script>