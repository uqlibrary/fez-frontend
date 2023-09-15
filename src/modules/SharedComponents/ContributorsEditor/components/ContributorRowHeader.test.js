import React from 'react';
import { rtlRender, fireEvent, waitFor } from 'test-utils';
import { ContributorRowHeader } from './ContributorRowHeader';

function setup(testProps = {}) {
    const props = {
        onDeleteAll: jest.fn(),
        showIdentifierLookup: false,
        showRoleInput: false,
        showContributorAssignment: false,
        disabled: false,
        canEdit: false,
        ...testProps,
    };
    return rtlRender(<ContributorRowHeader {...props} />);
}

describe('Component ContributorRowHeader', () => {
    it('header for contributor editor control with name and delete all button only', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('header for contributor editor control with all options', () => {
        const { container } = setup({ showIdentifierLookup: true, showContributorAssignment: true });
        expect(container).toMatchSnapshot();
    });

    it('header for creator role', () => {
        const { container } = setup({ showRoleInput: true });
        expect(container).toMatchSnapshot();
    });

    it('header for contributor editor control with delete all disabled', () => {
        const { container } = setup({ disabled: true });
        expect(container).toMatchSnapshot();
    });

    it('triggers the confirmation box', async () => {
        const { getByRole, getByTestId, container } = setup();

        fireEvent.click(getByRole('button', { name: 'Remove all records' }));
        await waitFor(() => getByTestId('confirm-dialog-box'));
        expect(container).toMatchSnapshot();
    });

    it('should display infinite class', () => {
        const { container } = setup({
            isInfinite: true,
            classes: {
                infinitePaddingRight: 'test-class-1',
            },
        });
        expect(container).toMatchSnapshot();
    });
    it('should use extra padding if row is editable', () => {
        const { container } = setup({
            canEdit: true,
            classes: {
                paddingRightEdit: 'test-class-1',
            },
        });
        expect(container).toMatchSnapshot();
    });
});
