
import { useEffect, useState } from "react";
import { Gauge, ChartLine, Wind, AlertTriangle } from "lucide-react";
import { generateSensorData } from "@/utils/generateSensorData";
import { toast } from "@/components/ui/sonner";
import SensorCard from "./SensorCard";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";

interface SensorData {
  particulate: {
    pm25: number;
    pm10: number;
  };
  dht11: {
    temperature: number;
    humidity: number;
  };
  mq7: {
    co: number;
  };
}

const checkAirQuality = async (pm25: number, pm10: number, co: number) => {
  try {
    // Call Supabase Edge Function for anomaly detection
    const { data, error } = await supabase.functions.invoke('detect-anomaly', {
      body: {
        pm25,
        pm10,
        co
      }
    });

    if (error) {
      console.error('Error checking anomaly:', error);
      return;
    }

    if (data?.isAnomaly) {
      toast.warning("Anomaly Detected!", {
        description: data.message,
      });
    }

    // Updated air quality checks based on Chennai standards
    if (pm25 > 180 || pm10 > 180) {
      toast.error("Severe Air Quality Alert", {
        description: "Severe air pollution detected! PM levels exceeding 180 µg/m³",
      });
    } else if (pm25 > 91 || pm10 > 91) {
      toast.warning("Very Poor Air Quality Alert", {
        description: "Very poor air quality detected! PM levels between 91-180 µg/m³",
      });
    } else if (pm25 > 61 || pm10 > 61) {
      toast.warning("Poor Air Quality Warning", {
        description: "Poor air quality detected! PM levels between 61-90 µg/m³",
      });
    }

    // Check CO levels
    if (co > 50) {
      toast.warning("CO Level Alert", {
        description: `High CO concentration detected: ${co} ppm`,
      });
    }
  } catch (error) {
    console.error('Error in anomaly detection:', error);
  }
};

const SensorDashboard = () => {
  const [sensorData, setSensorData] = useState<SensorData>({
    particulate: { pm25: 0, pm10: 0 },
    dht11: { temperature: 0, humidity: 0 },
    mq7: { co: 0 },
  });
  const [supabaseError, setSupabaseError] = useState(false);

  useEffect(() => {
    const updateData = async () => {
      const newData = generateSensorData();
      setSensorData(newData);
      
      try {
        // Store reading in Supabase
        const { error: dbError } = await supabase
          .from('sensor_readings')
          .insert([{
            pm25: newData.particulate.pm25,
            pm10: newData.particulate.pm10,
            co: newData.mq7.co,
            temperature: newData.dht11.temperature,
            humidity: newData.dht11.humidity,
            created_at: new Date().toISOString()
          }]);

        if (dbError) {
          console.error('Error storing sensor data:', dbError);
          setSupabaseError(true);
        } else {
          setSupabaseError(false);
          
          // Check for anomalies
          await checkAirQuality(
            newData.particulate.pm25,
            newData.particulate.pm10,
            newData.mq7.co
          );
        }
      } catch (error) {
        console.error('Error connecting to Supabase:', error);
        setSupabaseError(true);
      }
    };

    // Update every 2 seconds
    const interval = setInterval(updateData, 2000);
    updateData(); // Initial update

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">ESP32 Sensor Monitoring</h1>
      
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
        {/* Nova PM Sensor */}
        <SensorCard title="Nova PM Sensor SDS011">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">PM2.5</p>
                <p className="text-2xl font-bold">{sensorData.particulate.pm25} µg/m³</p>
              </div>
              <Wind className="h-8 w-8 text-blue-500" />
            </div>
            <Progress value={(sensorData.particulate.pm25 / 999.9) * 100} className="h-2" />
            
            <div className="flex items-center justify-between mt-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">PM10</p>
                <p className="text-2xl font-bold">{sensorData.particulate.pm10} µg/m³</p>
              </div>
              <Wind className="h-8 w-8 text-purple-500" />
            </div>
            <Progress value={(sensorData.particulate.pm10 / 999.9) * 100} className="h-2" />
          </div>
        </SensorCard>

        {/* DHT11 Sensor */}
        <SensorCard title="DHT11 Sensor">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">Temperature</p>
                <p className="text-2xl font-bold">{sensorData.dht11.temperature}°C</p>
              </div>
              <ChartLine className="h-8 w-8 text-red-500" />
            </div>
            <Progress value={(sensorData.dht11.temperature / 50) * 100} className="h-2" />
            
            <div className="flex items-center justify-between mt-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">Humidity</p>
                <p className="text-2xl font-bold">{sensorData.dht11.humidity}%</p>
              </div>
              <ChartLine className="h-8 w-8 text-blue-500" />
            </div>
            <Progress value={(sensorData.dht11.humidity / 90) * 100} className="h-2" />
          </div>
        </SensorCard>

        {/* MQ-7 Sensor */}
        <SensorCard title="MQ-7 Sensor">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">CO Concentration</p>
                <p className="text-2xl font-bold">{sensorData.mq7.co} ppm</p>
              </div>
              <Gauge className="h-8 w-8 text-yellow-500" />
            </div>
            <Progress value={(sensorData.mq7.co / 2000) * 100} className="h-2" />
          </div>
        </SensorCard>
      </div>
    </div>
  );
};

export default SensorDashboard;
