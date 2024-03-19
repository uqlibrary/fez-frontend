import PublicationForm from './PublicationForm';
import Immutable from 'immutable';
import { JournalArticleForm, BookForm, GenericDocumentForm, ResearchReportForm, CreativeWorkForm } from './Forms';
import React from 'react';
import { render, WithReduxStore, WithRouter } from 'test-utils';

/* eslint-disable react/prop-types */
jest.mock('redux-form/immutable', () => ({
    Field: props => {
        return (
            <field
                is="mock"
                name={props.name}
                title={props.title}
                required={props.required}
                disabled={props.disabled}
                label={props.label || props.floatingLabelText}
                hasError={props.hasError}
                validate={props.validate && props.validate.map(fn => fn.name)}
            />
        );
    },
}));

function setup(testProps = {}, renderMethod = render) {
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
        ...testProps,
    };

    return renderMethod(
        <WithReduxStore>
            <WithRouter>
                <PublicationForm {...props} />
            </WithRouter>
        </WithReduxStore>,
    );
}

describe('Component PublicationForm', () => {
    it('should render component initialised with just one field - publication type', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
        expect(container.getElementsByTagName('field').length).toEqual(1);
    });

    it('should render component initialised with two fields - publication type and subtype', () => {
        const { container } = setup({
            initialValues: {
                rek_display_type: 179,
            },
            hasSubtypes: true,
        });

        expect(container).toMatchSnapshot();
        expect(container.getElementsByTagName('field').length).toEqual(2);
    });

    it('should render form after selecting both publication type and subtype (Journal article/Editorial)', () => {
        const { container } = setup({
            initialValues: {
                rek_display_type: 179,
                rek_subtype: 'Editorial',
            },
            hasSubtypes: true,
            subtypeVocabId: 453573,
        });

        expect(container).toMatchSnapshot();
        expect(container.getElementsByTagName('field').length).toEqual(2);
    });

    it('should render component with JournalArticleForm', () => {
        const { container, getByText } = setup({
            initialValues: {
                rek_display_type: 179,
            },
            hasSubtypes: true,
            subtypeVocabId: 453573,
            formComponent: JournalArticleForm,
        });

        expect(container).toMatchSnapshot();
        expect(getByText('Journal article information')).toBeInTheDocument();
        expect(container.querySelectorAll('field[name=files]').length).toEqual(1);
    });

    it('should render component with BookForm', () => {
        const { getByText, container } = setup({
            initialValues: {
                rek_display_type: 174,
            },
            hasSubtypes: true,
            subtypeVocabId: 1111,
            formComponent: BookForm,
        });

        expect(getByText('Book information')).toBeInTheDocument();
        expect(container.querySelectorAll('field[name=files]').length).toEqual(1);
        expect(container).toMatchSnapshot();
    });

    it('should render component with GenericDocument', () => {
        const { getByText, container } = setup({
            initialValues: {
                rek_display_type: 202,
            },
            hasSubtypes: true,
            subtypeVocabId: 2222,
            formComponent: GenericDocumentForm,
        });
        expect(getByText('Generic document information')).toBeInTheDocument();

        expect(container.querySelectorAll('field[name=files]').length).toEqual(1);
        expect(container).toMatchSnapshot();
    });

    it('should render component with ResearchReportForm', () => {
        const { getByText, container } = setup({
            initialValues: {
                rek_display_type: 275,
            },
            hasSubtypes: true,
            subtypeVocabId: 1111,
            formComponent: ResearchReportForm,
        });
        expect(getByText('Research report information')).toBeInTheDocument();

        expect(container.querySelectorAll('field[name=files]').length).toEqual(1);
        expect(container).toMatchSnapshot();
    });

    it('should render component with all fields disabled', () => {
        const { container } = setup({
            submitting: true,
        });
        container.querySelectorAll('field').forEach(field => {
            expect(field).toHaveAttribute('disabled', 'true');
        });
        expect(container).toMatchSnapshot();
    });

    it('should call onFormSubmitSuccess method', () => {
        const testMethod = jest.fn();
        const { rerender } = setup({
            onFormSubmitSuccess: testMethod,
        });
        setup(
            {
                submitSucceeded: true,
                onFormSubmitSuccess: testMethod,
            },
            rerender,
        );
        expect(testMethod).toHaveBeenCalled();
    });

    it('Shows an alert', () => {
        const props = {
            initialValues: {},
            formComponent: null,
            changeFormType: jest.fn(),
            error: 'There is an error',
            formErrors: ['error'],
        };
        const { container, rerender } = setup({ ...props });
        // export const getErrorAlertProps = ({
        //     dirty = false,
        //     submitting = false,
        //     error,
        //     formErrors,
        //     submitSucceeded = false,
        //     alertLocale = {},
        // }) => {};
        expect(container).toMatchSnapshot();
        setup({ ...props, formComponent: () => 'test' }, rerender);
        expect(container).toMatchSnapshot();
        setup({ ...props, submitSucceeded: true }, rerender);
        expect(container).toMatchSnapshot();
    });

    it('should call getDerivedStateFromProps when props change', () => {
        const changeDisplayType = jest.fn();
        const changeFormType = jest.fn();
        const props = {
            initialValues: {},
            changeDisplayType: changeDisplayType,
            changeFormType: changeFormType,
        };
        const { container, rerender } = setup({ ...props });

        setup(
            {
                ...props,
                submitSucceeded: true,
                hasSubtypes: false,
                subtypes: null,
                formComponent: null,
                isNtro: false,
                hasDefaultDocTypeSubType: false,
                docTypeSubTypeCombo: null,
            },
            rerender,
        );

        // Testing conditional paths
        expect(container).toMatchSnapshot();
        setup(
            {
                ...props,
                submitSucceeded: true,
                hasSubtypes: true,
                subtypes: null,
                formComponent: null,
                isNtro: false,
                hasDefaultDocTypeSubType: false,
                docTypeSubTypeCombo: null,
            },
            rerender,
        );

        expect(container).toMatchSnapshot();

        setup(
            {
                ...props,
                submitSucceeded: true,
                hasSubtypes: true,
                subtypes: ['test', 'test2'],
                formComponent: null,
                isNtro: false,
                hasDefaultDocTypeSubType: false,
                docTypeSubTypeCombo: null,
            },
            rerender,
        );

        expect(container).toMatchSnapshot();

        setup(
            {
                ...props,
                submitSucceeded: true,
                hasSubtypes: true,
                subtypes: ['test', 'test2'],
                formComponent: null,
                isNtro: true,
                hasDefaultDocTypeSubType: true,
                docTypeSubTypeCombo: null,
            },
            rerender,
        );

        expect(changeDisplayType).toHaveBeenCalled();
        expect(changeFormType).toHaveBeenCalled();
        expect(container).toMatchSnapshot();
    });

    it('should require file upload for ntro fields', () => {
        const { container } = setup({
            formComponent: CreativeWorkForm,
            initialValues: {
                rek_display_type: 275,
            },
            hasSubtypes: true,
            subtypeVocabId: 1111,
            isNtro: true,
        });
        expect(container.querySelector('field[name=files]')).toHaveAttribute(
            'validate',
            'fileUploadRequired,validFileUpload',
        );
    });
});
