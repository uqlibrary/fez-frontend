import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import FileUploadEmbargoDate from './FileUploadEmbargoDate';
import FileUploadRowStatus from './FileUploadRowStatus';
import { NewGenericSelectField } from 'modules/SharedComponents/GenericSelectField';
import { PolicyDropdown } from 'modules/Admin/components/security/PolicyDropdown';

import { FILE_ACCESS_CONDITION_OPEN, FILE_ACCESS_OPTIONS, FILE_SECURITY_POLICY_PUBLIC } from '../config';
import { selectFields } from 'locale/selectFields';

import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import Attachment from '@mui/icons-material/Attachment';
import CalendarTodayOutlined from '@mui/icons-material/CalendarTodayOutlined';
import LockOutlined from '@mui/icons-material/LockOutlined';
import Input from '@mui/material/Input';

export const FileUploadRowMobileView = ({
    index,
    name,
    size,
    accessConditionId,
    embargoDate,
    securityPolicy,
    requireOpenAccessStatus,
    disabled,
    locale = {
        filenameColumn: 'File name',
        fileAccessColumn: 'File access',
        embargoDateColumn: 'Embargo date',
        embargoDateClosedAccess: 'No date required',
    },
    onDelete,
    onEmbargoDateChange,
    onAccessConditionChange,
    onSecurityPolicyChange,
    focusOnIndex,
    accessConditionLocale,
    fileUploadRowViewId,
    isAdmin,
}) => {
    const { filenameColumn, fileAccessColumn, embargoDateColumn, embargoDateClosedAccess } = locale;

    return (
        <List
            sx={{ borderBottom: '1px solid', borderBottomColor: 'secondary.light' }}
            data-testid={fileUploadRowViewId}
        >
            <ListItem sx={{ px: 0 }}>
                <ListItemIcon>
                    <Attachment />
                </ListItemIcon>
                <ListItemText
                    primary={`${name} (${size})`}
                    secondary={filenameColumn}
                    data-analyticsid={`dsi-dsid-${index}`}
                    data-testid={`dsi-dsid-${index}`}
                    slotProps={{
                        primary: { variant: 'body1', noWrap: true },
                        secondary: { variant: 'caption' },
                    }}
                />
            </ListItem>
            {requireOpenAccessStatus && (
                <Fragment>
                    <ListItem sx={{ px: 0 }}>
                        <ListItemIcon>
                            <LockOutlined />
                        </ListItemIcon>
                        <ListItemText
                            secondary={fileAccessColumn}
                            slotProps={{
                                secondary: { variant: 'caption' },
                            }}
                        >
                            {!!isAdmin && requireOpenAccessStatus && (
                                <PolicyDropdown
                                    fieldName={name}
                                    hideLabel
                                    required
                                    displayEmpty
                                    disabled={disabled}
                                    displayPrompt
                                    autoFocus={index === focusOnIndex}
                                    input={{
                                        disableUnderline: true,
                                        autoFocus: index === focusOnIndex,
                                        onChange: onSecurityPolicyChange,
                                        onBlur: /* istanbul ignore next */ () => {},
                                    }}
                                    value={securityPolicy ?? ''}
                                    errorText={!securityPolicy && selectFields.securityPolicy.errorMessage}
                                    prompt={selectFields.securityPolicy.selectPrompt}
                                    policyDropdownId={`dsi-security-policy-${index}`}
                                />
                            )}
                            {!!!isAdmin && (
                                <NewGenericSelectField
                                    value={accessConditionId || ''}
                                    onChange={onAccessConditionChange}
                                    disabled={disabled}
                                    autoFocus={index === focusOnIndex}
                                    locale={accessConditionLocale}
                                    genericSelectFieldId={`dsi-open-access-${index}`}
                                    itemsList={FILE_ACCESS_OPTIONS}
                                    displayEmpty
                                    hideLabel
                                    required
                                    selectProps={{
                                        input: <Input disableUnderline autoFocus={index === focusOnIndex} />,
                                    }}
                                    error={!accessConditionId && selectFields.accessCondition.errorMessage}
                                    selectPrompt={selectFields.accessCondition.selectPrompt}
                                />
                            )}
                        </ListItemText>
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                        <ListItemIcon>
                            <CalendarTodayOutlined />
                        </ListItemIcon>
                        <ListItemText
                            secondary={embargoDateColumn}
                            slotProps={{
                                primary: { variant: 'body1' },
                                secondary: { variant: 'caption' },
                            }}
                        >
                            {((isAdmin && securityPolicy !== FILE_SECURITY_POLICY_PUBLIC) ||
                                (!isAdmin && accessConditionId !== FILE_ACCESS_CONDITION_OPEN)) && (
                                <Typography
                                    variant="body2"
                                    component={'span'}
                                    gutterBottom
                                    data-testid={`dsi-embargo-date-${index}`}
                                >
                                    {embargoDateClosedAccess}
                                </Typography>
                            )}
                            {((isAdmin && securityPolicy === FILE_SECURITY_POLICY_PUBLIC) ||
                                (!isAdmin && accessConditionId === FILE_ACCESS_CONDITION_OPEN)) && (
                                <FileUploadEmbargoDate
                                    value={embargoDate}
                                    onChange={onEmbargoDateChange}
                                    disabled={disabled}
                                    minDate={new Date()}
                                    fileUploadEmbargoDateId={`dsi-embargo-date-${index}`}
                                />
                            )}
                        </ListItemText>
                        <ListItemSecondaryAction sx={{ textAlign: 'center' }}>
                            <FileUploadRowStatus
                                disabled={disabled}
                                onDelete={onDelete}
                                name={name}
                                fileUploadRowStatusId={`dsi-dsid-${index}`}
                            />
                        </ListItemSecondaryAction>
                    </ListItem>
                </Fragment>
            )}
        </List>
    );
};
FileUploadRowMobileView.propTypes = {
    index: PropTypes.number.isRequired,
    name: PropTypes.string,
    size: PropTypes.string,
    accessConditionId: PropTypes.number,
    embargoDate: PropTypes.string,
    securityPolicy: PropTypes.number,
    requireOpenAccessStatus: PropTypes.bool.isRequired,
    disabled: PropTypes.bool,
    locale: PropTypes.object,
    onDelete: PropTypes.func.isRequired,
    onEmbargoDateChange: PropTypes.func.isRequired,
    onAccessConditionChange: PropTypes.func.isRequired,
    onSecurityPolicyChange: PropTypes.func.isRequired,
    focusOnIndex: PropTypes.number,
    accessConditionLocale: PropTypes.object,
    fileUploadRowViewId: PropTypes.string,
    isAdmin: PropTypes.bool,
};

export default FileUploadRowMobileView;
