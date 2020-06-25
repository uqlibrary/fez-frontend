import React from 'react';
import PublicationMap, { GoogleMapViewComponent, getDefaultCenter } from './PublicationMap';
import { GOOGLE_MAPS_API_URL } from '../../../config';

function setup(testProps = {}, args = { isShallow: false }) {
    const props = {
        ...testProps,
        googleMapURL: GOOGLE_MAPS_API_URL,
        loadingElement: <div />,
    };
    return getElement(PublicationMap, props, args);
}

describe("Publication's map coordinates", () => {
    it('should render component with a selected area', () => {
        const wrapper = setup({
            coordinates:
                '153.021781,-27.489337 152.988274,-27.489337 152.988274,' +
                '-27.509529 153.021781,-27.509529 153.021781,-27.489337',
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should mount component', () => {
        const wrapper = setup({
            coordinates:
                '153.021781,-27.489337 152.988274,-27.489337 152.988274,' +
                '-27.509529 153.021781,-27.509529 153.021781,-27.489337',
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should mount component in readonly mode', () => {
        const wrapper = setup({
            coordinates:
                '153.021781,-27.489337 152.988274,-27.489337 152.988274,' +
                '-27.509529 153.021781,-27.509529 153.021781,-27.489337',
            readOnly: true,
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with empty coordinates', () => {
        const wrapper = setup({ coordinates: '' });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with a marker', () => {
        const wrapper = setup({ coordinates: '153.021781,-27.489337' });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should no-op if onChange prop is not defined', () => {
        global.google = {
            maps: {
                LatLngBounds: () => ({}),
            },
        };
        const wrapper = setup({}, true);
        const geoCoords = [
            { lat: 153.021781, lng: -27.489337 },
            { lat: 153.021781, lng: -27.489337 },
        ];
        wrapper.setState({ geoCoords });
        expect(wrapper.state().geoCoords).toBe(geoCoords);
    });

    it('should not render in read only mode', () => {
        global.google = {
            maps: {
                LatLngBounds: () => ({
                    union: jest.fn(),
                    extend: jest.fn(),
                }),
                LatLng: jest.fn(),
            },
        };

        const onChangeFn = jest.fn();

        const wrapper = setup(
            {
                coordinates: '153.021781,-27.489337',
                readOnly: false,
                onChange: onChangeFn,
                geoCoords: [
                    {
                        lat: () => 153.021781,
                        lng: () => -27.489337,
                    },
                    {
                        lat: () => 153.021781,
                        lng: () => -27.489337,
                    },
                ],
            },
            true,
        );
        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.setState({
            currentOverlay: {
                setMap: jest.fn(),
            },
            geoCoords: [],
        });

        const component = wrapper.find('withScriptjs(withGoogleMap(GoogleMapViewComponent))');

        component.props().handleMarkerComplete({
            getPosition: () => ({
                lat: () => 153.021781,
                lng: () => -27.489337,
            }),
            setMap: jest.fn(),
        });

        component.props().handlePolygonComplete({
            getPath: () => ({
                getArray: () => [
                    {
                        lat: () => 153.021781,
                        lng: () => -27.489337,
                    },
                    {
                        lat: () => 153.021781,
                        lng: () => -27.489337,
                    },
                ],
            }),
            setMap: jest.fn(),
        });

        component.props().handleRectangleComplete({
            getBounds: () => ({
                getNorthEast: () => ({
                    lat: () => 153.021781,
                    lng: () => -27.489337,
                }),
                getSouthWest: () => ({
                    lat: () => 153.021781,
                    lng: () => -27.489337,
                }),
            }),
            setMap: jest.fn(),
        });

        expect(toJson(wrapper)).toMatchSnapshot();

        component.props().onMapMounted(true, '153.021781,-27.489337')({
            fitBounds: jest.fn(),
            getBounds: jest.fn(),
            getCenter: jest.fn(),
        });
        expect(toJson(wrapper)).toMatchSnapshot();

        component.props().onDrawingManagerMounted({});
        expect(toJson(wrapper)).toMatchSnapshot();

        component.props().onSearchBoxMounted({
            getPlaces: () => [
                {
                    geometry: {
                        viewport: true,
                        location: {
                            lat: () => 153.021781,
                            lng: () => -27.489337,
                        },
                    },
                },
                {
                    geometry: {
                        viewport: false,
                        location: {
                            lat: () => 153.021781,
                            lng: () => -27.489337,
                        },
                    },
                },
            ],
        });
        expect(toJson(wrapper)).toMatchSnapshot();

        component.props().onPlacesChanged();
        expect(toJson(wrapper)).toMatchSnapshot();
        component.props().onBoundsChanged();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should get the default center', () => {
        const geoCoords = [
            { lng: 153.021781, lat: -27.489337 },
            { lng: 152.988274, lat: -27.489337 },
            { lng: 152.988274, lat: -27.509529 },
            { lng: 153.021782, lat: -27.509529 },
            { lng: 153.021781, lat: -27.389337 },
        ];
        expect(getDefaultCenter(geoCoords)).toEqual({
            lat: -27.449433,
            lng: 153.00502799999998,
        });
    });
});

describe('GoogleMapViewComponent component', () => {
    const google = {
        maps: {
            LatLngBounds: () => ({
                union: jest.fn(),
                extend: jest.fn(),
            }),
            LatLng: jest.fn(),
            drawing: {
                OverlayType: {
                    MARKER: 'marker',
                    POLYGON: 'polygon',
                    RECTANGLE: 'rectangle',
                },
            },
            ControlPosition: {
                TOP_CENTER: 1,
                TOP_RIGHT: 1,
            },
        },
    };

    const props = {
        geoCoords: [
            {
                lat: () => 153.021781,
                lng: () => -27.489337,
            },
            {
                lat: () => 153.021781,
                lng: () => -27.489337,
            },
        ],
        onMapMounted: jest.fn(),
    };

    it('should render component', () => {
        global.google = google;
        const wrapper = getElement(GoogleMapViewComponent, props);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render in read-only mode', () => {
        const wrapper = getElement(GoogleMapViewComponent, {
            ...props,
            readOnly: true,
        });
        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.setProps({
            geoCoords: [
                {
                    lat: () => 153.021781,
                    lng: () => -27.489337,
                },
            ],
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
