import React from 'react';
import PublicationMap from 'modules/ViewRecord/components/PublicationMap';

export default function GeoCoordinatesField(fieldProps) {
    return <PublicationMap coordinates={fieldProps.value || ''} {...fieldProps} />;
}
