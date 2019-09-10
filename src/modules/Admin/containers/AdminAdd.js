import { connect } from 'react-redux';
import { reduxForm, getFormValues, getFormSyncErrors, formValueSelector, change } from 'redux-form/immutable';
import Immutable from 'immutable';
import AdminAdd from '../components/AdminAdd';
import { checkSession, clearSessionExpiredFlag } from 'actions';
import { bindActionCreators } from 'redux';
import { confirmDiscardFormChanges } from 'modules/SharedComponents/ConfirmDiscardFormChanges';
import { reloadReducerFromLocalStorage } from 'modules/SharedComponents/ReloadReducerFromLocalStorage';
import { general, publicationTypes } from 'config';
import * as recordForms from 'modules/SharedComponents/PublicationForm/components/Forms';
import { NEW_DOCTYPES_OPTIONS, DOCTYPE_SUBTYPE_MAPPING } from 'config/general';

const FORM_NAME = 'Prototype';

// const onSubmit = (values) => {
//     console.log(JSON.stringify(values));
//     return null;
// };

let AdminAddContainer = reduxForm({
    form: FORM_NAME,
    // onSubmit,
})(confirmDiscardFormChanges(AdminAdd, FORM_NAME));

const selector = formValueSelector(FORM_NAME);

const mapStateToProps = state => {
    const formErrors = getFormSyncErrors(FORM_NAME)(state) || Immutable.Map({});
    const formValues = getFormValues(FORM_NAME)(state) || Immutable.Map({});

    const displayType = selector(state, 'rek_display_type');
    const publicationSubtype = selector(state, 'rek_subtype');

    const selectedPublicationType = !!displayType && publicationTypes({ ...recordForms })[displayType];
    const hasSubtypes = !!(selectedPublicationType || {}).subtypes;
    const subtypes = (hasSubtypes && selectedPublicationType.subtypes) || null;

    let hasDefaultDocTypeSubType = false;
    let docTypeSubTypeCombo = null;

    if (!!displayType && NEW_DOCTYPES_OPTIONS.includes(displayType)) {
        hasDefaultDocTypeSubType = true;
        docTypeSubTypeCombo = !!DOCTYPE_SUBTYPE_MAPPING[displayType] && DOCTYPE_SUBTYPE_MAPPING[displayType];
    }
    console.log(
        'SUBTYPES',
        (!!publicationSubtype &&
            !!subtypes &&
            general.NTRO_SUBTYPES.includes(publicationSubtype) &&
            subtypes.filter(type => general.NTRO_SUBTYPES.includes(type))) ||
            subtypes ||
            null,
    );
    return {
        formValues: formValues,
        formErrors: formErrors,
        disableSubmit: formErrors && !(formErrors instanceof Immutable.Map),
        initialValues: {
            rek_pid: 'UQ:12345',
        },
        hasSubtypes: hasSubtypes,
        hasDefaultDocTypeSubType: hasDefaultDocTypeSubType,
        docTypeSubTypeCombo: docTypeSubTypeCombo,
        subtypes:
            (!!publicationSubtype &&
                !!subtypes &&
                general.NTRO_SUBTYPES.includes(publicationSubtype) &&
                subtypes.filter(type => general.NTRO_SUBTYPES.includes(type))) ||
            subtypes ||
            null,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators({ checkSession, clearSessionExpiredFlag }, dispatch),
        changeDisplayType: docTypeSubType => {
            dispatch(change(FORM_NAME, 'rek_display_type', docTypeSubType.docTypeId));
            dispatch(change(FORM_NAME, 'rek_subtype', docTypeSubType.subtype));
        },
        changeFormType: isNtro => {
            dispatch(change(FORM_NAME, 'isNtro', isNtro));
        },
    };
};

AdminAddContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(AdminAddContainer);

export default reloadReducerFromLocalStorage()(AdminAddContainer);
