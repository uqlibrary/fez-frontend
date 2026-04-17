import React from 'react';
import {
    assertDisabled,
    assertEnabled,
    clearAndType,
    getReduxStoreState,
    render,
    userEvent,
    waitForText,
    waitForTextToBeRemoved,
    WithReduxStore,
} from 'test-utils';
import { locale } from 'locale';
import { screen } from '@testing-library/react';
import { FindRecords } from './FindRecords';
import { pathConfig } from '../../../../config';

const mockUseNavigate = jest.fn();
jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useNavigate: () => mockUseNavigate,
}));

function setup() {
    return render(
        <WithReduxStore>
            <FindRecords />
        </WithReduxStore>,
    );
}

describe('FindRecords ', () => {
    const assertInitialState = async () => {
        expect(screen.getByTestId('search-query-input')).toHaveValue('');
        await waitForText(locale.validationErrors.required);
        assertDisabled('submit-search');
        assertEnabled('skip-search');
    };
    const assertValidationError = async () => await waitForText(locale.validationErrors.publicationSearch);
    const assertNoValidationError = async () => await waitForTextToBeRemoved(locale.validationErrors.publicationSearch);

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should validate empty field on render', async () => {
        setup();
        await assertInitialState();
    });

    it('should validate user input', async () => {
        setup();
        await assertInitialState();
        // work title
        await clearAndType('search-query-input', 'cats');
        await assertValidationError();
        assertDisabled('submit-search');
        await clearAndType('search-query-input', 'cats and dogs');
        await assertNoValidationError();
        assertEnabled('submit-search');
        // doi
        await clearAndType('search-query-input', '10.000/');
        await assertValidationError();
        assertDisabled('submit-search');
        await clearAndType('search-query-input', '10.000/abc');
        await assertNoValidationError();
        assertEnabled('submit-search');
        // pubmed id
        await clearAndType('search-query-input', '12');
        await assertValidationError();
        assertDisabled('submit-search');
        await clearAndType('search-query-input', '123');
        await assertNoValidationError();
        assertEnabled('submit-search');
    });

    it('should call given onSkipSearch callback', async () => {
        const initialState = getReduxStoreState('searchRecordsReducer');
        const { getByTestId } = setup();
        await userEvent.click(getByTestId('skip-search'));
        expect(initialState).toEqual(getReduxStoreState('searchRecordsReducer'));
        expect(mockUseNavigate).toHaveBeenCalledTimes(1);
        expect(mockUseNavigate).toHaveBeenCalledWith(pathConfig.records.add.new);
    });

    it('should call given onSubmit callback', async () => {
        expect(getReduxStoreState('searchRecordsReducer').rawSearchQuery).toBeUndefined();
        const searchTerm = 'cats and dogs';
        const { getByTestId } = setup();
        await clearAndType('search-query-input', searchTerm);
        await assertNoValidationError();
        await userEvent.click(getByTestId('submit-search'));
        const state = getReduxStoreState('searchRecordsReducer');
        expect(state.rawSearchQuery).toBe(searchTerm);
        expect(state.searchLoading).toBeTruthy();
        expect(mockUseNavigate).toHaveBeenCalled();
    });
});
