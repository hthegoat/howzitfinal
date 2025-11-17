<template>
  <section class="py-20 px-4 bg-black text-white">
    <div class="max-w-4xl mx-auto text-center">
      <h2 class="text-3xl md:text-4xl font-black mb-6">
        Ready for Better Surf Forecasts?
      </h2>
      <p class="text-xl mb-8 text-gray-300">
        Join {{ activeUsers.toLocaleString() }} surfers who are done with bloated apps and ads.
      </p>
      
      <EmailCapture 
        :show-google-signup="false"
        button-text="JOIN THE BETA"
        context="footer"
        @submit="handleSubmit"
      />
      
      <p class="mt-6 text-sm text-gray-400">
        No spam, ever. Unsubscribe anytime.
      </p>
    </div>
  </section>
</template>

<script setup>
import { useWaitlist } from '~/composables/useWaitlist'

const { activeUsers, incrementUsers } = useWaitlist()

const handleSubmit = (data) => {
  console.log('Footer signup:', data)
  incrementUsers()
}
</script>