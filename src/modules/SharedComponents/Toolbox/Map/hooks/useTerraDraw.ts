import { useEffect, useRef, useState } from 'react';
import { useMap } from '@vis.gl/react-google-maps';
import {
    TerraDraw,
    TerraDrawMarkerMode,
    TerraDrawPolygonMode,
    TerraDrawRectangleMode,
    TerraDrawSelectMode,
} from 'terra-draw';
import { TerraDrawGoogleMapsAdapter } from 'terra-draw-google-maps-adapter';

const color = '#FF0066' as `#${string}`;
const elementStyle = { fillColor: color, outlineColor: color };

// note: the map's `edit` mode can break depending on the flags below, make sure to test changes manually.
const selectionFlags = {
    feature: {
        draggable: true,
        coordinates: {
            snappable: false,
            midpoints: false,
            draggable: true,
            deletable: true,
        },
    },
};

const getTerraDrawConfig = (map: google.maps.Map) => ({
    adapter: new TerraDrawGoogleMapsAdapter({
        map,
        lib: google.maps,
        coordinatePrecision: 9,
    }),
    modes: [
        new TerraDrawSelectMode({
            flags: {
                polygon: selectionFlags,
                rectangle: selectionFlags,
                marker: selectionFlags,
            },
        }),
        new TerraDrawMarkerMode({
            editable: true,
            styles: {
                markerUrl: 'https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi3.png',
                markerWidth: 26,
                markerHeight: 37,
            },
        }),
        new TerraDrawPolygonMode({
            editable: true,
            styles: elementStyle,
        }),
        new TerraDrawRectangleMode({
            styles: elementStyle,
        }),
    ],
});

type CreatedFeature = {
    id: string | number;
    geometry: unknown;
    properties: unknown;
};

export type UseTerraDrawOptions = {
    readOnly?: boolean;
    onFeatureCreated?: (feature: CreatedFeature, draw: TerraDraw) => void;
};

export const useTerraDraw = ({ readOnly = false, onFeatureCreated }: UseTerraDrawOptions = {}) => {
    const map = useMap();
    const drawRef = useRef<TerraDraw | null>(null);
    const [draw, setDraw] = useState<TerraDraw | null>(null);
    const onFeatureCreatedRef = useRef(onFeatureCreated);

    useEffect(() => {
        onFeatureCreatedRef.current = onFeatureCreated;
    }, [onFeatureCreated]);

    useEffect(() => {
        if (readOnly || !map || drawRef.current) return;
        let inUnmounting = false;
        let listener: google.maps.MapsEventListener | null = null;

        const initialize = () => {
            // istanbul ignore if
            if (drawRef.current || inUnmounting) return;

            const instance = new TerraDraw(getTerraDrawConfig(map));
            // triggered when a feature is created
            instance.on('finish', id => {
                const feature = instance.getSnapshot().find(f => f.id === id);
                /* istanbul ignore if */
                if (!feature) return;

                // call given onFeatureCreated with the created feature and the Terra Draw instance
                onFeatureCreatedRef.current?.(feature, instance);
            });
            // triggered when manipulating features (dragging, resizing, etc)
            instance.on('change', (_, type) => {
                // disable gmaps gesture handling when updating an element to avoid conflicts
                if (type === 'update') {
                    map.setOptions({ gestureHandling: 'none' });
                    return;
                }
                map.setOptions({ gestureHandling: 'greedy' });
            });

            instance.start();
            drawRef.current = instance;
            setDraw(instance);
        };

        // inject Terra Draw into the map
        if (map.getProjection()) {
            initialize();
        } else {
            listener = map.addListener('projection_changed', () => {
                // istanbul ignore if
                if (!map.getProjection()) return;
                listener?.remove();
                initialize();
            });
        }

        // eslint-disable-next-line consistent-return
        return () => {
            // clean up
            inUnmounting = true;
            listener?.remove();
            if (drawRef.current) {
                map.setOptions({ gestureHandling: 'greedy' });
                drawRef.current.stop();
                drawRef.current = null;
                setDraw(null);
            }
        };
    }, [map]);

    return draw;
};
