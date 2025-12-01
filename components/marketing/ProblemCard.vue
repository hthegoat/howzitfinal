<template>
  <div 
    :class="[
      'group relative p-4 md:p-5 border-3 border-black rounded-lg transition-all duration-200',
      'hover:shadow-brutal hover:-translate-x-0.5 hover:-translate-y-0.5',
      backgroundClass
    ]"
  >
    <!-- X Icon -->
    <div 
      class="absolute -top-2 -left-2 w-8 h-8 bg-distrust rounded-full flex items-center justify-center shadow-brutal-sm"
      aria-hidden="true"
    >
      <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </div>

    <!-- Content -->
    <div class="pl-4">
      <p class="font-body font-semibold text-lg md:text-xl text-ink leading-tight">
        <slot />
      </p>
      
      <!-- Optional subtext -->
      <p v-if="$slots.subtext" class="mt-2 text-sm text-gray-600 font-body">
        <slot name="subtext" />
      </p>
    </div>

    <!-- Strikethrough line on hover -->
    <div 
      class="absolute inset-x-4 top-1/2 h-0.5 bg-distrust origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
      aria-hidden="true"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: (v) => ['default', 'muted'].includes(v)
  }
})

const backgroundClass = computed(() => {
  return props.variant === 'muted' ? 'bg-gray-50' : 'bg-white'
})
</script>
