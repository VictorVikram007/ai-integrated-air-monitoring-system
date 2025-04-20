
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

interface HardwareReading {
  pm25: number;
  temperature: number;
  humidity: number;
  co: number;
}

export const submitSensorReading = async (reading: HardwareReading) => {
  // Validate reading values to ensure they are within reasonable ranges
  const isValidReading = validateSensorReading(reading);
  
  if (!isValidReading) {
    console.error('Invalid sensor reading. Skipping submission:', reading);
    toast.warning('Invalid Sensor Reading', {
      description: 'The sensor data appears to be outside expected ranges.'
    });
    return false;
  }

  try {
    // Ensure readings are properly formatted as numbers
    const formattedReading = {
      pm25: Number(reading.pm25),
      co: Number(reading.co),
      temperature: Number(reading.temperature),
      humidity: Number(reading.humidity),
      pm10: 0, // Required by schema but not used in this example
      created_at: new Date().toISOString()
    };

    console.log('Submitting validated sensor reading:', formattedReading);
    
    const { error } = await supabase
      .from('sensor_readings')
      .insert(formattedReading);

    if (error) {
      console.error('Error storing sensor reading:', error);
      toast.error('Database Error', {
        description: 'Failed to store sensor reading.'
      });
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error submitting sensor reading:', error);
    toast.error('Submission Error', {
      description: 'An unexpected error occurred while submitting sensor data.'
    });
    return false;
  }
};

// Enhanced validation function with stricter checks
export const validateSensorReading = (reading: HardwareReading): boolean => {
  // Check if all values are numbers and within reasonable ranges
  const isValid = 
    reading &&
    !isNaN(reading.pm25) && reading.pm25 >= 0 && reading.pm25 <= 500 && // PM2.5 typically ranges from 0-500 µg/m³
    !isNaN(reading.temperature) && reading.temperature >= -50 && reading.temperature <= 100 && // Reasonable temp range
    !isNaN(reading.humidity) && reading.humidity >= 0 && reading.humidity <= 100 && // Humidity 0-100%
    !isNaN(reading.co) && reading.co >= 0 && reading.co <= 1000; // CO levels typically 0-1000 ppm

  return isValid;
};
