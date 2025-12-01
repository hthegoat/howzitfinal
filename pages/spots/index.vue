<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />
    
    <main class="max-w-6xl mx-auto px-4 py-8">
      <div class="mb-8">
        <h1 class="text-5xl font-display uppercase mb-2">Surf Spots</h1>
        <p class="text-gray-600 font-body">Real-time forecasts powered by Surfline data</p>
        
      </div>

      <div v-if="loading" class="text-gray-500">Loading spots...</div>
      
      
      <div v-else>
       
        <!-- State Sections -->
        <div v-for="state in states" :key="state" class="mb-12">
          <h2 class="text-3xl font-display uppercase mb-4 pb-2 border-b-2 border-black">{{ state }}</h2>
          
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
           <NuxtLink 
  v-for="spot in spotsByState[state]" 
  :key="spot.id"
  :to="`/spots/${spot.slug}`"
  class="relative bg-white border-2 border-gray-200 hover:border-black p-4 transition-all group overflow-hidden"
>

  <!-- Rating color bar -->
  <div 
    :style="{ backgroundColor: getRatingColor(spot.forecast?.rating_key) }"
    class="absolute left-0 top-0 bottom-0 w-1.5"
  ></div>
  
  <div class="flex justify-between items-start mb-3">
                <div>
                  <h3 class="font-bold text-lg group-hover:underline">{{ spot.name }}</h3>
                  <p class="text-sm text-gray-500">{{ spot.region }}</p>
                </div>
                <div v-if="spot.forecast" class="text-right">
                  <p class="text-2xl font-black">{{ formatWaveRange(spot.forecast.wave_min, spot.forecast.wave_max) }}</p>
                  <div class="flex items-center justify-end gap-1.5">
                    <span 
  :style="{ backgroundColor: getRatingColor(spot.forecast?.rating_key) }"
  class="inline-block w-2 h-2 rounded-full"
></span>
                    <p class="text-xs text-gray-500 capitalize">{{ formatRating(spot.forecast.rating_key) }}</p>
                  </div>
                </div>
                <div v-else class="text-right text-gray-400">
                  <p class="text-lg">--</p>
                </div>
              </div>
              
              <div v-if="spot.forecast" class="flex gap-4 text-sm text-gray-600 font-mono">
                <span>{{ Math.round(spot.forecast.swell_period || 0) }}s</span>
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

const getRatingColor = (rating) => {
  if (!rating) return '#d1d5db'
  
  const normalized = rating.toLowerCase()
  
  const colors = {
    'epic': '#22c55e',
    'good': '#4ade80',
    'fair_to_good': '#a3e635',
    'fair': '#facc15',
    'poor_to_fair': '#fb923c',
    'poor': '#f87171',
    'very_poor': '#ef4444',
    'flat': '#d1d5db',
  }
  return colors[normalized] || '#d1d5db'
}
// Rating color mapping - dot indicator (inline style)
const getRatingDotStyle = (rating) => {
  const colors = {
    'epic': '#22c55e',
    'good': '#4ade80',
    'fair_to_good': '#a3e635',
    'fair': '#facc15',
    'poor_to_fair': '#fb923c',
    'poor': '#f87171',
    'flat': '#d1d5db',
  }
  return { backgroundColor: colors[rating] || '#d1d5db' }
}

// Format rating text
const formatRating = (rating) => {
  if (!rating) return '--'
  return rating.replace(/_/g, ' ')
}

// Fetch spots with their latest forecast
onMounted(async () => {
  const { data: spotsData } = await supabase
    .from('spots')
    .select('*')
    .order('name')

  if (spotsData) {
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

// Format wind speed
const formatWind = (knots) => {
  if (!knots) return '--'
  return `${Math.round(knots * 1.151)}mph`
}

useHead({
  title: 'Surf Spots - Howzit'
})
</script>