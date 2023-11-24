import React from 'react';
import { rtlRender, waitForElementToBeRemoved, WithReduxStore, WithRouter, preview } from 'test-utils';
import JournalAdminContainer, { isSame } from './JournalAdminContainer';
import { journalDoaj } from 'mock/data';
import Immutable from 'immutable';
import * as redux from 'react-redux';

jest.mock('../submitHandler', () => ({
    onSubmit: jest.fn(),
}));
jest.mock('js-cookie', () => ({
    get: jest.fn(() => 'tabbed'),
    set: jest.fn(),
}));
jest.mock('redux-form/immutable', () => ({
    Field: jest.fn(),
    destroy: jest.fn(),
}));
const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
}));

function setup(testProps = {}, renderer = rtlRender) {
    const props = {
        authorDetails: {
            username: 'uqstaff',
        },
        match: {
            params: {
                id: 12,
            },
        },
        loadJournalToView: jest.fn(),
        journalToView: journalDoaj.data,
        location: {
            search: '',
        },
        handleSubmit: jest.fn(),
        clearJournalToView: jest.fn(),
        ...testProps,
    };

    return renderer(
        <WithReduxStore>
            <WithRouter>
                <JournalAdminContainer {...props} />
            </WithRouter>
            ,
        </WithReduxStore>,
    );
}

describe('JournalAdminContainer component', () => {
    const ReduxFormMock = require('redux-form/immutable');
    let transformIssnFn;
    let normalizeIssnFn;
    ReduxFormMock.Field.mockImplementation(
        ({ name, title, required, disabled, label, floatingLabelText, inputNormalizer, transformFunction }) => {
            if (name === 'fez_record_search_key_issn') {
                normalizeIssnFn = inputNormalizer;
                transformIssnFn = transformFunction;
            }

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

    it('should render default view', async () => {
        const { getByText } = setup();
        preview.debug();

        expect(getByText('Edit journal - Advanced Nonlinear Studies')).toBeInTheDocument();
    });
    it('should render mobile view', () => {
        useIsMobileView.mockImplementation(() => true);
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });
    it('should render loading record view', () => {
        const wrapper = setup({
            journalToView: true,
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
    it('should render record not found view', () => {
        const wrapper = setup({
            recordToView: null,
            journalToView: false,
            isDeleted: true,
            recordToViewError: { message: 'test', status: 404 },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
    it('should render component with tabbed interface', () => {
        const wrapper = setup({
            journalToView: false,
            recordToView: null,
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
    it('should render empty div if record is not loaded', () => {
        const wrapper = setup({
            journalToView: false,
            recordToView: null,
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
    it('should render when form errors are present as immutable map', () => {
        const wrapper = setup({
            formErrors: Immutable.Map({
                bibliographicSection: {
                    rek_date: 'Publication date is required',
                    rek_title: 'Title is required',
                },
            }),
        });
        expect(wrapper.find('Memo(AdminInterface)').props().tabs.bibliographic.numberOfErrors).toBe(2);
    });
    it('should render with an empty record', () => {
        const wrapper = setup({
            journalToView: false,
            recordToView: {
                ...journalDoaj,
                rek_object_type_lookup: null,
            },
            match: {
                params: {
                    pid: 'UQ:123456',
                },
            },
        });
        expect(wrapper.find('Memo(AdminInterface)').props().tabs.identifiers.activated).toBe(false);
    });
    it('should show Add form', () => {
        const wrapper = setup({
            createMode: true,
            match: {
                params: {},
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
    it('should render memoized component with styles', () => {
        const wrapper = getElement(
            MemoizedJournalAdminContainer,
            {
                authorDetails: {
                    username: 'uqstaff',
                },
                match: {
                    params: {
                        pid: 'UQ:111111',
                    },
                },
                actions: {
                    loadJournalToView: jest.fn(),
                },
                journalToView: false,
                recordToView: journalDoaj,
                location: {
                    search: '',
                },
                handleSubmit: jest.fn(),
            },
            { isShallow: false },
        );
        expect(toJson(wrapper)).toMatchSnapshot();
    });
    it('should not render non-security errors for community editing', () => {
        const wrapper = setup({
            recordToView: {
                rek_pid: 'UQ:367646',
                rek_title: 'View across Windsor Castle',
                rek_description: 'Henry William Mobsby was born on 17 August 1860',
                rek_display_type: 11,
                rek_display_type_lookup: 'Community',
            },
            formErrors: Immutable.Map({
                bibliographicSection: {
                    rek_date: 'Publication date is required',
                    rek_title: 'Title is required',
                },
                securitySection: {
                    rek_security_policy: 'Policy is required',
                },
            }),
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
    describe('isSame callback function', () => {
        it('should return true if props are not changed', () => {
            expect(
                isSame(
                    { disableSubmit: false, recordToView: { pid: 1 }, loadJournalToView: false },
                    { disableSubmit: false, recordToView: { pid: 1 }, loadJournalToView: false },
                ),
            ).toBeTruthy();
        });
        it('should return true if props are not changed', () => {
            expect(
                isSame(
                    { disableSubmit: false, loadJournalToView: false },
                    { disableSubmit: false, loadJournalToView: false },
                ),
            ).toBeTruthy();
        });
    });
    describe('React hooks', () => {
        it('should call clearRecordToView() prop on unload', () => {
            const mockUseEffect = jest.spyOn(React, 'useEffect');
            const mockUseCallback = jest.spyOn(React, 'useCallback');
            const cleanupFns = [];
            mockUseEffect.mockImplementation(f => {
                const hookReturn = f();
                if (typeof hookReturn === 'function') {
                    cleanupFns.push(hookReturn);
                }
            });
            // mock once each for each instance of useCallback
            mockUseCallback.mockImplementationOnce(f => f()).mockImplementationOnce(f => f());
            const clearRecordToView = jest.fn();
            setup({
                clearRecordToView,
            });
            while (cleanupFns.length > 0) {
                cleanupFns.pop()();
            }
            mockUseEffect.mockRestore();
            mockUseCallback.mockRestore();
            expect(clearRecordToView).toHaveBeenCalled();
        });
    });
});
