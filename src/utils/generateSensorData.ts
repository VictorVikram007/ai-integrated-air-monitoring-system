
export const generateSensorData = () => {
  return {
    particulate: {
      pm25: +(Math.random() * 999.9).toFixed(1),
      pm10: +(Math.random() * 999.9).toFixed(1),
    },
    dht11: {
      temperature: +(20 + Math.random() * 30).toFixed(1), // 0-50°C range
      humidity: +(20 + Math.random() * 70).toFixed(1), // 20-90% range
    },
    mq7: {
      co: Math.floor(20 + Math.random() * 1980), // 20-2000 ppm range
    },
  };
};
