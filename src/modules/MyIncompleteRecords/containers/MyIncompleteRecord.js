import { connect } from 'react-redux';
import { getFormSyncErrors } from 'redux-form/immutable';
import Immutable from 'immutable';
import { loadRecordToFix, clearFixRecord } from 'actions';

import { FORM_NAME } from '../components/MyIncompleteRecordForm';
import MyIncompleteRecordContainer from '../components/MyIncompleteRecordContainer';

const mapStateToProps = state => {
    const formErrors = getFormSyncErrors(FORM_NAME)(state) || Immutable.Map({});

    return {
        ...state.get('fixRecordReducer'),
        ...state.get('accountReducer'),
        formErrors: formErrors,
        disableSubmit: formErrors && !(formErrors instanceof Immutable.Map),
    };
};

const mapDispatchToProps = dispatch => ({
    loadRecordToFix: pid => dispatch(loadRecordToFix(pid)),
    clearFixRecord: () => dispatch(clearFixRecord()),
});

export default connect(mapStateToProps, mapDispatchToProps)(MyIncompleteRecordContainer);
