import React from 'react';
import AddDataCollection, { licenseText } from './AddDataCollection';
import { render, WithReduxStore, WithRouter, fireEvent, waitFor, screen, preview } from 'test-utils';
import userEvent from '@testing-library/user-event';
import * as actions from 'actions';
// import { Field } from 'modules/SharedComponents/Toolbox/ReactHookForm';
import * as repository from 'repositories';
import { vocabsFieldResearch } from 'mock/data/vocabsFieldResearch.js';

const mockUseNavigate = jest.fn();
let mockDoiExist = false;
jest.mock('actions', () => ({
    ...jest.requireActual('actions'),
    doesDOIExist: jest.fn(doi => {
        if (mockDoiExist) {
            console.log('mock doi exist');
            return Promise.reject({ status: 422, message: 'validation.doi' });
        } else {
            return jest.requireActual('actions').doesDOIExist(doi);
        }
    }),
}));
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockUseNavigate,
}));

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
    beforeAll(() => {});
    afterAll(() => {
        // mockUseNavigate.mockClear();
    });
    it('should check doi error', async () => {
        const existingDoiValue = '10.1037/a0028240';
        mockApi
            .onGet(repository.routes.SEARCH_KEY_LOOKUP_API({}).apiUrl, {
                params: { rule: 'lookup', search_key: 'doi', lookup_value: existingDoiValue },
            })
            .reply(config => {
                console.log(
                    `Request2 made with method: ${config.method}, url: ${config.url}, params: ${JSON.stringify(
                        config.params,
                    )}`,
                );
                return [200, { total: 1 }];
            });

        mockApi.onAny().reply(config => {
            console.log(
                `Request made with method: ${config.method}, url: ${config.url}, params: ${JSON.stringify(
                    config.params,
                )}`,
            );
            return [200, {}];
        });

        // Re-import the component after resetting modules
        const { getByTestId } = setup();

        const doi = getByTestId('rek-doi-input');
        await userEvent.type(doi, 'Test');
        await userEvent.tab();
        expect(doi).toHaveValue('Test');
        await waitFor(() => expect(screen.getByText('DOI is not valid')).toBeInTheDocument());
        await userEvent.clear(doi);
        await userEvent.type(doi, existingDoiValue);
        await userEvent.tab();
        doi.blur();
        await waitFor(() => expect(screen.getByText('DOI is assigned to another work already')).toBeInTheDocument());
        // await new Promise(resolve => setTimeout(resolve, 2000));
        preview.debug();

        mockDoiExist = true;
        // actions.doesDOIExist = jest.fn().mockRejectedValue({ status: 422, message: 'validation.doi' });

        // jest.spyOn(actions, 'doesDOIExist').mockRejectedValue({ status: 422, message: 'validation.doi' });
        // await waitFor(() => expect(spy).toHaveBeenCalled());
        // actions.doesDOIExist.mockRejectedValue({ status: 422, message: 'validation.doi' });
        await userEvent.type(doi, existingDoiValue);
        await userEvent.tab();
        doi.blur();
        await waitFor(() => expect(screen.getByText('DOI is not valid')).toBeInTheDocument());
        // actions.doesDOIExist = jest.requireActual('actions').doesDOIExist;
    });

    it('should submit', async () => {
        mockDoiExist = false;
        mockApi.onGet('vocabularies?cvo_ids=451780').reply(config => {
            console.log(
                `Request2 made with method: ${config.method}, url: ${config.url}, params: ${JSON.stringify(
                    config.params,
                )}`,
            );
            return [200, vocabsFieldResearch];
        });
        mockApi.onAny().reply(config => {
            console.log(
                `Request made with method: ${config.method}, url: ${config.url}, params: ${JSON.stringify(
                    config.params,
                )}`,
            );
            return [200, {}];
        });

        const { getByTestId, queryByTestId, container } = setup();

        await userEvent.click(getByTestId('rek-copyright-input'));

        // Inputs
        const inputs = [
            ['rek-title-input', 'test'],
            ['rek-description-input', 'test'],
            ['rek-contributor-input', 'test'],
            ['rek-contact-details-email-input', 'test@t.au'],
            ['rek-date-day-input', '1'],
            ['rek-date-month-select', '1'],
            ['rek-date-year-input', '2000'],
            ['rek-author-input', 'test'],
            ['rek-author-role-input', 'test'],
            ['rek-project-name-input', 'test'],
            ['rek-project-description-input', 'test'],
        ];
        for (const [testId, value] of inputs) {
            await userEvent.click(screen.getByTestId(testId));
            await userEvent.type(screen.getByTestId(testId), value);
            await userEvent.tab();
        }
        expect(getByTestId('rek-title-input')).toHaveValue('test');

        // Selects
        const selects = [
            ['rek-date-month-select', 'November'],
            ['rek-access-conditions-select', 'Open Access'],
            ['rek-license-select', 'Permitted Re-use with Acknowledgement'],
        ];
        for (const [testId, value] of selects) {
            await userEvent.click(screen.getByTestId(testId));
            const selectedOption = await screen.findByText(value);
            await userEvent.click(selectedOption);
            await userEvent.tab();
        }

        // Type to get a list from the api, then choose one
        // Type element, type value, select value
        const selects2 = [
            ['rek-subject-input', 'a', '010101'],
            // ['rek-contributor-id-input', 'David', 'David Stevens'],
        ];
        for (const [testId, typeValue, selectValue] of selects2) {
            const input = screen.getByTestId(testId);
            await userEvent.type(input, typeValue);
            const option = await screen.findByText(selectValue);
            console.log('option=', option);
            console.log(container.innerHTML);
            preview.debug();
            await userEvent.click(option);
            await userEvent.tab();
        }
        await waitFor(() => expect(screen.queryByText('010101 Algebra and Number Theory')).toBeInTheDocument());

        // await userEvent.type(getByTestId('rek-description-input'), 'test');
        // await userEvent.tab();
        // await userEvent.type(getByTestId('rek-contributor-input'), 'test');
        // await userEvent.tab();

        // // Optionally, assert that the input now has the selected value
        // expect(input).toHaveValue('David Stevens');

        expect(getByTestId('submit-data-collection')).toBeEnabled();

        // await waitFor(() => expect(screen.getByText('010101 Algebra and Number Theory')).toBeInTheDocument());
    });
});
