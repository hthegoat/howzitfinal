<template>
  <div class="w-full max-w-md mx-auto">
    <!-- Main Form -->
    <form 
      v-if="!submitted"
      @submit.prevent="handleSubmit" 
      class="space-y-3"
    >
      <!-- Email Input Group -->
      <div class="flex flex-col sm:flex-row gap-0">
        <input
          v-model="email"
          type="email"
          :placeholder="placeholder"
          required
          class="flex-1 px-5 py-3 border-2 border-black sm:border-r-0 text-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all"
          :disabled="loading"
        >
        <button
          type="submit"
          :disabled="loading"
          class="px-8 py-3 bg-black text-white font-bold text-lg hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed border-2 border-black"
        >
          {{ loading ? loadingText : buttonText }}
        </button>
      </div>

      <!-- Google Sign Up (optional) -->
      <button
        v-if="showGoogleSignup" 
        type="button"
        @click="$emit('google-signup')"
        class="w-full px-5 py-3 border-2 border-black font-semibold flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors"
      >
        <GoogleIcon />
        SIGN UP WITH GOOGLE
      </button>
    </form>

    <!-- Success State -->
    <Transition name="fade">
      <div 
        v-if="submitted"
        class="p-6 bg-green-50 border-2 border-green-500 rounded-lg"
      >
        <p class="font-bold text-green-900 mb-1">
          🤙 You're in! Check your email to confirm.
        </p>
        <p class="text-sm text-green-700">
          We'll send you an invite as soon as we launch in your area.
        </p>
      </div>
    </Transition>

    <!-- Error State -->
    <Transition name="fade">
      <div 
        v-if="error"
        class="mt-3 p-3 bg-red-50 border-2 border-red-500 rounded-lg"
      >
        <p class="text-sm text-red-700">{{ error }}</p>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  placeholder: {
    type: String,
    default: 'Enter your email'
  },
  buttonText: {
    type: String,
    default: 'GET ACCESS'
  },
  loadingText: {
    type: String,
    default: 'JOINING...'
  },
  showGoogleSignup: {
    type: Boolean,
    default: true
  },
  context: {
    type: String,
    default: 'hero' // hero, footer, popup
  }
})

const emit = defineEmits(['submit', 'google-signup'])

const email = ref('')
const loading = ref(false)
const submitted = ref(false)
const error = ref('')

const handleSubmit = async () => {
  loading.value = true
  error.value = ''
  
  try {
    // Emit to parent to handle
    await emit('submit', { 
      email: email.value, 
      context: props.context 
    })
    
    // Store locally as backup
    const emails = JSON.parse(localStorage.getItem('howzit-waitlist') || '[]')
    emails.push({
      email: email.value,
      context: props.context,
      timestamp: new Date().toISOString()
    })
    localStorage.setItem('howzit-waitlist', JSON.stringify(emails))
    
    submitted.value = true
    email.value = ''
    
    // Reset after 5 seconds
    setTimeout(() => {
      submitted.value = false
    }, 5000)
    
  } catch (err) {
    error.value = err.message || 'Something went wrong. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>