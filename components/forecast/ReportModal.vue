<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-lg max-w-md w-full p-6 border-2 border-black">
      <h2 class="text-2xl font-black mb-4">Add Your Report</h2>
      
      <form @submit.prevent="handleSubmit">
        <!-- Rating -->
        <div class="mb-4">
          <label class="block font-bold mb-2">How's it out there?</label>
          <div class="flex gap-2">
            <button
              v-for="n in 5"
              :key="n"
              type="button"
              @click="rating = n"
              class="text-2xl"
            >
              {{ n <= rating ? '★' : '☆' }}
            </button>
          </div>
        </div>

        <!-- Comment -->
        <div class="mb-4">
          <label class="block font-bold mb-2">Conditions</label>
          <textarea
            v-model="comment"
            rows="3"
            class="w-full px-3 py-2 border-2 border-black rounded-lg"
            placeholder="What are the conditions like?"
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
            class="flex-1 px-4 py-2 border-2 border-black rounded-lg font-bold"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="flex-1 px-4 py-2 bg-black text-white rounded-lg font-bold"
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