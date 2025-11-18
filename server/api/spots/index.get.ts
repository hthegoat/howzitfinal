import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)

  const { data, error } = await client
    .from('spots')
    .select('slug, name, region, country, difficulty, crowd_factor')

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return data
})
