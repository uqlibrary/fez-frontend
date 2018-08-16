import React, {PureComponent, Fragment} from 'react';
import PropTypes from 'prop-types';

import FileUploadAccessSelector from './FileUploadAccessSelector';
import FileUploadEmbargoDate from './FileUploadEmbargoDate';
import FileUploadRowStatus from './FileUploadRowStatus';

import * as config from '../config';

import {Grid, Typography} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';

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
        onAccessConditionChange: PropTypes.func.isRequired
    };

    static defaultProps = {
        locale: {
            embargoDateClosedAccess: 'No date required',
        }
    };

    render() {
        const {embargoDateClosedAccess} = this.props.locale;
        const {disabled, index, requireOpenAccessStatus, accessConditionId, embargoDate, name, size} = this.props;

        return (
            <Grid container direction="row" alignItems="center" spacing={8}>
                <Grid item md={6} sm={5}>
                    <Typography variant="body1" gutterBottom noWrap>
                        {name} ({size})
                    </Typography>
                </Grid>
                {
                    requireOpenAccessStatus &&
                    <Fragment>
                        <Grid item md={3} sm={4}>
                            <FileUploadAccessSelector
                                value={accessConditionId}
                                onChange={this.props.onAccessConditionChange}
                                disabled={disabled}
                                ref={`accessConditionSelector${index}`}
                            />
                        </Grid>
                        <Grid item md={2} sm={2}>
                            {
                                accessConditionId !== config.OPEN_ACCESS_ID &&
                                <Typography variant="body1" gutterBottom>{embargoDateClosedAccess}</Typography>
                            }
                            {
                                accessConditionId === config.OPEN_ACCESS_ID &&
                                <FileUploadEmbargoDate
                                    value={new Date(embargoDate)}
                                    onChange={this.props.onEmbargoDateChange}
                                    disabled={disabled}
                                />
                            }
                        </Grid>
                    </Fragment>
                }
                <Grid item xs={1} className={this.props.classes.icon}>
                    <FileUploadRowStatus disabled={this.props.disabled} onDelete={this.props.onDelete} />
                </Grid>
            </Grid>
        );
    }
}

const styles = () => ({
    icon: {
        textAlign: 'center'
    }
});

export default withStyles(styles)(FileUploadRowDefaultView);
