import React from 'react';
import { render } from 'test-utils';
import TryCatch from './TryCatch';

const callback = jest.fn();

const ThrowError = ({ message = 'boom' }) => {
    throw new Error(message);
};

const setup = (props = {}) =>
    render(
        <TryCatch callback={callback} {...props}>
            <div>content</div>
        </TryCatch>,
    );

describe('TryCatch', () => {
    beforeEach(() => {
        jest.resetModules();
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should render children', () => {
        const { getByText } = setup();

        expect(getByText('content')).toBeInTheDocument();
    });

    it('should display and log error to console, and call callback', () => {
        const { getByText } = render(
            <TryCatch callback={callback}>
                <ThrowError />
            </TryCatch>,
        );

        expect(console.error).toHaveBeenCalled();
        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith(expect.objectContaining({ message: 'boom' }));
        expect(getByText('Failed to render component: boom')).toBeInTheDocument();
    });

    it('should not display error for non-prod envs', () => {
        jest.doMock('config/general', () => ({
            IS_PRODUCTION: true,
        }));

        const TryCatch = require('./TryCatch').default;
        const { queryByText } = render(
            <TryCatch callback={callback}>
                <ThrowError />
            </TryCatch>,
        );

        expect(console.error).toHaveBeenCalled();
        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith(expect.objectContaining({ message: 'boom' }));
        expect(queryByText('Failed to render component: boom')).not.toBeInTheDocument();
    });
});
