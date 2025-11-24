<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b-3 border-black">
      <div class="container mx-auto px-4 py-4">
        <NuxtLink to="/" class="text-2xl font-black">HOWZIT</NuxtLink>
      </div>
    </header>

    <div class="container mx-auto px-4 py-12">
      <h1 class="text-4xl md:text-6xl font-black mb-4">Surf Forecasts</h1>
      <p class="text-xl text-gray-600 mb-12">
        Real-time conditions from NOAA buoys
      </p>

      <!-- Spot Grid -->
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <NuxtLink 
          v-for="spot in spots" 
          :key="spot.slug"
          :to="`/forecast/${spot.slug}`"
          class="bg-white border-3 border-black rounded-lg p-6 hover:bg-gray-50 transition-colors"
        >
          <h2 class="text-2xl font-black mb-2">{{ spot.name }}</h2>
          <p class="text-gray-600 text-sm mb-4">{{ spot.location }}</p>
          
          <div class="flex items-center justify-between">
            <span class="text-sm font-bold text-gray-500">View Forecast →</span>
          </div>
        </NuxtLink>
      </div>

      <!-- Coming Soon -->
      <div class="mt-12 text-center">
        <p class="text-gray-600">
          More spots coming soon! 🌊
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  auth: false
})

// Available spots - expand this list as you add more
const spots = [
  { 
    name: 'Manasquan',
    slug: 'manasquan',
    location: 'Manasquan, NJ',
    buoy: '44065'
  },
  { 
    name: 'Belmar',
    slug: 'belmar',
    location: 'Belmar, NJ',
    buoy: '44065'
  },
  { 
    name: 'Spring Lake',
    slug: 'spring-lake',
    location: 'Spring Lake, NJ',
    buoy: '44065'
  },
  { 
    name: 'Point Pleasant',
    slug: 'point-pleasant',
    location: 'Point Pleasant, NJ',
    buoy: '44065'
  },
  { 
    name: 'Seaside Heights',
    slug: 'seaside-heights',
    location: 'Seaside Heights, NJ',
    buoy: '44065'
  },
  { 
    name: 'Long Beach Island',
    slug: 'long-beach-island',
    location: 'LBI, NJ',
    buoy: '44065'
  },
  { 
    name: 'Atlantic City',
    slug: 'atlantic-city',
    location: 'Atlantic City, NJ',
    buoy: '44009'
  },
  { 
    name: 'Ocean City',
    slug: 'ocean-city',
    location: 'Ocean City, NJ',
    buoy: '44009'
  },
  { 
    name: 'Cape May',
    slug: 'cape-may',
    location: 'Cape May, NJ',
    buoy: '44009'
  }
]
</script>