import React from 'react';
import { rtlRender, WithRouter } from 'test-utils';

import NavigationDialogBox from './NavigationDialogBox';

function setup(testProps = {}) {
    return rtlRender(
        <WithRouter>
            <NavigationDialogBox {...testProps} />
        </WithRouter>,
    );
}

describe('NavigationDialogBox component', () => {
    it('should render', () => {
        const { container, getByTestId } = setup({
            when: true,
            txt: {
                confirmationTitle: 'Confirmation',
                confirmationMessage: 'Are you sure?',
                cancelButtonLabel: 'No',
                confirmButtonLabel: 'Yes',
            },
        });
        expect(getByTestId('confirmDialogBox')).toBeInTheDocument();
        expect(container).toMatchSnapshot();
    });

    it('should not render', () => {
        const { container, queryByTestId } = setup({ when: false });
        expect(queryByTestId('confirmDialogBox')).not.toBeInTheDocument();
        expect(container).toMatchSnapshot();
    });
});
