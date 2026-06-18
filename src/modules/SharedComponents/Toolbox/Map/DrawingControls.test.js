import React from 'react';
import DrawingControls from './DrawingControls';
import { useMap } from '@vis.gl/react-google-maps';
import { render, userEvent } from 'test-utils';

jest.mock('@vis.gl/react-google-maps', () => ({
    useMap: jest.fn(),
}));

const setMode = jest.fn();
const clear = jest.fn();
const setOptions = jest.fn();
const setup = (testProps = {}) => {
    const props = {
        draw: {
            setMode,
            clear,
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

    it('should do nothing when draw is null', async () => {
        const { getByTestId } = setup({ draw: null });
        await userEvent.click(getByTestId('marker-button'));
        expect(setMode).not.toHaveBeenCalled();
        expect(clear).not.toHaveBeenCalled();
    });

    it('should allow switching mode', async () => {
        const { getByTestId } = setup();

        await userEvent.click(getByTestId('marker-button'));
        expect(setMode).toHaveBeenLastCalledWith('marker');
        expect(clear).not.toHaveBeenCalled();

        await userEvent.click(getByTestId('polygon-button'));
        expect(setMode).toHaveBeenLastCalledWith('polygon');
        expect(clear).not.toHaveBeenCalled();

        await userEvent.click(getByTestId('rectangle-button'));
        expect(setMode).toHaveBeenLastCalledWith('rectangle');
        expect(clear).not.toHaveBeenCalled();

        await userEvent.click(getByTestId('static-button'));
        expect(setMode).toHaveBeenLastCalledWith('static');
        expect(clear).not.toHaveBeenCalled();

        await userEvent.click(getByTestId('clear-button'));
        expect(clear).toHaveBeenCalled();
        expect(setMode).not.toHaveBeenLastCalledWith('clear');
    });

    it('should not switch modes when map is unavailable', async () => {
        useMap.mockReturnValue(null);
        const { getByTestId } = setup();
        await userEvent.click(getByTestId('marker-button'));

        expect(setOptions).not.toHaveBeenCalled();
    });

    it('should not change mode when clicking the active mode again', async () => {
        const { getByTestId } = setup();
        await userEvent.click(getByTestId('marker-button'));
        expect(setMode).toHaveBeenCalledTimes(1);

        await userEvent.click(getByTestId('marker-button'));
        expect(setMode).toHaveBeenCalledTimes(1);
    });
});
