// MapComponent.js

import React from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';

const MapComponent = ({ data, onMapClick, mapZoom }) => {
  return (
    <GoogleMap
      center={data.location}
      zoom={mapZoom}
      mapContainerStyle={{ height: '400px', width: '100%' }}
      onClick={onMapClick}>
      <Marker position={data.location} draggable onDragEnd={onMapClick} />
    </GoogleMap>
  );
};

export default MapComponent;
