import React from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';

const Map = ({ location, setLocation }) => (
  <GoogleMap
    center={location}
    zoom={14}
    mapContainerStyle={{ height: '400px', width: '100%' }}
    onClick={(e) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setLocation({ lat, lng });
    }}>
    <Marker position={location} />
  </GoogleMap>
);

export default Map;
