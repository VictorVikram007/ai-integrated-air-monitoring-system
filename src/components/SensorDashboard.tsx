import { useEffect, useState } from "react";
import { Gauge, ChartLine, Wind, AlertTriangle } from "lucide-react";
import { generateSensorData } from "@/utils/generateSensorData";
import { toast } from "@/components/ui/sonner";
import SensorCard from "./SensorCard";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import SensorMap from './SensorMap';
import { Badge } from "@/components/ui/badge";

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

const getAirQualityInfo = (pm25: number): { label: string; color: string; range: [number, number] } => {
  if (pm25 > 180) return { label: 'Severe', color: 'bg-red-500 hover:bg-red-600', range: [180, 250] };
  if (pm25 > 90) return { label: 'Very Poor', color: 'bg-orange-500 hover:bg-orange-600', range: [91, 180] };
  if (pm25 > 60) return { label: 'Poor', color: 'bg-yellow-500 hover:bg-yellow-600', range: [61, 90] };
  if (pm25 > 30) return { label: 'Moderate', color: 'bg-blue-500 hover:bg-blue-600', range: [31, 60] };
  return { label: 'Good', color: 'bg-green-500 hover:bg-green-600', range: [0, 30] };
};

const checkAirQuality = async (pm25: number, co: number) => {
  try {
    const { data, error } = await supabase.functions.invoke('detect-anomaly', {
      body: {
        pm25,
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

    if (pm25 > 180) {
      toast.error("Severe Air Quality Alert", {
        description: "Severe air pollution detected! PM2.5 levels exceeding 180 µg/m³",
      });
    } else if (pm25 > 91) {
      toast.warning("Very Poor Air Quality Alert", {
        description: "Very poor air quality detected! PM2.5 levels between 91-180 µg/m³",
      });
    } else if (pm25 > 61) {
      toast.warning("Poor Air Quality Warning", {
        description: "Poor air quality detected! PM2.5 levels between 61-90 µg/m³",
      });
    }

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
    particulate: { pm25: 0 },
    dht11: { temperature: 0, humidity: 0 },
    mq7: { co: 0 },
  });
  const [supabaseError, setSupabaseError] = useState(false);

  useEffect(() => {
    const updateData = async () => {
      const newData = generateSensorData();
      setSensorData(newData);
      
      try {
        const { error: dbError } = await supabase
          .from('sensor_readings')
          .insert({
            pm25: newData.particulate.pm25,
            co: newData.mq7.co,
            temperature: newData.dht11.temperature,
            humidity: newData.dht11.humidity,
            pm10: 0,
            created_at: new Date().toISOString()
          });

        if (dbError) {
          console.error('Error storing sensor data:', dbError);
          setSupabaseError(true);
        } else {
          setSupabaseError(false);
          
          await checkAirQuality(
            newData.particulate.pm25,
            newData.mq7.co
          );
        }
      } catch (error) {
        console.error('Error connecting to Supabase:', error);
        setSupabaseError(true);
      }
    };

    const interval = setInterval(updateData, 2000);
    updateData();

    return () => clearInterval(interval);
  }, []);

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
        <SensorCard title="Nova PM Sensor SDS011">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">PM2.5</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">{sensorData.particulate.pm25} µg/m³</p>
                  <Badge 
                    className={getAirQualityInfo(sensorData.particulate.pm25).color}
                  >
                    {getAirQualityInfo(sensorData.particulate.pm25).label}
                  </Badge>
                </div>
              </div>
              <Wind className="h-8 w-8 text-blue-500" />
            </div>
            <Progress 
              value={
                ((sensorData.particulate.pm25 - 
                  getAirQualityInfo(sensorData.particulate.pm25).range[0]) / 
                  (getAirQualityInfo(sensorData.particulate.pm25).range[1] - 
                  getAirQualityInfo(sensorData.particulate.pm25).range[0])) * 100
              } 
              className="h-2" 
            />
          </div>
        </SensorCard>

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

      <SensorMap />
    </div>
  );
};

export default SensorDashboard;
