/* eslint-disable prefer-const */
export interface DetailedAddress {
  neighbourhood: string;
  suburb: string;
  city: string;
  state: string;
  pincode: string;
  formattedAddress: string;
  accuracyMeters?: number;
}

/**
 * Reverse geocodes coordinates with maximum decimal preservation (6 decimals)
 * and zoom=18 for building/colony-level boundary snapping.
 */
export async function fetchNeighborhoodFromCoords(
  lat: number,
  lng: number,
  accuracy?: number
): Promise<DetailedAddress | null> {
  try {
    const fixedLat = Number(lat).toFixed(6);
    const fixedLng = Number(lng).toFixed(6);

    console.log(`[Geo] Polling settled at Lat: ${fixedLat}, Lng: ${fixedLng}, ±${accuracy}m`);

    // zoom=18 targets parcel/building/colony boundaries rather than district polygons
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${fixedLat}&lon=${fixedLng}&zoom=18&addressdetails=1`;

    const res = await fetch(url, {
      headers: {
        'Accept-Language': 'en',
      },
    });

    if (!res.ok) throw new Error(`Reverse geocoding failed: ${res.statusText}`);

    const data = await res.json();
    const addr = data.address || {};

    // Micro-locality priority (Indian urban address hierarchy)
    const colonyOrSociety =
      addr.residential ||
      addr.housing_development ||
      addr.allotments ||
      addr.neighbourhood ||
      addr.suburb ||
      addr.quarter ||
      addr.subdistrict ||
      '';

    const road = addr.road || addr.pedestrian || addr.footway || '';
    const city = addr.city || addr.town || addr.municipality || addr.county || 'Hyderabad';
    const state = addr.state || 'Telangana';
    const pincode = addr.postcode || '';

    // Cleanly construct address parts without duplicates
    const addressParts: string[] = [];
    if (road) addressParts.push(road.trim());
    if (colonyOrSociety && colonyOrSociety !== road) addressParts.push(colonyOrSociety.trim());
    if (city && city !== colonyOrSociety) addressParts.push(city.trim());
    if (state) addressParts.push(state.trim());
    if (pincode) addressParts.push(`PIN: ${pincode.trim()}`);

    return {
      neighbourhood: addr.neighbourhood || addr.residential || '',
      suburb: colonyOrSociety,
      city,
      state,
      pincode,
      formattedAddress: addressParts.join(', '),
      accuracyMeters: accuracy ? Math.round(accuracy) : undefined,
    };
  } catch (err) {
    console.error('Nominatim reverse geocode error:', err);
    return null;
  }
}

/**
 * High-accuracy position poller.
 * Uses watchPosition to settle the GPS/Wi-Fi radio until an acceptable
 * accuracy threshold is reached (< 25m) or timeout expires.
 */
export function getBrowserPosition(
  desiredAccuracyMeters = 25,
  timeoutMs = 8000
): Promise<{ lat: number; lng: number; accuracy: number }> {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('Geolocation not supported by this browser.'));
      return;
    }

    let bestReading: GeolocationPosition | null = null;
    let timerId: ReturnType<typeof setTimeout> | undefined;
    let watchId: number | undefined;

    const cleanup = () => {
      if (watchId !== undefined) navigator.geolocation.clearWatch(watchId);
      if (timerId !== undefined) clearTimeout(timerId);
    };

    watchId = navigator.geolocation.watchPosition(
      (pos) => {
        // Track the reading with the tightest precision circle
        if (!bestReading || pos.coords.accuracy < bestReading.coords.accuracy) {
          bestReading = pos;
        }

        // If reading satisfies our precision threshold, return immediately
        if (pos.coords.accuracy <= desiredAccuracyMeters) {
          cleanup();
          resolve({
            lat: Number(pos.coords.latitude.toFixed(6)),
            lng: Number(pos.coords.longitude.toFixed(6)),
            accuracy: pos.coords.accuracy,
          });
        }
      },
      (err) => {
        cleanup();
        reject(err);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: timeoutMs,
      }
    );

    // Timeout fallback: Return the best reading collected so far
    timerId = setTimeout(() => {
      cleanup();
      if (bestReading) {
        resolve({
          lat: Number(bestReading.coords.latitude.toFixed(6)),
          lng: Number(bestReading.coords.longitude.toFixed(6)),
          accuracy: bestReading.coords.accuracy,
        });
      } else {
        reject(new Error('Unable to lock location within the timeout window.'));
      }
    }, timeoutMs);
  });
}