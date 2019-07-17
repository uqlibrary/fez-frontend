import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import Immutable from 'immutable';
import { reduxForm, getFormValues, getFormSyncErrors } from 'redux-form/immutable';

import { FORM_NAME, DigiTeamBatchImport } from '../components/DigiTeamBatchImport';

import * as actions from 'actions';
import { confirmDiscardFormChanges } from 'modules/SharedComponents/ConfirmDiscardFormChanges';

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
        community: state && state.get('rekMemberIdCommunity'),
        collection: state && state.get('rekMemberIdCollection'),
        communityCollectionsList: state && state.get('digiTeamBatchImportReducer')
            ? state.get('digiTeamBatchImportReducer').communityCollectionsList
            : [],
        itemsList: state && state.get('digiTeamBatchImportReducer')
            ? state.get('digiTeamBatchImportReducer').itemsList
            : [],
    };
    console.log('mapStateToProps: ', result);
    return result;
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
        // loadItemsList: (parentPid) => dispatch(actions.collectionsList(parentPid)),
        // collectionsByCommunityList: (parentPid) => dispatch(actions.collectionsByCommunityList(parentPid)),
    };
}

DigiTeamBatchImportContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(DigiTeamBatchImportContainer);

DigiTeamBatchImportContainer = withRouter(DigiTeamBatchImportContainer);
export default DigiTeamBatchImportContainer;
