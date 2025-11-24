<template>
  <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
    <h3 class="font-bold text-lg mb-4">Nearby Spots</h3>
    
    <div class="space-y-3">
      <NuxtLink to="/forecast/belmar" class="block p-3 border border-black rounded hover:bg-gray-50 transition-colors">
        <div class="font-bold">Belmar</div>
        <div class="text-sm text-gray-500">3 miles north</div>
      </NuxtLink>
      
      <NuxtLink to="/forecast/spring-lake" class="block p-3 border border-black rounded hover:bg-gray-50 transition-colors">
        <div class="font-bold">Spring Lake</div>
        <div class="text-sm text-gray-500">5 miles north</div>
      </NuxtLink>
      
      <NuxtLink to="/forecast/point-pleasant" class="block p-3 border border-black rounded hover:bg-gray-50 transition-colors">
        <div class="font-bold">Point Pleasant</div>
        <div class="text-sm text-gray-500">4 miles south</div>
      </NuxtLink>
    </div>
  </div>
</template>
