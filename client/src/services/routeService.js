/**
 * Route Service
 * Uses OSRM (Open Source Routing Machine)
 * to calculate route, distance and duration.
 */

const OSRM_BASE_URL = "https://router.project-osrm.org/route/v1/driving";

/**
 * Get route between pickup and drop.
 * @param {{lat:number,lng:number}} pickup
 * @param {{lat:number,lng:number}} drop
 */
export async function getRoute(pickup, drop) {
  try {
    const url =
      `${OSRM_BASE_URL}/` +
      `${pickup.lng},${pickup.lat};${drop.lng},${drop.lat}` +
      `?overview=full&geometries=geojson`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Unable to fetch route");
    }

    const data = await response.json();

    if (!data.routes || data.routes.length === 0) {
      throw new Error("No route found");
    }

    const route = data.routes[0];

    return {
      success: true,

      distance: route.distance,      // meters
      duration: route.duration,      // seconds

      distanceText: formatDistance(route.distance),

      durationText: formatDuration(route.duration),

      coordinates: route.geometry.coordinates.map(
        ([lng, lat]) => ({
          lat,
          lng,
        })
      ),
    };
  } catch (error) {
    console.error("Route Error:", error);

    return {
      success: false,
      message: error.message,
    };
  }
}

/**
 * Fare Calculator
 */

export function calculateFare(distanceMeters) {

  const distanceKm = distanceMeters / 1000;

  const baseFare = 50;

  const perKm = 15;

  const fare = baseFare + distanceKm * perKm;

  return Math.round(fare);
}

/**
 * Distance Formatter
 */

export function formatDistance(distance) {

  if (distance < 1000) {

    return `${Math.round(distance)} m`;

  }

  return `${(distance / 1000).toFixed(1)} km`;

}

/**
 * Duration Formatter
 */

export function formatDuration(seconds) {

  const mins = Math.round(seconds / 60);

  if (mins < 60) {

    return `${mins} min`;

  }

  const hrs = Math.floor(mins / 60);

  const rem = mins % 60;

  return `${hrs} hr ${rem} min`;

}