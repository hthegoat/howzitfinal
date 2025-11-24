// server/utils/noaa-fetcher.js

/**
 * NOAA NDBC Buoy Data Fetcher
 * Fetches real-time wave and weather data from NOAA buoys
 */

export const fetchBuoyData = async (buoyId) => {
  try {
    // NDBC Real-time data - last 45 days
    const url = `https://www.ndbc.noaa.gov/data/realtime2/${buoyId}.txt`
    
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Buoy data fetch failed: ${response.status}`)
    }
    
    const text = await response.text()
    const lines = text.trim().split('\n')
    
    // Skip header lines (first 2 lines)
    const dataLines = lines.slice(2)
    
    if (dataLines.length === 0) {
      throw new Error('No buoy data available')
    }
    
    // Parse the most recent reading (first data line)
    const latestData = parseBuoyLine(dataLines[0])
    
    return {
      success: true,
      buoyId,
      data: latestData,
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    console.error(`Error fetching buoy ${buoyId}:`, error)
    return {
      success: false,
      error: error.message,
      buoyId
    }
  }
}

/**
 * Parse a value that might be "MM" (missing measurement)
 * NOAA uses "MM" to indicate missing data
 */
const parseValue = (value) => {
  if (!value || value === 'MM') return null
  const parsed = parseFloat(value)
  return isNaN(parsed) ? null : parsed
}

/**
 * Parse a single line of NDBC buoy data
 * Format: YY MM DD hh mm WDIR WSPD GST WVHT DPD APD MWD PRES ATMP WTMP DEWP VIS TIDE
 */
const parseBuoyLine = (line) => {
  const parts = line.trim().split(/\s+/)
  
  return {
    // Time
    year: parseInt(parts[0]),
    month: parseInt(parts[1]),
    day: parseInt(parts[2]),
    hour: parseInt(parts[3]),
    minute: parseInt(parts[4]),
    
    // Wind
    windDirection: parseValue(parts[5]),  // degrees
    windSpeed: parseValue(parts[6]),      // m/s
    gustSpeed: parseValue(parts[7]),      // m/s
    
    // Waves
    waveHeight: parseValue(parts[8]),     // meters
    dominantPeriod: parseValue(parts[9]), // seconds
    averagePeriod: parseValue(parts[10]), // seconds
    waveDirection: parseValue(parts[11]), // degrees
    
    // Weather
    pressure: parseValue(parts[12]),      // hPa
    airTemp: parseValue(parts[13]),       // Celsius
    waterTemp: parseValue(parts[14]),     // Celsius
    dewPoint: parseValue(parts[15]),      // Celsius
    visibility: parseValue(parts[16]),    // nautical miles
    tide: parseValue(parts[17])           // feet
  }
}

/**
 * Convert meters to feet
 */
export const metersToFeet = (meters) => {
  if (!meters || meters === null) return null
  return Math.round(meters * 3.28084 * 10) / 10
}

/**
 * Convert m/s to mph
 */
export const msToMph = (ms) => {
  if (!ms || ms === null) return null
  return Math.round(ms * 2.23694 * 10) / 10
}

/**
 * Convert degrees to compass direction
 */
export const degreesToCompass = (degrees) => {
  if (!degrees || degrees === null) return null
  
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
                      'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
  
  const index = Math.round(degrees / 22.5) % 16
  return directions[index]
}

/**
 * Format buoy data for display
 */
export const formatBuoyData = (rawData) => {
  if (!rawData || !rawData.success) {
    return null
  }
  
  const data = rawData.data
  
  return {
    waveHeight: metersToFeet(data.waveHeight),
    waveHeightDisplay: data.waveHeight ? `${metersToFeet(data.waveHeight)}ft` : 'N/A',
    
    period: data.dominantPeriod,
    periodDisplay: data.dominantPeriod ? `${Math.round(data.dominantPeriod)}s` : 'N/A',
    
    waveDirection: degreesToCompass(data.waveDirection),
    waveDirectionDegrees: data.waveDirection,
    
    windSpeed: msToMph(data.windSpeed),
    windSpeedDisplay: data.windSpeed ? `${Math.round(msToMph(data.windSpeed))}mph` : 'N/A',
    
    windDirection: degreesToCompass(data.windDirection),
    windDirectionDegrees: data.windDirection,
    windDisplay: data.windSpeed && data.windDirection 
      ? `${Math.round(msToMph(data.windSpeed))}mph ${degreesToCompass(data.windDirection)}`
      : 'N/A',
    
    waterTemp: data.waterTemp,
    waterTempDisplay: data.waterTemp 
      ? `${Math.round(data.waterTemp * 9/5 + 32)}°F` 
      : 'N/A',
    
    timestamp: `${data.year}/${data.month}/${data.day} ${data.hour}:${String(data.minute).padStart(2, '0')} UTC`,
    rawData: data
  }
}

/**
 * Get buoy ID for a surf spot
 * You'll want to expand this mapping based on your spots
 */
export const getBuoyIdForSpot = (spotSlug) => {
  const buoyMap = {
    'manasquan': '44065',     // New York Harbor entrance buoy
    'belmar': '44065',
    'spring-lake': '44065',
    'point-pleasant': '44065',
    'seaside-heights': '44065',
    'long-beach-island': '44065',
    'atlantic-city': '44009',  // Delaware Bay buoy
    'ocean-city': '44009',
    'cape-may': '44009'
  }
  
  return buoyMap[spotSlug] || '44065' // Default to NY Harbor
}