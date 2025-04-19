
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card } from './ui/card';
import './SensorMap.css';

// Define type for location data
type Location = {
  name: string;
  coordinates: [number, number]; // Latitude, Longitude
  readings: {
    pm25: number;
    pm10: number;
    temperature: number;
    humidity: number;
  };
};

// Chennai locations with sensor data
const locations: Location[] = [
  {
    name: "Sathyabama University",
    coordinates: [12.8760, 80.2186],
    readings: {
      pm25: 85,
      pm10: 95,
      temperature: 32,
      humidity: 75
    }
  },
  {
    name: "Marina Beach",
    coordinates: [13.0500, 80.2826],
    readings: {
      pm25: 110,
      pm10: 130,
      temperature: 35,
      humidity: 82
    }
  },
  {
    name: "Thiruvanmiyur",
    coordinates: [12.9830, 80.2590],
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
  const map = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    map.current = L.map(mapContainer.current).setView([12.8760, 80.2186], 11);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map.current);

    // Add markers for each location
    locations.forEach(location => {
      const popupContent = `
        <div style="padding: 10px;">
          <h3 style="margin: 0 0 8px 0; font-weight: bold;">${location.name}</h3>
          <p style="margin: 4px 0;">PM2.5: ${location.readings.pm25} µg/m³</p>
          <p style="margin: 4px 0;">PM10: ${location.readings.pm10} µg/m³</p>
          <p style="margin: 4px 0;">Temperature: ${location.readings.temperature}°C</p>
          <p style="margin: 4px 0;">Humidity: ${location.readings.humidity}%</p>
        </div>
      `;

      // Create the marker with custom color based on PM2.5 levels
      L.circleMarker(location.coordinates, {
        radius: 10,
        fillColor: getMarkerColor(location.readings.pm25),
        color: '#000',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      })
        .bindPopup(popupContent)
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
    <Card className="w-full h-[400px] mt-6 relative">
      <div ref={mapContainer} className="w-full h-full rounded-lg" />
    </Card>
  );
};

export default SensorMap;
