
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
    <SensorCard title="Nova PM Sensor SDS011">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium">PM2.5</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold">{pm25} µg/m³</p>
              <Badge className={airQualityInfo.color}>
                {airQualityInfo.label}
              </Badge>
            </div>
          </div>
          <Wind className="h-8 w-8 text-blue-500" />
        </div>
        <Progress 
          value={
            ((pm25 - airQualityInfo.range[0]) / 
            (airQualityInfo.range[1] - airQualityInfo.range[0])) * 100
          } 
          className="h-2" 
        />
      </div>
    </SensorCard>
  );
};

export default PM25Sensor;
