import { connect } from 'react-redux';
import { locale } from 'locale';
import MyRecords from '../components/MyRecords';
import { bindActionCreators } from 'redux';
import { withNavigate } from 'helpers/withNavigate';
import * as actions from 'actions';
import { pathConfig } from 'config';

const mapStateToProps = (state, ownProps) => {
    return {
        authorDetails: state.get('accountReducer').authorDetails || {},
        accountLoading: state.get('accountReducer').accountLoading,
        ...state.get('publicationsReducer').noncompliantoa,
        localePages: locale.pages.openAccessPublications,
        thisUrl: pathConfig.records.openAccessCompliance,
        publicationsListCustomActions: [
            {
                label: locale.pages.openAccessPublications.publicationsList.fix,
                handleAction: item => ownProps.navigate(pathConfig.records.fix(item.rek_pid)),
            },
            {
                label: locale.pages.openAccessPublications.publicationsList.complete,
                handleAction: item => ownProps.navigate(pathConfig.records.openAccessComplianceFix(item.rek_pid)),
                primary: true,
            },
        ],
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions: {
            ...bindActionCreators(actions, dispatch),
            loadAuthorPublications: state => dispatch(actions.searchAuthorPublications(state, 'noncompliantoa')),
        },
    };
}

const openAccessRecordsContainer = withNavigate()(connect(mapStateToProps, mapDispatchToProps)(MyRecords));

export default openAccessRecordsContainer;
