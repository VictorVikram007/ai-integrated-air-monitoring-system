
import { ChartLine } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import SensorCard from "@/components/SensorCard";

interface DHT11SensorProps {
  temperature: number;
  humidity: number;
}

const DHT11Sensor = ({ temperature, humidity }: DHT11SensorProps) => {
  return (
    <SensorCard title="DHT11 Sensor">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium">Temperature</p>
            <p className="text-2xl font-bold">{temperature}°C</p>
          </div>
          <ChartLine className="h-8 w-8 text-red-500" />
        </div>
        <Progress value={(temperature / 50) * 100} className="h-2" />
        
        <div className="flex items-center justify-between mt-4">
          <div className="space-y-1">
            <p className="text-sm font-medium">Humidity</p>
            <p className="text-2xl font-bold">{humidity}%</p>
          </div>
          <ChartLine className="h-8 w-8 text-blue-500" />
        </div>
        <Progress value={(humidity / 90) * 100} className="h-2" />
      </div>
    </SensorCard>
  );
};

export default DHT11Sensor;
