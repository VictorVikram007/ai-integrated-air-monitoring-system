
import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { generateSensorData } from "@/utils/generateSensorData";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import SensorMap from './SensorMap';
import PM25Sensor from "./sensors/PM25Sensor";
import DHT11Sensor from "./sensors/DHT11Sensor";
import MQ7Sensor from "./sensors/MQ7Sensor";
import { checkAirQuality } from "@/services/qualityChecks";

interface SensorData {
  particulate: {
    pm25: number;
  };
  dht11: {
    temperature: number;
    humidity: number;
  };
  mq7: {
    co: number;
  };
}

const SensorDashboard = () => {
  const [sensorData, setSensorData] = useState<SensorData>({
    particulate: { pm25: 0 },
    dht11: { temperature: 0, humidity: 0 },
    mq7: { co: 0 },
  });
  const [supabaseError, setSupabaseError] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());

  useEffect(() => {
    console.log('Setting up realtime subscription...');
    
    // Subscribe to realtime updates
    const channel = supabase
      .channel('sensor-readings')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'sensor_readings'
        },
        async (payload) => {
          console.log('Received new sensor reading:', payload.new);
          
          // Ensure values are properly formatted as numbers
          const pm25Value = Number(payload.new.pm25);
          const tempValue = Number(payload.new.temperature);
          const humidityValue = Number(payload.new.humidity);
          const coValue = Number(payload.new.co);
          
          const newData = {
            particulate: { pm25: pm25Value },
            dht11: { 
              temperature: tempValue,
              humidity: humidityValue
            },
            mq7: { co: coValue }
          };
          
          console.log('Formatted sensor data:', newData);
          setSensorData(newData);
          setLastUpdateTime(Date.now());
          await checkAirQuality(newData.particulate.pm25, newData.mq7.co);
        }
      )
      .subscribe();

    // Only use generateSensorData if no real-time data is received for 5 seconds
    let fallbackInterval: NodeJS.Timeout;

    const startFallback = () => {
      fallbackInterval = setInterval(() => {
        const timeSinceLastUpdate = Date.now() - lastUpdateTime;
        if (timeSinceLastUpdate > 5000) {
          console.log('No real data for 5 seconds, using generated data');
          const newData = generateSensorData();
          setSensorData(newData);
        }
      }, 2000);
    };

    startFallback();

    return () => {
      console.log('Cleaning up subscription');
      supabase.removeChannel(channel);
      if (fallbackInterval) clearInterval(fallbackInterval);
    };
  }, [lastUpdateTime]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">AirGuard</h1>
      
      {supabaseError && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Error connecting to Supabase database. Sensor data is being generated locally but not stored.
            Please check your connection or table permissions.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <PM25Sensor pm25={sensorData.particulate.pm25} />
        <DHT11Sensor 
          temperature={sensorData.dht11.temperature}
          humidity={sensorData.dht11.humidity}
        />
        <MQ7Sensor co={sensorData.mq7.co} />
      </div>

      <SensorMap />
    </div>
  );
};

export default SensorDashboard;
