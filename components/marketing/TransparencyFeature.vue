<template>
  <div 
    :class="[
      'relative p-6 md:p-8 border-3 border-black rounded-lg bg-white',
      'transition-all duration-200',
      'hover:shadow-brutal hover:-translate-x-1 hover:-translate-y-1',
      featured ? 'ring-4 ring-coral ring-offset-2' : ''
    ]"
  >
    <!-- Icon -->
    <div 
      :class="[
        'w-14 h-14 md:w-16 md:h-16 rounded-lg flex items-center justify-center mb-4',
        'border-3 border-black',
        iconBackgroundClass
      ]"
    >
      <component 
        :is="iconComponent" 
        class="w-7 h-7 md:w-8 md:h-8"
        :class="iconColorClass"
      />
    </div>

    <!-- Title -->
    <h3 class="font-display text-2xl md:text-3xl uppercase tracking-tight mb-3">
      {{ title }}
    </h3>

    <!-- Description -->
    <p class="font-body text-gray-700 leading-relaxed">
      <slot />
    </p>

    <!-- Optional badge -->
    <div 
      v-if="badge" 
      class="absolute -top-2 -right-2 px-3 py-1 bg-coral text-white text-xs font-bold uppercase rounded-full shadow-brutal-sm"
    >
      {{ badge }}
    </div>

    <!-- Bottom accent line -->
    <div 
      :class="[
        'absolute bottom-0 left-6 right-6 h-1',
        accentColorClass
      ]"
      aria-hidden="true"
    />
  </div>
</template>

<script setup>
// Icon imports - using simple SVG components inline
const IconChart = {
  template: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>`
}

const IconWave = {
  template: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>`
}

const IconShield = {
  template: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>`
}

const IconEye = {
  template: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>`
}

const IconMap = {
  template: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>`
}

const IconCheck = {
  template: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>`
}

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: 'chart',
    validator: (v) => ['chart', 'wave', 'shield', 'eye', 'map', 'check'].includes(v)
  },
  color: {
    type: String,
    default: 'coral',
    validator: (v) => ['coral', 'ocean', 'trust', 'ink'].includes(v)
  },
  badge: {
    type: String,
    default: null
  },
  featured: {
    type: Boolean,
    default: false
  }
})

const iconMap = {
  chart: IconChart,
  wave: IconWave,
  shield: IconShield,
  eye: IconEye,
  map: IconMap,
  check: IconCheck,
}

const iconComponent = computed(() => iconMap[props.icon])

const iconBackgroundClass = computed(() => {
  const map = {
    coral: 'bg-coral/10',
    ocean: 'bg-ocean/10',
    trust: 'bg-trust/10',
    ink: 'bg-ink/10',
  }
  return map[props.color]
})

const iconColorClass = computed(() => {
  const map = {
    coral: 'text-coral',
    ocean: 'text-ocean',
    trust: 'text-trust',
    ink: 'text-ink',
  }
  return map[props.color]
})

const accentColorClass = computed(() => {
  const map = {
    coral: 'bg-coral',
    ocean: 'bg-ocean',
    trust: 'bg-trust',
    ink: 'bg-ink',
  }
  return map[props.color]
})
</script>
