export interface DetailedAddress {
  neighbourhood: string;
  suburb: string;
  city: string;
  state: string;
  pincode: string;
  formattedAddress: string;
}

export async function fetchNeighborhoodFromCoords(
  lat: number,
  lng: number
): Promise<DetailedAddress | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&addressdetails=1`,
      {
        headers: {
          'Accept-Language': 'en',
        },
      }
    );
    if (!res.ok) throw new Error('Reverse geocoding failed');

    const data = await res.json();
    const addr = data.address || {};

    // Specific local area: e.g., "Jubilee Hills", "Banjara Hills", "Madhapur"
    const localArea =
      addr.neighbourhood ||
      addr.suburb ||
      addr.residential ||
      addr.subdistrict ||
      addr.commercial ||
      '';

    const city = addr.city || addr.town || addr.county || 'Hyderabad';
    const state = addr.state || 'Telangana';
    const pincode = addr.postcode || '';

    const addressParts = [
      addr.road || '',
      localArea,
      city,
      state,
      pincode ? `PIN: ${pincode}` : '',
    ].filter(Boolean);

    return {
      neighbourhood: addr.neighbourhood || '',
      suburb: localArea,
      city,
      state,
      pincode,
      formattedAddress: addressParts.join(', '),
    };
  } catch (err) {
    console.error('Nominatim reverse geocode error:', err);
    return null;
  }
}

// Fallback: GPS coordinate fetch via HTML5
export function getBrowserPosition(): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('Geolocation not supported by this browser.'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
}