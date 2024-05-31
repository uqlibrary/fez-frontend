import React from 'react';
import moment from 'moment';

import { useDispatch } from 'react-redux';
import { useConfirmationState } from 'hooks';
import { isEmptyStr } from './utils';

export const useSystemAlertDrawer = () => {
    const [_open, _setOpen] = React.useState(false);
    const [_row, _setRow] = React.useState({});
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

export const useValidateReport = ({ locale, displayReport, fromDate, toDate, systemAlertId }) => {
    const [fromDateError, setFromDateError] = React.useState('');
    const [toDateError, setToDateError] = React.useState('');
    const [systemAlertError, setSystemAlertError] = React.useState('');

    const isValid = React.useMemo(() => {
        if (!!displayReport) {
            setFromDateError('');
            setToDateError('');
            setSystemAlertError('');
            const _systemAlertId = Number(systemAlertId);

            if (
                displayReport === 'systemalertlog' &&
                systemAlertId.trim() !== '' &&
                (!Number.isFinite(_systemAlertId) || _systemAlertId <= 0)
            ) {
                setSystemAlertError(locale.systemAlertId);
                return false;
            }

            if (!!!fromDate && !!!toDate) return true;
            const mFrom = moment(fromDate);
            const mTo = moment(toDate);
            if (mFrom.isValid() && !mTo.isValid()) {
                setToDateError(locale.required);
                return false;
            } else if (mTo.isValid() && !mFrom.isValid()) {
                setFromDateError(locale.required);
                return false;
            } else if (mFrom.isValid() && mTo.isValid()) {
                if (!mFrom.isSameOrBefore(mTo)) {
                    setFromDateError(locale.dateNotAfter);
                    return false;
                } else return true;
            }
            return false;
        }
        return false;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [displayReport, fromDate, toDate, systemAlertId]);

    return { isValid, fromDateError, toDateError, systemAlertError };
};

export const useAlertStatus = ({ message, hideAction }) => {
    const dispatch = useDispatch();
    const [alertIsVisible, showAlert, _hideAlert] = useConfirmationState();
    const hideAlert = () => {
        dispatch(hideAction());
    };

    React.useEffect(() => {
        if (!alertIsVisible) {
            if (!isEmptyStr(message)) showAlert();
        } else if (isEmptyStr(message)) _hideAlert();
    }, [_hideAlert, alertIsVisible, message, showAlert]);
    return [alertIsVisible, hideAlert];
};
