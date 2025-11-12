<template>
  <div>
    <AppHeader />
    
    <main>
      <HeroSection />
      <SocialProof />
      <FeaturesSection />
      <!-- Add more sections as we build them -->
      <!-- <HowItWorks /> -->
      <!-- <Testimonials /> -->
      <!-- <FAQ /> -->
      <!-- <FinalCTA /> -->
    </main>
    
    <!-- Footer will go here -->
    
    <!-- Floating elements -->
    <!-- <LiveNotifications /> -->
  </div>
</template>

<script setup>
// SEO
useHead({
  title: 'Howzit - Surf Forecasts That Don\'t Suck',
  meta: [
    { 
      name: 'description', 
      content: 'Real-time surf reports from locals in the water. No ads, no bloat, no BS. Join 2,847 surfers already getting better forecasts.' 
    }
  ]
})
</script>