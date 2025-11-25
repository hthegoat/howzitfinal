// composables/useForecast.js

export const useForecast = () => {
  /**
   * Fetch current conditions for a spot
   */
  const fetchSpotForecast = async (spotSlug) => {
    try {
      const data = await $fetch(`/api/forecast/${spotSlug}`)
      return data
    } catch (error) {
      console.error('Error fetching forecast:', error)
      throw error
    }
  }

  /**
   * Get real-time forecast with auto-refresh
   */
  const useSpotForecast = (spotSlug) => {
    const forecast = useState(`forecast-${spotSlug}`, () => null)
    const loading = useState(`forecast-loading-${spotSlug}`, () => false)
    const error = useState(`forecast-error-${spotSlug}`, () => null)

    const refresh = async () => {
      loading.value = true
      error.value = null

      try {
        const data = await fetchSpotForecast(spotSlug)
        forecast.value = data
      } catch (err) {
        error.value = err.message
      } finally {
        loading.value = false
      }
    }

    // Auto-refresh on mount
    onMounted(() => {
      refresh()
    })

    return {
      forecast: readonly(forecast),
      loading: readonly(loading),
      error: readonly(error),
      refresh
    }
  }

  return {
    fetchSpotForecast,
    useSpotForecast
  }
}