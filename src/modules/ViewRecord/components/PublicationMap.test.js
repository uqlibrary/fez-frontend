import PublicationMap from "./PublicationMap";
import React from 'react';
import {GoogleMapViewComponent} from './PublicationMap';

function setup(testProps, isShallow = false){
    const props = {
        ...testProps,
        googleMapURL: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCD6bOdtlpxFXCj3vrhZkdeSS27HZha7U4&v=3.exp&libraries=geometry,drawing,places',
        loadingElement: (<div/>)
    };
    return getElement(PublicationMap, props, isShallow);
}

describe('Publication\'s map coordinates', () => {

    it('should render component with a selected area', () => {
        const wrapper = setup({coordinates: '153.021781,-27.489337 152.988274,-27.489337 152.988274,-27.509529 153.021781,-27.509529 153.021781,-27.489337'});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with empty coordinates', () => {
        const wrapper = setup({coordinates: ''});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with a marker', () => {
        const wrapper = setup({coordinates: '153.021781,-27.489337' });
        expect(toJson(wrapper)).toMatchSnapshot();
    });


    it('should not render in read only mode', () => {
        global.google = {
            maps: {
                LatLngBounds: () => ({
                    union: jest.fn(),
                    extend: jest.fn()
                }),
                LatLng: jest.fn()
            }
        };

        const onChangeFn = jest.fn();

        const wrapper = setup({
            coordinates: '153.021781,-27.489337',
            readOnly: false,
            onChange: onChangeFn,
            geoCoords: [
                {
                    lat: () => 153.021781,
                    lng: () => -27.489337
                },
                {
                    lat: () => 153.021781,
                    lng: () => -27.489337
                }
            ]
        }, true);
        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.setState({
            currentOverlay: {
                setMap: jest.fn()
            },
            geoCoords: []
        });

        const component = wrapper.find('withScriptjs(withGoogleMap(Component))');

        component.props().handleMarkerComplete({
            getPosition: () => ({
                lat: () => 153.021781,
                lng: () => -27.489337
            }),
            setMap: jest.fn()
        });

        component.props().handlePolygonComplete({
            getPath: () => ({
                getArray: () => ([
                    {
                        lat: () => 153.021781,
                        lng: () => -27.489337
                    },
                    {
                        lat: () => 153.021781,
                        lng: () => -27.489337
                    }
                ])
            }),
            setMap: jest.fn()
        });

        component.props().handleRectangleComplete({
            getBounds: () => ({
                getNorthEast: () => ({
                    lat: () => 153.021781,
                    lng: () => -27.489337
                }),
                getSouthWest: () => ({
                    lat: () => 153.021781,
                    lng: () => -27.489337
                })
            }),
            setMap: jest.fn()
        });

        expect(toJson(wrapper)).toMatchSnapshot();

        component.props().onMapMounted(true, '153.021781,-27.489337')({fitBounds: jest.fn(), getBounds: jest.fn(), getCenter: jest.fn()});
        expect(toJson(wrapper)).toMatchSnapshot();

        component.props().onDrawingManagerMounted({});
        expect(toJson(wrapper)).toMatchSnapshot();

        component.props().onSearchBoxMounted({
            getPlaces: () => ([
                {
                    geometry: {
                        viewport: true,
                        location: {
                            lat: () => 153.021781,
                            lng: () => -27.489337
                        }
                    }
                },
                {
                    geometry: {
                        viewport: false,
                        location: {
                            lat: () => 153.021781,
                            lng: () => -27.489337
                        }
                    }
                }
            ])
        });
        expect(toJson(wrapper)).toMatchSnapshot();

        component.props().onPlacesChanged();
        expect(toJson(wrapper)).toMatchSnapshot();
        component.props().onBoundsChanged();
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});

describe('GoogleMapViewComponent component', () => {
    it('should render component', () => {
        global.google = {
            maps: {
                LatLngBounds: () => ({
                    union: jest.fn(),
                    extend: jest.fn()
                }),
                LatLng: jest.fn(),
                drawing: {
                    OverlayType: {
                        MARKER: 'marker',
                        POLYGON: 'polygon',
                        RECTANGLE: 'rectangle'
                    }
                },
                ControlPosition: {
                    TOP_CENTER: 1,
                    TOP_RIGHT: 1
                }
            }
        };

        const wrapper = getElement(GoogleMapViewComponent, {
            geoCoords: [
                {
                    lat: () => 153.021781,
                    lng: () => -27.489337
                },
                {
                    lat: () => 153.021781,
                    lng: () => -27.489337
                }
            ],
            onMapMounted: jest.fn()
        });

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});