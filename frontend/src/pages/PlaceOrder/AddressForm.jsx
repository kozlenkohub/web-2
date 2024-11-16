import React from 'react';
import Autocomplete from 'react-google-autocomplete';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const AddressForm = ({ data, setData, calculateDeliveryCharge, outOfDeliveryZone }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value, isAddressManual: name === 'address' }));
  };

  return (
    <div className="place-order-left">
      <h3>Delivery Information</h3>
      <input
        required
        name="firstName"
        value={data.firstName}
        onChange={handleInputChange}
        placeholder="First Name"
      />
      <div className="address-input">
        <Autocomplete
          apiKey="YOUR_GOOGLE_API_KEY"
          onPlaceSelected={(place) => {
            const address = place.formatted_address;
            const location = {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            };
            setData((prev) => ({ ...prev, address, location, isAddressManual: false }));
            calculateDeliveryCharge(location.lat, location.lng);
          }}
        />
        {outOfDeliveryZone ? (
          <div style={{ color: 'red' }}>
            <FaTimesCircle /> Out of delivery zone
          </div>
        ) : (
          <div style={{ color: 'green' }}>
            <FaCheckCircle /> Address valid
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressForm;
