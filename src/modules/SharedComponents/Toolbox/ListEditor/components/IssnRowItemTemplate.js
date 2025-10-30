import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from 'actions';
import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import { ExternalLink } from 'modules/SharedComponents/ExternalLink';
import { default as globalLocale } from 'locale/global';

export const IssnRowItemTemplate = React.memo(
    ({ actions, hasPreload, item }) => {
        React.useEffect(() => {
            !hasPreload && actions.getSherpaFromIssn(item.key);
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [hasPreload, item.key]);

        React.useEffect(() => {
            !hasPreload && actions.getUlrichsFromIssn(item.key);
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [hasPreload, item.key]);

        return (
            <React.Fragment>
                <Typography variant="body2" component="span">
                    {item.key}
                </Typography>
                {!!item.value && !!item.value.sherpaRomeo && !!item.value.sherpaRomeo.link && (
                    <Typography variant="body2" style={{ paddingLeft: 8 }} component="span">
                        <ExternalLink
                            href={item.value.sherpaRomeo.link}
                            aria-label={globalLocale.global.sherpaRomeoLink.ariaLabel}
                            title={globalLocale.global.sherpaRomeoLink.title}
                            id="sherparomeo"
                        >
                            {globalLocale.global.sherpaRomeoLink.externalLinktext}
                        </ExternalLink>
                    </Typography>
                )}
                {!!item.value && !!item.value.ulrichs && !!item.value.ulrichs.link && (
                    <Typography variant="body2" style={{ paddingLeft: 8 }} component="span">
                        <ExternalLink
                            href={item.value.ulrichs.link}
                            aria-label={globalLocale.global.ulrichsLink.ariaLabel}
                            title={item.value.ulrichs.title}
                            id="ulrichs"
                        >
                            {globalLocale.global.ulrichsLink.externalLinktext}
                        </ExternalLink>
                    </Typography>
                )}
            </React.Fragment>
        );
    },
    (prevProps, nextProps) =>
        /* c8 ignore next */
        prevProps.item.key === nextProps.item.key &&
        prevProps.item.value.sherpaRomeo.link === nextProps.item.value.sherpaRomeo.link &&
        prevProps.item.value.ulrichs.link === nextProps.item.value.ulrichs.link,
);

IssnRowItemTemplate.propTypes = {
    actions: PropTypes.object,
    hasPreload: PropTypes.bool,
    item: PropTypes.object,
};

export const getValidSherpa = (sherpaData, issn) =>
    sherpaData[issn] &&
    sherpaData.srm_journal_name !== 'Not found in Sherpa Romeo' &&
    sherpaData[issn].srm_issn === issn &&
    sherpaData[issn];

export const getValidUlrichs = (ulrichsData, issn) =>
    ulrichsData[issn] && ulrichsData[issn].ulr_title !== '' && ulrichsData[issn].ulr_issn === issn && ulrichsData[issn];

/**
 * Returns non-empty journal link for valid records, or link to legacy site if
 * colour is found.
 */
export const getSherpaLink = sherpaEntry => {
    if (!sherpaEntry) {
        return '';
    }
    if (!!sherpaEntry.srm_journal_link) {
        return sherpaEntry.srm_journal_link;
    }
    const validOldColours = ['green', 'blue', 'yellow', 'white'];
    if (validOldColours.includes(sherpaEntry.srm_colour) && !!sherpaEntry.srm_issn) {
        return globalLocale.global.sherpaRomeoLink.externalUrl.replace('[id]', sherpaEntry.srm_issn);
    }
    return '';
};

export const getUlrichsLink = ulrichsEntry =>
    (!!ulrichsEntry &&
        !!ulrichsEntry.ulr_title_id &&
        globalLocale.global.ulrichsLink.externalUrl.replace('[id]', encodeURIComponent(ulrichsEntry.ulr_title_id))) ||
    '';

export const mapStateToProps = (state, props) => {
    const { item } = props;
    const issn = item.key || item;
    const {
        sherpaLoadFromIssnError,
        sherpaRomeo,
        ulrichs,
        ulrichsLoadFromIssnError,
        loadingSherpaFromIssn,
        loadingUlrichsFromIssn,
    } = state.get('issnLinksReducer');

    const sherpaEntry =
        (!!item.hasPreload && getValidSherpa({ [issn]: item.value.fez_sherpa_romeo }, issn)) ||
        (!loadingSherpaFromIssn && !sherpaLoadFromIssnError[issn] && getValidSherpa(sherpaRomeo, issn));
    const ulrichsEntry =
        (!!item.hasPreload && getValidUlrichs({ [issn]: item.value.fez_ulrichs }, issn)) ||
        (!loadingUlrichsFromIssn && !ulrichsLoadFromIssnError[issn] && getValidUlrichs(ulrichs, issn));

    return {
        hasPreload: !!item.hasPreload,
        item: {
            key: issn,
            value: {
                sherpaRomeo: {
                    link: getSherpaLink(sherpaEntry),
                },
                ulrichs: {
                    link: getUlrichsLink(ulrichsEntry),
                    title: (!!ulrichsEntry && ulrichsEntry.ulr_title) || '',
                },
            },
        },
    };
};

/* c8 ignore next */
export const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch),
});

const IssnRowItemTemplateContainer = connect(mapStateToProps, mapDispatchToProps)(IssnRowItemTemplate);

export default IssnRowItemTemplateContainer;
