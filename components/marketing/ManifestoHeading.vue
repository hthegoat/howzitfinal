<template>
  <component 
    :is="tag" 
    :class="[
      'font-display uppercase tracking-tight',
      sizeClasses,
      alignClasses,
      props.class
    ]"
  >
    <slot />
    
    <!-- Highlighted word (optional) -->
    <span 
      v-if="highlight"
      :class="highlightClasses"
    >
      {{ highlight }}
    </span>
    
    <!-- Strikethrough word (optional) -->
    <span 
      v-if="strikethrough"
      class="relative inline-block"
    >
      <span class="relative z-10 text-gray-400">{{ strikethrough }}</span>
      <span 
        class="absolute left-0 right-0 top-1/2 h-1 md:h-2 bg-distrust -rotate-2 z-20"
        aria-hidden="true"
      />
    </span>
  </component>
</template>

<script setup>
const props = defineProps({
  tag: {
    type: String,
    default: 'h2'
  },
  size: {
    type: String,
    default: 'lg',
    validator: (v) => ['md', 'lg', 'xl'].includes(v)
  },
  align: {
    type: String,
    default: 'left',
    validator: (v) => ['left', 'center', 'right'].includes(v)
  },
  highlight: {
    type: String,
    default: null
  },
  highlightColor: {
    type: String,
    default: 'coral',
    validator: (v) => ['coral', 'ocean', 'trust'].includes(v)
  },
  strikethrough: {
    type: String,
    default: null
  },
  class: {
    type: String,
    default: ''
  }
})

const sizeClasses = computed(() => {
  const map = {
    md: 'text-display-md',
    lg: 'text-display-lg',
    xl: 'text-display-xl',
  }
  return map[props.size]
})

const alignClasses = computed(() => {
  const map = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }
  return map[props.align]
})

const highlightClasses = computed(() => {
  const colors = {
    coral: 'bg-coral text-white',
    ocean: 'bg-ocean text-white',
    trust: 'bg-trust text-white',
  }
  return `inline-block px-2 md:px-4 -mx-1 -rotate-1 ${colors[props.highlightColor]}`
})
</script>
