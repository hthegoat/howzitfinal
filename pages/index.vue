<template>
  <div class="min-h-screen bg-paper">
    <!-- Header -->
    <header class="bg-white border-b-3 border-black sticky top-0 z-50">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <NuxtLink to="/" class="font-display text-3xl md:text-4xl">HOWZIT</NuxtLink>
          <nav class="hidden md:flex items-center gap-8">
            <NuxtLink to="/why" class="font-body font-medium hover:text-coral transition-colors">Why Howzit</NuxtLink>
            <NuxtLink to="/features" class="font-body font-medium hover:text-coral transition-colors">Features</NuxtLink>
            <NuxtLink to="/roadmap" class="font-body font-medium hover:text-coral transition-colors">Roadmap</NuxtLink>
            <NuxtLink to="/forecast" class="px-4 py-2 bg-coral text-white font-bold rounded-lg hover:bg-coral-dark transition-colors">
              View Forecasts
            </NuxtLink>
          </nav>
          <!-- Mobile menu button -->
          <button class="md:hidden p-2">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>

    <main>
      <!-- HERO SECTION -->
      <MarketingSection background="paper" padding="xl" pattern="wave">
        <div class="max-w-5xl mx-auto">
          <!-- Eyebrow -->
          <div class="flex items-center gap-3 mb-6">
            <DataBadge variant="success" :pulse="true">Now in Beta</DataBadge>
            <span class="font-body text-gray-600">17 spots across NJ, NY & NC</span>
          </div>

          <!-- Main Headline -->
          <h1 class="font-display text-display-xl uppercase tracking-tight mb-6">
            Surf Forecasts<br />
            <span class="text-coral">You Can Trust</span>
          </h1>

          <!-- Subheadline -->
          <p class="font-body text-xl md:text-2xl text-gray-700 max-w-2xl mb-8">
            No hidden algorithms. No paywalled data. No BS. 
            Just transparent forecasting that shows you exactly what the models say.
          </p>

          <!-- CTA -->
          <div class="flex flex-col sm:flex-row gap-4 mb-12">
            <NuxtLink 
              to="/forecast"
              class="inline-flex items-center justify-center gap-2 px-8 py-4 bg-ink text-white font-display text-lg uppercase border-3 border-black rounded-lg shadow-brutal hover:shadow-brutal-lg hover:-translate-x-1 hover:-translate-y-1 transition-all"
            >
              View Live Forecasts
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </NuxtLink>
            <a 
              href="#email-capture"
              class="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-ink font-display text-lg uppercase border-3 border-black rounded-lg hover:bg-gray-50 transition-colors"
            >
              Join Early Access
            </a>
          </div>

          <!-- Stats Row -->
          <div class="grid grid-cols-3 gap-6 md:gap-12 pt-8 border-t-2 border-gray-200">
            <StatBlock 
              :value="17" 
              label="Surf Spots" 
              size="md"
            />
            <StatBlock 
              value="6hr" 
              label="Update Cycle" 
              size="md"
            />
            <StatBlock 
              value="100%" 
              label="Free Core Data" 
              size="md"
            />
          </div>
        </div>
      </MarketingSection>

      <!-- WAVE MARQUEE -->
      <WaveMarquee 
        :items="['No Hidden Algorithms', 'Real Buoy Data', 'Multi-Model Forecasts', 'Confidence Ratings', 'Accuracy Scorecards', 'Local Knowledge']"
        variant="ink"
      />

      <!-- THE PROBLEM SECTION -->
      <MarketingSection background="white" padding="xl">
        <div class="max-w-4xl mx-auto">
          <!-- Section Header -->
          <ManifestoHeading tag="h2" size="lg" class="mb-4">
            Tired of Exaggerated Forecasts?
          </ManifestoHeading>
          <p class="font-body text-xl text-gray-600 mb-10">
            Yeah, we are too. Surfers have spent years dealing with:
          </p>

          <!-- Problem Cards Grid -->
          <div class="grid md:grid-cols-2 gap-4 mb-12">
            <ProblemCard>Overcalled wave heights</ProblemCard>
            <ProblemCard>Misleading "green day" hype</ProblemCard>
            <ProblemCard>Wrong water temps</ProblemCard>
            <ProblemCard>Paywalled cams</ProblemCard>
            <ProblemCard>Busy, ad-riddled apps</ProblemCard>
            <ProblemCard>Zero transparency on forecasts</ProblemCard>
          </div>

          <!-- The Statement -->
          <PullQuote size="lg" align="center" bar-color="coral">
            Surfline broke the trust. We're rebuilding it.
          </PullQuote>
        </div>
      </MarketingSection>

      <!-- TORN DIVIDER -->
      <TornDivider color="foam" variant="torn" />

      <!-- CORE VALUE SECTION -->
      <MarketingSection background="foam" padding="xl" pattern="dots">
        <div class="max-w-5xl mx-auto">
          <!-- Section Header -->
          <div class="text-center mb-12">
            <ManifestoHeading tag="h2" size="xl" align="center" class="mb-4">
              Transparency Beats Prediction
            </ManifestoHeading>
            <p class="font-body text-xl text-gray-700 max-w-2xl mx-auto">
              We don't hide anything behind colors, stars, or marketing fluff. 
              Here's what you actually get:
            </p>
          </div>

          <!-- Features Grid -->
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <TransparencyFeature 
              title="Multi-Model Forecasts" 
              icon="chart" 
              color="coral"
            >
              Compare NOAA, WW3, and GFS side-by-side. No "magic algorithm" blending. No spin.
            </TransparencyFeature>

            <TransparencyFeature 
              title="Real Buoy Data" 
              icon="wave" 
              color="ocean"
              badge="Live"
            >
              Straight from the source — not massaged or smoothed. Updated every 6 hours.
            </TransparencyFeature>

            <TransparencyFeature 
              title="Confidence Ratings" 
              icon="shield" 
              color="trust"
            >
              Based on model agreement, wind variability, and local tide sensitivity. We show uncertainty.
            </TransparencyFeature>

            <TransparencyFeature 
              title="Spot Behavior Insights" 
              icon="map" 
              color="coral"
            >
              Know how each break reacts to swell direction, period, wind, and tide. Local knowledge, baked in.
            </TransparencyFeature>

            <TransparencyFeature 
              title="Accuracy Scorecards" 
              icon="check" 
              color="ocean"
              featured
            >
              See how yesterday's forecast matched actual buoy readings. Hold the data accountable.
            </TransparencyFeature>

            <TransparencyFeature 
              title="Clean, Fast UI" 
              icon="eye" 
              color="trust"
            >
              No ads. No bloat. No tracking. Just the data you need to make the call.
            </TransparencyFeature>
          </div>
        </div>
      </MarketingSection>

      <!-- COMPARISON SECTION -->
      <MarketingSection background="white" padding="lg">
        <div class="max-w-3xl mx-auto">
          <ManifestoHeading tag="h3" size="md" align="center" class="mb-8">
            The Difference
          </ManifestoHeading>
          
          <ComparisonBlock 
            them-label="Surfline"
            us-label="Howzit"
            :items="[
              { them: 'Proprietary algorithm, no explanation', us: 'Multi-model data you can verify' },
              { them: 'Green/yellow/red ratings with no context', us: 'Confidence scores based on model agreement' },
              { them: 'Premium features behind $100/yr paywall', us: 'Core forecast always free' },
              { them: 'Cluttered with ads and upsells', us: 'Clean, focused, data-forward' },
              { them: 'No way to check forecast accuracy', us: 'Historical accuracy scorecards' },
            ]"
          />
        </div>
      </MarketingSection>

      <!-- CTA SECTION -->
      <MarketingSection background="ink" padding="xl">
        <div class="max-w-2xl mx-auto text-center" id="email-capture">
          <ManifestoHeading tag="h2" size="lg" align="center" class="text-white mb-4">
            Be One of the First
          </ManifestoHeading>
          <p class="font-body text-xl text-gray-300 mb-8">
            Join surfers who want forecasts they can actually trust.
            No hype. No ads. No BS.
          </p>
          
          <EmailCapture 
            variant="dark"
            layout="inline"
            button-text="Get Early Access"
            stamp="Lifetime Access"
            :member-count="847"
            @submit="handleEmailSubmit"
          />
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
          <p class="text-sm text-gray-600">
            Built by surfers, for surfers. 🤙
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
// Import components (Nuxt auto-imports should handle this, but explicit for clarity)
import MarketingSection from '~/components/marketing/MarketingSection.vue'
import ManifestoHeading from '~/components/marketing/ManifestoHeading.vue'
import ProblemCard from '~/components/marketing/ProblemCard.vue'
import TransparencyFeature from '~/components/marketing/TransparencyFeature.vue'
import ComparisonBlock from '~/components/marketing/ComparisonBlock.vue'
import PullQuote from '~/components/marketing/PullQuote.vue'
import DataBadge from '~/components/marketing/DataBadge.vue'
import WaveMarquee from '~/components/marketing/WaveMarquee.vue'
import EmailCapture from '~/components/marketing/EmailCapture.vue'
import StatBlock from '~/components/marketing/StatBlock.vue'
import TornDivider from '~/components/marketing/TornDivider.vue'

// SEO
useHead({
  title: 'Howzit - Surf Forecasts You Can Trust',
  meta: [
    { 
      name: 'description', 
      content: 'Transparent surf forecasting with multi-model data, confidence ratings, and accuracy scorecards. No hidden algorithms, no paywalls, no BS.' 
    }
  ]
})

// Email submit handler
const handleEmailSubmit = async (email) => {
  console.log('Email submitted:', email)
  // TODO: Connect to your Supabase backend
}
</script>