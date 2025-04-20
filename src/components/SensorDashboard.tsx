
import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
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
  const [lastUpdate, setLastUpdate] = useState<string>("No updates yet");

  useEffect(() => {
    // Initial fetch of the most recent reading
    const fetchLatestReading = async () => {
      try {
        const { data, error } = await supabase
          .from('sensor_readings')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error) {
          console.error('Error fetching latest reading:', error);
          setSupabaseError(true);
          return;
        }

        if (data) {
          console.log('Initial data loaded:', data);
          const newData = {
            particulate: { pm25: Number(data.pm25) },
            dht11: { 
              temperature: Number(data.temperature),
              humidity: Number(data.humidity)
            },
            mq7: { co: Number(data.co) }
          };
          
          setSensorData(newData);
          setLastUpdate(new Date().toLocaleTimeString());
          await checkAirQuality(newData.particulate.pm25, newData.mq7.co);
        }
      } catch (err) {
        console.error('Unexpected error during fetch:', err);
        setSupabaseError(true);
      }
    };

    fetchLatestReading();
    console.log('Setting up realtime subscription...');
    
    // Set up the Supabase realtime subscription
    const channel = supabase
      .channel('sensor-readings-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'sensor_readings'
        },
        async (payload) => {
          console.log('Received new sensor reading in realtime:', payload.new);
          
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
          
          console.log('Formatted sensor data for UI update:', newData);
          setSensorData(newData);
          setLastUpdate(new Date().toLocaleTimeString());
          await checkAirQuality(newData.particulate.pm25, newData.mq7.co);
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to realtime updates');
        } else if (status === 'TIMED_OUT' || status === 'CHANNEL_ERROR') {
          console.error('Failed to subscribe to realtime updates:', status);
          setSupabaseError(true);
        }
      });

    // Error handling for subscription
    if (channel === null) {
      console.error('Failed to create Supabase channel');
      setSupabaseError(true);
    }

    return () => {
      console.log('Cleaning up subscription');
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-2 text-center">AirGuard</h1>
      <p className="text-center text-gray-600 mb-6">Last update: {lastUpdate}</p>
      
      {supabaseError && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Error connecting to Supabase database. Please check your connection or table permissions.
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
