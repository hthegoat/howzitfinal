<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white border-3 border-black rounded-lg max-w-md w-full p-6">
      <h2 class="text-2xl font-black mb-4">Post Live Report</h2>
      
      <form @submit.prevent="handleSubmit">
        <!-- Rating -->
        <div class="mb-4">
          <label class="block font-bold mb-2">Rating</label>
          <div class="flex gap-2">
            <button
              v-for="n in 5"
              :key="n"
              type="button"
              @click="rating = n"
              :class="rating >= n ? 'bg-black text-white' : 'bg-gray-200'"
              class="w-12 h-12 rounded-lg font-bold text-lg"
            >
              {{ n }}
            </button>
          </div>
        </div>

        <!-- Comment -->
        <div class="mb-4">
          <label class="block font-bold mb-2">Conditions</label>
          <textarea
            v-model="comment"
            rows="4"
            placeholder="Describe the conditions..."
            class="w-full border-2 border-black rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black"
            required
          ></textarea>
        </div>

        <!-- Tags -->
        <div class="mb-4">
          <label class="block font-bold mb-2">Quick Tags</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="tag in availableTags"
              :key="tag"
              type="button"
              @click="toggleTag(tag)"
              :class="selectedTags.includes(tag) ? 'bg-black text-white' : 'bg-gray-100'"
              class="px-3 py-1 rounded-full text-sm font-medium"
            >
              {{ tag }}
            </button>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-3">
          <button
            type="button"
            @click="$emit('close')"
            class="flex-1 px-4 py-2 border-2 border-black rounded-lg font-bold hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="flex-1 px-4 py-2 bg-black text-white rounded-lg font-bold hover:bg-gray-800"
          >
            Post Report
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['close', 'submit'])

const rating = ref(3)
const comment = ref('')
const selectedTags = ref([])

const availableTags = [
  'Clean', 'Choppy', 'Glassy', 'Closed out',
  'Peaky', 'Walled', 'Crowded', 'Empty',
  'Improving', 'Dropping'
]

const toggleTag = (tag) => {
  const index = selectedTags.value.indexOf(tag)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  } else {
    selectedTags.value.push(tag)
  }
}

const handleSubmit = () => {
  emit('submit', {
    rating: rating.value,
    comment: comment.value,
    tags: selectedTags.value
  })
}
</script>