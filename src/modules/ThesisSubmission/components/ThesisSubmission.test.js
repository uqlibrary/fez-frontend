import React from 'react';
import ThesisSubmission, { afterSubmit, cancelSubmit, getFormSubmitAlertProps } from './ThesisSubmission';
import Immutable from 'immutable';
import { default as formLocale } from 'locale/publicationForm';
import { THESIS_UPLOAD_RETRIES } from 'config/general';

function setup(testProps, isShallow = true) {
    const props = {
        anyTouched: true,
        asyncValidate: jest.fn(),
        asyncValidating: false,
        autofill: jest.fn(),
        blur: jest.fn(),
        change: jest.fn(),
        clearAsyncError: jest.fn(),
        clearFields: jest.fn(),
        clearSubmit: jest.fn(),
        clearSubmitErrors: jest.fn(),
        destroy: jest.fn(),
        dirty: true,
        dispatch: jest.fn(),
        form: 'form',
        handleSubmit: jest.fn(),
        initialize: jest.fn(),
        initialized: false,
        isSessionValid: true,
        pure: true,
        reset: jest.fn(),
        resetSection: jest.fn(),
        submit: jest.fn(),
        submitFailed: false,
        touch: jest.fn(),
        untouch: jest.fn(),
        valid: true,
        // common immutable props above
        actions: {
            logout: jest.fn(),
            checkSession: jest.fn(),
            clearSessionExpiredFlag: jest.fn(),
        },
        fileAccessId: testProps.fileAccessId || 3, // PropTypes.number
        formValues: testProps.initialValues ? Immutable.Map(testProps.initialValues) : Immutable.Map({}),
        invalid: testProps.invalid || false, // : PropTypes.bool
        isHdrThesis: testProps.isHdrThesis || false, // : PropTypes.bool
        pristine: testProps.pristine || false, // : PropTypes.bool
        submitAsSideEffect: false,
        submitSucceeded: testProps.submitSucceeded || false, // : PropTypes.bool
        submitting: testProps.submitting || false, // : PropTypes.bool
        ...testProps,
    };

    return getElement(ThesisSubmission, props, isShallow);
}

describe('ThesisSubmission', () => {
    let mockUseEffect;
    let mockUseCallback;
    let mockUseRef;

    beforeEach(() => {
        mockUseEffect = jest.spyOn(React, 'useEffect');
        mockUseEffect.mockImplementation(f => f());

        mockUseRef = jest.spyOn(React, 'useRef');
        mockUseRef.mockImplementation(() => ({ current: { showConfirmation: jest.fn() } }));

        mockUseCallback = jest.spyOn(React, 'useCallback');
        mockUseCallback.mockImplementationOnce(f => f);
    });

    afterEach(() => {
        mockUseEffect.mockRestore();
        mockUseCallback.mockRestore();
    });

    it('should render sbs thesis submission form', () => {
        const wrapper = setup({ isHdrThesis: false });
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('Field').length).toEqual(9);
        expect(wrapper.find('WithStyles(ForwardRef(Button))').length).toEqual(2);
    });

    it('should render hdr thesis submission form', () => {
        const wrapper = setup({ isHdrThesis: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should redirect on alert click', () => {
        const location = window.location;
        delete window.location;
        window.location = { assign: jest.fn() };

        const wrapper = setup({ isHdrThesis: true });
        wrapper
            .find('[alertId="alert-warning-rdm-redirect"]')
            .props()
            .action();
        expect(window.location.assign).toBeCalledWith(formLocale.thesis.information.alertButtonTarget);

        window.location = location;
    });

    it('should render hdr thesis submission acknowledgement', () => {
        const wrapper = setup({ isHdrThesis: true, submitSucceeded: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render sbs thesis submission acknowledgement', () => {
        const wrapper = setup({ isHdrThesis: false, submitSucceeded: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with all fields disabled', () => {
        const wrapper = setup({ submitting: true });
        wrapper.find('Field').forEach(field => {
            expect(field.props().disabled).toEqual(true);
        });
    });

    it('should disable submit button if invalid form data before submit', () => {
        const wrapper = setup({ disableSubmit: true });
        const submitButton = wrapper.find('#submit-thesis');
        expect(submitButton.props().disabled).toEqual(true);
    });

    it('should not disable submit button if form submit has failed', () => {
        const wrapper = setup({ error: true });
        const submitButton = wrapper.find('#submit-thesis');
        expect(submitButton.props().disabled).toBeFalsy();
    });

    it('should ask when redirecting from form with data (even if submit failed)', () => {
        const wrapper = setup({ dirty: true, submitSucceeded: false });
        expect(wrapper.find('NavigationDialogBox').length).toEqual(1);
    });

    it('should not ask when redirecting from form with data after successful submit', () => {
        const wrapper = setup({ dirty: true, submitSucceeded: true });
        expect(wrapper.find('NavigationDialogBox').length).toEqual(0);
    });

    it('should display successfull submission screen', () => {
        const wrapper = setup({});
        wrapper.setProps({ submitSucceeded: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    const initialFormValues = {
        currentAuthor: [{ nameAsPublished: 'HDR Student, N', authorId: 44444 }],
        fez_record_search_key_ismemberof: [{ rek_ismemberof: 'UQ:152694' }],
        supervisors: [
            {
                nameAsPublished: 'First Last',
                creatorRole: '',
                uqIdentifier: '',
                orgaff: '',
                orgtype: '',
                affiliation: '',
                uqUsername: '',
                disabled: false,
                selected: false,
                authorId: null,
                required: false,
                aut_title: '',
            },
        ],
        fieldOfResearch: [{ rek_value: { key: 451844, value: '0199 Other Mathematical Sciences' }, rek_order: 1 }],
        thesisTitle: { htmlText: '<p>Test title</p>', plainText: 'Test title' },
        thesisAbstract: { htmlText: '<p>Test Abstract</p>', plainText: 'Test Abstract' },
        fez_record_search_key_org_name: { rek_org_name: 'The University of Queensland' },
        rek_object_type: 3,
        rek_date: '2020-8-4',
        fez_record_search_key_keywords: [
            { rek_keywords: 'keyword1', rek_keywords_order: 1 },
            { rek_keywords: 'keyword2', rek_keywords_order: 2 },
        ],
        files: {
            queue: [{ fileData: {}, name: 'test.jpg', size: 7000, access_condition_id: 3 }],
            isValid: true,
        },
        rek_status: 3,
        fileAccessId: 3,
        rek_genre_type: 'PhD Thesis',
        rek_display_type: 187,
        fez_record_search_key_org_unit_name: { rek_org_unit_name: 'School of Medicine' },
    };

    it('should display confirmation box before submission', () => {
        const wrapper = setup({
            initialValues: Immutable.Map(initialFormValues),
        });
        wrapper.find('#submit-thesis').simulate('click');
        expect(toJson(wrapper.find('[confirmDialogBoxId="thesis"]'))).toMatchSnapshot();
    });

    // it('should display confirmation box before submission', () => {
    //     const testMethod = jest.fn();
    //     const wrapper = setup({});
    //     wrapper.instance().depositConfirmationBox = { showConfirmation: testMethod };
    //     wrapper.instance().openDepositConfirmation();
    //     expect(testMethod).toHaveBeenCalled();
    // });

    // it('should trigger openDepositConfirmation() when conditions are met', () => {
    //     const wrapper = setup({});
    //     wrapper.instance().openDepositConfirmation = jest.fn();
    //     wrapper.instance().UNSAFE_componentWillReceiveProps({
    //         isSessionValid: true,
    //         submitting: false,
    //     });
    //     expect(wrapper.instance().openDepositConfirmation).toBeCalled();
    // });

    // it('should invoke callback for session check', () => {
    //     const wrapper = setup({});
    //     wrapper.instance().deposit();
    //     expect(wrapper.instance().props.actions.checkSession).toBeCalled();
    // });

    // it('should set depositConfirmationBox properly', () => {
    //     const wrapper = setup({});
    //     wrapper.instance().depositConfirmationBox = null;
    //     const test = 'test setDepositConfirmation';
    //     wrapper.instance().setDepositConfirmation(test);
    //     expect(wrapper.instance().depositConfirmationBox).toEqual(test);
    // });

    it('should show the file upload failure alert', () => {
        const wrapper = setup({
            author: { aut_fname: 'First', aut_lname: 'Last', aut_org_student_id: '1234567' },
            newRecordFileUploadingOrIssueError: true,
            submitSucceeded: true,
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should show file upload retry failure alert', () => {
        const mockUseState = jest.spyOn(React, 'useState');
        mockUseState.mockImplementation(() => [THESIS_UPLOAD_RETRIES, jest.fn()]);
        const wrapper = setup({
            author: { aut_fname: 'First', aut_lname: 'Last', aut_org_student_id: '1234567' },
            newRecordFileUploadingOrIssueError: true,
            submitSucceeded: true,
        });
        expect(wrapper.find('Alert').props().message).toMatchSnapshot();
    });

    it('should show file upload retry success alert', () => {
        const mockUseState = jest.spyOn(React, 'useState');
        mockUseState.mockImplementation(() => [1, jest.fn()]);
        const wrapper = setup({
            author: { aut_fname: 'First', aut_lname: 'Last', aut_org_student_id: '1234567' },
            newRecordFileUploadingOrIssueError: false,
            submitSucceeded: true,
        });
        expect(wrapper.find('Alert').props().message).toBe('File upload retry succeeded.');
    });

    it('should have a helper to generate alert props', () => {
        expect(getFormSubmitAlertProps({ error: true })).toMatchSnapshot();
    });
});

describe('ThesisSubmission form - redirections', () => {
    const { location } = window;

    beforeAll(() => {
        delete window.location;
        window.location = { assign: jest.fn(), reload: jest.fn() };
    });

    afterEach(() => {
        window.location.assign.mockClear();
        window.location.reload.mockClear();
    });

    afterAll(() => {
        window.location = location;
    });

    it('should redirect to cancel page', () => {
        cancelSubmit();
        expect(window.location.assign).toBeCalledWith(expect.stringContaining(formLocale.thesisSubmission.cancelLink));
    });

    it('should redirect to after submit page', () => {
        afterSubmit();
        expect(window.location.assign).toBeCalledWith(
            expect.stringContaining(formLocale.thesisSubmission.afterSubmitLink),
        );
    });
});
