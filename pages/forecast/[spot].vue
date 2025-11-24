<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b-3 border-black sticky top-0 z-50">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <NuxtLink to="/" class="text-2xl font-black">HOWZIT</NuxtLink>
          <div class="flex items-center gap-4">
            <button 
              @click="refresh"
              class="p-2 hover:bg-gray-100 rounded-lg"
              :class="{ 'animate-spin': loading }"
            >
              🔄
            </button>
            <button class="p-2 hover:bg-gray-100 rounded-lg">
              <HeartIcon :filled="isFavorite" class="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Loading State -->
    <div v-if="loading && !forecast" class="container mx-auto px-4 py-20 text-center">
      <div class="text-4xl mb-4">🌊</div>
      <p class="text-xl font-bold">Loading forecast...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="container mx-auto px-4 py-20 text-center">
      <div class="text-4xl mb-4">⚠️</div>
      <p class="text-xl font-bold mb-2">Couldn't load forecast</p>
      <p class="text-gray-600 mb-4">{{ error }}</p>
      <button 
        @click="refresh"
        class="px-6 py-3 bg-black text-white rounded-lg font-bold"
      >
        Try Again
      </button>
    </div>

    <!-- Main Content -->
    <div v-else class="container mx-auto px-4 py-8">
      <!-- Breadcrumbs -->
      <div class="text-sm mb-4">
        <NuxtLink to="/" class="text-gray-600 hover:text-black">Home</NuxtLink>
        <span class="mx-2">/</span>
        <NuxtLink to="/forecast" class="text-gray-600 hover:text-black">Forecasts</NuxtLink>
        <span class="mx-2">/</span>
        <span class="font-bold">{{ spotName }}</span>
      </div>

      <!-- Data Source Info -->
      <div v-if="forecast && !forecast.success" class="mb-4 p-3 bg-yellow-100 border-2 border-yellow-600 rounded-lg text-sm">
        ⚠️ Using fallback data - {{ forecast.note }}
      </div>

      <div class="grid lg:grid-cols-3 gap-6">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Spot Header with STAR RATING -->
          <div class="bg-white border-3 border-black rounded-lg p-6">
            <div class="flex flex-col md:flex-row md:items-start md:justify-between mb-4 gap-4">
              <div>
                <h1 class="text-4xl font-black mb-2">{{ spotName }}</h1>
                <p class="text-gray-600">New Jersey</p>
                <p v-if="forecast?.buoyId" class="text-xs text-gray-500 mt-1">
                  Buoy: {{ forecast.buoyId }}
                </p>
              </div>
              <div class="flex flex-col items-start md:items-end">
                <div class="text-sm text-gray-600 mb-2">Current Rating</div>
                <StarRating 
                  :rating="numericRating" 
                  :show-label="true"
                />
              </div>
            </div>
            
            <!-- Current Conditions - REAL DATA -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div>
                <div class="text-sm text-gray-600">Wave Height</div>
                <div class="text-2xl font-bold">{{ displayConditions.waveHeight }}</div>
              </div>
              <div>
                <div class="text-sm text-gray-600">Period</div>
                <div class="text-2xl font-bold">{{ displayConditions.period }}</div>
              </div>
              <div>
                <div class="text-sm text-gray-600">Wind</div>
                <div class="text-2xl font-bold">{{ displayConditions.wind }}</div>
              </div>
              <div>
                <div class="text-sm text-gray-600">Water Temp</div>
                <div class="text-2xl font-bold">{{ displayConditions.waterTemp }}</div>
              </div>
            </div>

            <!-- Last Updated -->
            <div class="mt-4 text-xs text-gray-500">
              Last updated: {{ displayConditions.timestamp }}
            </div>

            <div class="mt-6 flex gap-3">
              <button 
                @click="showReportModal = true"
                class="flex-1 bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800"
              >
                Post Report
              </button>
              <button class="px-6 py-3 border-3 border-black rounded-lg font-bold hover:bg-gray-100">
                Set Alert
              </button>
            </div>
          </div>

          <!-- Live Reports -->
          <div class="bg-white border-3 border-black rounded-lg p-6">
            <h2 class="text-2xl font-black mb-4">Live Reports (Demo)</h2>
            <div class="space-y-4">
              <div 
                v-for="report in liveReports" 
                :key="report.id"
                class="border-2 border-gray-200 rounded-lg p-4"
              >
                <div class="flex items-start justify-between mb-2">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div>
                      <div class="font-bold">{{ report.user }}</div>
                      <div class="text-sm text-gray-600">{{ report.time }}</div>
                    </div>
                  </div>
                  <div class="flex items-center gap-1">
                    <span class="text-2xl font-black">{{ report.rating }}</span>
                    <span class="text-gray-600">/5</span>
                  </div>
                </div>
                <p class="mb-2">{{ report.comment }}</p>
                <div class="flex flex-wrap gap-2">
                  <span 
                    v-for="tag in report.tags" 
                    :key="tag"
                    class="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- 5-Day Forecast - READY TO BUILD -->
          <div class="bg-white border-3 border-black rounded-lg p-6">
            <h2 class="text-2xl font-black mb-4">This Week</h2>
            
            <!-- Coming soon placeholder -->
            <div class="space-y-4">
              <!-- Best Session Hero Card - Placeholder -->
              <div class="bg-gradient-to-r from-green-50 to-green-100 border-3 border-black rounded-lg p-6">
                <div class="flex items-start justify-between mb-3">
                  <div>
                    <div class="text-sm font-bold text-green-800 mb-1">🔥 BEST SESSION</div>
                    <div class="text-xl font-black">Wednesday 9AM - 12PM</div>
                  </div>
                  <StarRating :rating="4.8" :show-label="false" />
                </div>
                <div class="text-lg font-bold text-gray-700">
                  4-5ft @ 10s • 3mph W • Clean + Glassy
                </div>
              </div>

              <!-- Rest of week - Placeholder -->
              <div class="space-y-2">
                <div class="text-sm font-bold text-gray-600 mb-3">REST OF WEEK</div>
                
                <div 
                  v-for="day in mockForecast" 
                  :key="day.day"
                  class="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div class="flex items-center gap-4">
                    <div class="w-16">
                      <div class="font-bold">{{ day.day }}</div>
                      <div class="text-xs text-gray-600">{{ day.date }}</div>
                    </div>
                    <StarRating :rating="day.rating" :show-label="false" />
                  </div>
                  <div class="text-right">
                    <div class="font-bold">{{ day.waves }} @ {{ day.period }}</div>
                    <div class="text-sm text-gray-600">{{ day.wind }}</div>
                  </div>
                </div>
              </div>

              <div class="mt-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg text-sm text-blue-800">
                📊 <strong>Coming soon:</strong> Real 5-day forecast data from NOAA
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Spot Info -->
          <div class="bg-white border-3 border-black rounded-lg p-6">
            <h3 class="text-xl font-black mb-4">Spot Info</h3>
            <div class="space-y-3 text-sm">
              <div>
                <div class="font-bold">Skill Level</div>
                <div>Intermediate to Advanced</div>
              </div>
              <div>
                <div class="font-bold">Best Tide</div>
                <div>Mid to High</div>
              </div>
              <div>
                <div class="font-bold">Best Swell</div>
                <div>E, SE</div>
              </div>
              <div>
                <div class="font-bold">Best Wind</div>
                <div>W, NW</div>
              </div>
              <div>
                <div class="font-bold">Access</div>
                <div>Public beach access</div>
              </div>
            </div>
          </div>

          <!-- Hazards -->
          <div class="bg-yellow-100 border-3 border-black rounded-lg p-6">
            <h3 class="text-xl font-black mb-4">⚠️ Hazards</h3>
            <ul class="space-y-2 text-sm">
              <li>• Strong currents on big swells</li>
              <li>• Rocky bottom in places</li>
              <li>• Crowded on good days</li>
            </ul>
          </div>

          <!-- Local Knowledge -->
          <div class="bg-white border-3 border-black rounded-lg p-6">
            <h3 class="text-xl font-black mb-4">Local Knowledge</h3>
            <p class="text-sm text-gray-700">
              Classic Jersey beach break. Works best on E-SE swells with offshore winds. 
              Can get crowded on good days, especially weekends. Respect locals and the lineup.
            </p>
          </div>

          <!-- Nearby Spots -->
          <div class="bg-white border-3 border-black rounded-lg p-6">
            <h3 class="text-xl font-black mb-4">Nearby Spots</h3>
            <div class="space-y-3">
              <NuxtLink 
                v-for="spot in nearbySpots" 
                :key="spot.name"
                :to="`/forecast/${spot.slug}`"
                class="block p-3 border-2 border-black rounded-lg hover:bg-gray-100"
              >
                <div class="font-bold">{{ spot.name }}</div>
                <div class="text-sm text-gray-600">{{ spot.distance }}</div>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Report Modal -->
    <ReportModal 
      v-if="showReportModal" 
      @close="showReportModal = false"
      @submit="handleReportSubmit"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

definePageMeta({
  auth: false
})

const route = useRoute()
const spotSlug = route.params.spot || 'manasquan'
const spotName = spotSlug
  .split('-')
  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
  .join(' ')

const isFavorite = ref(false)
const showReportModal = ref(false)

// Use the forecast composable to fetch REAL data
const { useSpotForecast } = useForecast()
const { forecast, loading, error, refresh } = useSpotForecast(spotSlug)

// Computed properties for display
const displayRating = computed(() => {
  return forecast.value?.currentConditions?.rating || 'N/A'
})

const numericRating = computed(() => {
  const rating = forecast.value?.currentConditions?.rating
  return typeof rating === 'number' ? rating : null
})

const displayConditions = computed(() => {
  if (!forecast.value?.currentConditions) {
    return {
      waveHeight: 'Loading...',
      period: 'Loading...',
      wind: 'Loading...',
      waterTemp: 'Loading...',
      timestamp: ''
    }
  }
  return forecast.value.currentConditions
})

// Mock 5-day forecast data (TODO: Replace with real API)
const mockForecast = [
  { day: 'Mon', date: 'Nov 25', rating: 2.8, waves: '2-3ft', period: '8s', wind: '8mph W' },
  { day: 'Tue', date: 'Nov 26', rating: 3.5, waves: '3-4ft', period: '9s', wind: '5mph NW' },
  { day: 'Thu', date: 'Nov 28', rating: 3.8, waves: '3-4ft', period: '8s', wind: '12mph SW' },
  { day: 'Fri', date: 'Nov 29', rating: 3.2, waves: '2-3ft', period: '7s', wind: '15mph S' }
]

// Mock live reports
const liveReports = [
  {
    id: 1,
    user: 'SurfDog',
    time: '15 min ago',
    rating: 4,
    comment: 'Clean chest high sets. Light offshore. Get out here!',
    tags: ['Clean', 'Glassy', 'Peaky']
  },
  {
    id: 2,
    user: 'LocalShredder',
    time: '1 hour ago',
    rating: 4,
    comment: 'Shoulder to head high. A few closeouts but some nice ones if you\'re patient.',
    tags: ['Clean', 'Improving']
  },
  {
    id: 3,
    user: 'BeachBum',
    time: '2 hours ago',
    rating: 3,
    comment: 'Waist to chest. Bit choppy but rideable.',
    tags: ['Choppy', 'Crowded']
  }
]

const nearbySpots = [
  { name: 'Belmar', slug: 'belmar', distance: '3 miles north' },
  { name: 'Spring Lake', slug: 'spring-lake', distance: '5 miles north' },
  { name: 'Point Pleasant', slug: 'point-pleasant', distance: '4 miles south' }
]

const handleReportSubmit = (report) => {
  console.log('Report submitted:', report)
  showReportModal.value = false
}
</script>