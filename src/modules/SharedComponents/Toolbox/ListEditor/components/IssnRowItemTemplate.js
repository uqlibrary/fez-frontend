import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { ExternalLink } from 'modules/SharedComponents/ExternalLink';
import { default as globalLocale } from 'locale/global';

export const IssnRowItemTemplate = ({ item }) => {
    return (
        <React.Fragment>
            <Typography variant="body2" component={'span'}>
                <span>{item.key}</span>{' '}
                {!!item.value && !!item.value.sherpaRomeo && !!item.value.sherpaRomeo.link && (
                    <ExternalLink
                        href={item.value.sherpaRomeo.link}
                        aria-label={globalLocale.global.sherpaRomeoLink.ariaLabel}
                        title={item.value.sherpaRomeo.title}
                    >
                        {globalLocale.global.sherpaRomeoLink.externalLinktext}
                    </ExternalLink>
                )}
                {!!item.value &&
                    !!item.value.sherpaRomeo &&
                    !!item.value.sherpaRomeo.link &&
                    !!item.value.ulrichs &&
                    !!item.value.ulrichs.link && <span> or </span>}
                {!!item.value && !!item.value.ulrichs.link && !!item.value.ulrichs.linkText && (
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
    item: PropTypes.object,
};
