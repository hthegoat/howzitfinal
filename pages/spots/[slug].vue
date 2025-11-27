<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />
    
    <main class="max-w-6xl mx-auto px-4 py-8">
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
          :timestamp="buoyReading?.timestamp"
        />

        <!-- 5-Day Forecast -->
        <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-100 mb-6">
          <h3 class="font-bold text-xl mb-6">5-Day Forecast</h3>
          
          <div v-if="forecastLoading" class="text-gray-500 text-center py-8">
            Loading forecast...
          </div>
          
          <div v-else class="grid grid-cols-5 gap-2 md:gap-4">
            <div 
              v-for="(day, index) in displayForecast" 
              :key="index"
              class="text-center p-3 md:p-4 rounded-lg border border-gray-100"
              :class="index === 0 ? 'bg-gray-50 border-black' : ''"
            >
              <p class="font-bold text-sm mb-2">{{ day.dayName }}</p>
              <div class="flex justify-center mb-2">
                <Starrating :rating="day.rating" />
              </div>
              <p class="text-xl md:text-2xl font-black mb-1">{{ day.waveHeightFt }}</p>
              <p class="text-xs text-gray-500 mb-3">{{ day.period }}s period</p>
              <div class="flex justify-center items-center gap-1 mb-1">
                <Windarrow :degrees="day.windDir" :speed="day.windSpeed" />
                <span class="text-xs text-gray-600">{{ day.windSpeed }}mph</span>
              </div>
              <div class="flex justify-center items-center gap-1">
                <Swellarrow :degrees="day.swellDir" />
                <span class="text-xs text-gray-600">{{ formatDirection(day.swellDir) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Two Column Layout -->
        <div class="grid md:grid-cols-3 gap-6 mb-6">
          <!-- Main Column -->
          <div class="md:col-span-2 space-y-6">
            <!-- Tide Chart -->
            <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <h3 class="font-bold text-xl mb-4">Today's Tide</h3>
              <div class="h-32">
                <Tidechart />
              </div>
            </div>

            <!-- Live Reports -->
            <LiveReports />
          </div>

          <!-- Sidebar -->
          <div class="space-y-6">
            <!-- Hazards (if any) -->
            <Hazards :hazards="hazards" />

            <!-- Spot Info -->
            <SpotInfo :spot="spotInfo" />

            <!-- Nearby Spots -->
            <NearbySpots :spots="nearbySpots" :current-slug="spot.slug" />
          </div>
        </div>
      </div>
    </main>
    
    <AppFooter />
  </div>
</template>

<script setup>
import { useMarineForecast } from '~/composables/useMarineForecast'

const route = useRoute()
const supabase = useSupabaseClient()
const { fetchForecast } = useMarineForecast()

const spot = ref(null)
const buoyReading = ref(null)
const weather = ref(null)
const marineForecast = ref([])
const forecastLoading = ref(true)

// Fetch spot data from Supabase
const { data } = await useAsyncData(`spot-${route.params.slug}`, async () => {
  const { data: spotData } = await supabase
    .from('spots')
    .select('*')
    .eq('slug', route.params.slug)
    .single()
  
  if (!spotData) return null
  
  const { data: buoyData } = await supabase
    .from('buoy_readings')
    .select('*')
    .eq('buoy_id', spotData.buoy_id)
    .order('timestamp', { ascending: false })
    .limit(1)
    .single()
  
  const { data: weatherData } = await supabase
    .from('weather_readings')
    .select('*')
    .eq('spot_id', spotData.id)
    .order('timestamp', { ascending: false })
    .limit(1)
    .single()
  
  return { spot: spotData, buoy: buoyData, weather: weatherData }
})

spot.value = data.value?.spot
buoyReading.value = data.value?.buoy
weather.value = data.value?.weather

// Fetch marine forecast from Open-Meteo
onMounted(async () => {
  if (spot.value) {
    forecastLoading.value = true
    const result = await fetchForecast(spot.value.latitude, spot.value.longitude)
    if (result.success) {
      marineForecast.value = result.data
    }
    forecastLoading.value = false
  }
})

// Current conditions object for SpotHeader
const currentConditions = computed(() => {
  const heightMeters = buoyReading.value?.wave_height || 0
  const heightFeet = (heightMeters * 3.28084).toFixed(1)
  const tempC = buoyReading.value?.water_temp
  const tempF = tempC ? ((tempC * 9/5) + 32).toFixed(0) : '--'
  const windMps = weather.value?.wind_speed || 0
  const windMph = (windMps * 2.237).toFixed(0)
  const windDeg = weather.value?.wind_direction || 0
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  const windDir = dirs[Math.round(windDeg / 45) % 8]
  
  return {
    height: heightFeet,
    period: buoyReading.value?.wave_period || '--',
    wind: {
      speed: windMph,
      direction: windDir,
      degrees: windDeg
    },
    temp: tempF,
    swellDirection: buoyReading.value?.swell_direction || 0
  }
})

// Rating calculation
const calculateRating = (heightFt, period, windMph) => {
  let rating = 0
  
  // Wave height scoring (0-2 stars)
  if (heightFt >= 2 && heightFt <= 6) rating += 2
  else if (heightFt >= 1 && heightFt < 2) rating += 1
  else if (heightFt > 6 && heightFt <= 8) rating += 1.5
  
  // Period scoring (0-2 stars)
  if (period >= 10) rating += 2
  else if (period >= 7) rating += 1
  else if (period >= 5) rating += 0.5
  
  // Wind scoring (0-1 star)
  if (windMph <= 8) rating += 1
  else if (windMph <= 12) rating += 0.5
  
  return Math.round(Math.min(5, rating))
}

const currentRating = computed(() => {
  const height = parseFloat(currentConditions.value.height) || 0
  const period = buoyReading.value?.wave_period || 0
  const wind = parseFloat(currentConditions.value.wind.speed) || 0
  return calculateRating(height, period, wind)
})

const ratingLabel = computed(() => {
  const labels = ['Flat', 'Poor', 'Fair', 'Good', 'Very Good', 'Epic']
  return labels[currentRating.value] || 'Unknown'
})

// Transform marine forecast for display
const displayForecast = computed(() => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const today = new Date()
  
  // Use real data if available, otherwise fall back to mock
  if (marineForecast.value.length > 0) {
    return marineForecast.value.slice(0, 5).map((day, index) => {
      const date = new Date(day.date)
      const dayName = index === 0 ? 'Today' : days[date.getDay()]
      const heightMeters = day.waveHeight || 0
      const heightFeet = heightMeters * 3.28084
      const period = day.wavePeriod || 0
      
      // Get wind data for this day (we'll use current wind as approximation for now)
      const windMph = weather.value?.wind_speed ? weather.value.wind_speed * 2.237 : 8
      
      return {
        dayName,
        waveHeightFt: heightFeet.toFixed(1) + 'ft',
        heightFeet: heightFeet, // raw number for rating calc
        period: period.toFixed(0),
        windSpeed: Math.round(windMph + (index * 2 - 4)), // slight variation
        windDir: (weather.value?.wind_direction || 180) + (index * 15),
        swellDir: day.swellDirection || day.waveDirection || 90,
        rating: calculateRating(heightFeet, period, windMph)
      }
    })
  }
  
  // Fallback mock data
  const baseHeight = parseFloat(currentConditions.value.height) || 2
  const basePeriod = buoyReading.value?.wave_period || 8
  
  return Array.from({ length: 5 }, (_, i) => {
    const date = new Date(today)
    date.setDate(date.getDate() + i)
    const dayName = i === 0 ? 'Today' : days[date.getDay()]
    const heightVar = Math.sin(i * 1.2) * 1.5
    const height = Math.max(0.5, baseHeight + heightVar)
    const period = Math.max(5, basePeriod + Math.sin(i) * 2)
    const windSpd = Math.max(3, 8 + Math.sin(i * 2) * 6)
    
    return {
      dayName,
      waveHeightFt: height.toFixed(1) + 'ft',
      heightFeet: height,
      period: period.toFixed(0),
      windSpeed: Math.round(windSpd),
      windDir: (180 + i * 30) % 360,
      swellDir: 90 + i * 10,
      rating: calculateRating(height, period, windSpd)
    }
  })
})

// Format direction degrees to compass
const formatDirection = (degrees) => {
  if (degrees === null || degrees === undefined) return '--'
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  return dirs[Math.round(degrees / 45) % 8]
}

// Spot info for SpotInfo component
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
  const wind = parseFloat(currentConditions.value.wind.speed) || 0
  const height = parseFloat(currentConditions.value.height) || 0
  
  if (wind > 20) h.push('Strong winds - use caution')
  else if (wind > 15) h.push('Moderate winds')
  
  if (height > 8) h.push('Large surf - experienced surfers only')
  
  return h
})

// Nearby spots
const nearbySpots = computed(() => [
  { name: 'Belmar', slug: 'belmar', distance: '3 miles north' },
  { name: 'Deal', slug: 'deal', distance: '5 miles north' },
  { name: 'Manasquan', slug: 'manasquan-inlet', distance: '4 miles south' }
])

useHead({
  title: computed(() => spot.value ? `${spot.value.name} Surf Report - Howzit` : 'Loading...'),
})
</script>