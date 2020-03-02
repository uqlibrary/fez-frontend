import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from 'actions';
import { default as globalLocale } from 'locale/global';

import IssnRowItemTemplate from '../components/IssnRowItemTemplate';

const getValidSherpa = (sherpaArray, item) => {
    const validSherpaKey = Object.keys(sherpaArray).find(
        issn =>
            sherpaArray[issn].srm_journal_name !== '' &&
            sherpaArray[issn].srm_journal_name !== 'Not found in Sherpa Romeo' &&
            sherpaArray[issn].srm_issn === (item && (item.key || item)),
    );
    return sherpaArray[validSherpaKey];
};

const mapStateToProps = (state, props) => {
    const { loadingSherpaFromIssn, sherpaRomeo, sherpaLoadFromIssnError } = state.get('issnLinksReducer');
    const sherpaData =
        !loadingSherpaFromIssn && !sherpaLoadFromIssnError && sherpaRomeo && getValidSherpa(sherpaRomeo, props.item);
    return {
        sherpaRomeo:
            (sherpaData && {
                link:
                    sherpaData.srm_issn &&
                    globalLocale.global.sherpaRomeoLink.externalUrl.replace('[issn]', sherpaData.srm_issn),
                issn: sherpaData.srm_issn || '',
            }) ||
            null,
    };
};

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch),
});

const IssnRowItemTemplateContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(IssnRowItemTemplate);

export default IssnRowItemTemplateContainer;
