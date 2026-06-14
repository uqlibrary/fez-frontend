import { useEffect, useRef } from 'react';
import { useMap } from '@vis.gl/react-google-maps';
import { MAP_DEFAULT_ZOOM_MARKER, MAP_DEFAULT_ZOOM_POLYGON } from 'config/general';

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

        // handles markers
        if (coordinates.length === 1) {
            map.panTo(coordinates[0]);
            map.setZoom(MAP_DEFAULT_ZOOM_MARKER);
            return;
        }

        // handles shapes
        const bounds = new google.maps.LatLngBounds();
        coordinates.forEach(coordinate => bounds.extend(coordinate));
        map.fitBounds(bounds);
        map.setZoom(MAP_DEFAULT_ZOOM_POLYGON);
    }, [map, coordinates]);

    return null;
};
