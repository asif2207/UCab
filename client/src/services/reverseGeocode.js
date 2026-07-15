/**
 * Convert latitude & longitude into a readable address
 * using OpenStreetMap Nominatim Reverse Geocoding.
 */

export async function reverseGeocode(lat, lng) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch address");
    }

    const data = await response.json();

    if (!data || !data.address) {
      return "Unknown Location";
    }

    const address = data.address;

    // Create a short address like Uber/Ola
    const shortAddress = [
      address.road,
      address.suburb,
      address.city ||
        address.town ||
        address.village,
      address.state,
    ]
      .filter(Boolean)
      .join(", ");

    return shortAddress || data.display_name || "Unknown Location";
  } catch (error) {
    console.error("Reverse Geocode Error:", error);

    return "Unknown Location";
  }
}