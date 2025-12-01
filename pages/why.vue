<template>
  <div class="min-h-screen bg-paper">
    <!-- Header (same as index) -->
    <header class="bg-white border-b-3 border-black sticky top-0 z-50">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <NuxtLink to="/" class="font-display text-3xl md:text-4xl">HOWZIT</NuxtLink>
          <nav class="hidden md:flex items-center gap-8">
            <NuxtLink to="/why" class="font-body font-medium text-coral">Why Howzit</NuxtLink>
            <NuxtLink to="/features" class="font-body font-medium hover:text-coral transition-colors">Features</NuxtLink>
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
      <MarketingSection background="ink" padding="xl">
        <div class="max-w-4xl mx-auto text-center">
          <DataBadge variant="dark" class="mb-6">Our Philosophy</DataBadge>
          <h1 class="font-display text-display-lg uppercase text-white mb-6">
            Why We Built<br />
            <span class="text-coral">Howzit</span>
          </h1>
          <p class="font-body text-xl text-gray-300 max-w-2xl mx-auto">
            The surf forecast industry is broken. Here's what went wrong — and how we're fixing it.
          </p>
        </div>
      </MarketingSection>

      <!-- THE PROBLEM - EXPANDED -->
      <MarketingSection background="white" padding="xl">
        <div class="max-w-4xl mx-auto">
          <ManifestoHeading tag="h2" size="lg" class="mb-6">
            The Problem With Modern Surf Forecasts
          </ManifestoHeading>
          
          <div class="prose prose-lg max-w-none font-body text-gray-700 space-y-6 mb-12">
            <p>
              Somewhere along the way, surf forecasting went from being a tool for surfers to being a product 
              designed to maximize engagement and subscription revenue. The result? An industry built on hype, 
              paywalls, and black-box algorithms that nobody can verify.
            </p>
            <p>
              We've all experienced it: the forecast says "epic conditions" and you show up to ankle-high 
              mush. Or you skip a session because the app showed red, only to hear it was actually firing. 
              The disconnect between forecast and reality has become a running joke in every lineup.
            </p>
          </div>

          <!-- Detailed Problem Cards -->
          <div class="space-y-4 mb-12">
            <div class="grid md:grid-cols-2 gap-4">
              <ProblemCard>
                Overcalled wave heights
                <template #subtext>
                  "Chest-high" that turns out to be knee-high. Every. Single. Time.
                </template>
              </ProblemCard>
              
              <ProblemCard>
                Misleading rating systems
                <template #subtext>
                  Green/yellow/red tells you nothing about why or how confident they are.
                </template>
              </ProblemCard>
              
              <ProblemCard>
                Hidden algorithms
                <template #subtext>
                  "Proprietary models" that can't be verified or questioned.
                </template>
              </ProblemCard>
              
              <ProblemCard>
                Essential data behind paywalls
                <template #subtext>
                  $100/year just to see extended forecasts and cam rewinds.
                </template>
              </ProblemCard>
              
              <ProblemCard>
                Ad-riddled experience
                <template #subtext>
                  More screen real estate for sponsors than for actual conditions.
                </template>
              </ProblemCard>
              
              <ProblemCard>
                No accountability
                <template #subtext>
                  Yesterday's forecast disappears. No way to check if they were right.
                </template>
              </ProblemCard>
            </div>
          </div>

          <PullQuote size="lg" bar-color="coral">
            The forecast industry optimizes for engagement, not accuracy.
          </PullQuote>
        </div>
      </MarketingSection>

      <!-- MARQUEE BREAK -->
      <WaveMarquee 
        :items="['Trust', 'Transparency', 'Honesty', 'Accountability', 'No BS']"
        variant="coral"
      />

      <!-- THE PRINCIPLE -->
      <MarketingSection background="foam" padding="xl" pattern="dots">
        <div class="max-w-4xl mx-auto">
          <div class="text-center mb-12">
            <StampBadge variant="trust" icon="check" rotation="none" class="mb-6">
              Our Core Principle
            </StampBadge>
            <ManifestoHeading tag="h2" size="xl" align="center">
              Transparency Beats Prediction
            </ManifestoHeading>
          </div>

          <div class="prose prose-lg max-w-none font-body text-gray-700 space-y-6 mb-12">
            <p>
              Here's the truth: <strong>surf forecasting will never be 100% accurate.</strong> The ocean is 
              chaotic. Models disagree. Local factors matter. Anyone who claims otherwise is selling you 
              something.
            </p>
            <p>
              But forecasting <em>can</em> be transparent, consistent, and trustworthy. Instead of hiding 
              uncertainty behind confident-sounding ratings, we show you exactly what the models say — and 
              how much they agree.
            </p>
            <p>
              We believe you should always know:
            </p>
          </div>

          <IconGrid 
            :items="[
              { text: 'What each forecast model is actually saying', icon: 'check' },
              { text: 'How confident the data is (and why)', icon: 'check' },
              { text: 'What actually happened yesterday', icon: 'check' },
              { text: 'How accurate past forecasts have been', icon: 'check' },
            ]"
            icon-type="check"
            icon-style="circle"
            :columns="2"
            size="lg"
            class="mb-12"
          />

          <div class="bg-white border-3 border-black rounded-lg p-6 md:p-8">
            <PullQuote size="md" align="center" bar-color="ocean">
              Surfline hides that. We show it.
            </PullQuote>
          </div>
        </div>
      </MarketingSection>

      <!-- WHY THIS MATTERS -->
      <MarketingSection background="white" padding="xl">
        <div class="max-w-4xl mx-auto">
          <ManifestoHeading tag="h2" size="lg" class="mb-6">
            Why This Matters
          </ManifestoHeading>
          
          <div class="prose prose-lg max-w-none font-body text-gray-700 space-y-6 mb-12">
            <p>
              <strong>Surfers don't need perfection. They need honesty.</strong>
            </p>
            <p>
              When you know the models are disagreeing, you plan differently. When you see 
              confidence is low, you check the cam before driving two hours. When you can 
              verify yesterday's forecast against what actually happened, you learn which 
              sources to trust.
            </p>
            <p>
              Transparency doesn't just make better forecasts — it makes better surfers. 
              You start understanding the data, noticing patterns, and making your own calls 
              instead of blindly following an algorithm.
            </p>
          </div>

          <ComparisonBlock 
            them-label="The Old Way"
            us-label="The Howzit Way"
            :items="[
              { them: 'Trust the algorithm blindly', us: 'Understand the data yourself' },
              { them: 'Check the rating, grab your board', us: 'See the models, assess confidence, make the call' },
              { them: 'Wonder why the forecast was wrong', us: 'Check the accuracy scorecard, learn patterns' },
              { them: 'Pay more for basic features', us: 'Core data free, premium for power users' },
            ]"
          />
        </div>
      </MarketingSection>

      <!-- CTA -->
      <MarketingSection background="ink" padding="xl">
        <div class="max-w-2xl mx-auto text-center">
          <ManifestoHeading tag="h2" size="lg" align="center" class="text-white mb-4">
            Ready to See the Difference?
          </ManifestoHeading>
          <p class="font-body text-xl text-gray-300 mb-8">
            Check out what transparent forecasting looks like.
          </p>
          
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <NuxtLink 
              to="/forecast"
              class="inline-flex items-center justify-center gap-2 px-8 py-4 bg-coral text-white font-display text-lg uppercase border-3 border-coral rounded-lg shadow-brutal-coral hover:shadow-brutal-lg hover:-translate-x-1 hover:-translate-y-1 transition-all"
            >
              View Live Forecasts
            </NuxtLink>
            <NuxtLink 
              to="/features"
              class="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent text-white font-display text-lg uppercase border-3 border-white rounded-lg hover:bg-white hover:text-ink transition-all"
            >
              See All Features
            </NuxtLink>
          </div>
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
import ProblemCard from '~/components/marketing/ProblemCard.vue'
import ComparisonBlock from '~/components/marketing/ComparisonBlock.vue'
import PullQuote from '~/components/marketing/PullQuote.vue'
import DataBadge from '~/components/marketing/DataBadge.vue'
import StampBadge from '~/components/marketing/StampBadge.vue'
import WaveMarquee from '~/components/marketing/WaveMarquee.vue'
import IconGrid from '~/components/marketing/IconGrid.vue'
import StatBlock from '~/components/marketing/StatBlock.vue'

useHead({
  title: 'Why Howzit - Our Philosophy on Surf Forecasting',
  meta: [
    { 
      name: 'description', 
      content: 'Learn why we built Howzit and how transparent forecasting beats prediction. No hidden algorithms, just honest data.' 
    }
  ]
})
</script>