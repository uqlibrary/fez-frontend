import React from 'react';
import BulkUpdatesActions from './BulkUpdatesActions';
import { render, fireEvent, WithReduxStore } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        recordsSelected: { 'UQ:1212121': { rek_pid: 'UQ:1212121' } },
        shouldDisplay: true,
        ...testProps,
    };

    return render(
        <WithReduxStore>
            <BulkUpdatesActions {...props} />
        </WithReduxStore>,
    );
}

describe('BulkUpdatesActions', () => {
    it('should render bulk updates actions selector', () => {
        const { getByTestId } = setup();

        expect(getByTestId('bulk-updates-actions-select')).toBeInTheDocument();
    });

    it('should not render bulk updates actions selector', () => {
        const { queryByTestId } = setup({ shouldDisplay: false });

        expect(queryByTestId('bulk-updates-actions-select')).not.toBeInTheDocument();
    });

    it('should render confirmation box on action selected', () => {
        const { location } = window;
        delete window.location;
        window.location = { reload: jest.fn() };

        const { getByTestId, getByText, queryByTestId } = setup();

        fireEvent.mouseDown(getByTestId('bulk-updates-actions-select'));
        fireEvent.click(getByText('Change display type'));

        expect(getByTestId('change-display-type-form')).toBeInTheDocument();

        fireEvent.click(getByTestId('change-display-type-cancel'));

        expect(queryByTestId('change-display-type-form')).not.toBeInTheDocument();
        expect(window.location.reload).toHaveBeenCalled();
        window.location = location;
    });

    it('should render confirmation box on action selected', () => {
        const { location } = window;
        delete window.location;
        window.location = { reload: jest.fn() };

        const { getByTestId, getByText, queryByTestId } = setup({
            recordsSelected: {
                'UQ:123456': {
                    rek_pid: 'UQ:123456',
                    fez_record_search_key_ismemberof: [{ rek_ismemberof: 'UQ:11111' }],
                },
            },
        });

        fireEvent.mouseDown(getByTestId('bulk-updates-actions-select'));
        fireEvent.click(getByText('Remove from collection'));

        expect(getByTestId('remove-from-collection-form')).toBeInTheDocument();

        fireEvent.click(getByTestId('remove-from-collection-cancel'));

        expect(queryByTestId('remove-from-collection-form')).not.toBeInTheDocument();
        expect(window.location.reload).toHaveBeenCalled();
        window.location = location;
    });
});
