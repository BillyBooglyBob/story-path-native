import React, { useEffect, useState } from 'react'
import { ProjectLocation, Location } from '../lib/types';

const useLocationCoordinates = (locations: ProjectLocation[]) => {
  const [locationCoordinates, setLocationCoordinates] = useState<Location[]>([]);

  useEffect(() => {
    if (locations) {
      // Convert string-based latlong to object-based on each location
      const updatedLocations: Location[] = locations.map((location) => {
        const [x, y] = location.location_position
          .replace(/[()]/g, "")
          .split(",")
          .map(Number);

        return {
          coordinates: {
            latitude: x,
            longitude: y,
          },
          id: location.id ?? 0,
          location: location.location_name,
          distance: {
            metres: 0,
            nearby: false,
          },
        };
      });

      setLocationCoordinates(((prev) => [...prev, ...updatedLocations])); 
    }
  }, [locations]);
  return locationCoordinates;
}

export default useLocationCoordinates
