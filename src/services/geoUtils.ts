export async function geocodeAddress(addressText: string): Promise<{ lat: number; lng: number } | null> {
  if (!addressText || !addressText.trim()) return null;

  // 1. Return raw coordinates immediately if they are already in the string
  const coordMatch = addressText.match(/(-?\d+\.\d+),\s*(-?\d+\.\d+)/);
  if (coordMatch && coordMatch[1] && coordMatch[2]) {
    return {
      lat: parseFloat(coordMatch[1]),
      lng: parseFloat(coordMatch[2]),
    };
  }

  // 2. Extract PIN code if present
  const pinMatch = addressText.match(/\b\d{6}\b/);
  const pincode = pinMatch ? pinMatch[0] : null;

  // 3. Progressive query ladder: Full text -> Pincode -> City/State
  const queries: string[] = [addressText.trim()];
  if (pincode) {
    queries.push(`${pincode}, India`);
  }

  const parts = addressText.split(',').map((p) => p.trim()).filter(Boolean);
  if (parts.length >= 2) {
    queries.push(`${parts.slice(-2).join(', ')}, India`);
  }
  if (parts.length >= 1) {
    queries.push(`${parts[parts.length - 1]}, India`);
  }

  for (const query of queries) {
    try {
      const cleanQuery = encodeURIComponent(query);
      // NOTE: Removed 'User-Agent' header to prevent browser Fetch API security exceptions
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${cleanQuery}&format=json&limit=1`,
        {
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      if (!res.ok) continue;

      const data = await res.json();
      if (data && data.length > 0) {
        console.log(`[geoUtils] Successfully geocoded "${query}" -> Lat: ${data[0].lat}, Lon: ${data[0].lon}`);
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
        };
      }
    } catch (err) {
      console.warn(`[geoUtils] Failed lookup for query "${query}":`, err);
    }
  }

  console.warn('[geoUtils] All geocoding fallbacks failed for:', addressText);
  return null;
}