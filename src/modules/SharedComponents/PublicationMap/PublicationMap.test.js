/* eslint-disable react/prop-types */
import React from 'react';
import { render as defaultRender, act } from 'test-utils';
import PublicationMap from './PublicationMap';
import { MAP_DEFAULT_CENTER } from '../../../config/general';

const mockOnCreate = jest.fn();

const mockTerraDrawLayer = jest.fn(({ children, onCreate }) => {
    mockOnCreate.mockImplementation(onCreate);
    return <div data-testid="terra-draw-layer">{children(null)}</div>;
});

const mockSearchBox = jest.fn(() => <button data-testid="search-box">Search</button>);

jest.mock('@vis.gl/react-google-maps', () => ({
    APIProvider: ({ children }) => <div>{children}</div>,
    Map: ({ children, defaultCenter }) => (
        <div data-testid="map" data-default-center={JSON.stringify(defaultCenter)}>
            {children}
        </div>
    ),
    MapControl: ({ children }) => <div>{children}</div>,
    AdvancedMarker: ({ position }) => <div data-testid="marker" data-position={JSON.stringify(position)} />,
    Polygon: ({ paths }) => <div data-testid="polygon" data-paths={JSON.stringify(paths)} />,
    ControlPosition: { TOP_CENTER: 'TOP_CENTER', TOP_RIGHT: 'TOP_RIGHT' },
}));

jest.mock('modules/SharedComponents/Toolbox/Map/SearchBox', () => ({
    __esModule: true,
    default: props => mockSearchBox(props),
}));

jest.mock('modules/SharedComponents/Toolbox/Map/DrawingControls', () => ({
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
    value: '',
    onChange: jest.fn(),
    readOnly: false,
};

function setup(props = {}, render = defaultRender) {
    return render(<PublicationMap {...defaultProps} {...props} />);
}

describe('PublicationMap', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render search box and drawing manager when not readOnly', () => {
        const { getByTestId } = setup();

        expect(getByTestId('map')).toBeInTheDocument();
        expect(getByTestId('search-box')).toBeInTheDocument();
        expect(getByTestId('drawing-manager')).toBeInTheDocument();
        expect(getByTestId('map').dataset.defaultCenter).toBe(JSON.stringify(MAP_DEFAULT_CENTER));
    });

    it('should not render search box and drawing manager when readOnly', () => {
        const { getByTestId, queryByTestId } = setup({ readOnly: true });

        expect(getByTestId('map')).toBeInTheDocument();
        expect(queryByTestId('search-box')).not.toBeInTheDocument();
        expect(queryByTestId('drawing-manager')).not.toBeInTheDocument();
    });

    it('should render a marker for a single coordinate', () => {
        const { getByTestId, queryByTestId } = setup({ value: '151.2093,-33.8688' });

        expect(getByTestId('marker')).toBeInTheDocument();
        expect(queryByTestId('polygon')).not.toBeInTheDocument();
    });

    it('should render a polygon for multiple coordinates', () => {
        const { getByTestId, queryByTestId } = setup({
            value: '151.2093,-33.8688 144.9631,-37.8136 130.9631,-25.8136',
        });

        expect(getByTestId('polygon')).toBeInTheDocument();
        expect(queryByTestId('marker')).not.toBeInTheDocument();
    });

    it('should not render marker or polygon when coordinates are empty', () => {
        const { queryByTestId } = setup({ value: '' });

        expect(queryByTestId('marker')).not.toBeInTheDocument();
        expect(queryByTestId('polygon')).not.toBeInTheDocument();
    });

    it('should not render marker or polygon when coordinates are whitespace only', () => {
        const { queryByTestId } = setup({ value: '   ' });

        expect(queryByTestId('marker')).not.toBeInTheDocument();
        expect(queryByTestId('polygon')).not.toBeInTheDocument();
    });

    it('should pass parsed coordinates to CenterMapToCoordinates', () => {
        const { getByTestId } = setup({ value: '151.2093,-33.8688' });
        const coords = JSON.parse(getByTestId('center-map').dataset.coordinates);

        expect(coords).toEqual([{ lng: 151.2093, lat: -33.8688 }]);
    });

    it('should call onChange when a point feature is created', () => {
        const mockOnChange = jest.fn();
        setup({ onChange: mockOnChange });

        act(() => {
            mockOnCreate({ id: '1', geometry: { type: 'Point', coordinates: [151.2093, -33.8688] } });
        });

        expect(mockOnChange).toHaveBeenCalledWith('151.2093,-33.8688');
    });

    it('should call onChange when a polygon feature is created', () => {
        const mockOnChange = jest.fn();
        setup({ onChange: mockOnChange });

        act(() => {
            mockOnCreate({
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
            });
        });

        expect(mockOnChange).toHaveBeenCalledWith('151.2093,-33.8688 144.9631,-37.8136 130.9631,-25.8136');
    });

    it('should not call onChange when feature has no coordinates', () => {
        const mockOnChange = jest.fn();
        setup({ onChange: mockOnChange });

        act(() => {
            mockOnCreate({ id: '1', geometry: { type: 'Point', coordinates: [] } });
        });

        expect(mockOnChange).not.toHaveBeenCalled();
    });

    it('should call onChange with null when onClear is called', () => {
        const mockOnChange = jest.fn();
        setup({ value: '151.2093,-33.8688', onChange: mockOnChange });

        const { onClear } = mockTerraDrawLayer.mock.calls[0][0];
        act(() => onClear());

        expect(mockOnChange).toHaveBeenCalledWith(null);
    });
});
