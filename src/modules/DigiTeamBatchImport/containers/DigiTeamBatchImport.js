import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import * as actions from 'actions';

import DigiTeamBatchImport from '../components/DigiTeamBatchImport';

const mapStateToProps = (state) => {
    return {
        ...state.get('DigiTeamBatchImportReducer'),
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
}

let DigiTeamBatchImportContainer = connect(mapStateToProps, mapDispatchToProps)(DigiTeamBatchImport);
DigiTeamBatchImportContainer = withRouter(DigiTeamBatchImportContainer);

export default DigiTeamBatchImportContainer;
