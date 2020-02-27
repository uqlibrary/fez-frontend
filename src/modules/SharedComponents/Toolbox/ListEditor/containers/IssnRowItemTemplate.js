import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import * as actions from 'actions';
import { default as globalLocale } from 'locale/global';

import IssnRowItemTemplate from '../components/IssnRowItemTemplate';

const mapStateToProps = (state, props) => {
    const { loadingSherpaFromIssn, sherpaRomeo, sherpaLoadFromIssnError } = state.get('issnLinksReducer');
    const sherpaData =
        !loadingSherpaFromIssn &&
        !sherpaLoadFromIssnError &&
        sherpaRomeo &&
        sherpaRomeo.find(sherpaEntry => sherpaEntry.srm_issn === (props.item && (props.item.key || props.item)));
    return {
        sherpaRomeo:
            (sherpaData && {
                link:
                    sherpaData.srm_issn &&
                    globalLocale.global.sherpaRomeoLink.externalUrl.replace('[issn]', sherpaData.srm_issn),
                title: sherpaData.srm_journal_name || '',
            }) ||
            null,
    };
};

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch),
});

let IssnRowItemTemplateContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(IssnRowItemTemplate);
IssnRowItemTemplateContainer = withRouter(IssnRowItemTemplateContainer);

export default IssnRowItemTemplateContainer;
