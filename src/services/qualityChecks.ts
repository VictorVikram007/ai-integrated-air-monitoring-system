
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

export const checkAirQuality = async (pm25: number, co: number) => {
  try {
    const { data, error } = await supabase.functions.invoke('detect-anomaly', {
      body: { pm25, co }
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
