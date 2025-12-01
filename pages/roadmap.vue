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
            <NuxtLink to="/roadmap" class="font-body font-medium text-coral">Roadmap</NuxtLink>
            <NuxtLink to="/forecast" class="px-4 py-2 bg-coral text-white font-bold rounded-lg hover:bg-coral-dark transition-colors">
              View Forecasts
            </NuxtLink>
          </nav>
        </div>
      </div>
    </header>

    <main>
      <!-- HERO -->
      <MarketingSection background="white" padding="xl" pattern="wave">
        <div class="max-w-4xl mx-auto text-center">
          <DataBadge variant="info" class="mb-6">Roadmap & Pricing</DataBadge>
          <h1 class="font-display text-display-lg uppercase mb-6">
            What We're Building<br />
            <span class="text-coral">& How We're Pricing It</span>
          </h1>
          <p class="font-body text-xl text-gray-600 max-w-2xl mx-auto">
            Full transparency on what's live, what's coming, and what it'll cost. No surprises.
          </p>
        </div>
      </MarketingSection>

      <!-- LAUNCHING WITH -->
      <MarketingSection background="foam" padding="xl">
        <div class="max-w-4xl mx-auto">
          <div class="flex items-center gap-3 mb-8">
            <StampBadge variant="trust" icon="check">Live Now</StampBadge>
            <span class="font-display text-2xl md:text-3xl uppercase">Launching With</span>
          </div>
          
          <div class="grid md:grid-cols-2 gap-4">
            <RoadmapCard 
              title="Multi-Model Forecasts" 
              description="NOAA, WW3, GFS — compare them all"
              status="live"
            />
            <RoadmapCard 
              title="Real Buoy Data" 
              description="Direct NOAA feeds, unfiltered"
              status="live"
            />
            <RoadmapCard 
              title="Tide Charts" 
              description="Interactive predictions with current markers"
              status="live"
            />
            <RoadmapCard 
              title="Wind Conditions" 
              description="Speed, direction, and gusts"
              status="live"
            />
            <RoadmapCard 
              title="Confidence Scores" 
              description="Know when to trust the forecast"
              status="live"
            />
            <RoadmapCard 
              title="Spot Behavior" 
              description="Best conditions for each break"
              status="live"
            />
            <RoadmapCard 
              title="Star Ratings" 
              description="At-a-glance quality assessment"
              status="live"
            />
            <RoadmapCard 
              title="17 Surf Spots" 
              description="NJ, NY, and NC coverage"
              status="live"
            />
          </div>
        </div>
      </MarketingSection>

      <!-- COMING NEXT -->
      <MarketingSection background="white" padding="xl">
        <div class="max-w-4xl mx-auto">
          <div class="flex items-center gap-3 mb-8">
            <StampBadge variant="ocean">Coming Soon</StampBadge>
            <span class="font-display text-2xl md:text-3xl uppercase">Coming Next</span>
          </div>
          
          <div class="grid md:grid-cols-2 gap-4 mb-8">
            <RoadmapCard 
              title="Accuracy Scorecards" 
              description="Track how forecasts compare to reality"
              status="coming"
            />
            <RoadmapCard 
              title="Historical Patterns" 
              description="Seasonal trends and swell history"
              status="coming"
            />
            <RoadmapCard 
              title="Smart Surf Alerts" 
              description="Get notified when conditions align"
              status="coming"
            />
            <RoadmapCard 
              title="More Regions" 
              description="Expanding to 100+ spots"
              status="coming"
            />
            <RoadmapCard 
              title="Cam Partnerships" 
              description="Free live look for all users"
              status="coming"
            />
            <RoadmapCard 
              title="Mobile App" 
              description="Native iOS and Android"
              status="coming"
            />
          </div>

          <div class="bg-foam border-3 border-black rounded-lg p-6 md:p-8">
            <PullQuote size="md" bar-color="ocean">
              Never paywalls on fundamentals. Never locked data. Never bait-and-switch.
            </PullQuote>
          </div>
        </div>
      </MarketingSection>

      <!-- WAVE MARQUEE -->
      <WaveMarquee 
        :items="['Fair Pricing', 'Forever', 'No Bait & Switch', 'Free Core Data', 'Early Supporters Win']"
        variant="coral"
      />

      <!-- PRICING PHILOSOPHY -->
      <MarketingSection background="paper" padding="xl">
        <div class="max-w-4xl mx-auto">
          <div class="text-center mb-12">
            <ManifestoHeading tag="h2" size="lg" align="center" class="mb-4">
              Fair Pricing. Forever.
            </ManifestoHeading>
            <p class="font-body text-xl text-gray-600 max-w-2xl mx-auto">
              We're not building another subscription trap. Here's our promise:
            </p>
          </div>

          <!-- Pricing Cards -->
          <div class="grid md:grid-cols-2 gap-8 mb-12">
            <PricingBlock 
              title="Core Forecast"
              subtitle="Everything you need to check the surf"
              :price="0"
              :features="[
                { text: 'Multi-model forecasts', included: true },
                { text: 'Real buoy data', included: true },
                { text: 'Tide & wind conditions', included: true },
                { text: 'Spot behavior insights', included: true },
                { text: 'Confidence ratings', included: true },
                { text: 'All 17+ spots', included: true },
              ]"
              cta-text="View Forecasts"
              cta-variant="secondary"
              accent-color="ocean"
              note="Always free. No account required."
              @cta-click="navigateTo('/forecast')"
            />
            
            <PricingBlock 
              title="Early Access"
              subtitle="For surfers who want more"
              price="Lifetime"
              :features="[
                { text: 'Everything in Core', included: true },
                { text: 'Accuracy scorecards', included: true, badge: 'Coming' },
                { text: 'Historical patterns', included: true, badge: 'Coming' },
                { text: 'Smart surf alerts', included: true, badge: 'Coming' },
                { text: 'Priority support', included: true },
                { text: 'Lifetime access', included: true, badge: 'Limited' },
              ]"
              cta-text="Join Waitlist"
              cta-variant="primary"
              ribbon="Limited"
              accent-color="coral"
              highlighted
              note="One-time purchase. No subscription ever."
              @cta-click="scrollToEmail"
            />
          </div>

          <!-- The Promise -->
          <div class="bg-white border-3 border-black rounded-lg p-6 md:p-8">
            <ManifestoHeading tag="h3" size="md" class="mb-4">
              Our Pricing Promise
            </ManifestoHeading>
            <IconGrid 
              :items="[
                { text: 'Core forecast data stays free forever', icon: 'check', bold: true },
                { text: 'Premium features cost less than half of competitors', icon: 'check', bold: true },
                { text: 'Early supporters get lifetime access before subscriptions', icon: 'check', bold: true },
                { text: 'No ads, no tracking, no selling your data', icon: 'check', bold: true },
              ]"
              icon-type="check"
              icon-style="circle"
              :columns="1"
              size="lg"
            />
          </div>
        </div>
      </MarketingSection>

      <!-- EARLY ACCESS CTA -->
      <MarketingSection background="ink" padding="xl">
        <div class="max-w-2xl mx-auto" id="email-capture">
          <div class="text-center mb-8">
            <ManifestoHeading tag="h2" size="lg" align="center" class="text-white mb-4">
              Be One of the First
            </ManifestoHeading>
            <p class="font-body text-xl text-gray-300">
              Join the early access list. Get a forecast you can actually trust — 
              and lock in lifetime access before we launch subscriptions.
            </p>
          </div>
          
          <EmailCapture 
            variant="dark"
            layout="stacked"
            button-text="Get Early Access"
            stamp="Lifetime Pass"
            :member-count="847"
            @submit="handleEmailSubmit"
          />

          <!-- Final trust signals -->
          <div class="mt-12 pt-8 border-t border-gray-700">
            <div class="grid grid-cols-3 gap-6 text-center">
              <div>
                <div class="font-display text-3xl text-coral mb-1">17+</div>
                <div class="font-body text-sm text-gray-400">Surf Spots</div>
              </div>
              <div>
                <div class="font-display text-3xl text-coral mb-1">6hr</div>
                <div class="font-body text-sm text-gray-400">Updates</div>
              </div>
              <div>
                <div class="font-display text-3xl text-coral mb-1">$0</div>
                <div class="font-body text-sm text-gray-400">Core Price</div>
              </div>
            </div>
          </div>
        </div>
      </MarketingSection>

      <!-- FINAL STATEMENT -->
      <MarketingSection background="paper" padding="lg">
        <div class="max-w-3xl mx-auto text-center">
          <PullQuote size="lg" align="center" bar-color="ink">
            No hype. No ads. No BS.<br />Just clean data and honest surf calls.
          </PullQuote>
        </div>
      </MarketingSection>
    </main>

    <!-- FOOTER -->
    <footer class="bg-white border-t-3 border-black py-12">
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
import RoadmapCard from '~/components/marketing/RoadmapCard.vue'
import PricingBlock from '~/components/marketing/PricingBlock.vue'
import PullQuote from '~/components/marketing/PullQuote.vue'
import DataBadge from '~/components/marketing/DataBadge.vue'
import StampBadge from '~/components/marketing/StampBadge.vue'
import WaveMarquee from '~/components/marketing/WaveMarquee.vue'
import EmailCapture from '~/components/marketing/EmailCapture.vue'
import IconGrid from '~/components/marketing/IconGrid.vue'

useHead({
  title: 'Roadmap & Pricing - Howzit Surf Forecasts',
  meta: [
    { 
      name: 'description', 
      content: 'See what we\'re building and how we\'re pricing it. Core forecasts free forever, premium features at fair prices.' 
    }
  ]
})

const handleEmailSubmit = async (email) => {
  console.log('Email submitted:', email)
  // TODO: Connect to your Supabase backend
}

const scrollToEmail = () => {
  document.getElementById('email-capture')?.scrollIntoView({ behavior: 'smooth' })
}
</script>
