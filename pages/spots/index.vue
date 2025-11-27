<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />
    
    <main class="max-w-6xl mx-auto px-4 py-12">
      <h1 class="text-4xl font-bold mb-2">Surf Spots</h1>
      <p class="text-gray-600 mb-8">Real-time conditions from NOAA buoys</p>
      
      <div v-if="!spots" class="text-gray-500">Loading spots...</div>
      
      <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <NuxtLink 
          v-for="spot in spots" 
          :key="spot.id"
          :to="`/spots/${spot.slug}`"
          class="bg-white border border-gray-200 rounded-lg p-6 hover:border-black transition-colors"
        >
          <h2 class="text-xl font-bold">{{ spot.name }}</h2>
          <p class="text-gray-500 text-sm">{{ spot.region }}</p>
        </NuxtLink>
      </div>
    </main>
    
    <AppFooter />
  </div>
</template>

<script setup>
const supabase = useSupabaseClient()

const { data: spots } = await useAsyncData('spots', async () => {
  const { data } = await supabase
    .from('spots')
    .select('*')
    .order('name')
  
  return data
})
</script>