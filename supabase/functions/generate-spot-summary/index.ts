import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)

// Helper functions
const degreesToCompass = (degrees: number | null): string => {
    if (degrees === null || degrees === undefined) return '--'
    const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
    return dirs[Math.round(degrees / 45) % 8]
}

const getWindQuality = (windDirection: number | null, beachOrientation: number | null): string => {
    if (!windDirection || !beachOrientation) return 'unknown'

    let diff = Math.abs(windDirection - beachOrientation)
    if (diff > 180) diff = 360 - diff

    if (diff >= 150) return 'offshore'
    if (diff >= 120) return 'cross-offshore'
    if (diff >= 60) return 'cross-shore'
    if (diff >= 30) return 'cross-onshore'
    return 'onshore'
}

const getSwellQuality = (swellDirection: number | null, beachOrientation: number | null): string => {
    if (!swellDirection || !beachOrientation) return 'unknown'

    let diff = Math.abs(swellDirection - beachOrientation)
    if (diff > 180) diff = 360 - diff

    if (diff <= 30) return 'ideal'
    if (diff <= 60) return 'good'
    if (diff <= 90) return 'fair'
    return 'poor'
}

// Format forecast data for LLM
const formatForecastData = (spot: any, forecasts: any[], tides: any[], waterTemp: number | null): string => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    // Group forecasts by day
    const byDay: Record<string, any> = {}
    forecasts.forEach(f => {
        const date = new Date(f.timestamp)
        const dateKey = date.toDateString()

        if (!byDay[dateKey]) {
            byDay[dateKey] = { date, forecasts: [] }
        }

        const hour = date.getHours()
        const windMph = f.wind_speed ? Math.round(f.wind_speed * 1.151) : null

        byDay[dateKey].forecasts.push({
            period: hour < 12 ? 'AM' : 'PM',
            waveMin: f.wave_min,
            waveMax: f.wave_max,
            swellPeriod: f.swell_period ? Math.round(f.swell_period) : null,
            swellDir: f.swell_direction,
            windSpeed: windMph,
            windDir: f.wind_direction,
            windDirCompass: degreesToCompass(f.wind_direction),
            windQuality: getWindQuality(f.wind_direction, spot.orientation),
            swellQuality: getSwellQuality(f.swell_direction, spot.orientation)
        })
    })

    // Group tides by day
    const tidesByDay: Record<string, any[]> = {}
    tides?.forEach(t => {
        const date = new Date(t.timestamp)
        const dateKey = date.toDateString()
        if (!tidesByDay[dateKey]) tidesByDay[dateKey] = []

        tidesByDay[dateKey].push({
            type: t.type,
            time: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
            height: t.height
        })
    })

    // Build output string
    let output = `Spot: ${spot.name}\n`
    output += `Location: ${spot.region}, ${spot.state}\n`
    output += `Beach orientation: ${spot.orientation}° (faces ${degreesToCompass(spot.orientation)})\n`
    if (waterTemp) output += `Water temp: ${waterTemp}°F\n`
    output += `\n--- Forecast ---\n\n`

    const sortedDays = Object.values(byDay)
        .sort((a: any, b: any) => a.date - b.date)
        .slice(0, 5)

    sortedDays.forEach((day: any) => {
        const dateStr = `${days[day.date.getDay()]} ${months[day.date.getMonth()]} ${day.date.getDate()}`
        output += `${dateStr}:\n`

        const dayTides = tidesByDay[day.date.toDateString()]
        if (dayTides?.length) {
            const tideStr = dayTides
                .map(t => `${t.type} ${t.time} (${t.height}ft)`)
                .join(' → ')
            output += `  Tides: ${tideStr}\n`
        }

        const am = day.forecasts.find((f: any) => f.period === 'AM')
        const pm = day.forecasts.find((f: any) => f.period === 'PM')

        if (am) {
            output += `  AM: ${am.waveMin}-${am.waveMax}ft, ${am.swellPeriod}s`
            if (am.windSpeed) output += `, ${am.windSpeed}mph ${am.windDirCompass} (${am.windQuality})`
            output += `\n`
        }

        if (pm) {
            output += `  PM: ${pm.waveMin}-${pm.waveMax}ft, ${pm.swellPeriod}s`
            if (pm.windSpeed) output += `, ${pm.windSpeed}mph ${pm.windDirCompass} (${pm.windQuality})`
            output += `\n`
        }

        output += `\n`
    })

    return output
}

const generateSummary = async (forecastData: string): Promise<string> => {
    if (!ANTHROPIC_API_KEY) {
        throw new Error('ANTHROPIC_API_KEY is not set')
    }

    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-haiku-20240307',
                max_tokens: 150,
                messages: [{
                    role: 'user',
                    content: `You are a surf forecaster writing a brief, actionable summary for everyday surfers.

Given this forecast data:

${forecastData}

Write a 2-3 sentence summary that:
1. Identifies the best day/time window this week
2. Explains WHY (wind, swell quality, tide)
3. Sets realistic expectations (size, conditions)

Be direct and conversational. No hype. If conditions are poor all week, say so honestly.

Summary:`
                }]
            })
        })

        const responseText = await response.text()
        console.log('Raw response:', responseText)

        const data = JSON.parse(responseText)

        if (!response.ok) {
            throw new Error(`API error ${response.status}: ${data.error?.message || responseText}`)
        }

        return data.content[0].text.trim()

    } catch (error) {
        console.error('generateSummary error:', error)
        throw error
    }
}