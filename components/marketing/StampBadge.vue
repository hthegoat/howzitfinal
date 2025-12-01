<template>
  <div 
    :class="[
      'inline-flex items-center justify-center',
      'px-4 py-2 md:px-6 md:py-3',
      'font-display text-sm md:text-base uppercase tracking-wider',
      'border-3 rounded',
      'transform transition-transform hover:scale-105',
      rotationClass,
      variantClasses,
      props.class
    ]"
    :style="{ 
      clipPath: rough ? 'polygon(2% 5%, 97% 0%, 100% 95%, 3% 100%)' : 'none' 
    }"
  >
    <!-- Icon (optional) -->
    <svg 
      v-if="icon === 'check'" 
      class="w-4 h-4 md:w-5 md:h-5 mr-2" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor" 
      stroke-width="3"
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
    </svg>
    <svg 
      v-else-if="icon === 'star'" 
      class="w-4 h-4 md:w-5 md:h-5 mr-2" 
      fill="currentColor" 
      viewBox="0 0 24 24"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
    <svg 
      v-else-if="icon === 'lock'" 
      class="w-4 h-4 md:w-5 md:h-5 mr-2" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor" 
      stroke-width="2"
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
    
    <span><slot /></span>
  </div>
</template>

<script setup>
const props = defineProps({
  variant: {
    type: String,
    default: 'coral',
    validator: (v) => ['coral', 'ocean', 'trust', 'ink', 'outline'].includes(v)
  },
  rotation: {
    type: String,
    default: 'left',
    validator: (v) => ['none', 'left', 'right'].includes(v)
  },
  icon: {
    type: String,
    default: null,
    validator: (v) => [null, 'check', 'star', 'lock'].includes(v)
  },
  rough: {
    type: Boolean,
    default: true
  },
  class: {
    type: String,
    default: ''
  }
})

const variantClasses = computed(() => {
  const map = {
    coral: 'bg-coral text-white border-coral-dark shadow-brutal-sm',
    ocean: 'bg-ocean text-white border-ocean-dark shadow-brutal-sm',
    trust: 'bg-trust text-white border-trust-dark shadow-brutal-sm',
    ink: 'bg-ink text-white border-ink shadow-brutal-sm',
    outline: 'bg-transparent text-ink border-ink',
  }
  return map[props.variant]
})

const rotationClass = computed(() => {
  const map = {
    none: '',
    left: '-rotate-3',
    right: 'rotate-3',
  }
  return map[props.rotation]
})
</script>
