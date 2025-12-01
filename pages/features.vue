<template>
  <div class="min-h-screen bg-paper">
    <!-- Header -->
    <header class="bg-white border-b-3 border-black sticky top-0 z-50">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <NuxtLink to="/" class="font-display text-3xl md:text-4xl">HOWZIT</NuxtLink>
          <nav class="hidden md:flex items-center gap-8">
            <NuxtLink to="/why" class="font-body font-medium hover:text-coral transition-colors">Why Howzit</NuxtLink>
            <NuxtLink to="/features" class="font-body font-medium text-coral">Features</NuxtLink>
            <NuxtLink to="/roadmap" class="font-body font-medium hover:text-coral transition-colors">Roadmap</NuxtLink>
            <NuxtLink to="/forecast" class="px-4 py-2 bg-coral text-white font-bold rounded-lg hover:bg-coral-dark transition-colors">
              View Forecasts
            </NuxtLink>
          </nav>
        </div>
      </div>
    </header>

    <main>
      <!-- HERO -->
      <MarketingSection background="white" padding="xl" pattern="diagonal">
        <div class="max-w-4xl mx-auto text-center">
          <DataBadge variant="info" class="mb-6">Features</DataBadge>
          <h1 class="font-display text-display-lg uppercase mb-6">
            Everything You Need,<br />
            <span class="text-ocean">Nothing You Don't</span>
          </h1>
          <p class="font-body text-xl text-gray-600 max-w-2xl mx-auto">
            Built for surfers who want data they can trust, not algorithms they can't understand.
          </p>
        </div>
      </MarketingSection>

      <!-- FEATURE 1: Multi-Model Forecasts -->
      <MarketingSection background="foam" padding="lg">
        <div class="max-w-5xl mx-auto">
          <div class="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <DataBadge variant="success" :pulse="true" class="mb-4">Live Now</DataBadge>
              <ManifestoHeading tag="h2" size="md" class="mb-4">
                Multi-Model Forecasts
              </ManifestoHeading>
              <p class="font-body text-lg text-gray-700 mb-6">
                See what NOAA, WW3, and GFS are all saying — side by side. No "proprietary blending" 
                that hides disagreements. When models agree, you can trust it. When they don't, you know 
                to be cautious.
              </p>
              <IconGrid 
                :items="[
                  { text: 'NOAA WaveWatch III', icon: 'check' },
                  { text: 'GFS wind + pressure', icon: 'check' },
                  { text: 'Real-time buoy validation', icon: 'check' },
                  { text: 'No hidden blending', icon: 'check' },
                ]"
                icon-type="check"
                :columns="2"
              />
            </div>
            <!-- Placeholder for screenshot/visual -->
            <div class="bg-white border-3 border-black rounded-lg p-6 shadow-brutal">
              <div class="aspect-video bg-gray-100 rounded flex items-center justify-center">
                <span class="font-display text-gray-400 text-xl">[ Multi-Model UI Screenshot ]</span>
              </div>
            </div>
          </div>
        </div>
      </MarketingSection>

      <!-- FEATURE 2: Real Buoy Data -->
      <MarketingSection background="white" padding="lg">
        <div class="max-w-5xl mx-auto">
          <div class="grid lg:grid-cols-2 gap-12 items-center">
            <!-- Visual first on larger screens -->
            <div class="order-2 lg:order-1 bg-ocean/5 border-3 border-black rounded-lg p-6 shadow-brutal">
              <div class="aspect-video bg-gray-100 rounded flex items-center justify-center">
                <span class="font-display text-gray-400 text-xl">[ Live Buoy Data Screenshot ]</span>
              </div>
            </div>
            <div class="order-1 lg:order-2">
              <DataBadge variant="success" :pulse="true" class="mb-4">Live Now</DataBadge>
              <ManifestoHeading tag="h2" size="md" class="mb-4">
                Real Buoy Data, Unfiltered
              </ManifestoHeading>
              <p class="font-body text-lg text-gray-700 mb-6">
                Direct feeds from NOAA buoys — wave height, period, direction, water temp. 
                Not smoothed, not averaged, not "enhanced." Just the actual readings, 
                updated as they come in.
              </p>
              <IconGrid 
                :items="[
                  { text: 'Wave height (significant & max)', icon: 'check' },
                  { text: 'Dominant period & direction', icon: 'check' },
                  { text: 'Water temperature', icon: 'check' },
                  { text: 'Wind speed & direction', icon: 'check' },
                  { text: '6-hour update cycle', icon: 'check' },
                ]"
                icon-type="check"
                :columns="1"
              />
            </div>
          </div>
        </div>
      </MarketingSection>

      <!-- FEATURE 3: Confidence Ratings -->
      <MarketingSection background="foam" padding="lg">
        <div class="max-w-5xl mx-auto">
          <div class="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <DataBadge variant="info" class="mb-4">Core Feature</DataBadge>
              <ManifestoHeading tag="h2" size="md" class="mb-4">
                Confidence Ratings
              </ManifestoHeading>
              <p class="font-body text-lg text-gray-700 mb-6">
                Not all forecasts are created equal. Our confidence scores tell you when to trust 
                the prediction — based on model agreement, wind variability, and how sensitive 
                the spot is to small changes.
              </p>
              <div class="space-y-3">
                <div class="flex items-center gap-3 p-3 bg-trust/10 border-2 border-trust rounded-lg">
                  <span class="font-display text-trust text-xl">HIGH</span>
                  <span class="font-body text-sm text-gray-700">Models agree, conditions stable. Trust it.</span>
                </div>
                <div class="flex items-center gap-3 p-3 bg-warning/10 border-2 border-warning rounded-lg">
                  <span class="font-display text-warning text-xl">MEDIUM</span>
                  <span class="font-body text-sm text-gray-700">Some disagreement. Check morning of.</span>
                </div>
                <div class="flex items-center gap-3 p-3 bg-distrust/10 border-2 border-distrust rounded-lg">
                  <span class="font-display text-distrust text-xl">LOW</span>
                  <span class="font-body text-sm text-gray-700">High uncertainty. Wait for updates.</span>
                </div>
              </div>
            </div>
            <div class="bg-white border-3 border-black rounded-lg p-6 shadow-brutal">
              <div class="aspect-video bg-gray-100 rounded flex items-center justify-center">
                <span class="font-display text-gray-400 text-xl">[ Confidence UI Screenshot ]</span>
              </div>
            </div>
          </div>
        </div>
      </MarketingSection>

      <!-- FEATURE 4: Spot Behavior -->
      <MarketingSection background="white" padding="lg">
        <div class="max-w-5xl mx-auto">
          <div class="grid lg:grid-cols-2 gap-12 items-center">
            <div class="order-2 lg:order-1 bg-coral/5 border-3 border-black rounded-lg p-6 shadow-brutal">
              <div class="aspect-video bg-gray-100 rounded flex items-center justify-center">
                <span class="font-display text-gray-400 text-xl">[ Spot Behavior Screenshot ]</span>
              </div>
            </div>
            <div class="order-1 lg:order-2">
              <DataBadge variant="info" class="mb-4">Core Feature</DataBadge>
              <ManifestoHeading tag="h2" size="md" class="mb-4">
                Spot-Specific Behavior
              </ManifestoHeading>
              <p class="font-body text-lg text-gray-700 mb-6">
                Every break is different. Know how each spot reacts to swell direction, period, 
                wind angle, and tide. Local knowledge, systematized — not crowdsourced noise.
              </p>
              <IconGrid 
                :items="[
                  { text: 'Optimal swell direction & period', icon: 'check' },
                  { text: 'Best tide windows', icon: 'check' },
                  { text: 'Wind sensitivity analysis', icon: 'check' },
                  { text: 'Crowd patterns (coming soon)', icon: 'arrow' },
                ]"
                icon-type="check"
                :columns="2"
              />
            </div>
          </div>
        </div>
      </MarketingSection>

      <!-- FEATURE 5: Accuracy Scorecards -->
      <MarketingSection background="ocean" padding="lg">
        <div class="max-w-5xl mx-auto">
          <div class="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <StampBadge variant="trust" icon="star" class="mb-4">
                Game Changer
              </StampBadge>
              <ManifestoHeading tag="h2" size="md" class="mb-4 text-white">
                Accuracy Scorecards
              </ManifestoHeading>
              <p class="font-body text-lg text-gray-200 mb-6">
                This is the feature no one else will build. See how yesterday's forecast compared 
                to actual buoy readings. Track accuracy over time. Hold the data accountable.
              </p>
              <IconGrid 
                :items="[
                  { text: 'Forecast vs actual comparison', icon: 'check' },
                  { text: 'Historical accuracy trends', icon: 'check' },
                  { text: 'Model-by-model performance', icon: 'check' },
                  { text: 'Spot-specific accuracy', icon: 'check' },
                ]"
                icon-type="check"
                :columns="2"
                variant="dark"
              />
            </div>
            <div class="bg-white border-3 border-black rounded-lg p-6 shadow-brutal">
              <div class="aspect-video bg-gray-100 rounded flex items-center justify-center">
                <span class="font-display text-gray-400 text-xl">[ Accuracy Scorecard Screenshot ]</span>
              </div>
            </div>
          </div>
        </div>
      </MarketingSection>

      <!-- ALL FEATURES GRID -->
      <MarketingSection background="paper" padding="xl">
        <div class="max-w-5xl mx-auto">
          <ManifestoHeading tag="h2" size="md" align="center" class="mb-12">
            Everything Included
          </ManifestoHeading>
          
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <TransparencyFeature title="17+ Surf Spots" icon="map" color="coral">
              NJ, NY, and NC coverage with more regions coming.
            </TransparencyFeature>
            
            <TransparencyFeature title="Tide Charts" icon="chart" color="ocean">
              Interactive tide predictions with current marker.
            </TransparencyFeature>
            
            <TransparencyFeature title="Star Ratings" icon="eye" color="trust">
              At-a-glance quality ratings for quick decisions.
            </TransparencyFeature>
            
            <TransparencyFeature title="Mobile Optimized" icon="wave" color="coral">
              Fast, clean experience on any device.
            </TransparencyFeature>
            
            <TransparencyFeature title="No Ads" icon="shield" color="ocean">
              Ever. Your attention isn't our product.
            </TransparencyFeature>
            
            <TransparencyFeature title="Open Data" icon="check" color="trust">
              We show our sources. Verify anything.
            </TransparencyFeature>
          </div>
        </div>
      </MarketingSection>

      <!-- CTA -->
      <MarketingSection background="ink" padding="xl">
        <div class="max-w-2xl mx-auto text-center">
          <ManifestoHeading tag="h2" size="lg" align="center" class="text-white mb-4">
            See It In Action
          </ManifestoHeading>
          <p class="font-body text-xl text-gray-300 mb-8">
            Check real forecasts for real spots, right now.
          </p>
          
          <NuxtLink 
            to="/forecast"
            class="inline-flex items-center justify-center gap-2 px-8 py-4 bg-coral text-white font-display text-lg uppercase border-3 border-coral rounded-lg shadow-brutal-coral hover:shadow-brutal-lg hover:-translate-x-1 hover:-translate-y-1 transition-all"
          >
            View Live Forecasts
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </NuxtLink>
        </div>
      </MarketingSection>
    </main>

    <!-- FOOTER -->
    <footer class="bg-paper border-t-3 border-black py-12">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row justify-between items-center gap-6">
          <div class="font-display text-2xl">HOWZIT</div>
          <nav class="flex gap-6 text-sm font-body">
            <NuxtLink to="/why" class="hover:text-coral">Why Howzit</NuxtLink>
            <NuxtLink to="/features" class="hover:text-coral">Features</NuxtLink>
            <NuxtLink to="/roadmap" class="hover:text-coral">Roadmap</NuxtLink>
            <NuxtLink to="/forecast" class="hover:text-coral">Forecasts</NuxtLink>
          </nav>
          <p class="text-sm text-gray-600">Built by surfers, for surfers. 🤙</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import MarketingSection from '~/components/marketing/MarketingSection.vue'
import ManifestoHeading from '~/components/marketing/ManifestoHeading.vue'
import TransparencyFeature from '~/components/marketing/TransparencyFeature.vue'
import DataBadge from '~/components/marketing/DataBadge.vue'
import StampBadge from '~/components/marketing/StampBadge.vue'
import IconGrid from '~/components/marketing/IconGrid.vue'

useHead({
  title: 'Features - Howzit Surf Forecasts',
  meta: [
    { 
      name: 'description', 
      content: 'Multi-model forecasts, real buoy data, confidence ratings, accuracy scorecards, and more. See all Howzit features.' 
    }
  ]
})
</script>