<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />
    
    <main class="max-w-6xl mx-auto px-4 py-8">
      <div class="mb-8">
        <h1 class="text-4xl font-black mb-2">Surf Spots</h1>
        <p class="text-gray-600">Real-time forecasts powered by Surfline data</p>
      </div>

      <div v-if="loading" class="text-gray-500">Loading spots...</div>
      
      <div v-else>
        <!-- State Sections -->
        <div v-for="state in states" :key="state" class="mb-10">
          <h2 class="text-2xl font-black mb-4 pb-2 border-b-3 border-black">{{ state }}</h2>
          
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <NuxtLink 
              v-for="spot in spotsByState[state]" 
              :key="spot.id"
              :to="`/spots/${spot.slug}`"
              class="bg-white border-2 border-gray-200 hover:border-black p-4 transition-colors group"
            >
              <div class="flex justify-between items-start mb-3">
                <div>
                  <h3 class="font-bold text-lg group-hover:underline">{{ spot.name }}</h3>
                  <p class="text-sm text-gray-500">{{ spot.region }}</p>
                </div>
                <div v-if="spot.forecast" class="text-right">
                  <p class="text-2xl font-black">{{ formatWaveRange(spot.forecast.wave_min, spot.forecast.wave_max) }}</p>
                  <p class="text-xs text-gray-500">{{ spot.forecast.rating_key?.replace('_', ' ') || '--' }}</p>
                </div>
                <div v-else class="text-right text-gray-400">
                  <p class="text-lg">--</p>
                </div>
              </div>
              
              <div v-if="spot.forecast" class="flex gap-4 text-sm text-gray-600">
                <span>{{ Math.round(spot.forecast.swell_period || 0) }}s period</span>
                <span>{{ formatWind(spot.forecast.wind_speed) }} {{ spot.forecast.wind_type || '' }}</span>
              </div>
            </NuxtLink>
          </div>
        </div>

        <!-- Empty state -->
        <div v-if="spots.length === 0" class="text-center py-12 text-gray-500">
          <p>No spots found.</p>
        </div>
      </div>
    </main>
    
    <AppFooter />
  </div>
</template>

<script setup>
const supabase = useSupabaseClient()

const spots = ref([])
const loading = ref(true)

// Fetch spots with their latest forecast
onMounted(async () => {
  // Get all spots
  const { data: spotsData } = await supabase
    .from('spots')
    .select('*')
    .order('name')

  if (spotsData) {
    // Get latest forecast for each spot
    const spotsWithForecasts = await Promise.all(
      spotsData.map(async (spot) => {
        const { data: forecast } = await supabase
          .from('surfline_forecasts')
          .select('*')
          .eq('spot_id', spot.id)
          .gte('timestamp', new Date().toISOString())
          .order('timestamp', { ascending: true })
          .limit(1)
          .single()
        
        return {
          ...spot,
          forecast
        }
      })
    )
    
    spots.value = spotsWithForecasts
  }
  
  loading.value = false
})

// Get unique states in desired order
const states = computed(() => {
  const stateOrder = ['New Jersey', 'New York', 'North Carolina']
  const spotStates = [...new Set(spots.value.map(s => s.state).filter(Boolean))]
  
  // Sort by preferred order, then alphabetically for any others
  return spotStates.sort((a, b) => {
    const aIndex = stateOrder.indexOf(a)
    const bIndex = stateOrder.indexOf(b)
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex
    if (aIndex !== -1) return -1
    if (bIndex !== -1) return 1
    return a.localeCompare(b)
  })
})

// Group spots by state
const spotsByState = computed(() => {
  const grouped = {}
  spots.value.forEach(spot => {
    const state = spot.state || 'Other'
    if (!grouped[state]) grouped[state] = []
    grouped[state].push(spot)
  })
  
  // Sort spots within each state by name
  Object.keys(grouped).forEach(state => {
    grouped[state].sort((a, b) => a.name.localeCompare(b.name))
  })
  
  return grouped
})

// Format wave range
const formatWaveRange = (min, max) => {
  if (min === null || max === null) return '--'
  const minRound = Math.max(1, Math.round(min))
  const maxRound = Math.max(1, Math.round(max))
  if (minRound === maxRound) return `${minRound}ft`
  return `${minRound}-${maxRound}ft`
}

// Format wind speed (knots to mph)
const formatWind = (knots) => {
  if (!knots) return '--'
  return `${Math.round(knots * 1.151)}mph`
}

useHead({
  title: 'Surf Spots - Howzit'
})
</script>