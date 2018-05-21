import {connect} from 'react-redux';
import {locale} from 'locale';
import {general} from 'config';
import MyRecords from '../components/MyRecords';
import {bindActionCreators} from 'redux';
import {withRouter} from 'react-router-dom';
import * as actions from 'actions';
import {routes} from 'config';

const mapStateToProps = (state) => {
    return {
        accountLoading: state.get('accountReducer').accountLoading,
        ...state.get('publicationsReducer'),
        initialFacets: {
            filters: { 'Display type': general.PUBLICATION_TYPE_DATA_COLLECTION}
        },
        localePages: locale.pages.myDatasets,
        thisUrl: routes.pathConfig.dataset.mine,
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
}

let ResearchContainer = connect(mapStateToProps, mapDispatchToProps)(MyRecords);
ResearchContainer = withRouter(ResearchContainer);
export default ResearchContainer;
