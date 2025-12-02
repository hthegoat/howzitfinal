<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />
    
    <main class="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
      <div v-if="!spot" class="text-gray-500">Loading...</div>
      
      <div v-else>
        <!-- Spot Header with Current Conditions -->
        <SpotHeader 
          :spot-name="spot.name"
          :region="spot.region"
          :buoy-id="spot.buoy_id"
          :current="currentConditions"
          :rating="currentRating"
          :rating-label="ratingLabel"
          :timestamp="latestForecast?.fetched_at"
        />
<!-- AI Summary -->
<div 
  v-if="spotSummary" 
  class="bg-black text-white border-2 border-black p-4 mb-6"
>
  <p class="font-bold text-sm mb-2 uppercase tracking-wide">This Week's Outlook</p>
  <p class="text-gray-200">{{ spotSummary.summary }}</p>
  <p class="text-xs text-gray-500 mt-2 font-mono">Updated {{ new Date(spotSummary.generated_at).toLocaleString() }}</p>
</div>
        <!-- 5-Day Forecast -->
   <!-- Desktop/Tablet grid -->
<div class="hidden sm:grid sm:grid-cols-3 md:grid-cols-5 gap-0 divide-x divide-gray-200">
  <div 
    v-for="(day, index) in displayForecast" 
   :key="index"
  @click="selectDay(day)"
  class="cursor-pointer relative text-center p-3 lg:p-4 bg-white"
  :class="selectedDay?.dayName === day.dayName ? 'ring-2 ring-black' : 'hover:bg-gray-50'"
  >
    <!-- Color bar -->
    <div 
      :style="{ backgroundColor: getStarsColor(day.stars) }"
      class="absolute left-0 top-0 bottom-0 w-1"
    ></div>

    <p class="font-bold text-xs sm:text-sm mb-1 sm:mb-2 uppercase">{{ day.dayName }}</p>
    <div class="flex justify-center mb-1 sm:mb-2">
      <Starrating :rating="day.stars" />
    </div>
    <p class="text-lg sm:text-xl lg:text-2xl font-black mb-1">{{ day.waveDisplay }}</p>
    <p class="text-[10px] sm:text-xs text-gray-500 mb-2 sm:mb-3 font-mono">{{ day.period }}s period</p>
    
    <!-- Wind with quality -->
    <div class="flex justify-center items-center gap-1 mb-1">
      <span 
        :style="{ backgroundColor: getWindQualityColor(day.windQuality) }"
        class="w-1.5 h-1.5 rounded-full"
      ></span>
      <span class="text-[10px] sm:text-xs text-gray-600 font-mono">{{ day.windSpeed }}mph {{ day.windQuality }}</span>
    </div>
    
    <!-- Swell with quality -->
    <div class="flex justify-center items-center gap-1">
      <span 
        :style="{ backgroundColor: getSwellQualityColor(day.swellQuality) }"
        class="w-1.5 h-1.5 rounded-full"
      ></span>
      <span class="text-[10px] sm:text-xs text-gray-600 font-mono">{{ formatDirection(day.swellDir) }} {{ day.swellQuality }}</span>
    </div>
  </div>
</div>

        <!-- Two Column Layout -->
        <div class="grid lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
          <!-- Main Column -->
          <div class="lg:col-span-2 space-y-4 sm:space-y-6">
            <!-- Tide Chart -->
            <div class="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-100">
              <h3 class="font-bold text-base sm:text-lg lg:text-xl mb-3 sm:mb-4">Today's Tide</h3>
              
              <!-- Chart Container - responsive height -->
              <div class="relative h-36 sm:h-44 lg:h-48 mb-4 sm:mb-6 overflow-hidden">
                <TideChart :tides="surflineTides" />
              </div>
              
              <!-- Tide Times - 2 cols on mobile, 4 on tablet+ -->
              <div v-if="todayTides.length > 0" class="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
                <div 
                  v-for="tide in todayTides" 
                  :key="tide.id"
                  class="text-center p-2 sm:p-3 rounded-lg"
                  :class="tide.type === 'HIGH' ? 'bg-blue-50' : 'bg-gray-50'"
                >
                  <span 
                    class="block font-bold text-xs sm:text-sm" 
                    :class="tide.type === 'HIGH' ? 'text-blue-600' : 'text-gray-600'"
                  >
                    {{ tide.type }}
                  </span>
                  <span class="block text-base sm:text-lg font-black">{{ formatTideTime(tide.timestamp) }}</span>
                  <span class="block text-xs sm:text-sm text-gray-500">{{ tide.height.toFixed(1) }}ft</span>
                </div>
              </div>
              <div v-else class="text-gray-400 text-sm text-center py-4">
                No tide data available
              </div>
            </div>

            <!-- Live Reports -->
            <LiveReports />
          </div>

          <!-- Sidebar - shows below main content on mobile/tablet -->
          <div class="space-y-4 sm:space-y-6">
            <!-- On mobile, show hazards first (most important) -->
            <Hazards :hazards="hazards" />
            <SpotInfo :spot="spotInfo" />
            <NearbySpots :spots="nearbySpots" :current-slug="spot.slug" />
          </div>
        </div>
      </div>

<!-- After the two-column grid, before AppFooter -->
<div class="mt-6">
  <SpotHistory :spot="spot" />
</div>

    </main>


    
    <AppFooter />
  </div>
</template>

<style scoped>
/* Hide scrollbar but keep functionality */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>

<script setup>
const route = useRoute()
const supabase = useSupabaseClient()

const spot = ref(null)
const surflineForecasts = ref([])
const surflineTides = ref([])
const buoyReading = ref(null)
const forecastLoading = ref(true)


import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

const { hourlyData, loading: hourlyLoading, fetchHourlyForecast, formatHour } = useHourlyForecast()

const selectedDay = ref(null)
const waveChartRef = ref(null)
let waveChart = null

const selectDay = async (day) => {
  if (selectedDay.value?.dayName === day.dayName) {
    selectedDay.value = null
    return
  }
  
  selectedDay.value = day
  await fetchHourlyForecast(spot.value.latitude, spot.value.longitude, day.date)
  
  nextTick(() => {
    renderWaveChart()
  })
}

const renderWaveChart = () => {
  if (!waveChartRef.value || !hourlyData.value) return
  
  if (waveChart) {
    waveChart.destroy()
  }
  
  const ctx = waveChartRef.value.getContext('2d')
  
  waveChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: hourlyData.value.map(h => formatHour(h.hour)),
      datasets: [{
        label: 'Wave Height',
        data: hourlyData.value.map(h => h.waveHeight),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: '#3b82f6'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (val) => val + 'ft'
          }
        },
        x: {
          grid: { display: false }
        }
      }
    }
  })
}


// Fetch spot data from Supabase
const { data } = await useAsyncData(`spot-${route.params.slug}`, async () => {
  const { data: spotData } = await supabase
    .from('spots')
    .select('*')
    .eq('slug', route.params.slug)
    .single()
  
  return spotData
})

spot.value = data.value

// Rating color based on stars (0-5)
const getStarsColor = (stars) => {
  if (stars >= 4) return '#22c55e'
  if (stars >= 3) return '#a3e635'
  if (stars >= 2) return '#facc15'
  if (stars >= 1) return '#fb923c'
  return '#ef4444'
}

// Wind quality based on beach orientation
const getWindQuality = (windDirection, beachOrientation) => {
  if (!windDirection || !beachOrientation) return 'unknown'
  
  let diff = Math.abs(windDirection - beachOrientation)
  if (diff > 180) diff = 360 - diff
  
  if (diff >= 150) return 'offshore'
  if (diff >= 120) return 'cross-off'
  if (diff >= 60) return 'cross-shore'
  if (diff >= 30) return 'cross-on'
  return 'onshore'
}

// Swell quality based on beach orientation
const getSwellQuality = (swellDirection, beachOrientation) => {
  if (!swellDirection || !beachOrientation) return 'unknown'
  
  let diff = Math.abs(swellDirection - beachOrientation)
  if (diff > 180) diff = 360 - diff
  
  if (diff <= 30) return 'ideal'
  if (diff <= 60) return 'good'
  if (diff <= 90) return 'fair'
  return 'poor'
}

// Colors for wind quality
const getWindQualityColor = (quality) => {
  const colors = {
    'offshore': '#22c55e',
    'cross-off': '#a3e635',
    'cross-shore': '#facc15',
    'cross-on': '#fb923c',
    'onshore': '#ef4444',
    'unknown': '#d1d5db'
  }
  return colors[quality] || '#d1d5db'
}


// Fetch the pre-generated summary
const spotSummary = ref(null)

onMounted(async () => {
  if (spot.value?.id) {
    const today = new Date().toISOString().split('T')[0]
    
    const { data: summary } = await supabase
      .from('spot_summaries')
      .select('summary, generated_at')
      .eq('spot_id', spot.value.id)
      .eq('forecast_date', today)
      .single()
    
    spotSummary.value = summary
  }
})


// Colors for swell quality
const getSwellQualityColor = (quality) => {
  const colors = {
    'ideal': '#22c55e',
    'good': '#a3e635',
    'fair': '#facc15',
    'poor': '#ef4444',
    'unknown': '#d1d5db'
  }
  return colors[quality] || '#d1d5db'
}
// Fetch Surfline forecasts and NOAA buoy data
onMounted(async () => {
  if (spot.value?.id) {
    forecastLoading.value = true
    
    const now = new Date()
    const sixDaysOut = new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000)

    // Fetch forecasts
    const { data: forecastData } = await supabase
      .from('surfline_forecasts')
      .select('*')
      .eq('spot_id', spot.value.id)
      .gte('timestamp', now.toISOString())
      .lte('timestamp', sixDaysOut.toISOString())
      .order('timestamp', { ascending: true })

    surflineForecasts.value = forecastData || []

    // Fetch tides
    const twoDaysOut = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000)
    
    const { data: tideData } = await supabase
      .from('surfline_tides')
      .select('*')
      .eq('spot_id', spot.value.id)
      .gte('timestamp', now.toISOString())
      .lte('timestamp', twoDaysOut.toISOString())
      .order('timestamp', { ascending: true })

    surflineTides.value = tideData || []

    // Fetch water temp from NOAA buoy readings
    if (spot.value.buoy_id) {
      const { data: buoyData } = await supabase
        .from('buoy_readings')
        .select('*')
        .eq('buoy_id', spot.value.buoy_id)
        .order('timestamp', { ascending: false })
        .limit(1)
        .single()
      
      buoyReading.value = buoyData
    }
    
    forecastLoading.value = false
  }
})

// Get latest forecast for current conditions
const latestForecast = computed(() => {
  return surflineForecasts.value[0] || null
})

// Current conditions from Surfline data + NOAA water temp
const currentConditions = computed(() => {
  const f = latestForecast.value
  if (!f) {
    return {
      height: '--',
      period: '--',
      wind: { speed: '--', direction: '--', degrees: 0 },
      temp: '--',
      swellDirection: 0
    }
  }

  // Wind quality based on beach orientation
const getWindQuality = (windDirection, beachOrientation) => {
  if (!windDirection || !beachOrientation) return 'unknown'
  
  let diff = Math.abs(windDirection - beachOrientation)
  if (diff > 180) diff = 360 - diff
  
  if (diff >= 150) return 'offshore'
  if (diff >= 120) return 'cross-off'
  if (diff >= 60) return 'cross-shore'
  if (diff >= 30) return 'cross-on'
  return 'onshore'
}

// Swell quality based on beach orientation
const getSwellQuality = (swellDirection, beachOrientation) => {
  if (!swellDirection || !beachOrientation) return 'unknown'
  
  let diff = Math.abs(swellDirection - beachOrientation)
  if (diff > 180) diff = 360 - diff
  
  if (diff <= 30) return 'ideal'
  if (diff <= 60) return 'good'
  if (diff <= 90) return 'fair'
  return 'poor'
}

// Colors for wind quality
const getWindQualityColor = (quality) => {
  const colors = {
    'offshore': '#22c55e',
    'cross-off': '#a3e635',
    'cross-shore': '#facc15',
    'cross-on': '#fb923c',
    'onshore': '#ef4444',
    'unknown': '#d1d5db'
  }
  return colors[quality] || '#d1d5db'
}

// Colors for swell quality
const getSwellQualityColor = (quality) => {
  const colors = {
    'ideal': '#22c55e',
    'good': '#a3e635',
    'fair': '#facc15',
    'poor': '#ef4444',
    'unknown': '#d1d5db'
  }
  return colors[quality] || '#d1d5db'
}

  // Convert wind from knots to mph
  const windMph = f.wind_speed ? Math.round(f.wind_speed * 1.151) : '--'
  const windDir = f.wind_direction ? formatDirection(f.wind_direction) : '--'

  // Get water temp from NOAA buoy (convert C to F)
  const waterTempC = buoyReading.value?.water_temp
  const waterTempF = waterTempC ? Math.round((waterTempC * 9/5) + 32) : '--'

  return {
    height: `${f.wave_min || 0}-${f.wave_max || 0}`,
    period: f.swell_period ? Math.round(f.swell_period) : '--',
    wind: {
      speed: windMph,
      direction: windDir,
      degrees: f.wind_direction || 0,
      type: f.wind_type || ''
    },
    temp: waterTempF,
    swellDirection: f.swell_direction || 0
  }
})

// Convert Surfline rating to 0-5 stars
const ratingToStars = (ratingKey, ratingValue) => {
  // ratingValue is 0-6, convert to 0-5
  if (ratingValue !== null && ratingValue !== undefined) {
    return Math.round((ratingValue / 6) * 5)
  }
  // Fallback to key-based
  const map = {
    'VERY_POOR': 0,
    'POOR': 1,
    'POOR_TO_FAIR': 2,
    'FAIR': 2,
    'FAIR_TO_GOOD': 3,
    'GOOD': 4,
    'VERY_GOOD': 4,
    'GOOD_TO_EPIC': 5,
    'EPIC': 5
  }
  return map[ratingKey] || 1
}

const currentRating = computed(() => {
  const f = latestForecast.value
  if (!f) return 0
  return ratingToStars(f.rating_key, f.rating_value)
})

const ratingLabel = computed(() => {
  const f = latestForecast.value
  if (!f?.rating_key) return 'Unknown'
  
  const labels = {
    'VERY_POOR': 'Very Poor',
    'POOR': 'Poor',
    'POOR_TO_FAIR': 'Poor-Fair',
    'FAIR': 'Fair',
    'FAIR_TO_GOOD': 'Fair-Good',
    'GOOD': 'Good',
    'VERY_GOOD': 'Very Good',
    'GOOD_TO_EPIC': 'Epic',
    'EPIC': 'Epic'
  }
  return labels[f.rating_key] || f.rating_key
})

// Group forecasts by day for 5-day display
const displayForecast = computed(() => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const today = new Date()
  
  // Group by day
  const byDay = {}
  surflineForecasts.value.forEach(f => {
    const date = new Date(f.timestamp).toDateString()
    if (!byDay[date]) {
      byDay[date] = []
    }
    byDay[date].push(f)
  })

  // Convert to array and compute daily summary
  const dailyData = Object.entries(byDay).map(([dateStr, readings]) => {
    const date = new Date(dateStr)
    const isToday = date.toDateString() === today.toDateString()
    
    // Get min/max waves for the day
    const waveMin = Math.min(...readings.map(r => r.wave_min).filter(v => v !== null))
    const waveMax = Math.max(...readings.map(r => r.wave_max).filter(v => v !== null))
    
    // Get best rating
    const bestRating = readings.reduce((best, r) => {
      if (!r.rating_value) return best
      if (!best || r.rating_value > best.rating_value) return r
      return best
    }, null)

    // Get swell from first reading with data
    const swellReading = readings.find(r => r.swell_period)
    
    // Average wind
    const winds = readings.filter(r => r.wind_speed !== null)
    const avgWind = winds.length 
      ? winds.reduce((sum, r) => sum + r.wind_speed, 0) / winds.length 
      : null
    const windReading = readings.find(r => r.wind_direction !== null)

   // Inside your dailyData mapping, add:
return {
  date,
  dayName: isToday ? 'Today' : days[date.getDay()],
  waveMin: isFinite(waveMin) ? waveMin : 0,
  waveMax: isFinite(waveMax) ? waveMax : 0,
  waveDisplay: formatWaveRange(waveMin, waveMax),
  period: swellReading?.swell_period ? Math.round(swellReading.swell_period) : '--',
  swellDir: swellReading?.swell_direction || 0,
  windSpeed: avgWind ? Math.round(avgWind * 1.151) : '--',
  windDir: windReading?.wind_direction || 0,
  stars: ratingToStars(bestRating?.rating_key, bestRating?.rating_value),
  // Add these two new fields
  windQuality: getWindQuality(windReading?.wind_direction, spot.value?.orientation),
  swellQuality: getSwellQuality(swellReading?.swell_direction, spot.value?.orientation)
}
  })

  // Sort by date and take first 5
  return dailyData
    .sort((a, b) => a.date - b.date)
    .slice(0, 5)
})

// Format wave range for display
const formatWaveRange = (min, max) => {
  if (!isFinite(min) || !isFinite(max)) return '--'
  // Round and ensure minimum of 1 (no "0ft" waves)
  const minRound = Math.max(1, Math.round(min))
  const maxRound = Math.max(1, Math.round(max))
  if (minRound === maxRound) {
    return `${minRound}ft`
  }
  return `${minRound}-${maxRound}ft`
}

// Format direction degrees to compass
const formatDirection = (degrees) => {
  if (degrees === null || degrees === undefined) return '--'
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  return dirs[Math.round(degrees / 45) % 8]
}

// Today's tides
const todayTides = computed(() => {
  const today = new Date().toDateString()
  return surflineTides.value.filter(t => {
    return new Date(t.timestamp).toDateString() === today
  })
})

const formatTideTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  })
}

// Spot info
const spotInfo = computed(() => ({
  skill_level: 'All levels',
  best_tide: 'Mid to High',
  best_swell_direction: ['E', 'ESE', 'SE'],
  best_wind_direction: ['W', 'NW'],
  access_type: 'Beach parking'
}))

// Hazards based on conditions
const hazards = computed(() => {
  const h = []
  const f = latestForecast.value
  if (!f) return h
  
  const windMph = f.wind_speed ? f.wind_speed * 1.151 : 0
  
  if (windMph > 20) h.push('Strong winds - use caution')
  else if (windMph > 15) h.push('Moderate winds')
  
  if (f.wave_max > 8) h.push('Large surf - experienced surfers only')
  
  return h
})

// Nearby spots - fetch from DB
const nearbySpots = ref([])

onMounted(async () => {
  if (spot.value) {
    const { data: allSpots } = await supabase
      .from('spots')
      .select('name, slug')
      .neq('slug', spot.value.slug)
      .limit(3)
    
    nearbySpots.value = (allSpots || []).map(s => ({
      name: s.name,
      slug: s.slug,
      distance: 'Nearby'
    }))
  }
})

useHead({
  title: computed(() => spot.value ? `${spot.value.name} Surf Report - Howzit` : 'Loading...'),
})

// In your spot/[slug].vue or wherever this lives

useSeoMeta({
  title: () => `${spot.value?.name} Surf Forecast - Howzit`,
  description: () => `${spot.value?.name} surf report and 5-day forecast. Current conditions, tide charts, and swell data for ${spot.value?.region}.`,
  ogTitle: () => `${spot.value?.name} Surf Forecast`,
  ogDescription: () => `Check the waves at ${spot.value?.name}. ${currentConditions.value?.waveHeight || ''} waves, ${currentConditions.value?.period || ''}s period.`,
  ogType: 'website',
  ogImage: '/og-image.png', // Create a branded share image
  twitterCard: 'summary_large_image',
})

// Canonical URL
useHead({
  link: [
    { rel: 'canonical', href: `https://howzit.surf/forecast/${spot.value?.slug}` }
  ]
})

</script>