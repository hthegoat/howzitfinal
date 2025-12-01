<template>
  <section 
    :class="[
      'relative overflow-hidden',
      paddingClasses,
      backgroundClasses
    ]"
  >
    <!-- Background Pattern Overlay -->
    <div 
      v-if="pattern" 
      :class="patternClasses"
      aria-hidden="true"
    />
    
    <!-- Content -->
    <div :class="['relative z-10', containerClass ? 'container mx-auto px-4 md:px-6' : '']">
      <slot />
    </div>

    <!-- Optional decorative elements -->
    <slot name="decoration" />
  </section>
</template>

<script setup>
const props = defineProps({
  // Background variants
  background: {
    type: String,
    default: 'white',
    validator: (v) => ['white', 'paper', 'ink', 'coral', 'ocean', 'foam', 'sand'].includes(v)
  },
  // Overlay pattern
  pattern: {
    type: String,
    default: null,
    validator: (v) => [null, 'halftone', 'diagonal', 'wave', 'dots'].includes(v)
  },
  // Padding size
  padding: {
    type: String,
    default: 'lg',
    validator: (v) => ['none', 'sm', 'md', 'lg', 'xl'].includes(v)
  },
  // Use container
  containerClass: {
    type: Boolean,
    default: true
  }
})

const backgroundClasses = computed(() => {
  const map = {
    white: 'bg-white',
    paper: 'bg-paper',
    ink: 'bg-ink text-white',
    coral: 'bg-coral text-white',
    ocean: 'bg-ocean text-white',
    foam: 'bg-foam',
    sand: 'bg-sand',
  }
  return map[props.background]
})

const paddingClasses = computed(() => {
  const map = {
    none: '',
    sm: 'py-8 md:py-12',
    md: 'py-12 md:py-16',
    lg: 'py-16 md:py-24',
    xl: 'py-24 md:py-32',
  }
  return map[props.padding]
})

const patternClasses = computed(() => {
  const base = 'absolute inset-0 pointer-events-none'
  const patterns = {
    halftone: `${base} bg-halftone bg-halftone opacity-30`,
    diagonal: `${base} bg-diagonal-lines`,
    wave: `${base} bg-wave-pattern`,
    dots: `${base} bg-halftone bg-halftone opacity-20`,
  }
  return patterns[props.pattern]
})
</script>
