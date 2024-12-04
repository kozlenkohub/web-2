// utils.js

/**
 * Calculate the distance between two latitude/longitude points in kilometers.
 * @param {number} lat1 - Latitude of the first point.
 * @param {number} lon1 - Longitude of the first point.
 * @param {number} lat2 - Latitude of the second point.
 * @param {number} lon2 - Longitude of the second point.
 * @returns {number} Distance in kilometers.
 */
export function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const earthRadiusKm = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
}

/**
 * Convert degrees to radians.
 * @param {number} deg - Degrees to convert.
 * @returns {number} Radians.
 */
export function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

/**
 * Convert a time string (HH:MM) to minutes.
 * @param {string} timeString - Time string in HH:MM format.
 * @returns {number} Total minutes.
 */
export function timeStringToMinutes(timeString) {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
}
