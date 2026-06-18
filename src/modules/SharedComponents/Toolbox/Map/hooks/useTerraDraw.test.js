import { renderHook, act } from 'test-utils';
import { useMap } from '@vis.gl/react-google-maps';
import { useTerraDraw } from './useTerraDraw';
import { TerraDraw } from 'terra-draw';

jest.mock('@vis.gl/react-google-maps', () => ({
    useMap: jest.fn(),
}));

jest.mock('terra-draw-google-maps-adapter', () => ({
    TerraDrawGoogleMapsAdapter: jest.fn(),
}));

jest.mock('terra-draw', () => {
    const start = jest.fn();
    const stop = jest.fn();
    const on = jest.fn();
    const getSnapshot = jest.fn();
    const clear = jest.fn();

    return {
        TerraDraw: jest.fn().mockImplementation(() => ({
            start,
            stop,
            on,
            getSnapshot,
            clear,
        })),
        TerraDrawMarkerMode: jest.fn(),
        TerraDrawPolygonMode: jest.fn(),
        TerraDrawRectangleMode: jest.fn(),
        TerraDrawSelectMode: jest.fn(),
    };
});

describe('useTerraDraw', () => {
    let map;
    let projectionChangedHandler;
    let removeListener;

    beforeEach(() => {
        jest.clearAllMocks();
        removeListener = jest.fn();
        projectionChangedHandler = null;

        global.google = { maps: {} };

        map = {
            getProjection: jest.fn(),
            addListener: jest.fn((event, cb) => {
                projectionChangedHandler = cb;
                return {
                    remove: removeListener,
                };
            }),
            setOptions: jest.fn(),
        };

        useMap.mockReturnValue(map);
    });

    it('should return null when map is unavailable', () => {
        useMap.mockReturnValue(null);
        const { result } = renderHook(() => useTerraDraw());

        expect(result.current).toBeNull();
        expect(TerraDraw).not.toHaveBeenCalled();
    });

    it('should initialize immediately when projection is available', () => {
        map.getProjection.mockReturnValue({});
        const { result } = renderHook(() => useTerraDraw());

        expect(TerraDraw).toHaveBeenCalledTimes(1);
        expect(result.current).toBeTruthy();
        const instance = TerraDraw.mock.results[0].value;
        expect(instance.start).toHaveBeenCalled();
    });

    it('should wait for projection_changed before initializing', () => {
        map.getProjection.mockReturnValue(null);
        renderHook(() => useTerraDraw());

        expect(TerraDraw).not.toHaveBeenCalled();
        map.getProjection.mockReturnValue({});
        act(() => {
            projectionChangedHandler();
        });
        expect(TerraDraw).toHaveBeenCalledTimes(1);
        expect(removeListener).toHaveBeenCalled();
    });

    it('should call given onCreate on feature creation', () => {
        map.getProjection.mockReturnValue({});
        const onCreateMock = jest.fn();
        renderHook(() => useTerraDraw({ onCreate: onCreateMock }));

        const instance = TerraDraw.mock.results[0].value;

        const mockFeature = { id: 'mockId', geometry: {}, properties: {} };
        instance.getSnapshot.mockReturnValue([mockFeature]);

        const handler = instance.on.mock.calls.find(([event]) => event === 'finish')[1];
        act(() => handler('mockId'));

        expect(onCreateMock).toHaveBeenCalledWith(mockFeature);
    });

    it('should call given onClear on clear', () => {
        map.getProjection.mockReturnValue({});
        const onClearMock = jest.fn();
        renderHook(() => useTerraDraw({ onClear: onClearMock }));

        const instance = TerraDraw.mock.results[0].value;

        const mockFeature = { id: 'mockId', geometry: {}, properties: {} };
        instance.getSnapshot.mockReturnValue([mockFeature]);

        const handler = instance.on.mock.calls.find(([event]) => event === 'change')[1];
        act(() => handler([], 'delete'));

        expect(onClearMock).toHaveBeenCalled();
    });

    it('should not initialize when readOnly is true', () => {
        map.getProjection.mockReturnValue({});
        const { result } = renderHook(() => useTerraDraw({ readOnly: true }));

        expect(TerraDraw).not.toHaveBeenCalled();
        expect(result.current).toBeNull();
    });

    it('should not call onClear when change type is not delete', () => {
        map.getProjection.mockReturnValue({});
        const onClearMock = jest.fn();
        renderHook(() => useTerraDraw({ onClear: onClearMock }));

        const instance = TerraDraw.mock.results[0].value;
        const handler = instance.on.mock.calls.find(([event]) => event === 'change')[1];

        act(() => handler(['someId'], 'create'));
        act(() => handler(['someId'], 'update'));

        expect(onClearMock).not.toHaveBeenCalled();
    });

    it('should not call onClear when ids is non-empty on delete', () => {
        map.getProjection.mockReturnValue({});
        const onClearMock = jest.fn();
        renderHook(() => useTerraDraw({ onClear: onClearMock }));

        const instance = TerraDraw.mock.results[0].value;
        const handler = instance.on.mock.calls.find(([event]) => event === 'change')[1];

        act(() => handler(['someId'], 'delete'));

        expect(onClearMock).not.toHaveBeenCalled();
    });

    it('should cleanup on unmount', () => {
        map.getProjection.mockReturnValue({});
        const { unmount } = renderHook(() => useTerraDraw());
        const instance = TerraDraw.mock.results[0].value;

        unmount();
        expect(instance.stop).toHaveBeenCalled();
    });

    it('should remove projection listener on unmount', () => {
        map.getProjection.mockReturnValue(null);
        const { unmount } = renderHook(() => useTerraDraw());

        unmount();
        expect(removeListener).toHaveBeenCalled();
    });

    it('should not create multiple TerraDraw instances on rerender', () => {
        map.getProjection.mockReturnValue({});
        const { rerender } = renderHook(() => useTerraDraw());

        rerender();
        expect(TerraDraw).toHaveBeenCalledTimes(1);
    });
});
