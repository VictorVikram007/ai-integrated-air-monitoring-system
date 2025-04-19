
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card } from './ui/card';
import { AlertTriangle, ThermometerSun, Droplets } from 'lucide-react';

// Chennai locations with sensor data
const locations = [
  {
    name: "Sathyabama University",
    coordinates: [80.2186, 12.8760],
    readings: {
      pm25: 85,
      pm10: 95,
      temperature: 32,
      humidity: 75
    }
  },
  {
    name: "Marina Beach",
    coordinates: [80.2826, 13.0500],
    readings: {
      pm25: 110,
      pm10: 130,
      temperature: 35,
      humidity: 82
    }
  },
  {
    name: "Thiruvanmiyur",
    coordinates: [80.2590, 12.9830],
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

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    mapboxgl.accessToken = 'YOUR_MAPBOX_TOKEN'; // Replace with your Mapbox token
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [80.2186, 12.8760], // Centered on Sathyabama University
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
  }, []);

  // Helper function to determine marker color based on PM2.5 levels
  const getMarkerColor = (pm25: number): string => {
    if (pm25 > 180) return '#FF0000'; // Severe - Red
    if (pm25 > 91) return '#FFA500';  // Very Poor - Orange
    if (pm25 > 61) return '#FFFF00';  // Poor - Yellow
    if (pm25 > 31) return '#90EE90';  // Moderate - Light Green
    return '#00FF00';                 // Good - Green
  };

  return (
    <Card className="w-full h-[400px] mt-6">
      <div ref={mapContainer} className="w-full h-full rounded-lg" />
    </Card>
  );
};

export default SensorMap;
