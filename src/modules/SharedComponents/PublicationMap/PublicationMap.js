import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { ControlPosition, MapControl, APIProvider, Map, Polygon, AdvancedMarker } from '@vis.gl/react-google-maps';
import SearchBox from 'modules/SharedComponents/Toolbox/Map/SearchBox';
import DrawingControls from 'modules/SharedComponents/Toolbox/Map/DrawingControls';
import TerraDrawLayer from 'modules/SharedComponents/Toolbox/Map/TerraDrawLayer';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CenterMapToCoordinates } from 'modules/SharedComponents/Toolbox/Map/CenterMapToCoordinates';
import { MAP_DEFAULT_CENTER, MAP_DEFAULT_ZOOM_MARKER, MAP_DEFAULT_ZOOM_POLYGON } from 'config/general';
import { withErrorBoundary } from 'helpers/general';

const localTheme = createTheme({
    palette: {
        primary: {
            main: '#777',
        },
    },
});

const coordinatesToString = coordinates => coordinates.map(item => `${item[0]},${item[1]}`).join(' ');

const PublicationMap = ({ value, onChange, readOnly }) => {
    const isDirtyRef = useRef(false);

    const coordinates = React.useMemo(
        () =>
            (!!value?.trim?.() &&
                value
                    .trim()
                    .split(/\s/)
                    .map(item => ({
                        lng: Number(item.split(',')[0]),
                        lat: Number(item.split(',')[1]),
                    }))) ||
            [],
        [value],
    );

    const hasCoordinates = !!coordinates?.length;

    const updateFieldValue = coordinates => onChange(coordinatesToString(coordinates));

    const onCreate = feature => {
        if (!feature?.geometry?.coordinates?.length) return;
        isDirtyRef.current = true;
        if (String(feature.geometry.type) === 'Point') {
            updateFieldValue([[feature.geometry.coordinates[0], feature.geometry.coordinates[1]]]);
            return;
        }
        updateFieldValue(feature.geometry.coordinates[0]);
    };

    const onClear = () => onChange(null);

    const mapDataKey = React.useMemo(() => {
        if (!hasCoordinates) return 'empty';
        if (coordinates.length > 1) return `poly-${coordinates.length}-${coordinates[0].lat}-${coordinates[0].lng}`;
        return `marker-${coordinates[0].lat}-${coordinates[0].lng}`;
    }, [coordinates, hasCoordinates]);

    return (
        <APIProvider
            apiKey={process.env.GOOGLE_MAPS_API_KEY}
            region="au"
            version="quarterly"
            libraries={['maps', 'places']}
            onError={error => {
                console.error('Google Maps failed to load for PublicationMap', error);
            }}
        >
            <ThemeProvider theme={localTheme}>
                <TerraDrawLayer readOnly={readOnly} onCreate={onCreate} onClear={onClear}>
                    {draw => (
                        <div data-testid="rek-geographic-area" data-analyticsid="rek-geographic-area">
                            <Map
                                defaultZoom={hasCoordinates ? MAP_DEFAULT_ZOOM_MARKER : MAP_DEFAULT_ZOOM_POLYGON}
                                mapId={'publication-map'}
                                defaultCenter={MAP_DEFAULT_CENTER}
                                gestureHandling={'greedy'}
                                style={{ height: '400px' }}
                            >
                                {!isDirtyRef.current && <CenterMapToCoordinates coordinates={coordinates} />}

                                {hasCoordinates &&
                                    (coordinates.length > 1 ? (
                                        <Polygon
                                            key={mapDataKey}
                                            paths={coordinates}
                                            options={{
                                                strokeColor: '#FF0000',
                                                strokeOpacity: 0.8,
                                                strokeWeight: 2,
                                                fillColor: '#FF0000',
                                                fillOpacity: 0.35,
                                            }}
                                        />
                                    ) : (
                                        <AdvancedMarker key={mapDataKey} position={coordinates[0]} />
                                    ))}

                                {!readOnly && (
                                    <>
                                        <MapControl key="ctrl-center" position={ControlPosition.TOP_CENTER}>
                                            <DrawingControls draw={draw} sx={{ mt: 1.2 }} />
                                        </MapControl>
                                        <MapControl key="ctrl-right" position={ControlPosition.TOP_RIGHT}>
                                            <SearchBox sx={{ width: 220, mt: 1.2, mr: 1.2 }} />
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
    value: PropTypes.string,
    onChange: PropTypes.func,
    readOnly: PropTypes.bool,
};

export default withErrorBoundary(React.memo(PublicationMap));
