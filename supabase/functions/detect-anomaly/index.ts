
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { pm25, pm10, co } = await req.json();
    console.log(`Analyzing sensor data: PM2.5=${pm25}, PM10=${pm10}, CO=${co}`);
    
    let isAnomaly = false;
    let message = "";
    
    // Simple anomaly detection rules
    // Sudden large increases compared to average expected values
    if (pm25 > 150 && pm10 > 150 && co > 45) {
      isAnomaly = true;
      message = "Critical: Multiple parameters showing dangerous levels simultaneously";
    } else if ((pm25 > 100 && co > 40) || (pm10 > 100 && co > 40)) {
      isAnomaly = true;
      message = "Warning: Unusual correlation between particulate matter and CO levels";
    }
    
    // More complex patterns could be added here in the future
    
    return new Response(
      JSON.stringify({
        isAnomaly,
        message,
        timestamp: new Date().toISOString(),
      }),
      { 
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json" 
        } 
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    
    return new Response(
      JSON.stringify({ error: "Failed to process sensor data" }),
      { 
        status: 400, 
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json" 
        } 
      }
    );
  }
});
