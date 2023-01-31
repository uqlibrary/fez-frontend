import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { locale } from 'locale';
import { openAccessConfig } from 'config';
import Tooltip from '@material-ui/core/Tooltip';
import Fade from '@material-ui/core/Fade';
// import { LockOpen, Lock, LockClockOutlined } from '@mui/icons-material';
// import LockOpen from '@mui/icons-material/LockOpen';
// import Lock from '@mui/icons-material/Lock';
// import LockClockOutlined from '@mui/icons-material/LockClockOutlined';
// import LockOpen from '../Icons/LockOpen';
// import Lock from '../Icons/Lock';
// import LockClockOutlined from '../Icons/LockClock';
import Lock from '@material-ui/icons/VolumeUp';
import LockOpen from '@material-ui/icons/VolumeUp';
import LockClockOutlined from '@material-ui/icons/VolumeUp';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
    svg: props => props.style,
});

export const OpenAccessIcon = ({
    style,
    isOpenAccess,
    embargoDate,
    openAccessStatusId,
    showEmbargoText,
    securityStatus,
}) => {
    const classes = useStyles({ style });
    const txt = locale.viewRecord.sections.links;

    if (!securityStatus) {
        return (
            <Tooltip title={txt.securityLocked} placement="left" TransitionComponent={Fade}>
                <Lock className={classes.svg} />
            </Tooltip>
        );
    } else if (isOpenAccess && !embargoDate) {
        const openAccessTitle =
            openAccessStatusId !== openAccessConfig.OPEN_ACCESS_ID_LINK_NO_DOI
                ? txt.openAccessLabel.replace('[oa_status]', openAccessConfig.labels[openAccessStatusId])
                : txt.labelOpenAccessNoStatus;

        return (
            <Tooltip title={openAccessTitle} placement="left" TransitionComponent={Fade}>
                <LockOpen className={classes.svg} />
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
                    <LockClockOutlined className={classes.svg} />
                </Tooltip>
            </Fragment>
        );
    }
    return <span className="noOaIcon" />;
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
