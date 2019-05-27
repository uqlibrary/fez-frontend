import React from 'react';
import PropTypes from 'prop-types';
import {withScriptjs, withGoogleMap, GoogleMap, Polygon, Marker} from 'react-google-maps/lib';
import DrawingManager from 'react-google-maps/lib/components/drawing/DrawingManager';
import SearchBox from 'react-google-maps/lib/components/places/SearchBox';
import {compose, lifecycle} from 'recompose';
import get from 'lodash.get';

export const GoogleMapViewComponent = (props) => {
    const styles = {
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35
    };
    const bounds = new window.google.maps.LatLngBounds();
    props.geoCoords.map((coord) => {
        bounds.extend(new window.google.maps.LatLng(coord.lat, coord.lng));
    });
    return (
        <div>
            {
                <GoogleMap
                    defaultZoom={props.zoom}
                    defaultCenter={props.center}
                    ref={props.onMapMounted(bounds, props.geoCoords)}
                >
                    {
                        (props.readOnly || props.isSearch) &&
                        props.geoCoords.length >= 1 &&
                        (
                            props.geoCoords.length > 1
                                ? <Polygon paths={props.geoCoords} options={styles} />
                                : <Marker position={props.geoCoords[0]} />
                        )
                    }
                    {
                        !props.readOnly &&
                        <DrawingManager
                            ref={props.onDrawingManagerMounted}
                            defaultDrawingMode={window.google.maps.drawing.OverlayType.MARKER}
                            defaultOptions={{
                                drawingControl: true,
                                drawingControlOptions: {
                                    position: window.google.maps.ControlPosition.TOP_CENTER,
                                    drawingModes: [
                                        window.google.maps.drawing.OverlayType.MARKER,
                                        window.google.maps.drawing.OverlayType.POLYGON,
                                        window.google.maps.drawing.OverlayType.RECTANGLE,
                                    ]
                                }
                            }}
                            onMarkerComplete={props.handleMarkerComplete}
                            onPolygonComplete={props.handlePolygonComplete}
                            onRectangleComplete={props.handleRectangleComplete}
                        />
                    }
                    {
                        !props.readOnly &&
                        <SearchBox
                            ref={props.onSearchBoxMounted}
                            bounds={props.bounds}
                            controlPosition={window.google.maps.ControlPosition.TOP_RIGHT}
                            onPlacesChanged={props.onPlacesChanged}
                        >
                            <input
                                type="text"
                                placeholder="Search..."
                                style={{
                                    boxSizing: 'border-box',
                                    border: '1px solid transparent',
                                    width: '240px',
                                    height: '24px',
                                    marginTop: '5px',
                                    padding: '0 12px',
                                    borderRadius: '3px 0px 0px 3px',
                                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
                                    fontSize: '14px',
                                    outline: 'none',
                                    textOverflow: 'ellipses',
                                }}
                            />
                        </SearchBox>
                    }
                </GoogleMap>
            }
        </div>
    );
};

GoogleMapViewComponent.propTypes = {
    geoCoords: PropTypes.array,
    zoom: PropTypes.number,
    bounds: PropTypes.any,
    center: PropTypes.any,
    readOnly: PropTypes.bool,
    isSearch: PropTypes.bool,
    onMapMounted: PropTypes.func,
    onDrawingManagerMounted: PropTypes.func,
    onSearchBoxMounted: PropTypes.func,
    onPlacesChanged: PropTypes.func,
    handleMarkerComplete: PropTypes.func,
    handlePolygonComplete: PropTypes.func,
    handleRectangleComplete: PropTypes.func
};

export const getDefaultCenter = (geoCoords) => {
    if (geoCoords.length > 0) {
        const minLngPoint = geoCoords.reduce((min, point) => point.lng < min ? point.lng : min, geoCoords[0].lng);
        const maxLngPoint = geoCoords.reduce((max, point) => point.lng > max ? point.lng : max, geoCoords[0].lng);
        const minLatPoint = geoCoords.reduce((min, point) => point.lat < min ? point.lat : min, geoCoords[0].lat);
        const maxLatPoint = geoCoords.reduce((max, point) => point.lat > max ? point.lat : max, geoCoords[0].lat);
        return {
            lng: (maxLngPoint + minLngPoint) / 2,
            lat: (minLatPoint + maxLatPoint) / 2
        };
    } else {
        return {
            lng: 153.013346,
            lat: -27.499412
        };
    }
};

const PublicationMap = compose(
    lifecycle({
        trimCoordinates(value, precision = 6) {
            return value.toFixed(precision).replace(/[\.]?0+$/, '');
        },
        componentWillMount() {
            const refs = {};
            const geoCoords = !!this.props.coordinates && this.props.coordinates.split(' ').map(item => (
                {
                    lng: Number(item.split(',')[0]),
                    lat: Number(item.split(',')[1])
                }
            )) || [];

            const defaultCenter = getDefaultCenter(geoCoords);
            const pointZoom = 7;
            const polygonZoom = 13;

            const updateState = (geoCoords, currentOverlay) => {
                !!this.state.currentOverlay &&
                this.state.currentOverlay.setMap(null);

                this.setState({
                    currentOverlay: currentOverlay,
                    geoCoords: geoCoords,
                    isSearch: false
                });
            };

            this.setState({
                center: defaultCenter,
                zoom: geoCoords.length === 1 ? pointZoom : polygonZoom,
                geoCoords: [...geoCoords],
                currentOverlay: null,
                onMapMounted: (bounds, geoCoords) => map => {
                    refs.map = map;
                    map && bounds && geoCoords.length > 1 && map.fitBounds(bounds);
                },
                onBoundsChanged: () => {
                    this.setState({
                        bounds: refs.map.getBounds(),
                        center: refs.map.getCenter()
                    });
                },
                onDrawingManagerMounted: ref => {
                    refs.drawingManager = ref;
                },
                onSearchBoxMounted: ref => {
                    refs.searchBox = ref;
                },
                onPlacesChanged: () => {
                    const places = refs.searchBox.getPlaces();
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
                    const nextCenter = get(nextMarkers, '0.position', this.state.center);

                    this.setState({
                        center: nextCenter,
                        geoCoords: nextMarkers.map(coord => ({lat: coord.position.lat(), lng: coord.position.lng()})),
                        isSearch: true
                    });
                    refs.map.fitBounds(bounds);
                },
                handleRectangleComplete: (rectangle) => {
                    const ne = rectangle.getBounds().getNorthEast();
                    const sw = rectangle.getBounds().getSouthWest();
                    updateState(
                        [
                            {lat: ne.lat(), lng: ne.lng()},
                            {lat: ne.lat(), lng: sw.lng()},
                            {lat: sw.lat(), lng: sw.lng()},
                            {lat: sw.lat(), lng: ne.lng()},
                            {lat: ne.lat(), lng: ne.lng()}
                        ],
                        rectangle
                    );
                },
                handlePolygonComplete: (polygon) => {
                    const points = polygon.getPath().getArray().map(point => ({lat: point.lat(), lng: point.lng()}));
                    updateState(
                        [...points, points[0]],
                        polygon
                    );
                },
                handleMarkerComplete: (marker) => {
                    updateState(
                        [{lat: marker.getPosition().lat(), lng: marker.getPosition().lng()}],
                        marker
                    );
                }
            });
        },
        componentWillUpdate(nextProps, nextState) {
            if (!!this.props.onChange) {
                this.props.onChange(
                    nextState.geoCoords.map(
                        coord => (
                            `${this.trimCoordinates(coord.lng)},${this.trimCoordinates(coord.lat)}`
                        )
                    ).join(' ')
                );
            }
        }
    }),
    withScriptjs,
    withGoogleMap
)(GoogleMapViewComponent);

export default PublicationMap;
