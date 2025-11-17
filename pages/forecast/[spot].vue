<!-- pages/forecast/[spot].vue -->
<template>
  <div>
    <AppHeader />
    
    <!-- Hero Section with Current Conditions -->
    <section class="bg-gradient-to-b from-blue-50 to-white border-b-2 border-black">
      <div class="max-w-7xl mx-auto px-4 py-8">
        <!-- Spot Header -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <div class="flex items-center gap-2 mb-2">
              <h1 class="text-3xl md:text-4xl font-black">{{ spot.name }}</h1>
              <button class="p-2 hover:bg-white rounded-lg transition-colors">
                <HeartIcon :filled="isFavorite" class="w-6 h-6" />
              </button>
            </div>
            <p class="text-gray-600">{{ spot.location }}</p>
            <div class="flex items-center gap-4 mt-2 text-sm">
              <span class="flex items-center gap-1">
                <span class="text-green-500">●</span>
                {{ activeUsers }} checking now
              </span>
              <span class="text-gray-500">
                Updated {{ lastUpdated }}
              </span>
            </div>
          </div>
          
          <!-- Quick Actions -->
          <div class="flex gap-3 mt-4 md:mt-0">
            <button class="px-4 py-2 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-colors">
              Set Alert
            </button>
            <button class="px-4 py-2 border-2 border-black font-bold rounded-lg hover:bg-gray-50 transition-colors">
              Share
            </button>
          </div>
        </div>

        <!-- Current Conditions Grid -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <!-- Overall Rating -->
          <div class="bg-white border-2 border-black rounded-lg p-4">
            <p class="text-sm text-gray-600 mb-1">CONDITIONS</p>
            <div class="flex items-baseline gap-2">
              <span class="text-3xl font-black">{{ currentConditions.rating }}/10</span>
              <span :class="getRatingColor(currentConditions.rating)">
                {{ getRatingText(currentConditions.rating) }}
              </span>
            </div>
          </div>

          <!-- Wave Height -->
          <div class="bg-white border-2 border-black rounded-lg p-4">
            <p class="text-sm text-gray-600 mb-1">WAVES</p>
            <div class="flex items-baseline gap-2">
              <span class="text-3xl font-black">{{ currentConditions.waveHeight }}</span>
              <span class="text-sm">ft</span>
            </div>
            <p class="text-xs text-gray-500 mt-1">{{ currentConditions.wavePeriod }}s period</p>
          </div>

          <!-- Wind -->
          <div class="bg-white border-2 border-black rounded-lg p-4">
            <p class="text-sm text-gray-600 mb-1">WIND</p>
            <div class="flex items-baseline gap-2">
              <span class="text-3xl font-black">{{ currentConditions.windSpeed }}</span>
              <span class="text-sm">{{ currentConditions.windDirection }}</span>
            </div>
            <p class="text-xs text-gray-500 mt-1">{{ getWindCondition(currentConditions.windDirection) }}</p>
          </div>

          <!-- Tide -->
          <div class="bg-white border-2 border-black rounded-lg p-4">
            <p class="text-sm text-gray-600 mb-1">TIDE</p>
            <div class="flex items-baseline gap-2">
              <span class="text-3xl font-black">{{ currentConditions.tide }}</span>
              <span class="text-sm">{{ currentConditions.tideDirection === 'rising' ? '↑' : '↓' }}</span>
            </div>
            <p class="text-xs text-gray-500 mt-1">
              {{ currentConditions.nextTide }} at {{ currentConditions.nextTideTime }}
            </p>
          </div>
        </div>

        <!-- Best Time to Surf Today -->
        <div class="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="font-bold text-lg">🌟 Best time to surf today</p>
              <p class="text-2xl font-black">{{ bestTime.start }} - {{ bestTime.end }}</p>
              <p class="text-gray-600">{{ bestTime.reason }}</p>
            </div>
            <div class="text-right">
              <p class="text-sm text-gray-600">Crowd level</p>
              <p class="font-bold">{{ bestTime.crowdLevel }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Live Reports Section -->
    <section class="py-8 bg-gray-50 border-b-2 border-black">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-black">Live Reports</h2>
          <button 
            @click="showReportModal = true"
            class="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Add Report
          </button>
        </div>

        <!-- Report Cards -->
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div 
            v-for="report in liveReports" 
            :key="report.id"
            class="bg-white border-2 border-black rounded-lg p-4"
          >
            <div class="flex justify-between items-start mb-3">
              <div class="flex items-center gap-2">
                <div class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold">
                  {{ report.user.initials }}
                </div>
                <div>
                  <p class="font-bold">{{ report.user.name }}</p>
                  <p class="text-xs text-gray-500">{{ report.timeAgo }}</p>
                </div>
              </div>
              <div class="flex">
                <span v-for="n in 5" :key="n" class="text-yellow-400">
                  {{ n <= report.rating ? '★' : '☆' }}
                </span>
              </div>
            </div>
            
            <p class="text-gray-700 mb-3">{{ report.comment }}</p>
            
            <div class="flex flex-wrap gap-2">
              <span 
                v-for="tag in report.tags" 
                :key="tag"
                class="px-2 py-1 bg-gray-100 text-xs font-medium rounded"
              >
                {{ tag }}
              </span>
            </div>

            <!-- Report Image if exists -->
            <img 
              v-if="report.image" 
              :src="report.image" 
              :alt="report.comment"
              class="mt-3 w-full h-32 object-cover rounded-lg"
            >
          </div>
        </div>

        <!-- No reports state -->
        <div v-if="liveReports.length === 0" class="text-center py-8">
          <p class="text-gray-500 mb-4">No reports yet today</p>
          <button 
            @click="showReportModal = true"
            class="px-6 py-3 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-colors"
          >
            Be the first to report
          </button>
        </div>
      </div>
    </section>

    <!-- 5 Day Forecast -->
    <section class="py-8">
      <div class="max-w-7xl mx-auto px-4">
        <h2 class="text-2xl font-black mb-6">5 Day Forecast</h2>
        
        <!-- Desktop: Table View -->
        <div class="hidden md:block overflow-x-auto">
          <table class="w-full border-2 border-black">
            <thead class="bg-black text-white">
              <tr>
                <th class="px-4 py-3 text-left">Day</th>
                <th class="px-4 py-3 text-left">Waves</th>
                <th class="px-4 py-3 text-left">Wind</th>
                <th class="px-4 py-3 text-left">Tide</th>
                <th class="px-4 py-3 text-left">Rating</th>
                <th class="px-4 py-3 text-left">Best Time</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="(day, index) in forecast" 
                :key="day.date"
                :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50'"
                class="border-t-2 border-black"
              >
                <td class="px-4 py-4">
                  <p class="font-bold">{{ day.dayName }}</p>
                  <p class="text-sm text-gray-600">{{ day.date }}</p>
                </td>
                <td class="px-4 py-4">
                  <p class="font-bold">{{ day.waveMin }}-{{ day.waveMax }} ft</p>
                  <p class="text-sm text-gray-600">{{ day.wavePeriod }}s</p>
                </td>
                <td class="px-4 py-4">
                  <p class="font-bold">{{ day.windSpeed }} {{ day.windDirection }}</p>
                  <p class="text-sm text-gray-600">{{ day.windCondition }}</p>
                </td>
                <td class="px-4 py-4">
                  <p class="text-sm">High: {{ day.highTide }}</p>
                  <p class="text-sm">Low: {{ day.lowTide }}</p>
                </td>
                <td class="px-4 py-4">
                  <div class="flex items-center gap-2">
                    <span class="text-2xl font-black">{{ day.rating }}</span>
                    <span :class="getRatingColor(day.rating)" class="text-sm">
                      {{ getRatingText(day.rating) }}
                    </span>
                  </div>
                </td>
                <td class="px-4 py-4">
                  <p class="font-bold">{{ day.bestTime }}</p>
                  <p class="text-sm text-gray-600">{{ day.bestTimeReason }}</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile: Card View -->
        <div class="md:hidden space-y-4">
          <div 
            v-for="day in forecast" 
            :key="day.date"
            class="border-2 border-black rounded-lg p-4 bg-white"
          >
            <div class="flex justify-between items-start mb-3">
              <div>
                <p class="font-bold text-lg">{{ day.dayName }}</p>
                <p class="text-sm text-gray-600">{{ day.date }}</p>
              </div>
              <div class="text-right">
                <p class="text-2xl font-black">{{ day.rating }}/10</p>
                <p :class="getRatingColor(day.rating)" class="text-sm">
                  {{ getRatingText(day.rating) }}
                </p>
              </div>
            </div>
            
            <div class="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p class="text-gray-600">Waves</p>
                <p class="font-bold">{{ day.waveMin }}-{{ day.waveMax }} ft</p>
              </div>
              <div>
                <p class="text-gray-600">Wind</p>
                <p class="font-bold">{{ day.windSpeed }} {{ day.windDirection }}</p>
              </div>
              <div>
                <p class="text-gray-600">Best Time</p>
                <p class="font-bold">{{ day.bestTime }}</p>
              </div>
              <div>
                <p class="text-gray-600">Crowd</p>
                <p class="font-bold">{{ day.crowdExpected }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Spot Information -->
    <section class="py-8 bg-gray-50 border-t-2 border-black">
      <div class="max-w-7xl mx-auto px-4">
        <h2 class="text-2xl font-black mb-6">About {{ spot.name }}</h2>
        
        <div class="grid md:grid-cols-2 gap-8">
          <!-- Spot Details -->
          <div>
            <div class="bg-white border-2 border-black rounded-lg p-6">
              <h3 class="font-bold text-lg mb-4">Spot Details</h3>
              
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-gray-600">Best Size</span>
                  <span class="font-bold">{{ spot.bestSize }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Best Wind</span>
                  <span class="font-bold">{{ spot.bestWind }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Best Tide</span>
                  <span class="font-bold">{{ spot.bestTide }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Bottom</span>
                  <span class="font-bold">{{ spot.bottom }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Difficulty</span>
                  <span class="font-bold">{{ spot.difficulty }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Crowd Factor</span>
                  <span class="font-bold">{{ spot.crowdFactor }}</span>
                </div>
              </div>
            </div>

            <!-- Hazards & Tips -->
            <div class="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6 mt-4">
              <h3 class="font-bold text-lg mb-4">⚠️ Local Knowledge</h3>
              <ul class="space-y-2">
                <li v-for="tip in spot.localTips" :key="tip" class="flex items-start gap-2">
                  <span class="text-yellow-600 mt-1">•</span>
                  <span>{{ tip }}</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Map -->
          <div>
            <div class="bg-white border-2 border-black rounded-lg p-6">
              <h3 class="font-bold text-lg mb-4">Location</h3>
              
              <!-- Map placeholder -->
              <div class="w-full h-64 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                <p class="text-gray-500">Map View</p>
              </div>
              
              <!-- Parking & Access -->
              <div class="space-y-3">
                <div>
                  <p class="font-bold mb-1">Parking</p>
                  <p class="text-gray-600">{{ spot.parking }}</p>
                </div>
                <div>
                  <p class="font-bold mb-1">Access</p>
                  <p class="text-gray-600">{{ spot.access }}</p>
                </div>
                <div>
                  <p class="font-bold mb-1">Amenities</p>
                  <div class="flex flex-wrap gap-2 mt-1">
                    <span 
                      v-for="amenity in spot.amenities" 
                      :key="amenity"
                      class="px-2 py-1 bg-gray-100 text-xs font-medium rounded"
                    >
                      {{ amenity }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Nearby Spots -->
    <section class="py-8">
      <div class="max-w-7xl mx-auto px-4">
        <h2 class="text-2xl font-black mb-6">Nearby Spots</h2>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a 
            v-for="nearbySpot in nearbySpots" 
            :key="nearbySpot.slug"
            :href="`/forecast/${nearbySpot.slug}`"
            class="border-2 border-black rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            <p class="font-bold">{{ nearbySpot.name }}</p>
            <p class="text-sm text-gray-600">{{ nearbySpot.distance }} miles</p>
            <div class="flex items-center gap-2 mt-2">
              <span class="text-lg font-black">{{ nearbySpot.currentRating }}/10</span>
              <span class="text-sm text-gray-500">now</span>
            </div>
          </a>
        </div>
      </div>
    </section>

    <AppFooter />

    <!-- Add Report Modal -->
    <ReportModal v-if="showReportModal" @close="showReportModal = false" @submit="handleReportSubmit" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// Mock data - replace with API calls
const spot = ref({
  name: 'Huntington Beach Pier',
  location: 'Orange County, California',
  bestSize: '3-6 ft',
  bestWind: 'E/NE Offshore',
  bestTide: 'Mid to High',
  bottom: 'Sand',
  difficulty: 'Beginner to Intermediate',
  crowdFactor: 'Usually Crowded',
  parking: 'Metered street parking and paid lots available',
  access: 'Easy paddle out from the beach',
  amenities: ['Showers', 'Restrooms', 'Food', 'Rentals', 'Lifeguards'],
  localTips: [
    'Best on south swells during summer',
    'Gets crowded on weekends - arrive early',
    'Watch for aggressive locals on good days',
    'North side usually less crowded than south'
  ]
})

const currentConditions = ref({
  rating: 7,
  waveHeight: '4-6',
  wavePeriod: 12,
  windSpeed: 5,
  windDirection: 'NE',
  tide: '3.2ft',
  tideDirection: 'rising',
  nextTide: 'High',
  nextTideTime: '2:30 PM'
})

const bestTime = ref({
  start: '6:00 AM',
  end: '9:00 AM',
  reason: 'Clean conditions with offshore winds before the crowd arrives',
  crowdLevel: 'Light to Moderate'
})

const liveReports = ref([
  {
    id: 1,
    user: { name: 'Jake Martinez', initials: 'JM' },
    timeAgo: '15 mins ago',
    rating: 4,
    comment: 'Fun peaks on the north side. South is a bit walled. Definitely rideable and improving with the tide.',
    tags: ['Peaky', 'Improving', 'North side'],
    image: null
  },
  {
    id: 2,
    user: { name: 'Sarah Chen', initials: 'SC' },
    timeAgo: '1 hour ago',
    rating: 3,
    comment: 'Pretty fun this morning! Some good sets coming through every 10 mins or so.',
    tags: ['Fun', 'Consistent'],
    image: '/api/placeholder/300/200'
  }
])

const forecast = ref([
  {
    date: 'Nov 18',
    dayName: 'Tomorrow',
    waveMin: 3,
    waveMax: 5,
    wavePeriod: 11,
    windSpeed: 8,
    windDirection: 'W',
    windCondition: 'Side-shore',
    highTide: '4:20 AM',
    lowTide: '10:30 AM',
    rating: 6,
    bestTime: '6-8 AM',
    bestTimeReason: 'Morning glass',
    crowdExpected: 'Moderate'
  },
  {
    date: 'Nov 19',
    dayName: 'Wednesday',
    waveMin: 4,
    waveMax: 6,
    wavePeriod: 13,
    windSpeed: 5,
    windDirection: 'NE',
    windCondition: 'Offshore',
    highTide: '5:10 AM',
    lowTide: '11:20 AM',
    rating: 8,
    bestTime: '6-10 AM',
    bestTimeReason: 'Clean & offshore',
    crowdExpected: 'Heavy'
  },
  // Add more days...
])

const nearbySpots = ref([
  { name: 'HB Cliffs', slug: 'hb-cliffs', distance: 0.5, currentRating: 6 },
  { name: 'Bolsa Chica', slug: 'bolsa-chica', distance: 2, currentRating: 7 },
  { name: 'Seal Beach Pier', slug: 'seal-beach', distance: 4, currentRating: 5 },
  { name: 'Newport Pier', slug: 'newport-pier', distance: 6, currentRating: 8 }
])

const activeUsers = ref(47)
const lastUpdated = ref('2 mins ago')
const isFavorite = ref(false)
const showReportModal = ref(false)

// Helper functions
const getRatingColor = (rating) => {
  if (rating >= 7) return 'text-green-600 font-bold'
  if (rating >= 5) return 'text-yellow-600 font-bold'
  return 'text-red-600 font-bold'
}

const getRatingText = (rating) => {
  if (rating >= 8) return 'EPIC'
  if (rating >= 7) return 'GOOD'
  if (rating >= 5) return 'FAIR'
  if (rating >= 3) return 'POOR'
  return 'FLAT'
}

const getWindCondition = (direction) => {
  // Logic to determine if wind is offshore, onshore, etc based on spot orientation
  if (['N', 'NE', 'E'].includes(direction)) return 'Offshore ✓'
  if (['S', 'SW', 'W'].includes(direction)) return 'Onshore ✗'
  return 'Side-shore'
}

const handleReportSubmit = (reportData) => {
  console.log('New report:', reportData)
  // Add to reports, send to API, etc.
  showReportModal.value = false
}
</script>