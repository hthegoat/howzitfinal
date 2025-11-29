import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SURFLINE_BASE = "https://services.surfline.com/kbyg/spots/forecasts";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Spot {
    id: string;
    name: string;
    slug: string;
    surfline_id: string;
}

interface SurflineWave {
    timestamp: number;
    surf: { min: number; max: number };
    swells: Array<{
        height: number;
        period: number;
        direction: number;
    }>;
}

interface SurflineRating {
    timestamp: number;
    rating: {
        key: string;
        value: number;
    };
}

interface SurflineWind {
    timestamp: number;
    speed: number;
    direction: number;
    directionType: string;
}

interface SurflineTide {
    timestamp: number;
    type: string;
    height: number;
}

async function fetchSurflineData(spotId: string, type: string, days = 6) {
    const params = new URLSearchParams({
        spotId,
        days: days.toString(),
    });

    // Add interval for wave/wind data
    if (type === "wave") {
        params.append("intervalHours", "12"); // 2 data points per day
    } else if (type === "wind") {
        params.append("intervalHours", "6"); // 4 data points per day
    }

    const url = `${SURFLINE_BASE}/${type}?${params}`;
    const res = await fetch(url);

    if (!res.ok) {
        throw new Error(`Surfline API error: ${res.status} ${res.statusText}`);
    }

    return res.json();
}

Deno.serve(async (req) => {
    // Handle CORS preflight
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        // Initialize Supabase client
        const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
        const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Get all spots that have surfline_id
        const { data: spots, error: spotsError } = await supabase
            .from("spots")
            .select("id, name, slug, surfline_id")
            .not("surfline_id", "is", null);

        if (spotsError) {
            throw new Error(`Failed to fetch spots: ${spotsError.message}`);
        }

        if (!spots || spots.length === 0) {
            return new Response(
                JSON.stringify({ message: "No spots with surfline_id found" }),
                { headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        console.log(`Processing ${spots.length} spots...`);

        const results = {
            processed: 0,
            forecasts_saved: 0,
            errors: [] as string[],
        };

        for (const spot of spots as Spot[]) {
            try {
                console.log(`Fetching data for ${spot.name} (${spot.surfline_id})...`);

                // Fetch all data types in parallel
                const [waveData, ratingData, windData, tideData] = await Promise.all([
                    fetchSurflineData(spot.surfline_id, "wave"),
                    fetchSurflineData(spot.surfline_id, "rating"),
                    fetchSurflineData(spot.surfline_id, "wind"),
                    fetchSurflineData(spot.surfline_id, "tides"),
                ]);

                // Process wave forecasts
                const waves: SurflineWave[] = waveData?.data?.wave || [];
                const ratings: SurflineRating[] = ratingData?.data?.rating || [];
                const winds: SurflineWind[] = windData?.data?.wind || [];
                const tides: SurflineTide[] = tideData?.data?.tides || [];

                // Build forecast records (one per wave timestamp)
                const forecasts = waves.map((wave) => {
                    // Find closest rating to this timestamp
                    const rating = ratings.find((r) =>
                        Math.abs(r.timestamp - wave.timestamp) < 43200 // within 12 hours
                    );

                    // Find closest wind to this timestamp
                    const wind = winds.find((w) =>
                        Math.abs(w.timestamp - wave.timestamp) < 21600 // within 6 hours
                    );

                    const primarySwell = wave.swells?.[0];

                    return {
                        spot_id: spot.id,
                        timestamp: new Date(wave.timestamp * 1000).toISOString(),
                        wave_min: wave.surf.min,
                        wave_max: wave.surf.max,
                        swell_height: primarySwell?.height || null,
                        swell_period: primarySwell?.period || null,
                        swell_direction: primarySwell?.direction || null,
                        rating_key: rating?.rating?.key || null,
                        rating_value: rating?.rating?.value || null,
                        wind_speed: wind?.speed || null,
                        wind_direction: wind?.direction || null,
                        wind_type: wind?.directionType || null,
                        fetched_at: new Date().toISOString(),
                    };
                });

                // Upsert forecasts (update if exists, insert if not)
                if (forecasts.length > 0) {
                    const { error: forecastError } = await supabase
                        .from("surfline_forecasts")
                        .upsert(forecasts, {
                            onConflict: "spot_id,timestamp",
                            ignoreDuplicates: false,
                        });

                    if (forecastError) {
                        throw new Error(`Failed to save forecasts: ${forecastError.message}`);
                    }

                    results.forecasts_saved += forecasts.length;
                }

                // Save tide data separately
                const tideRecords = tides
                    .filter((t) => t.type === "HIGH" || t.type === "LOW")
                    .map((t) => ({
                        spot_id: spot.id,
                        timestamp: new Date(t.timestamp * 1000).toISOString(),
                        type: t.type,
                        height: t.height,
                    }));

                if (tideRecords.length > 0) {
                    const { error: tideError } = await supabase
                        .from("surfline_tides")
                        .upsert(tideRecords, {
                            onConflict: "spot_id,timestamp",
                            ignoreDuplicates: false,
                        });

                    if (tideError) {
                        console.error(`Tide save error: ${tideError.message}`);
                    }
                }

                results.processed++;
                console.log(`✓ ${spot.name}: ${forecasts.length} forecasts saved`);

            } catch (spotError) {
                const errorMsg = `${spot.name}: ${spotError instanceof Error ? spotError.message : "Unknown error"}`;
                console.error(`✗ ${errorMsg}`);
                results.errors.push(errorMsg);
            }
        }

        return new Response(
            JSON.stringify({
                message: "Surfline ingestion complete",
                ...results,
            }),
            {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
        );

    } catch (error) {
        console.error("Ingestion error:", error);
        return new Response(
            JSON.stringify({
                error: error instanceof Error ? error.message : "Unknown error",
            }),
            {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
        );
    }
});