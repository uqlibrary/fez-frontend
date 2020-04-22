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

const getValidUlrichs = (ulrichsArray, item) => {
    const validUlrichsKey = Object.keys(ulrichsArray).find(
        issn => ulrichsArray[issn].ulr_title !== '' && ulrichsArray[issn].ulr_issn === (item && (item.key || item)),
    );
    return ulrichsArray[validUlrichsKey];
};

const mapStateToProps = (state, props) => {
    const { item } = props;
    const {
        loadingSherpaFromIssn,
        loadingUlrichsFromIssn,
        sherpaLoadFromIssnError,
        sherpaRomeo,
        ulrichs,
        ulrichsLoadFromIssnError,
    } = state.get('issnLinksReducer');
    const sherpaData =
        !loadingSherpaFromIssn && !sherpaLoadFromIssnError && sherpaRomeo && getValidSherpa(sherpaRomeo, item);
    const ulrichsData =
        !loadingUlrichsFromIssn && !ulrichsLoadFromIssnError && ulrichs && getValidUlrichs(ulrichs, item);
    return {
        sherpaRomeo:
            (sherpaData && {
                link:
                    sherpaData.srm_issn &&
                    globalLocale.global.sherpaRomeoLink.externalUrl.replace('[issn]', sherpaData.srm_issn),
            }) ||
            null,
        ulrichs:
            (ulrichsData && {
                link:
                    ulrichsData.ulr_issn &&
                    globalLocale.global.ulrichsLink.externalUrl.replace('[id]', ulrichsData.ulr_title_id),
                title: ulrichsData.ulr_title || '',
            }) ||
            null,
    };
};

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch),
});

const IssnRowItemTemplateContainer = connect(mapStateToProps, mapDispatchToProps)(IssnRowItemTemplate);

export default IssnRowItemTemplateContainer;
