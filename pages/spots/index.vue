<script setup>
const supabase = useSupabaseClient()

const { data: spots, pending, error } = await useAsyncData('spots', async () => {
  const { data, error } = await supabase
    .from('spots')
    .select('*')
    .order('name', { ascending: true })
  
  console.log('Spots data:', data)
  console.log('Spots error:', error)
  
  return data
})

console.log('Final spots:', spots.value)

const formatWaveHeight = (meters) => {
  if (!meters) return '--'
  const feet = meters * 3.28084
  return `${feet.toFixed(1)}ft`
}

const formatTemp = (celsius) => {
  if (!celsius) return '--'
  const fahrenheit = (celsius * 9/5) + 32
  return `${fahrenheit.toFixed(0)}°F`
}

const formatWind = (weather) => {
  if (!weather?.wind_speed) return '--'
  const mph = weather.wind_speed * 2.237
  return `${mph.toFixed(0)}mph`
}

useHead({
  title: 'Surf Spots - Howzit',
  meta: [
    { name: 'description', content: 'Real-time surf conditions for East Coast spots' }
  ]
})
</script>