import { connect } from 'react-redux';
import Meta from '../components/Meta';
import { withNavigate } from 'helpers/withNavigate';

const defaultObj = {};
const mapStateToProps = state => {
    const publication = (!!state.get('viewRecordReducer') && state.get('viewRecordReducer').recordToView) || defaultObj;
    return {
        publication: publication,
    };
};

const mapDispatchToProps = () => ({});

const MetaContainer = connect(mapStateToProps, mapDispatchToProps)(Meta);
export default withNavigate()(MetaContainer);
