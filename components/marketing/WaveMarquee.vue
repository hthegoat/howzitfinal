<template>
  <div 
    :class="[
      'overflow-hidden whitespace-nowrap',
      'border-y-3 border-black',
      'py-3 md:py-4',
      backgroundClass
    ]"
  >
    <div 
      :class="[
        'inline-flex',
        speed === 'slow' ? 'animate-marquee-slow' : 'animate-marquee'
      ]"
    >
      <!-- Double the content for seamless loop -->
      <template v-for="i in 2" :key="i">
        <span 
          v-for="(item, index) in items" 
          :key="`${i}-${index}`"
          :class="[
            'inline-flex items-center gap-3 md:gap-4 mx-6 md:mx-10',
            'font-display text-xl md:text-3xl uppercase tracking-wider',
            textColorClass
          ]"
        >
          <!-- Separator dot -->
          <span 
            v-if="index > 0 || i > 1"
            :class="[
              'w-2 h-2 md:w-3 md:h-3 rounded-full',
              dotColorClass
            ]"
            aria-hidden="true"
          />
          {{ item }}
        </span>
      </template>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  items: {
    type: Array,
    required: true
  },
  variant: {
    type: String,
    default: 'ink',
    validator: (v) => ['ink', 'coral', 'ocean', 'paper'].includes(v)
  },
  speed: {
    type: String,
    default: 'normal',
    validator: (v) => ['normal', 'slow'].includes(v)
  }
})

const backgroundClass = computed(() => {
  const map = {
    ink: 'bg-ink',
    coral: 'bg-coral',
    ocean: 'bg-ocean',
    paper: 'bg-paper',
  }
  return map[props.variant]
})

const textColorClass = computed(() => {
  const map = {
    ink: 'text-white',
    coral: 'text-white',
    ocean: 'text-white',
    paper: 'text-ink',
  }
  return map[props.variant]
})

const dotColorClass = computed(() => {
  const map = {
    ink: 'bg-coral',
    coral: 'bg-white',
    ocean: 'bg-white',
    paper: 'bg-coral',
  }
  return map[props.variant]
})
</script>
