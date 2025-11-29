/**
 * Test Surfline API - Run this locally to verify it works
 * 
 * Usage: node test-surfline-api.mjs
 */

const SURFLINE_BASE = 'https://services.surfline.com/kbyg/spots/forecasts';

// NJ Spot IDs
const SPOTS = {
    'Manasquan Inlet': '5842041f4e65fad6a7708856',
    '16th Ave Belmar': '5842041f4e65fad6a7708a01',
    'Asbury Park': '5842041f4e65fad6a7708a02',
    'Sandy Hook': '5842041f4e65fad6a7708a05',
    'Seaside Park': '5842041f4e65fad6a7708a12',
};

async function fetchWaveForecast(spotId, days = 5) {
    const url = `${SURFLINE_BASE}/wave?spotId=${spotId}&days=${days}&intervalHours=24`;
    console.log(`Fetching: ${url}\n`);

    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    return res.json();
}

async function fetchRating(spotId, days = 5) {
    const url = `${SURFLINE_BASE}/rating?spotId=${spotId}&days=${days}`;
    const res = await fetch(url);
    return res.json();
}

async function fetchTides(spotId, days = 5) {
    const url = `${SURFLINE_BASE}/tides?spotId=${spotId}&days=${days}`;
    const res = await fetch(url);
    return res.json();
}

async function fetchWind(spotId, days = 5) {
    const url = `${SURFLINE_BASE}/wind?spotId=${spotId}&days=${days}&intervalHours=3`;
    const res = await fetch(url);
    return res.json();
}

async function main() {
    const spotName = 'Manasquan Inlet';
    const spotId = SPOTS[spotName];

    console.log(`\n========================================`);
    console.log(`Testing Surfline API for: ${spotName}`);
    console.log(`Spot ID: ${spotId}`);
    console.log(`========================================\n`);

    try {
        // Test Wave Forecast
        console.log('📊 WAVE FORECAST:');
        console.log('─────────────────');
        const waves = await fetchWaveForecast(spotId);

        if (waves.data && waves.data.wave) {
            waves.data.wave.slice(0, 5).forEach((w, i) => {
                const date = new Date(w.timestamp * 1000).toLocaleDateString();
                console.log(`  ${date}: ${w.surf.min}-${w.surf.max}ft`);
                if (w.swells && w.swells[0]) {
                    const s = w.swells[0];
                    console.log(`    └─ Primary swell: ${s.height}ft @ ${s.period}s from ${s.direction}°`);
                }
            });
        } else {
            console.log('  Raw response:', JSON.stringify(waves, null, 2));
        }

        // Test Rating
        console.log('\n⭐ RATING FORECAST:');
        console.log('───────────────────');
        const rating = await fetchRating(spotId);

        if (rating.data && rating.data.rating) {
            rating.data.rating.slice(0, 5).forEach((r) => {
                const date = new Date(r.timestamp * 1000).toLocaleDateString();
                console.log(`  ${date}: ${r.rating.key} (${r.rating.value}/6)`);
            });
        }

        // Test Tides  
        console.log('\n🌊 TIDES:');
        console.log('─────────');
        const tides = await fetchTides(spotId);

        if (tides.data && tides.data.tides) {
            // Show just high/low tides for today
            const today = new Date().toDateString();
            const todayTides = tides.data.tides.filter(t => {
                return new Date(t.timestamp * 1000).toDateString() === today &&
                    (t.type === 'HIGH' || t.type === 'LOW');
            });
            todayTides.forEach(t => {
                const time = new Date(t.timestamp * 1000).toLocaleTimeString();
                console.log(`  ${t.type}: ${t.height.toFixed(1)}ft @ ${time}`);
            });
        }

        // Test Wind
        console.log('\n💨 WIND:');
        console.log('────────');
        const wind = await fetchWind(spotId);

        if (wind.data && wind.data.wind) {
            wind.data.wind.slice(0, 4).forEach((w) => {
                const time = new Date(w.timestamp * 1000).toLocaleString();
                console.log(`  ${time}: ${w.speed}mph ${w.directionType} from ${w.direction}°`);
            });
        }

        console.log('\n✅ API TEST SUCCESSFUL!\n');
        console.log('Units from API:', waves.associated?.units || 'not specified');

    } catch (err) {
        console.error('\n❌ API TEST FAILED:', err.message);
    }
}

main();
