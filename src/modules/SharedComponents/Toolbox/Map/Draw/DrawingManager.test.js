import React from 'react';
import DrawingManager from './DrawingManager';
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
    return render(<DrawingManager {...props} />);
};

describe('DrawingManager', () => {
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

    it('should initialize in select mode', async () => {
        setup();
        expect(setMode).toHaveBeenCalledWith('select');
    });

    it('should allow switching mode', async () => {
        const { getByLabelText } = setup();

        await userEvent.click(getByLabelText('marker'));
        expect(setMode).toHaveBeenLastCalledWith('marker');

        await userEvent.click(getByLabelText('polygon'));
        expect(setMode).toHaveBeenLastCalledWith('polygon');

        await userEvent.click(getByLabelText('rectangle'));
        expect(setMode).toHaveBeenLastCalledWith('rectangle');

        await userEvent.click(getByLabelText('select'));
        expect(setMode).toHaveBeenLastCalledWith('select');

        expect(setOptions).toHaveBeenLastCalledWith({
            gestureHandling: 'greedy',
        });
    });

    it('should not switch modes when map is unavailable', async () => {
        useMap.mockReturnValue(null);
        const { getByLabelText } = setup();
        await userEvent.click(getByLabelText('marker'));

        expect(setMode).toHaveBeenCalledTimes(1); // initial select only
        expect(setOptions).not.toHaveBeenCalled();
    });
});
