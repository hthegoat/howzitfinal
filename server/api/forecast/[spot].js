// server/api/forecast/[spot].js

import { fetchBuoyData, formatBuoyData, getBuoyIdForSpot } from '~/server/utils/noaa-fetcher'

// 🔥 IN-MEMORY CACHE
// Cache buoy data for 30 minutes since NOAA only updates hourly
const cache = new Map()
const CACHE_TTL = 30 * 60 * 1000 // 30 minutes in milliseconds

/**
 * Get cached buoy data or fetch fresh if expired
 */
const getCachedBuoyData = async (buoyId) => {
  const cacheKey = `buoy-${buoyId}`
  const now = Date.now()
  
  // Check if we have valid cached data
  const cached = cache.get(cacheKey)
  if (cached && (now - cached.timestamp) < CACHE_TTL) {
    console.log(`✅ Cache HIT for buoy ${buoyId} (age: ${Math.round((now - cached.timestamp) / 1000)}s)`)
    return {
      ...cached.data,
      fromCache: true,
      cacheAge: now - cached.timestamp
    }
  }
  
  // Cache miss or expired - fetch fresh data
  console.log(`🌊 Cache MISS for buoy ${buoyId} - fetching from NOAA`)
  const freshData = await fetchBuoyData(buoyId)
  
  // Store in cache
  cache.set(cacheKey, {
    data: freshData,
    timestamp: now
  })
  
  return {
    ...freshData,
    fromCache: false,
    cacheAge: 0
  }
}

/**
 * Clear old cache entries (housekeeping)
 * Run this periodically to prevent memory bloat
 */
const cleanupCache = () => {
  const now = Date.now()
  const maxAge = CACHE_TTL * 2 // Keep entries for 2x TTL
  
  for (const [key, value] of cache.entries()) {
    if (now - value.timestamp > maxAge) {
      cache.delete(key)
      console.log(`🧹 Cleaned up expired cache entry: ${key}`)
    }
  }
}

// Run cleanup every 10 minutes
setInterval(cleanupCache, 10 * 60 * 1000)

export default defineEventHandler(async (event) => {
  const spot = getRouterParam(event, 'spot')
  
  if (!spot) {
    throw createError({
      statusCode: 400,
      message: 'Spot parameter is required'
    })
  }
  
  try {
    // Get the appropriate buoy for this spot
    const buoyId = getBuoyIdForSpot(spot)
    
    // Fetch from cache or NOAA
    const rawBuoyData = await getCachedBuoyData(buoyId)
    
    if (!rawBuoyData.success) {
      throw new Error(rawBuoyData.error)
    }
    
    // Format the data for frontend consumption
    const formattedData = formatBuoyData(rawBuoyData)
    
    // Calculate a simple surf rating
    const rating = calculateSurfRating(formattedData)
    
    return {
      success: true,
      spot,
      buoyId,
      currentConditions: {
        rating: rating,
        waveHeight: formattedData.waveHeightDisplay,
        period: formattedData.periodDisplay,
        wind: formattedData.windDisplay,
        waterTemp: formattedData.waterTempDisplay,
        tide: 'Rising', // TODO: Add tide API
        timestamp: formattedData.timestamp
      },
      rawData: formattedData,
      lastUpdated: new Date().toISOString(),
      // 🔥 Cache metadata for debugging
      cache: {
        fromCache: rawBuoyData.fromCache,
        ageSeconds: Math.round(rawBuoyData.cacheAge / 1000),
        ttlSeconds: Math.round(CACHE_TTL / 1000)
      }
    }
    
  } catch (error) {
    console.error('Forecast API error:', error)
    
    // Return mock data if real data fails (for development)
    return {
      success: false,
      error: error.message,
      spot,
      currentConditions: {
        rating: 3.5,
        waveHeight: '2-3ft',
        period: '7s',
        wind: '10mph W',
        waterTemp: '58°F',
        tide: 'Rising',
        timestamp: new Date().toISOString()
      },
      note: 'Using fallback data due to API error'
    }
  }
})

/**
 * Simple surf rating algorithm based on conditions
 * Scale: 1-5
 */
function calculateSurfRating(data) {
  let rating = 3.0 // Start neutral
  
  const waveHeight = data.waveHeight
  const period = data.period
  const windSpeed = data.windSpeed
  
  // Wave height scoring (optimal 3-5ft)
  if (waveHeight >= 3 && waveHeight <= 5) {
    rating += 1.0
  } else if (waveHeight >= 2 && waveHeight < 3) {
    rating += 0.5
  } else if (waveHeight > 5 && waveHeight <= 7) {
    rating += 0.3
  } else if (waveHeight < 2) {
    rating -= 1.0
  } else if (waveHeight > 7) {
    rating -= 0.5
  }
  
  // Period scoring (longer is better for clean waves)
  if (period >= 10) {
    rating += 1.0
  } else if (period >= 8) {
    rating += 0.5
  } else if (period < 6) {
    rating -= 0.5
  }
  
  // Wind scoring (light winds are better)
  if (windSpeed <= 5) {
    rating += 0.5
  } else if (windSpeed <= 10) {
    rating += 0.0
  } else if (windSpeed <= 15) {
    rating -= 0.3
  } else {
    rating -= 0.7
  }
  
  // Clamp to 1-5 range
  rating = Math.max(1, Math.min(5, rating))
  
  // Round to 1 decimal
  return Math.round(rating * 10) / 10
}