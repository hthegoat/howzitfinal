<template>
  <div>
    <!-- Announcement Bar -->
    <div class="bg-black text-white text-center py-3 text-sm font-medium tracking-wide">
      BETA ACCESS NOW OPEN — FREE FOREVER FOR EARLY USERS
    </div>

    <!-- Navigation -->
    <nav class="border-b border-gray-200 sticky top-0 bg-white z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex-shrink-0">
            <NuxtLink to="/" class="text-2xl font-black">
              howzit
            </NuxtLink>
          </div>
          
          <!-- Desktop Nav -->
          <div class="hidden md:flex items-center space-x-8">
            <a 
              v-for="link in navLinks" 
              :key="link.name"
              :href="link.href"
              class="text-gray-700 hover:text-black font-medium transition-colors"
            >
              {{ link.name }}
            </a>
            <button class="px-5 py-2 border-2 border-black font-bold hover:bg-black hover:text-white transition-all">
              SIGN IN
            </button>
          </div>

          <!-- Mobile menu button -->
          <button 
            @click="mobileMenuOpen = !mobileMenuOpen" 
            class="md:hidden p-2"
          >
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                v-if="!mobileMenuOpen"
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M4 6h16M4 12h16M4 18h16"
              />
              <path 
                v-else
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile menu -->
      <Transition name="slide-down">
        <div v-if="mobileMenuOpen" class="md:hidden border-t border-gray-200 bg-white">
          <div class="px-2 pt-2 pb-3 space-y-1">
            <a 
              v-for="link in navLinks"
              :key="link.name"
              :href="link.href"
              @click="mobileMenuOpen = false"
              class="block px-3 py-2 text-gray-700 hover:text-black font-medium"
            >
              {{ link.name }}
            </a>
            <button class="w-full text-left px-3 py-2 font-bold">
              SIGN IN
            </button>
          </div>
        </div>
      </Transition>
    </nav>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const mobileMenuOpen = ref(false)

const navLinks = [
  { name: 'How it Works', href: '#how-it-works' },
  { name: 'Features', href: '#features' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'Reviews', href: '#reviews' },
  { name: 'FAQ', href: '#faq' },
  { name: 'Spots', href: '/spots' }
]
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.2s ease-out;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>