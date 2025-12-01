// composables/useSpotSummary.js

export const useSpotSummary = () => {

    // Format direction degrees to compass
    const degreesToCompass = (degrees) => {
        if (degrees === null || degrees === undefined) return '--'
        const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
        return dirs[Math.round(degrees / 45) % 8]
    }

    // Wind quality based on beach orientation
    const getWindQuality = (windDirection, beachOrientation) => {
        if (!windDirection || !beachOrientation) return 'unknown'

        let diff = Math.abs(windDirection - beachOrientation)
        if (diff > 180) diff = 360 - diff

        if (diff >= 150) return 'offshore'
        if (diff >= 120) return 'cross-offshore'
        if (diff >= 60) return 'cross-shore'
        if (diff >= 30) return 'cross-onshore'
        return 'onshore'
    }

    // Swell quality based on beach orientation
    const getSwellQuality = (swellDirection, beachOrientation) => {
        if (!swellDirection || !beachOrientation) return 'unknown'

        let diff = Math.abs(swellDirection - beachOrientation)
        if (diff > 180) diff = 360 - diff

        if (diff <= 30) return 'ideal'
        if (diff <= 60) return 'good'
        if (diff <= 90) return 'fair'
        return 'poor'
    }

    // Format forecast data for LLM consumption
    const formatForLLM = ({ spot, forecasts, tides, waterTemp }) => {
        if (!spot || !forecasts?.length) return null

        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

        // Group forecasts by day
        const byDay = {}
        forecasts.forEach(f => {
            const date = new Date(f.timestamp)
            const dateKey = date.toDateString()

            if (!byDay[dateKey]) {
                byDay[dateKey] = {
                    date,
                    dateStr: `${days[date.getDay()]} ${months[date.getMonth()]} ${date.getDate()}`,
                    forecasts: []
                }
            }

            const hour = date.getHours()
            const period = hour < 12 ? 'AM' : 'PM'
            const windMph = f.wind_speed ? Math.round(f.wind_speed * 1.151) : null

            byDay[dateKey].forecasts.push({
                period,
                hour,
                waveMin: f.wave_min,
                waveMax: f.wave_max,
                swellPeriod: f.swell_period ? Math.round(f.swell_period) : null,
                swellDir: f.swell_direction,
                swellDirCompass: degreesToCompass(f.swell_direction),
                windSpeed: windMph,
                windDir: f.wind_direction,
                windDirCompass: degreesToCompass(f.wind_direction),
                windQuality: getWindQuality(f.wind_direction, spot.orientation),
                swellQuality: getSwellQuality(f.swell_direction, spot.orientation),
                rating: f.rating_key
            })
        })

        // Group tides by day
        const tidesByDay = {}
        tides?.forEach(t => {
            const date = new Date(t.timestamp)
            const dateKey = date.toDateString()

            if (!tidesByDay[dateKey]) {
                tidesByDay[dateKey] = []
            }

            tidesByDay[dateKey].push({
                type: t.type,
                time: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
                height: t.height
            })
        })

        // Build the formatted string
        let output = `Spot: ${spot.name}\n`
        output += `Location: ${spot.region}, ${spot.state}\n`
        output += `Beach orientation: ${spot.orientation}° (faces ${degreesToCompass(spot.orientation)})\n`

        if (waterTemp) {
            output += `Water temp: ${waterTemp}°F\n`
        }

        output += `\n--- 5-Day Forecast ---\n\n`

        // Sort days chronologically
        const sortedDays = Object.values(byDay).sort((a, b) => a.date - b.date).slice(0, 5)

        sortedDays.forEach(day => {
            output += `${day.dateStr}:\n`

            // Add tides for this day
            const dayTides = tidesByDay[day.date.toDateString()]
            if (dayTides?.length) {
                const tideStr = dayTides
                    .sort((a, b) => new Date('1970/01/01 ' + a.time) - new Date('1970/01/01 ' + b.time))
                    .map(t => `${t.type} ${t.time} (${t.height}ft)`)
                    .join(' → ')
                output += `  Tides: ${tideStr}\n`
            }

            // Group by AM/PM
            const amForecasts = day.forecasts.filter(f => f.period === 'AM')
            const pmForecasts = day.forecasts.filter(f => f.period === 'PM')

            // AM summary
            if (amForecasts.length) {
                const am = amForecasts[0] // Use first AM reading
                output += `  AM: ${am.waveMin}-${am.waveMax}ft, ${am.swellPeriod}s period`
                if (am.windSpeed) {
                    output += `, wind ${am.windSpeed}mph ${am.windDirCompass} (${am.windQuality})`
                }
                output += `\n`
            }

            // PM summary
            if (pmForecasts.length) {
                const pm = pmForecasts[0] // Use first PM reading
                output += `  PM: ${pm.waveMin}-${pm.waveMax}ft, ${pm.swellPeriod}s period`
                if (pm.windSpeed) {
                    output += `, wind ${pm.windSpeed}mph ${pm.windDirCompass} (${pm.windQuality})`
                }
                output += `\n`
            }

            output += `\n`
        })

        return output
    }

    // Build the data object (for programmatic use)
    const buildForecastData = ({ spot, forecasts, tides, waterTemp }) => {
        if (!spot || !forecasts?.length) return null

        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

        // Group forecasts by day
        const byDay = {}
        forecasts.forEach(f => {
            const date = new Date(f.timestamp)
            const dateKey = date.toDateString()

            if (!byDay[dateKey]) {
                byDay[dateKey] = {
                    date,
                    dayName: days[date.getDay()],
                    forecasts: []
                }
            }

            const hour = date.getHours()
            const windMph = f.wind_speed ? Math.round(f.wind_speed * 1.151) : null

            byDay[dateKey].forecasts.push({
                hour,
                period: hour < 12 ? 'AM' : 'PM',
                waveMin: f.wave_min,
                waveMax: f.wave_max,
                swellPeriod: f.swell_period ? Math.round(f.swell_period) : null,
                swellDir: f.swell_direction,
                windSpeed: windMph,
                windDir: f.wind_direction,
                windQuality: getWindQuality(f.wind_direction, spot.orientation),
                swellQuality: getSwellQuality(f.swell_direction, spot.orientation),
                rating: f.rating_key
            })
        })

        // Group tides by day
        const tidesByDay = {}
        tides?.forEach(t => {
            const date = new Date(t.timestamp)
            const dateKey = date.toDateString()

            if (!tidesByDay[dateKey]) {
                tidesByDay[dateKey] = []
            }

            tidesByDay[dateKey].push({
                type: t.type,
                timestamp: t.timestamp,
                height: t.height
            })
        })

        // Build structured output
        const sortedDays = Object.values(byDay).sort((a, b) => a.date - b.date).slice(0, 5)

        return {
            spot: {
                name: spot.name,
                region: spot.region,
                state: spot.state,
                orientation: spot.orientation,
                orientationCompass: degreesToCompass(spot.orientation)
            },
            waterTemp,
            days: sortedDays.map(day => ({
                date: day.date,
                dayName: day.dayName,
                tides: tidesByDay[day.date.toDateString()] || [],
                am: day.forecasts.find(f => f.period === 'AM') || null,
                pm: day.forecasts.find(f => f.period === 'PM') || null
            }))
        }
    }

    return {
        formatForLLM,
        buildForecastData,
        getWindQuality,
        getSwellQuality
    }
}