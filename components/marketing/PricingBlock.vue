<template>
  <div 
    :class="[
      'relative overflow-hidden',
      'border-3 border-black rounded-lg',
      backgroundClass
    ]"
  >
    <!-- Corner ribbon -->
    <div 
      v-if="ribbon"
      class="absolute top-0 right-0 overflow-hidden w-24 h-24"
    >
      <div 
        class="absolute transform rotate-45 bg-coral text-white text-xs font-bold uppercase tracking-wider py-1 right-[-35px] top-[20px] w-[140px] text-center shadow-md"
      >
        {{ ribbon }}
      </div>
    </div>

    <div class="p-6 md:p-8">
      <!-- Header -->
      <div class="mb-6">
        <h3 class="font-display text-2xl md:text-3xl uppercase mb-1">
          {{ title }}
        </h3>
        <p v-if="subtitle" class="font-body text-gray-600">
          {{ subtitle }}
        </p>
      </div>

      <!-- Price Display -->
      <div class="flex items-baseline gap-1 mb-6">
        <span class="font-display text-5xl md:text-6xl">
          {{ displayPrice }}
        </span>
        <span v-if="period" class="font-body text-gray-600 text-lg">
          /{{ period }}
        </span>
        <span v-if="originalPrice" class="ml-3 font-body text-xl text-gray-400 line-through">
          {{ originalPrice }}
        </span>
      </div>

      <!-- Features List -->
      <div class="space-y-3 mb-8">
        <div 
          v-for="(feature, index) in features" 
          :key="index"
          class="flex items-center gap-3"
        >
          <svg 
            class="w-5 h-5 flex-shrink-0" 
            :class="feature.included ? 'text-trust' : 'text-gray-300'"
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            stroke-width="2.5"
          >
            <path 
              v-if="feature.included"
              stroke-linecap="round" 
              stroke-linejoin="round" 
              d="M5 13l4 4L19 7" 
            />
            <path 
              v-else
              stroke-linecap="round" 
              stroke-linejoin="round" 
              d="M6 18L18 6M6 6l12 12" 
            />
          </svg>
          <span 
            :class="[
              'font-body',
              feature.included ? 'text-ink' : 'text-gray-400'
            ]"
          >
            {{ feature.text }}
          </span>
          <DataBadge 
            v-if="feature.badge" 
            :variant="feature.badgeVariant || 'default'"
          >
            {{ feature.badge }}
          </DataBadge>
        </div>
      </div>

      <!-- CTA Button -->
      <button
        v-if="ctaText"
        :class="[
          'w-full py-4 px-6',
          'font-display text-lg uppercase tracking-wide',
          'border-3 border-black rounded-lg',
          'transition-all duration-200',
          'hover:shadow-brutal hover:-translate-x-0.5 hover:-translate-y-0.5',
          ctaVariantClass
        ]"
        @click="$emit('cta-click')"
      >
        {{ ctaText }}
      </button>

      <!-- Footer note -->
      <p 
        v-if="note"
        class="mt-4 text-center text-sm text-gray-500 font-body"
      >
        {{ note }}
      </p>
    </div>

    <!-- Bottom accent -->
    <div 
      :class="[
        'h-2',
        accentColorClass
      ]"
    />
  </div>
</template>

<script setup>
import DataBadge from './DataBadge.vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: null
  },
  price: {
    type: [String, Number],
    required: true
  },
  originalPrice: {
    type: String,
    default: null
  },
  period: {
    type: String,
    default: null
  },
  features: {
    type: Array,
    required: true,
    // Each: { text: string, included: boolean, badge?: string, badgeVariant?: string }
  },
  ctaText: {
    type: String,
    default: null
  },
  ctaVariant: {
    type: String,
    default: 'primary',
    validator: (v) => ['primary', 'secondary'].includes(v)
  },
  ribbon: {
    type: String,
    default: null
  },
  note: {
    type: String,
    default: null
  },
  highlighted: {
    type: Boolean,
    default: false
  },
  accentColor: {
    type: String,
    default: 'coral',
    validator: (v) => ['coral', 'ocean', 'trust', 'ink'].includes(v)
  }
})

defineEmits(['cta-click'])

const displayPrice = computed(() => {
  if (props.price === 0 || props.price === '0') return 'Free'
  if (typeof props.price === 'number') return `$${props.price}`
  return props.price
})

const backgroundClass = computed(() => {
  return props.highlighted ? 'bg-foam' : 'bg-white'
})

const ctaVariantClass = computed(() => {
  return props.ctaVariant === 'primary'
    ? 'bg-coral text-white'
    : 'bg-white text-ink'
})

const accentColorClass = computed(() => {
  const map = {
    coral: 'bg-coral',
    ocean: 'bg-ocean',
    trust: 'bg-trust',
    ink: 'bg-ink',
  }
  return map[props.accentColor]
})
</script>