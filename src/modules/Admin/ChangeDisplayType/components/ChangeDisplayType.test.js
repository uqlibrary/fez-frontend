import React from 'react';
import {
    render,
    WithRouter,
    WithReduxStore,
    expectApiRequestToMatchSnapshot,
    waitForText,
    turnOnJestPreviewOnTestFailure,
    waitToBeDisabled,
    waitToBeEnabled,
    selectDropDownOption,
    userEvent,
    screen,
    api,
} from 'test-utils';
import publicationTypeListResearchReport from 'mock/data/records/publicationTypeListResearchReport';
import ChangeDisplayType from './ChangeDisplayType';
import { locale } from 'locale';
import { pathConfig } from '../../../../config';

const mockParams = {};
const mockUseNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => mockParams,
    useNavigate: () => mockUseNavigate,
}));

function setup(props = {}) {
    return render(
        <WithReduxStore>
            <WithRouter>
                <ChangeDisplayType {...props} />
            </WithRouter>
        </WithReduxStore>,
    );
}

describe('ChangeDisplayType', () => {
    turnOnJestPreviewOnTestFailure();

    const pid = publicationTypeListResearchReport.data[0].rek_pid;
    mockParams.pid = pid;
    const mockRecord = {
        ...publicationTypeListResearchReport.data[0],
        fez_record_search_key_publisher: {
            rek_publisher: 'The University of Queensland',
        },
    };

    const assertFormInitialState = async () => {
        await waitToBeDisabled('change-display-type-submit');
    };

    const selectDisplayType = async option => selectDropDownOption('rek-display-type-select', option);
    const selectSubtype = async option => selectDropDownOption('rek-subtype-select', option);

    const submitForm = async () => {
        await userEvent.click(screen.getByTestId('change-display-type-submit'));
        await waitToBeDisabled('change-display-type-submit');
    };

    beforeEach(() => api.reset());
    afterEach(() => jest.resetAllMocks());

    describe('rendering', () => {
        it('should display loading page', async () => {
            setup();
            await waitForText(/loading/i);
        });

        it('should display work not found page', async () => {
            api.mock.records.get({ pid, status: 404 });
            setup();
            await waitForText(/Work not found/i);
        });
    });

    describe('form submission', () => {
        it('should correctly submit form and display success info for type without subtype', async () => {
            api.mock.records.get({ pid, data: mockRecord }).update({ pid });
            const { getByTestId } = setup();
            await assertFormInitialState();

            await selectDisplayType('Book');
            await selectDisplayType('Image');
            await submitForm();

            await waitForText(locale.components.changeDisplayType.successAlert.message);
            await waitToBeDisabled('change-display-type-submit');
            await userEvent.click(getByTestId('confirm-changeDisplayTypeDone'));
            expect(mockUseNavigate).toHaveBeenCalledWith(pathConfig.admin.edit(pid));
            expectApiRequestToMatchSnapshot('patch', api.url.records.update(pid));
        });

        it('should correctly submit form and display success info for type with subtype', async () => {
            api.mock.records.get({ pid, data: mockRecord }).update({ pid });
            setup();
            await assertFormInitialState();

            await selectDisplayType('Book');
            await selectSubtype('Research book (original research)');
            await submitForm();

            await waitForText(locale.components.changeDisplayType.successAlert.message);
            await waitToBeDisabled('change-display-type-submit');
            await userEvent.click(screen.getByTestId('cancel-changeDisplayTypeDone'));
            expect(mockUseNavigate).toHaveBeenCalledWith(pathConfig.records.view(pid));
            expectApiRequestToMatchSnapshot('patch', api.url.records.update(pid));
        });

        it('should submit form and display server error', async () => {
            api.mock.records.get({ pid, data: mockRecord }).fail.update({ pid });
            setup();
            await assertFormInitialState();

            await selectDisplayType('Image');
            await submitForm();

            await waitForText(/Error has occurred/i);
            await waitToBeEnabled('change-display-type-submit');
        });
    });
});
