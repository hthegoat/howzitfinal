<template>
  <section id="faq" class="py-20 px-4">
    <div class="max-w-3xl mx-auto">
      <h2 class="text-3xl md:text-4xl font-black text-center mb-12">
        Frequently Asked Questions
      </h2>
      
      <div class="space-y-4">
        <div 
          v-for="(item, index) in faqItems" 
          :key="index"
          class="border-2 border-black"
        >
          <button
            @click="toggleItem(index)"
            class="w-full px-6 py-4 text-left font-bold flex justify-between items-center hover:bg-gray-50"
          >
            {{ item.question }}
            <span class="text-2xl">{{ openItems.includes(index) ? '−' : '+' }}</span>
          </button>
          <Transition name="accordion">
            <div 
              v-if="openItems.includes(index)"
              class="px-6 py-4 border-t-2 border-black bg-gray-50"
            >
              <p class="text-gray-700">{{ item.answer }}</p>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const openItems = ref([0]) // First item open by default

const toggleItem = (index) => {
  const idx = openItems.value.indexOf(index)
  if (idx > -1) {
    openItems.value.splice(idx, 1)
  } else {
    openItems.value.push(index)
  }
}

const faqItems = [
  {
    question: "Is it really free?",
    answer: "Yes! Core features will always be free. We'll offer optional premium features in the future, but checking forecasts and getting local reports will never cost a dime."
  },
  {
    question: "How is this different from Surfline or MSW?",
    answer: "We focus on simplicity and community. No ads, no bloat, just fast forecasts and real reports from locals. Plus, we're built by surfers who were frustrated with the existing options."
  },
  {
    question: "When will you cover my area?",
    answer: "We're launching with major surf spots in California, Hawaii, and Florida in January 2026. We'll expand based on user demand. Join the waitlist to vote for your spot!"
  },
  {
    question: "Do I need to download an app?",
    answer: "Nope! Howzit works perfectly in your browser on any device. Save it to your home screen for app-like experience without the download."
  },
  {
    question: "How accurate are the forecasts?",
    answer: "We use NOAA data combined with machine learning and local knowledge to achieve 87% accuracy for 3-day forecasts. Real-time local reports make it even better."
  }
]
</script>

<style scoped>
.accordion-enter-active,
.accordion-leave-active {
  transition: all 0.3s ease;
  max-height: 500px;
  overflow: hidden;
}

.accordion-enter-from,
.accordion-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>