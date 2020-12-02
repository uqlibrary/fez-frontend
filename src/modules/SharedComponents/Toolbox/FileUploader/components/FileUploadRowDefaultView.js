import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';

import FileUploadEmbargoDate from './FileUploadEmbargoDate';
import FileUploadRowStatus from './FileUploadRowStatus';

import { FILE_ACCESS_CONDITION_OPEN, FILE_ACCESS_OPTIONS, INHERIT_OPTION } from '../config';
import { selectFields } from 'locale/selectFields';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
import { withStyles } from '@material-ui/core/styles';
import { NewGenericSelectField } from 'modules/SharedComponents/GenericSelectField';

export class FileUploadRowDefaultView extends PureComponent {
    static propTypes = {
        index: PropTypes.number.isRequired,
        name: PropTypes.string,
        size: PropTypes.string,
        accessConditionId: PropTypes.number,
        embargoDate: PropTypes.string,
        requireOpenAccessStatus: PropTypes.bool.isRequired,
        disabled: PropTypes.bool,
        locale: PropTypes.object,
        classes: PropTypes.object,
        onDelete: PropTypes.func.isRequired,
        onEmbargoDateChange: PropTypes.func.isRequired,
        onAccessConditionChange: PropTypes.func.isRequired,
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
            requireOpenAccessStatus,
            accessConditionId,
            embargoDate,
            name,
            size,
            classes,
            focusOnIndex,
        } = this.props;

        return (
            <div style={{ flexGrow: 1, padding: 4 }} data-testid={this.props.fileUploadRowViewId}>
                <Grid container direction="row" alignItems="center" spacing={1} className={classes.row}>
                    <Grid item md={!requireOpenAccessStatus ? 11 : 6} sm={!requireOpenAccessStatus ? 11 : 5}>
                        <Typography variant="body2" gutterBottom noWrap data-testid={`dsi-dsid-${index}`}>
                            {name} ({size})
                        </Typography>
                    </Grid>
                    {requireOpenAccessStatus && (
                        <Fragment>
                            <Grid item md={3} sm={4}>
                                <NewGenericSelectField
                                    value={accessConditionId || ''}
                                    onChange={this.props.onAccessConditionChange}
                                    disabled={disabled}
                                    ref={`accessConditionSelector${index}`}
                                    autoFocus={index === focusOnIndex}
                                    locale={this.props.accessConditionLocale}
                                    genericSelectFieldId={`dsi-open-access-${index}`}
                                    itemsList={
                                        this.props.isAdmin
                                            ? [...FILE_ACCESS_OPTIONS, INHERIT_OPTION]
                                            : FILE_ACCESS_OPTIONS
                                    }
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
                            <Grid item md={2} sm={2}>
                                {accessConditionId !== FILE_ACCESS_CONDITION_OPEN && (
                                    <Typography variant="body2" gutterBottom data-testid={`dsi-embargo-date-${index}`}>
                                        {embargoDateClosedAccess}
                                    </Typography>
                                )}
                                {accessConditionId === FILE_ACCESS_CONDITION_OPEN && (
                                    <FileUploadEmbargoDate
                                        value={embargoDate}
                                        minDate={new Date()}
                                        onChange={this.props.onEmbargoDateChange}
                                        disabled={disabled}
                                        fileUploadEmbargoDateId={`dsi-embargo-date-${index}`}
                                    />
                                )}
                            </Grid>
                        </Fragment>
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
});

export default withStyles(styles)(FileUploadRowDefaultView);
