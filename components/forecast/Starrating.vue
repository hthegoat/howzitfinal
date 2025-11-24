<template>
  <div class="flex items-center gap-2">
    <!-- Stars -->
    <div class="flex items-center">
      <span 
        v-for="star in 5" 
        :key="star"
        class="text-2xl"
        :class="getStarClass(star)"
      >
        {{ getStarIcon(star) }}
      </span>
    </div>
    
    <!-- Numeric Rating -->
    <span class="text-xl font-bold">
      {{ formattedRating }}/5
    </span>
    
    <!-- Text Label (optional) -->
    <span 
      v-if="showLabel"
      class="px-3 py-1 rounded-full text-sm font-bold"
      :class="getLabelClass()"
    >
      {{ getRatingLabel() }}
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  rating: {
    type: Number,
    required: true
  },
  showLabel: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'md', // sm, md, lg
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  }
})

const formattedRating = computed(() => {
  if (props.rating === null || props.rating === undefined) return 'N/A'
  return props.rating.toFixed(1)
})

const getStarIcon = (position) => {
  const rating = props.rating || 0
  
  if (position <= Math.floor(rating)) {
    return '⭐' // Full star
  } else if (position === Math.ceil(rating) && rating % 1 >= 0.5) {
    return '⭐' // Half star (using full for now, can use different icon)
  } else {
    return '☆' // Empty star
  }
}

const getStarClass = (position) => {
  const rating = props.rating || 0
  
  if (position <= rating) {
    return 'text-yellow-400'
  } else {
    return 'text-gray-300'
  }
}

const getRatingLabel = () => {
  const rating = props.rating || 0
  
  if (rating >= 4.5) return 'FIRING! 🔥'
  if (rating >= 4.0) return 'EXCELLENT'
  if (rating >= 3.5) return 'GOOD'
  if (rating >= 3.0) return 'FAIR'
  if (rating >= 2.0) return 'POOR'
  return 'FLAT'
}

const getLabelClass = () => {
  const rating = props.rating || 0
  
  if (rating >= 4.0) return 'bg-green-100 text-green-800'
  if (rating >= 3.0) return 'bg-yellow-100 text-yellow-800'
  if (rating >= 2.0) return 'bg-orange-100 text-orange-800'
  return 'bg-red-100 text-red-800'
}
</script>