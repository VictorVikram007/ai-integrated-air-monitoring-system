
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SensorCardProps {
  title: string;
  children: React.ReactNode;
}

const SensorCard = ({ title, children }: SensorCardProps) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default SensorCard;
