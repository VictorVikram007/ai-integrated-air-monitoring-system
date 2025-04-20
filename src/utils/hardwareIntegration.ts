
import { supabase } from "@/integrations/supabase/client";

interface HardwareReading {
  pm25: number;
  temperature: number;
  humidity: number;
  co: number;
}

export const submitSensorReading = async (reading: HardwareReading) => {
  try {
    const { error } = await supabase
      .from('sensor_readings')
      .insert({
        pm25: reading.pm25,
        co: reading.co,
        temperature: reading.temperature,
        humidity: reading.humidity,
        pm10: 0, // Required by schema but not used in this example
        created_at: new Date().toISOString()
      });

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
