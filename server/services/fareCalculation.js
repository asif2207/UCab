const BASE_FARES = {
  mini: 30,
  sedan: 50,
  suv: 80,
};

const PER_KM_RATES = {
  mini: 10,
  sedan: 15,
  suv: 22,
};

const calculateFare = (cabType, distanceKm) => {
  const base = BASE_FARES[cabType] || 30;
  const perKm = PER_KM_RATES[cabType] || 10;
  const fare = base + perKm * distanceKm;
  return Math.round(fare);
};

module.exports = calculateFare;