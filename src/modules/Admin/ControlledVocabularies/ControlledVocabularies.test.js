import React from 'react';

import { render, WithReduxStore, WithRouter, waitFor, userEvent, within, waitForElementToBeRemoved } from 'test-utils';

import * as mockData from 'mock/data';

import * as UserIsAdmin from 'hooks/userIsAdmin';
import { createMemoryHistory } from 'history';
import Immutable from 'immutable';

import ControlledVocabularies from './ControlledVocabularies';
import * as repositories from 'repositories';

const setup = ({ state = {}, testHistory = createMemoryHistory({ initialEntries: ['/'] }) } = {}) => {
    return render(
        <WithReduxStore initialState={Immutable.Map(state)}>
            <WithRouter history={testHistory}>
                <ControlledVocabularies {...state} />
            </WithRouter>
        </WithReduxStore>,
    );
};

describe('ControlledVocabularies', () => {
    const userIsAdmin = jest.spyOn(UserIsAdmin, 'userIsAdmin');

    beforeEach(() => {
        mockApi = setupMockAdapter();
        mockApi.onGet(repositories.routes.VOCAB_LIST_API().apiUrl).reply(200, mockData.vocabList);
        userIsAdmin.mockImplementation(() => true);
    });

    afterEach(() => {
        mockApi.reset();
    });

    it('should show loading message', async () => {
        const { getByText } = setup();
        await waitFor(() => getByText('...Loading Data...'));
    });

    it('should render as expected', async () => {
        const { getByText, getByTestId } = setup();
        await waitForElementToBeRemoved(getByTestId('vocab-page-loading'));

        expect(getByText('Displaying 42 controlled vocabularies')).toBeInTheDocument();
    });

    describe('admin ADD form', () => {
        const showAddForm = async () => {
            const rendered = setup();
            await waitForElementToBeRemoved(rendered.getByTestId('vocab-page-loading'));
            await userEvent.click(rendered.getByTestId('admin-add-vocabulary-button'));
            expect(
                within(rendered.getByTestId('portal-root')).getByTestId('update_dialog-controlledVocabulary'),
            ).toBeInTheDocument();
            expect(rendered.getByTestId('update_dialog-controlledVocabulary')).toHaveTextContent('Add vocabulary');
            expect(
                within(rendered.getByTestId('update_dialog-controlledVocabulary')).getByTestId('cvo-title-input'),
            ).toHaveAttribute('value', '');
            return Promise.resolve(rendered);
        };
        it('should render and close when button clicked', async () => {
            await showAddForm().then(async ({ getByTestId, queryByTestId }) => {
                await userEvent.click(getByTestId('update_dialog-cancel-button'));
                expect(queryByTestId('update_dialog-controlledVocabulary')).not.toBeInTheDocument();
                expect(getByTestId('portal-edit-453669')).toBeEmptyDOMElement();
            });
        });

        it('should render and save when button clicked', async () => {
            mockApi.onPost(repositories.routes.VOCAB_API().apiUrl).reply(200, {});
            await showAddForm().then(async ({ getByTestId }) => {
                await userEvent.type(getByTestId('cvo-title-input'), 'Test title');
                await userEvent.click(getByTestId('update_dialog-action-button'));
                await waitForElementToBeRemoved(getByTestId('update_dialog-controlledVocabulary'));
                expect(getByTestId('vocab-page-loading')).toBeInTheDocument();
            });
        });
        it('should capture error when save when button clicked', async () => {
            const message = 'Test error message';
            mockApi.onPost(repositories.routes.VOCAB_API().apiUrl).reply(422, { message });
            await showAddForm().then(async ({ getByTestId }) => {
                await userEvent.type(getByTestId('cvo-title-input'), 'Test title');
                await userEvent.click(getByTestId('update_dialog-action-button'));
                await waitForElementToBeRemoved(getByTestId('update_dialog-progress'));

                expect(getByTestId('update_dialog-alert')).toHaveTextContent(message);
            });
        });
    });
    describe('admin EDIT form', () => {
        const showEditForm = async () => {
            const rendered = setup();
            await waitForElementToBeRemoved(rendered.getByTestId('vocab-page-loading'));
            await userEvent.click(rendered.getByTestId('admin-edit-button-453669'));

            expect(
                within(rendered.getByTestId('portal-edit-453669')).getByTestId('update_dialog-controlledVocabulary'),
            ).toBeInTheDocument();
            expect(rendered.getByTestId('update_dialog-controlledVocabulary')).toHaveTextContent('Update vocabulary');
            expect(
                within(rendered.getByTestId('update_dialog-controlledVocabulary')).getByTestId('cvo-title-input'),
            ).toHaveAttribute('value', 'AIATSIS codes');
            return Promise.resolve(rendered);
        };

        it('should render and close when button clicked', async () => {
            await showEditForm().then(async ({ getByTestId, queryByTestId }) => {
                await userEvent.click(getByTestId('update_dialog-cancel-button'));
                expect(queryByTestId('update_dialog-controlledVocabulary')).not.toBeInTheDocument();
                expect(getByTestId('portal-edit-453669')).toBeEmptyDOMElement();
            });
        });
        it('should render and save when button clicked', async () => {
            mockApi.onPut(repositories.routes.VOCAB_API().apiUrl).reply(200, {});
            await showEditForm().then(async ({ getByTestId }) => {
                await userEvent.type(getByTestId('cvo-title-input'), ' Updated');
                await userEvent.click(getByTestId('update_dialog-action-button'));
                await waitForElementToBeRemoved(getByTestId('update_dialog-controlledVocabulary'));
                expect(getByTestId('vocab-page-loading')).toBeInTheDocument();
            });
        });
    });

    it('should show relevant error message', async () => {
        userIsAdmin.mockImplementation(() => false);
        mockApi.onGet(repositories.routes.VOCAB_LIST_API().apiUrl).reply(422, { message: 'Some error message' });

        const { getByText } = setup();
        await waitFor(() => getByText(/Some error message/));
    });
});
