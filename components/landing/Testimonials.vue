<template>
  <section id="reviews" class="py-20 px-4 bg-gray-50">
    <div class="max-w-6xl mx-auto">
      <h2 class="text-3xl md:text-4xl font-black text-center mb-12">
        What Surfers Are Saying
      </h2>
      
      <div class="grid md:grid-cols-3 gap-8">
        <div 
          v-for="review in reviews" 
          :key="review.author"
          class="bg-white border-2 border-black p-6"
        >
          <div class="flex mb-4">
            <span v-for="n in 5" :key="n" class="text-yellow-400 text-xl">★</span>
          </div>
          <p class="text-gray-700 mb-4 italic">"{{ review.text }}"</p>
          <p class="font-bold">{{ review.author }}</p>
          <p class="text-sm text-gray-600">{{ review.location }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const reviews = [
  {
    text: "Finally, a forecast app that doesn't try to sell me stuff every 5 seconds. Just clean, accurate reports.",
    author: "Mike R.",
    location: "Huntington Beach, CA"
  },
  {
    text: "The local reports feature is a game changer. Knowing someone's actually out there right now is priceless.",
    author: "Sarah K.",
    location: "Pipeline, HI"
  },
  {
    text: "Been using this for a month. It's faster and more accurate than the big apps. Stoked!",
    author: "Carlos M.",
    location: "Santa Cruz, CA"
  }
]
</script>