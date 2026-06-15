import React from 'react';
import DrawingControls from './DrawingControls';
import { useMap } from '@vis.gl/react-google-maps';
import { render, userEvent } from 'test-utils';

jest.mock('@vis.gl/react-google-maps', () => ({
    useMap: jest.fn(),
}));

const setMode = jest.fn();
const setOptions = jest.fn();
const setup = (testProps = {}) => {
    const props = {
        draw: {
            setMode,
        },
        ...testProps,
    };
    return render(<DrawingControls {...props} />);
};

describe('DrawingControls', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useMap.mockReturnValue({
            setOptions,
        });
    });

    it('should do nothing when draw is null', () => {
        setup({ draw: null });
        expect(setMode).not.toHaveBeenCalled();
    });

    it('should allow switching mode', async () => {
        const { getByTestId } = setup();
        expect(setMode).toHaveBeenCalledWith('select'); // default mode

        await userEvent.click(getByTestId('marker-button'));
        expect(setMode).toHaveBeenLastCalledWith('marker');

        await userEvent.click(getByTestId('polygon-button'));
        expect(setMode).toHaveBeenLastCalledWith('polygon');

        await userEvent.click(getByTestId('rectangle-button'));
        expect(setMode).toHaveBeenLastCalledWith('rectangle');

        await userEvent.click(getByTestId('select-button'));
        expect(setMode).toHaveBeenLastCalledWith('select');

        expect(setOptions).toHaveBeenLastCalledWith({
            gestureHandling: 'greedy',
        });
    });

    it('should not switch modes when map is unavailable', async () => {
        useMap.mockReturnValue(null);
        const { getByTestId } = setup();
        await userEvent.click(getByTestId('marker-button'));

        expect(setMode).toHaveBeenCalledTimes(1); // initial select only
        expect(setOptions).not.toHaveBeenCalled();
    });
});
