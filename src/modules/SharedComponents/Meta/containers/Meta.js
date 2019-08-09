import { connect } from 'react-redux';
import Meta from '../components/Meta';
import { withRouter } from 'react-router-dom';

const mapStateToProps = state => {
    const publication = (!!state.get('viewRecordReducer') && state.get('viewRecordReducer').recordToView) || {};
    return {
        publication: publication,
    };
};

const mapDispatchToProps = () => ({});

let MetaContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Meta);
MetaContainer = withRouter(MetaContainer);
export default MetaContainer;
