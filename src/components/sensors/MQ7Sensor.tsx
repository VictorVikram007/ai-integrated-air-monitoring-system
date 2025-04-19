
import { Gauge } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import SensorCard from "@/components/SensorCard";

interface MQ7SensorProps {
  co: number;
}

const MQ7Sensor = ({ co }: MQ7SensorProps) => {
  return (
    <SensorCard title="MQ-7 Sensor">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium">CO Concentration</p>
            <p className="text-2xl font-bold">{co} ppm</p>
          </div>
          <Gauge className="h-8 w-8 text-yellow-500" />
        </div>
        <Progress value={(co / 2000) * 100} className="h-2" />
      </div>
    </SensorCard>
  );
};

export default MQ7Sensor;
