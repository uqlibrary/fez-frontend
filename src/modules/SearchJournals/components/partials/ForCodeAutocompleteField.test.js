import React from 'react';
import { render, userEvent, waitFor, waitForText, WithReduxStore } from 'test-utils';
import { useDispatch } from 'react-redux';
import { assertMinQueryLength, ForCodeAutocompleteField } from './ForCodeAutocompleteField';
import { initialState, keywordOnlySuffix } from '../../../../reducers/journals';
import { within } from '@testing-library/react';

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn().mockImplementation(() => jest.requireActual('react-redux').useDispatch()),
}));

const stateMock = {
    journalSearchKeywords: {
        subjectFuzzyMatch: [
            {
                jnl_subject_cvo_id: 41000,
                jnl_subject_sources: 'ERA',
                jnl_subject_title: '1000 General',
            },
            {
                jnl_subject_cvo_id: 41001,
                jnl_subject_sources: 'WOS AHCI,WOS ESCI',
                jnl_subject_title: '1001 Math',
            },
        ],
    },
};

const setup = ({
    state = {
        journalReducer: {
            ...initialState,
            [keywordOnlySuffix]: { ...stateMock },
        },
    },
} = {}) =>
    render(
        <WithReduxStore initialState={state}>
            <ForCodeAutocompleteField filter={v => v} />
        </WithReduxStore>,
    );
describe('ForCodeAutocompleteField', () => {
    afterEach(() => jest.clearAllMocks());

    it('should render option sources', async () => {
        const { getByTestId } = setup();

        await userEvent.type(getByTestId('for-code-autocomplete-field-input'), '100');
        const option = await waitForText('1001 Math');
        'WOS AHCI,WOS ESCI'
            .split(',')
            .map(source => expect(within(option.parentElement).getByText(source)).toBeInTheDocument());
    });

    describe('query min length', () => {
        it('should not send queries with less than 3 chars', async () => {
            const dispatchMock = jest.fn();
            useDispatch.mockReturnValue(dispatchMock);
            const { getByTestId } = setup();

            await userEvent.type(getByTestId('for-code-autocomplete-field-input'), 'ab');
            await waitFor(() => {
                expect(dispatchMock).not.toHaveBeenCalled();
            });

            await userEvent.type(getByTestId('for-code-autocomplete-field-input'), 'abc');
            await waitFor(() => {
                expect(dispatchMock).toHaveBeenCalledTimes(1);
            });
        });

        it('assertMinQueryLength', async () => {
            expect(assertMinQueryLength('  a  ')).toBe(false);
            expect(assertMinQueryLength('  ab  ')).toBe(false);
            expect(assertMinQueryLength('  abc  ')).toBe(true);
        });
    });
});
