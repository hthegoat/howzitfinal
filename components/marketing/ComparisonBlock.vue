<template>
  <div class="border-3 border-black rounded-lg overflow-hidden bg-white">
    <!-- Header Row -->
    <div class="grid grid-cols-2">
      <div class="p-4 md:p-6 bg-distrust/10 border-r-3 border-b-3 border-black">
        <div class="flex items-center gap-2">
          <svg class="w-6 h-6 text-distrust" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span class="font-display text-xl md:text-2xl uppercase text-distrust">{{ themLabel }}</span>
        </div>
      </div>
      <div class="p-4 md:p-6 bg-trust/10 border-b-3 border-black">
        <div class="flex items-center gap-2">
          <svg class="w-6 h-6 text-trust" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span class="font-display text-xl md:text-2xl uppercase text-trust">{{ usLabel }}</span>
        </div>
      </div>
    </div>

    <!-- Comparison Rows -->
    <div 
      v-for="(item, index) in items" 
      :key="index"
      :class="[
        'grid grid-cols-2',
        index !== items.length - 1 ? 'border-b-2 border-gray-200' : ''
      ]"
    >
      <!-- Them Column -->
      <div class="p-4 md:p-5 border-r-3 border-black bg-gray-50/50">
        <p class="font-body text-gray-600 line-through decoration-distrust decoration-2">
          {{ item.them }}
        </p>
      </div>
      
      <!-- Us Column -->
      <div class="p-4 md:p-5 bg-white">
        <p class="font-body font-medium text-ink">
          {{ item.us }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  themLabel: {
    type: String,
    default: 'Them'
  },
  usLabel: {
    type: String,
    default: 'Howzit'
  },
  items: {
    type: Array,
    required: true,
    // Each item: { them: string, us: string }
  }
})
</script>
