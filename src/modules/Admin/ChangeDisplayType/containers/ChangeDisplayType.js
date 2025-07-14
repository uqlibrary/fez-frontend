import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { change, formValueSelector, getFormSyncErrors, reduxForm, SubmissionError } from 'redux-form/immutable';
import Immutable from 'immutable';

import ChangeDisplayType from '../components/ChangeDisplayType';
import * as recordForms from 'modules/SharedComponents/PublicationForm/components/Forms';

import * as actions from 'actions';
import { publicationTypes } from 'config';
import { changeDisplayType } from 'actions';

const FORM_NAME = 'ChangeDisplayTypeForm';

const onSubmit = (values, dispatch, props) => {
    return dispatch(changeDisplayType([props.record], values.toJS())).catch(error => {
        throw new SubmissionError({ _error: error.message });
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

    const hasSubtypes = !!(selectedPublicationType || {}).subtypes;
    const publicationSubtypeItems = (hasSubtypes && selectedPublicationType.subtypes) || null;

    const disableSubmit =
        !selectedPublicationType ||
        (!!selectedPublicationType && !!hasSubtypes && !publicationSubtype) ||
        (formErrors && !(formErrors instanceof Immutable.Map));
    return {
        disableSubmit: disableSubmit,
        publicationSubtypeItems: publicationSubtypeItems,
        loadingRecordToView,
        record,
        ...{ ...state.get('changeDisplayTypeReducer') },
    };
};

/* istanbul ignore next */
const mapDispatchToProps = dispatch => {
    const { loadRecordToView } = bindActionCreators(actions, dispatch);
    return {
        loadRecordToView,
        resetSubType: () => {
            dispatch(change(FORM_NAME, 'rek_subtype', null));
        },
    };
};

const ChangeDisplayTypeReduxFormContainer = connect(mapStateToProps, mapDispatchToProps)(ChangeDisplayTypeContainer);

export default ChangeDisplayTypeReduxFormContainer;
