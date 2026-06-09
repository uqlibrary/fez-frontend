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

// note: the maps `edit` mode can break depending on the flags below. Make sure to test changes manually.
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

const createTerraDrawModes = () => [
    new TerraDrawSelectMode({
        flags: {
            polygon: selectionFlags,
            rectangle: selectionFlags,
            marker: selectionFlags,
        },
    }),
    new TerraDrawMarkerMode({
        editable: true,
    }),
    new TerraDrawPolygonMode({
        editable: true,
        styles: elementStyle,
    }),
    new TerraDrawRectangleMode({
        styles: elementStyle,
    }),
];

export const useTerraDraw = () => {
    const map = useMap();
    const drawRef = useRef<TerraDraw | null>(null);
    const [draw, setDraw] = useState<TerraDraw | null>(null);

    useEffect(() => {
        if (!map || drawRef.current) return;
        let inUnmounting = false;
        let listener: google.maps.MapsEventListener | null = null;

        const initialize = () => {
            // istanbul ignore if
            if (drawRef.current || inUnmounting) return;

            const instance = new TerraDraw({
                adapter: new TerraDrawGoogleMapsAdapter({
                    map,
                    lib: google.maps,
                    coordinatePrecision: 9,
                }),
                modes: createTerraDrawModes(),
            });

            instance.start();
            instance.on('change', (_, type) => {
                // disable gmaps gesture handling when updating (dragging, etc) an element to avoid conflicts
                if (type === 'update') {
                    map.setOptions({ gestureHandling: 'none' });
                    return;
                }
                map.setOptions({ gestureHandling: 'greedy' });
            });

            drawRef.current = instance;
            setDraw(instance);
        };

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
            inUnmounting = true;
            listener?.remove();
            if (drawRef.current) {
                map.setOptions({ gestureHandling: 'greedy' });
                drawRef.current.stop();
                drawRef.current = null;
            }
            setDraw(null);
        };
    }, [map]);

    return draw;
};
