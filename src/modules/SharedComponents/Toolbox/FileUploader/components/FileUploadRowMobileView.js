import React, { PureComponent, Fragment } from 'react';
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
import withStyles from '@mui/styles/withStyles';

export class FileUploadRowMobileView extends PureComponent {
    static propTypes = {
        index: PropTypes.number.isRequired,
        name: PropTypes.string,
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
        onAccessConditionChange: PropTypes.func.isRequired,
        onSecurityPolicyChange: PropTypes.func.isRequired,
        focusOnIndex: PropTypes.number,
        accessConditionLocale: PropTypes.object,
        fileUploadRowViewId: PropTypes.string,
        isAdmin: PropTypes.bool,
    };

    static defaultProps = {
        locale: {
            filenameColumn: 'File name',
            fileAccessColumn: 'File access',
            embargoDateColumn: 'Embargo date',
            embargoDateClosedAccess: 'No date required',
        },
    };

    render() {
        const { filenameColumn, fileAccessColumn, embargoDateColumn, embargoDateClosedAccess } = this.props.locale;
        const {
            index,
            requireOpenAccessStatus,
            disabled,
            accessConditionId,
            embargoDate,
            securityPolicy,
            name,
            size,
            focusOnIndex,
            classes,
        } = this.props;

        return (
            <List classes={{ root: classes.root }} data-testid={this.props.fileUploadRowViewId}>
                <ListItem classes={{ root: classes.listItem }}>
                    <ListItemIcon>
                        <Attachment />
                    </ListItemIcon>
                    <ListItemText
                        primary={`${name} (${size})`}
                        secondary={filenameColumn}
                        primaryTypographyProps={{ variant: 'body1', noWrap: true }}
                        secondaryTypographyProps={{ variant: 'caption' }}
                        data-analyticsid={`dsi-dsid-${index}`}
                        data-testid={`dsi-dsid-${index}`}
                    />
                </ListItem>
                {requireOpenAccessStatus && (
                    <Fragment>
                        <ListItem classes={{ root: classes.listItem }}>
                            <ListItemIcon>
                                <LockOutlined />
                            </ListItemIcon>
                            <ListItemText
                                secondary={fileAccessColumn}
                                secondaryTypographyProps={{ variant: 'caption' }}
                            >
                                {!!this.props.isAdmin && requireOpenAccessStatus && (
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
                                )}
                                {!!!this.props.isAdmin && (
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
                                                        root: !!accessConditionId
                                                            ? classes.selected
                                                            : classes.placeholder,
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
                                )}
                            </ListItemText>
                        </ListItem>
                        <ListItem classes={{ root: classes.listItem }}>
                            <ListItemIcon>
                                <CalendarTodayOutlined />
                            </ListItemIcon>
                            <ListItemText
                                secondary={embargoDateColumn}
                                primaryTypographyProps={{ variant: 'body1' }}
                                secondaryTypographyProps={{ variant: 'caption' }}
                            >
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
                                        onChange={this.props.onEmbargoDateChange}
                                        disabled={disabled}
                                        minDate={new Date()}
                                        fileUploadEmbargoDateId={`dsi-embargo-date-${index}`}
                                    />
                                )}
                            </ListItemText>
                            <ListItemSecondaryAction classes={{ root: classes.secondaryAction }}>
                                <FileUploadRowStatus
                                    disabled={this.props.disabled}
                                    onDelete={this.props.onDelete}
                                    name={name}
                                    fileUploadRowStatusId={`dsi-dsid-${index}`}
                                />
                            </ListItemSecondaryAction>
                        </ListItem>
                    </Fragment>
                )}
            </List>
        );
    }
}

const styles = theme => ({
    root: {
        borderBottom: `1px solid ${theme.palette.secondary.light}`,
    },
    listItem: {
        paddingLeft: 0,
        paddingRight: 0,
    },
    secondaryAction: {
        textAlign: 'center',
    },
});

export default withStyles(styles)(FileUploadRowMobileView);
