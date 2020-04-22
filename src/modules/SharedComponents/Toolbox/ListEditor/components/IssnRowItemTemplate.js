import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from 'actions';
import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { ExternalLink } from 'modules/SharedComponents/ExternalLink';
import { default as globalLocale } from 'locale/global';

export const IssnRowItemTemplate = ({
    actions,
    item,
    loadingSherpaFromIssn,
    loadingUlrichsFromIssn,
    sherpaRomeo,
    ulrichs,
}) => {
    const convertItem = theItem =>
        !!theItem.key
            ? theItem
            : {
                key: theItem,
                value: {
                    sherpaRomeo: {
                        link: '',
                    },
                    ulrichs: {
                        link: '',
                    },
                },
            };

    const [issn, setIssn] = React.useState(convertItem(item));

    React.useEffect(() => {
        const issnFromProp = item.key || item;
        if (issnFromProp !== issn.key) {
            setIssn(convertItem(issnFromProp));
        }
    }, [issn, item]);

    React.useEffect(() => {
        if (!issn.value || !issn.value.sherpaRomeo || !issn.value.sherpaRomeo.link) {
            if (sherpaRomeo) {
                setIssn({
                    ...issn,
                    value: {
                        ...issn.value,
                        sherpaRomeo,
                    },
                });
            } else {
                !loadingSherpaFromIssn && actions.getSherpaFromIssn(issn.key);
            }
        }
    }, [actions, issn, loadingSherpaFromIssn, sherpaRomeo]);

    React.useEffect(() => {
        if (!issn.value || !issn.value.ulrichs || !issn.value.ulrichs.link) {
            if (ulrichs) {
                setIssn({
                    ...issn,
                    value: {
                        ...issn.value,
                        ulrichs,
                    },
                });
            } else {
                !loadingUlrichsFromIssn && actions.getUlrichsFromIssn(issn.key);
            }
        }
    }, [actions, issn, loadingUlrichsFromIssn, ulrichs]);

    return (
        <React.Fragment>
            <Typography variant="body2" component={'span'}>
                <span>{issn.key}</span>{' '}
                {!!issn.value && !!issn.value.sherpaRomeo && !!issn.value.sherpaRomeo.link && (
                    <ExternalLink
                        href={issn.value.sherpaRomeo.link}
                        aria-label={globalLocale.global.sherpaRomeoLink.ariaLabel}
                        title={globalLocale.global.sherpaRomeoLink.title}
                    >
                        {globalLocale.global.sherpaRomeoLink.externalLinktext}
                    </ExternalLink>
                )}
                {!!issn.value &&
                    !!issn.value.sherpaRomeo &&
                    !!issn.value.sherpaRomeo.link &&
                    !!issn.value.ulrichs &&
                    !!issn.value.ulrichs.link && <span> &nbsp;</span>}
                {!!issn.value && !!issn.value.ulrichs && !!issn.value.ulrichs.link && (
                    <ExternalLink
                        href={issn.value.ulrichs.link}
                        aria-label={globalLocale.global.ulrichsLink.ariaLabel}
                        title={issn.value.ulrichs.title}
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
    item: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    loadingSherpaFromIssn: PropTypes.bool,
    loadingUlrichsFromIssn: PropTypes.bool,
    sherpaRomeo: PropTypes.object,
    ulrichs: PropTypes.object,
};

export const getValidSherpa = (sherpaData, item) => {
    const validSherpaKey = Object.keys(sherpaData).find(
        issn =>
            sherpaData[issn].srm_journal_name !== '' &&
            sherpaData[issn].srm_journal_name !== 'Not found in Sherpa Romeo' &&
            sherpaData[issn].srm_issn === (item && (item.key || item)),
    );
    return sherpaData[validSherpaKey];
};

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

export const getValidUlrichs = (ulrichsData, item) => {
    const validUlrichsKey = Object.keys(ulrichsData).find(
        issn => ulrichsData[issn].ulr_title !== '' && ulrichsData[issn].ulr_issn === (item && (item.key || item)),
    );
    return ulrichsData[validUlrichsKey];
};

export const mapStateToProps = (state, props) => {
    const { item } = props;
    const {
        loadingSherpaFromIssn,
        loadingUlrichsFromIssn,
        sherpaLoadFromIssnError,
        sherpaRomeo,
        ulrichs,
        ulrichsLoadFromIssnError,
    } = state.get('issnLinksReducer');

    const sherpaEntry =
        !loadingSherpaFromIssn && !sherpaLoadFromIssnError && sherpaRomeo && getValidSherpa(sherpaRomeo, item);
    const ulrichsEntry =
        !loadingUlrichsFromIssn && !ulrichsLoadFromIssnError && ulrichs && getValidUlrichs(ulrichs, item);

    return {
        loadingSherpaFromIssn,
        loadingUlrichsFromIssn,
        sherpaRomeo:
            (sherpaEntry && {
                link: getSherpaLink(sherpaEntry),
            }) ||
            null,
        ulrichs:
            (ulrichsEntry && {
                link:
                    ulrichsEntry.ulr_issn &&
                    globalLocale.global.ulrichsLink.externalUrl.replace('[id]', ulrichsEntry.ulr_title_id),
                title: ulrichsEntry.ulr_title || '',
            }) ||
            null,
    };
};

/* istanbul ignore next */
export const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch),
});

const IssnRowItemTemplateContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(IssnRowItemTemplate);

export default IssnRowItemTemplateContainer;
