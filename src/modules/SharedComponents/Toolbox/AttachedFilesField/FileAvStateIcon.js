import React from 'react';
import PropTypes from 'prop-types';
import { ShieldOutlined, GppGood, Coronavirus, GppMaybe } from '@mui/icons-material';
import { AV_CHECK_STATE_CLEAN, AV_CHECK_STATE_INFECTED, AV_CHECK_STATE_UNSCANNABLE } from '../../../../config/general';
import Tooltip from '@material-ui/core/Tooltip';
import moment from 'moment-timezone';

const UTCDateToCurrentTZDate = date =>
    moment
        .utc(date)
        .tz(moment.tz.guess())
        .format('lll');

export const FileAvStateIcon = ({ state, checkedAt }) => {
    let icon;
    let description;
    switch (state) {
        case AV_CHECK_STATE_CLEAN:
            description = `Clean of threats. Scanned at ${UTCDateToCurrentTZDate(checkedAt)}`;
            icon = <GppGood />;
            break;
        case AV_CHECK_STATE_INFECTED:
            description = `Flagged as infected at ${UTCDateToCurrentTZDate(checkedAt)}`;
            icon = <Coronavirus />;
            break;
        case AV_CHECK_STATE_UNSCANNABLE:
            description = 'File cannot be scanned for threats. e.g., too big, archive, encrypted';
            icon = <GppMaybe />;
            break;
        default:
            description = 'Not yet scanned for virus';
            icon = <ShieldOutlined />;
    }

    return <Tooltip title={description}>{icon}</Tooltip>;
};

FileAvStateIcon.propTypes = {
    state: PropTypes.string,
    checkedAt: PropTypes.string,
};

export default FileAvStateIcon;
