import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {ConfirmDialogBox} from '../../ConfirmDialogBox';
import {Grid, Typography, IconButton, Tooltip} from '@material-ui/core';
import DeleteForever from '@material-ui/icons/DeleteForever';
import {withStyles} from '@material-ui/core/styles';

export class ListRowHeader extends Component {
    static propTypes = {
        onDeleteAll: PropTypes.func.isRequired,
        locale: PropTypes.object,
        disabled: PropTypes.bool,
        hideReorder: PropTypes.bool,
        classes: PropTypes.object
    };

    static defaultProps = {
        locale: {
            nameColumn: 'Name',
            reorderColumn: 'Reorder items',
            deleteAll: 'Remove all items',
            deleteAllConfirmation: {
                confirmationTitle: 'Delete all',
                confirmationMessage: 'Are you sure you want to delete all items?',
                cancelButtonLabel: 'No',
                confirmButtonLabel: 'Yes'
            }
        }
    };

    constructor(props) {
        super(props);
    }

    showConfirmation = () => {
        this.confirmationBox.showConfirmation();
    }

    render() {
        const {nameColumn, reorderColumn, deleteAll, deleteAllConfirmation} = this.props.locale;
        const {disabled, hideReorder, classes} = this.props;

        return (
            <div style={{flexGrow: 1, padding: 8}}>
                <ConfirmDialogBox
                    onRef={ref => (this.confirmationBox = ref)}
                    onAction={this.props.onDeleteAll}
                    locale={deleteAllConfirmation}
                />
                <Grid container alignItems="center" alignContent="center" spacing={16} className={classes.header}>
                    <Grid item xs={hideReorder ? 11 : 9}><Typography variant="caption">{nameColumn}</Typography></Grid>
                    {
                        !hideReorder &&
                        <Grid item xs={2} className={classes.center}>
                            <Typography variant="caption">{reorderColumn}</Typography>
                        </Grid>
                    }
                    <Grid item xs={1} className={classes.center}>
                        <Tooltip title={deleteAll}>
                            <IconButton onClick={this.showConfirmation} disabled={disabled}>
                                <DeleteForever/>
                            </IconButton>
                        </Tooltip>
                    </Grid>
                </Grid>
            </div>
        );
    }
}
const styles = () => ({
    center: {
        textAlign: 'center'
    },
    header: {
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
    }
});

export default withStyles(styles)(ListRowHeader);
