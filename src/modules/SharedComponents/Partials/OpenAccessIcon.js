import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { locale } from 'locale';
import { openAccessConfig } from 'config';
import Lock from '@mui/icons-material/Lock';
import LockOpen from '@mui/icons-material/LockOpen';
import LockClockOutlined from '@mui/icons-material/LockClock';
import Tooltip from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';

export const getIconTestId = id => `${id}-icon`;

export const OpenAccessIcon = ({
    style,
    isOpenAccess,
    embargoDate,
    openAccessStatusId,
    showEmbargoText,
    securityStatus,
}) => {
    const txt = locale.viewRecord.sections.links;

    if (!securityStatus) {
        return (
            <Tooltip title={txt.securityLocked} placement="left" TransitionComponent={Fade}>
                <Lock sx={{ ...style }} data-testid={getIconTestId('no-oa')} />
            </Tooltip>
        );
    } else if (isOpenAccess && !embargoDate) {
        const openAccessTitle =
            openAccessStatusId !== openAccessConfig.OPEN_ACCESS_ID_LINK_NO_DOI
                ? txt.openAccessLabel.replace('[oa_status]', openAccessConfig.labels[openAccessStatusId])
                : txt.labelOpenAccessNoStatus;

        return (
            <Tooltip title={openAccessTitle} placement="left" TransitionComponent={Fade}>
                <LockOpen sx={{ ...style }} data-testid={getIconTestId('oa')} />
            </Tooltip>
        );
    } else if (!isOpenAccess && !!embargoDate) {
        const openAccessTitle = txt.openAccessEmbargoedLabel
            .replace('[embargo_date]', embargoDate)
            .replace('[oa_status]', openAccessConfig.labels[openAccessStatusId]);
        return (
            <Fragment>
                {showEmbargoText && (
                    <span className="is-hidden-mobile is-hidden-tablet-only">
                        {txt.embargoedUntil.replace('[embargo_date]', embargoDate)}
                    </span>
                )}
                <Tooltip title={openAccessTitle} placement="left" TransitionComponent={Fade}>
                    <LockClockOutlined sx={{ ...style }} data-testid={getIconTestId('embargoed-oa')} />
                </Tooltip>
            </Fragment>
        );
    }
    return <span className="noOaIcon" data-testid={getIconTestId('oa-n/a')} />;
};

OpenAccessIcon.propTypes = {
    style: PropTypes.object,
    isOpenAccess: PropTypes.bool,
    embargoDate: PropTypes.string,
    openAccessStatusId: PropTypes.number,
    showEmbargoText: PropTypes.bool,
    securityStatus: PropTypes.bool,
};

OpenAccessIcon.defaultProps = {
    style: {},
    isOpenAccess: false,
    embargoDate: null,
    showEmbargoText: false,
    securityStatus: true,
};

export default OpenAccessIcon;
