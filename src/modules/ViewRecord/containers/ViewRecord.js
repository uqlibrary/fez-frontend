import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ViewRecord from '../components/ViewRecord';
import { withRouter } from 'react-router-dom';
import * as actions from 'actions';

const mapStateToProps = state => {
    const viewRecordReducer = state.get('viewRecordReducer');
    if (!!viewRecordReducer && !!viewRecordReducer.recordToView) {
        viewRecordReducer.recordToView.fez_record_search_key_isdatasetof_siblings = [];

        !!viewRecordReducer.recordToView &&
            !!viewRecordReducer.recordToView.fez_record_search_key_isdatasetof &&
            viewRecordReducer.recordToView.fez_record_search_key_isdatasetof.map(item => {
                !!item.datasetSiblings &&
                    item.datasetSiblings.map(sibling => {
                        viewRecordReducer.recordToView.fez_record_search_key_isdatasetof_siblings.push(sibling);
                    });
                delete item.datasetSiblings;
            });
    }

    return {
        ...viewRecordReducer,
        ...state.get('accountReducer'),
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
}

let ViewRecordContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(ViewRecord);
ViewRecordContainer = withRouter(ViewRecordContainer);
export default ViewRecordContainer;
