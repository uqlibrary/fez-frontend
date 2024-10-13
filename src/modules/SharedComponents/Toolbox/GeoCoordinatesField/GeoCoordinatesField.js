import React from 'react';
import PublicationMap from 'modules/ViewRecord/components/PublicationMap';

export default function GeoCoordinatesField(fieldProps) {
    return (
        <PublicationMap
            onChange={fieldProps.input?.onChange}
            coordinates={fieldProps.input.value || ''}
            {...fieldProps}
        />
    );
}
