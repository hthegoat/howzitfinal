<template>
  <section class="max-w-4xl mx-auto px-4 py-16 md:py-24">
    <div class="border-2 border-black p-8 md:p-12">
      <!-- Badge -->
      <div class="flex justify-center mb-6">
        <span class="bg-yellow-400 text-black text-xs font-bold px-3 py-1 tracking-wide">
          LIMITED OFFER
        </span>
      </div>

      <!-- Headline -->
      <h2 class="text-3xl md:text-4xl font-black text-center mb-4">
        Skip the waitlist.
      </h2>
      
      <p class="text-lg md:text-xl text-gray-600 text-center max-w-2xl mx-auto mb-8">
        Lock in lifetime access for one flat price. No monthly fees. No annual renewals. Ever.
      </p>

      <!-- Pricing Card -->
      <div class="max-w-md mx-auto bg-black text-white p-8 mb-8">
        <div class="text-center">
          <p class="text-sm font-bold tracking-wide text-gray-400 mb-2">FOUNDING MEMBER</p>
          <div class="flex items-center justify-center gap-2 mb-1">
            <span class="text-5xl md:text-6xl font-black">$249</span>
          </div>
          <p class="text-gray-400 mb-6">one-time payment</p>
          
          <ul class="text-left space-y-3 mb-8">
            <li class="flex items-center gap-3">
              <span class="text-yellow-400">✓</span>
              Lifetime access — never pay again
            </li>
            <li class="flex items-center gap-3">
              <span class="text-yellow-400">✓</span>
              All premium features, forever
            </li>
            <li class="flex items-center gap-3">
              <span class="text-yellow-400">✓</span>
              Early access before public launch
            </li>
            <li class="flex items-center gap-3">
              <span class="text-yellow-400">✓</span>
              Founding Member badge
            </li>
            <li class="flex items-center gap-3">
              <span class="text-yellow-400">✓</span>
              Direct line to the dev team
            </li>
          </ul>

          <a 
            href="https://buy.stripe.com/bJe7sN0o9czv8lB02LbAs00?locale=en&__embed_source=buy_btn_1SH7q2PJcce2mR0GC2id6SVL"
            class="w-full bg-yellow-400 text-black font-bold py-4 px-8 hover:bg-yellow-300 transition-colors"
          >
            BECOME A FOUNDING MEMBER
        </a>
        </div>
      </div>

      <!-- Scarcity -->
      <div class="text-center">
        <p class="text-lg">
          <span class="font-black">{{ spotsRemaining }}</span>
          <span class="text-gray-600"> of 100 spots remaining</span>
        </p>
        <p class="text-sm text-gray-500 mt-2">
          After launch: $8/month or $79/year
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const spotsRemaining = ref(73)

const emit = defineEmits(['founding-click'])

const handleFoundingClick = () => {
  emit('founding-click')
  // This could open a Stripe checkout, modal, etc.
  console.log('Founding member clicked')
}
</script>