<template>
  <div :class="['text-center', props.class]">
    <!-- Number -->
    <div 
      :class="[
        'font-display tracking-tight',
        sizeClasses,
        colorClasses
      ]"
    >
      <span v-if="prefix" class="text-[0.6em] opacity-60">{{ prefix }}</span>
      <span>{{ displayValue }}</span>
      <span v-if="suffix" class="text-[0.6em] opacity-60">{{ suffix }}</span>
    </div>

    <!-- Label -->
    <div 
      :class="[
        'font-body font-medium uppercase tracking-wider',
        labelSizeClass,
        labelColorClass
      ]"
    >
      {{ label }}
    </div>

    <!-- Optional subtext -->
    <p 
      v-if="subtext"
      :class="[
        'mt-1 font-body text-sm',
        subtextColorClass
      ]"
    >
      {{ subtext }}
    </p>
  </div>
</template>

<script setup>
const props = defineProps({
  value: {
    type: [Number, String],
    required: true
  },
  label: {
    type: String,
    required: true
  },
  prefix: {
    type: String,
    default: null
  },
  suffix: {
    type: String,
    default: null
  },
  subtext: {
    type: String,
    default: null
  },
  size: {
    type: String,
    default: 'lg',
    validator: (v) => ['md', 'lg', 'xl'].includes(v)
  },
  color: {
    type: String,
    default: 'ink',
    validator: (v) => ['ink', 'coral', 'ocean', 'white'].includes(v)
  },
  animate: {
    type: Boolean,
    default: false
  },
  class: {
    type: String,
    default: ''
  }
})

const displayValue = computed(() => {
  if (typeof props.value === 'number') {
    return props.value.toLocaleString()
  }
  return props.value
})

const sizeClasses = computed(() => {
  const map = {
    md: 'text-4xl md:text-5xl',
    lg: 'text-5xl md:text-6xl lg:text-7xl',
    xl: 'text-6xl md:text-7xl lg:text-8xl',
  }
  return map[props.size]
})

const colorClasses = computed(() => {
  const map = {
    ink: 'text-ink',
    coral: 'text-coral',
    ocean: 'text-ocean',
    white: 'text-white',
  }
  return map[props.color]
})

const labelSizeClass = computed(() => {
  const map = {
    md: 'text-xs md:text-sm mt-1',
    lg: 'text-sm md:text-base mt-2',
    xl: 'text-base md:text-lg mt-2',
  }
  return map[props.size]
})

const labelColorClass = computed(() => {
  const map = {
    ink: 'text-gray-600',
    coral: 'text-coral-dark',
    ocean: 'text-ocean-dark',
    white: 'text-white/70',
  }
  return map[props.color]
})

const subtextColorClass = computed(() => {
  const map = {
    ink: 'text-gray-500',
    coral: 'text-coral-dark/70',
    ocean: 'text-ocean-dark/70',
    white: 'text-white/50',
  }
  return map[props.color]
})
</script>
