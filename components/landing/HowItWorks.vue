<template>
  <section id="how-it-works" class="py-20 px-4">
    <div class="max-w-6xl mx-auto">
      <h2 class="text-3xl md:text-4xl font-black text-center mb-4">
        How It Works
      </h2>
      <p class="text-xl text-gray-600 text-center mb-12">
        Get better forecasts in 3 simple steps
      </p>
      
      <div class="grid md:grid-cols-3 gap-8">
        <div 
          v-for="(step, index) in steps" 
          :key="step.title"
          class="text-center"
        >
          <div class="w-16 h-16 mx-auto mb-4 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold">
            {{ index + 1 }}
          </div>
          <h3 class="font-bold text-xl mb-3">{{ step.title }}</h3>
          <p class="text-gray-600">{{ step.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const steps = [
  {
    title: 'Sign Up Free',
    description: 'Create your account in seconds. No credit card required during beta.'
  },
  {
    title: 'Pick Your Spots',
    description: 'Choose your local breaks and favorite surf spots to track.'
  },
  {
    title: 'Get Real Reports',
    description: 'Receive accurate forecasts and real-time updates from locals in the water.'
  }
]
</script>