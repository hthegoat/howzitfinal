<template>
  <div 
    :class="[
      'relative flex items-start gap-4 p-4 md:p-5',
      'border-3 border-black rounded-lg',
      'transition-all duration-200',
      statusClasses
    ]"
  >
    <!-- Status Icon -->
    <div 
      :class="[
        'flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full',
        'flex items-center justify-center',
        'border-3 border-black',
        iconBackgroundClass
      ]"
    >
      <!-- Launching / Live -->
      <svg 
        v-if="status === 'live'" 
        class="w-5 h-5 md:w-6 md:h-6 text-white" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor" 
        stroke-width="3"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
      </svg>
      
      <!-- Coming Soon -->
      <svg 
        v-else-if="status === 'coming'" 
        class="w-5 h-5 md:w-6 md:h-6 text-ink" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor" 
        stroke-width="2"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      
      <!-- Future -->
      <svg 
        v-else 
        class="w-5 h-5 md:w-6 md:h-6 text-gray-400" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor" 
        stroke-width="2"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>

    <!-- Content -->
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2 flex-wrap">
        <h4 class="font-display text-lg md:text-xl uppercase">
          {{ title }}
        </h4>
        <DataBadge 
          v-if="status === 'live'" 
          variant="success" 
          :pulse="true"
        >
          Live
        </DataBadge>
        <DataBadge 
          v-else-if="status === 'coming'" 
          variant="info"
        >
          Coming Soon
        </DataBadge>
      </div>
      
      <p v-if="description" class="mt-1 font-body text-sm md:text-base text-gray-600">
        {{ description }}
      </p>
    </div>
  </div>
</template>

<script setup>
import DataBadge from './DataBadge.vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: null
  },
  status: {
    type: String,
    default: 'coming',
    validator: (v) => ['live', 'coming', 'future'].includes(v)
  }
})

const iconBackgroundClass = computed(() => {
  const map = {
    live: 'bg-trust',
    coming: 'bg-foam',
    future: 'bg-gray-100',
  }
  return map[props.status]
})
</script>
