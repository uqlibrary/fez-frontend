import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import {
    change,
    formValueSelector,
    getFormSyncErrors,
    getFormValues,
    reduxForm,
    SubmissionError,
} from 'redux-form/immutable';
import Immutable from 'immutable';

import ChangeDisplayType from '../components/ChangeDisplayType';
import * as recordForms from 'modules/SharedComponents/PublicationForm/components/Forms';

import * as actions from 'actions';
import { publicationTypes } from 'config';
import {
    DOCTYPE_SUBTYPE_MAPPING,
    NEW_DOCTYPES_OPTIONS,
    NTRO_SUBTYPE_DESIGN_CW_ARCHITECTURAL_WORK,
    NTRO_SUBTYPES,
    PUBLICATION_TYPE_DESIGN,
} from 'config/general';

const FORM_NAME = 'ChangeDisplayTypeForm';

export const onSubmit = (newData, recordToView, dispatch) => {
    const cleanValues = newData.toJS();

    // build an object structure that can be processed by adminUpdate
    const requestObject = {
        ...recordToView,
        rek_display_type: cleanValues.rek_display_type,
        adminSection: {
            rek_subtype: cleanValues.rek_subtype,
        },
        filesSection: {
            files: false,
        },
        publication: {
            rek_pid: recordToView.rek_pid,
        },
    };

    return dispatch(actions.adminUpdate(requestObject)).catch(error => {
        throw new SubmissionError({ _error: error });
    });
};

const ChangeDisplayTypeContainer = reduxForm({
    form: FORM_NAME,
    onSubmit,
})(ChangeDisplayType);

const selector = formValueSelector(FORM_NAME);

/* istanbul ignore next */
const mapStateToProps = state => {
    const { recordToView: record, loadingRecordToView } = state.get('viewRecordReducer') || {};

    const formErrors = getFormSyncErrors(FORM_NAME)(state) || Immutable.Map({});

    const displayType = selector(state, 'rek_display_type');
    const publicationSubtype = selector(state, 'rek_subtype');

    const selectedPublicationType = !!displayType && publicationTypes({ ...recordForms })[displayType];

    let docTypeSubTypeCombo = null;

    if (!!displayType && NEW_DOCTYPES_OPTIONS.includes(displayType)) {
        docTypeSubTypeCombo = !!DOCTYPE_SUBTYPE_MAPPING[displayType] && DOCTYPE_SUBTYPE_MAPPING[displayType];
    } else if (displayType === PUBLICATION_TYPE_DESIGN) {
        docTypeSubTypeCombo = {
            docTypeId: PUBLICATION_TYPE_DESIGN,
            subtype: NTRO_SUBTYPE_DESIGN_CW_ARCHITECTURAL_WORK,
            name: NTRO_SUBTYPE_DESIGN_CW_ARCHITECTURAL_WORK,
        };
    }

    const hasSubtypes = !!(selectedPublicationType || {}).subtypes;
    const publicationSubtypeItems = (hasSubtypes && selectedPublicationType.subtypes) || null;
    const formComponent = hasSubtypes
        ? !!publicationSubtype && selectedPublicationType.formComponent
        : (selectedPublicationType || {}).formComponent || null;

    const disableSubmit =
        !selectedPublicationType ||
        (!!selectedPublicationType && !!hasSubtypes && !publicationSubtype) ||
        (formErrors && !(formErrors instanceof Immutable.Map));
    return {
        formValues: getFormValues(FORM_NAME)(state) || Immutable.Map({}),
        formErrors: formErrors,
        disableSubmit: disableSubmit,
        publicationSubtypeItems:
            (!!publicationSubtype &&
                NTRO_SUBTYPES.includes(publicationSubtype) &&
                !!publicationSubtypeItems &&
                publicationSubtypeItems.length > 0 &&
                publicationSubtypeItems.filter(type => NTRO_SUBTYPES.includes(type))) ||
            publicationSubtypeItems,
        subtype: publicationSubtype,
        formComponent:
            (!hasSubtypes && formComponent) || (hasSubtypes && !!publicationSubtype && formComponent) || null,
        docTypeSubTypeCombo: docTypeSubTypeCombo,
        loadingRecordToView,
        record,
    };
};

/* istanbul ignore next */
const mapDispatchToProps = dispatch => {
    const { loadRecordToView } = bindActionCreators(actions, dispatch);
    return {
        handleSubmit: (newData, recordToView) => onSubmit(newData, recordToView, dispatch),
        loadRecordToView,
        resetSubType: () => {
            dispatch(change(FORM_NAME, 'rek_subtype', null));
        },
    };
};

const ChangeDisplayTypeReduxFormContainer = connect(mapStateToProps, mapDispatchToProps)(ChangeDisplayTypeContainer);

export default withRouter(ChangeDisplayTypeReduxFormContainer);
