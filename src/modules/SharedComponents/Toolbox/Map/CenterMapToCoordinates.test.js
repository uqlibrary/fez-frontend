import React from 'react';
import { render as defaultRender } from 'test-utils';
import { CenterMapToCoordinates } from './CenterMapToCoordinates';

jest.mock('@vis.gl/react-google-maps', () => ({
    useMap: jest.fn(),
}));

const { useMap } = require('@vis.gl/react-google-maps');

const mockPanTo = jest.fn();
const mockSetZoom = jest.fn();
const mockFitBounds = jest.fn();
const mockExtend = jest.fn();
const mockMap = {
    panTo: mockPanTo,
    setZoom: mockSetZoom,
    fitBounds: mockFitBounds,
};

const mockLatLngBounds = jest.fn(() => ({ extend: mockExtend }));

const singleCoordinate = [{ lat: -33.8688, lng: 151.2093 }];
const multipleCoordinates = [
    { lat: -33.8688, lng: 151.2093 },
    { lat: -37.8136, lng: 144.9631 },
];

function setup(coordinates = [], render = defaultRender) {
    return render(<CenterMapToCoordinates coordinates={coordinates} />);
}

describe('CenterMapToCoordinates', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useMap.mockReturnValue(mockMap);
        global.google = {
            maps: {
                LatLngBounds: mockLatLngBounds,
            },
        };
    });

    it('should render null', () => {
        const { container } = setup(singleCoordinate);
        expect(container).toBeEmptyDOMElement();
    });

    it('should not pan when map is not loaded', () => {
        useMap.mockReturnValue(null);
        setup(singleCoordinate);
        expect(mockPanTo).not.toHaveBeenCalled();
        expect(mockSetZoom).not.toHaveBeenCalled();
    });

    it('should not pan when coordinates are empty', () => {
        setup([]);
        expect(mockPanTo).not.toHaveBeenCalled();
        expect(mockSetZoom).not.toHaveBeenCalled();
    });

    it('should not pan when coordinates are not provided', () => {
        setup(undefined);
        expect(mockPanTo).not.toHaveBeenCalled();
        expect(mockSetZoom).not.toHaveBeenCalled();
    });

    it('should panTo and setZoom(7) for a single coordinate', () => {
        setup(singleCoordinate);
        expect(mockPanTo).toHaveBeenCalledWith(singleCoordinate[0]);
        expect(mockSetZoom).toHaveBeenCalledWith(7);
        expect(mockFitBounds).not.toHaveBeenCalled();
    });

    it('should fitBounds and setZoom(13) for multiple coordinates', () => {
        setup(multipleCoordinates);
        expect(mockLatLngBounds).toHaveBeenCalledTimes(1);
        expect(mockExtend).toHaveBeenCalledTimes(multipleCoordinates.length);
        expect(mockExtend).toHaveBeenCalledWith(multipleCoordinates[0]);
        expect(mockExtend).toHaveBeenCalledWith(multipleCoordinates[1]);
        expect(mockFitBounds).toHaveBeenCalledWith({ extend: mockExtend });
        expect(mockSetZoom).toHaveBeenCalledWith(13);
        expect(mockPanTo).not.toHaveBeenCalled();
    });

    it('should only center the map once even if coordinates change', () => {
        const { rerender } = setup(singleCoordinate);
        expect(mockPanTo).toHaveBeenCalledTimes(1);

        setup(multipleCoordinates, rerender);
        expect(mockPanTo).toHaveBeenCalledTimes(1);
        expect(mockFitBounds).not.toHaveBeenCalled();
    });
});
