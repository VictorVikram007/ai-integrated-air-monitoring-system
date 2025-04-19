
export interface AirQualityInfo {
  label: string;
  color: string;
  range: [number, number];
}

export const getAirQualityInfo = (pm25: number): AirQualityInfo => {
  if (pm25 > 180) return { label: 'Severe', color: 'bg-red-500 hover:bg-red-600', range: [180, 250] };
  if (pm25 > 90) return { label: 'Very Poor', color: 'bg-orange-500 hover:bg-orange-600', range: [91, 180] };
  if (pm25 > 60) return { label: 'Poor', color: 'bg-yellow-500 hover:bg-yellow-600', range: [61, 90] };
  if (pm25 > 30) return { label: 'Moderate', color: 'bg-blue-500 hover:bg-blue-600', range: [31, 60] };
  return { label: 'Good', color: 'bg-green-500 hover:bg-green-600', range: [0, 30] };
};
