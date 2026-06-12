import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { ControlPosition, MapControl, APIProvider, Map, Marker, Polygon } from '@vis.gl/react-google-maps';
import SearchBox from 'modules/SharedComponents/Toolbox/Map/SearchBox';
import DrawingControls from 'modules/SharedComponents/Toolbox/Map/DrawingControls';
import TerraDrawLayer from 'modules/SharedComponents/Toolbox/Map/TerraDrawLayer';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CenterMapToCoordinates } from 'modules/SharedComponents/Toolbox/Map/CenterMapToCoordinates';
import { MAP_DEFAULT_CENTER, MAP_DEFAULT_ZOOM_MARKER, MAP_DEFAULT_ZOOM_POLYGON } from 'config/general';

const localTheme = createTheme({
    palette: {
        primary: {
            main: '#777',
        },
    },
});

const coordinatesToString = coordinates => coordinates.map(item => `${item[0]},${item[1]}`).join(' ');

const PublicationMap = ({ coordinates, onChange, readOnly }) => {
    const hasInitialCoordinates = useRef(null);
    const initialCoordinates = useRef(null);
    const isDirtyRef = useRef(false);

    const parsedCoordinates = React.useMemo(
        () =>
            (!!coordinates.trim() &&
                coordinates
                    .trim()
                    .split(/\s/)
                    .map(item => ({
                        lng: Number(item.split(',')[0]),
                        lat: Number(item.split(',')[1]),
                    }))) ||
            [],
        [coordinates],
    );

    if (!!parsedCoordinates.length) {
        hasInitialCoordinates.current = true;
        initialCoordinates.current = parsedCoordinates;
    }

    const updateFieldValue = coordinates => onChange(coordinatesToString(coordinates));

    const onPlaceSelection = place => {
        const location = place?.location?.toJSON?.();
        if (!location) return;

        updateFieldValue([[location.lng, location.lat]]);
    };

    const onFeatureCreated = (feature, draw) => {
        if (!feature?.geometry?.coordinates?.length) return;
        isDirtyRef.current = true;

        // clear all features, except the one just created
        const toRemove = draw
            .getSnapshot()
            .filter(f => f.id !== feature.id)
            .map(f => f.id);
        if (toRemove.length > 0) draw.removeFeatures(toRemove);

        if (String(feature.geometry.type) === 'Point') {
            updateFieldValue([[feature.geometry.coordinates[0], feature.geometry.coordinates[1]]]);
            return;
        }

        updateFieldValue(feature.geometry.coordinates[0]);
    };

    return (
        <APIProvider apiKey={process.env.GOOGLE_MAPS_API_KEY}>
            <ThemeProvider theme={localTheme}>
                <TerraDrawLayer readOnly={readOnly} onFeatureCreated={onFeatureCreated}>
                    {draw => (
                        <div data-testid="rek-geographic-area" data-analyticsid="rek-geographic-area">
                            <Map
                                defaultZoom={
                                    hasInitialCoordinates.current ? MAP_DEFAULT_ZOOM_MARKER : MAP_DEFAULT_ZOOM_POLYGON
                                }
                                mapId={'publication-map'}
                                defaultCenter={MAP_DEFAULT_CENTER}
                                gestureHandling={'greedy'}
                                style={{ height: '400px' }}
                            >
                                <CenterMapToCoordinates coordinates={initialCoordinates.current} />
                                {(readOnly || !isDirtyRef.current) &&
                                    hasInitialCoordinates.current &&
                                    (initialCoordinates.current.length > 1 ? (
                                        <Polygon
                                            paths={initialCoordinates.current}
                                            options={{
                                                strokeColor: '#FF0000',
                                                strokeOpacity: 0.8,
                                                strokeWeight: 2,
                                                fillColor: '#FF0000',
                                                fillOpacity: 0.35,
                                            }}
                                        />
                                    ) : (
                                        <Marker position={initialCoordinates.current[0]} />
                                    ))}
                                {!readOnly && (
                                    <>
                                        <MapControl position={ControlPosition.TOP_CENTER}>
                                            <DrawingControls draw={draw} sx={{ mt: 1.2 }} />
                                        </MapControl>
                                        <MapControl position={ControlPosition.TOP_RIGHT}>
                                            <SearchBox
                                                onPlaceSelect={onPlaceSelection}
                                                sx={{ width: 220, mt: 1.2, mr: 1.2 }}
                                            />
                                        </MapControl>
                                    </>
                                )}
                            </Map>
                        </div>
                    )}
                </TerraDrawLayer>
            </ThemeProvider>
        </APIProvider>
    );
};

PublicationMap.propTypes = {
    coordinates: PropTypes.string,
    onChange: PropTypes.func,
    readOnly: PropTypes.bool,
};

export default React.memo(PublicationMap);
