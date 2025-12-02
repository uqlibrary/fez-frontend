import * as React from 'react';

export type AlertType =
    | 'error'
    | 'error_outline'
    | 'warning'
    | 'info'
    | 'info_outline'
    | 'help'
    | 'help_outline'
    | 'success'
    | 'done'
    | 'custom';

export type CustomAlertType =
    | null
    | 'error'
    | 'error_outline'
    | 'warning'
    | 'info'
    | 'info_outline'
    | 'help'
    | 'help_outline'
    | 'done'
    | 'custom';

export interface AlertProps {
    action?: () => void;
    actionButtonLabel?: string;
    allowDismiss?: boolean;
    customIcon?: React.ReactNode | null;
    customType?: CustomAlertType;
    disableAlertClick?: boolean;
    dismissAction?: () => void;
    dismissTitle?: string;
    message: React.ReactNode; // required
    showLoader?: boolean;
    alertId?: string;
    title?: string;
    type?: AlertType;
    wiggle?: boolean | null;
}

declare const Alert: React.FC<AlertProps>;
export default Alert;
export { Alert };
