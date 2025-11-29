<template>
  <section class="max-w-4xl mx-auto px-4 py-12 md:py-20 text-center">
    <!-- Launch Badge -->
    <div class="inline-block mb-8">
      <div class="px-5 py-2 border-2 border-black font-bold text-sm tracking-wide">
        LAUNCHING JANUARY 2026
      </div>
    </div>

    <!-- Headline -->
    <h1 class="text-4xl sm:text-5xl md:text-7xl font-black leading-tight mb-6">
      Surf forecasts<br>
      that don't suck
    </h1>

    <!-- Subheadline -->
    <p class="text-lg md:text-xl text-gray-600 mb-2">
      Real-time reports from locals in the water.
    </p>
    <p class="text-lg md:text-xl font-semibold mb-10">
      No ads. No bloat. No BS.
    </p>

    <!-- Email Capture -->
    <EmailCapture 
      @submit="handleEmailSubmit"
     
    />

    <!-- Trust Signals -->
    <div class="mt-6 space-y-2 text-sm text-gray-600">
      <p class="flex items-center justify-center gap-2">
        <span>🔥</span>
        We hate spam as much as flat spells
      </p>
      <p class="flex items-center justify-center gap-2">
        <span>🔒</span>
        SSL Secured • Privacy Protected
      </p>
    </div>

    <!-- User Counter -->
    <div class="mt-12">
      <p class="text-xl md:text-2xl">
        <span class="font-black">{{ formattedUsers }}</span>
        <span class="text-gray-600 ml-2">surfers already joined</span>
      </p>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useWaitlist } from '~/composables/useWaitlist'

const { activeUsers, incrementUsers } = useWaitlist()

const formattedUsers = computed(() => 
  activeUsers.value.toLocaleString()
)

const handleEmailSubmit = async (data) => {
  // Handle the submission
  console.log('Email submitted from hero:', data)
  incrementUsers()
  // You can add your API call here
}

const handleGoogleSignup = () => {
  console.log('Google signup clicked')
  // Implement Google OAuth
}
</script>