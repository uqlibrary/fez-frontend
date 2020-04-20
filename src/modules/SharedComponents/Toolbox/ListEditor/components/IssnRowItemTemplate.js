import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { ExternalLink } from 'modules/SharedComponents/ExternalLink';
import { default as globalLocale } from 'locale/global';

export const IssnRowItemTemplate = ({ actions, item, sherpaRomeo, ulrichs }) => {
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
                actions.getSherpaFromIssn(issn.key);
            }
        }
    }, [actions, issn, sherpaRomeo]);

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
                actions.getUlrichsFromIssn(issn.key);
            }
        }
    }, [actions, issn, ulrichs]);

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
    sherpaRomeo: PropTypes.object,
    ulrichs: PropTypes.object,
};

export default IssnRowItemTemplate;
