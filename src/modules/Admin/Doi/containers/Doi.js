import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Doi from '../components/Doi';

import pagesLocale from 'locale/pages';

import * as actions from 'actions';

const API_REQUEST_SOURCE = 'doi_preview';

export const onSubmit = (record, dispatch) => {
    const doi = !!record && !!record.fez_record_search_key_doi && record.fez_record_search_key_doi.rek_doi;
    const updatedRecord = JSON.parse(JSON.stringify(record));

    if (!doi) {
        updatedRecord.fez_record_search_key_doi = {
            rek_doi: pagesLocale.pages.doi.doiTemplate(updatedRecord.rek_pid),
        };
    }

    updatedRecord._source = API_REQUEST_SOURCE;

    return dispatch(actions.updateDoi(updatedRecord)).catch(error => {
        console.log(error);
    });
};

/* istanbul ignore next */
const mapStateToProps = state => {
    const { recordToView: record, loadingRecordToView } = state.get('viewRecordReducer') || {};
    return {
        loadingRecordToView,
        record,
        ...state.get('doiReducer'),
    };
};

/* istanbul ignore next */
const mapDispatchToProps = dispatch => {
    const { loadRecordToView, resetDoi } = bindActionCreators(actions, dispatch);
    return { handleSubmit: record => onSubmit(record, dispatch), loadRecordToView, resetDoi };
};

export default connect(mapStateToProps, mapDispatchToProps)(Doi);
