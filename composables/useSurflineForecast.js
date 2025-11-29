// composables/useSurflineForecast.js
// Fetches cached Surfline forecast data from Supabase

export const useSurflineForecast = (spotId) => {
    const supabase = useSupabaseClient()

    const forecast = ref([])
    const tides = ref([])
    const loading = ref(true)
    const error = ref(null)

    const fetchForecast = async () => {
        if (!spotId) {
            loading.value = false
            return
        }

        try {
            // Get forecasts for the next 6 days
            const now = new Date()
            const sixDaysOut = new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000)

            const { data: forecastData, error: forecastError } = await supabase
                .from('surfline_forecasts')
                .select('*')
                .eq('spot_id', spotId)
                .gte('timestamp', now.toISOString())
                .lte('timestamp', sixDaysOut.toISOString())
                .order('timestamp', { ascending: true })

            if (forecastError) throw forecastError

            // Group by day and get daily summary
            const dailyForecasts = groupByDay(forecastData || [])
            forecast.value = dailyForecasts

            // Get tides for next 2 days
            const twoDaysOut = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000)

            const { data: tideData, error: tideError } = await supabase
                .from('surfline_tides')
                .select('*')
                .eq('spot_id', spotId)
                .gte('timestamp', now.toISOString())
                .lte('timestamp', twoDaysOut.toISOString())
                .order('timestamp', { ascending: true })

            if (tideError) throw tideError

            tides.value = tideData || []

        } catch (err) {
            console.error('Error fetching Surfline forecast:', err)
            error.value = err.message
        } finally {
            loading.value = false
        }
    }

    // Group forecast data by day
    const groupByDay = (data) => {
        const days = {}

        data.forEach(row => {
            const date = new Date(row.timestamp).toDateString()

            if (!days[date]) {
                days[date] = {
                    date: row.timestamp,
                    readings: []
                }
            }
            days[date].readings.push(row)
        })

        // Convert to array and compute daily summary
        return Object.values(days).map(day => {
            const readings = day.readings

            // Get min/max wave heights for the day
            const waveMin = Math.min(...readings.map(r => r.wave_min).filter(v => v !== null))
            const waveMax = Math.max(...readings.map(r => r.wave_max).filter(v => v !== null))

            // Get primary swell from first reading with swell data
            const swellReading = readings.find(r => r.swell_height && r.swell_period)

            // Get best rating for the day
            const bestRating = readings.reduce((best, r) => {
                if (!r.rating_value) return best
                if (!best || r.rating_value > best.rating_value) return r
                return best
            }, null)

            // Get average wind
            const winds = readings.filter(r => r.wind_speed !== null)
            const avgWindSpeed = winds.length
                ? winds.reduce((sum, r) => sum + r.wind_speed, 0) / winds.length
                : null
            const primaryWind = readings.find(r => r.wind_type)

            return {
                date: day.date,
                waveMin: isFinite(waveMin) ? waveMin : 0,
                waveMax: isFinite(waveMax) ? waveMax : 0,
                swellHeight: swellReading?.swell_height || null,
                swellPeriod: swellReading?.swell_period || null,
                swellDirection: swellReading?.swell_direction || null,
                ratingKey: bestRating?.rating_key || 'POOR',
                ratingValue: bestRating?.rating_value || 0,
                windSpeed: avgWindSpeed,
                windDirection: primaryWind?.wind_direction || null,
                windType: primaryWind?.wind_type || null
            }
        })
    }

    // Fetch on mount
    onMounted(fetchForecast)

    // Watch for spotId changes
    watch(() => spotId, fetchForecast)

    return {
        forecast,
        tides,
        loading,
        error,
        refetch: fetchForecast
    }
}