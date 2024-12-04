// utils.js

// Функция для вычисления расстояния между двумя точками
export function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Радиус Земли в километрах
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Функция для преобразования градусов в радианы
export function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

// Функция для форматирования и проверки номера телефона
export function formatPhoneNumber(phone) {
  let cleaned = phone.replace(/[\s\-()]/g, '').replace(/^\+/, '');

  if (cleaned.startsWith('48')) {
    if (cleaned.length !== 11) return null;
  } else {
    if (cleaned.length !== 9) return null;
    cleaned = '48' + cleaned;
  }

  return '+' + cleaned;
}
