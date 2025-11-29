// composables/useMarineForecast.js

export const useMarineForecast = () => {

  // Get reduction factor based on swell period
  // Longer period = ground swell = holds more energy to the beach
  const getPeriodFactor = (period) => {
    if (!period || period < 6) return 0.20  // Weak wind swell
    if (period < 9) return 0.30              // Short period
    if (period < 12) return 0.40             // Medium period
    return 0.50                               // Long period ground swell
  }

  // Get reduction factor based on swell direction vs beach orientation
  // beachOrientation: degrees the beach faces (90 = east-facing)
  // swellDirection: degrees the swell is coming FROM
  const getDirectionFactor = (beachOrientation, swellDirection) => {
    if (beachOrientation === null || swellDirection === null) return 1.0

    // Calculate the ideal swell direction (perpendicular to beach)
    // A beach facing 90° (east) receives swells best from ~90° (east)
    const idealSwellDir = beachOrientation

    // Calculate angle difference
    let angleDiff = Math.abs(swellDirection - idealSwellDir)
    if (angleDiff > 180) angleDiff = 360 - angleDiff

    // Apply reduction based on angle
    if (angleDiff <= 30) return 1.0      // Direct hit - full energy
    if (angleDiff <= 60) return 0.80     // Angled - 20% reduction
    if (angleDiff <= 90) return 0.50     // Side angle - 50% reduction
    return 0.25                           // Shadowed - 75% reduction
  }

  // Convert meters to feet
  const metersToFeet = (m) => m * 3.28084

  // Calculate beach wave height from offshore data
  const calculateBeachWaveHeight = (offshoreHeightMeters, period, swellDirection, beachOrientation) => {
    const periodFactor = getPeriodFactor(period)
    const directionFactor = getDirectionFactor(beachOrientation, swellDirection)

    const reducedHeight = offshoreHeightMeters * periodFactor * directionFactor
    return reducedHeight
  }

  const fetchForecast = async (latitude, longitude, beachOrientation = 90) => {
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

      // Transform into our format with smart reduction applied
      const days = data.daily.time.map((date, index) => {
        const waveHeightRaw = data.daily.wave_height_max[index] || 0
        const wavePeriod = data.daily.wave_period_max[index] || 0
        const waveDir = data.daily.wave_direction_dominant[index]

        const swellHeightRaw = data.daily.swell_wave_height_max?.[index] || waveHeightRaw
        const swellPeriod = data.daily.swell_wave_period_max?.[index] || wavePeriod
        const swellDir = data.daily.swell_wave_direction_dominant?.[index] || waveDir

        // Use swell data if available, otherwise fall back to wave data
        const primaryHeight = swellHeightRaw || waveHeightRaw
        const primaryPeriod = swellPeriod || wavePeriod
        const primaryDir = swellDir || waveDir

        // Calculate beach wave height with smart reduction
        const beachWaveHeight = calculateBeachWaveHeight(
          primaryHeight,
          primaryPeriod,
          primaryDir,
          beachOrientation
        )

        return {
          date,
          waveHeight: beachWaveHeight, // meters, adjusted for beach conditions
          waveHeightFt: metersToFeet(beachWaveHeight), // feet
          waveHeightRaw: primaryHeight, // original offshore reading (meters)
          waveHeightRawFt: metersToFeet(primaryHeight), // offshore in feet
          wavePeriod: primaryPeriod,
          waveDirection: primaryDir,
          swellDirection: swellDir,
          // Include the factors for debugging/transparency
          periodFactor: getPeriodFactor(primaryPeriod),
          directionFactor: getDirectionFactor(beachOrientation, primaryDir)
        }
      })

      return { success: true, data: days }
    } catch (error) {
      console.error('Marine forecast error:', error)
      return { success: false, error: error.message, data: [] }
    }
  }

  return { fetchForecast, calculateBeachWaveHeight, getPeriodFactor, getDirectionFactor }
}