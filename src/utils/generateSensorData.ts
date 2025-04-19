
let previousReadings = {
  particulate: {
    pm25: 50,
  },
  dht11: {
    temperature: 30,
    humidity: 70,    
  },
  mq7: {
    co: 30,
  },
};

// Helper function to generate gradual change with integers
const getGradualChange = (current: number, min: number, max: number, maxChange: number) => {
  const change = Math.floor((Math.random() - 0.5) * 2 * maxChange);
  const newValue = Math.floor(current + change);
  return Math.min(Math.max(newValue, min), max);
};

export const generateSensorData = () => {
  // Generate new readings with gradual changes (all integers)
  const newReadings = {
    particulate: {
      pm25: getGradualChange(previousReadings.particulate.pm25, 0, 999, 5),
    },
    dht11: {
      temperature: getGradualChange(previousReadings.dht11.temperature, 25, 40, 1), 
      humidity: getGradualChange(previousReadings.dht11.humidity, 60, 90, 2),      
    },
    mq7: {
      co: getGradualChange(previousReadings.mq7.co, 20, 2000, 10),
    },
  };

  // Update previous readings for next iteration
  previousReadings = newReadings;

  return newReadings;
};
