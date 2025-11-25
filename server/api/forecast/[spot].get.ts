import { serverSupabaseClient } from '#supabase/server'
const generateMockForecast = () => {
    const hours = []
    const heights = []
    const currentHour = new Date().getHours()

    for (let i = 0; i <= 24; i++) {
        hours.push(i)
        // Create a wave pattern
        const baseHeight = spotSlug === 'spring-lake' ? 3 : 2
        const height = baseHeight + 1.5 * Math.sin(((i + currentHour) / 6) * Math.PI)
        heights.push(Math.max(0.5, height)) // Ensure non-negative
    }

    return {
        hours,
        heights,
        current: {
            height: heights[0].toFixed(1),
            period: 9,
            wind: { speed: 12, direction: 'WNW' },
            temp: 56
        }
    }
}

const forecastData = generateMockForecast()

return {
    spot,
    forecast: forecastData
}
})
