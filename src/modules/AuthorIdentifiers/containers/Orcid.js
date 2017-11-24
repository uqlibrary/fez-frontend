import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {reduxForm, getFormValues} from 'redux-form/immutable';
import Immutable from 'immutable';
import Orcid from '../components/Orcid';
import {withRouter} from 'react-router-dom';
import * as actions from 'actions';
import {confirmDiscardFormChanges} from 'modules/SharedComponents/ConfirmDiscardFormChanges';

const FORM_NAME = 'Orcid';

let OrcidContainer = reduxForm({
    form: FORM_NAME
})(confirmDiscardFormChanges(Orcid, FORM_NAME));

const mapStateToProps = (state) => {
    return {
        ...state.get('accountReducer'),
        formValues: getFormValues(FORM_NAME)(state) || Immutable.Map({})
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
}

OrcidContainer = connect(mapStateToProps, mapDispatchToProps)(OrcidContainer);
OrcidContainer = withRouter(OrcidContainer);

export default OrcidContainer;
