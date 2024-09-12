import React from 'react';

import { useDispatch } from 'react-redux';
import { useConfirmationState } from 'hooks';
import { isEmptyStr } from './utils';

export const useSystemAlertDrawer = data => {
    const [_open, _setOpen] = React.useState(false);
    const [_row, _setRow] = React.useState({});

    React.useEffect(() => {
        if (_open) {
            _setRow(data?.find(item => item.sat_id === _row.sat_id) || /* istanbul ignore next */ {});
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    const openDrawer = row => {
        _setRow(row);
        _setOpen(true);
    };
    const closeDrawer = () => {
        _setRow({});
        _setOpen(false);
    };
    return {
        open: _open,
        row: _row,
        openDrawer,
        closeDrawer,
    };
};

export const useAlertStatus = ({ message, hideAction }) => {
    const dispatch = useDispatch();
    const [alertIsVisible, _showAlert, _hideAlert] = useConfirmationState();
    const [_message, setMessage] = React.useState(message);

    const showAlert = message => {
        setMessage(message);
        _showAlert();
    };

    const hideAlert = () => {
        hideAction && dispatch(hideAction());
        _hideAlert();
    };

    React.useEffect(() => {
        if (!alertIsVisible) {
            if (!isEmptyStr(message)) _showAlert();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [alertIsVisible, message]);
    return [alertIsVisible, hideAlert, showAlert, _message];
};
