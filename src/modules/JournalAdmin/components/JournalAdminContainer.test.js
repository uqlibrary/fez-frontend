import React from 'react';
import { render, WithReduxStore, WithRouter } from 'test-utils';
import Cookies from 'js-cookie';
import { useParams } from 'react-router-dom';

import { accounts } from 'mock/data/account';
import { journalDoaj } from 'mock/data';
import JournalAdminContainer, { isSame } from './JournalAdminContainer';
import { useJournal } from '../hooks';

class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
}

window.ResizeObserver = ResizeObserver;

jest.mock('../submitHandler', () => ({
    onSubmit: jest.fn(),
}));
jest.mock('js-cookie', () => jest.fn());

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn(),
}));

function setup(testState = {}) {
    const state = {
        accountReducer: {
            account: {
                account: accounts.uqresearcher,
            },
            author: {
                aut_id: 111,
            },
        },
        ...testState,
    };

    return render(
        <WithRouter>
            <WithReduxStore initialState={Immutable.Map(state)}>
                >
                <JournalAdminContainer />
            </WithReduxStore>
        </WithRouter>,
    );
}

describe('JournalAdminContainer component', () => {
    // HERE, this test will need to mock viewJournalReducer in redux state,
    // as the useJournal hook uses it to populate required values.
    // Will need to manipulate for each test as the container no
    // longer accepts props
    describe('Fullform view', () => {
        beforeAll(() => {
            Cookies.get = jest.fn().mockImplementation(() => 'fullform');
            Cookies.set = jest.fn();
        });

        beforeEach(() => {
            useParams.mockImplementation(() => ({ id: 12 }));
        });

        it('should render default view', async () => {
            const { getByText } = setup();

            expect(getByText('Edit journal - Advanced Nonlinear Studies')).toBeInTheDocument();

            const switcher = document.querySelector('input.MuiSwitch-input');
            expect(switcher).not.toHaveAttribute('checked');
        });

        it('should render loading journal view', () => {
            const { getByText } = setup({
                journalToViewLoading: true,
            });
            expect(getByText('Loading work')).toBeInTheDocument();
        });

        it('should render journal not found view', () => {
            const { getByText } = setup({
                journalToView: undefined,
                journalToViewError: { message: 'test', status: 404 },
            });
            expect(getByText('Work not found')).toBeInTheDocument();
            expect(getByText('(404 - test)')).toBeInTheDocument();
        });

        it('should render empty div if journal is not loaded', () => {
            useParams.mockImplementation(() => ({ id: undefined }));
            setup({
                journalToView: undefined,
            });
            const div = document.querySelector('.empty');
            expect(div).not.toBeNull();
        });

        it('should render not found message when no journal is provided', () => {
            const { getByTestId } = setup({
                journalToView: null,
            });
            expect(getByTestId('page-title')).toHaveTextContent('Work not found');
        });

        it('should render not found message journal error is encountered', () => {
            const { getByTestId } = setup({
                journalLoadingError: true,
            });
            expect(getByTestId('page-title')).toHaveTextContent('Work not found');
        });

        describe('isSame callback function', () => {
            it('should return true if props are not changed', () => {
                expect(
                    isSame(
                        { disableSubmit: false, journalToView: { id: 12 }, loadJournalToView: false },
                        { disableSubmit: false, journalToView: { id: 12 }, loadJournalToView: false },
                    ),
                ).toBeTruthy();
            });
            it('should return true if props are changed', () => {
                expect(
                    isSame(
                        { disableSubmit: false, loadJournalToView: false },
                        { disableSubmit: false, loadJournalToView: true },
                    ),
                ).toBeTruthy();
            });
        });

        describe('React hooks', () => {
            it('should call clearJournalToView() prop on unload', () => {
                const clearJournalToView = jest.fn();
                const { unmount } = setup({
                    clearJournalToView,
                });

                unmount();

                expect(clearJournalToView).toHaveBeenCalled();
            });
        });
    });
    describe('Tabbed view', () => {
        beforeAll(() => {
            Cookies.get = jest.fn().mockImplementation(() => 'tabbed');
            Cookies.set = jest.fn();
        });
        it('should render component with tabbed interface', () => {
            const { getByTestId } = setup();
            const switcher = document.querySelector('input.MuiSwitch-input');
            expect(switcher).toHaveAttribute('checked');
            expect(getByTestId('admin-tab')).toHaveClass('Mui-selected');
        });
        it('should render when form errors are present as immutable map', () => {
            const { getByTestId } = setup({
                formErrors: {
                    adminSection: {
                        jnl_title: 'Title is required',
                    },
                },
            });
            expect(getByTestId('alert')).toBeInTheDocument();
            expect(getByTestId('validation-warning-0')).toHaveTextContent('Journal title is required');
            expect(getByTestId('admin-tab')).toHaveTextContent('1');
        });
    });
});
