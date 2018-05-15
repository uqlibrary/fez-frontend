import ThesisSubmission from './ThesisSubmission';
import Immutable from 'immutable';
import {default as formLocale} from 'locale/publicationForm';

function setup(testProps, isShallow = true) {
    const props = {
        formValues: testProps.initialValues ? Immutable.Map(testProps.initialValues) : Immutable.Map({}),
        submitting: testProps.submitting || false, // : PropTypes.bool
        submitSucceeded: testProps.submitSucceeded || false, // : PropTypes.bool
        invalid: testProps.invalid || false, // : PropTypes.bool
        pristine: testProps.pristine || false, // : PropTypes.bool
        isHdrThesis: testProps.isHdrThesis || false, // : PropTypes.bool
        fileAccessId: testProps.fileAccessId || 3, // PropTypes.number
        actions: {
            logout: jest.fn(),
            checkSession: jest.fn()
        },
        ...testProps,
    };

    return getElement(ThesisSubmission, props, isShallow);
}

describe('ThesisSubmission test', () => {
    it('should render sbs thesis submission form', () => {
        const wrapper = setup({isHdrThesis: false});
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('Field').length).toEqual(9);
        expect(wrapper.find('RaisedButton').length).toEqual(2);
    });

    it('should render hdr thesis submission form', () => {
        const wrapper = setup({isHdrThesis: true});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render hdr thesis submission acknowledgement', () => {
        const wrapper = setup({isHdrThesis: true, submitSucceeded: true});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render sbs thesis submission acknowledgement', () => {
        const wrapper = setup({isHdrThesis: false, submitSucceeded: true});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with all fields disabled', () => {
        const wrapper = setup({submitting: true});
        wrapper.find('Field').forEach(field => {
            expect(field.props().disabled).toEqual(true);
        })
    });

    it('should disable submit button if invalid form data before submit', () => {
        const wrapper = setup({disableSubmit: true});
        expect(wrapper.find('RaisedButton').length).toEqual(2);

        wrapper.find('RaisedButton').forEach(field => {
            if (field.props().label == formLocale.thesisSubmission.submit) {
                expect(field.props().disabled).toEqual(true);
            }
        })
    });

    it('should not disable submit button if form submit has failed', () => {
        const wrapper = setup({submitFailed: true});
        expect(wrapper.find('RaisedButton').length).toEqual(2);

        wrapper.find('RaisedButton').forEach(field => {
            if (field.props().label == formLocale.thesisSubmission.submit) {
                expect(field.props().disabled).toEqual(false);
            }
        })
    });

    it('should ask when redirecting from form with data (even if submit failed)', () => {
        const testMethod = jest.fn();
        const wrapper = setup({dirty: true, submitSucceeded: false});
        expect(wrapper.find('NavigationDialogBox').length).toEqual(1);
    });

    it('should not ask when redirecting from form with data after successful submit', () => {
        const testMethod = jest.fn();
        const wrapper = setup({dirty: true, submitSucceeded: true});
        expect(wrapper.find('NavigationDialogBox').length).toEqual(0);
    });

    it('should display successfull submission screen', () => {
        const testMethod = jest.fn();
        const wrapper = setup({});
        wrapper.setProps({ submitSucceeded: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should redirect to cancel page', () => {
        window.location.assign = jest.fn();
        const wrapper = setup({}).instance().cancelSubmit();
        expect(window.location.assign).toBeCalledWith(expect.stringContaining(formLocale.thesisSubmission.cancelLink));
    });

    it('should redirect to after submit page', () => {
        window.location.assign = jest.fn();
        const wrapper = setup({}).instance().afterSubmit();
        expect(window.location.assign).toBeCalledWith(expect.stringContaining(formLocale.thesisSubmission.afterSubmitLink));
    });

    it('should display confirmation box before submission', () => {
        const testMethod = jest.fn();
        const wrapper = setup({});
        wrapper.instance().depositConfirmationBox = {showConfirmation: testMethod};
        wrapper.instance().openDepositConfirmation();
        expect(testMethod).toHaveBeenCalled();
    });

    it('should check if session is expired before submission', async () => {
        const testCheckSession = jest.fn(() => Promise.reject());
        const wrapper = setup({actions: {checkSession: testCheckSession}});
        await wrapper.instance().deposit();
        expect(testCheckSession).toHaveBeenCalled();
    });
});
