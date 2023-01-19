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
import { sanitiseId } from '../../../../helpers/general';

export const UTCDateToCurrentTZDate = date =>
    moment
        .utc(date)
        .tz(moment.tz.guess())
        .format('lll');

const defaultState = 'default';
export const getAvState = state => (AV_CHECK_STATES.includes(state) ? state : defaultState);
export const getTestId = (state, id) => `${sanitiseId(id)}-file-av-state-icon-${state ?? defaultState}`;
const getAvStateIcon = (state, id) => {
    const props = { 'data-testid': getTestId(state, id), id: getTestId(state, id) };
    switch (state) {
        case AV_CHECK_STATE_CLEAN:
            return <GppGood {...props} />;
        case AV_CHECK_STATE_INFECTED:
            return <Coronavirus {...props} />;
        case AV_CHECK_STATE_UNSCANNABLE:
            return <GppMaybe {...props} />;
        default:
            return <ShieldOutlined {...props} />;
    }
};

export const FileAvStateIcon = ({ state, checkedAt, id }) => {
    const txt = locale.components.fileAvStateIcon;
    const description = txt.description.map[getAvState(state)]?.(UTCDateToCurrentTZDate(checkedAt));
    return <Tooltip title={description}>{getAvStateIcon(state, id)}</Tooltip>;
};

FileAvStateIcon.propTypes = {
    state: PropTypes.string,
    checkedAt: PropTypes.string,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default FileAvStateIcon;
