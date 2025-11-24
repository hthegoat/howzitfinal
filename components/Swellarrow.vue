<template>
  <svg 
    class="w-4 h-4 text-gray-600" 
    viewBox="0 0 24 24" 
    fill="currentColor"
    :style="{ transform: `rotate(${degrees}deg)` }"
  >
    <path d="M12 2L6 14h12L12 2z" />
  </svg>
</template>

<script setup>
defineProps({
  degrees: {
    type: Number,
    default: 0
  }
})
</script>