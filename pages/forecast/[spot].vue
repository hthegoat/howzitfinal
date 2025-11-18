<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b-3 border-black sticky top-0 z-50">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <NuxtLink to="/" class="text-2xl font-black">HOWZIT</NuxtLink>
          <div class="flex items-center gap-4">
            <button class="p-2 hover:bg-gray-100 rounded-lg">
              <HeartIcon :filled="isFavorite" class="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </header>

    <div class="container mx-auto px-4 py-8">
      <!-- Breadcrumbs -->
      <div class="text-sm mb-4">
        <NuxtLink to="/" class="text-gray-600 hover:text-black">Home</NuxtLink>
        <span class="mx-2">/</span>
        <NuxtLink to="/forecast" class="text-gray-600 hover:text-black">Forecasts</NuxtLink>
        <span class="mx-2">/</span>
        <span class="font-bold">{{ spotName }}</span>
      </div>

      <div class="grid lg:grid-cols-3 gap-6">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Spot Header -->
          <div class="bg-white border-3 border-black rounded-lg p-6">
            <div class="flex items-start justify-between mb-4">
              <div>
                <h1 class="text-4xl font-black mb-2">{{ spotName }}</h1>
                <p class="text-gray-600">New Jersey</p>
              </div>
              <div class="text-right">
                <div class="text-3xl font-black">{{ currentConditions.rating }}/5</div>
                <div class="text-sm text-gray-600">Current Rating</div>
              </div>
            </div>
            
            <!-- Current Conditions -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div>
                <div class="text-sm text-gray-600">Wave Height</div>
                <div class="text-2xl font-bold">{{ currentConditions.waveHeight }}</div>
              </div>
              <div>
                <div class="text-sm text-gray-600">Period</div>
                <div class="text-2xl font-bold">{{ currentConditions.period }}</div>
              </div>
              <div>
                <div class="text-sm text-gray-600">Wind</div>
                <div class="text-2xl font-bold">{{ currentConditions.wind }}</div>
              </div>
              <div>
                <div class="text-sm text-gray-600">Tide</div>
                <div class="text-2xl font-bold">{{ currentConditions.tide }}</div>
              </div>
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
            <h2 class="text-2xl font-black mb-4">Live Reports</h2>
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

          <!-- 5-Day Forecast -->
          <div class="bg-white border-3 border-black rounded-lg p-6">
            <h2 class="text-2xl font-black mb-4">5-Day Forecast</h2>
            
            <!-- Desktop Table -->
            <div class="hidden md:block overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="border-b-2 border-black">
                    <th class="text-left py-3 font-black">Day</th>
                    <th class="text-left py-3 font-black">Waves</th>
                    <th class="text-left py-3 font-black">Period</th>
                    <th class="text-left py-3 font-black">Wind</th>
                    <th class="text-left py-3 font-black">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  <tr 
                    v-for="day in forecast" 
                    :key="day.date"
                    class="border-b border-gray-200"
                  >
                    <td class="py-4">
                      <div class="font-bold">{{ day.day }}</div>
                      <div class="text-sm text-gray-600">{{ day.date }}</div>
                    </td>
                    <td class="py-4 font-bold">{{ day.waves }}</td>
                    <td class="py-4">{{ day.period }}</td>
                    <td class="py-4">{{ day.wind }}</td>
                    <td class="py-4">
                      <span 
                        :class="getRatingColor(day.rating)"
                        class="px-3 py-1 rounded-full font-bold text-sm"
                      >
                        {{ day.rating }}/5
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Mobile Cards -->
            <div class="md:hidden space-y-4">
              <div 
                v-for="day in forecast" 
                :key="day.date"
                class="border-2 border-black rounded-lg p-4"
              >
                <div class="flex items-center justify-between mb-3">
                  <div>
                    <div class="font-bold">{{ day.day }}</div>
                    <div class="text-sm text-gray-600">{{ day.date }}</div>
                  </div>
                  <span 
                    :class="getRatingColor(day.rating)"
                    class="px-3 py-1 rounded-full font-bold text-sm"
                  >
                    {{ day.rating }}/5
                  </span>
                </div>
                <div class="grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <div class="text-gray-600">Waves</div>
                    <div class="font-bold">{{ day.waves }}</div>
                  </div>
                  <div>
                    <div class="text-gray-600">Period</div>
                    <div class="font-bold">{{ day.period }}</div>
                  </div>
                  <div>
                    <div class="text-gray-600">Wind</div>
                    <div class="font-bold">{{ day.wind }}</div>
                  </div>
                </div>
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
import { ref } from 'vue'

// NO AUTHENTICATION - Removed definePageMeta
const route = useRoute()
const spotName = route.params.spot 
  ? route.params.spot.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  : 'Manasquan'

const isFavorite = ref(false)
const showReportModal = ref(false)

const currentConditions = {
  rating: 4.2,
  waveHeight: '3-4ft',
  period: '8s',
  wind: '5mph W',
  tide: 'Rising'
}

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

const forecast = [
  { day: 'Today', date: 'Nov 18', waves: '3-4ft', period: '8s', wind: '5mph W', rating: 4 },
  { day: 'Tomorrow', date: 'Nov 19', waves: '2-3ft', period: '7s', wind: '10mph SW', rating: 3 },
  { day: 'Wednesday', date: 'Nov 20', waves: '4-5ft', period: '9s', wind: '8mph NW', rating: 5 },
  { day: 'Thursday', date: 'Nov 21', waves: '5-6ft', period: '10s', wind: '12mph W', rating: 4 },
  { day: 'Friday', date: 'Nov 22', waves: '3-4ft', period: '8s', wind: '15mph SW', rating: 3 }
]

const nearbySpots = [
  { name: 'Belmar', slug: 'belmar', distance: '3 miles north' },
  { name: 'Spring Lake', slug: 'spring-lake', distance: '5 miles north' },
  { name: 'Point Pleasant', slug: 'point-pleasant', distance: '4 miles south' }
]

const getRatingColor = (rating) => {
  if (rating >= 4) return 'bg-green-200 text-green-800'
  if (rating >= 3) return 'bg-yellow-200 text-yellow-800'
  return 'bg-gray-200 text-gray-800'
}

const handleReportSubmit = (report) => {
  console.log('Report submitted:', report)
  showReportModal.value = false
  // TODO: Submit to API
}
</script>