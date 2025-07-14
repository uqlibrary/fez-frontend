import React from 'react';
import ChangeDisplayType from './ChangeDisplayType';
import publicationTypeListResearchReport from 'mock/data/records/publicationTypeListResearchReport';
import publicationTypeListAudio from 'mock/data/records/publicationTypeListAudio';
import { render, WithReduxStore, WithRouter, fireEvent, createEvent } from 'test-utils';

const mockRecord = {
    ...publicationTypeListResearchReport.data[0],
    fez_record_search_key_publisher: {
        rek_publisher: 'The University of Queensland',
    },
};

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn(() => ({ pid: mockRecord.rek_pid })),
}));

/* eslint-disable react/prop-types */
jest.mock('redux-form/immutable', () => ({
    Field: jest.fn(),
}));

const setup = (testProps = {}) => {
    const props = {
        resetSubType: jest.fn(),
        record: mockRecord,
        ...testProps,
    };

    return render(
        <WithReduxStore>
            <WithRouter>
                <ChangeDisplayType {...props} />
            </WithRouter>
        </WithReduxStore>,
    );
};

describe('ChangeDisplayType form', () => {
    const ReduxFormMock = require('redux-form/immutable');
    let onChangeFn;
    ReduxFormMock.Field.mockImplementation(
        ({ name, title, required, disabled, label, floatingLabelText, onChange }) => {
            onChangeFn = onChange;
            return (
                <field
                    is="mock"
                    name={name}
                    title={title}
                    required={required}
                    disabled={disabled}
                    label={label || floatingLabelText}
                />
            );
        },
    );

    it('should render empty form when no record supplied', () => {
        const { container } = setup({ record: null });
        expect(container).toMatchSnapshot();
    });

    it('should render loading message when record is loading', () => {
        const { getByText } = setup({
            loadingRecordToView: true,
            record: null,
        });

        expect(getByText('Loading work')).toBeInTheDocument();
    });

    it('should render citation', () => {
        const { getByTestId } = setup({
            record: {
                ...mockRecord,
                fez_record_search_key_doi: {
                    rek_doi: 'Testing',
                },
            },
        });

        expect(getByTestId('change-display-type-page-title')).toHaveTextContent(
            `Change display type from ${mockRecord.rek_display_type_lookup} - ${mockRecord.rek_subtype}`,
        );
    });

    it('should render form loaded with submit button disabled', () => {
        const { container } = setup({ record: mockRecord });
        expect(container).toMatchSnapshot();
        expect(container.getElementsByTagName('field').length).toEqual(1);
    });

    it('should render lightbox upon submit', () => {
        const { container } = setup({ submitSucceeded: true, newRecord: { rek_pid: 'UQ:12345' } });
        expect(container).toMatchSnapshot();
    });

    it('_handleDefaultSubmit()', () => {
        const { container } = setup({ record: mockRecord });
        const form = container.querySelector('form');
        const submitEvent = createEvent.submit(form);
        fireEvent(form, submitEvent);
        expect(submitEvent.defaultPrevented).toBe(true);
    });

    it('should display confirmation box after successful submission', () => {
        const { container } = setup({ saveUpdated: true, record: mockRecord });
        expect(container).toMatchSnapshot();
    });

    it('should clear subtype items on display type change', () => {
        const resetFn = jest.fn();
        setup({ record: mockRecord, resetSubType: resetFn });
        onChangeFn();
        expect(resetFn).toHaveBeenCalled();
    });
});

describe('Change Display Type form - redirections', () => {
    const { location } = window;

    beforeAll(() => {
        delete window.location;
        window.location = { assign: jest.fn(), reload: jest.fn() };
    });

    afterAll(() => {
        window.location = location;
    });

    it('should redirect to view page on form cancel', () => {
        const { location } = window;
        delete window.location;
        window.location = { assign: jest.fn(), reload: jest.fn() };

        const { getByRole } = setup({});
        fireEvent.click(getByRole('button', { name: 'Cancel' }));
        expect(window.location.assign).toBeCalledWith(`http://localhost/view/${mockRecord.rek_pid}`);

        window.location = location;
    });

    it('should fire the correct submit function on button click', () => {
        const mockRecord1 = { ...publicationTypeListAudio.data[0] };
        const testFn = jest.fn();
        const { getByRole } = setup({
            handleSubmit: testFn,
            disableSubmit: false,
            saveRequesting: false,
            record: mockRecord1,
        });
        // expect(getAllByRole('button').length).toEqual(2);
        fireEvent.click(getByRole('button', { name: 'Change display type' }));
        expect(testFn).toHaveBeenCalled();
    });

    it('should fire the correct cancel function on button click', () => {});
});
