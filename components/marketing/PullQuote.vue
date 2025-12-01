<template>
  <blockquote 
    :class="[
      'relative',
      alignClasses
    ]"
  >
    <!-- Large quotation mark -->
    <span 
      :class="[
        'absolute font-display text-[8rem] md:text-[12rem] leading-none opacity-10 select-none pointer-events-none',
        '-top-8 md:-top-12',
        align === 'center' ? 'left-1/2 -translate-x-1/2' : '-left-4 md:-left-8'
      ]"
      aria-hidden="true"
    >
      "
    </span>

    <!-- Quote text -->
    <p 
      :class="[
        'relative z-10 font-display uppercase tracking-tight',
        sizeClasses
      ]"
    >
      <slot />
    </p>

    <!-- Attribution (optional) -->
    <footer v-if="attribution" class="mt-4 md:mt-6">
      <cite class="font-body text-lg md:text-xl not-italic text-gray-600">
        — {{ attribution }}
      </cite>
    </footer>

    <!-- Accent bar -->
    <div 
      v-if="showBar"
      :class="[
        'mt-6 h-1 w-24',
        barColorClass,
        align === 'center' ? 'mx-auto' : ''
      ]"
      aria-hidden="true"
    />
  </blockquote>
</template>

<script setup>
const props = defineProps({
  size: {
    type: String,
    default: 'lg',
    validator: (v) => ['md', 'lg', 'xl'].includes(v)
  },
  align: {
    type: String,
    default: 'left',
    validator: (v) => ['left', 'center'].includes(v)
  },
  attribution: {
    type: String,
    default: null
  },
  showBar: {
    type: Boolean,
    default: true
  },
  barColor: {
    type: String,
    default: 'coral',
    validator: (v) => ['coral', 'ocean', 'ink'].includes(v)
  }
})

const sizeClasses = computed(() => {
  const map = {
    md: 'text-2xl md:text-3xl',
    lg: 'text-3xl md:text-4xl lg:text-5xl',
    xl: 'text-4xl md:text-5xl lg:text-6xl',
  }
  return map[props.size]
})

const alignClasses = computed(() => {
  return props.align === 'center' ? 'text-center' : 'text-left'
})

const barColorClass = computed(() => {
  const map = {
    coral: 'bg-coral',
    ocean: 'bg-ocean',
    ink: 'bg-ink',
  }
  return map[props.barColor]
})
</script>
