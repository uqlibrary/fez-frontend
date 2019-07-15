import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import Immutable from 'immutable';
import { reduxForm, getFormValues, getFormSyncErrors } from 'redux-form/immutable';

import DigiTeamBatchImport from '../components/DigiTeamBatchImport';

import * as actions from 'actions';
import { confirmDiscardFormChanges } from 'modules/SharedComponents/ConfirmDiscardFormChanges';

const FORM_NAME = 'DigiTeamBatchImport';

// const onSubmit = (values, dispatch, props) => {
//     const currentAuthor = props.author || null;
//     return dispatch(createDigiTeamBatchImport({ ...values.toJS() }, (currentAuthor && currentAuthor.aut_id) || null))
//         .catch(
//             error => {
//                 throw new SubmissionError({ _error: error });
//             }
//         );
// };

let DigiTeamBatchImportContainer = reduxForm({
    form: FORM_NAME,
    // onSubmit,
})(confirmDiscardFormChanges(DigiTeamBatchImport, FORM_NAME));

const mapStateToProps = state => {
    const formErrors = getFormSyncErrors(FORM_NAME)(state) || Immutable.Map({});
    const result = {
        formValues: getFormValues(FORM_NAME)(state) || Immutable.Map({}),
        formErrors: formErrors,
        disableSubmit: formErrors && !(formErrors instanceof Immutable.Map),
        collectionList: state && state.get('digiTeamBatchImportReducer')
            ? state.get('digiTeamBatchImportReducer').communityCollectionsList
            : [],
    };
    return result;
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
        loadItemsList: () => dispatch(actions.collectionsByCommunityList()),
    };
}

DigiTeamBatchImportContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(DigiTeamBatchImportContainer);

DigiTeamBatchImportContainer = withRouter(DigiTeamBatchImportContainer);
export default DigiTeamBatchImportContainer;
