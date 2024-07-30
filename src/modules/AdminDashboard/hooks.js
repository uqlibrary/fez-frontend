import React from 'react';
import moment from 'moment';

import { useDispatch } from 'react-redux';
import { useConfirmationState } from 'hooks';
import { isEmptyStr } from './utils';

export const useSystemAlertDrawer = data => {
    const [_open, _setOpen] = React.useState(false);
    const [_row, _setRow] = React.useState({});

    React.useEffect(() => {
        if (_open) {
            _setRow(data?.find(item => item.sat_id === _row.sat_id) || {});
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

export const useValidateReport = ({ locale, displayReport, fromDate, toDate, systemAlertId }) => {
    const [fromDateError, setFromDateError] = React.useState('');
    const [toDateError, setToDateError] = React.useState('');
    const [systemAlertError, setSystemAlertError] = React.useState('');

    const isValidNumber = value => {
        const numValue = Number(value);
        return isEmptyStr(`${value}`) || (Number.isFinite(numValue) && numValue > 0 && !`${value}`.includes('.'));
    };
    const isValid = React.useMemo(() => {
        if (!!displayReport) {
            setFromDateError('');
            setToDateError('');
            setSystemAlertError('');

            if (displayReport === 'systemalertlog') {
                const validSystemId = isValidNumber(systemAlertId);
                if (!!!fromDate && !!!toDate && validSystemId) return true;
                else if (!validSystemId) {
                    setSystemAlertError(locale.systemAlertId);
                    return false;
                }
            }

            const mFrom = moment(fromDate);
            const mTo = moment(toDate);

            if (displayReport === 'workshistory' && !mFrom.isValid() && !mTo.isValid()) {
                setFromDateError(locale.required);
                setToDateError(locale.required);
                return false;
            }

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
        _hideAlert();
    };

    React.useEffect(() => {
        if (!alertIsVisible) {
            if (!isEmptyStr(message)) showAlert();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [alertIsVisible, message]);
    return [alertIsVisible, hideAlert];
};
