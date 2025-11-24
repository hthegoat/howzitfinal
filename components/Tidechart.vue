<template>
  <canvas ref="chartCanvas"></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Filler
} from 'chart.js'

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, LineController, Filler)

const chartCanvas = ref(null)
let chartInstance = null

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
        data: heights,
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.15)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false }
      },
      scales: {
        x: {
          display: true,
          grid: { display: false },
          ticks: {
            color: '#9ca3af',
            font: { size: 10 },
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
          display: false,
          min: 0,
          max: 5
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