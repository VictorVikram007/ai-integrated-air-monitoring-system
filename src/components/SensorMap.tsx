import { useEffect, useRef } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import { Card } from './ui/card';
import 'ol/ol.css';

type Location = {
  name: string;
  coordinates: [number, number]; // Latitude, Longitude
  readings: {
    pm25: number;
    temperature: number;
    humidity: number;
  };
};

const locations: Location[] = [
  {
    name: "Sathyabama University",
    coordinates: [12.8760, 80.2186],
    readings: {
      pm25: 85,
      temperature: 32,
      humidity: 75
    }
  },
  {
    name: "Marina Beach",
    coordinates: [13.0500, 80.2826],
    readings: {
      pm25: 110,
      temperature: 35,
      humidity: 82
    }
  },
  {
    name: "Thiruvanmiyur",
    coordinates: [12.9830, 80.2590],
    readings: {
      pm25: 75,
      temperature: 33,
      humidity: 78
    }
  },
  {
    name: "Sholinganallur",
    coordinates: [12.9010, 80.2279],
    readings: {
      pm25: 92,
      temperature: 34,
      humidity: 77
    }
  },
  {
    name: "Navalur",
    coordinates: [12.9279, 80.2407],
    readings: {
      pm25: 88,
      temperature: 33,
      humidity: 76
    }
  }
];

const SensorMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    const features = locations.map(location => {
      const feature = new Feature({
        geometry: new Point(fromLonLat([location.coordinates[1], location.coordinates[0]])),
        name: location.name,
        readings: location.readings,
      });

      feature.setStyle(new Style({
        image: new CircleStyle({
          radius: 8,
          fill: new Fill({
            color: getMarkerColor(location.readings.pm25),
          }),
          stroke: new Stroke({
            color: '#000',
            width: 1,
          }),
        }),
      }));

      return feature;
    });

    const vectorSource = new VectorSource({
      features: features,
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    map.current = new Map({
      target: mapContainer.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        vectorLayer,
      ],
      view: new View({
        center: fromLonLat([80.2186, 12.8760]),
        zoom: 11,
      }),
    });

    const container = document.createElement('div');
    container.className = 'ol-popup bg-white p-3 rounded shadow-lg';

    map.current.on('click', (event) => {
      const feature = map.current?.forEachFeatureAtPixel(event.pixel, (feature) => feature);
      
      if (feature) {
        const properties = feature.getProperties();
        const readings = properties.readings;
        
        container.innerHTML = `
          <h3 class="font-bold mb-2">${properties.name}</h3>
          <p class="mb-1">PM2.5: ${readings.pm25} µg/m³</p>
          <p class="mb-1">Temperature: ${readings.temperature}°C</p>
          <p class="mb-1">Humidity: ${readings.humidity}%</p>
        `;

        const coordinates = (feature.getGeometry() as Point).getCoordinates();
        map.current?.getOverlayContainer().appendChild(container);
        container.style.position = 'absolute';
        const pixel = map.current?.getPixelFromCoordinate(coordinates);
        if (pixel) {
          container.style.left = `${pixel[0]}px`;
          container.style.top = `${pixel[1] - container.offsetHeight}px`;
        }
      } else {
        container.remove();
      }
    });

    return () => {
      map.current?.setTarget(undefined);
      container.remove();
    };
  }, []);

  const getMarkerColor = (pm25: number): string => {
    if (pm25 > 180) return '#FF0000';
    if (pm25 > 91) return '#FFA500';
    if (pm25 > 61) return '#FFFF00';
    if (pm25 > 31) return '#90EE90';
    return '#00FF00';
  };

  return (
    <Card className="w-full h-[400px] mt-6 relative">
      <div ref={mapContainer} className="w-full h-full rounded-lg" />
    </Card>
  );
};

export default SensorMap;
