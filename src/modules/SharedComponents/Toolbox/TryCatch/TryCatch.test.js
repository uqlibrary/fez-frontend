import React from 'react';
import { render } from 'test-utils';
import TryCatch from './TryCatch';

jest.mock('config/general', () => ({
    IS_PRODUCTION: false,
}));

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

    it('should render fallback when child throws', () => {
        const { getByText } = render(
            <TryCatch>
                <ThrowError />
            </TryCatch>,
        );

        expect(getByText('Failed to render component: boom')).toBeInTheDocument();
    });

    it('should call callback with the error', () => {
        render(
            <TryCatch callback={callback}>
                <ThrowError />
            </TryCatch>,
        );

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith(expect.objectContaining({ message: 'boom' }));
    });

    it('should log error to console', () => {
        render(
            <TryCatch>
                <ThrowError />
            </TryCatch>,
        );

        expect(console.error).toHaveBeenCalled();
    });
});
