import { connect } from 'react-redux';
import { locale } from 'locale';
import MyRecords from '../components/MyRecords';
import { bindActionCreators } from 'redux';
import { withNavigate } from 'helpers/withNavigate';
import * as actions from 'actions';
import { pathConfig } from 'config';

export const openAccessibleProps = props => {
    const txt = locale.components.myLatestPublications;

    const _actions = [
        {
            label: txt.openAccessible.openAccess,
            handleAction: record => {
                props.navigate(pathConfig.records.openAccessComplianceFix(record.rek_pid));
            },
            primary: true,
        },
        {
            label: txt.openAccessible.correction,
            handleAction: record => {
                props.navigate(pathConfig.records.fix(record.rek_pid));
            },
            primary: false,
        },
    ];

    return {
        publicationsListCustomActions: _actions,
        publicationsListOtherProps: {
            forceUseCustomActions: record => record.potentiallyOpenAccessible(),
            showDefaultActions: true,
        },
    };
};

const mapStateToProps = (state, ownProps) => {
    return {
        authorDetails: state.get('accountReducer').authorDetails || {},
        accountLoading: state.get('accountReducer').accountLoading,
        ...state.get('publicationsReducer').mine,
        ...state.get('exportPublicationsReducer'),
        localePages: locale.pages.myResearch,
        thisUrl: pathConfig.records.mine,
        canUseExport:
            state.get('accountReducer') &&
            state.get('accountReducer').account &&
            !!state.get('accountReducer').account.hasSession,
        ...openAccessibleProps(ownProps),
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions: {
            ...bindActionCreators(actions, dispatch),
            loadAuthorPublications: state => dispatch(actions.searchAuthorPublications(state, 'mine')),
        },
    };
}

const ResearchContainer = connect(mapStateToProps, mapDispatchToProps)(MyRecords);
export default withNavigate()(ResearchContainer);
