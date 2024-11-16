import React, { useEffect } from 'react';
import Autocomplete from 'react-google-autocomplete';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const AddressForm = ({
  data,
  onChangeHandler,
  addressValid,
  outOfDeliveryZone,
  t,
  api_google,
  setData,
  calculateDeliveryCharge,
  setAddressValid,
  setOutOfDeliveryZone,
  setMapZoom,
  deliveryCenter,
  deliveryRadius,
}) => {
  useEffect(() => {
    if (data.address && data.isAddressManual) {
      geocodeAddress(data.address);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.address]);

  const geocodeAddress = (address) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
      if (status === 'OK') {
        const location = {
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng(),
        };
        setData((prev) => ({ ...prev, location }));
        calculateDeliveryCharge(location.lat, location.lng);
        setAddressValid(true);
        setOutOfDeliveryZone(false);
        setMapZoom(18);
      } else {
        console.error('Geocode failed due to: ' + status);
        setAddressValid(false);
        setOutOfDeliveryZone(true);
      }
    });
  };

  return (
    <>
      <p className="title white t3">{t('placeOrder.deliveryInfo')}</p>
      <input
        required
        name="firstName"
        onChange={onChangeHandler}
        value={data.firstName}
        type="text"
        placeholder={t('placeOrder.firstNamePlaceholder')}
      />
      <div className="address-input">
        {addressValid ? (
          <div className="text-white">
            {outOfDeliveryZone ? (
              <>
                <FaTimesCircle color="red" className="address-icon" />
                <span>{t('placeOrder.outOfDeliveryZone')}</span>
              </>
            ) : (
              <>
                <FaCheckCircle color="green" className="address-icon" />
                <span>{t('placeOrder.addressSet')}</span>
              </>
            )}
          </div>
        ) : (
          <div className="text-white">
            <FaTimesCircle color="red" className="address-icon" /> {t('placeOrder.addressUnset')}
          </div>
        )}
        <Autocomplete
          apiKey={api_google}
          onPlaceSelected={(place) => {
            const address = place.formatted_address;
            const location = {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            };
            setData((data) => ({
              ...data,
              address,
              location,
              isAddressManual: false,
            }));
            calculateDeliveryCharge(location.lat, location.lng);
            setAddressValid(true);
            setMapZoom(18);
          }}
          options={{ types: ['address'], componentRestrictions: { country: 'pl' } }}
          placeholder={t('placeOrder.addressPlaceholder')}
          value={data.address}
          onChange={onChangeHandler}
          inputProps={{ name: 'address' }}
        />
      </div>
      <input
        required
        name="apartmentNumber"
        onChange={onChangeHandler}
        value={data.apartmentNumber}
        type="text"
        placeholder={t('placeOrder.apartmentPlaceholder')}
      />
      <input
        className="phonee"
        required
        name="phone"
        onChange={onChangeHandler}
        value={data.phone}
        type="tel"
        placeholder={t('placeOrder.phonePlaceholder')}
      />
    </>
  );
};

export default AddressForm;
