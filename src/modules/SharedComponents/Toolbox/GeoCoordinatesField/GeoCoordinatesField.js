import React from 'react';
import PublicationMap from 'modules/ViewRecord/components/NewPublicationMap';
import { GOOGLE_MAPS_API_URL, GOOGLE_MAPS_API_CHINA_URL } from 'config/general';

export default function GeoCoordinatesField(fieldProps) {
    const mapApiUrl = fieldProps.country === 'CN' ? GOOGLE_MAPS_API_CHINA_URL : GOOGLE_MAPS_API_URL;
    return (
        <PublicationMap
            onChange={fieldProps.input.onChange}
            googleMapURL={mapApiUrl}
            loadingElement={<div className="googleMap loading" />}
            containerElement={<div style={{ height: '400px' }} />}
            mapElement={<div style={{ height: '100%' }} />}
            coordinates={fieldProps.input.value}
            {...fieldProps}
        />
    );
}
