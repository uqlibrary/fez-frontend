import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import FileUploadEmbargoDate from './FileUploadEmbargoDate';
import FileUploadRowStatus from './FileUploadRowStatus';

import { FILE_ACCESS_CONDITION_OPEN, FILE_ACCESS_OPTIONS, FILE_SECURITY_POLICY_PUBLIC } from '../config';
import { selectFields } from 'locale/selectFields';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Input from '@mui/material/Input';
import withStyles from '@mui/styles/withStyles';
import { NewGenericSelectField } from 'modules/SharedComponents/GenericSelectField';
import IconButton from '@mui/material/IconButton';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import { PolicyDropdown } from 'modules/Admin/components/security/PolicyDropdown';

export class FileUploadRowDefaultView extends PureComponent {
    static propTypes = {
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
        classes: PropTypes.object,
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

    static defaultProps = {
        locale: {
            embargoDateClosedAccess: 'No date required',
        },
    };

    render() {
        const { embargoDateClosedAccess } = this.props.locale;
        const {
            disabled,
            index,
            rowCount,
            requireOpenAccessStatus,
            accessConditionId,
            embargoDate,
            securityPolicy,
            name,
            size,
            classes,
            focusOnIndex,
        } = this.props;
        return (
            <div
                style={{ flexGrow: 1, padding: 4 }}
                data-testid={this.props.fileUploadRowViewId}
                className={classes.row}
            >
                <Grid container direction="row" alignItems="center" spacing={1} wrap={'nowrap'}>
                    <Grid item xs={1} className={classes.upDownArrowContainer}>
                        <IconButton
                            disabled={index === 0}
                            id={`new-file-upload-down-${index}`}
                            data-analyticsid={`new-file-upload-up-${index}`}
                            data-testid={`new-file-upload-up-${index}`}
                            className={classes.upDownArrow}
                            onClick={this.props.onOrderUpClick}
                        >
                            <ExpandLessIcon />
                        </IconButton>
                    </Grid>
                </Grid>
                <Grid container direction="row" alignItems="center" spacing={1}>
                    <Grid item md={!requireOpenAccessStatus ? 8 : 3} sm={!requireOpenAccessStatus ? 8 : 2}>
                        <Typography variant="body2" gutterBottom noWrap data-testid={`dsi-dsid-${index}`}>
                            {name} ({size})
                        </Typography>
                    </Grid>
                    <Grid item sm={3} md={3}>
                        <TextField
                            fullWidth
                            className={classes.input}
                            onChange={this.props.onFileDescriptionChange}
                            name="fileDescription"
                            placeholder={'Description'}
                            id={`file-description-input-upload-${index}`}
                            textFieldId={`dsi-label-upload-${index}`}
                            key={this.props.name}
                            inputProps={{
                                maxLength: 255,
                            }}
                        />
                    </Grid>
                    {!!this.props.isAdmin && requireOpenAccessStatus && (
                        <Grid item md={3} sm={4}>
                            <PolicyDropdown
                                fieldName={name}
                                hideLabel
                                required
                                displayEmpty
                                disabled={disabled}
                                displayPrompt
                                autoFocus={index === focusOnIndex}
                                {...{
                                    input: {
                                        className: classes.selector,
                                        disableUnderline: true,
                                        autoFocus: index === focusOnIndex,
                                        onChange: this.props.onSecurityPolicyChange,
                                        onBlur: /* istanbul ignore next */ () => {},
                                    },
                                    value: securityPolicy ?? '',
                                }}
                                errorText={!securityPolicy && selectFields.securityPolicy.errorMessage}
                                prompt={selectFields.securityPolicy.selectPrompt}
                                policyDropdownId={`dsi-security-policy-${index}`}
                                formHelperTextProps={{
                                    className: classes.error,
                                }}
                            />
                        </Grid>
                    )}
                    {!!!this.props.isAdmin && requireOpenAccessStatus && (
                        <Grid item md={3} sm={3}>
                            <NewGenericSelectField
                                value={accessConditionId || ''}
                                onChange={this.props.onAccessConditionChange}
                                disabled={disabled}
                                autoFocus={index === focusOnIndex}
                                locale={this.props.accessConditionLocale}
                                genericSelectFieldId={`dsi-open-access-${index}`}
                                itemsList={FILE_ACCESS_OPTIONS}
                                displayEmpty
                                hideLabel
                                required
                                selectProps={{
                                    className: classes.selector,
                                    input: (
                                        <Input
                                            disableUnderline
                                            autoFocus={index === focusOnIndex}
                                            classes={{
                                                root: !!accessConditionId ? classes.selected : classes.placeholder,
                                            }}
                                        />
                                    ),
                                }}
                                formHelperTextProps={{
                                    className: classes.error,
                                }}
                                error={!accessConditionId && selectFields.accessCondition.errorMessage}
                                selectPrompt={selectFields.accessCondition.selectPrompt}
                            />
                        </Grid>
                    )}
                    {requireOpenAccessStatus && (
                        <Grid item sm={2}>
                            {((this.props.isAdmin && securityPolicy !== FILE_SECURITY_POLICY_PUBLIC) ||
                                (!this.props.isAdmin && accessConditionId !== FILE_ACCESS_CONDITION_OPEN)) && (
                                <Typography variant="body2" gutterBottom data-testid={`dsi-embargo-date-${index}`}>
                                    {embargoDateClosedAccess}
                                </Typography>
                            )}
                            {((this.props.isAdmin && securityPolicy === FILE_SECURITY_POLICY_PUBLIC) ||
                                (!this.props.isAdmin && accessConditionId === FILE_ACCESS_CONDITION_OPEN)) && (
                                <FileUploadEmbargoDate
                                    value={embargoDate}
                                    minDate={new Date()}
                                    onChange={this.props.onEmbargoDateChange}
                                    disabled={disabled}
                                    fileUploadEmbargoDateId={`dsi-embargo-date-${index}`}
                                />
                            )}
                        </Grid>
                    )}
                    <Grid item xs={1} className={classes.icon}>
                        <FileUploadRowStatus
                            disabled={disabled}
                            onDelete={this.props.onDelete}
                            name={name}
                            fileUploadRowStatusId={`dsi-dsid-${index}`}
                        />
                    </Grid>
                </Grid>
                <Grid container direction="row" alignItems="center" spacing={1} wrap={'nowrap'}>
                    <Grid item xs={1} className={classes.upDownArrowContainerBottom}>
                        <IconButton
                            id={`new-file-upload-down-${index}`}
                            data-analyticsid={`new-file-upload-down-${index}`}
                            data-testid={`new-file-upload-down-${index}`}
                            disabled={index === rowCount - 1}
                            className={classes.upDownArrow}
                            onClick={this.props.onOrderDownClick}
                        >
                            <ExpandMoreIcon />
                        </IconButton>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

const styles = () => ({
    icon: {
        textAlign: 'center',
    },
    row: {
        borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
        marginBottom: '12px',
    },
    selector: {
        maxWidth: 200,
        fontSize: 14,
    },
    securitySelector: {
        fontSize: 14,
    },
    placeholder: {
        color: 'rgba(0, 0, 0, 0.5)',
    },
    selected: {
        fontWeight: 400,
    },
    error: {
        marginTop: 0,
        fontSize: 10,
    },
    upDownArrowContainer: {
        padding: '0 0 0 10px !important',
        height: 30,
    },
    upDownArrow: {
        height: 30,
        padding: 0,
    },
    upDownArrowContainerBottom: {
        padding: '0 0 0 10px!important',
        height: 30,
        margin: '0 0 10px',
    },
});

export default withStyles(styles)(FileUploadRowDefaultView);
