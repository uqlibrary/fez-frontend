import React from 'react';
import PublicationMap from './PublicationMap';
import { render } from 'test-utils';
import { initialize } from '@googlemaps/jest-mocks';

/* eslint-disable react/prop-types */
jest.mock('@react-google-maps/api', () => ({
    useJsApiLoader: jest.fn(),
    Polygon: () => <div data-testid="mock-polygon" />,
    Marker: () => <div data-testid="mock-marker" />,
    GoogleMap: props => (
        <div>
            <div data-testid="mock-google-maps" />
            {props.children}
        </div>
    ),
    StandaloneSearchBox: () => <div data-testid="mock-search-box" />,
    DrawingManager: () => <div data-testid="mock-drawing-manager" />,
}));
import { useJsApiLoader } from '@react-google-maps/api';

const setup = (testProps = {}) => {
    const props = {
        coordinates: null,
        onChange: jest.fn(),
        readOnly: false,
        isSearch: true,
        ...testProps,
    };

    return render(<PublicationMap {...props} />);
};

describe('Publication map', () => {
    beforeEach(() => {
        initialize();
    });

    it('should render map correctly', async () => {
        useJsApiLoader.mockImplementation(() => ({ isLoaded: true }));
        const { getByTestId, queryByTestId } = await setup();
        expect(getByTestId('mock-google-maps')).toBeInTheDocument();
        expect(getByTestId('mock-search-box')).toBeInTheDocument();
        expect(getByTestId('mock-drawing-manager')).toBeInTheDocument();
        expect(queryByTestId('mock-marker')).not.toBeInTheDocument();
        expect(queryByTestId('mock-polygon')).not.toBeInTheDocument();
    });

    it('should not render map', async () => {
        useJsApiLoader.mockImplementation(() => ({ isLoaded: false }));
        const { queryByTestId } = await setup();
        expect(queryByTestId('mock-google-maps')).not.toBeInTheDocument();
        expect(queryByTestId('mock-search-box')).not.toBeInTheDocument();
        expect(queryByTestId('mock-drawing-manager')).not.toBeInTheDocument();
        expect(queryByTestId('mock-marker')).not.toBeInTheDocument();
        expect(queryByTestId('mock-polygon')).not.toBeInTheDocument();
    });

    it('should render map correctly in read-only mode', async () => {
        useJsApiLoader.mockImplementation(() => ({ isLoaded: true }));
        const { getByTestId, queryByTestId } = await setup({ readOnly: true });
        expect(getByTestId('mock-google-maps')).toBeInTheDocument();
        expect(queryByTestId('mock-search-box')).not.toBeInTheDocument();
        expect(queryByTestId('mock-drawing-manager')).not.toBeInTheDocument();
        expect(queryByTestId('mock-marker')).not.toBeInTheDocument();
        expect(queryByTestId('mock-polygon')).not.toBeInTheDocument();
    });

    it('should render given coordinates correctly', async () => {
        useJsApiLoader.mockImplementation(() => ({ isLoaded: true }));
        const { getByTestId, queryByTestId } = await setup({
            readOnly: true,
            coordinates:
                '153.021781,-27.489337 152.988274,-27.489337 152.988274,-27.509529 153.021781,-27.509529 153.021781,-27.489337',
        });
        expect(getByTestId('mock-google-maps')).toBeInTheDocument();
        expect(queryByTestId('mock-search-box')).not.toBeInTheDocument();
        expect(queryByTestId('mock-drawing-manager')).not.toBeInTheDocument();
        expect(queryByTestId('mock-marker')).not.toBeInTheDocument();
        expect(getByTestId('mock-polygon')).toBeInTheDocument();
    });

    it('should render single coordinate correctly', async () => {
        useJsApiLoader.mockImplementation(() => ({ isLoaded: true }));
        const { getByTestId, queryByTestId } = await setup({
            coordinates: '152.988274,-27.489337',
            readOnly: true,
        });
        expect(getByTestId('mock-google-maps')).toBeInTheDocument();
        expect(queryByTestId('mock-search-box')).not.toBeInTheDocument();
        expect(queryByTestId('mock-drawing-manager')).not.toBeInTheDocument();
        expect(getByTestId('mock-marker')).toBeInTheDocument();
        expect(queryByTestId('mock-polygon')).not.toBeInTheDocument();
    });
});
