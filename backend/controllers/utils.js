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
  // Удаляем пробелы, дефисы и скобки
  let cleaned = phone.replace(/[\s\-()]/g, '');

  // Удаляем ведущий '+' при наличии
  if (cleaned.startsWith('+')) {
    cleaned = cleaned.substring(1);
  }

  // Если номер начинается с '48', то он содержит код страны
  if (cleaned.startsWith('48')) {
    // Должно быть '48' + 9 цифр = 11 цифр
    if (cleaned.length !== 11) {
      return null; // Неверный номер телефона
    }
  } else {
    // Должно быть 9 цифр
    if (cleaned.length !== 9) {
      return null; // Неверный номер телефона
    }
    // Добавляем код страны
    cleaned = '48' + cleaned;
  }

  // Возвращаем в формате '+48XXXXXXXXX'
  return '+' + cleaned;
}
