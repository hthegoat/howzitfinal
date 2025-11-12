<template>
  <section class="py-20 px-4 bg-gray-50">
    <div class="max-w-6xl mx-auto">
      <h2 class="text-3xl md:text-4xl font-black text-center mb-12">
        Built by surfers, for surfers
      </h2>
      
      <div class="grid md:grid-cols-3 gap-8">
        <div 
          v-for="feature in features" 
          :key="feature.title"
          class="bg-white border-2 border-black p-6 hover:shadow-lg transition-shadow"
        >
          <div class="text-3xl mb-4">{{ feature.icon }}</div>
          <h3 class="font-bold text-xl mb-3">{{ feature.title }}</h3>
          <p class="text-gray-600">{{ feature.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const features = [
  {
    icon: '🌊',
    title: 'No Ads. No BS.',
    description: 'Just clean, fast forecasts. No popups, no tracking, no 15-second video ads before checking the waves.'
  },
  {
    icon: '📍',
    title: 'Hyperlocal Reports',
    description: 'Real-time updates from surfers actually in the water at your spots. Know before you go.'
  },
  {
    icon: '⚡',
    title: 'Lightning Fast',
    description: 'No bloated app downloads. Works instantly on any device. Check conditions in seconds, not minutes.'
  },
  {
    icon: '🤝',
    title: 'Community Driven',
    description: 'Built by the surf community, for the surf community. Your feedback shapes every feature.'
  },
  {
    icon: '🎯',
    title: 'Spot On Accuracy',
    description: 'Combining NOAA data with local knowledge for forecasts that actually match reality.'
  },
  {
    icon: '🔓',
    title: 'Free Forever',
    description: 'Core features will always be free. No bait and switch. We make money from optional premium features.'
  }
]
</script>