import React from 'react';
import { render as defaultRender, screen } from 'test-utils';
import userEvent from '@testing-library/user-event';
import { useSelector } from 'react-redux';
import { useDispatchOnce } from 'hooks/useDispatchOnce';
import { loadLists } from 'actions';
import ListSelect from './ListSelect';
import { JOURNAL_FAVOURITE_LIST_LABEL } from 'config/general';

jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
}));

jest.mock('hooks/useDispatchOnce', () => ({
    useDispatchOnce: jest.fn(),
}));

jest.mock('actions', () => ({
    loadLists: jest.fn(() => ({ type: 'LOAD_LISTS' })),
}));

const dispatchOnce = jest.fn();

const lists = [
    {
        fjl_id: 1,
        fjl_label: 'List 1',
    },
    {
        fjl_id: 2,
        fjl_label: JOURNAL_FAVOURITE_LIST_LABEL,
    },
];

const setup = (props = {}) => defaultRender(<ListSelect {...props} />);

describe('ListSelect', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        useDispatchOnce.mockReturnValue(dispatchOnce);

        useSelector.mockImplementation(selector =>
            selector({
                get: key => {
                    if (key === 'journalUserListsReducer') {
                        return {
                            loading: false,
                            data: {
                                data: lists,
                            },
                        };
                    }
                    return undefined;
                },
            }),
        );
    });

    it('should render nothing when there are no lists', () => {
        useSelector.mockImplementation(selector =>
            selector({
                get: () => ({
                    loading: false,
                    data: {
                        data: [],
                    },
                }),
            }),
        );

        const { container } = setup();
        expect(container.firstChild).toBeNull();
    });

    it('should dispatch loadLists via useDispatchOnce', () => {
        useSelector.mockImplementation(selector =>
            selector({
                get: () => ({
                    loading: false,
                    data: null,
                }),
            }),
        );
        setup();
        expect(useDispatchOnce).toHaveBeenCalledWith(false, expect.any(Function));

        useDispatchOnce.mock.calls[0][1]();

        expect(loadLists).toHaveBeenCalled();
        expect(dispatchOnce).toHaveBeenCalled();
    });

    it('should default to the favourite list', () => {
        setup();

        expect(screen.getByRole('combobox')).toHaveTextContent(JOURNAL_FAVOURITE_LIST_LABEL);
    });

    it('should use the supplied value', () => {
        setup({ value: 1 });

        expect(screen.getByRole('combobox')).toHaveTextContent('List 1');
    });

    it('should disable the select while loading', () => {
        useSelector.mockImplementation(selector =>
            selector({
                get: () => ({
                    loading: true,
                    data: {
                        data: lists,
                    },
                }),
            }),
        );

        setup();

        expect(screen.getByRole('combobox')).toHaveAttribute('aria-disabled', 'true');
    });

    it('should render all menu items', async () => {
        setup();

        await userEvent.click(screen.getByRole('combobox'));

        expect(screen.getByRole('option', { name: 'List 1' })).toBeInTheDocument();
        expect(screen.getByRole('option', { name: JOURNAL_FAVOURITE_LIST_LABEL })).toBeInTheDocument();
    });

    it('should call onChange', async () => {
        const onChange = jest.fn();

        setup({ onChange });

        await userEvent.click(screen.getByRole('combobox'));
        await userEvent.click(screen.getByRole('option', { name: 'List 1' }));

        expect(onChange).toHaveBeenCalled();
    });
});
