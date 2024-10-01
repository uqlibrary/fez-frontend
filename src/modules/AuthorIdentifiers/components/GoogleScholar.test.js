import React from 'react';
import GoogleScholar from './GoogleScholar';
import Immutable from 'immutable';
import { render, fireEvent, WithReduxStore, waitFor, assertEnabled, assertDisabled } from 'test-utils';
import * as repositories from 'repositories';
import * as AuthorAction from 'actions/authors';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

const setup = ({ state = {} } = {}) => {
    return render(
        <WithReduxStore initialState={Immutable.Map(state)}>
            <MemoryRouter>
                <Routes>
                    <Route path="/dashboard" element={<div>Dashboard</div>} />
                    <Route path="/" exact element={<GoogleScholar />} />
                </Routes>
            </MemoryRouter>
        </WithReduxStore>,
    );
};

describe('GoogleScholar form', () => {
    it('should load google scholar for given author to add google scholar identifier', async () => {
        const updateCurrentAuthor = jest.spyOn(AuthorAction, 'updateCurrentAuthor');

        mockApi
            .onPatch(repositories.routes.AUTHOR_API({ authorId: 111 }).apiUrl)
            .replyOnce(200, { data: { aut_id: 111, aut_google_scholar_id: 'abcd1234efgh' } });

        const { getByTestId, getByText, queryByText } = setup({
            state: {
                accountReducer: {
                    author: {
                        aut_id: 111,
                    },
                },
            },
        });

        expect(getByText('Add your Google Scholar identifier')).toBeInTheDocument();
        expect(getByTestId('aut-google-scholar-id-input')).toBeInTheDocument();
        assertEnabled(
            getByTestId,
            'aut-google-scholar-id-input',
            'cancel-aut-google-scholar-id',
            'submit-aut-google-scholar-id',
        );

        await waitFor(() => expect(getByText('This field is required')).toBeInTheDocument());

        fireEvent.change(getByTestId('aut-google-scholar-id-input'), { target: { value: 'abcd1234efgh' } });

        await waitFor(() => expect(queryByText('This field is required')).toBeNull());

        fireEvent.click(getByTestId('submit-aut-google-scholar-id'));

        assertDisabled(
            getByTestId,
            'aut-google-scholar-id-input',
            'cancel-aut-google-scholar-id',
            'submit-aut-google-scholar-id',
        );

        await waitFor(() => getByText('Dashboard'));

        expect(updateCurrentAuthor).toHaveBeenCalled();
    });

    it('should load google scholar for given author to add google scholar identifier and show error message after submitting', async () => {
        const updateCurrentAuthor = jest.spyOn(AuthorAction, 'updateCurrentAuthor');

        mockApi.onPatch(repositories.routes.AUTHOR_API({ authorId: 111 }).apiUrl).replyOnce(500);

        const { getByTestId, getByText, queryByText } = setup({
            state: {
                accountReducer: {
                    author: {
                        aut_id: 111,
                    },
                },
            },
        });

        expect(getByText('Add your Google Scholar identifier')).toBeInTheDocument();
        expect(getByTestId('aut-google-scholar-id-input')).toBeInTheDocument();
        assertEnabled(
            getByTestId,
            'aut-google-scholar-id-input',
            'cancel-aut-google-scholar-id',
            'submit-aut-google-scholar-id',
        );

        await waitFor(() => expect(getByText('This field is required')).toBeInTheDocument());

        fireEvent.change(getByTestId('aut-google-scholar-id-input'), { target: { value: 'abcd1234efgh' } });

        await waitFor(() => expect(queryByText('This field is required')).toBeNull());

        fireEvent.click(getByTestId('submit-aut-google-scholar-id'));

        assertDisabled(
            getByTestId,
            'aut-google-scholar-id-input',
            'cancel-aut-google-scholar-id',
            'submit-aut-google-scholar-id',
        );

        expect(getByText('Saving -')).toBeInTheDocument();

        await waitFor(() => getByText('Error -'));

        expect(updateCurrentAuthor).toHaveBeenCalled();
    });

    it('should load google scholar for given author to update google scholar identifier', async () => {
        const updateCurrentAuthor = jest.spyOn(AuthorAction, 'updateCurrentAuthor');

        mockApi
            .onPatch(repositories.routes.AUTHOR_API({ authorId: 111 }).apiUrl)
            .replyOnce(200, { data: { aut_id: 111, aut_google_scholar_id: 'abcd1234efgh' } });

        const { getByTestId, getByText } = setup({
            state: {
                accountReducer: {
                    author: {
                        aut_id: 111,
                        aut_google_scholar_id: '111122223333',
                    },
                },
            },
        });

        expect(getByText('Update your Google Scholar identifier')).toBeInTheDocument();
        expect(getByTestId('aut-google-scholar-id-input')).toBeInTheDocument();
        expect(getByTestId('aut-google-scholar-id-input')).toHaveAttribute('value', '111122223333');
        assertEnabled(
            getByTestId,
            'aut-google-scholar-id-input',
            'cancel-aut-google-scholar-id',
            'submit-aut-google-scholar-id',
        );

        fireEvent.change(getByTestId('aut-google-scholar-id-input'), { target: { value: 'abcd1234efgh' } });

        fireEvent.click(getByTestId('submit-aut-google-scholar-id'));

        assertDisabled(
            getByTestId,
            'aut-google-scholar-id-input',
            'cancel-aut-google-scholar-id',
            'submit-aut-google-scholar-id',
        );

        await waitFor(() => getByText('Dashboard'));

        expect(updateCurrentAuthor).toHaveBeenCalled();
    });

    it('should navigate to dashboard if user is not author', async () => {
        const { getByText } = setup({
            state: {
                accountReducer: {
                    author: null,
                    authorAccountLoading: null,
                },
            },
        });

        await waitFor(() => getByText('Dashboard'));
        expect(getByText('Dashboard')).toBeInTheDocument();
    });

    it('should navigate to dashboard on cancel', () => {
        const { getByTestId, getByText } = setup({
            state: {
                accountReducer: {
                    author: {
                        aut_id: 111,
                        aut_google_scholar_id: '111122223333',
                    },
                },
            },
        });

        fireEvent.click(getByTestId('cancel-aut-google-scholar-id'));

        expect(getByText('Dashboard')).toBeInTheDocument();
    });
});
