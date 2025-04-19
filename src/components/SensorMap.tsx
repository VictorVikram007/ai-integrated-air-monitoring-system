
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card } from './ui/card';
import { AlertTriangle } from 'lucide-react';

// Chennai locations with sensor data
const locations = [
  {
    name: "Sathyabama University",
    coordinates: [80.2186, 12.8760] as [number, number],
    readings: {
      pm25: 85,
      pm10: 95,
      temperature: 32,
      humidity: 75
    }
  },
  {
    name: "Marina Beach",
    coordinates: [80.2826, 13.0500] as [number, number],
    readings: {
      pm25: 110,
      pm10: 130,
      temperature: 35,
      humidity: 82
    }
  },
  {
    name: "Thiruvanmiyur",
    coordinates: [80.2590, 12.9830] as [number, number],
    readings: {
      pm25: 75,
      pm10: 88,
      temperature: 33,
      humidity: 78
    }
  }
];

const SensorMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapToken, setMapToken] = useState<string>('');
  const [showTokenInput, setShowTokenInput] = useState<boolean>(true);

  useEffect(() => {
    if (!mapContainer.current || !mapToken) return;
    
    try {
      // Initialize map
      mapboxgl.accessToken = mapToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [80.2186, 12.8760] as [number, number], // Centered on Sathyabama University
        zoom: 11
      });

      // Add markers for each location
      locations.forEach(location => {
        // Create custom marker element
        const markerElement = document.createElement('div');
        markerElement.className = 'custom-marker';
        
        // Create popup content
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div style="padding: 10px;">
            <h3 style="margin: 0 0 8px 0; font-weight: bold;">${location.name}</h3>
            <p style="margin: 4px 0;">PM2.5: ${location.readings.pm25} µg/m³</p>
            <p style="margin: 4px 0;">PM10: ${location.readings.pm10} µg/m³</p>
            <p style="margin: 4px 0;">Temperature: ${location.readings.temperature}°C</p>
            <p style="margin: 4px 0;">Humidity: ${location.readings.humidity}%</p>
          </div>
        `);

        // Create the marker
        new mapboxgl.Marker({ color: getMarkerColor(location.readings.pm25) })
          .setLngLat(location.coordinates)
          .setPopup(popup)
          .addTo(map.current!);
      });
      
      // Cleanup
      return () => {
        map.current?.remove();
      };
    } catch (error) {
      console.error("Error initializing map:", error);
    }
  }, [mapToken]);

  // Helper function to determine marker color based on PM2.5 levels
  const getMarkerColor = (pm25: number): string => {
    if (pm25 > 180) return '#FF0000'; // Severe - Red
    if (pm25 > 91) return '#FFA500';  // Very Poor - Orange
    if (pm25 > 61) return '#FFFF00';  // Poor - Yellow
    if (pm25 > 31) return '#90EE90';  // Moderate - Light Green
    return '#00FF00';                 // Good - Green
  };

  const handleMapTokenSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const token = formData.get('mapboxToken') as string;
    
    if (token) {
      setMapToken(token);
      setShowTokenInput(false);
    }
  };

  return (
    <Card className="w-full h-[400px] mt-6 relative">
      {showTokenInput ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 p-6 z-10 rounded-lg">
          <form onSubmit={handleMapTokenSubmit} className="w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Enter your Mapbox Token</h3>
            <p className="text-sm text-gray-500 mb-4">
              To display the map, please enter your Mapbox public token. You can find this in your Mapbox account dashboard.
            </p>
            <div className="flex flex-col space-y-4">
              <input 
                type="text" 
                name="mapboxToken" 
                placeholder="pk.eyJ1IjoieW91..." 
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
              <button 
                type="submit" 
                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                Load Map
              </button>
              <div className="text-xs text-gray-500">
                <a 
                  href="https://account.mapbox.com/access-tokens/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Get a Mapbox token
                </a>
              </div>
            </div>
          </form>
        </div>
      ) : null}
      <div ref={mapContainer} className="w-full h-full rounded-lg" />
    </Card>
  );
};

export default SensorMap;
