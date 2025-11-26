<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />
    
    <main class="max-w-4xl mx-auto px-4 py-12">
      <div v-if="pending" class="text-gray-500">Loading...</div>
      
      <div v-else-if="spot">
        <!-- Header -->
        <NuxtLink to="/spots" class="text-gray-500 hover:text-black text-sm mb-4 inline-block">
          ← All Spots
        </NuxtLink>
        
        <div class="mb-8">
          <h1 class="text-4xl font-bold mb-1">{{ spot.name }}</h1>
          <p class="text-gray-500">{{ spot.region }}</p>
        </div>
        
        <!-- Current Conditions -->
        <div class="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h2 class="text-sm text-gray-500 uppercase tracking-wide mb-4">Current Conditions</h2>
          
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p class="text-gray-500 text-sm">Wave Height</p>
              <p class="text-3xl font-bold">{{ formatWaveHeight(latestReading?.wave_height) }}</p>
            </div>
            <div>
              <p class="text-gray-500 text-sm">Period</p>
              <p class="text-3xl font-bold">{{ latestReading?.wave_period || '--' }}<span class="text-lg">s</span></p>
            </div>
            <div>
              <p class="text-gray-500 text-sm">Water Temp</p>
              <p class="text-3xl font-bold">{{ formatTemp(latestReading?.water_temp) }}</p>
            </div>
            <div>
              <p class="text-gray-500 text-sm">Wind</p>
              <p class="text-3xl font-bold">{{ formatWind(latestWeather) }}</p>
              <p class="text-gray-500 text-sm">{{ formatWindDirection(latestWeather?.wind_direction) }}</p>
            </div>
          </div>
          
          <p v-if="latestReading" class="text-gray-400 text-sm mt-4">
            Updated {{ formatTime(latestReading.timestamp) }}
          </p>
        </div>
        
        <!-- Spot Info -->
        <div class="bg-white border border-gray-200 rounded-lg p-6">
          <h2 class="text-sm text-gray-500 uppercase tracking-wide mb-4">About this Spot</h2>
          <p class="text-gray-700">{{ spot.description || 'No description available.' }}</p>
          
          <div class="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p class="text-gray-500">Buoy</p>
              <p class="font-medium">{{ spot.buoy_id }}</p>
            </div>
            <div>
              <p class="text-gray-500">Coordinates</p>
              <p class="font-medium">{{ Number(spot.latitude).toFixed(4) }}, {{ Number(spot.longitude).toFixed(4) }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="text-center py-12">
        <p class="text-gray-500">Spot not found</p>
        <NuxtLink to="/spots" class="text-black underline mt-2 inline-block">
          View all spots
        </NuxtLink>
      </div>
    </main>
    
    <AppFooter />
  </div>
</template>

<script setup>
const route = useRoute()
const supabase = useSupabaseClient()

const { data: pageData, pending } = await useAsyncData(`spot-${route.params.slug}`, async () => {
  // Get spot by slug
  const { data: spot } = await supabase
    .from('spots')
    .select('*')
    .eq('slug', route.params.slug)
    .single()
  
  if (!spot) return { spot: null, latestReading: null, latestWeather: null }
  
  // Get latest buoy reading
  const { data: latestReading } = await supabase
    .from('buoy_readings')
    .select('*')
    .eq('buoy_id', spot.buoy_id)
    .order('timestamp', { ascending: false })
    .limit(1)
    .single()
  
  // Get latest weather
  const { data: latestWeather } = await supabase
    .from('weather_readings')
    .select('*')
    .eq('spot_id', spot.id)
    .order('timestamp', { ascending: false })
    .limit(1)
    .single()
  
  return { spot, latestReading, latestWeather }
})

const spot = computed(() => pageData.value?.spot)
const latestReading = computed(() => pageData.value?.latestReading)
const latestWeather = computed(() => pageData.value?.latestWeather)

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

const formatWindDirection = (degrees) => {
  if (!degrees) return ''
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  const index = Math.round(degrees / 45) % 8
  return directions[index]
}

const formatTime = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

useHead({
  title: computed(() => spot.value ? `${spot.value.name} Surf Report - Howzit` : 'Spot - Howzit'),
  meta: [
    { name: 'description', content: computed(() => spot.value?.description || 'Real-time surf conditions') }
  ]
})
</script>