import React from 'react';
import PublicationMap from 'modules/ViewRecord/components/PublicationMap';
import { GOOGLE_MAPS_API_URL } from 'config/general';

export default function GeoCoordinatesField(fieldProps) {
    return (
        <PublicationMap
            onChange={fieldProps.input.onChange}
            googleMapURL={GOOGLE_MAPS_API_URL}
            loadingElement={<div className="googleMap loading" />}
            containerElement={<div style={{ height: '400px' }} />}
            mapElement={<div style={{ height: '100%' }} />}
            {...fieldProps}
        />
    );
}
