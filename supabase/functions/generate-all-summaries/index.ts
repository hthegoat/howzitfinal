import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)

serve(async (req) => {
    console.log('--- Starting batch summary generation ---')

    try {
        // Get all spots
        const { data: spots, error } = await supabase
            .from('spots')
            .select('id, name')

        if (error || !spots) {
            return new Response(JSON.stringify({ error: 'Failed to fetch spots' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            })
        }

        console.log(`Found ${spots.length} spots`)

        const results = []

        for (const spot of spots) {
            console.log(`Processing: ${spot.name}`)

            try {
                // Call the single-spot function
                const response = await fetch(`${SUPABASE_URL}/functions/v1/generate-spot-summary`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
                    },
                    body: JSON.stringify({ spot_id: spot.id })
                })

                const result = await response.json()
                results.push({ spot: spot.name, status: response.ok ? 'success' : 'failed', summary: result.summary?.slice(0, 50) })

                // Small delay to avoid rate limits
                await new Promise(r => setTimeout(r, 500))

            } catch (err) {
                console.log(`Error processing ${spot.name}:`, err)
                results.push({ spot: spot.name, status: 'error' })
            }
        }

        console.log('--- Batch complete ---')

        return new Response(JSON.stringify({
            processed: spots.length,
            results
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        })

    } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        return new Response(JSON.stringify({ error: message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        })
    }
})