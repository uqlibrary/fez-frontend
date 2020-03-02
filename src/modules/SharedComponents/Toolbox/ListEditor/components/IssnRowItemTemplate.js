import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { ExternalLink } from 'modules/SharedComponents/ExternalLink';
import { default as globalLocale } from 'locale/global';

export const IssnRowItemTemplate = ({ actions, item, sherpaRomeo }) => {
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
        if ((item.key || item) !== issn.key) {
            setIssn(convertItem(item));
        }

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
    }, [actions, issn, item, sherpaRomeo]);

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
                    !!issn.value.ulrichs.link && <span> or </span>}
                {!!issn.value && !!issn.value.ulrichs && !!issn.value.ulrichs.link && !!issn.value.ulrichs.linkText && (
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
    item: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    actions: PropTypes.object,
    sherpaRomeo: PropTypes.object,
};

export default IssnRowItemTemplate;
