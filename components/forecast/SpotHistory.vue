<template>
  <div class="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
    <!-- Image -->
    <div class="relative h-48 sm:h-56 md:h-64">
      <img 
        v-if="spot.photo_url"
        :src="spot.photo_url" 
        :alt="spot.name"
        class="w-full h-full object-cover"
      />
      <div v-else class="w-full h-full bg-gray-100 flex items-center justify-center">
        <span class="text-gray-400">No image available</span>
      </div>
      
      <!-- Gradient overlay with title -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div class="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
        <h3 class="text-white font-bold text-xl sm:text-2xl">About {{ spot.name }}</h3>
        <p class="text-white/80 text-sm">{{ spot.region }}, {{ spot.state }}</p>
      </div>
    </div>

    <!-- Description -->
    <div class="p-4 sm:p-6">
      <p class="text-gray-700 leading-relaxed text-sm sm:text-base">
        {{ spot.description }}
      </p>
      
      <!-- Quick facts row -->
      <div v-if="spot.orientation" class="mt-4 pt-4 border-t border-gray-100">
        <div class="flex flex-wrap gap-3">
          <div class="flex items-center gap-1.5 text-xs sm:text-sm text-gray-500">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
            <span>Faces {{ formatOrientation(spot.orientation) }}</span>
          </div>
          <div v-if="spot.buoy_id" class="flex items-center gap-1.5 text-xs sm:text-sm text-gray-500">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span>Buoy {{ spot.buoy_id }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  spot: {
    type: Object,
    required: true
  }
})

const formatOrientation = (degrees) => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  const index = Math.round(degrees / 45) % 8
  return directions[index]
}
</script>