// server/api/__sitemap__/urls.ts
export default defineEventHandler(async () => {
    const spots = await $fetch('/api/spots') // or however you fetch spots

    return spots.map(spot => ({
        loc: `/spots/${spot.slug}`,
        lastmod: new Date().toISOString(),
    }))
})