import React from 'react';

import { render, WithReduxStore, WithRouter, waitFor, userEvent, within, waitForElementToBeRemoved } from 'test-utils';

import * as mockData from 'mock/data';

import * as UserIsAdmin from 'hooks/userIsAdmin';
import Immutable from 'immutable';

import ControlledVocabularies from './ControlledVocabularies';
import * as repositories from 'repositories';

const setup = ({ state = {} } = {}) => {
    return render(
        <WithReduxStore initialState={Immutable.Map(state)}>
            <WithRouter>
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
        mockApi
            .onGet(repositories.routes.CHILD_VOCAB_LIST_API('453669').apiUrl)
            .reply(200, mockData.childVocabList[453669]);

        mockApi.onPut(repositories.routes.VOCAB_API().apiUrl).reply(200, {});
        mockApi.onPost(repositories.routes.VOCAB_API().apiUrl).reply(200, {});
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

        expect(getByText('Displaying 42 total controlled vocabularies')).toBeInTheDocument();
        // check sorting is working
        expect(getByTestId('vocab-primary-body').firstChild).toHaveTextContent('AIATSIS codes');
        expect(getByTestId('vocab-primary-body').lastChild).toHaveTextContent('A Collection View Type of Standard');
        // first row should have edit button
        expect(
            within(getByTestId('vocab-primary-body').firstChild).getByTestId('admin-edit-button-453669'),
        ).toBeInTheDocument();
        // last row should not have edit button
        expect(
            within(getByTestId('vocab-primary-body').lastChild).queryByTestId('admin-edit-button-456850'),
        ).not.toBeInTheDocument();
    });

    describe('admin ADD form', () => {
        const showAddForm = async id => {
            const rendered = setup();
            await waitForElementToBeRemoved(rendered.getByTestId('vocab-page-loading'));
            if (!!id) {
                await userEvent.click(rendered.getByTestId(`expand-row-${id}`));
                await waitForElementToBeRemoved(rendered.getByTestId('childControlledVocab-page-loading'));
            }
            await userEvent.click(rendered.getByTestId(`admin-add-vocabulary-button${!!id ? `-${id}` : ''}`));
            expect(
                within(rendered.getByTestId(!!id ? `portal-add-${id}` : 'portal-root')).getByTestId(
                    'update_dialog-controlledVocabulary',
                ),
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
            await showAddForm().then(async ({ getByTestId, queryByTestId }) => {
                await userEvent.type(getByTestId('cvo-title-input'), 'Test title');
                await userEvent.click(getByTestId('update_dialog-action-button'));
                await waitForElementToBeRemoved(getByTestId('update_dialog-controlledVocabulary'));
                // expect(getByTestId('vocab-page-loading')).toBeInTheDocument();
                expect(queryByTestId('update_dialog-controlledVocabulary') === null);
            });
        });
        it('should capture error when save when button clicked', async () => {
            const message = 'Test error message';
            mockApi.onPost(repositories.routes.VOCAB_API().apiUrl).reply(422, { message });
            await showAddForm().then(async ({ getByTestId }) => {
                await userEvent.type(getByTestId('cvo-title-input'), 'Test title');
                await userEvent.click(getByTestId('update_dialog-action-button'));

                expect(getByTestId('update_dialog-alert')).toHaveTextContent(message);
            });
        });

        describe('child vocab', () => {
            it('should render and save when button clicked for child level', async () => {
                mockApi
                    .onGet(repositories.routes.CHILD_VOCAB_LIST_API(451780).apiUrl)
                    .reply(200, mockData.childVocabList[451780]);

                const showAddForm2 = async () => {
                    const rendered = setup();
                    await waitForElementToBeRemoved(rendered.getByTestId('vocab-page-loading'));
                    await userEvent.click(rendered.getByTestId('expand-row-451780'));
                    await waitForElementToBeRemoved(rendered.getByTestId('childControlledVocab-page-loading'));
                    await userEvent.click(rendered.getByTestId('admin-add-vocabulary-button-451780'));
                    expect(rendered.getByTestId('update_dialog-controlledVocabulary')).toBeInTheDocument();
                    expect(rendered.getByTestId('update_dialog-controlledVocabulary')).toHaveTextContent(
                        'Add vocabulary',
                    );
                    expect(
                        within(rendered.getByTestId('update_dialog-controlledVocabulary')).getByTestId(
                            'cvo-title-input',
                        ),
                    ).toHaveAttribute('value', '');
                    return Promise.resolve(rendered);
                };
                await showAddForm2().then(async ({ getByTestId, queryByTestId }) => {
                    await userEvent.type(getByTestId('cvo-title-input'), 'Test title');
                    await userEvent.click(getByTestId('update_dialog-action-button'));
                    await waitForElementToBeRemoved(getByTestId('update_dialog-controlledVocabulary'));
                    // expect(getByTestId('vocab-page-loading')).toBeInTheDocument();
                    expect(queryByTestId('update_dialog-controlledVocabulary') === null);
                });
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
            await showEditForm().then(async ({ getByTestId, queryByTestId }) => {
                await userEvent.type(getByTestId('cvo-title-input'), ' Updated');
                await userEvent.click(getByTestId('update_dialog-action-button'));
                await waitForElementToBeRemoved(getByTestId('update_dialog-controlledVocabulary'));
                // expect(getByTestId('vocab-page-loading')).toBeInTheDocument();
                expect(queryByTestId('update_dialog-controlledVocabulary') === null);
            });
        });
        describe('child vocab', () => {
            it('should render and save when button clicked', async () => {
                const { getByTestId } = setup();
                await waitForElementToBeRemoved(getByTestId('vocab-page-loading'));

                await userEvent.click(getByTestId('expand-row-453669'));
                await waitForElementToBeRemoved(getByTestId('childControlledVocab-page-loading'));

                await userEvent.click(getByTestId('admin-edit-button-453670'));

                expect(
                    within(getByTestId('portal-edit-453670')).getByTestId('update_dialog-controlledVocabulary'),
                ).toBeInTheDocument();
                expect(getByTestId('update_dialog-controlledVocabulary')).toHaveTextContent('Update vocabulary');
                expect(
                    within(getByTestId('update_dialog-controlledVocabulary')).getByTestId('cvo-title-input'),
                ).toHaveAttribute('value', 'Yukulta / Ganggalidda language G34');

                await userEvent.type(getByTestId('cvo-title-input'), ' Updated');
                await userEvent.click(getByTestId('update_dialog-action-button'));

                await waitForElementToBeRemoved(getByTestId('update_dialog-controlledVocabulary'));
                await waitForElementToBeRemoved(getByTestId('childControlledVocab-page-loading'));
                expect(getByTestId('admin-edit-button-453670')).toBeInTheDocument();
            });
            it('should close the opened dialog when page changes', async () => {
                const { getByTestId, getByRole, getByText } = setup();
                await waitForElementToBeRemoved(getByTestId('vocab-page-loading'));

                await userEvent.click(getByTestId('expand-row-453669'));
                await waitForElementToBeRemoved(getByTestId('childControlledVocab-page-loading'));

                await userEvent.click(getByTestId('admin-edit-button-453670'));

                expect(
                    within(getByTestId('portal-edit-453670')).getByTestId('update_dialog-controlledVocabulary'),
                ).toBeInTheDocument();

                expect(getByTestId('admin-edit-button-453671')).toBeDisabled();
                await userEvent.click(
                    getByRole('button', {
                        name: 'Go to next page',
                    }),
                );
                expect(getByText('11–20 of 165')).toBeInTheDocument();
                expect(getByTestId('admin-edit-button-453680')).toBeEnabled();
            });
            it('should close the opened dialog when rows-per-page changes', async () => {
                const { getByTestId, getByRole, getByText } = setup();
                await waitForElementToBeRemoved(getByTestId('vocab-page-loading'));

                await userEvent.click(getByTestId('expand-row-453669'));
                await waitForElementToBeRemoved(getByTestId('childControlledVocab-page-loading'));

                await userEvent.click(getByTestId('admin-edit-button-453670'));

                expect(
                    within(getByTestId('portal-edit-453670')).getByTestId('update_dialog-controlledVocabulary'),
                ).toBeInTheDocument();

                expect(getByTestId('admin-edit-button-453671')).toBeDisabled();
                const rowsPerPageButton = getByRole('combobox');
                await userEvent.click(rowsPerPageButton);
                await userEvent.click(
                    getByRole('option', {
                        name: /20/,
                    }),
                );
                expect(getByText('1–20 of 165')).toBeInTheDocument();
                expect(getByTestId('admin-edit-button-453671')).toBeEnabled();
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
