import React from 'react';
import GeoCoordinatesField from './GeoCoordinatesField';
import { rtlRender } from 'test-utils';
import { initialize } from '@googlemaps/jest-mocks';

/* eslint-disable react/prop-types */
jest.mock('modules/SharedComponents/PublicationMap/PublicationMap', () => ({
    __esModule: true,
    default: ({ coordinates, readOnly }) => (
        <div data-testid="mock-publication-map" data-coordinates={coordinates} data-readonly={readOnly} />
    ),
}));

function setup(testProps = {}) {
    const props = {
        country: testProps.country || 'AU',
        onChange: jest.fn(),
        ...testProps,
    };

    return rtlRender(<GeoCoordinatesField {...props} />);
}

describe('GeoCoordinatesField component', () => {
    beforeEach(() => {
        initialize();
    });
    it('should render default view', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('should render default view with readOnly', () => {
        const { container } = setup({ readOnly: true });
        expect(container).toMatchSnapshot();
    });

    it('should render with given coordinates', () => {
        const { container } = setup({ coordinates: '100,100' });
        expect(container).toMatchSnapshot();
    });
});
