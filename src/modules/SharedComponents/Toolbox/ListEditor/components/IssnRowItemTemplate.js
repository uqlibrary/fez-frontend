import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { ExternalLink } from 'modules/SharedComponents/ExternalLink';
import { default as globalLocale } from 'locale/global';

export const IssnRowItemTemplate = ({ actions, item, sherpaRomeo }) => {
    const [issn, setIssn] = React.useState(
        !!item.key
            ? item
            : {
                key: item,
            },
    );

    React.useEffect(() => {
        if (!issn.value) {
            if (sherpaRomeo) {
                setIssn({
                    ...issn,
                    value: {
                        sherpaRomeo,
                    },
                });
            } else {
                actions.getSherpaFromIssn(issn.key);
            }
        }
    }, [actions, issn, sherpaRomeo]);

    return (
        <React.Fragment>
            <Typography variant="body2" component={'span'}>
                <span>{issn.key}</span>{' '}
                {!!issn.value && !!issn.value.sherpaRomeo && !!issn.value.sherpaRomeo.link && (
                    <ExternalLink
                        href={issn.value.sherpaRomeo.link}
                        aria-label={globalLocale.global.sherpaRomeoLink.ariaLabel}
                        title={issn.value.sherpaRomeo.title}
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
