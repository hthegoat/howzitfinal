<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />
    
    <main class="max-w-6xl mx-auto px-4 py-12">
      <h1 class="text-4xl font-bold mb-2">Surf Spots</h1>
      <p class="text-gray-600 mb-8">Real-time conditions from NOAA buoys</p>
      
      <div v-if="pending" class="text-gray-500">Loading spots...</div>
      
      <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <NuxtLink 
          v-for="spot in spots" 
          :key="spot.id"
          :to="`/spots/${spot.slug}`"
          class="bg-white border border-gray-200 rounded-lg p-6 hover:border-black transition-colors"
        >
          <div class="flex justify-between items-start mb-4">
            <div>
              <h2 class="text-xl font-bold">{{ spot.name }}</h2>
              <p class="text-gray-500 text-sm">{{ spot.region }}</p>
            </div>
            <span 
              v-if="spot.latest_reading"
              class="text-2xl font-bold"
            >
              {{ formatWaveHeight(spot.latest_reading.wave_height) }}
            </span>
          </div>
          
          <div v-if="spot.latest_reading" class="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p class="text-gray-500">Period</p>
              <p class="font-medium">{{ spot.latest_reading.wave_period || '--' }}s</p>
            </div>
            <div>
              <p class="text-gray-500">Water</p>
              <p class="font-medium">{{ formatTemp(spot.latest_reading.water_temp) }}</p>
            </div>
            <div>
              <p class="text-gray-500">Wind</p>
              <p class="font-medium">{{ formatWind(spot.latest_weather) }}</p>
            </div>
          </div>
          
          <div v-else class="text-gray-400 text-sm">
            No current data
          </div>
        </NuxtLink>
      </div>
    </main>
    
    <AppFooter />
  </div>
</template>

<script setup>
const supabase = useSupabaseClient()

const { data: spots, pending } = await useAsyncData('spots', async () => {
  // Get all spots
  const { data: spotsData } = await supabase
    .from('spots')
    .select('*')
    .order('region', { ascending: true })
  
  // Get latest buoy reading for each unique buoy
  const buoyIds = [...new Set(spotsData.map(s => s.buoy_id))]
  
  const buoyReadings = {}
  for (const buoyId of buoyIds) {
    const { data } = await supabase
      .from('buoy_readings')
      .select('*')
      .eq('buoy_id', buoyId)
      .order('timestamp', { ascending: false })
      .limit(1)
      .single()
    
    if (data) buoyReadings[buoyId] = data
  }
  
  // Get latest weather for each spot
  const weatherReadings = {}
  for (const spot of spotsData) {
    const { data } = await supabase
      .from('weather_readings')
      .select('*')
      .eq('spot_id', spot.id)
      .order('timestamp', { ascending: false })
      .limit(1)
      .single()
    
    if (data) weatherReadings[spot.id] = data
  }
  
  // Combine data
  return spotsData.map(spot => ({
    ...spot,
    latest_reading: buoyReadings[spot.buoy_id] || null,
    latest_weather: weatherReadings[spot.id] || null
  }))
})

const formatWaveHeight = (meters) => {
  if (!meters) return '--'
  const feet = meters * 3.28084
  return `${feet.toFixed(1)}ft`
}

const formatTemp = (celsius) => {
  if (!celsius) return '--'
  const fahrenheit = (celsius * 9/5) + 32
  return `${fahrenheit.toFixed(0)}°F`
}

const formatWind = (weather) => {
  if (!weather?.wind_speed) return '--'
  const mph = weather.wind_speed * 2.237
  return `${mph.toFixed(0)}mph`
}

useHead({
  title: 'Surf Spots - Howzit',
  meta: [
    { name: 'description', content: 'Real-time surf conditions for East Coast spots' }
  ]
})
</script>