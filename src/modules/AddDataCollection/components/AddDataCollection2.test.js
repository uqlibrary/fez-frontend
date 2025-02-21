import React from 'react';
import AddDataCollection from './AddDataCollection';
import { render, WithReduxStore, WithRouter, waitFor, screen } from 'test-utils';
import userEvent from '@testing-library/user-event';
import * as repository from 'repositories';
import { vocabsFieldResearch } from 'mock/data/vocabsFieldResearch.js';

let mockDoiExist = false;
jest.mock('actions', () => ({
    ...jest.requireActual('actions'),
    doesDOIExist: jest.fn(doi => {
        if (mockDoiExist) {
            return Promise.reject({ status: 422, message: 'validation.doi' });
        } else {
            return jest.requireActual('actions').doesDOIExist(doi);
        }
    }),
}));
async function inputText(getByTestId, settings) {
    for (const [testId, value] of settings) {
        const input = getByTestId(testId);
        await userEvent.click(input);
        await userEvent.type(input, value);
        await userEvent.tab();
        console.log('expect', testId, value);
        expect(input).toHaveValue(value);
        console.log('expect done', testId, value);
    }
}

// click the select, find the option, click the option, tab out
async function clickSelect(getByTestId, selects) {
    for (const [testId, value] of selects) {
        await userEvent.click(getByTestId(testId));
        const selectedOption = await screen.findByText(value);
        await userEvent.click(selectedOption);
        await userEvent.tab();
    }
}

// click the select, type value, find the option, click the option, tab out
async function inputAndSelect(getByTestId, selects) {
    for (const [testId, typeValue, selectValue] of selects) {
        const input = getByTestId(testId);
        await userEvent.click(input);
        await userEvent.type(input, typeValue);
        const option = await screen.findByText(selectValue);
        await userEvent.click(option);
        await userEvent.tab();
    }
}

async function inputRequired(getByTestId) {
    await userEvent.click(getByTestId('rek-copyright-input'));

    await inputText(getByTestId, [
        ['rek-title-input', 'test'],
        ['rek-description-input', 'test'],
        ['rek-contributor-input', 'test'],
        ['rek-contact-details-email-input', 'test@t.au'],
        ['rek-date-day-input', '1'],
        ['rek-date-year-input', '2000'],
        ['rek-author-input', 'test'],
        ['rek-project-name-input', 'test'],
        ['rek-project-description-input', 'test'],
    ]);
    expect(getByTestId('rek-date-year-input')).toHaveValue('2000');

    // Selects
    await clickSelect(getByTestId, [
        ['rek-date-month-select', 'November'],
        ['rek-access-conditions-select', 'Open Access'],
        ['rek-license-select', 'Permitted Re-use with Acknowledgement'],
    ]);

    // Type to get a list from the api, then choose one
    // Type element, type value, select value
    await inputAndSelect(getByTestId, [
        // Field of Research
        ['rek-subject-input', '010101', /010101/i],
        // Contact Name ID
        ['rek-contributor-id-input', 'David Johnsen', 'David Johnsen'],
        // Creator Role
        ['rek-author-role-input', 'a', /Project Lead/i],
    ]);
}

function setup(testProps = {}, renderMethod = render) {
    const props = {
        resetForm: testProps.resetForm || jest.fn(),
        ...testProps,
    };

    return renderMethod(
        <WithReduxStore>
            <WithRouter>
                <AddDataCollection {...props} />
            </WithRouter>
        </WithReduxStore>,
    );
}

describe('AddDataCollection test', () => {
    const gSubmitTimeout = 180000; // 3 minutes
    afterEach(() => {
        mockApi.reset();
    });
    it('should check doi error', async () => {
        const { getByTestId } = setup();

        const doi = getByTestId('rek-doi-input');
        await userEvent.type(doi, 'Test');
        await userEvent.tab();
        expect(doi).toHaveValue('Test');
        await waitFor(() => expect(screen.getByText('DOI is not valid')).toBeInTheDocument());
    });

    it(
        'should submit',
        async () => {
            jest.setTimeout(gSubmitTimeout);
            mockDoiExist = false;
            // Field of Research lookup
            mockApi.onGet('vocabularies?cvo_ids=451780').reply(() => {
                return [200, vocabsFieldResearch];
            });
            // Contact Name ID lookup
            mockApi.onGet('fez-authors/search').reply(() => {
                return [
                    200,
                    {
                        total: 1,
                        data: [
                            {
                                id: 46980,
                                value: 'David Johnsen',
                                aut_id: 46980,
                                aut_fname: 'David',
                                aut_lname: 'Johnsen',
                                aut_display_name: 'David Johnsen',
                            },
                        ],
                    },
                ];
            });
            mockApi.onPost('records').reply(() => {
                return [
                    200,
                    {
                        data: {},
                    },
                ];
            });
            mockApi.onAny().reply(config => {
                console.log(
                    `Request made with method: ${config.method}, url: ${config.url}, params: ${JSON.stringify(
                        config.params,
                    )}`,
                );
                return [200, {}];
            });

            const { getByTestId, queryByText, queryAllByText } = setup();

            await inputRequired(getByTestId);

            // input collection start date
            await inputText(getByTestId, [
                ['rek-start-date-day-input', '1'],
                ['rek-start-date-year-input', '2000'],
            ]);
            await clickSelect(getByTestId, [['rek-start-date-month-select', 'March']]);

            // input collection end date
            await inputText(getByTestId, [
                ['rek-end-date-day-input', '1'],
                ['rek-end-date-year-input', '2000'],
            ]);
            await clickSelect(getByTestId, [['rek-end-date-month-select', 'February']]);

            await waitFor(() => expect(queryAllByText('Date range is not valid').length).toBeGreaterThan(0));

            await clickSelect(getByTestId, [['rek-end-date-month-select', 'April']]);
            await waitFor(() => expect(queryByText('Date range is not valid')).not.toBeInTheDocument());

            expect(getByTestId('submit-data-collection')).toBeEnabled();
            await userEvent.click(getByTestId('submit-data-collection'));

            await waitFor(() => expect(screen.getByText(/ADD ANOTHER/i)).toBeInTheDocument());
        },
        gSubmitTimeout,
    );

    it(
        'should submit error',
        async () => {
            mockDoiExist = false;
            // Field of Research lookup
            mockApi.onGet('vocabularies?cvo_ids=451780').reply(() => {
                return [200, vocabsFieldResearch];
            });
            // Contact Name ID lookup
            mockApi.onGet('fez-authors/search').reply(() => {
                return [
                    200,
                    {
                        total: 1,
                        data: [
                            {
                                id: 46980,
                                value: 'David Johnsen',
                                aut_id: 46980,
                                aut_fname: 'David',
                                aut_lname: 'Johnsen',
                                aut_display_name: 'David Johnsen',
                            },
                        ],
                    },
                ];
            });
            mockApi.onPost('records').reply(() => {
                return [
                    422,
                    {
                        error: { message: 'wrong!' },
                    },
                ];
            });
            mockApi.onAny().reply(config => {
                console.log(
                    `Request made with method: ${config.method}, url: ${config.url}, params: ${JSON.stringify(
                        config.params,
                    )}`,
                );
                return [200, {}];
            });

            const { getByTestId } = setup();

            await inputRequired(getByTestId);

            expect(getByTestId('submit-data-collection')).toBeEnabled();

            await userEvent.click(getByTestId('submit-data-collection'));

            await waitFor(() => expect(getByTestId('api-error-alert')).toBeInTheDocument());
        },
        gSubmitTimeout,
    );

    it(
        'should submit check doi existing',
        async () => {
            const existingDoiValue = '10.1037/a0028240';
            const notExistingDoiValue = '10.1037/a002824';

            mockApi.onGet(repository.routes.SEARCH_KEY_LOOKUP_API({}).apiUrl).reply(config => {
                const { lookup_value: lookupValue } = config.params;
                return [200, { total: lookupValue === existingDoiValue ? 1 : 0 }];
            });

            mockApi.onGet('vocabularies?cvo_ids=451780').reply(200, vocabsFieldResearch);

            mockApi.onGet('fez-authors/search').reply(200, {
                total: 1,
                data: [
                    {
                        id: 46980,
                        value: 'David Johnsen',
                        aut_id: 46980,
                        aut_fname: 'David',
                        aut_lname: 'Johnsen',
                        aut_display_name: 'David Johnsen',
                    },
                ],
            });

            mockApi.onPost('records').reply(422, { error: { message: 'wrong!' } });

            mockApi.onAny().reply(200, {});

            const { getByTestId, queryByText } = setup();
            await inputRequired(getByTestId);

            const doiInput = getByTestId('rek-doi-input');
            const submitButton = getByTestId('submit-data-collection');

            const typeAndSubmit = async (value, expectedError) => {
                await userEvent.clear(doiInput);
                await userEvent.type(doiInput, value);
                await userEvent.tab();

                expect(submitButton).toBeEnabled();
                await userEvent.click(submitButton);

                if (expectedError) {
                    await waitFor(() => expect(queryByText(expectedError)).toBeInTheDocument());
                } else {
                    await waitFor(() =>
                        expect(queryByText('DOI is assigned to another work already')).not.toBeInTheDocument(),
                    );
                }
            };

            await typeAndSubmit('Test', 'DOI is not valid');
            await typeAndSubmit(existingDoiValue, 'DOI is assigned to another work already');
            await typeAndSubmit(notExistingDoiValue, null);

            mockDoiExist = true;
            await typeAndSubmit(existingDoiValue, 'DOI is not valid');
        },
        gSubmitTimeout,
    );
});
