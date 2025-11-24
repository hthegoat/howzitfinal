<template>
  <div 
    class="w-6 h-6 rounded flex items-center justify-center"
    :style="{ backgroundColor: windColor }"
  >
    <svg 
      class="w-3 h-3 text-white" 
      viewBox="0 0 24 24" 
      fill="currentColor"
      :style="{ transform: `rotate(${degrees}deg)` }"
    >
      <path d="M12 2L6 12h4v10h4V12h4L12 2z" />
    </svg>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  degrees: {
    type: Number,
    default: 0
  },
  speed: {
    type: Number,
    default: 0
  }
})

const windColor = computed(() => {
  if (props.speed <= 10) return '#22c55e'  // green - light
  if (props.speed <= 18) return '#eab308'  // yellow - moderate
  return '#ef4444'                          // red - strong
})
</script>