import React from 'react';
import GeoCoordinatesField from './GeoCoordinatesField';
import { rtlRender } from 'test-utils';
import { initialize } from '@googlemaps/jest-mocks';
import { useJsApiLoader } from '@react-google-maps/api';

/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
jest.mock('@react-google-maps/api', () => ({
    useJsApiLoader: jest.fn(),
    Polygon: props => <div id="mock-polygon" />,
    Marker: props => <div id="mock-marker" />,
    GoogleMap: props => (
        <div>
            <div id="mock-google-maps" />
            {props.children}
        </div>
    ),
    StandaloneSearchBox: props => <div id="mock-search-box" />,
    DrawingManager: props => <div id="mock-drawing-manager" />,
}));

function setup(testProps = {}) {
    const props = {
        country: testProps.country || 'AU',
        input: {
            onChange: jest.fn(),
        },
        ...testProps,
    };

    return rtlRender(<GeoCoordinatesField {...props} />);
}

describe('GeoCoordinatesField component', () => {
    beforeEach(() => {
        initialize();
    });
    it('should render default view', () => {
        useJsApiLoader.mockImplementation(() => ({ isLoaded: true }));
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('should render default view with readOnly', () => {
        useJsApiLoader.mockImplementation(() => ({ isLoaded: true }));
        const { container } = setup({ readOnly: true });
        expect(container).toMatchSnapshot();
    });

    it('should render with given coordinates', () => {
        useJsApiLoader.mockImplementation(() => ({ isLoaded: true }));
        const { container } = setup({ coordinates: '100,100' });
        expect(container).toMatchSnapshot();
    });
});
