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

    return {
        TerraDraw: jest.fn().mockImplementation(() => ({
            start,
            stop,
            on,
            getSnapshot,
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

    it('should call given onFeatureCreated on feature creation', () => {
        map.getProjection.mockReturnValue({});
        const onFeatureCreatedMock = jest.fn();
        renderHook(() => useTerraDraw({ onFeatureCreated: onFeatureCreatedMock }));

        const instance = TerraDraw.mock.results[0].value;

        const mockFeature = { id: 'mockId', geometry: {}, properties: {} };
        instance.getSnapshot.mockReturnValue([mockFeature]);

        const finishHandler = instance.on.mock.calls.find(([event]) => event === 'finish')[1];
        act(() => {
            finishHandler('mockId');
        });

        expect(onFeatureCreatedMock).toHaveBeenCalledWith(mockFeature, instance);
    });

    it('should disable gesture handling during updates', () => {
        map.getProjection.mockReturnValue({});
        renderHook(() => useTerraDraw());
        const instance = TerraDraw.mock.results[0].value;
        const changeHandler = instance.on.mock.calls.find(([event]) => event === 'change')[1];

        act(() => {
            changeHandler({}, 'update');
        });
        expect(map.setOptions).toHaveBeenCalledWith({
            gestureHandling: 'none',
        });
    });

    it('should restore gesture handling for non-update events', () => {
        map.getProjection.mockReturnValue({});
        renderHook(() => useTerraDraw());
        const instance = TerraDraw.mock.results[0].value;
        const changeHandler = instance.on.mock.calls.find(([event]) => event === 'change')[1];

        act(() => {
            changeHandler({}, 'create');
        });
        expect(map.setOptions).toHaveBeenCalledWith({
            gestureHandling: 'greedy',
        });
    });

    it('should cleanup on unmount', () => {
        map.getProjection.mockReturnValue({});
        const { unmount } = renderHook(() => useTerraDraw());
        const instance = TerraDraw.mock.results[0].value;

        unmount();
        expect(map.setOptions).toHaveBeenCalledWith({
            gestureHandling: 'greedy',
        });
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
