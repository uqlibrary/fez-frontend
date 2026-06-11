import { useEffect, useRef } from 'react';
import { useMap } from '@vis.gl/react-google-maps';

export type usePanMapToCoordinatesOptions = {
    coordinates: google.maps.LatLngLiteral[];
};

export const CenterMapToCoordinates = ({ coordinates }: usePanMapToCoordinatesOptions) => {
    const map = useMap();
    const isCentered = useRef(false);

    useEffect(() => {
        if (!map || !coordinates?.length || isCentered.current) return;
        // center map once only
        isCentered.current = true;

        // handles markers/pins
        if (coordinates.length === 1) {
            map.panTo(coordinates[0]);
            map.setZoom(7);
            return;
        }

        // handles shapes
        const bounds = new google.maps.LatLngBounds();
        coordinates.forEach(coordinate => bounds.extend(coordinate));
        map.fitBounds(bounds);
        map.setZoom(13);
    }, [map, coordinates]);

    return null;
};
