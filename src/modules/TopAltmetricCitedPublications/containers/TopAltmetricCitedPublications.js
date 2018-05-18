import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import TopAltmetricCitedPublications from '../components/TopAltmetricCitedPublications';
import * as actions from 'actions';
import {withRouter} from 'react-router-dom';

const mapStateToProps = (state) => {
    return {
        ...state.get('topAltmetricCitedPublicationsReducer')
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
}

let TopAltmetricCitedPublicationsContainer = connect(mapStateToProps, mapDispatchToProps)(TopAltmetricCitedPublications);
TopAltmetricCitedPublicationsContainer = withRouter(TopAltmetricCitedPublicationsContainer);

export default TopAltmetricCitedPublicationsContainer;
