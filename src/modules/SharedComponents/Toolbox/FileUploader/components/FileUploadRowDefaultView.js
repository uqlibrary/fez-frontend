import React from 'react';
import PropTypes from 'prop-types';

import FileUploadEmbargoDate from './FileUploadEmbargoDate';
import FileUploadRowStatus from './FileUploadRowStatus';

import { FILE_ACCESS_CONDITION_OPEN, FILE_ACCESS_OPTIONS, FILE_SECURITY_POLICY_PUBLIC } from '../config';
import { selectFields } from 'locale/selectFields';

import Box from '@mui/material/Box';
import Grid from '@mui/material/GridLegacy';
import Typography from '@mui/material/Typography';
import Input from '@mui/material/Input';
import { NewGenericSelectField } from 'modules/SharedComponents/GenericSelectField';
import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import { PolicyDropdown } from 'modules/Admin/components/security/PolicyDropdown';

export const FileUploadRowDefaultView = ({
    index,
    name,
    size,
    accessConditionId,
    embargoDate,
    securityPolicy,
    requireOpenAccessStatus,
    disabled,
    locale = { embargoDateClosedAccess: 'No date required' },
    onDelete,
    onEmbargoDateChange,
    onFileDescriptionChange,
    onAccessConditionChange,
    onSecurityPolicyChange,
    focusOnIndex,
    accessConditionLocale,
    fileUploadRowViewId,
    isAdmin,
}) => {
    const { embargoDateClosedAccess } = locale;

    return (
        <Box
            style={{}}
            data-testid={fileUploadRowViewId}
            sx={{
                flexGrow: 1,
                padding: '4px',
                borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
                marginBottom: '12px',
            }}
        >
            <Grid container direction="row" alignItems="center" spacing={1}>
                <Grid item md={!requireOpenAccessStatus ? 8 : 3} sm={!requireOpenAccessStatus ? 8 : 2}>
                    <Typography variant="body2" gutterBottom noWrap data-testid={`dsi-dsid-${index}`}>
                        {name} ({size})
                    </Typography>
                </Grid>
                <Grid item sm={3} md={3}>
                    <TextField
                        fullWidth
                        onChange={onFileDescriptionChange}
                        name="fileDescription"
                        placeholder={'Description'}
                        id={`file-description-input-upload-${index}`}
                        textFieldId={`dsi-label-upload-${index}`}
                        key={name}
                        inputProps={{
                            maxLength: 255,
                        }}
                    />
                </Grid>
                {!!isAdmin && requireOpenAccessStatus && (
                    <Grid item md={3} sm={4}>
                        <PolicyDropdown
                            fieldName={name}
                            hideLabel
                            required
                            displayEmpty
                            disabled={disabled}
                            displayPrompt
                            autoFocus={index === focusOnIndex}
                            input={{
                                sx: { maxWidth: 200, fontSize: '14px' },
                                disableUnderline: true,
                                autoFocus: index === focusOnIndex,
                                onChange: onSecurityPolicyChange,
                                onBlur: /* istanbul ignore next */ () => {},
                            }}
                            value={securityPolicy ?? ''}
                            errorText={!securityPolicy && selectFields.securityPolicy.errorMessage}
                            prompt={selectFields.securityPolicy.selectPrompt}
                            policyDropdownId={`dsi-security-policy-${index}`}
                            formHelperTextProps={{
                                sx: { marginTop: 0, fontSize: '10px' },
                            }}
                        />
                    </Grid>
                )}
                {!!!isAdmin && requireOpenAccessStatus && (
                    <Grid item md={3} sm={3}>
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
                                sx: { maxWidth: 200, fontSize: '14px' },
                                input: (
                                    <Input
                                        disableUnderline
                                        autoFocus={index === focusOnIndex}
                                        sx={{
                                            ...(!!accessConditionId
                                                ? { fontWeight: 400 }
                                                : { color: 'rgba(0, 0, 0, 0.5)' }),
                                        }}
                                    />
                                ),
                            }}
                            formHelperTextProps={{
                                sx: { marginTop: 0, fontSize: '10px' },
                            }}
                            error={!accessConditionId && selectFields.accessCondition.errorMessage}
                            selectPrompt={selectFields.accessCondition.selectPrompt}
                        />
                    </Grid>
                )}
                {requireOpenAccessStatus && (
                    <Grid item sm={2}>
                        {((isAdmin && securityPolicy !== FILE_SECURITY_POLICY_PUBLIC) ||
                            (!isAdmin && accessConditionId !== FILE_ACCESS_CONDITION_OPEN)) && (
                            <Typography
                                variant="body2"
                                component={'div'}
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
                                minDate={new Date()}
                                onChange={onEmbargoDateChange}
                                disabled={disabled}
                                fileUploadEmbargoDateId={`dsi-embargo-date-${index}`}
                            />
                        )}
                    </Grid>
                )}
                <Grid item xs={1} sx={{ textAlign: 'center' }}>
                    <FileUploadRowStatus
                        disabled={disabled}
                        onDelete={onDelete}
                        name={name}
                        fileUploadRowStatusId={`dsi-dsid-${index}`}
                    />
                </Grid>
            </Grid>
        </Box>
    );
};
FileUploadRowDefaultView.propTypes = {
    index: PropTypes.number.isRequired,
    name: PropTypes.string,
    rowCount: PropTypes.number,
    size: PropTypes.string,
    accessConditionId: PropTypes.number,
    embargoDate: PropTypes.string,
    securityPolicy: PropTypes.number,
    requireOpenAccessStatus: PropTypes.bool.isRequired,
    disabled: PropTypes.bool,
    locale: PropTypes.object,
    onDelete: PropTypes.func.isRequired,
    onEmbargoDateChange: PropTypes.func.isRequired,
    onFileDescriptionChange: PropTypes.func.isRequired,
    onAccessConditionChange: PropTypes.func.isRequired,
    onOrderUpClick: PropTypes.func,
    onOrderDownClick: PropTypes.func,
    onSecurityPolicyChange: PropTypes.func.isRequired,
    focusOnIndex: PropTypes.number,
    accessConditionLocale: PropTypes.object,
    fileUploadRowViewId: PropTypes.string,
    isAdmin: PropTypes.bool,
};

export default React.memo(FileUploadRowDefaultView);
