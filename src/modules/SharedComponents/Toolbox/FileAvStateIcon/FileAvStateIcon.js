import React from 'react';
import PropTypes from 'prop-types';
// import { ShieldOutlined, GppGood, Coronavirus, GppMaybe } from '@mui/material';
// import ShieldOutlined from '@mui/icons-material/ShieldOutlined';
// import GppGood from '@mui/icons-material/GppGood';
// import Coronavirus from '@mui/icons-material/Coronavirus';
// import GppMaybe from '@mui/icons-material/GppMaybe';
// import { ReactComponent as ShieldOutlined } from '../../../../images/material-icons/shield_black_24dp.svg';
// import { ReactComponent as GppGood } from '../../../../images/material-icons/gpp_good_black_24dp.svg.svg';
// import { ReactComponent as Coronavirus } from '../../../../images/material-icons/coronavirus_black_24dp.svg';
// import { ReactComponent as GppMaybe } from '../../../../images/material-icons/gpp_maybe_black_24dp.svg';
import ShieldOutlined from '@material-ui/icons/VolumeUp';
import GppGood from '@material-ui/icons/VolumeUp';
import Coronavirus from '@material-ui/icons/VolumeUp';
import GppMaybe from '@material-ui/icons/VolumeUp';

import {
    AV_CHECK_STATE_CLEAN,
    AV_CHECK_STATE_DEFAULT,
    AV_CHECK_STATE_INFECTED,
    AV_CHECK_STATE_UNSCANNABLE,
} from '../../../../config/general';
import Tooltip from '@material-ui/core/Tooltip';
import moment from 'moment';
import { sanitiseId } from '../../../../helpers/general';
import { getAvStateDescription } from '../../../../helpers/datastreams';

export const UTCDateToCurrentTZDate = date =>
    moment
        .utc(date)
        .local()
        .format('lll');

export const getTestId = (state, id) => `${sanitiseId(id)}-file-av-state-icon-${state ?? AV_CHECK_STATE_DEFAULT}`;
const getIcon = (state, id) => {
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
    return <Tooltip title={getAvStateDescription(state, checkedAt)}>{getIcon(state, id)}</Tooltip>;
};

FileAvStateIcon.propTypes = {
    state: PropTypes.string,
    checkedAt: PropTypes.string,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default FileAvStateIcon;
