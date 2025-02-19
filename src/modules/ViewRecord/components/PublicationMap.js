import React from 'react';
import PropTypes from 'prop-types';
import {
    DrawingManager,
    GoogleMap,
    Marker,
    Polygon,
    StandaloneSearchBox,
    useJsApiLoader,
} from '@react-google-maps/api';
import get from 'lodash/get';

const containerStyle = {
    height: '400px',
};

const styles = {
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.35,
};

const libraries = ['drawing', 'places', 'geometry'];
const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;

export const getDefaultCenter = geoCoords => {
    if (geoCoords.length > 0) {
        const minLngPoint = geoCoords.reduce((min, point) => (point.lng < min ? point.lng : min), geoCoords[0].lng);
        /* istanbul ignore next */
        const maxLngPoint = geoCoords.reduce((max, point) => (point.lng > max ? point.lng : max), geoCoords[0].lng);
        const minLatPoint = geoCoords.reduce((min, point) => (point.lat < min ? point.lat : min), geoCoords[0].lat);
        /* istanbul ignore next */
        const maxLatPoint = geoCoords.reduce((max, point) => (point.lat > max ? point.lat : max), geoCoords[0].lat);
        return {
            lng: (maxLngPoint + minLngPoint) / 2,
            lat: (minLatPoint + maxLatPoint) / 2,
        };
    } else {
        return {
            lng: 153.013346,
            lat: -27.499412,
        };
    }
};

console.log('Google Maps API Key:', googleMapsApiKey);

export const PublicationMap = ({ coordinates, onChange, readOnly }) => {
    const initialGeoCoords =
        (!!coordinates &&
            coordinates.split(' ').map(item => ({
                lng: Number(item.split(',')[0]),
                lat: Number(item.split(',')[1]),
            }))) ||
        [];

    const pointZoom = 7;
    const polygonZoom = 13;
    const defaultCenter = getDefaultCenter(initialGeoCoords);
    const [center, setCenter] = React.useState(defaultCenter);
    const [geoCoords, setGeoCoords] = React.useState(initialGeoCoords);
    const [isSearch, setIsSearch] = React.useState(false);
    const [currentOverlay, setCurrentOverlay] = React.useState(null);
    const [zoom] = React.useState(initialGeoCoords.length === 1 ? pointZoom : polygonZoom);

    const bounds = React.useRef(null);

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey,
        libraries,
        version: '3.exp',
    });
    const [map, setMap] = React.useState(null);
    const searchBox = React.useRef(null);
    const drawingManagerRef = React.useRef();

    React.useEffect(() => {
        if (!!bounds.current && !!geoCoords && geoCoords.length > 0 && !!map) {
            geoCoords.map(coord => {
                bounds.current.extend(new window.google.maps.LatLng(coord.lat, coord.lng));
            });
            /* istanbul ignore next */
            !!map && map.fitBounds(bounds.current);
        }
    }, [geoCoords, map]);

    const trimCoordinates = (value, precision = 6) => {
        return value.toFixed(precision).replace(/[\.]?0+$/, '');
    };

    React.useEffect(() => {
        !!onChange &&
            onChange(geoCoords.map(coord => `${trimCoordinates(coord.lng)},${trimCoordinates(coord.lat)}`).join(' '));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [geoCoords]);

    /* istanbul ignore next */
    const updateState = (geoCoords, overlay) => {
        !!currentOverlay && currentOverlay.setMap(null);
        setCurrentOverlay(overlay);
        setGeoCoords(geoCoords);
        setIsSearch(false);
    };

    /* istanbul ignore next */
    const onSearchBoxLoad = ref => {
        searchBox.current = ref;
    };

    /* istanbul ignore next */
    const onDrawingManagerMounted = ref => {
        drawingManagerRef.current = ref;
    };

    /* istanbul ignore next */
    const handleRectangleComplete = rectangle => {
        const ne = rectangle.getBounds().getNorthEast();
        const sw = rectangle.getBounds().getSouthWest();
        updateState(
            [
                { lat: ne.lat(), lng: ne.lng() },
                { lat: ne.lat(), lng: sw.lng() },
                { lat: sw.lat(), lng: sw.lng() },
                { lat: sw.lat(), lng: ne.lng() },
                { lat: ne.lat(), lng: ne.lng() },
            ],
            rectangle,
        );
    };

    /* istanbul ignore next */
    const handlePolygonComplete = polygon => {
        const points = polygon
            .getPath()
            .getArray()
            .map(point => ({ lat: point.lat(), lng: point.lng() }));
        updateState([...points, points[0]], polygon);
    };

    /* istanbul ignore next */
    const handleMarkerComplete = marker => {
        updateState([{ lat: marker.getPosition().lat(), lng: marker.getPosition().lng() }], marker);
    };

    /* istanbul ignore next */
    const onGoogleMapLoad = React.useCallback(map => {
        setMap(map);
        document.getElementById('rek-geographic-area').setAttribute('data-analyticsid', 'rek-geographic-area');
        document.getElementById('rek-geographic-area').setAttribute('data-testid', 'rek-geographic-area');
    }, []);

    /* istanbul ignore next */
    const onUnmount = React.useCallback(function callback() {
        setMap(null);
    }, []);

    /* istanbul ignore next */
    const onPlacesChanged = () => {
        const places = searchBox.current.getPlaces();
        const bounds = new window.google.maps.LatLngBounds();

        places.forEach(place => {
            if (place.geometry.viewport) {
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        const nextMarkers = places.map(place => ({
            position: place.geometry.location,
        }));
        const nextCenter = get(nextMarkers, '0.position', center);

        setCenter(nextCenter);
        setGeoCoords(nextMarkers.map(coord => ({ lat: coord.position.lat(), lng: coord.position.lng() })));
        setIsSearch(true);
        map.fitBounds(bounds);
    };

    const renderMap = () => {
        bounds.current = new window.google.maps.LatLngBounds();
        geoCoords.map(coord => {
            bounds.current.extend(new window.google.maps.LatLng(coord.lat, coord.lng));
        });
        return (
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={zoom}
                onLoad={onGoogleMapLoad}
                onUnmount={onUnmount}
                id="rek-geographic-area"
            >
                {(readOnly || isSearch) &&
                    geoCoords.length >= 1 &&
                    (geoCoords.length > 1 ? (
                        <Polygon paths={geoCoords} options={styles} />
                    ) : (
                        <Marker position={geoCoords[0]} />
                    ))}
                {!readOnly && (
                    <DrawingManager
                        onLoad={onDrawingManagerMounted}
                        defaultDrawingMode="marker"
                        options={{
                            drawingControl: true,
                            drawingControlOptions: {
                                position: 2, // window.google.maps.ControlPosition.TOP_CENTER
                                drawingModes: ['marker', 'polygon', 'rectangle'],
                            },
                        }}
                        onMarkerComplete={handleMarkerComplete}
                        onPolygonComplete={handlePolygonComplete}
                        onRectangleComplete={handleRectangleComplete}
                    />
                )}
                {!readOnly && (
                    <StandaloneSearchBox onLoad={onSearchBoxLoad} onPlacesChanged={onPlacesChanged}>
                        <input
                            type="text"
                            placeholder="Search..."
                            style={{
                                boxSizing: 'border-box',
                                border: '1px solid transparent',
                                width: '240px',
                                height: '40px',
                                marginTop: '10px',
                                padding: '0 12px',
                                borderRadius: '3px 0px 0px 3px',
                                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
                                fontSize: '14px',
                                outline: 'none',
                                textOverflow: 'ellipses',
                                position: 'absolute',
                                right: '0',
                                marginRight: '60px',
                            }}
                        />
                    </StandaloneSearchBox>
                )}
            </GoogleMap>
        );
    };

    return isLoaded && window.google ? renderMap() : <></>;
};

PublicationMap.propTypes = {
    coordinates: PropTypes.string,
    onChange: PropTypes.func,
    readOnly: PropTypes.bool,
};

export default React.memo(PublicationMap);
