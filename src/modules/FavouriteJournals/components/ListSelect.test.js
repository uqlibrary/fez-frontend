import React from 'react';
import { render as defaultRender, screen, userEvent } from 'test-utils';
import ListSelect from './ListSelect';
import { JOURNAL_FAVOURITE_LIST_LABEL } from 'config/general';

const lists = [
    {
        id: 1,
        label: 'List 1',
    },
    {
        id: 2,
        label: JOURNAL_FAVOURITE_LIST_LABEL,
    },
];

const setup = (props = {}) => defaultRender(<ListSelect lists={lists} value="" onChange={jest.fn()} {...props} />);

describe('ListSelect', () => {
    it('should render nothing when there are no lists', () => {
        const { container } = setup({ lists: [] });

        expect(container.firstChild).toBeNull();
    });

    it('should use the supplied value', () => {
        setup({ value: 1 });

        expect(screen.getByRole('combobox')).toHaveTextContent('List 1');
    });

    it('should disable the select while loading', () => {
        setup({ loading: true });

        expect(screen.getByRole('combobox')).toHaveAttribute('aria-disabled', 'true');
    });

    it('should call onChange', async () => {
        const onChange = jest.fn();

        const { getByRole } = setup({ onChange });

        await userEvent.click(getByRole('combobox'));
        await userEvent.click(getByRole('option', { name: 'List 1' }));

        expect(onChange).toHaveBeenCalledTimes(1);
    });
});
