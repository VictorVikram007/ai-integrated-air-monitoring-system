
let previousReadings = {
  particulate: {
    pm25: 50,
    pm10: 50,
  },
  dht11: {
    temperature: 25,
    humidity: 50,
  },
  mq7: {
    co: 30,
  },
};

// Helper function to generate gradual change
const getGradualChange = (current: number, min: number, max: number, maxChange: number) => {
  const change = (Math.random() - 0.5) * 2 * maxChange;
  const newValue = current + change;
  return Math.min(Math.max(newValue, min), max);
};

export const generateSensorData = () => {
  // Generate new readings with gradual changes
  const newReadings = {
    particulate: {
      pm25: getGradualChange(previousReadings.particulate.pm25, 0, 999.9, 5),
      pm10: getGradualChange(previousReadings.particulate.pm10, 0, 999.9, 5),
    },
    dht11: {
      temperature: getGradualChange(previousReadings.dht11.temperature, 0, 50, 0.5),
      humidity: getGradualChange(previousReadings.dht11.humidity, 20, 90, 1),
    },
    mq7: {
      co: Math.floor(getGradualChange(previousReadings.mq7.co, 20, 2000, 10)),
    },
  };

  // Update previous readings for next iteration
  previousReadings = newReadings;

  return newReadings;
};

