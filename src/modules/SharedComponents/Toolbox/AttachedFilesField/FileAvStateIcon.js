import React from 'react';
import PropTypes from 'prop-types';
import { ShieldOutlined, GppGood, Coronavirus, GppMaybe } from '@mui/icons-material';
import {
    AV_CHECK_STATE_CLEAN,
    AV_CHECK_STATE_INFECTED,
    AV_CHECK_STATE_UNSCANNABLE,
    AV_CHECK_STATES,
} from '../../../../config/general';
import Tooltip from '@material-ui/core/Tooltip';
import moment from 'moment-timezone';
import { locale } from '../../../../locale';

export const UTCDateToCurrentTZDate = date =>
    moment
        .utc(date)
        .tz(moment.tz.guess())
        .format('lll');

const defaultState = 'default';
export const getStateIconId = state => `file-av-state-icon-${state ?? defaultState}`;
const getStateIcon = state => {
    const props = { 'data-testid': getStateIconId(state), id: getStateIconId(state) };
    switch (state) {
        case AV_CHECK_STATE_CLEAN:
            return <GppGood {...props} />;
        case AV_CHECK_STATE_INFECTED:
            return <Coronavirus {...props} />;
            break;
        case AV_CHECK_STATE_UNSCANNABLE:
            return <GppMaybe {...props} />;
        default:
            return <ShieldOutlined {...props} />;
    }
};

export const FileAvStateIcon = ({ state, checkedAt }) => {
    const txt = locale.components.fileAvStateIcon;
    const description = txt.description.map[AV_CHECK_STATES.includes(state) ? state : defaultState]?.(
        UTCDateToCurrentTZDate(checkedAt),
    );

    return <Tooltip title={description}>{getStateIcon(state)}</Tooltip>;
};

FileAvStateIcon.propTypes = {
    state: PropTypes.string,
    checkedAt: PropTypes.string,
};

export default FileAvStateIcon;
