<template>
  <span 
    :class="[
      'inline-flex items-center gap-1.5',
      'px-2.5 py-1 md:px-3 md:py-1.5',
      'text-xs md:text-sm font-bold uppercase tracking-wide',
      'rounded-full border-2',
      variantClasses
    ]"
  >
    <!-- Pulse dot for live indicators -->
    <span 
      v-if="pulse" 
      class="relative flex h-2 w-2"
    >
      <span 
        :class="[
          'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
          pulseColorClass
        ]"
      />
      <span 
        :class="[
          'relative inline-flex rounded-full h-2 w-2',
          dotColorClass
        ]"
      />
    </span>

    <!-- Static dot -->
    <span 
      v-else-if="dot" 
      :class="[
        'w-2 h-2 rounded-full',
        dotColorClass
      ]"
    />

    <slot />
  </span>
</template>

<script setup>
const props = defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: (v) => ['default', 'success', 'warning', 'info', 'dark'].includes(v)
  },
  pulse: {
    type: Boolean,
    default: false
  },
  dot: {
    type: Boolean,
    default: false
  }
})

const variantClasses = computed(() => {
  const map = {
    default: 'bg-gray-100 text-gray-700 border-gray-300',
    success: 'bg-trust/10 text-trust-dark border-trust',
    warning: 'bg-warning/10 text-warning border-warning',
    info: 'bg-ocean/10 text-ocean-dark border-ocean',
    dark: 'bg-ink text-white border-ink',
  }
  return map[props.variant]
})

const pulseColorClass = computed(() => {
  const map = {
    default: 'bg-gray-400',
    success: 'bg-trust',
    warning: 'bg-warning',
    info: 'bg-ocean',
    dark: 'bg-white',
  }
  return map[props.variant]
})

const dotColorClass = computed(() => {
  const map = {
    default: 'bg-gray-500',
    success: 'bg-trust',
    warning: 'bg-warning',
    info: 'bg-ocean',
    dark: 'bg-white',
  }
  return map[props.variant]
})
</script>
