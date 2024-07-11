import { connect } from 'react-redux';
import {
    reduxForm,
    getFormValues,
    getFormSyncErrors,
    stopSubmit,
    SubmissionError,
    reset,
    formValueSelector,
    change,
    getFormAsyncErrors,
} from 'redux-form/immutable';
import Immutable from 'immutable';
import PublicationForm from '../components/PublicationForm';
import { createNewRecord, doesDOIExist } from 'actions';
import { general, publicationTypes, validation } from 'config';
import { locale } from 'locale';
import {
    DOCTYPE_SUBTYPE_MAPPING,
    NEW_DOCTYPES_OPTIONS,
    NTRO_SUBTYPE_CW_DESIGN_ARCHITECTURAL_WORK,
    PUBLICATION_TYPE_DESIGN,
} from 'config/general';
import moment from 'moment';

import * as recordForms from '../components/Forms';
import { defaultShouldAsyncValidate } from 'redux-form';
import validationErrors from 'locale/validationErrors';

const FORM_NAME = 'PublicationForm';

const onSubmit = (values, dispatch, state) => {
    // Get the list of redux-form registered fields for the current form
    const formFields = state.registeredFields.toJS();

    // Delete the currentAuthor if there is no author field in the form
    // (potentially editors only like conference proceedings) and its not a thesis (specific field name)
    const cleanValues = values.toJS();
    if (!formFields.authors && !formFields['currentAuthor.0.nameAsPublished']) {
        delete cleanValues.currentAuthor;
    }

    // set default values for a new unapproved record
    return dispatch(createNewRecord({ ...cleanValues }))
        .then(() => {
            // once this promise is resolved form is submitted successfully and will call parent containers
            // reported bug to redux-form:
            // reset form after success action was dispatched:
            // componentWillUnmount cleans up form, but then onSubmit success sets it back to active
            setTimeout(() => {
                dispatch(reset(FORM_NAME));
            }, 100);
        })
        .catch(error => {
            throw new SubmissionError({ _error: error.message });
        });
};

const asyncValidate = values => {
    const data = values.toJS();
    const doi = data.fez_record_search_key_doi && data.fez_record_search_key_doi.rek_doi;
    if (validation.isValidDOIValue(doi)) {
        return doesDOIExist(doi).then(response => {
            if (response && response.total) {
                // redux-form error structure for field names with dots
                throw { fez_record_search_key_doi: { rek_doi: validationErrors.validationErrors.doiExists } };
            }
        });
    }

    return Promise.resolve();
};

const validate = values => {
    // add only multi field validations
    // single field validations should be implemented using validate prop: <Field validate={[validation.required]} />
    // reset global errors, eg form submit failure
    stopSubmit(FORM_NAME, null);
    const data = values.toJS();
    const errors = {};

    // Check authors validation for special cases
    switch (data.rek_display_type) {
        case general.PUBLICATION_TYPE_BOOK:
        case general.PUBLICATION_TYPE_AUDIO_DOCUMENT:
        case general.PUBLICATION_TYPE_VIDEO_DOCUMENT:
            // either author or editor should be selected and linked to a user
            if (
                (!data.authors && !data.editors) ||
                (!data.authors && data.editors && data.editors.length === 0) ||
                (!data.editors && data.authors && data.authors.length === 0) ||
                (data.authors && data.editors && data.editors.length === 0 && data.authors.length === 0) ||
                (data.authors &&
                    data.authors.length !== 0 &&
                    (data.editors || []).filter(item => item.selected).length === 0 &&
                    data.authors.filter(item => item.selected).length === 0) ||
                (data.editors &&
                    data.editors.length !== 0 &&
                    (data.authors || []).filter(item => item.selected).length === 0 &&
                    data.editors.filter(item => item.selected).length === 0)
            ) {
                errors.authors = locale.validationErrors.authorRequired;
                errors.editors = locale.validationErrors.editorRequired;
            }
            break;
        default:
            break;
    }

    // Check start\end dates are valid
    const endDate =
        data.fez_record_search_key_end_date &&
        data.fez_record_search_key_end_date.rek_end_date &&
        moment(data.fez_record_search_key_end_date.rek_end_date, 'YYYY-MM-DD').format();
    const startDate = data.rek_date && moment(data.rek_date).format();

    if (!!endDate && !!startDate && startDate > endDate) {
        errors.dateRange = locale.validationErrors.dateRange;
    }

    // Check start/end pages are valid for Book Chapters
    const startPage = data.fez_record_search_key_start_page && data.fez_record_search_key_start_page.rek_start_page;
    const endPage = data.fez_record_search_key_end_page && data.fez_record_search_key_end_page.rek_end_page;
    const docType = data.rek_display_type;
    if (
        docType === 177 &&
        (!startPage || !endPage || (!!startPage && !!endPage && parseInt(startPage, 10) > parseInt(endPage, 10)))
    ) {
        errors.pageRange = locale.validationErrors.pageRange;
    } else {
        if (errors.pageRange) {
            delete errors.pageRange;
        }
    }

    return errors;
};

let PublicationFormContainer = reduxForm({
    form: FORM_NAME,
    validate,
    onSubmit,
    asyncValidate,
    asyncChangeFields: ['fez_record_search_key_doi.rek_doi'],
    // https://github.com/redux-form/redux-form/issues/3944
    shouldAsyncValidate: params => {
        return defaultShouldAsyncValidate({ ...params, syncValidationPasses: true });
    },
})(PublicationForm);

const selector = formValueSelector(FORM_NAME);

const mapStateToProps = (state, props) => {
    // Map when empty, JS object when it has values
    const formSyncErrors = getFormSyncErrors(FORM_NAME)(state) || Immutable.Map({});
    // Always Map
    const formAsyncErrors = getFormAsyncErrors(FORM_NAME)(state) || Immutable.Map({});

    const formValues = getFormValues(FORM_NAME)(state) || Immutable.Map({});
    const displayType = selector(state, 'rek_display_type');
    const publicationSubtype = selector(state, 'rek_subtype');

    const selectedPublicationType = !!displayType && publicationTypes({ ...recordForms })[displayType];

    let hasDefaultDocTypeSubType = false;
    let docTypeSubTypeCombo = null;

    if (!!displayType && NEW_DOCTYPES_OPTIONS.includes(displayType)) {
        hasDefaultDocTypeSubType = true;
        docTypeSubTypeCombo = !!DOCTYPE_SUBTYPE_MAPPING[displayType] && DOCTYPE_SUBTYPE_MAPPING[displayType];
    } else if (displayType === PUBLICATION_TYPE_DESIGN) {
        hasDefaultDocTypeSubType = true;
        docTypeSubTypeCombo = {
            docTypeId: PUBLICATION_TYPE_DESIGN,
            subtype: NTRO_SUBTYPE_CW_DESIGN_ARCHITECTURAL_WORK,
            name: NTRO_SUBTYPE_CW_DESIGN_ARCHITECTURAL_WORK,
        };
    }

    const hasSubtypes = !!(selectedPublicationType || {}).subtypes;
    const subtypes = (hasSubtypes && selectedPublicationType.subtypes) || null;
    const formComponent = hasSubtypes
        ? !!publicationSubtype && selectedPublicationType.formComponent
        : (selectedPublicationType || {}).formComponent || null;

    // Merge Sync and Async errors as a JS object as getFormError doesnt seem to return anything
    const formErrors = {
        ...(formSyncErrors instanceof Immutable.Map ? formSyncErrors.toJS() : formSyncErrors),
        ...(formAsyncErrors.get('fez_record_search_key_doi') ? { rek_doi_exists: '' } : {}),
    };

    return {
        formValues: formValues,
        formErrors: formErrors,
        disableSubmit: formErrors && formErrors.constructor === Object && Object.keys(formErrors).length > 0,
        hasSubtypes: hasSubtypes,
        subtypes:
            (!!publicationSubtype &&
                general.NTRO_SUBTYPES.includes(publicationSubtype) &&
                subtypes.filter(type => general.NTRO_SUBTYPES.includes(type))) ||
            subtypes,
        subtype: publicationSubtype,
        formComponent:
            (!hasSubtypes && formComponent) || (hasSubtypes && !!publicationSubtype && formComponent) || null,
        isNtro: general.NTRO_SUBTYPES.includes(publicationSubtype),
        hasDefaultDocTypeSubType: hasDefaultDocTypeSubType,
        docTypeSubTypeCombo: docTypeSubTypeCombo,
        isAuthorSelected:
            (!!formValues &&
                formValues.get('authors') &&
                formValues.get('authors').some(object => {
                    return object.selected === true;
                })) ||
            false,
        initialValues: {
            languages: ['eng'],
            rek_title: props.initialValues.rek_title || '',
        },
        isHdrStudent: props.initialValues.isHdrStudent,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        changeDisplayType: docTypeSubType => {
            dispatch(change(FORM_NAME, 'rek_display_type', docTypeSubType.docTypeId));
            dispatch(change(FORM_NAME, 'rek_subtype', docTypeSubType.subtype));
        },
        changeFormType: isNtro => {
            dispatch(change(FORM_NAME, 'isNtro', isNtro));
        },
    };
};

PublicationFormContainer = connect(mapStateToProps, mapDispatchToProps)(PublicationFormContainer);

export default PublicationFormContainer;
