<template>
  <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-100 mb-6">
    <h3 class="font-bold text-lg mb-4">Spot Info</h3>
    
    <div class="space-y-4">
      <div>
        <p class="text-sm font-semibold mb-1">Skill Level</p>
        <p class="text-sm text-gray-600">{{ spot.skill_level || 'Unknown' }}</p>
      </div>
      
      <div>
        <p class="text-sm font-semibold mb-1">Best Tide</p>
        <p class="text-sm text-gray-600">{{ spot.best_tide || 'Unknown' }}</p>
      </div>
      
      <div>
        <p class="text-sm font-semibold mb-1">Best Swell</p>
        <p class="text-sm text-gray-600">{{ spot.best_swell_direction?.join(', ') || 'Unknown' }}</p>
      </div>
      
      <div>
        <p class="text-sm font-semibold mb-1">Best Wind</p>
        <p class="text-sm text-gray-600">{{ spot.best_wind_direction?.join(', ') || 'Unknown' }}</p>
      </div>
      
      <div>
        <p class="text-sm font-semibold mb-1">Access</p>
        <p class="text-sm text-gray-600">{{ spot.access_type || 'Unknown' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  spot: {
    type: Object,
    required: true
  }
})
</script>
