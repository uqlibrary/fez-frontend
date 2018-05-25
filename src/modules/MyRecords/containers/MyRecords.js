import {connect} from 'react-redux';
import {locale} from 'locale';
import MyRecords from '../components/MyRecords';
import {bindActionCreators} from 'redux';
import {withRouter} from 'react-router-dom';
import * as actions from 'actions';
import {routes} from 'config';

const mapStateToProps = (state) => {
    return {
        accountLoading: state.get('accountReducer').accountLoading,
        ...state.get('publicationsReducer'),
        ...state.get('exportPublicationsReducer'),
        ...state.get('publicationsReducer'),
        ...state.get('accountReducer'),
        localePages: locale.pages.myResearch,
        thisUrl: routes.pathConfig.records.mine,
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
