import { connect } from 'react-redux';
import Meta from '../components/Meta';
import { withRouter } from 'react-router-dom';

const defaultObj = {};
const mapStateToProps = state => {
    const publication = (!!state.get('viewRecordReducer') && state.get('viewRecordReducer').recordToView) || defaultObj;
    return {
        publication: publication,
    };
};

const mapDispatchToProps = () => ({});

let MetaContainer = connect(mapStateToProps, mapDispatchToProps)(Meta);
MetaContainer = withRouter(MetaContainer);
export default MetaContainer;
