<template>
  <div 
    :class="[
      'relative w-full overflow-hidden',
      heightClass
    ]"
    aria-hidden="true"
  >
    <svg
      :class="[
        'absolute w-full h-full',
        flipClass
      ]"
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
    >
      <!-- Torn paper edge pattern -->
      <path 
        v-if="variant === 'torn'"
        :d="tornPath"
        :fill="fillColor"
      />
      
      <!-- Wave pattern -->
      <path 
        v-else-if="variant === 'wave'"
        :d="wavePath"
        :fill="fillColor"
      />
      
      <!-- Jagged pattern -->
      <path 
        v-else-if="variant === 'jagged'"
        :d="jaggedPath"
        :fill="fillColor"
      />

      <!-- Simple diagonal -->
      <path 
        v-else
        :d="diagonalPath"
        :fill="fillColor"
      />
    </svg>
  </div>
</template>

<script setup>
const props = defineProps({
  variant: {
    type: String,
    default: 'torn',
    validator: (v) => ['torn', 'wave', 'jagged', 'diagonal'].includes(v)
  },
  color: {
    type: String,
    default: 'white',
    validator: (v) => ['white', 'paper', 'ink', 'coral', 'ocean', 'foam'].includes(v)
  },
  flip: {
    type: Boolean,
    default: false
  },
  height: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v)
  }
})

const fillColor = computed(() => {
  const map = {
    white: '#ffffff',
    paper: '#f5f2eb',
    ink: '#0a0a0a',
    coral: '#ff6b4a',
    ocean: '#0066cc',
    foam: '#e8f4f8',
  }
  return map[props.color]
})

const heightClass = computed(() => {
  const map = {
    sm: 'h-8 md:h-12',
    md: 'h-12 md:h-20',
    lg: 'h-20 md:h-32',
  }
  return map[props.height]
})

const flipClass = computed(() => {
  return props.flip ? 'rotate-180' : ''
})

// SVG paths
const tornPath = `M0,0 
  L48,8 L96,3 L144,12 L192,5 L240,15 L288,7 L336,18 L384,9 L432,20 
  L480,11 L528,22 L576,13 L624,24 L672,15 L720,26 L768,17 L816,28 
  L864,19 L912,30 L960,21 L1008,32 L1056,23 L1104,34 L1152,25 L1200,36
  L1200,120 L0,120 Z`

const wavePath = `M0,0 
  C150,40 350,0 500,30 
  C650,60 700,20 900,40 
  C1050,55 1100,30 1200,50
  L1200,120 L0,120 Z`

const jaggedPath = `M0,0 
  L60,24 L120,8 L180,32 L240,12 L300,36 L360,16 L420,40 
  L480,20 L540,44 L600,24 L660,48 L720,28 L780,52 
  L840,32 L900,56 L960,36 L1020,60 L1080,40 L1140,64 L1200,44
  L1200,120 L0,120 Z`

const diagonalPath = `M0,0 L1200,60 L1200,120 L0,120 Z`
</script>
