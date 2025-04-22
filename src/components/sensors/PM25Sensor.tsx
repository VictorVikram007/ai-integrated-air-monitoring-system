
import { Wind } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import SensorCard from "@/components/SensorCard";
import { getAirQualityInfo } from "@/utils/airQuality";

interface PM25SensorProps {
  pm25: number;
}

const PM25Sensor = ({ pm25 }: PM25SensorProps) => {
  const airQualityInfo = getAirQualityInfo(pm25);
  
  return (
    <SensorCard title="Sharp GP 2Y1010 F 8X Sensor">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium">PM2.5</p>
            <p className="text-2xl font-bold">{pm25} µg/m³</p>
          </div>
          <Wind className="h-8 w-8 text-blue-500" />
        </div>
        <div className="space-y-2">
          <Badge className={`w-full text-center ${airQualityInfo.color}`}>
            {airQualityInfo.label} Air Quality
          </Badge>
          <Progress 
            value={
              ((pm25 - airQualityInfo.range[0]) / 
              (airQualityInfo.range[1] - airQualityInfo.range[0])) * 100
            } 
            className="h-2" 
          />
        </div>
      </div>
    </SensorCard>
  );
};

export default PM25Sensor;
