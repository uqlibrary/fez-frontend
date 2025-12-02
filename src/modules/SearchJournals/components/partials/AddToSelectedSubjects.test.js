import React from 'react';
import { api, assertDisabled, render, userEvent, waitFor, waitForText, WithReduxStore, within } from 'test-utils';
import { AddToSelectedSubjects } from './AddToSelectedSubjects';
import { initialState, keywordOnlySuffix } from '../../../../reducers/journals';

const stateMock = {
    journalSearchKeywords: {
        subjectFuzzyMatch: [
            {
                jnl_subject_cvo_id: 41000,
                jnl_subject_sources: 'ERA',
                jnl_subject_title: '1000 General',
            },
            {
                jnl_subject_cvo_id: 41010,
                jnl_subject_sources: 'WOS AHCI,WOS ESCI',
                jnl_subject_title: '1010 Math',
            },
        ],
    },
};

const setup = ({
    onAdd,
    selected,
    state = {
        journalReducer: {
            ...initialState,
            [keywordOnlySuffix]: { ...stateMock },
        },
    },
} = {}) =>
    render(
        <WithReduxStore initialState={state}>
            <AddToSelectedSubjects onAdd={onAdd || jest.fn()} selected={selected} />
        </WithReduxStore>,
    );

describe('AddToSelectedSubjects', () => {
    afterEach(() => {
        jest.clearAllMocks();
        api.mock.reset();
    });

    it('should render the add button (closed state) by default', () => {
        const { getByTestId, queryByTestId } = setup();
        expect(getByTestId('add-to-subject-selection-button')).toBeInTheDocument();
        expect(queryByTestId('for-code-autocomplete-field-input')).not.toBeInTheDocument();
    });

    it('should render a disabled button when state `journalsListLoading=true`', () => {
        setup({ state: { searchJournalsReducer: { journalsListLoading: true } } });
        assertDisabled('add-to-subject-selection-button');
    });

    it('should open the bordered chip with autocomplete when the button is clicked', async () => {
        const { getByTestId, queryByTestId } = setup();

        await userEvent.click(getByTestId('add-to-subject-selection-button'));
        expect(queryByTestId('add-to-subject-selection-button')).not.toBeInTheDocument();
        await waitFor(() => {
            expect(getByTestId('for-code-autocomplete-field-input')).toHaveFocus();
        });
    });

    it('should render option sources', async () => {
        const onAdd = jest.fn();
        const { getByTestId } = setup({ onAdd });

        await userEvent.click(getByTestId('add-to-subject-selection-button'));
        await userEvent.type(getByTestId('for-code-autocomplete-field-input'), '10');
        const option = await waitForText('1010 Math');
        'WOS AHCI,WOS ESCI'
            .split(',')
            .map(source => expect(within(option.parentElement).getByText(source)).toBeInTheDocument());
    });

    it.skip('should call given onAdd with mapped subject and closes when a subject is selected', async () => {
        const onAdd = jest.fn();
        const { getByTestId, queryByTestId } = setup({ onAdd });

        await userEvent.click(getByTestId('add-to-subject-selection-button'));
        await userEvent.type(getByTestId('for-code-autocomplete-field-input'), '10');
        await userEvent.click(await waitForText('1000 General'));

        // expect(onAdd).toHaveBeenCalledTimes(1);
        // expect(onAdd).toHaveBeenCalledWith({
        //     cvoId: 41000,
        //     id: 'Subject-41000',
        //     text: '1000 General',
        //     type: 'Subject',
        // });
        // should close after adding
        expect(queryByTestId('for-code-autocomplete-field-input')).not.toBeInTheDocument();
        expect(getByTestId('add-to-subject-selection-button')).toBeInTheDocument();
    });

    it('should hide selected subjects from dropdown list', async () => {
        const onAdd = jest.fn();
        const { getByTestId, queryByText } = setup({
            onAdd,
            selected: {
                'Subject-41000': {
                    cvoId: 41000,
                    id: 'Subject-41000',
                    text: '1000 General',
                    type: 'Subject',
                },
            },
        });

        await userEvent.click(getByTestId('add-to-subject-selection-button'));
        await userEvent.type(getByTestId('for-code-autocomplete-field-input'), '10');
        await waitForText('1010 Math');

        // should not list already selected subjects
        expect(queryByText('1000 General')).not.toBeInTheDocument();
    });

    it('closes when Escape is pressed in the autocomplete input', async () => {
        const onAdd = jest.fn();
        const { getByTestId, queryByTestId } = setup({ onAdd });

        await userEvent.click(getByTestId('add-to-subject-selection-button'));
        await userEvent.type(getByTestId('for-code-autocomplete-field-input'), '{escape}');

        expect(queryByTestId('for-code-autocomplete-field-input')).not.toBeInTheDocument();
        expect(getByTestId('add-to-subject-selection-button')).toBeInTheDocument();
        // onAdd must not have been called
        expect(onAdd).not.toHaveBeenCalled();
    });
});
