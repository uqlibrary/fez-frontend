import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from 'actions';
import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { ExternalLink } from 'modules/SharedComponents/ExternalLink';
import { default as globalLocale } from 'locale/global';

export const IssnRowItemTemplate = ({ actions, hasPreload, item, loadingSherpaFromIssn, loadingUlrichsFromIssn }) => {
    React.useEffect(() => {
        if (!item.value || !item.value.sherpaRomeo || !item.value.sherpaRomeo.link) {
            !hasPreload &&
                !loadingSherpaFromIssn &&
                item.value.sherpaRomeo.link !== null &&
                actions.getSherpaFromIssn(item.key);
        }
    }, [actions, hasPreload, item, loadingSherpaFromIssn]);

    React.useEffect(() => {
        if (!item.value || !item.value.ulrichs || !item.value.ulrichs.link) {
            !hasPreload && !loadingUlrichsFromIssn && actions.getUlrichsFromIssn(item.key);
        }
    }, [actions, hasPreload, item, loadingUlrichsFromIssn]);

    return (
        <React.Fragment>
            <Typography variant="body2" component={'span'}>
                <span>{item.key}</span>{' '}
                {!!item.value && !!item.value.sherpaRomeo && !!item.value.sherpaRomeo.link && (
                    <ExternalLink
                        href={item.value.sherpaRomeo.link}
                        aria-label={globalLocale.global.sherpaRomeoLink.ariaLabel}
                        title={globalLocale.global.sherpaRomeoLink.title}
                    >
                        {globalLocale.global.sherpaRomeoLink.externalLinktext}
                    </ExternalLink>
                )}
                {!!item.value &&
                    !!item.value.sherpaRomeo &&
                    !!item.value.sherpaRomeo.link &&
                    !!item.value.ulrichs &&
                    !!item.value.ulrichs.link && <span> &nbsp;</span>}
                {!!item.value && !!item.value.ulrichs && !!item.value.ulrichs.link && (
                    <ExternalLink
                        href={item.value.ulrichs.link}
                        aria-label={globalLocale.global.ulrichsLink.ariaLabel}
                        title={item.value.ulrichs.title}
                    >
                        {globalLocale.global.ulrichsLink.externalLinktext}
                    </ExternalLink>
                )}
            </Typography>
        </React.Fragment>
    );
};

IssnRowItemTemplate.propTypes = {
    actions: PropTypes.object,
    hasPreload: PropTypes.bool,
    item: PropTypes.object,
    loadingSherpaFromIssn: PropTypes.bool,
    loadingUlrichsFromIssn: PropTypes.bool,
};

export const getValidSherpa = (sherpaData, issn) =>
    sherpaData[issn] && sherpaData[issn].srm_issn === issn && sherpaData[issn];

/**
 * Returns false if data is missing, and needs to be loaded.
 * Returns null if data in invalid, so data should not be loaded.
 * Returns non-empty journal link for valid records, or link to legacy site if
 * colour is found.
 */
export const getSherpaLink = sherpaEntry => {
    if (!sherpaEntry) {
        return false;
    }
    if (sherpaEntry.srm_journal_name === 'Not found in Sherpa Romeo') {
        return null;
    }
    if (!!sherpaEntry.srm_journal_link) {
        return sherpaEntry.srm_journal_link;
    }
    const validOldColours = ['green', 'blue', 'yellow', 'white'];
    if (validOldColours.includes(sherpaEntry.srm_colour) && !!sherpaEntry.srm_issn) {
        return globalLocale.global.sherpaRomeoLink.externalUrl.replace('[id]', sherpaEntry.srm_issn);
    }
    return false;
};

export const getValidUlrichs = (ulrichsData, issn) =>
    ulrichsData[issn] && ulrichsData[issn].ulr_title !== '' && ulrichsData[issn].ulr_issn === issn && ulrichsData[issn];

export const mapStateToProps = (state, props) => {
    const { item } = props;
    const issn = item.key || item;
    const { sherpaLoadFromIssnError, sherpaRomeo, ulrichs, ulrichsLoadFromIssnError } = state.get('issnLinksReducer');

    const currentRecord = state.get('viewRecordReducer').recordToView;
    const fsrkIssn = (!!currentRecord && currentRecord.fez_record_search_key_issn) || [];
    const issnEntry = fsrkIssn.find(entry => entry.rek_issn === issn);
    const hasPreload = !!issnEntry;

    if (hasPreload) {
        sherpaRomeo[issn] = issnEntry.fez_sherpa_romeo || {
            // Presence of issn key prevents further lookup.
            srm_issn: issn,
        };
        ulrichs[issn] = issnEntry.fez_ulrichs || {
            ulr_issn: issn,
        };
    }

    // Absence of issn key is used to indicate ongoing api call.
    const loadingSherpaFromIssn = !!sherpaRomeo[issn] && !sherpaRomeo[issn].srm_issn;
    const loadingUlrichsFromIssn = !!ulrichs[issn] && !ulrichs[issn].ulr_issn;

    const sherpaEntry =
        !loadingSherpaFromIssn && !sherpaLoadFromIssnError[issn] && sherpaRomeo && getValidSherpa(sherpaRomeo, issn);
    const ulrichsEntry =
        !loadingUlrichsFromIssn && !ulrichsLoadFromIssnError[issn] && ulrichs && getValidUlrichs(ulrichs, issn);

    return {
        hasPreload,
        loadingSherpaFromIssn,
        loadingUlrichsFromIssn,
        item: {
            ...((typeof item === 'object' && item) || {}),
            key: issn,
            value: {
                ...(((typeof item === 'object' && item) || {}).value || {}),
                sherpaRomeo: {
                    link: getSherpaLink(sherpaEntry),
                },
                ulrichs:
                    (ulrichsEntry && {
                        link:
                            ulrichsEntry.ulr_title_id &&
                            globalLocale.global.ulrichsLink.externalUrl.replace('[id]', ulrichsEntry.ulr_title_id),
                        title: ulrichsEntry.ulr_title || '',
                    }) ||
                    {},
            },
        },
    };
};

/* istanbul ignore next */
export const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch),
});

const IssnRowItemTemplateContainer = connect(mapStateToProps, mapDispatchToProps)(IssnRowItemTemplate);

export default IssnRowItemTemplateContainer;
