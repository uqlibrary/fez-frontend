import React from 'react';
import PublicationMap from '../../PublicationMap/PublicationMap';

export default function GeoCoordinatesField(fieldProps) {
    return <PublicationMap coordinates={fieldProps.value || ''} {...fieldProps} />;
}
