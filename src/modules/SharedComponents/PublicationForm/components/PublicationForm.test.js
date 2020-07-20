import PublicationForm from './PublicationForm';
import Immutable from 'immutable';
import { JournalArticleForm, BookForm, GenericDocumentForm, ResearchReportForm } from './Forms';
import { validation } from 'config';
import { routes } from 'config';

function setup(testProps = {}) {
    const props = {
        autofill: jest.fn(),
        blur: jest.fn(),
        change: jest.fn(),
        clearAsyncError: jest.fn(),
        anyTouched: true,
        asyncValidating: false,
        asyncValidate: jest.fn(),
        clearFields: jest.fn(),
        clearSubmitErrors: jest.fn(),
        destroy: jest.fn(),
        dispatch: jest.fn(),
        handleSubmit: jest.fn(),
        initialize: jest.fn(),
        reset: jest.fn(),
        resetSection: jest.fn(),
        touch: jest.fn(),
        submit: jest.fn(),
        untouch: jest.fn(),
        clearSubmit: jest.fn(),
        dirty: true,
        form: 'form',
        initialized: false,
        invalid: false,
        submitFailed: false,
        submitSucceeded: false,
        valid: true,
        pure: true,
        submitAsSideEffect: false,
        // above are common immutable default props
        formValues: testProps.initialValues ? Immutable.Map(testProps.initialValues) : Immutable.Map({}),
        onFormCancel: testProps.onFormCancel || jest.fn(),
        onFormSubmitSuccess: testProps.onFormSubmitSuccess || jest.fn(),
        submitting: testProps.submitting || false,
        pristine: testProps.pristine || false,
        author: testProps.author || null,
        actions: testProps.actions || {},
        history: testProps.history || {
            push: jest.fn(),
        },
        ...testProps,
    };
    return getElement(PublicationForm, props);
}

describe('Component PublicationForm', () => {
    it('should render component initialised with just one field - publication type', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('Field').length).toEqual(1);
    });

    it('should render component initialised with two fields - publication type and subtype', () => {
        const wrapper = setup({
            initialValues: {
                rek_display_type: 179,
            },
            hasSubtypes: false,
        });

        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('Field').length).toEqual(1);
    });

    it('should render form after selecting both publication type and subtype (Journal article/Editorial)', () => {
        const wrapper = setup({
            initialValues: {
                rek_display_type: 179,
                rek_subtype: 'Editorial',
            },
            hasSubtypes: true,
            subtypeVocabId: 453573,
        });

        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('Field').length).toEqual(2);
    });

    it('should render component with JournalArticleForm', () => {
        const wrapper = setup({
            initialValues: {
                rek_display_type: 179,
            },
            hasSubtypes: true,
            subtypeVocabId: 453573,
            formComponent: JournalArticleForm,
        });
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('JournalArticleForm').length).toEqual(1);

        let hasFilesComponent = false;
        wrapper.find('Field').forEach(field => {
            hasFilesComponent = hasFilesComponent || field.props().name === 'files';
        });
        expect(hasFilesComponent).toEqual(true);
    });

    it('should render component with BookForm', () => {
        const wrapper = setup({
            initialValues: {
                rek_display_type: 174,
            },
            hasSubtypes: true,
            subtypeVocabId: 1111,
            formComponent: BookForm,
        });
        expect(wrapper.find('BookForm').length).toEqual(1);

        let hasFilesComponent = false;
        wrapper.find('Field').forEach(field => {
            hasFilesComponent = hasFilesComponent || field.props().name === 'files';
        });
        expect(hasFilesComponent).toEqual(true);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with GenericDocument', () => {
        const wrapper = setup({
            initialValues: {
                rek_display_type: 202,
            },
            hasSubtypes: true,
            subtypeVocabId: 2222,
            formComponent: GenericDocumentForm,
        });
        expect(wrapper.find('GenericDocumentForm').length).toEqual(1);

        let hasFilesComponent = false;
        wrapper.find('Field').forEach(field => {
            hasFilesComponent = hasFilesComponent || field.props().name === 'files';
        });
        expect(hasFilesComponent).toEqual(true);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with ResearchReportForm', () => {
        const wrapper = setup({
            initialValues: {
                rek_display_type: 275,
            },
            hasSubtypes: true,
            subtypeVocabId: 1111,
            formComponent: ResearchReportForm,
        });
        expect(wrapper.find('ResearchReportForm').length).toEqual(1);

        let hasFilesComponent = false;
        wrapper.find('Field').forEach(field => {
            hasFilesComponent = hasFilesComponent || field.props().name === 'files';
        });
        expect(hasFilesComponent).toEqual(true);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with all fields disabled', () => {
        const wrapper = setup({
            submitting: true,
        });
        wrapper.find('Field').forEach(field => {
            expect(field.props().disabled).toEqual(true);
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should call onFormSubmitSuccess method', () => {
        const testMethod = jest.fn();
        const wrapper = setup({
            onFormSubmitSuccess: testMethod,
        });
        wrapper.setProps({
            submitSucceeded: true,
        });
        expect(testMethod).toHaveBeenCalled();
    });

    it('_handleDefaultSubmit', () => {
        const event = { preventDefault: jest.fn() };
        const wrapper = setup({ initialValues: {} });
        wrapper.instance()._handleDefaultSubmit(event);
        expect(event.preventDefault).toHaveBeenCalled();
    });

    it('Shows an alert', () => {
        const wrapper = setup({
            initialValues: {},
            formComponent: null,
            changeFormType: jest.fn(),
            error: 'There is an error',
            formErrors: ['error'],
        });
        // export const getErrorAlertProps = ({
        //     dirty = false,
        //     submitting = false,
        //     error,
        //     formErrors,
        //     submitSucceeded = false,
        //     alertLocale = {},
        // }) => {};
        expect(toJson(wrapper)).toMatchSnapshot();
        wrapper.setProps({ formComponent: () => 'test' });
        expect(toJson(wrapper)).toMatchSnapshot();
        wrapper.setProps({ submitSucceeded: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should call UNSAFE_componentWillReceiveProps when props change', () => {
        const changeDisplayType = jest.fn();
        const changeFormType = jest.fn();
        const wrapper = setup({
            initialValues: {},
            changeDisplayType: changeDisplayType,
            changeFormType: changeFormType,
        });
        // eslint-disable-next-line camelcase
        const UNSAFE_componentWillReceiveProps = jest.spyOn(wrapper.instance(), 'UNSAFE_componentWillReceiveProps');
        wrapper.setProps({
            submitSucceeded: true,
            hasSubtypes: false,
            subtypes: null,
            formComponent: null,
            isNtro: false,
            hasDefaultDocTypeSubType: false,
            docTypeSubTypeCombo: null,
        });
        expect(UNSAFE_componentWillReceiveProps).toHaveBeenCalled();
        // Testing conditional paths
        expect(toJson(wrapper)).toMatchSnapshot();
        wrapper.setProps({
            submitSucceeded: true,
            hasSubtypes: true,
            subtypes: null,
            formComponent: null,
            isNtro: false,
            hasDefaultDocTypeSubType: false,
            docTypeSubTypeCombo: null,
        });
        expect(UNSAFE_componentWillReceiveProps).toHaveBeenCalled();
        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.setProps({
            submitSucceeded: true,
            hasSubtypes: true,
            subtypes: ['test', 'test2'],
            formComponent: null,
            isNtro: false,
            hasDefaultDocTypeSubType: false,
            docTypeSubTypeCombo: null,
        });
        expect(UNSAFE_componentWillReceiveProps).toHaveBeenCalled();
        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.setProps({
            submitSucceeded: true,
            hasSubtypes: true,
            subtypes: ['test', 'test2'],
            formComponent: null,
            isNtro: true,
            hasDefaultDocTypeSubType: true,
            docTypeSubTypeCombo: null,
        });
        expect(UNSAFE_componentWillReceiveProps).toHaveBeenCalled();
        expect(changeDisplayType).toHaveBeenCalled();
        expect(changeFormType).toHaveBeenCalled();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should require file upload for ntro fields', () => {
        const wrapper = setup({
            formComponent: JournalArticleForm,
            isNtro: true,
        });
        expect(wrapper.find({ name: 'files' }).props().validate).toEqual([
            validation.fileUploadRequired,
            validation.validFileUpload,
        ]);
    });

    it('should render component with HDR Thesis', () => {
        const wrapper = setup({
            initialValues: {
                rek_display_type: 187,
            },
            isHdrStudent: true,
            hasSubtypes: true,
            subtypeVocabId: 2222,
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should redirect to Thesis submission page for HDR student', () => {
        const pushFn = jest.fn();
        const wrapper = setup({
            history: {
                push: pushFn,
            },
        });

        wrapper.instance()._visitHdrSubmissionPage();

        expect(pushFn).toHaveBeenCalledWith(routes.pathConfig.hdrSubmission);
    });
});
