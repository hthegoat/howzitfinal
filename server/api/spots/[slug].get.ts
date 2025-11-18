import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const slug = getRouterParam(event, 'slug')

  const { data, error } = await client
    .from('spots')
    .select('*')
    .eq('slug', 'slug')
    .single()

  if (error) {
    throw createError({ statusCode: 404, statusMessage: 'Spot not found' })
  }

  return data
})
