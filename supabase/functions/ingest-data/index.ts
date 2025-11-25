import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const supabaseUrl = Deno.env.get("SUPABASE_URL")!
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Parse NOAA data line
function parseNoaaLine(line: string) {
  const parts = line.trim().split(/\s+/)
  if (parts.length < 14) return null

  const [yy, mm, dd, hh, min, wdir, wspd, gst, wvht, dpd, apd, mwd, pres, atmp, wtmp] = parts

  // Skip header rows
  if (yy.startsWith("#") || yy === "YY") return null

  // Parse values, treating "MM" as null
  const parseVal = (v: string) => (v === "MM" ? null : parseFloat(v))

  const timestamp = new Date(Date.UTC(
    parseInt(yy),
    parseInt(mm) - 1,
    parseInt(dd),
    parseInt(hh),
    parseInt(min)
  ))

  return {
    wave_height: parseVal(wvht),
    wave_period: parseVal(dpd),
    swell_direction: parseVal(mwd) ? parseInt(mwd) : null,
    water_temp: parseVal(wtmp),
    timestamp: timestamp.toISOString()
  }
}

// Fetch NOAA buoy data
async function fetchNoaaData(buoyId: string) {
  const url = `https://www.ndbc.noaa.gov/data/realtime2/${buoyId}.txt`
  const response = await fetch(url)

  if (!response.ok) {
    console.error(`Failed to fetch buoy ${buoyId}: ${response.status}`)
    return []
  }

  const text = await response.text()
  const lines = text.split("\n")

  // Parse just the most recent readings (first 5 data lines)
  const readings = []
  for (const line of lines.slice(2, 7)) {
    const parsed = parseNoaaLine(line)
    if (parsed) {
      readings.push({ buoy_id: buoyId, ...parsed })
    }
  }

  return readings
}

// Fetch Open-Meteo weather data for a spot
async function fetchWeatherData(spotId: string, lat: number, lon: number) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=wind_speed_10m,wind_direction_10m&wind_speed_unit=ms`
  const response = await fetch(url)

  if (!response.ok) {
    console.error(`Failed to fetch weather for spot ${spotId}: ${response.status}`)
    return null
  }

  const data = await response.json()

  return {
    spot_id: spotId,
    wind_speed: data.current.wind_speed_10m,
    wind_direction: data.current.wind_direction_10m,
    timestamp: new Date(data.current.time).toISOString()
  }
}

Deno.serve(async (req) => {
  try {
    console.log("Starting data ingestion...")

    // Get all spots
    const { data: spots, error: spotsError } = await supabase
      .from("spots")
      .select("id, buoy_id, latitude, longitude")

    if (spotsError) throw spotsError
    if (!spots || spots.length === 0) {
      return new Response(JSON.stringify({ message: "No spots found" }), { status: 200 })
    }

    // Get unique buoy IDs
    const buoyIds = [...new Set(spots.map(s => s.buoy_id))]

    // Fetch NOAA data for each buoy
    let buoyReadingsCount = 0
    for (const buoyId of buoyIds) {
      const readings = await fetchNoaaData(buoyId)

      if (readings.length > 0) {
        // Upsert readings (avoid duplicates based on buoy_id + timestamp)
        const { error } = await supabase
          .from("buoy_readings")
          .upsert(readings, { onConflict: "buoy_id,timestamp", ignoreDuplicates: true })

        if (error) {
          console.error(`Error inserting buoy readings for ${buoyId}:`, error)
        } else {
          buoyReadingsCount += readings.length
        }
      }
    }

    // Fetch weather data for each spot
    let weatherReadingsCount = 0
    for (const spot of spots) {
      const weather = await fetchWeatherData(spot.id, spot.latitude, spot.longitude)

      if (weather) {
        const { error } = await supabase
          .from("weather_readings")
          .insert(weather)

        if (error) {
          console.error(`Error inserting weather for spot ${spot.id}:`, error)
        } else {
          weatherReadingsCount++
        }
      }
    }

    const result = {
      message: "Ingestion complete",
      buoy_readings: buoyReadingsCount,
      weather_readings: weatherReadingsCount
    }

    console.log(result)

    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" }
    })

  } catch (error) {
    console.error("Ingestion error:", error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    })
  }
})