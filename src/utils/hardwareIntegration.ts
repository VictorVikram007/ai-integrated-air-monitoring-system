
import { supabase } from "@/integrations/supabase/client";

interface HardwareReading {
  pm25: number;
  temperature: number;
  humidity: number;
  co: number;
}

export const submitSensorReading = async (reading: HardwareReading) => {
  try {
    // Make sure readings are properly formatted as numbers
    const formattedReading = {
      pm25: Number(reading.pm25),
      co: Number(reading.co),
      temperature: Number(reading.temperature),
      humidity: Number(reading.humidity),
      pm10: 0, // Required by schema but not used in this example
      created_at: new Date().toISOString()
    };

    console.log('Submitting formatted sensor reading:', formattedReading);
    
    const { error } = await supabase
      .from('sensor_readings')
      .insert(formattedReading);

    if (error) {
      console.error('Error storing sensor reading:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error submitting sensor reading:', error);
    return false;
  }
};

// Helper function to validate sensor readings
export const validateSensorReading = (reading: any): HardwareReading | null => {
  if (!reading) return null;
  
  try {
    return {
      pm25: Number(reading.pm25 || 0),
      temperature: Number(reading.temperature || 0),
      humidity: Number(reading.humidity || 0),
      co: Number(reading.co || 0)
    };
  } catch (e) {
    console.error('Failed to validate sensor reading:', e);
    return null;
  }
};
