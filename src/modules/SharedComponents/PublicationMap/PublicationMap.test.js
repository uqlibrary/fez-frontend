/* eslint-disable react/prop-types */
import React from 'react';
import { render as defaultRender, act } from 'test-utils';
import userEvent from '@testing-library/user-event';
import { PublicationMap } from './PublicationMap';

const mockOnFeatureCreated = jest.fn();
const mockRemoveFeatures = jest.fn();
const mockGetSnapshot = jest.fn(() => []);

const mockDraw = {
    getSnapshot: mockGetSnapshot,
    removeFeatures: mockRemoveFeatures,
};

const mockTerraDrawLayer = jest.fn(({ children, onFeatureCreated }) => {
    mockOnFeatureCreated.mockImplementation(onFeatureCreated);
    return <div data-testid="terra-draw-layer">{children(mockDraw)}</div>;
});

const mockSearchBox = jest.fn(({ onPlaceSelect }) => (
    <button
        data-testid="search-box"
        onClick={() => onPlaceSelect({ location: { toJSON: () => ({ lat: -33.8688, lng: 151.2093 }) } })}
    >
        Search
    </button>
));

jest.mock('@vis.gl/react-google-maps', () => ({
    APIProvider: ({ children }) => <div>{children}</div>,
    Map: ({ children }) => <div data-testid="map">{children}</div>,
    MapControl: ({ children }) => <div>{children}</div>,
    Marker: ({ position }) => <div data-testid="marker" data-position={JSON.stringify(position)} />,
    Polygon: ({ paths }) => <div data-testid="polygon" data-paths={JSON.stringify(paths)} />,
    ControlPosition: { TOP_CENTER: 'TOP_CENTER', TOP_RIGHT: 'TOP_RIGHT' },
}));

jest.mock('modules/SharedComponents/Toolbox/Map/SearchBox', () => ({
    __esModule: true,
    default: props => mockSearchBox(props),
}));

jest.mock('modules/SharedComponents/Toolbox/Map/DrawingManager', () => ({
    __esModule: true,
    default: () => <button data-testid="drawing-manager">Draw</button>,
}));

jest.mock('modules/SharedComponents/Toolbox/Map/TerraDrawLayer', () => ({
    __esModule: true,
    default: props => mockTerraDrawLayer(props),
}));

jest.mock('modules/SharedComponents/Toolbox/Map/CenterMapToCoordinates', () => ({
    CenterMapToCoordinates: ({ coordinates }) => (
        <div data-testid="center-map" data-coordinates={JSON.stringify(coordinates)} />
    ),
}));

const defaultProps = {
    coordinates: '',
    onChange: jest.fn(),
    readOnly: false,
};

function setup(props = {}, render = defaultRender) {
    return render(<PublicationMap {...defaultProps} {...props} />);
}

describe('PublicationMap', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockGetSnapshot.mockReturnValue([]);
    });

    it('should render search box and drawing manager when not readOnly', () => {
        const { getByTestId } = setup();

        expect(getByTestId('map')).toBeInTheDocument();
        expect(getByTestId('search-box')).toBeInTheDocument();
        expect(getByTestId('drawing-manager')).toBeInTheDocument();
    });

    it('should not render search box and drawing manager when readOnly', () => {
        const { getByTestId, queryByTestId } = setup({ readOnly: true });

        expect(getByTestId('map')).toBeInTheDocument();
        expect(queryByTestId('search-box')).not.toBeInTheDocument();
        expect(queryByTestId('drawing-manager')).not.toBeInTheDocument();
    });

    it('should render a marker for a single coordinate', () => {
        const { getByTestId, queryByTestId } = setup({ coordinates: '151.2093,-33.8688' });

        expect(getByTestId('marker')).toBeInTheDocument();
        expect(queryByTestId('polygon')).not.toBeInTheDocument();
    });

    it('should render a polygon for multiple coordinates', () => {
        const { getByTestId, queryByTestId } = setup({
            coordinates: '151.2093,-33.8688 144.9631,-37.8136 130.9631,-25.8136',
        });

        expect(getByTestId('polygon')).toBeInTheDocument();
        expect(queryByTestId('marker')).not.toBeInTheDocument();
    });

    it('should not render marker or polygon when coordinates are empty', () => {
        const { queryByTestId } = setup({ coordinates: '' });

        expect(queryByTestId('marker')).not.toBeInTheDocument();
        expect(queryByTestId('polygon')).not.toBeInTheDocument();
    });

    it('should not render marker or polygon when coordinates are whitespace only', () => {
        const { queryByTestId } = setup({ coordinates: '   ' });

        expect(queryByTestId('marker')).not.toBeInTheDocument();
        expect(queryByTestId('polygon')).not.toBeInTheDocument();
    });

    it('should call onChange with formatted coordinates when a place is selected', async () => {
        const mockOnChange = jest.fn();
        const { getByTestId } = setup({ onChange: mockOnChange });
        await userEvent.click(getByTestId('search-box'));

        expect(mockOnChange).toHaveBeenCalledWith('151.2093,-33.8688');
    });

    it('should not call onChange when selected place has no location', async () => {
        const mockOnChange = jest.fn();
        mockSearchBox.mockImplementationOnce(({ onPlaceSelect }) => (
            <button data-testid="search-box" onClick={() => onPlaceSelect({})}>
                Search
            </button>
        ));

        const { getByTestId } = setup({ onChange: mockOnChange });
        await userEvent.click(getByTestId('search-box'));

        expect(mockOnChange).not.toHaveBeenCalled();
    });

    it('should pass parsed coordinates to CenterMapToCoordinates', () => {
        const { getByTestId } = setup({ coordinates: '151.2093,-33.8688' });
        const coords = JSON.parse(getByTestId('center-map').dataset.coordinates);

        expect(coords).toEqual([{ lng: 151.2093, lat: -33.8688 }]);
    });

    it('should call onChange when a point feature is created', () => {
        const mockOnChange = jest.fn();
        setup({ onChange: mockOnChange });

        act(() => {
            mockOnFeatureCreated({ id: '1', geometry: { type: 'Point', coordinates: [151.2093, -33.8688] } }, mockDraw);
        });

        expect(mockOnChange).toHaveBeenCalledWith('151.2093,-33.8688');
    });

    it('should call onChange when a polygon feature is created', () => {
        const mockOnChange = jest.fn();
        setup({ onChange: mockOnChange });

        act(() => {
            mockOnFeatureCreated(
                {
                    id: '1',
                    geometry: {
                        type: 'Polygon',
                        coordinates: [
                            [
                                [151.2093, -33.8688],
                                [144.9631, -37.8136],
                                [130.9631, -25.8136],
                            ],
                        ],
                    },
                },
                mockDraw,
            );
        });

        expect(mockOnChange).toHaveBeenCalledWith('151.2093,-33.8688 144.9631,-37.8136 130.9631,-25.8136');
    });

    it('should remove existing features when a new feature is created', () => {
        setup({ onChange: jest.fn() });
        mockGetSnapshot.mockReturnValue([{ id: '1' }, { id: '2' }, { id: '3' }]);

        act(() => {
            mockOnFeatureCreated({ id: '3', geometry: { type: 'Point', coordinates: [151.2093, -33.8688] } }, mockDraw);
        });

        expect(mockRemoveFeatures).toHaveBeenCalledWith(['1', '2']);
    });

    it('should not call onChange when feature has no coordinates', () => {
        const mockOnChange = jest.fn();
        setup({ onChange: mockOnChange });

        act(() => {
            mockOnFeatureCreated({ id: '1', geometry: { type: 'Point', coordinates: [] } }, mockDraw);
        });

        expect(mockOnChange).not.toHaveBeenCalled();
    });

    it('should hide initial marker after a new feature is drawn', () => {
        const mockOnChange = jest.fn();
        const { queryByTestId, rerender } = setup({
            coordinates: '151.2093,-33.8688',
            onChange: mockOnChange,
        });

        expect(queryByTestId('marker')).toBeInTheDocument();
        act(() => {
            mockOnFeatureCreated({ id: '1', geometry: { type: 'Point', coordinates: [144.9631, -37.8136] } }, mockDraw);
        });

        // isDirtyRef.current is now true — rerender with new coords (simulating parent update)
        setup({ coordinates: '144.9631,-37.8136', onChange: mockOnChange, readOnly: false }, rerender);
        // marker hidden because isDirtyRef.current === true
        expect(queryByTestId('marker')).not.toBeInTheDocument();
    });
});
