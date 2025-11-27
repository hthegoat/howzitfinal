// composables/useMarineForecast.js

export const useMarineForecast = () => {
  const fetchForecast = async (latitude, longitude) => {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      daily: [
        'wave_height_max',
        'wave_period_max',
        'wave_direction_dominant',
        'swell_wave_height_max',
        'swell_wave_period_max',
        'swell_wave_direction_dominant'
      ].join(','),
      timezone: 'America/New_York',
      forecast_days: '7'
    })

    try {
      const response = await fetch(`https://marine-api.open-meteo.com/v1/marine?${params}`)

      if (!response.ok) {
        throw new Error(`Marine API error: ${response.status}`)
      }

      const data = await response.json()

      // Transform into our format
      const days = data.daily.time.map((date, index) => {
        const waveHeight = data.daily.wave_height_max[index]
        const wavePeriod = data.daily.wave_period_max[index]
        const waveDir = data.daily.wave_direction_dominant[index]
        const swellHeight = data.daily.swell_wave_height_max?.[index]
        const swellPeriod = data.daily.swell_wave_period_max?.[index]
        const swellDir = data.daily.swell_wave_direction_dominant?.[index]

        return {
          date,
          waveHeight: waveHeight, // meters
          wavePeriod: wavePeriod, // seconds
          waveDirection: waveDir, // degrees
          swellHeight: swellHeight,
          swellPeriod: swellPeriod,
          swellDirection: swellDir
        }
      })

      return { success: true, data: days }
    } catch (error) {
      console.error('Marine forecast error:', error)
      return { success: false, error: error.message, data: [] }
    }
  }

  return { fetchForecast }
}