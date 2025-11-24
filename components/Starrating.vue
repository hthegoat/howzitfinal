<template>
  <div class="flex gap-0.5">
    <svg 
      v-for="i in max" 
      :key="i"
      class="w-4 h-4" 
      viewBox="0 0 24 24" 
      :fill="i <= rating ? '#000' : '#e5e7eb'"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  </div>
</template>

<script setup>
defineProps({
  rating: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: 5
  }
})
</script>