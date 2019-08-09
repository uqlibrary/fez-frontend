import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TopCitedPublications from '../components/TopCitedPublications';
import * as actions from 'actions';
import { withRouter } from 'react-router-dom';

const mapStateToProps = state => {
    return {
        ...state.get('topCitedPublicationsReducer'),
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
}

let TopCitedPublicationsContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(TopCitedPublications);
TopCitedPublicationsContainer = withRouter(TopCitedPublicationsContainer);

export default TopCitedPublicationsContainer;
