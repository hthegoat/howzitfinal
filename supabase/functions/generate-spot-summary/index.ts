import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)

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

const formatForecastData = (spot: any, forecasts: any[], tides: any[], waterTemp: number | null): string => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

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
            windSpeed: windMph,
            windDirCompass: degreesToCompass(f.wind_direction),
            windQuality: getWindQuality(f.wind_direction, spot.orientation),
            swellQuality: getSwellQuality(f.swell_direction, spot.orientation)
        })
    })

    const tidesByDay: Record<string, any[]> = {}
    if (tides) {
        tides.forEach(t => {
            const date = new Date(t.timestamp)
            const dateKey = date.toDateString()
            if (!tidesByDay[dateKey]) tidesByDay[dateKey] = []
            tidesByDay[dateKey].push({
                type: t.type,
                time: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
                height: t.height
            })
        })
    }

    let output = `Spot: ${spot.name}\n`
    output += `Location: ${spot.region}, ${spot.state}\n`
    output += `Beach orientation: ${spot.orientation} degrees (faces ${degreesToCompass(spot.orientation)})\n`
    if (waterTemp) output += `Water temp: ${waterTemp}F\n`
    output += `\n--- Forecast ---\n\n`

    const sortedDays = Object.values(byDay)
        .sort((a: any, b: any) => a.date - b.date)
        .slice(0, 5)

    sortedDays.forEach((day: any) => {
        const dateStr = `${days[day.date.getDay()]} ${months[day.date.getMonth()]} ${day.date.getDate()}`
        output += `${dateStr}:\n`

        const dayTides = tidesByDay[day.date.toDateString()]
        if (dayTides && dayTides.length) {
            const tideStr = dayTides.map(t => `${t.type} ${t.time} (${t.height}ft)`).join(' then ')
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
    console.log('generateSummary called')
    console.log('API key exists:', !!ANTHROPIC_API_KEY)
    console.log('API key length:', ANTHROPIC_API_KEY ? ANTHROPIC_API_KEY.length : 0)

    if (!ANTHROPIC_API_KEY) {
        console.log('No API key - returning fallback')
        return "Forecast summary unavailable - API key not configured."
    }

    try {
        console.log('Making fetch request to Anthropic...')

        const requestBody = {
            model: 'claude-sonnet-4-20250514',
            max_tokens: 100,
            messages: [{
                role: 'user',
                content: `${forecastData}

Two sentences max. Best day and why. Sound human, not like a forecast. No greetings.

Example: "Wednesday morning's the pick — offshore and 2-3ft. Gets choppy by afternoon."`
            }]
        }

        console.log('Request body:', JSON.stringify(requestBody).slice(0, 200) + '...')

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify(requestBody)
        })

        console.log('Response status:', response.status)
        console.log('Response ok:', response.ok)

        const responseText = await response.text()
        console.log('Response text:', responseText.slice(0, 500))

        if (!response.ok) {
            console.log('Response not ok, returning fallback')
            return "Summary temporarily unavailable."
        }

        const data = JSON.parse(responseText)
        console.log('Parsed data keys:', Object.keys(data))

        if (data.content && Array.isArray(data.content) && data.content.length > 0 && data.content[0].text) {
            console.log('Success! Returning summary')
            return data.content[0].text.trim()
        }

        console.log('Unexpected response structure')
        return "Unable to generate summary."

    } catch (err) {
        console.log('Error in generateSummary:', err)
        return "Summary generation failed."
    }
}

serve(async (req) => {
    console.log('--- Request received ---')

    try {
        const body = await req.json()
        console.log('Request body:', JSON.stringify(body))

        const spot_id = body.spot_id

        if (!spot_id) {
            return new Response(JSON.stringify({ error: 'spot_id is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            })
        }

        console.log('Fetching spot:', spot_id)

        const { data: spot, error: spotError } = await supabase
            .from('spots')
            .select('*')
            .eq('id', spot_id)
            .single()

        if (spotError) {
            console.log('Spot error:', spotError)
            return new Response(JSON.stringify({ error: 'Spot not found', details: spotError.message }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            })
        }

        if (!spot) {
            console.log('No spot found')
            return new Response(JSON.stringify({ error: 'Spot not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            })
        }

        console.log('Spot found:', spot.name)

        const now = new Date()
        const sixDaysOut = new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000)

        console.log('Fetching forecasts...')

        const { data: forecasts, error: forecastError } = await supabase
            .from('surfline_forecasts')
            .select('*')
            .eq('spot_id', spot_id)
            .gte('timestamp', now.toISOString())
            .lte('timestamp', sixDaysOut.toISOString())
            .order('timestamp', { ascending: true })

        if (forecastError) {
            console.log('Forecast error:', forecastError)
        }

        console.log('Forecasts found:', forecasts ? forecasts.length : 0)

        const twoDaysOut = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000)

        console.log('Fetching tides...')

        const { data: tides, error: tidesError } = await supabase
            .from('surfline_tides')
            .select('*')
            .eq('spot_id', spot_id)
            .gte('timestamp', now.toISOString())
            .lte('timestamp', twoDaysOut.toISOString())
            .order('timestamp', { ascending: true })

        if (tidesError) {
            console.log('Tides error:', tidesError)
        }

        console.log('Tides found:', tides ? tides.length : 0)

        let waterTemp = null
        if (spot.buoy_id) {
            console.log('Fetching buoy data for:', spot.buoy_id)

            const { data: buoy } = await supabase
                .from('buoy_readings')
                .select('water_temp')
                .eq('buoy_id', spot.buoy_id)
                .order('timestamp', { ascending: false })
                .limit(1)
                .single()

            if (buoy && buoy.water_temp) {
                waterTemp = Math.round((buoy.water_temp * 9 / 5) + 32)
                console.log('Water temp:', waterTemp)
            }
        }

        console.log('Formatting forecast data...')
        const forecastData = formatForecastData(spot, forecasts || [], tides || [], waterTemp)
        console.log('Forecast data length:', forecastData.length)

        console.log('Generating summary...')
        const summary = await generateSummary(forecastData)
        console.log('Summary generated:', summary.slice(0, 100))

        const today = new Date().toISOString().split('T')[0]

        console.log('Upserting to spot_summaries...')

        const { error: upsertError } = await supabase
            .from('spot_summaries')
            .upsert({
                spot_id: spot_id,
                summary: summary,
                forecast_date: today,
                generated_at: new Date().toISOString()
            }, {
                onConflict: 'spot_id,forecast_date'
            })

        if (upsertError) {
            console.log('Upsert error:', upsertError)
        }

        console.log('Done! Returning response.')

        return new Response(JSON.stringify({
            spot: spot.name,
            summary: summary,
            forecast_data: forecastData
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        })

    } catch (err) {
        console.log('Caught error:', err)
        const message = err instanceof Error ? err.message : String(err)
        return new Response(JSON.stringify({ error: message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        })
    }
})