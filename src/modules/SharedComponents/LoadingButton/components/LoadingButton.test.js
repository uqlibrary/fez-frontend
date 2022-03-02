import React from 'react';
import { render } from 'test-utils';

import LoadingButton from './LoadingButton';

const setup = ({ props = {} } = {}) => {
    const testData = {
        error: false,
        loading: true,
        children: undefined,
        ...props,
    };

    return render(<LoadingButton id="loading-button" data-testid="loading-button" {...testData} />);
};

describe('Loading button', () => {
    it('should display a button containing a circular progress spinner', () => {
        const { getByRole, getByTestId } = setup();

        expect(getByTestId('loading-button')).toBeInTheDocument();
        expect(getByRole('progressbar')).toBeInTheDocument();
    });
});
